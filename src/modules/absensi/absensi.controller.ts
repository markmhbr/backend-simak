import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { AbsensiService } from './absensi.service';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import * as express from 'express';

@Controller('kurikulum/absensi')
export class AbsensiController {
  constructor(private readonly absensiService: AbsensiService) {}

  @UseGuards(ApiKeyGuard)
  @Get('config')
  getConfig(@Req() req: express.Request) {
    const appKey = req['appKey'];
    return this.absensiService.getAttendanceConfig(appKey.sekolah_id);
  }

  @UseGuards(ApiKeyGuard)
  @Post('scan')
  scanQr(@Req() req: express.Request, @Body() data: { token: string }) {
    const appKey = req['appKey'];
    return this.absensiService.scanQr(appKey.sekolah_id, data.token);
  }

  @UseGuards(ApiKeyGuard)
  @Post('lookup')
  lookupUser(@Req() req: express.Request, @Body() data: { token: string }) {
    const appKey = req['appKey'];
    return this.absensiService.findUserByQr(appKey.sekolah_id, data.token);
  }

  @Get('hari-libur/:sekolahId')
  getHariLibur(@Param('sekolahId') sekolahId: string) {
    return this.absensiService.getHariLibur(sekolahId);
  }

  @Post('hari-libur/:sekolahId')
  createHariLibur(
    @Param('sekolahId') sekolahId: string,
    @Body() data: { nama: string; tanggal_mulai: string; tanggal_selesai: string; keterangan?: string },
  ) {
    return this.absensiService.createHariLibur(sekolahId, data);
  }

  @Delete('hari-libur/:sekolahId/:id')
  deleteHariLibur(@Param('sekolahId') sekolahId: string, @Param('id') id: string) {
    return this.absensiService.deleteHariLibur(sekolahId, id);
  }

  @Post('peserta-didik/:sekolahId')
  absenPesertaDidik(
    @Param('sekolahId') sekolahId: string,
    @Body() data: { peserta_didik_id: string; waktu: string; tipe: 'masuk' | 'pulang' },
  ) {
    return this.absensiService.absenPesertaDidik(sekolahId, data);
  }

  @Post('gtk/:sekolahId')
  absenGtk(
    @Param('sekolahId') sekolahId: string,
    @Body() data: { ptk_id: string; waktu: string; tipe: 'masuk' | 'pulang' },
  ) {
    return this.absensiService.absenGtk(sekolahId, data);
  }

  @Post('mapel/:sekolahId')
  absenMapel(
    @Param('sekolahId') sekolahId: string,
    @Body() data: { jadwal_pelajaran_id: string; peserta_didik_id: string; tanggal: string; status: number },
  ) {
    return this.absensiService.absenMapel(sekolahId, data);
  }

  @Post('izin/:sekolahId')
  createIzin(
    @Param('sekolahId') sekolahId: string,
    @Body() data: { peserta_didik_id?: string; ptk_id?: string; jenis: number; tanggal: string; keterangan: string },
  ) {
    return this.absensiService.createIzin(sekolahId, data);
  }
}
