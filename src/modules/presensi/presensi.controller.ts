import { Controller, Get, Post, Body, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import * as express from 'express';

@Controller('kurikulum/presensi')
export class PresensiController {
  constructor(private readonly presensiService: PresensiService) {}

  @UseGuards(ApiKeyGuard)
  @Get('config')
  getConfig(@Req() req: express.Request) {
    const appKey = req['appKey'];
    return this.presensiService.getAttendanceConfig(appKey.sekolah_id);
  }

  @UseGuards(ApiKeyGuard)
  @Post('scan')
  scanQr(@Req() req: express.Request, @Body() data: { token: string; latitude?: number; longitude?: number }) {
    const appKey = req['appKey'];
    return this.presensiService.scanQr(appKey.sekolah_id, data.token, data.latitude, data.longitude);
  }

  @UseGuards(ApiKeyGuard)
  @Post('lookup')
  lookupUser(@Req() req: express.Request, @Body() data: { token: string }) {
    const appKey = req['appKey'];
    return this.presensiService.findUserByQr(appKey.sekolah_id, data.token);
  }

  @Get('hari-libur/:sekolahId')
  getHariLibur(@Param('sekolahId') sekolahId: string) {
    return this.presensiService.getHariLibur(sekolahId);
  }

  @Post('hari-libur/:sekolahId')
  createHariLibur(
    @Param('sekolahId') sekolahId: string,
    @Body() data: { nama: string; tanggal_mulai: string; tanggal_selesai: string; keterangan?: string },
  ) {
    return this.presensiService.createHariLibur(sekolahId, data);
  }

  @Delete('hari-libur/:sekolahId/:id')
  deleteHariLibur(@Param('sekolahId') sekolahId: string, @Param('id') id: string) {
    return this.presensiService.deleteHariLibur(sekolahId, id);
  }

  @Post('peserta-didik/:sekolahId')
  presensiPesertaDidik(
    @Param('sekolahId') sekolahId: string,
    @Body() data: { peserta_didik_id: string; waktu: string; tipe: 'masuk' | 'pulang' },
  ) {
    return this.presensiService.presensiPesertaDidik(sekolahId, data);
  }

  @Post('gtk/:sekolahId')
  presensiGtk(
    @Param('sekolahId') sekolahId: string,
    @Body() data: { ptk_id: string; waktu: string; tipe: 'masuk' | 'pulang' },
  ) {
    return this.presensiService.presensiGtk(sekolahId, data);
  }

  @Post('mapel/:sekolahId')
  presensiMapel(
    @Param('sekolahId') sekolahId: string,
    @Body() data: { jadwal_pelajaran_id: string; peserta_didik_id: string; tanggal: string; status: number },
  ) {
    return this.presensiService.presensiMapel(sekolahId, data);
  }

  @Post('izin/:sekolahId')
  createIzin(
    @Param('sekolahId') sekolahId: string,
    @Body() data: { 
      peserta_didik_id?: string; 
      ptk_id?: string; 
      jenis: number; 
      tanggal: string; 
      keterangan: string;
      jam_keluar?: string;
      jam_kembali_estimasi?: string;
    },
  ) {
    return this.presensiService.createIzin(sekolahId, data);
  }

  @Get('izin-keluar/:sekolahId')
  getIzinKeluar(
    @Param('sekolahId') sekolahId: string,
    @Query('tanggal') tanggal?: string,
  ) {
    return this.presensiService.getIzinKeluarHariIni(sekolahId, tanggal);
  }

  @Post('izin-keluar/kembali/:sekolahId/:izinId')
  catatKembali(
    @Param('sekolahId') sekolahId: string,
    @Param('izinId') izinId: string,
  ) {
    return this.presensiService.catatKembali(sekolahId, izinId);
  }

  @Post('izin-keluar/setujui/:sekolahId/:izinId')
  setujuiIzin(
    @Param('sekolahId') sekolahId: string,
    @Param('izinId') izinId: string,
  ) {
    return this.presensiService.setujuiIzin(sekolahId, izinId);
  }

  @Delete('izin-keluar/:sekolahId/:izinId')
  deleteIzin(
    @Param('sekolahId') sekolahId: string,
    @Param('izinId') izinId: string,
  ) {
    return this.presensiService.deleteIzin(sekolahId, izinId);
  }

  @Get('rekap-pd/:sekolahId')
  getRekapPesertaDidik(
    @Param('sekolahId') sekolahId: string,
    @Query('tanggal') tanggal?: string,
  ) {
    return this.presensiService.getPresensiPesertaDidik(sekolahId, tanggal);
  }

  @Get('rekap-gtk/:sekolahId')
  getRekapGtk(
    @Param('sekolahId') sekolahId: string,
    @Query('tanggal') tanggal?: string,
  ) {
    return this.presensiService.getPresensiGtk(sekolahId, tanggal);
  }
}
