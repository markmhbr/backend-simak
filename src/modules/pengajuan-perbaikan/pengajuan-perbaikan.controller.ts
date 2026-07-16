import { Controller, Post, Get, Body, Param, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { PengajuanPerbaikanService } from './pengajuan-perbaikan.service';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import type { Request } from 'express';

@Controller('pengajuan-perbaikan')
@UseGuards(ApiKeyGuard)
export class PengajuanPerbaikanController {
  constructor(private readonly service: PengajuanPerbaikanService) {}

  private getSekolahId(req: Request): string {
    if (req['isMandala']) {
      const querySekolahId = req.query.sekolah_id as string;
      if (!querySekolahId) {
        throw new BadRequestException('sekolah_id query parameter is required.');
      }
      return querySekolahId;
    }
    const appKey = req['appKey'];
    if (!appKey || !appKey.sekolah_id) {
      throw new BadRequestException('sekolah_id tidak terdeteksi dari API Key.');
    }
    return appKey.sekolah_id;
  }

  @Post()
  async buatPengajuan(@Req() req: Request, @Body() body: any) {
    const sekolahId = this.getSekolahId(req);
    return this.service.buatPengajuan(sekolahId, body);
  }

  @Get('approved-updates')
  async dapatkanPerbaikanDisetujui(@Req() req: Request) {
    const sekolahId = this.getSekolahId(req);
    return this.service.dapatkanPerbaikanDisetujui(sekolahId);
  }

  @Post('approved-updates/clear')
  async clearPerbaikanDisetujui(@Req() req: Request, @Body() body: { ids?: string[] }) {
    const sekolahId = this.getSekolahId(req);
    return this.service.clearPerbaikanDisetujui(sekolahId, body.ids);
  }

  @Get()
  async dapatkanDaftar(@Req() req: Request) {
    const sekolahId = this.getSekolahId(req);
    return this.service.dapatkanDaftar(sekolahId);
  }

  @Post(':id/setujui')
  async setujuiPengajuan(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    return this.service.setujuiPengajuan(sekolahId, id);
  }

  @Post(':id/tolak')
  async tolakPengajuan(
    @Req() req: Request, 
    @Param('id') id: string,
    @Body() body: { alasan_tolak?: string }
  ) {
    const sekolahId = this.getSekolahId(req);
    return this.service.tolakPengajuan(sekolahId, id, body.alasan_tolak);
  }
}
