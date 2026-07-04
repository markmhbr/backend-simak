import { Controller, Get, Post, Delete, Patch, UseGuards, Req, Query, Body, Param } from '@nestjs/common';
import { JadwalService } from './jadwal.service';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import type { Request } from 'express';

@Controller('jadwal')
@UseGuards(ApiKeyGuard)
export class JadwalController {
  constructor(private readonly jadwalService: JadwalService) {}

  private getSekolahInfo(req: Request) {
    const appKey = req['appKey'];
    return {
      sekolahId: appKey.sekolah_id,
      namaApp: appKey.nama_app,
    };
  }

  // =====================
  // JENIS JADWAL
  // =====================

  @Get('jenis-jadwal')
  async getJenisJadwal(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.getJenisJadwal(sekolahId);
    return { status: 'success', klien: namaApp, data };
  }

  @Post('jenis-jadwal')
  async createJenisJadwal(
    @Req() req: Request,
    @Body() body: { nama: string; jam_masuk: string; jam_pulang: string; custom_mapel?: boolean },
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.createJenisJadwal(sekolahId, body);
    return { status: 'success', klien: namaApp, data };
  }

  @Patch('jenis-jadwal/:id')
  async updateJenisJadwal(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { nama?: string; jam_masuk?: string; jam_pulang?: string; custom_mapel?: boolean; aktif?: boolean },
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.updateJenisJadwal(sekolahId, id, body);
    return { status: 'success', klien: namaApp, data };
  }

  @Delete('jenis-jadwal/:id')
  async deleteJenisJadwal(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.deleteJenisJadwal(sekolahId, id);
    return { status: 'success', klien: namaApp, data };
  }

  @Patch('jenis-jadwal/:id/toggle')
  async toggleJenisJadwal(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { aktif: boolean },
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.toggleJenisJadwal(sekolahId, id, body.aktif);
    return { status: 'success', klien: namaApp, data };
  }

  @Patch('pengaturan-hari')
  async updatePengaturanHari(
    @Req() req: Request,
    @Body() body: { jenis_jadwal_id: string; hari: number; jam_masuk?: string; jam_pulang?: string; aktif?: boolean },
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.updatePengaturanHari(sekolahId, body);
    return { status: 'success', klien: namaApp, data };
  }

  // =====================
  // PENGATURAN JADWAL
  // =====================

  @Get('pengaturan-jadwal')
  async getPengaturanJadwal(
    @Req() req: Request,
    @Query('jenisJadwalId') jenisJadwalId: string,
    @Query('hari') hari?: string,
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const hariNum = hari ? parseInt(hari, 10) : undefined;
    const data = await this.jadwalService.getPengaturanJadwal(sekolahId, jenisJadwalId, hariNum);
    return { status: 'success', klien: namaApp, data };
  }

  @Post('pengaturan-jadwal')
  async upsertPengaturanJadwal(
    @Req() req: Request,
    @Body() body: { jenis_jadwal_id: string; hari: number; urutan: number; tipe: number; durasi_menit: number; aktif?: boolean },
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.upsertPengaturanJadwal(sekolahId, body);
    return { status: 'success', klien: namaApp, data };
  }

  @Delete('pengaturan-jadwal/:id')
  async deletePengaturanJadwal(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.deletePengaturanJadwal(sekolahId, id);
    return { status: 'success', klien: namaApp, data };
  }

  // =====================
  // JADWAL PELAJARAN
  // =====================

  @Get('jadwal-pelajaran')
  async getJadwalPelajaran(
    @Req() req: Request,
    @Query('jenisJadwalId') jenisJadwalId: string,
    @Query('rombelId') rombelId?: string,
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.getJadwalPelajaran(sekolahId, jenisJadwalId, rombelId);
    return { status: 'success', klien: namaApp, data };
  }

  @Post('jadwal-pelajaran')
  async upsertJadwalPelajaran(
    @Req() req: Request,
    @Body() body: {
      jenis_jadwal_id: string;
      rombongan_belajar_id: string;
      pembelajaran_id: string;
      hari: number;
      urutan: number;
    },
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.upsertJadwalPelajaran(sekolahId, body);
    return { status: 'success', klien: namaApp, data };
  }

  @Delete('jadwal-pelajaran/:id')
  async deleteJadwalPelajaran(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.jadwalService.deleteJadwalPelajaran(sekolahId, id);
    return { status: 'success', klien: namaApp, data };
  }
}
