import { Controller, Get, Post, Body, Param, UseGuards, HttpStatus, HttpCode, NotFoundException, Query, BadRequestException } from '@nestjs/common';
import { MandalaService } from './mandala.service';
import { MandalaKeyGuard } from '../../core/mandala/mandala-key.guard';

@Controller('mandala')
export class MandalaController {
  constructor(private readonly mandalaService: MandalaService) {}

  @Get('connection')
  async getConnection() {
    const config = await this.mandalaService.getConnection();
    if (!config) {
      throw new NotFoundException('Mandala connection is not configured yet.');
    }
    return {
      status: 'success',
      data: config,
    };
  }

  @Post('connection')
  @HttpCode(HttpStatus.OK)
  async updateConnection(@Body() body: { key: string; url_mandala: string }) {
    if (!body.key || !body.url_mandala) {
      return {
        status: 'error',
        message: 'Both key and url_mandala are required.',
      };
    }
    const result = await this.mandalaService.saveOrUpdateConnection(body.key, body.url_mandala);
    return {
      status: 'success',
      message: 'Mandala connection successfully updated.',
      data: result,
    };
  }

  @Get('sekolah')
  @UseGuards(MandalaKeyGuard)
  async getSchools() {
    const data = await this.mandalaService.getSchools();
    return {
      status: 'success',
      data,
    };
  }

  @Get('sekolah/:id')
  @UseGuards(MandalaKeyGuard)
  async getSchoolDetail(@Param('id') id: string) {
    const data = await this.mandalaService.getSchoolDetail(id);
    if (!data) {
      throw new NotFoundException(`School with ID ${id} not found.`);
    }
    return {
      status: 'success',
      data,
    };
  }

  @Get('sekolah/:id/summary')
  @UseGuards(MandalaKeyGuard)
  async getSchoolSummary(@Param('id') id: string) {
    const data = await this.mandalaService.getSchoolSummary(id);
    if (!data) {
      throw new NotFoundException(`School with ID ${id} not found.`);
    }
    return {
      status: 'success',
      data,
    };
  }

  @Get('dapodik/peserta-didik')
  @UseGuards(MandalaKeyGuard)
  async getPesertaDidik(
    @Query('sekolah_id') sekolahId?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('status') status?: 'aktif' | 'non-aktif'
  ) {
    let take = limit ? parseInt(limit, 10) : 10;
    if (take > 100) {
      take = 100; // Cap at 100 to optimize performance
    }
    const skipPage = page ? parseInt(page, 10) : 1;
    return await this.mandalaService.getPesertaDidikForMandala(sekolahId, {
      limit: take,
      page: skipPage,
      search,
      status
    });
  }

  @Get('dapodik/gtk')
  @UseGuards(MandalaKeyGuard)
  async getGtk(
    @Query('sekolah_id') sekolahId?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('status') status?: 'aktif' | 'non-aktif',
    @Query('type') type?: 'guru' | 'tendik'
  ) {
    let take = limit ? parseInt(limit, 10) : 10;
    if (take > 100) {
      take = 100; // Cap at 100 to optimize performance
    }
    const skipPage = page ? parseInt(page, 10) : 1;
    return await this.mandalaService.getGtkForMandala(sekolahId, {
      limit: take,
      page: skipPage,
      search,
      status,
      type
    });
  }
}
