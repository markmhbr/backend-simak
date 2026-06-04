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
   * Menampilkan semua key yang terdaftar
   */
  async getAllKeys() {
    return await this.prisma.appKey.findMany({
      orderBy: { created_at: 'desc' },
    });
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
