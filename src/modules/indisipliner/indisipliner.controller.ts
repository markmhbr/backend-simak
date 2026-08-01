import { Controller, Get, Post, Patch, Body, Query, Param, HttpCode, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { IndisiplinerService } from './indisipliner.service';
import { CreateKategoriPelanggaranDto } from './dto/create-kategori-pelanggaran.dto';
import { CreateJenisPelanggaranDto } from './dto/create-jenis-pelanggaran.dto';
import { CreateJenisTindakLanjutDto } from './dto/create-jenis-tindak-lanjut.dto';
import { CreatePelanggaranDto } from './dto/create-pelanggaran.dto';
import { CreateTindakLanjutDto } from './dto/create-tindak-lanjut.dto';

@Controller('indisipliner')
export class IndisiplinerController {
  constructor(private readonly indisiplinerService: IndisiplinerService) {}

  // =====================
  // MASTER KATEGORI PELANGGARAN
  // =====================

  @Get('kategori-pelanggaran')
  async getKategoriPelanggaran(
    @Query('sekolah_id') sekolahId: string,
    @Query('target') target?: number,
  ) {
    if (!sekolahId) {
      throw new BadRequestException('sekolah_id query parameter is required.');
    }
    const data = await this.indisiplinerService.getKategoriPelanggaran(sekolahId, target ? Number(target) : undefined);
    return {
      status: 'success',
      data,
    };
  }

  @Post('kategori-pelanggaran')
  async createKategoriPelanggaran(@Body() dto: CreateKategoriPelanggaranDto) {
    const data = await this.indisiplinerService.createKategoriPelanggaran(dto);
    return {
      status: 'success',
      message: 'Kategori pelanggaran berhasil dibuat.',
      data,
    };
  }

  // =====================
  // MASTER JENIS PELANGGARAN
  // =====================

  @Get('jenis-pelanggaran')
  async getJenisPelanggaran(@Query('sekolah_id') sekolahId: string) {
    if (!sekolahId) {
      throw new BadRequestException('sekolah_id query parameter is required.');
    }
    const data = await this.indisiplinerService.getJenisPelanggaran(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Post('jenis-pelanggaran')
  async createJenisPelanggaran(@Body() dto: CreateJenisPelanggaranDto) {
    const data = await this.indisiplinerService.createJenisPelanggaran(dto);
    return {
      status: 'success',
      message: 'Jenis pelanggaran berhasil dibuat.',
      data,
    };
  }

  // =====================
  // MASTER JENIS TINDAK LANJUT
  // =====================

  @Get('jenis-tindak-lanjut')
  async getJenisTindakLanjut(@Query('sekolah_id') sekolahId: string) {
    if (!sekolahId) {
      throw new BadRequestException('sekolah_id query parameter is required.');
    }
    const data = await this.indisiplinerService.getJenisTindakLanjut(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Post('jenis-tindak-lanjut')
  async createJenisTindakLanjut(@Body() dto: CreateJenisTindakLanjutDto) {
    const data = await this.indisiplinerService.createJenisTindakLanjut(dto);
    return {
      status: 'success',
      message: 'Jenis tindak lanjut berhasil dibuat.',
      data,
    };
  }

  // =====================
  // TRANSAKSI PELANGGARAN
  // =====================

  @Get('pelanggaran')
  async getPelanggaran(
    @Query('sekolah_id') sekolahId: string,
    @Query('peserta_didik_id') pesertaDidikId?: string,
    @Query('ptk_id') ptkId?: string,
    @Query('status') status?: number,
  ) {
    if (!sekolahId) {
      throw new BadRequestException('sekolah_id query parameter is required.');
    }
    const data = await this.indisiplinerService.getPelanggaran(sekolahId, {
      peserta_didik_id: pesertaDidikId,
      ptk_id: ptkId,
      status: status ? Number(status) : undefined,
    });
    return {
      status: 'success',
      data,
    };
  }

  @Post('pelanggaran')
  async createPelanggaran(@Body() dto: CreatePelanggaranDto) {
    const data = await this.indisiplinerService.createPelanggaran(dto);
    return {
      status: 'success',
      message: 'Pelanggaran berhasil dicatat.',
      data,
    };
  }

  @Patch('pelanggaran/:id/status')
  async updatePelanggaranStatus(
    @Param('id') id: string,
    @Body('status') status: number,
  ) {
    if (status === undefined || status === null) {
      throw new BadRequestException('status body field is required.');
    }
    const data = await this.indisiplinerService.updatePelanggaranStatus(id, status);
    return {
      status: 'success',
      message: 'Status pelanggaran berhasil diperbarui.',
      data,
    };
  }

  // =====================
  // TRANSAKSI TINDAK LANJUT
  // =====================

  @Post('tindak-lanjut')
  async createTindakLanjut(@Body() dto: CreateTindakLanjutDto) {
    const data = await this.indisiplinerService.createTindakLanjut(dto);
    return {
      status: 'success',
      message: 'Tindak lanjut pelanggaran berhasil dicatat.',
      data,
    };
  }

  // =====================
  // REKAP & SUMMARY SEKOLAH
  // =====================

  @Get('rekap-sekolah/:sekolah_id')
  async getSchoolSummary(@Param('sekolah_id') sekolahId: string) {
    const data = await this.indisiplinerService.getSchoolSummary(sekolahId);
    return {
      status: 'success',
      data,
    };
  }
}
