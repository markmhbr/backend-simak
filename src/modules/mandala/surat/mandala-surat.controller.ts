import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, UseGuards } from '@nestjs/common';
import { MandalaSuratService } from './mandala-surat.service';
import { MandalaKeyGuard } from '../../../core/mandala/mandala-key.guard';
import type { Request } from 'express';

@Controller('mandala/surat')
@UseGuards(MandalaKeyGuard)
export class MandalaSuratController {
  constructor(private readonly suratService: MandalaSuratService) {}

  private getCadisdikId(req: Request): string {
    const user = req['user'] as any;
    if (!user || !user.cadisdik_id) {
      throw new Error('Cadisdik ID tidak terdeteksi dari context pengguna.');
    }
    return user.cadisdik_id;
  }

  // ==========================================
  // 1. PENGATURAN NOMOR SURAT ENDPOINTS
  // ==========================================

  @Post('pengaturan')
  async createPengaturanNomor(@Req() req: Request, @Body() body: any) {
    const cadisdikId = this.getCadisdikId(req);
    const data = await this.suratService.createPengaturanNomor(cadisdikId, body);
    return {
      status: 'success',
      message: 'Pengaturan penomoran surat berhasil dibuat.',
      data,
    };
  }

  @Get('pengaturan')
  async getPengaturanNomorList(@Req() req: Request) {
    const cadisdikId = this.getCadisdikId(req);
    const data = await this.suratService.getPengaturanNomorList(cadisdikId);
    return {
      status: 'success',
      data,
    };
  }

  @Patch('pengaturan/:id')
  async updatePengaturanNomor(@Param('id') id: string, @Body() body: any) {
    const data = await this.suratService.updatePengaturanNomor(id, body);
    return {
      status: 'success',
      message: 'Pengaturan penomoran surat berhasil diperbarui.',
      data,
    };
  }

  @Delete('pengaturan/:id')
  async deletePengaturanNomor(@Param('id') id: string) {
    await this.suratService.deletePengaturanNomor(id);
    return {
      status: 'success',
      message: 'Pengaturan penomoran surat berhasil dihapus.',
    };
  }

  // ==========================================
  // 2. TEMPLATE SURAT ENDPOINTS
  // ==========================================

  @Post('template')
  async createTemplate(@Req() req: Request, @Body() body: any) {
    const cadisdikId = this.getCadisdikId(req);
    const data = await this.suratService.createTemplate(cadisdikId, body);
    return {
      status: 'success',
      message: 'Template surat berhasil disimpan.',
      data,
    };
  }

  @Get('template')
  async getTemplateList(@Req() req: Request) {
    const cadisdikId = this.getCadisdikId(req);
    const data = await this.suratService.getTemplateList(cadisdikId);
    return {
      status: 'success',
      data,
    };
  }

  @Get('template/:id')
  async getTemplateDetail(@Param('id') id: string) {
    const data = await this.suratService.getTemplateDetail(id);
    return {
      status: 'success',
      data,
    };
  }

  @Patch('template/:id')
  async updateTemplate(@Param('id') id: string, @Body() body: any) {
    const data = await this.suratService.updateTemplate(id, body);
    return {
      status: 'success',
      message: 'Template surat berhasil diperbarui.',
      data,
    };
  }

  @Delete('template/:id')
  async deleteTemplate(@Param('id') id: string) {
    await this.suratService.deleteTemplate(id);
    return {
      status: 'success',
      message: 'Template surat berhasil dihapus.',
    };
  }

  // ==========================================
  // 3. SURAT MASUK ENDPOINTS
  // ==========================================

  @Post('masuk')
  async createSuratMasuk(@Req() req: Request, @Body() body: any) {
    const cadisdikId = this.getCadisdikId(req);
    const data = await this.suratService.createSuratMasuk(cadisdikId, body);
    return {
      status: 'success',
      message: 'Surat masuk berhasil dicatat.',
      data,
    };
  }

  @Get('masuk')
  async getSuratMasukList(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    const cadisdikId = this.getCadisdikId(req);
    return await this.suratService.getSuratMasukList(cadisdikId, { search, limit, page });
  }

  @Patch('masuk/:id')
  async updateSuratMasuk(@Param('id') id: string, @Body() body: any) {
    const data = await this.suratService.updateSuratMasuk(id, body);
    return {
      status: 'success',
      message: 'Surat masuk berhasil diperbarui.',
      data,
    };
  }

  @Delete('masuk/:id')
  async deleteSuratMasuk(@Param('id') id: string) {
    await this.suratService.deleteSuratMasuk(id);
    return {
      status: 'success',
      message: 'Surat masuk berhasil dihapus.',
    };
  }

  // ==========================================
  // 4. SURAT KELUAR ENDPOINTS
  // ==========================================

  @Post('keluar')
  async createSuratKeluar(@Req() req: Request, @Body() body: any) {
    const cadisdikId = this.getCadisdikId(req);
    const data = await this.suratService.createSuratKeluar(cadisdikId, body);
    return {
      status: 'success',
      message: 'Draft surat keluar berhasil dibuat.',
      data,
    };
  }

  @Get('keluar')
  async getSuratKeluarList(
    @Req() req: Request,
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('status') status?: string,
    @Query('kategori') kategori?: string,
  ) {
    const cadisdikId = this.getCadisdikId(req);
    return await this.suratService.getSuratKeluarList(cadisdikId, {
      search,
      limit,
      page,
      status,
      kategori,
    });
  }

  @Get('keluar/:id')
  async getSuratKeluarDetail(@Param('id') id: string) {
    const data = await this.suratService.getSuratKeluarDetail(id);
    return {
      status: 'success',
      data,
    };
  }

  @Patch('keluar/:id')
  async updateSuratKeluar(@Param('id') id: string, @Body() body: any) {
    const data = await this.suratService.updateSuratKeluar(id, body);
    return {
      status: 'success',
      message: 'Draft surat keluar berhasil diperbarui.',
      data,
    };
  }

  @Post('keluar/:id/terbitkan')
  async terbitkanSurat(@Param('id') id: string) {
    const data = await this.suratService.terbitkanSurat(id);
    return {
      status: 'success',
      message: 'Surat resmi berhasil diterbitkan.',
      data,
    };
  }

  @Get('keluar/:id/preview')
  async previewSurat(@Param('id') id: string) {
    const surat = await this.suratService.getSuratKeluarDetail(id);
    return {
      status: 'success',
      data: {
        konten_html: surat.isi_final_html,
        ukuran_kertas: surat.template_surat.ukuran_kertas,
        margin: {
          atas: surat.template_surat.margin_atas,
          bawah: surat.template_surat.margin_bawah,
          kiri: surat.template_surat.margin_kiri,
          kanan: surat.template_surat.margin_kanan,
        },
        nomor_surat: surat.nomor_surat || '[DRAFT - NOMOR AKAN GENERATED SAAT TERBIT]',
        status: surat.status,
      },
    };
  }

  @Delete('keluar/:id')
  async deleteSuratKeluar(@Param('id') id: string) {
    await this.suratService.deleteSuratKeluar(id);
    return {
      status: 'success',
      message: 'Draft surat keluar berhasil dihapus.',
    };
  }
}
