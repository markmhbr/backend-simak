import { Controller, UseGuards, Req } from '@nestjs/common';
import { KurikulumService } from './kurikulum.service';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';
import type { Request } from 'express';

@Controller('kurikulum')
@UseGuards(ApiKeyGuard)
export class KurikulumController {
  constructor(private readonly kurikulumService: KurikulumService) {}

  private getSekolahInfo(req: Request) {
    const appKey = req['appKey'];
    return {
      sekolahId: appKey.sekolah_id,
      namaApp: appKey.nama_app,
    };
  }

  // Jadwal-related endpoints have been moved to JadwalController (/jadwal/*)
  // Add kurikulum-specific endpoints here as needed
}
