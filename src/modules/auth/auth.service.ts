import { Injectable, UnauthorizedException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { AppKeyService } from '../../core/app-key/app-key.service';
import * as bcrypt from 'bcryptjs';
const { generateSecret, generateURI, verify } = require('otplib');
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private cryptoService: CryptoService,
    private configService: ConfigService,
    private appKeyService: AppKeyService,
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
}
