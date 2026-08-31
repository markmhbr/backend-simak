import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AppKeyService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Menghasilkan string acak aman (secure random token)
   */
  private generateSecureToken(prefix: 'api' | 'ws' | 'adm'): string {
    const randomBuffer = crypto.randomBytes(24);
    const token = randomBuffer.toString('hex');
    return `simak_${prefix}_${token}`;
  }

  /**
   * Memvalidasi apakah key_api ada dan aktif di database
   */
  async validateApiKey(keyApi: string) {
    if (!keyApi) return null;
    const appKey = await this.prisma.appKey.findFirst({
      where: {
        OR: [
          { key_api: keyApi },
          { key_webService: keyApi },
        ],
      },
    });
    if (appKey && appKey.is_active) {
      return appKey;
    }
    return null;
  }

  async findByDomain(domain: string) {
    const appKey = await this.prisma.appKey.findFirst({
      where: {
        OR: [
          { domain: domain },
          { domain: `http://${domain}` },
          { domain: `https://${domain}` },
          { domain: `http://${domain}/` },
          { domain: `https://${domain}/` },
        ],
        is_active: true
      },
    });
    return appKey;
  }

  /**
   * Membuat entitas AppKey baru di database
   */
  async createKey(namaApp: string, sekolahId: string) {
    const existing = await this.prisma.appKey.findUnique({
      where: { sekolah_id: sekolahId },
    });
    if (existing) {
      throw new Error(`Sekolah ID ${sekolahId} sudah terdaftar atas nama: "${existing.nama_app}". Satu sekolah hanya boleh memiliki satu Key!`);
    }

    const keyApi = this.generateSecureToken('api');

    return await this.prisma.appKey.create({
      data: {
        nama_app: namaApp,
        sekolah_id: sekolahId,
        key_api: keyApi,
        key_webService: null,
        key_adminPanel: null,
        is_active: true,
      },
    });
  }

  /**
   * Menyimpan / mengupdate key_webService dari hasil POST klien
   */
  async updateWebServiceKey(sekolahId: string, keyWs: string) {
    return await this.prisma.appKey.update({
      where: { sekolah_id: sekolahId },
      data: { key_webService: keyWs },
    });
  }

  /**
   * Menyimpan / mengupdate key_adminPanel dari hasil POST admin
   */
  async updateAdminPanelKey(sekolahId: string, keyAdm: string) {
    return await this.prisma.appKey.update({
      where: { sekolah_id: sekolahId },
      data: { key_adminPanel: keyAdm },
    });
  }

  /**
   * Menampilkan semua key yang terdaftar beserta informasi nama sekolah
   */
  async getAllKeys(search?: string) {
    const keys = await this.prisma.appKey.findMany({
      orderBy: { created_at: 'desc' },
    });

    const sekolahIds = keys.map((k) => k.sekolah_id).filter(Boolean);
    const sekolahList = await this.prisma.sekolah.findMany({
      where: {
        sekolah_id: { in: sekolahIds },
      },
      select: {
        sekolah_id: true,
        nama: true,
        npsn: true,
      },
    });

    const sekolahMap = new Map(sekolahList.map((s) => [s.sekolah_id, s]));

    const result = keys.map((k) => {
      const s = sekolahMap.get(k.sekolah_id);
      return {
        ...k,
        nama_sekolah: s?.nama || null,
        npsn: s?.npsn || null,
      };
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      return result.filter(
        (k) =>
          (k.nama_sekolah && k.nama_sekolah.toLowerCase().includes(q)) ||
          (k.nama_app && k.nama_app.toLowerCase().includes(q)) ||
          (k.sekolah_id && k.sekolah_id.toLowerCase().includes(q)) ||
          (k.npsn && k.npsn.toLowerCase().includes(q)) ||
          (k.domain && k.domain.toLowerCase().includes(q)) ||
          (k.id && k.id.toLowerCase().includes(q))
      );
    }

    return result;
  }

  /**
   * Mengganti/me-reset key_api untuk ID tertentu (Hanya Key API)
   */
  async regenerateKeys(id: string) {
    const existing = await this.prisma.appKey.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`AppKey dengan ID ${id} tidak ditemukan`);
    }

    const keyApi = this.generateSecureToken('api');

    return await this.prisma.appKey.update({
      where: { id },
      data: {
        key_api: keyApi,
        // key_webService dan key_adminPanel tetap menggunakan yang lama
      },
    });
  }

  /**
   * Mengupdate domain sekolah dan memperbarui semua QR Token siswa & GTK
   */
  async updateSchoolDomain(sekolahId: string, domain: string) {
    let cleanDomain = domain.replace(/\/+$/, ''); // Hapus trailing slash
    
    // Pastikan ada protokol http:// atau https:// (localhost menggunakan http://)
    if (cleanDomain.includes('localhost') || cleanDomain.includes('127.0.0.1')) {
      cleanDomain = cleanDomain.replace(/^https:\/\//, 'http://');
      if (!cleanDomain.startsWith('http://')) {
        cleanDomain = `http://${cleanDomain}`;
      }
    } else {
      if (!cleanDomain.startsWith('http://') && !cleanDomain.startsWith('https://')) {
        cleanDomain = `https://${cleanDomain}`;
      }
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Update domain di AppKey
      const updatedKey = await tx.appKey.update({
        where: { sekolah_id: sekolahId },
        data: { domain: cleanDomain },
      });

      // 2. Update massal qr_token di PesertaDidik (format: sekolah_id/uuid)
      await tx.$executeRaw`
        UPDATE dapodik.peserta_didik 
        SET qr_token = ${sekolahId} || '/' || peserta_didik_id::text
        WHERE sekolah_id = ${sekolahId}::uuid
      `;

      // 3. Update massal qr_token di Gtk (format: sekolah_id/uuid)
      await tx.$executeRaw`
        UPDATE dapodik.gtks 
        SET qr_token = ${sekolahId} || '/' || ptk_id::text
        WHERE sekolah_id = ${sekolahId}::uuid
      `;

      return updatedKey;
    });
  }

  /**
   * Mengaktifkan atau menonaktifkan key
   */
  async toggleActive(id: string) {
    const existing = await this.prisma.appKey.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`AppKey dengan ID ${id} tidak ditemukan`);
    }

    return await this.prisma.appKey.update({
      where: { id },
      data: {
        is_active: !existing.is_active,
      },
    });
  }
}
