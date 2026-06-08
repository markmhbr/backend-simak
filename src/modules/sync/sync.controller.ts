import { Controller, Post, Body, UseGuards, Req, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { SyncService } from './sync.service';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import type { Request } from 'express';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  private getSekolahId(req: Request): string {
    const appKey = req['appKey'];
    return appKey?.sekolah_id;
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validateSyncKey(@Body() body: { key: string; domain: string }) {
    const result = await this.syncService.validateAndRegisterDomain(body.key, body.domain);
    return {
      status: 'success',
      message: 'Domain berhasil disinkronkan',
      data: result
    };
  }

  @Post('sekolah')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async syncSekolah(@Req() req: Request, @Body() data: any[]) {
    const rows = Array.isArray(data) ? data : [data];
    let sekolahId = this.getSekolahId(req);
    const rawApiKey = req['rawApiKey'];

    // Jika sekolahId kosong (belum terdaftar di AppKey), ambil dari data yang dikirim
    if (!sekolahId && rows.length > 0) {
      sekolahId = rows[0].sekolah_id || rows[0].id || rows[0].npsn;
    }

    const result = await this.syncService.syncSekolah(sekolahId, rows, rawApiKey);
    return { status: 'success', count: result.successCount };
  }

  @Post('rombel')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async syncRombel(@Req() req: Request, @Body() data: any[]) {
    const sekolahId = this.getSekolahId(req);
    const rows = Array.isArray(data) ? data : [data];
    const result = await this.syncService.syncRombel(sekolahId, rows);
    return { status: 'success', count: result.successCount };
  }

  @Post('siswa')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async syncSiswa(@Req() req: Request, @Body() data: any[]) {
    const sekolahId = this.getSekolahId(req);
    const rows = Array.isArray(data) ? data : [data];
    const result = await this.syncService.syncSiswa(sekolahId, rows);
    return { status: 'success', count: result.successCount };
  }

  @Post('gtk')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async syncGtk(@Req() req: Request, @Body() data: any[]) {
    const sekolahId = this.getSekolahId(req);
    const rows = Array.isArray(data) ? data : [data];
    const result = await this.syncService.syncGtk(sekolahId, rows);
    return { status: 'success', count: result.successCount };
  }

  @Post('pengguna')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async syncPengguna(@Req() req: Request, @Body() data: any[]) {
    const sekolahId = this.getSekolahId(req);
    const rows = Array.isArray(data) ? data : [data];
    const result = await this.syncService.syncPengguna(sekolahId, rows);
    return { status: 'success', count: result.successCount };
  }

  @Post('sarpras')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async syncSarpras(@Req() req: Request, @Body() data: any[]) {
    const sekolahId = this.getSekolahId(req);
    const rows = Array.isArray(data) ? data : [data];
    const result = await this.syncService.syncSarpras(sekolahId, rows);
    return { status: 'success', count: result.successCount };
  }

  @Post('bidang_studi')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async syncBidangStudi(@Req() req: Request, @Body() data: any[]) {
    const sekolahId = this.getSekolahId(req);
    const rows = Array.isArray(data) ? data : [data];
    const result = await this.syncService.syncBidangStudi(sekolahId, rows);
    return { status: 'success', count: result.successCount };
  }

  @Post('lemb_sertifikasi')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async syncLembSertifikasi(@Req() req: Request, @Body() data: any[]) {
    const sekolahId = this.getSekolahId(req);
    const rows = Array.isArray(data) ? data : [data];
    const result = await this.syncService.syncLembSertifikasi(sekolahId, rows);
    return { status: 'success', count: result.successCount };
  }

  @Post('rwy_sertifikat')
  @UseGuards(ApiKeyGuard)
  @HttpCode(HttpStatus.OK)
  async syncRwySertifikat(@Req() req: Request, @Body() data: any[]) {
    const sekolahId = this.getSekolahId(req);
    const rows = Array.isArray(data) ? data : [data];
    const result = await this.syncService.syncRwySertifikat(sekolahId, rows);
    return { status: 'success', count: result.successCount };
  }
}
