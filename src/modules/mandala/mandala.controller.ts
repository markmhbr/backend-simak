import { Controller, Get, Post, Body, Param, UseGuards, HttpStatus, HttpCode, NotFoundException } from '@nestjs/common';
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
}
