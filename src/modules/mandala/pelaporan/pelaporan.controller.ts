import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Req, Res, BadRequestException } from '@nestjs/common';
import { PelaporanService } from './pelaporan.service';
import { MandalaKeyGuard } from '../../../core/mandala/mandala-key.guard';
import { CreatePelaporanDto } from './dto/create-pelaporan.dto';
import type { Request } from 'express';

@Controller('mandala/pelaporan')
@UseGuards(MandalaKeyGuard)
export class PelaporanController {
  constructor(private readonly pelaporanService: PelaporanService) {}

  private getCadisdikId(req: Request): string {
    const cadisdikId = (req['user'] as any)?.cadisdik_id || req.body?.cadisdik_id || req.query?.cadisdik_id;
    if (!cadisdikId) {
      throw new BadRequestException('cadisdik_id is required. Please provide it in the body/query or ensure you are logged in correctly.');
    }
    return cadisdikId;
  }

  @Post()
  async createPelaporan(@Req() req: Request, @Body() dto: CreatePelaporanDto) {
    const cadisdikId = this.getCadisdikId(req);
    const data = await this.pelaporanService.createPelaporan(cadisdikId, dto);
    return {
      status: 'success',
      message: 'Pelaporan berhasil dibuat',
      data,
    };
  }

  @Get()
  async getListPelaporan(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const cadisdikId = this.getCadisdikId(req);
    const data = await this.pelaporanService.getListPelaporan(cadisdikId, parseInt(page, 10), parseInt(limit, 10));
    return {
      status: 'success',
      ...data,
    };
  }

  @Get(':id')
  async getDetailPelaporan(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const cadisdikId = this.getCadisdikId(req);
    const data = await this.pelaporanService.getDetailPelaporan(cadisdikId, id);
    return {
      status: 'success',
      data,
    };
  }

  @Get(':id/sekolah/:sekolahId')
  async getDokumenSekolah(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('sekolahId') sekolahId: string,
  ) {
    const cadisdikId = this.getCadisdikId(req);
    const data = await this.pelaporanService.getDokumenSekolah(cadisdikId, id, sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Get(':id/sekolah/:sekolahId/preview')
  async previewPelaporan(
    @Req() req: Request,
    @Res() res: any,
    @Param('id') id: string,
    @Param('sekolahId') sekolahId: string,
  ) {
    const cadisdikId = this.getCadisdikId(req);
    const html = await this.pelaporanService.renderPelaporanHtml(cadisdikId, id, sekolahId);
    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  }

  @Delete(':id')
  async deletePelaporan(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const cadisdikId = this.getCadisdikId(req);
    await this.pelaporanService.deletePelaporan(cadisdikId, id);
    return {
      status: 'success',
      message: 'Pelaporan berhasil dihapus',
    };
  }
}
