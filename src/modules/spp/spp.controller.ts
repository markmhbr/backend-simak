import { Controller, Get, Post, Patch, Delete, Body, Param, Query, BadRequestException, HttpCode, HttpStatus } from '@nestjs/common';
import { SppService } from './spp.service';
import { CreatePengaturanTagihanDto } from './dto/create-pengaturan-tagihan.dto';
import { UpdatePengaturanTagihanDto } from './dto/update-pengaturan-tagihan.dto';
import { CreatePengaturanTagihanRombelDto } from './dto/create-pengaturan-tagihan-rombel.dto';
import { CreateTransaksiSppDto } from './dto/create-transaksi-spp.dto';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class GenerateSppDto {
  @IsUUID()
  @IsNotEmpty()
  sekolah_id: string;

  @IsUUID()
  @IsNotEmpty()
  pengaturan_tagihan_id: string;
}

@Controller('spp')
export class SppController {
  constructor(private readonly sppService: SppService) {}

  // ===================================
  // 1. MASTER PENGATURAN TAGIHAN
  // ===================================

  @Post('pengaturan')
  async createPengaturanTagihan(@Body() dto: CreatePengaturanTagihanDto) {
    const data = await this.sppService.createPengaturanTagihan(dto);
    return {
      status: 'success',
      message: 'Master pengaturan tagihan berhasil dibuat.',
      data,
    };
  }

  @Get('pengaturan/:sekolah_id')
  async getPengaturanTagihan(@Param('sekolah_id') sekolahId: string) {
    const data = await this.sppService.getPengaturanTagihan(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Patch('pengaturan/:id')
  async updatePengaturanTagihan(
    @Param('id') id: string,
    @Body() dto: UpdatePengaturanTagihanDto,
  ) {
    const data = await this.sppService.updatePengaturanTagihan(id, dto);
    return {
      status: 'success',
      message: 'Pengaturan tagihan berhasil diperbarui.',
      data,
    };
  }

  @Delete('pengaturan/:id')
  async deletePengaturanTagihan(@Param('id') id: string) {
    await this.sppService.deletePengaturanTagihan(id);
    return {
      status: 'success',
      message: 'Pengaturan tagihan berhasil dihapus.',
    };
  }

  @Post('pengaturan-rombel')
  async createPengaturanTagihanRombel(@Body() dto: CreatePengaturanTagihanRombelDto) {
    const data = await this.sppService.createPengaturanTagihanRombel(dto);
    return {
      status: 'success',
      message: 'Pengaturan tagihan berhasil dihubungkan ke rombongan belajar.',
      data,
    };
  }

  @Delete('pengaturan-rombel/:id')
  async deletePengaturanTagihanRombel(@Param('id') id: string) {
    await this.sppService.deletePengaturanTagihanRombel(id);
    return {
      status: 'success',
      message: 'Hubungan pengaturan tagihan dengan rombongan belajar berhasil dihapus.',
    };
  }

  // ===================================
  // 2. GENERATE TAGIHAN SPP
  // ===================================

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  async generateSppTagihan(@Body() dto: GenerateSppDto) {
    const data = await this.sppService.generateSppTagihan(dto.sekolah_id, dto.pengaturan_tagihan_id);
    return {
      status: 'success',
      message: data.message,
      data,
    };
  }

  @Get('tagihan/:sekolah_id')
  async getTagihanSpp(
    @Param('sekolah_id') sekolahId: string,
    @Query('peserta_didik_id') pesertaDidikId?: string,
    @Query('status') status?: number,
  ) {
    const data = await this.sppService.getTagihanSpp(sekolahId, {
      peserta_didik_id: pesertaDidikId,
      status: status !== undefined ? Number(status) : undefined,
    });
    return {
      status: 'success',
      data,
    };
  }

  // ===================================
  // 3. TRANSAKSI SPP
  // ===================================

  @Post('transaksi')
  async createTransaksiSpp(@Body() dto: CreateTransaksiSppDto) {
    const data = await this.sppService.createTransaksiSpp(dto);
    return {
      status: 'success',
      message: 'Transaksi SPP berhasil dicatat.',
      data,
    };
  }

  // ===================================
  // 4. LAPORAN & REKAPITULASI
  // ===================================

  @Get('laporan/tunggakan-siswa/:sekolah_id')
  async getTunggakanPerSiswa(@Param('sekolah_id') sekolahId: string) {
    const data = await this.sppService.getTunggakanPerSiswa(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Get('laporan/tunggakan-kelas/:sekolah_id')
  async getTunggakanPerKelas(@Param('sekolah_id') sekolahId: string) {
    const data = await this.sppService.getTunggakanPerKelas(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Get('laporan/total-pembayaran/:sekolah_id')
  async getTotalPembayaran(@Param('sekolah_id') sekolahId: string) {
    const data = await this.sppService.getTotalPembayaran(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Get('laporan/total-beasiswa/:sekolah_id')
  async getTotalBeasiswa(@Param('sekolah_id') sekolahId: string) {
    const data = await this.sppService.getTotalBeasiswa(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Get('laporan/rekap-bulanan/:sekolah_id')
  async getRekapBulanan(@Param('sekolah_id') sekolahId: string) {
    const data = await this.sppService.getRekapBulanan(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Get('laporan/rekap-tahun-pelajaran/:sekolah_id')
  async getRekapTahunPelajaran(@Param('sekolah_id') sekolahId: string) {
    const data = await this.sppService.getRekapTahunPelajaran(sekolahId);
    return {
      status: 'success',
      data,
    };
  }
}
