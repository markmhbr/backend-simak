import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PengaturanUmumService } from './pengaturan-umum.service';

@Controller('pengaturan-umum')
export class PengaturanUmumController {
  constructor(private readonly service: PengaturanUmumService) {}

  @Get(':sekolah_id')
  async getSettings(@Param('sekolah_id') sekolahId: string) {
    const data = await this.service.getSettings(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Post(':sekolah_id')
  async updateSettings(
    @Param('sekolah_id') sekolahId: string,
    @Body() body: {
      background_gtk?: string | null;
      background_pd?: string | null;
      waktu_mulai_pengajuan?: string | null;
      waktu_sampai_pengajuan?: string | null;
      mode_presensi_guru?: number | null;
    },
  ) {
    const data = await this.service.updateSettings(sekolahId, body);
    return {
      status: 'success',
      message: 'Pengaturan umum berhasil disimpan.',
      data,
    };
  }
}
