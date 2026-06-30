import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class PengaturanUmumService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(sekolahId: string) {
    let settings = await this.prisma.pengaturanUmum.findUnique({
      where: { sekolah_id: sekolahId },
    });

    if (!settings) {
      // Return defaults if not configured yet
      return {
        sekolah_id: sekolahId,
        background_gtk: null,
        background_pd: null,
        waktu_mulai_pengajuan: null,
        waktu_sampai_pengajuan: null,
      };
    }

    return settings;
  }

  async updateSettings(sekolahId: string, data: {
    background_gtk?: string | null;
    background_pd?: string | null;
    waktu_mulai_pengajuan?: string | null;
    waktu_sampai_pengajuan?: string | null;
  }) {
    return this.prisma.pengaturanUmum.upsert({
      where: { sekolah_id: sekolahId },
      update: {
        background_gtk: data.background_gtk,
        background_pd: data.background_pd,
        waktu_mulai_pengajuan: data.waktu_mulai_pengajuan,
        waktu_sampai_pengajuan: data.waktu_sampai_pengajuan,
      },
      create: {
        sekolah_id: sekolahId,
        background_gtk: data.background_gtk,
        background_pd: data.background_pd,
        waktu_mulai_pengajuan: data.waktu_mulai_pengajuan,
        waktu_sampai_pengajuan: data.waktu_sampai_pengajuan,
      },
    });
  }
}
