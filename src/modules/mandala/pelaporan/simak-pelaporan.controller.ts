import { Controller, Get, Post, Delete, Param, Query, UseGuards, Req, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PelaporanService } from './pelaporan.service';
import { ApiKeyGuard } from '../../../core/app-key/api-key.guard';
import type { Request } from 'express';

@Controller('simak/pelaporan')
@UseGuards(ApiKeyGuard)
export class SimakPelaporanController {
  constructor(private readonly pelaporanService: PelaporanService) {}

  private getSekolahInfo(req: Request) {
    const appKey = req['appKey'];
    if (!appKey || !appKey.sekolah_id) {
      throw new BadRequestException('Akses ditolak: sekolah_id tidak ditemukan pada API Key');
    }
    return appKey.sekolah_id;
  }

  @Get()
  async getSimakListPelaporan(
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const sekolahId = this.getSekolahInfo(req);
    const data = await this.pelaporanService.getSimakListPelaporan(sekolahId, parseInt(page, 10), parseInt(limit, 10));
    return {
      status: 'success',
      ...data,
    };
  }

  @Get(':id')
  async getSimakDetailPelaporan(
    @Req() req: Request,
    @Param('id') id: string,
  ) {
    const sekolahId = this.getSekolahInfo(req);
    const data = await this.pelaporanService.getSimakDetailPelaporan(sekolahId, id);
    return {
      status: 'success',
      data,
    };
  }

  @Post(':id/upload')
  @UseInterceptors(FilesInterceptor('files', 10, {
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file handled by multer
  }))
  async uploadDokumen(
    @Req() req: Request,
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Tidak ada file yang diunggah');
    }
    
    const sekolahId = this.getSekolahInfo(req);
    const data = await this.pelaporanService.uploadDokumenSimak(sekolahId, id, files);
    return {
      status: 'success',
      message: 'Dokumen berhasil diunggah',
      data,
    };
  }

  @Delete('dokumen/:dokumenId')
  async deleteDokumen(
    @Req() req: Request,
    @Param('dokumenId') dokumenId: string,
  ) {
    const sekolahId = this.getSekolahInfo(req);
    await this.pelaporanService.deleteDokumenSimak(sekolahId, dokumenId);
    return {
      status: 'success',
      message: 'Dokumen berhasil dihapus',
    };
  }
}
