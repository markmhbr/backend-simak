import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class PengaturanUmumService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await this.prisma.$executeRawUnsafe(`
        ALTER TABLE simak.pengaturan_umum 
        ADD COLUMN IF NOT EXISTS mode_presensi_guru SMALLINT DEFAULT 0;
      `);
    } catch (err) {
      // Ignore if table/column already configured
    }
  }

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
        mode_presensi_guru: 0,
      };
    }

    return settings;
  }

  async updateSettings(sekolahId: string, data: {
    background_gtk?: string | null;
    background_pd?: string | null;
    waktu_mulai_pengajuan?: string | null;
    waktu_sampai_pengajuan?: string | null;
    mode_presensi_guru?: number | null;
  }) {
    const updated = await this.prisma.pengaturanUmum.upsert({
      where: { sekolah_id: sekolahId },
      update: {
        background_gtk: data.background_gtk,
        background_pd: data.background_pd,
        waktu_mulai_pengajuan: data.waktu_mulai_pengajuan,
        waktu_sampai_pengajuan: data.waktu_sampai_pengajuan,
        mode_presensi_guru: data.mode_presensi_guru !== undefined ? data.mode_presensi_guru : undefined,
      },
      create: {
        sekolah_id: sekolahId,
        background_gtk: data.background_gtk,
        background_pd: data.background_pd,
        waktu_mulai_pengajuan: data.waktu_mulai_pengajuan,
        waktu_sampai_pengajuan: data.waktu_sampai_pengajuan,
        mode_presensi_guru: data.mode_presensi_guru ?? 0,
      },
    });

    if (data.mode_presensi_guru !== undefined && data.mode_presensi_guru !== null) {
      await this.prisma.gtk.updateMany({
        where: { sekolah_id: sekolahId },
        data: { mode_presensi: data.mode_presensi_guru },
      });
    }

    return updated;
  }
}
