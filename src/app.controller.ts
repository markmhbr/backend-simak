import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './core/app-key/api-key.guard';
import type { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-protected')
  @UseGuards(ApiKeyGuard)
  getProtectedData(@Req() req: Request) {
    const appKey = req['appKey'];
    return {
      message: 'Selamat, Anda berhasil mengakses endpoint terproteksi!',
      app_info: {
        id: appKey.id,
        nama_app: appKey.nama_app,
        sekolah_id: appKey.sekolah_id,
        key_api: appKey.key_api,
      },
    };
  }
}

