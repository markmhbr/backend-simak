import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DapodikService } from './dapodik.service';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import type { Request } from 'express';

@Controller('api/dapodik')
@UseGuards(ApiKeyGuard)
export class DapodikController {
  constructor(private readonly dapodikService: DapodikService) {}

  private getSekolahInfo(req: Request) {
    const appKey = req['appKey'];
    return {
      sekolahId: appKey.sekolah_id,
      namaApp: appKey.nama_app,
    };
  }

  @Get('summary')
  async getSummarySummary(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getSummary(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
      data,
    };
  }

  @Get('tanah')
  async getTanahList(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getTanah(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
      count: data.length,
      data,
    };
  }

  @Get('bangunan')
  async getBangunanList(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getBangunan(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
      count: data.length,
      data,
    };
  }

  @Get('ruang')
  async getRuangList(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getRuang(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
      count: data.length,
      data,
    };
  }
}
