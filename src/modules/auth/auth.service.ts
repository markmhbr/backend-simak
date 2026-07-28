import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { AppKeyService } from '../../core/app-key/app-key.service';
import * as bcrypt from 'bcryptjs';
const { generateSecret, generateURI, verify } = require('otplib');
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../core/mail/mail.service';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
    private configService: ConfigService,
    private appKeyService: AppKeyService,
    private mailService: MailService,
  ) {}

  /**
   * Tahap 1: Validasi Email/Username dan Password
   */
  async validateUser(username: string, pass: string, sekolahId?: string) {
    const user = await this.prisma.pengguna.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username },
        ],
      },
    });

    if (!user) {
      console.log(`[Login Failed] User not found: ${username}`);
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    // MULTI-TENANT CHECK:
    if (sekolahId) {
      // Mencegah Super Admin login di portal sekolah (jika sekolahId ada dari API Key)
      if (user.peran_nama === 'Super Admin' || user.sekolah_id === null) {
        throw new UnauthorizedException('Super Admin hanya dapat login melalui portal pusat. Silakan hapus data sekolah di browser Anda atau gunakan akun sekolah.');
      }

      if (user.sekolah_id !== sekolahId) {
        console.log(`[Login Failed] School ID mismatch for user ${username}. User School: ${user.sekolah_id}, Request School: ${sekolahId}`);
        throw new UnauthorizedException('Akun Anda tidak terdaftar di sekolah ini');
      }
    } else {
      // Login tanpa API Key hanya untuk Super Admin
      if (user.peran_nama !== 'Super Admin' || user.sekolah_id !== null) {
        throw new UnauthorizedException('Silakan login melalui portal sekolah Anda.');
      }
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    
    if (!isMatch) {
      console.log(`[Login Failed] Password mismatch for user ${username}`);
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    // Bypass 2FA untuk Super Admin (hanya jika di portal pusat)
    if (user.peran_nama === 'Super Admin') {
      const role = 'Super Admin';
      const tokens = await this.generateTokens(user, role);
      return {
        requires2FA: false,
        ...tokens
      };
    }

    // Cek apakah user sudah set 2FA
    const payload = { sub: user.pengguna_id, type: '2fa_pending', sekolahId };
    const tempToken = this.jwtService.sign(payload, { 
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '10m' 
    });

    if (!user.google2fa_secret) {
      // Generate secret baru jika belum ada
      const secret = generateSecret();
      const otpauthUrl = generateURI({
        label: user.email || user.username,
        issuer: 'SIMAK',
        secret
      });

      return {
        requires2FA: true,
        is2FASetup: false,
        tempToken,
        qrCodeUrl: otpauthUrl, // Frontend bisa convert ke QR
        secret: secret // Tampilkan untuk backup
      };
    }

    return {
      requires2FA: true,
      is2FASetup: true,
      tempToken
    };
  }

  /**
   * Trial: Login menggunakan Face ID (Bypass 2FA)
   */
  async loginWithFaceId(embedding: number[], sekolahId: string) {
    if (!sekolahId) {
      throw new BadRequestException('Sekolah ID diperlukan');
    }

    const users = await this.prisma.pengguna.findMany({
      where: {
        sekolah_id: sekolahId,
        face_embedding: { not: null },
      },
    });

    let bestMatch: any = null;
    let highestSimilarity = 0;

    for (const user of users) {
      if (!user.face_embedding) continue;
      try {
        const registeredEmbedding = JSON.parse(user.face_embedding);
        
        let dotProduct = 0;
        let normV1 = 0;
        let normV2 = 0;
        for (let i = 0; i < embedding.length; i++) {
          dotProduct += embedding[i] * registeredEmbedding[i];
          normV1 += embedding[i] * embedding[i];
          normV2 += registeredEmbedding[i] * registeredEmbedding[i];
        }
        const similarity = (normV1 === 0 || normV2 === 0) ? 0 : dotProduct / (Math.sqrt(normV1) * Math.sqrt(normV2));

        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          bestMatch = user;
        }
      } catch (e) {
        console.error('Failed to parse embedding for user:', user.pengguna_id, e);
      }
    }

    const threshold = 0.80;
    if (bestMatch && highestSimilarity >= threshold) {
      const role = await this.determineRole(bestMatch);
      const tokens = await this.generateTokens(bestMatch, role);
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: tokens.user,
      };
    }

    throw new UnauthorizedException('Identifikasi wajah gagal atau wajah tidak terdaftar');
  }


  /**
   * Tahap 2: Verifikasi Kode 2FA
   */
  async verify2FA(tempToken: string, code: string, secretToSave?: string) {
    try {
      const payload = this.jwtService.verify(tempToken, {
        secret: this.configService.get('JWT_SECRET')
      });
      if (payload.type !== '2fa_pending') {
        throw new UnauthorizedException('Token tidak valid');
      }

      const user = await this.prisma.pengguna.findUnique({
        where: { pengguna_id: payload.sub },
      });

      if (!user) throw new UnauthorizedException('User tidak ditemukan');

      let secret: string;

      if (!user.google2fa_secret) {
        if (!secretToSave) {
          throw new UnauthorizedException('Setup 2FA belum selesai');
        }
        secret = secretToSave;
      } else {
        // Dekripsi secret key yang tersimpan
        secret = this.cryptoService.decrypt(user.google2fa_secret);
      }

      // Verifikasi kode TOTP
      // Kita tambahkan window: 1 (mengizinkan kode dari 30 detik sebelum/sesudah) 
      // untuk toleransi perbedaan waktu antara server dan HP
      const result = await verify({
        token: code,
        secret: secret,
        window: 1,
      });

      if (!result || !result.valid) {
        console.log(`[2FA Failed] Invalid code for user ${user.username}. Code: ${code}`);
        throw new UnauthorizedException('Kode 2FA tidak valid');
      }

      // Jika valid dan ini setup pertama kali, simpan secret terenkripsi
      if (!user.google2fa_secret && secretToSave) {
        const encryptedSecret = this.cryptoService.encrypt(secretToSave);
        await this.prisma.pengguna.update({
          where: { pengguna_id: user.pengguna_id },
          data: { google2fa_secret: encryptedSecret }
        });
      }

      // Jika valid, tentukan role dan buat token final
      const role = await this.determineRole(user);
      return this.generateTokens(user, role);
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      console.error('2FA Error:', error);
      throw new UnauthorizedException('Verifikasi 2FA gagal');
    }
  }

  /**
   * Menentukan Role berdasarkan peran_id_str dan data GTK/Peserta Didik
   */
  private async determineRole(user: any): Promise<string> {
    const peran = user.peran_nama || user.peran_id_str || '';
    
    // Jika peran di pengguna adalah Operator Sekolah, prioritas utama
    if (user.peran_id === 10 || peran === 'Operator Sekolah') {
      return 'Operator Sekolah';
    }
    
    // Jika peran di pengguna sudah Kepala Sekolah, gunakan itu
    if (peran === 'Kepala Sekolah') {
      return 'Kepala Sekolah';
    }
    
    // 1. Jika ada ptk_id, prioritas ambil dari jenis PTK GTK
    if (user.ptk_id) {
      const gtk = await this.prisma.gtk.findUnique({
        where: { ptk_id: user.ptk_id },
      });

      if (gtk && gtk.jenis_ptk_id) {
        const jPtk = await this.prisma.jenis_ptk.findUnique({
          where: { jenis_ptk_id: gtk.jenis_ptk_id },
        });
        if (jPtk) {
          return jPtk.jenis_ptk;
        }
      }
      
      // Jika ada ptk_id tapi jenis_ptk_id tidak ditemukan, arahkan ke admin
      return 'Admin';
    }

    // 2. Jika ada peserta_didik_id, maka dia Peserta Didik
    if (user.peserta_didik_id) {
      return 'Peserta Didik';
    }

    // 3. Untuk peran lain (Admin, Super Admin, dll), gunakan peran dari database langsung
    return peran || 'User';
  }

  /**
   * Membuat Access Token dan Refresh Token
   */
  private async generateTokens(user: any, role: string) {
    const payload = { 
      sub: user.pengguna_id, 
      email: user.email, 
      role: role,
      sekolahId: user.sekolah_id,
      ptkId: user.ptk_id
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
    });

    let foto: string | null = null;
    if (user.ptk_id) {
      const gtk = await this.prisma.gtk.findUnique({
        where: { ptk_id: user.ptk_id },
        select: { foto: true }
      });
      foto = gtk?.foto || null;
    } else if (user.peserta_didik_id) {
      const pd = await this.prisma.pesertaDidik.findUnique({
        where: { peserta_didik_id: user.peserta_didik_id },
        select: { foto: true }
      });
      foto = pd?.foto || null;
    }

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.pengguna_id,
        nama: user.nama,
        email: user.email,
        role: role,
        ptk_id: user.ptk_id,
        peserta_didik_id: user.peserta_didik_id,
        foto: foto,
      },
    };
  }
  async getSystemInfo(currentDomain: string) {
    const matchingKey = await this.appKeyService.findByDomain(currentDomain);
    const activeKey = await this.prisma.appKey.findFirst({
      where: { is_active: true }
    });

    return {
      isConfigured: !!matchingKey,
      registeredDomain: matchingKey ? matchingKey.domain : (activeKey?.domain || null)
    };
  }

  /**
   * Setup awal API Key oleh Operator
   */
  async setupSystem(apiKey: string, domain: string) {
    if (!apiKey) throw new UnauthorizedException('API Key wajib diisi');

    // Cek apakah Key ini sudah dipakai di domain lain
    const existingKey = await this.prisma.appKey.findUnique({
      where: { key_api: apiKey }
    });

    if (existingKey) {
      // Jika key sudah ada, kita update domainnya (Kasus pindah domain)
      return await this.appKeyService.updateSchoolDomain(existingKey.sekolah_id, domain);
    }

    // Cek apakah sudah ada AppKey terdaftar di sistem ini
    const currentKey = await this.prisma.appKey.findFirst();
    if (currentKey) {
      // Jika sudah ada key sebelumnya, kita timpa key_api dan domainnya agar sekolah_id tidak berubah
      await this.appKeyService.updateSchoolDomain(currentKey.sekolah_id, domain);
      return await this.prisma.appKey.update({
        where: { id: currentKey.id },
        data: { key_api: apiKey }
      });
    }

    // Jika key benar-benar baru di sistem ini, hapus data lama dan buat baru
    await this.prisma.appKey.deleteMany({});

    return await this.prisma.appKey.create({
      data: {
        nama_app: 'SIMAK School Instance',
        key_api: apiKey,
        domain: domain,
        sekolah_id: '00000000-0000-0000-0000-000000000000', // Placeholder
        is_active: true
      }
    });
  }

/**
 * Refresh Access Token menggunakan Refresh Token
...
   */
  async refreshTokens(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.prisma.pengguna.findUnique({
        where: { pengguna_id: payload.sub },
      });

      if (!user) throw new UnauthorizedException();

      const role = await this.determineRole(user);
      return this.generateTokens(user, role);
    } catch (e) {
      throw new UnauthorizedException('Sesi telah berakhir, silakan login kembali');
    }
  }

  async reset2FA(body: { ptk_id?: string; peserta_didik_id?: string; pengguna_id?: string }) {
    const { ptk_id, peserta_didik_id, pengguna_id } = body;

    let targetUser = null;

    if (pengguna_id) {
      targetUser = await this.prisma.pengguna.findUnique({
        where: { pengguna_id },
      });
    } else if (ptk_id) {
      targetUser = await this.prisma.pengguna.findFirst({
        where: { ptk_id },
      });
    } else if (peserta_didik_id) {
      targetUser = await this.prisma.pengguna.findFirst({
        where: { peserta_didik_id },
      });
    }

    if (!targetUser) {
      throw new BadRequestException('Pengguna tidak ditemukan');
    }

    await this.prisma.pengguna.update({
      where: { pengguna_id: targetUser.pengguna_id },
      data: { google2fa_secret: null },
    });

    return { status: 'success', message: 'Authenticator berhasil diset ulang' };
  }

  async getMe(penggunaId: string) {
    const user = await this.prisma.pengguna.findUnique({
      where: { pengguna_id: penggunaId },
      select: {
        pengguna_id: true,
        sekolah_id: true,
        username: true,
        nama: true,
        email: true,
        peran_nama: true,
        peran_id: true,
        alamat: true,
        no_telepon: true,
        no_hp: true,
        ptk_id: true,
        peserta_didik_id: true,
      }
    });
    if (!user) throw new BadRequestException('Pengguna tidak ditemukan');

    let foto: string | null = null;
    if (user.ptk_id) {
      const gtk = await this.prisma.gtk.findUnique({
        where: { ptk_id: user.ptk_id },
        select: { foto: true }
      });
      foto = gtk?.foto || null;
    } else if (user.peserta_didik_id) {
      const pd = await this.prisma.pesertaDidik.findUnique({
        where: { peserta_didik_id: user.peserta_didik_id },
        select: { foto: true }
      });
      foto = pd?.foto || null;
    }

    return {
      ...user,
      foto,
    };
  }

  async requestReset2FA(username: string, pass: string, sekolahId?: string) {
    // 1. Cari user berdasarkan username/email
    const user = await this.prisma.pengguna.findFirst({
      where: {
        OR: [
          { username: username },
          { email: username },
        ],
      },
    });

    if (!user) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    // Multi-tenant check jika sekolahId ada
    if (sekolahId && user.sekolah_id && user.sekolah_id !== sekolahId) {
      throw new UnauthorizedException('Akun Anda tidak terdaftar di sekolah ini');
    }

    // 2. Cek password
    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Kredensial tidak valid');
    }

    // 3. Tentukan email berdasarkan ptk/peserta didik
    let email: string | null = null;
    let name = user.nama || user.username;

    if (user.ptk_id) {
      const gtk = await this.prisma.gtk.findUnique({
        where: { ptk_id: user.ptk_id },
        select: { email: true, nama: true }
      });
      if (gtk?.email) {
        email = gtk.email;
      }
      if (gtk?.nama) {
        name = gtk.nama;
      }
    } else if (user.peserta_didik_id) {
      const pd = await this.prisma.pesertaDidik.findUnique({
        where: { peserta_didik_id: user.peserta_didik_id },
        select: { email_aktif: true, nama: true }
      });
      if (pd?.email_aktif) {
        email = pd.email_aktif;
      }
      if (pd?.nama) {
        name = pd.nama;
      }
    }

    // Fallback ke email dari pengguna
    if (!email) {
      email = user.email;
    }

    if (!email || email.trim() === '') {
      throw new BadRequestException('Email tidak terdaftar pada akun Anda. Silakan hubungi admin sekolah Anda.');
    }

    // 4. Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Hash OTP
    const salt = await bcrypt.genSalt(10);
    const otpHash = await bcrypt.hash(otp, salt);

    // 6. Kirim email OTP
    const emailSent = await this.mailService.sendOTP(email, otp, name);
    if (!emailSent) {
      throw new BadRequestException('Gagal mengirimkan kode OTP ke email Anda. Silakan coba beberapa saat lagi.');
    }

    // 7. Sign JWT berisi reset token (berlaku 10 menit)
    const resetToken = this.jwtService.sign(
      { sub: user.pengguna_id, otpHash, type: 'reset_2fa' },
      { secret: this.configService.get('JWT_SECRET'), expiresIn: '10m' }
    );

    // Mask email for security (e.g. ad***@domain.com)
    const emailParts = email.split('@');
    const maskedLocal = emailParts[0].length > 2 
      ? emailParts[0].substring(0, 2) + '***'
      : emailParts[0] + '***';
    const maskedEmail = `${maskedLocal}@${emailParts[1]}`;

    return {
      status: 'success',
      message: `Kode OTP verifikasi telah dikirim ke email: ${maskedEmail}`,
      resetToken,
    };
  }

  async verifyReset2FA(resetToken: string, code: string) {
    try {
      // 1. Verifikasi JWT
      const payload = this.jwtService.verify(resetToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      if (payload.type !== 'reset_2fa') {
        throw new UnauthorizedException('Token reset tidak valid');
      }

      // 2. Bandingkan OTP
      const isMatch = await bcrypt.compare(code, payload.otpHash);
      if (!isMatch) {
        throw new UnauthorizedException('Kode OTP yang Anda masukkan salah');
      }

      // 3. Reset google2fa_secret di DB
      await this.prisma.pengguna.update({
        where: { pengguna_id: payload.sub },
        data: { google2fa_secret: null },
      });

      return {
        status: 'success',
        message: 'Autentikasi Dua Faktor (2FA) berhasil diset ulang. Silakan masuk kembali.',
      };
    } catch (e: any) {
      if (e instanceof UnauthorizedException) throw e;
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Sesi reset 2FA telah berakhir (Expired). Silakan ajukan ulang.');
      }
      throw new UnauthorizedException('Verifikasi reset 2FA gagal');
    }
  }

  private buildAlamat(data: {
    alamat_jalan?: string | null;
    rt?: any | null;
    rw?: any | null;
    nama_dusun?: string | null;
    desa_kelurahan?: string | null;
    kode_pos?: string | null;
  }) {
    const parts: string[] = [];
    if (data.alamat_jalan) parts.push(data.alamat_jalan.trim());
    
    const rtVal = data.rt ? String(data.rt).trim() : '';
    const rwVal = data.rw ? String(data.rw).trim() : '';
    if (rtVal || rwVal) {
      parts.push(`RT ${rtVal || '-'}/RW ${rwVal || '-'}`);
    }
    
    if (data.nama_dusun) parts.push(`Dusun ${data.nama_dusun.trim()}`);
    if (data.desa_kelurahan) parts.push(`Desa/Kel. ${data.desa_kelurahan.trim()}`);
    if (data.kode_pos) parts.push(`Kode Pos ${data.kode_pos.trim()}`);
    
    return parts.length > 0 ? parts.join(', ') : '-';
  }

  async getPublicProfile(id: string) {
    // 1. Cek di tabel Peserta Didik
    const pd = await this.prisma.pesertaDidik.findFirst({
      where: {
        OR: [
          { peserta_didik_id: id },
          { qr_token: { endsWith: id } }
        ]
      },
      include: {
        rombongan_belajar: true,
      },
    });

    if (pd) {
      const sekolah = await this.prisma.sekolah.findUnique({
        where: { sekolah_id: pd.sekolah_id },
        select: { nama: true },
      });

      return {
        id: pd.peserta_didik_id,
        nama: pd.nama,
        tipe: 'siswa',
        rombel: pd.rombongan_belajar?.nama || '-',
        sekolah: sekolah?.nama || '-',
        hasFoto: !!pd.foto,
        alamat: this.buildAlamat(pd),
      };
    }

    // 2. Cek di tabel GTK
    const gtk = await this.prisma.gtk.findFirst({
      where: {
        OR: [
          { ptk_id: id },
          { qr_token: { endsWith: id } }
        ]
      },
      include: {
        jenis_ptk: true,
      },
    });

    if (gtk) {
      const sekolah = await this.prisma.sekolah.findUnique({
        where: { sekolah_id: gtk.sekolah_id },
        select: { nama: true },
      });

      return {
        id: gtk.ptk_id,
        nama: gtk.nama,
        tipe: 'gtk',
        rombel: gtk.jenis_ptk?.jenis_ptk || 'Guru/Staf',
        sekolah: sekolah?.nama || '-',
        hasFoto: !!gtk.foto,
        alamat: this.buildAlamat(gtk),
      };
    }

    throw new NotFoundException('Data tidak ditemukan');
  }

  async getPublicProfilePhoto(id: string, res: Response) {
    let fotoPath: string | null = null;

    // Cek Peserta Didik
    const pd = await this.prisma.pesertaDidik.findFirst({
      where: {
        OR: [
          { peserta_didik_id: id },
          { qr_token: { endsWith: id } }
        ]
      },
      select: { foto: true }
    });

    if (pd) {
      fotoPath = pd.foto;
    } else {
      // Cek GTK
      const gtk = await this.prisma.gtk.findFirst({
        where: {
          OR: [
            { ptk_id: id },
            { qr_token: { endsWith: id } }
          ]
        },
        select: { foto: true }
      });
      if (gtk) {
        fotoPath = gtk.foto;
      }
    }

    if (fotoPath) {
      let cleanPath = fotoPath;
      if (cleanPath.startsWith('/storage/')) {
        cleanPath = cleanPath.substring(9);
      } else if (cleanPath.startsWith('storage/')) {
        cleanPath = cleanPath.substring(8);
      }
      const sanitizedPath = path.normalize(cleanPath).replace(/^(\.\.(\/|\\))+/, '');
      const fullPath = path.join(process.cwd(), 'storage', sanitizedPath);

      if (fs.existsSync(fullPath)) {
        res.setHeader('Cache-Control', 'public, max-age=86400');
        return res.sendFile(fullPath);
      }
    }

    const placeholderPath = path.join(process.cwd(), 'storage', 'default-avatar.png');
    if (fs.existsSync(placeholderPath)) {
      return res.sendFile(placeholderPath);
    }

    throw new NotFoundException('Foto tidak ditemukan');
  }
}
