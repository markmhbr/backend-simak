import { Controller, Get, UseGuards, Req, Query, Patch, Body, Post, Delete, UseInterceptors, UploadedFile, Param, BadRequestException } from '@nestjs/common';
import { DapodikService } from './dapodik.service';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

@Controller('dapodik')
@UseGuards(ApiKeyGuard)
export class DapodikController {
  constructor(private readonly dapodikService: DapodikService) {}

  private getSekolahInfo(req: Request) {
    if (req['isMandala']) {
      const querySekolahId = req.query.sekolah_id as string;
      if (!querySekolahId) {
        throw new BadRequestException('sekolah_id query parameter is required for Mandala integration.');
      }
      return {
        sekolahId: querySekolahId,
        namaApp: 'Mandala Integration',
      };
    }
    const appKey = req['appKey'];
    return {
      sekolahId: appKey?.sekolah_id || null,
      namaApp: appKey?.nama_app || '',
    };
  }

  @Get('cadisdik')
  async getCadisdikList() {
    const data = await this.dapodikService.getCadisdiks();
    return {
      status: 'success',
      data,
    };
  }

  @Get('master-layanan')
  async getLayananMaster(@Req() req: Request, @Query('kategori') kategori?: string) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getLayananMaster(sekolahId, kategori ? parseInt(kategori, 10) : undefined);
    return {
      status: 'success',
      data,
    };
  }

  @Get('permohonan-layanan')
  async getPermohonanLayanan(
    @Req() req: Request,
    @Query('status') status?: string,
    @Query('kategori') kategori?: string,
  ) {
    const { sekolahId } = this.getSekolahInfo(req);
    const filters = {
      sekolah_id: sekolahId,
      status: status !== undefined ? parseInt(status, 10) : undefined,
      kategori: kategori !== undefined ? parseInt(kategori, 10) : undefined,
    };
    const data = await this.dapodikService.getPermohonanLayanan(filters);
    return {
      status: 'success',
      data,
    };
  }

  @Post('permohonan-layanan')
  async createPermohonanLayanan(@Req() req: Request, @Body() body: any) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.createPermohonanLayanan({ ...body, sekolah_id: sekolahId });
    return {
      status: 'success',
      message: 'Permohonan layanan berhasil diajukan',
      data,
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

  @Post('siswa/:uuid/upload-foto')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSiswaFoto(
    @Req() req: Request, 
    @Param('uuid') uuid: string, 
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Berkas foto wajib disertakan.');
    }
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    try {
      const data = await this.dapodikService.uploadSiswaFoto(sekolahId, uuid, file);
      return {
        status: 'success',
        klien: namaApp,
        data,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('gtk/:uuid/upload-foto')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGtkFoto(
    @Req() req: Request, 
    @Param('uuid') uuid: string, 
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Berkas foto wajib disertakan.');
    }
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    try {
      const data = await this.dapodikService.uploadGtkFoto(sekolahId, uuid, file);
      return {
        status: 'success',
        klien: namaApp,
        data,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('siswa/:uuid/upload-dokumen')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSiswaDokumen(
    @Req() req: Request,
    @Param('uuid') uuid: string,
    @Body('nama_dokumen') namaDokumen: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Berkas dokumen wajib disertakan.');
    }
    if (!namaDokumen) {
      throw new BadRequestException('Parameter nama_dokumen wajib diisi.');
    }
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    try {
      const data = await this.dapodikService.uploadSiswaDokumen(sekolahId, uuid, file, namaDokumen);
      return {
        status: 'success',
        klien: namaApp,
        data,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Post('gtk/:uuid/upload-dokumen')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGtkDokumen(
    @Req() req: Request,
    @Param('uuid') uuid: string,
    @Body('nama_dokumen') namaDokumen: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Berkas dokumen wajib disertakan.');
    }
    if (!namaDokumen) {
      throw new BadRequestException('Parameter nama_dokumen wajib diisi.');
    }
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    try {
      const data = await this.dapodikService.uploadGtkDokumen(sekolahId, uuid, file, namaDokumen);
      return {
        status: 'success',
        klien: namaApp,
        data,
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete('gtk/:uuid/dokumen/:fileName')
  async deleteGtkDokumen(
    @Req() req: Request,
    @Param('uuid') uuid: string,
    @Param('fileName') fileName: string
  ) {
    const { sekolahId } = this.getSekolahInfo(req);
    try {
      await this.dapodikService.deleteGtkDokumen(sekolahId, uuid, fileName);
      return { status: 'success', message: 'Dokumen berhasil dihapus' };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Delete('siswa/:uuid/dokumen/:fileName')
  async deleteSiswaDokumen(
    @Req() req: Request,
    @Param('uuid') uuid: string,
    @Param('fileName') fileName: string
  ) {
    const { sekolahId } = this.getSekolahInfo(req);
    try {
      await this.dapodikService.deleteSiswaDokumen(sekolahId, uuid, fileName);
      return { status: 'success', message: 'Dokumen berhasil dihapus' };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
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
  async getTanahList(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('page') page?: string
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const take = limit ? parseInt(limit, 10) : 10;
    const skipPage = page ? parseInt(page, 10) : 1;

    const { data, total } = await this.dapodikService.getTanah(sekolahId, take, search, skipPage);
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
  async getBangunanList(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('page') page?: string
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const take = limit ? parseInt(limit, 10) : 10;
    const skipPage = page ? parseInt(page, 10) : 1;

    const { data, total } = await this.dapodikService.getBangunan(sekolahId, take, search, skipPage);
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

  @Get('ruang')
  async getRuangList(
    @Req() req: Request,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('page') page?: string
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const take = limit ? parseInt(limit, 10) : 10;
    const skipPage = page ? parseInt(page, 10) : 1;

    const { data, total } = await this.dapodikService.getRuang(sekolahId, take, search, skipPage);
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

  @Get('peserta-didik/rekap-tingkat')
  async getPdRekapTingkat(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getPdRekapTingkat(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
      data,
    };
  }

  @Get('peserta-didik/rekap-kompetensi')
  async getPdRekapKompetensi(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getPdRekapKompetensi(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
      data,
    };
  }

  @Get('peserta-didik/rekap-usia')
  async getPdRekapUsia(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getPdRekapUsia(sekolahId);
    return {
      status: 'success',
      klien: namaApp,
      data,
    };
  }

  @Get('peserta-didik')
  async getPesertaDidikList(
    @Req() req: Request, 
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('rombel') rombelName?: string,
    @Query('status') status?: 'aktif' | 'non-aktif',
    @Query('tingkat') tingkat?: string,
    @Query('sekolah_id') sekolahIdQuery?: string
    ) {
    if (req['isMandala']) {
      if (!sekolahIdQuery) {
        throw new BadRequestException('sekolah_id query parameter is required for Mandala integration.');
      }
      const take = limit ? parseInt(limit, 10) : 10;
      const skipPage = page ? parseInt(page, 10) : 1;
      return await this.dapodikService.getPesertaDidikForMandala(sekolahIdQuery, {
        limit: take,
        page: skipPage,
        search,
        status,
      });
    }

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

  @Get('rombongan-belajar/rekap-kategori')
  async getRombelRekapKategori(@Req() req: Request) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getRombelRekapKategori(sekolahId);
    return { status: 'success', data };
  }

  @Get('rombongan-belajar/rekap-kompetensi')
  async getRombelRekapKompetensi(@Req() req: Request) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getRombelRekapKompetensi(sekolahId);
    return { status: 'success', data };
  }

  @Get('rombongan-belajar')
  async getRombonganBelajarList(
    @Req() req: Request, 
    @Query('type') type?: 'reguler' | 'pilihan',
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('tingkat') tingkat?: string
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const take = limit ? parseInt(limit, 10) : 10;
    const skipPage = page ? parseInt(page, 10) : 1;

    const { total, data } = await this.dapodikService.getRombonganBelajar(sekolahId, type, take, skipPage, search, tingkat);
    
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

  @Get('rombongan-belajar/:id/anggota')
  async getRombelAnggota(@Param('id') id: string) {
    const data = await this.dapodikService.getRombelAnggota(id);
    return {
      status: 'success',
      data,
    };
  }

  @Get('rombongan-belajar/:id/pembelajaran')
  async getRombelPembelajaran(@Param('id') id: string) {
    const data = await this.dapodikService.getRombelPembelajaran(id);
    return {
      status: 'success',
      data,
    };
  }

  @Get('ekstrakurikuler')
  async getEkstrakurikulerList(
    @Req() req: Request,
    @Query('search') search?: string
  ) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getEkstrakurikuler(sekolahId, search);
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

  @Get('pembelajaran')
  async getAllPembelajaran(@Req() req: Request) {
    const { sekolahId, namaApp } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getAllPembelajaran(sekolahId);
    return { status: 'success', klien: namaApp, data };
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

  @Get('gtk/:id')
  async getGtkDetail(@Req() req: Request, @Param('id') id: string) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getGtkById(sekolahId, id);
    return { status: 'success', data };
  }

  @Patch('gtk/:id')
  async updateGtkDetail(@Req() req: Request, @Param('id') id: string, @Body() body: any) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.updateGtk(sekolahId, id, body);
    return { status: 'success', data };
  }

  @Get('peserta-didik/:id')
  async getPesertaDidikDetail(@Req() req: Request, @Param('id') id: string) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getPesertaDidikById(sekolahId, id);
    return { status: 'success', data };
  }

  @Patch('peserta-didik/:id')
  async updatePesertaDidikDetail(@Req() req: Request, @Param('id') id: string, @Body() body: any) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.updatePesertaDidik(sekolahId, id, body);
    return { status: 'success', data };
  }

  // ========================
  // DUDI (Dunia Usaha & Industri)
  // ========================

  @Get('dudi')
  async getDudi(@Req() req: Request) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getDudi(sekolahId);
    return { status: 'success', data };
  }

  @Get('dudi/:id')
  async getDudiDetail(@Req() req: Request, @Param('id') id: string) {
    const { sekolahId } = this.getSekolahInfo(req);
    const data = await this.dapodikService.getDudiById(sekolahId, id);
    return { status: 'success', data };
  }
}
