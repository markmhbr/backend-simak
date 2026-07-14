import { 
  Controller, 
  Get, 
  Post, 
  Patch, 
  Body, 
  Param, 
  UseGuards, 
  Req, 
  UseInterceptors, 
  UploadedFile, 
  BadRequestException 
} from '@nestjs/common';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import { MutasiPdService } from './mutasi-pd.service';

@Controller('kurikulum/mutasi-pd')
@UseGuards(ApiKeyGuard)
export class MutasiPdController {
  constructor(private readonly mutasiService: MutasiPdService) {}

  private getSekolahId(req: Request): string {
    const appKey = req['appKey'];
    const sekolahId = appKey?.sekolah_id;
    if (!sekolahId) {
      throw new BadRequestException('Sekolah ID tidak terdeteksi dari API Key.');
    }
    return sekolahId;
  }

  @Get('reference')
  async getReference() {
    return this.mutasiService.getReferenceJenisKeluar();
  }

  @Get(':sekolahId')
  async getList(@Req() req: Request, @Param('sekolahId') paramSekolahId: string) {
    const sekolahId = this.getSekolahId(req);
    // Pastikan operator hanya bisa mengakses sekolah miliknya sendiri
    if (sekolahId !== paramSekolahId) {
      throw new BadRequestException('Akses ditolak. ID Sekolah tidak cocok.');
    }
    const data = await this.mutasiService.getMutasiPdList(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req: Request,
    @Body() data: { peserta_didik_id: string; jenis_keluar_id: string; alasan?: string },
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const sekolahId = this.getSekolahId(req);
    if (!data.peserta_didik_id || !data.jenis_keluar_id) {
      throw new BadRequestException('peserta_didik_id dan jenis_keluar_id wajib diisi.');
    }
    const user = req['user'] as any;
    const ptkId = user?.ptkId || null;

    const res = await this.mutasiService.createMutasiPd(sekolahId, data, ptkId, file);
    return {
      status: 'success',
      message: 'Pengajuan mutasi berhasil dibuat.',
      data: res,
    };
  }

  @Patch(':id/approve')
  async approve(@Req() req: Request, @Param('id') id: string) {
    const sekolahId = this.getSekolahId(req);
    const res = await this.mutasiService.approveMutasiPd(sekolahId, id);
    return {
      status: 'success',
      message: 'Pengajuan mutasi berhasil disetujui.',
      data: res,
    };
  }

  @Patch(':id/reject')
  async reject(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() body: { alasan_tolak: string },
  ) {
    const sekolahId = this.getSekolahId(req);
    if (!body.alasan_tolak) {
      throw new BadRequestException('Alasan penolakan wajib disertakan.');
    }
    const res = await this.mutasiService.rejectMutasiPd(sekolahId, id, body.alasan_tolak);
    return {
      status: 'success',
      message: 'Pengajuan mutasi berhasil ditolak.',
      data: res,
    };
  }
}
