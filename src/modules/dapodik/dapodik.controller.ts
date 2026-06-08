import { Controller, Get, UseGuards, Req, Query, Patch, Body, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DapodikService } from './dapodik.service';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

@Controller('dapodik')
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

  @Get('sekolah')
  async getSekolahInfoDetail(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getSekolah(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
      data,
    };
  }

  @Patch('sekolah')
  async updateSekolahInfoDetail(@Req() req: Request, @Body() body: any) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.updateSekolah(sekolahId, body);
    return {
      status: 'success',
      klien: namaApp,
      data,
    };
  }

  @Post('sekolah/logo')
  @UseInterceptors(FileInterceptor('logo'))
  async uploadSekolahLogo(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.uploadLogo(sekolahId, file);
    return {
      status: 'success',
      klien: namaApp,
      data,
    };
  }

  @Get('gtk/rekap-kategori')
  async getGtkRekapKategori(@Req() req: Request) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getGtkRekapKategori(sekolahId);
    return { status: 'success', data };
  }

  @Get('gtk/rekap-pendidikan')
  async getGtkRekapPendidikan(@Req() req: Request) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getGtkRekapPendidikan(sekolahId);
    return { status: 'success', data };
  }

  @Get('gtk/rekap-usia')
  async getGtkRekapUsia(@Req() req: Request) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getGtkRekapUsia(sekolahId);
    return { status: 'success', data };
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

  @Get('tahun-pelajaran')
  async getTahunPelajaranList(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getTahunPelajaran(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
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

  @Get('peserta-didik')
  async getPesertaDidikList(
    @Req() req: Request, 
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('rombelName') rombelName?: string,
    @Query('status') status?: 'aktif' | 'non-aktif',
    @Query('tingkat') tingkat?: string
    ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const take = limit ? parseInt(limit, 10) : 10;
    const skipPage = page ? parseInt(page, 10) : 1;

    const { data, total } = await this.dapodikService.getPesertaDidik(sekolahId, take, search, skipPage, rombelName, status, tingkat);
    return {
      status: 'success',
      klien: namaApp,
      data,
      meta: {
        total,
        page: skipPage,
        limit: take,
        total_pages: Math.ceil(total / take)
      }
    };
  }

  @Get('rombongan-belajar')
  async getRombonganBelajarList(
    @Req() req: Request, 
    @Query('type') type?: 'reguler' | 'pilihan',
    @Query('limit') limit?: string,
    @Query('page') page?: string
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const take = limit ? parseInt(limit, 10) : 10;
    const skipPage = page ? parseInt(page, 10) : 1;

    const { total, data } = await this.dapodikService.getRombonganBelajar(sekolahId, type, take, skipPage);
    
    return {
      status: 'success',
      klien: namaApp,
      data,
      meta: {
        total,
        page: skipPage,
        limit: take,
        total_pages: Math.ceil(total / take)
      }
    };
  }

  @Get('ekstrakurikuler')
  async getEkstrakurikulerList(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getEkstrakurikuler(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
      count: data.length,
      data,
    };
  }

  @Get('jurusan')
  async getJurusanList(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getJurusan(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
      data,
    };
  }

  @Get('mata-pelajaran')
  async getMataPelajaranList(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('page') page?: string
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const take = limit ? parseInt(limit, 10) : 10;
    const skipPage = page ? parseInt(page, 10) : 1;

    const { data, total } = await this.dapodikService.getMataPelajaran(sekolahId, take, search, skipPage);
    return {
      status: 'success',
      klien: namaApp,
      data,
      meta: {
        total,
        page: skipPage,
        limit: take,
        total_pages: Math.ceil(total / take)
      }
    };
  }

  @Get('gtk')
  async getGtkList(
    @Req() req: Request, 
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('type') type?: 'guru' | 'tendik',
    @Query('status') status?: 'aktif' | 'non-aktif'
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const take = limit ? parseInt(limit, 10) : 10;
    const skipPage = page ? parseInt(page, 10) : 1;
    
    const { data, total } = await this.dapodikService.getGtk(sekolahId, take, search, skipPage, type, status);
    
    return {
      status: 'success',
      klien: namaApp,
      data,
      meta: {
        total,
        page: skipPage,
        limit: take,
        total_pages: Math.ceil(total / take)
      }
    };
  }
}
