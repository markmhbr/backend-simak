import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Patch, 
  Delete, 
  Body, 
  Param, 
  Query, 
  Req, 
  UseGuards, 
  BadRequestException 
} from '@nestjs/common';
import type { Request } from 'express';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import { PerpustakaanService } from './perpustakaan.service';
import { CreateKategoriBukuDto, UpdateKategoriBukuDto } from './dto/kategori-buku.dto';
import { CreateBukuDto, UpdateBukuDto } from './dto/buku.dto';
import { CreatePeminjamanDto } from './dto/peminjaman.dto';
import { PengembalianDto } from './dto/pengembalian.dto';
import { CreateKunjunganDto, CheckOutKunjunganDto } from './dto/kunjungan.dto';
import { CreateLiterasiDto, UpdateLiterasiDto } from './dto/literasi.dto';

@Controller('perpustakaan')
@UseGuards(ApiKeyGuard)
export class PerpustakaanController {
  constructor(private readonly perpustakaanService: PerpustakaanService) {}

  private getSekolahId(req: Request): string {
    const appKey = req['appKey'];
    const sekolahId = appKey?.sekolah_id;
    if (!sekolahId) {
      throw new BadRequestException('Sekolah ID tidak terdeteksi dari API Key / Token.');
    }
    return sekolahId;
  }

  // =========================================================================
  // 0. STATISTIK DASHBOARD PERPUSTAKAAN
  // =========================================================================

  @Get('dashboard/stats')
  async getDashboardStats(@Req() req: Request) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.getDashboardStats(sekolahId);
    return { status: 'success', data };
  }

  // =========================================================================
  // 1. KATEGORI BUKU (CRUD)
  // =========================================================================

  @Get('kategori')
  async getKategoriList(@Req() req: Request) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.getKategoriList(sekolahId);
    return { status: 'success', data };
  }

  @Get('kategori/:id')
  async getKategoriById(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.getKategoriById(sekolahId, id);
    return { status: 'success', data };
  }

  @Post('kategori')
  async createKategori(@Req() req: Request, @Body() dto: CreateKategoriBukuDto) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.createKategori(sekolahId, dto);
    return { status: 'success', message: 'Kategori buku berhasil ditambahkan.', data };
  }

  @Put('kategori/:id')
  async updateKategori(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateKategoriBukuDto,
  ) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.updateKategori(sekolahId, id, dto);
    return { status: 'success', message: 'Kategori buku berhasil diperbarui.', data };
  }

  @Delete('kategori/:id')
  async deleteKategori(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.deleteKategori(sekolahId, id);
    return { status: 'success', message: 'Kategori buku berhasil dihapus.', data };
  }

  // =========================================================================
  // 2. MASTER BUKU (CRUD)
  // =========================================================================

  @Get('buku')
  async getBukuList(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('kategori_buku_id') kategori_buku_id?: string,
    @Query('status') status?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const sekolahId = this.getSekolahId(req);
    const result = await this.perpustakaanService.getBukuList(sekolahId, {
      search,
      kategori_buku_id,
      status,
      page,
      limit,
    });
    return { status: 'success', ...result };
  }

  @Get('buku/:id')
  async getBukuById(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.getBukuById(sekolahId, id);
    return { status: 'success', data };
  }

  @Post('buku')
  async createBuku(@Req() req: Request, @Body() dto: CreateBukuDto) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.createBuku(sekolahId, dto);
    return { status: 'success', message: 'Data buku berhasil ditambahkan.', data };
  }

  @Put('buku/:id')
  async updateBuku(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateBukuDto,
  ) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.updateBuku(sekolahId, id, dto);
    return { status: 'success', message: 'Data buku berhasil diperbarui.', data };
  }

  @Delete('buku/:id')
  async deleteBuku(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.deleteBuku(sekolahId, id);
    return { status: 'success', message: 'Data buku berhasil dihapus.', data };
  }

  // =========================================================================
  // 3. PEMINJAMAN & PENGEMBALIAN (CRUD & TRANSACTIONS)
  // =========================================================================

  @Get('peminjaman')
  async getPeminjamanList(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('status') status?: number,
    @Query('peserta_didik_id') peserta_didik_id?: string,
    @Query('ptk_id') ptk_id?: string,
    @Query('tanggal_mulai') tanggal_mulai?: string,
    @Query('tanggal_selesai') tanggal_selesai?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const sekolahId = this.getSekolahId(req);
    const result = await this.perpustakaanService.getPeminjamanList(sekolahId, {
      search,
      status,
      peserta_didik_id,
      ptk_id,
      tanggal_mulai,
      tanggal_selesai,
      page,
      limit,
    });
    return { status: 'success', ...result };
  }

  @Get('peminjaman/:id')
  async getPeminjamanById(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.getPeminjamanById(sekolahId, id);
    return { status: 'success', data };
  }

  @Post('peminjaman')
  async createPeminjaman(@Req() req: Request, @Body() dto: CreatePeminjamanDto) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.createPeminjaman(sekolahId, dto);
    return { status: 'success', message: 'Transaksi peminjaman berhasil dicatat.', data };
  }

  @Post('peminjaman/:id/kembali')
  async prosesPengembalian(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: PengembalianDto,
  ) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.prosesPengembalian(sekolahId, id, dto);
    return { status: 'success', message: 'Pengembalian buku berhasil diproses.', data };
  }

  @Patch('peminjaman/:id/batalkan')
  async batalkanPeminjaman(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.batalkanPeminjaman(sekolahId, id);
    return { status: 'success', message: 'Transaksi peminjaman berhasil dibatalkan dan stok dikembalikan.', data };
  }

  @Delete('peminjaman/:id')
  async deletePeminjaman(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.deletePeminjaman(sekolahId, id);
    return { status: 'success', message: 'Data peminjaman berhasil dihapus.', data };
  }

  // =========================================================================
  // 4. KUNJUNGAN PERPUSTAKAAN (CRUD)
  // =========================================================================

  @Get('kunjungan')
  async getKunjunganList(
    @Req() req: Request,
    @Query('tanggal') tanggal?: string,
    @Query('sedang_berada_di_perpus') sedang_berada_di_perpus?: string,
    @Query('peserta_didik_id') peserta_didik_id?: string,
    @Query('ptk_id') ptk_id?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const sekolahId = this.getSekolahId(req);
    const isInside = sedang_berada_di_perpus === 'true' || sedang_berada_di_perpus === '1';
    const result = await this.perpustakaanService.getKunjunganList(sekolahId, {
      tanggal,
      sedang_berada_di_perpus: isInside ? true : undefined,
      peserta_didik_id,
      ptk_id,
      page,
      limit,
    });
    return { status: 'success', ...result };
  }

  @Get('kunjungan/:id')
  async getKunjunganById(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.getKunjunganById(sekolahId, id);
    return { status: 'success', data };
  }

  @Post('kunjungan/check-in')
  async checkInKunjungan(@Req() req: Request, @Body() dto: CreateKunjunganDto) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.checkInKunjungan(sekolahId, dto);
    return { status: 'success', message: 'Check-in kunjungan perpustakaan berhasil.', data };
  }

  @Patch('kunjungan/:id/check-out')
  async checkOutKunjungan(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: CheckOutKunjunganDto,
  ) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.checkOutKunjungan(sekolahId, id, dto);
    return { status: 'success', message: 'Check-out kunjungan perpustakaan berhasil.', data };
  }

  @Put('kunjungan/:id')
  async updateKunjungan(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { keperluan?: string; keterangan?: string; jam_masuk?: string; jam_keluar?: string },
  ) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.updateKunjungan(sekolahId, id, body);
    return { status: 'success', message: 'Data kunjungan berhasil diperbarui.', data };
  }

  @Delete('kunjungan/:id')
  async deleteKunjungan(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.deleteKunjungan(sekolahId, id);
    return { status: 'success', message: 'Data kunjungan berhasil dihapus.', data };
  }

  // =========================================================================
  // 5. LITERASI PERPUSTAKAAN (CRUD)
  // =========================================================================

  @Get('literasi')
  async getLiterasiList(
    @Req() req: Request,
    @Query('peserta_didik_id') peserta_didik_id?: string,
    @Query('tanggal') tanggal?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const sekolahId = this.getSekolahId(req);
    const result = await this.perpustakaanService.getLiterasiList(sekolahId, {
      peserta_didik_id,
      tanggal,
      search,
      page,
      limit,
    });
    return { status: 'success', ...result };
  }

  @Get('literasi/:id')
  async getLiterasiById(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.getLiterasiById(sekolahId, id);
    return { status: 'success', data };
  }

  @Post('literasi')
  async createLiterasi(@Req() req: Request, @Body() dto: CreateLiterasiDto) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.createLiterasi(sekolahId, dto);
    return { status: 'success', message: 'Aktivitas literasi berhasil dicatat.', data };
  }

  @Put('literasi/:id')
  async updateLiterasi(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateLiterasiDto,
  ) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.updateLiterasi(sekolahId, id, dto);
    return { status: 'success', message: 'Aktivitas literasi berhasil diperbarui.', data };
  }

  @Delete('literasi/:id')
  async deleteLiterasi(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const data = await this.perpustakaanService.deleteLiterasi(sekolahId, id);
    return { status: 'success', message: 'Data literasi berhasil dihapus.', data };
  }
}
