import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PengaturanVaService } from './pengaturan-va.service';
import { UpdatePengaturanVaDto } from './dto/update-pengaturan-va.dto';

@Controller('pengaturan-va')
export class PengaturanVaController {
  constructor(private readonly service: PengaturanVaService) {}

  @Get(':sekolah_id')
  async getSettings(@Param('sekolah_id') sekolahId: string) {
    const data = await this.service.getSettings(sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Post(':sekolah_id')
  async updateSettings(
    @Param('sekolah_id') sekolahId: string,
    @Body() body: UpdatePengaturanVaDto,
  ) {
    const data = await this.service.updateSettings(sekolahId, body);
    return {
      status: 'success',
      message: 'Konfigurasi BJB Virtual Account berhasil disimpan.',
      data,
    };
  }
}
