import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards, BadRequestException } from '@nestjs/common';
import { LayananMandalaService } from './layanan-mandala.service';
import { 
  CreateLayananDto, 
  CreateLayananSyaratDto, 
  CreatePermohonanLayananDto, 
  CreatePermohonanLayananFileDto,
  UpdatePermohonanStatusDto
} from './dto/layanan-mandala.dto';
import { MandalaKeyGuard } from '../../core/mandala/mandala-key.guard';

@Controller('layanan-mandala')
@UseGuards(MandalaKeyGuard)
export class LayananMandalaController {
  constructor(private readonly layananMandalaService: LayananMandalaService) {}

  // --- Master Layanan ---

  @Post('master')
  async createLayanan(@Body() dto: CreateLayananDto) {
    return {
      status: 'success',
      data: await this.layananMandalaService.createLayanan(dto),
    };
  }

  @Get('master')
  async getLayanan(@Query('kategori') kategori?: string) {
    const cat = kategori !== undefined ? parseInt(kategori, 10) : undefined;
    return {
      status: 'success',
      data: await this.layananMandalaService.getLayanan(cat),
    };
  }

  @Patch('master/:id')
  async updateLayanan(@Param('id') id: string, @Body() dto: Partial<CreateLayananDto>) {
    return {
      status: 'success',
      data: await this.layananMandalaService.updateLayanan(id, dto),
    };
  }

  // --- Master Syarat ---

  @Post('master/:layananId/syarat')
  async createSyarat(@Param('layananId') layananId: string, @Body() dto: CreateLayananSyaratDto) {
    return {
      status: 'success',
      data: await this.layananMandalaService.createSyarat(layananId, dto),
    };
  }

  @Get('master/:layananId/syarat')
  async getSyarat(@Param('layananId') layananId: string) {
    return {
      status: 'success',
      data: await this.layananMandalaService.getSyaratByLayanan(layananId),
    };
  }

  // --- Permohonan Layanan ---

  @Post('permohonan')
  async createPermohonan(@Body() dto: CreatePermohonanLayananDto) {
    return {
      status: 'success',
      message: 'Permohonan layanan berhasil diajukan',
      data: await this.layananMandalaService.createPermohonan(dto),
    };
  }

  @Get('permohonan')
  async getPermohonan(
    @Query('sekolah_id') sekolahId?: string,
    @Query('status') status?: string,
    @Query('kategori') kategori?: string,
  ) {
    const filters = {
      sekolah_id: sekolahId,
      status: status !== undefined ? parseInt(status, 10) : undefined,
      kategori: kategori !== undefined ? parseInt(kategori, 10) : undefined,
    };
    return {
      status: 'success',
      data: await this.layananMandalaService.getPermohonan(filters),
    };
  }

  @Get('permohonan/:id')
  async getPermohonanById(@Param('id') id: string) {
    return {
      status: 'success',
      data: await this.layananMandalaService.getPermohonanById(id),
    };
  }

  @Patch('permohonan/:id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdatePermohonanStatusDto) {
    return {
      status: 'success',
      message: 'Status permohonan berhasil diperbarui',
      data: await this.layananMandalaService.updatePermohonanStatus(id, dto),
    };
  }

  // --- Permohonan File ---

  @Post('permohonan/:id/file')
  async uploadFile(@Param('id') id: string, @Body() dto: CreatePermohonanLayananFileDto) {
    return {
      status: 'success',
      message: 'File berhasil diunggah',
      data: await this.layananMandalaService.uploadFile(id, dto),
    };
  }

  @Patch('file/:fileId/status')
  async updateFileStatus(
    @Param('fileId') fileId: string,
    @Body() body: { status: number; catatan?: string },
  ) {
    if (body.status === undefined) throw new BadRequestException('status is required');
    return {
      status: 'success',
      message: 'Status file berhasil diperbarui',
      data: await this.layananMandalaService.updateFileStatus(fileId, body.status, body.catatan),
    };
  }
}
