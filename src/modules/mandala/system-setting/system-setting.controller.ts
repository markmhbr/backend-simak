import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SystemSettingService } from './system-setting.service';
import { MandalaKeyGuard } from '../../../core/mandala/mandala-key.guard';

@Controller('mandala/system-setting')
@UseGuards(MandalaKeyGuard)
export class SystemSettingController {
  constructor(private readonly service: SystemSettingService) {}

  @Get(':cadisdik_id')
  async getSettings(@Param('cadisdik_id') cadisdikId: string) {
    const data = await this.service.getSettings(cadisdikId);
    return {
      status: 'success',
      data,
    };
  }

  @Post(':cadisdik_id')
  async upsertSettings(
    @Param('cadisdik_id') cadisdikId: string,
    @Body()
    body: {
      appName?: string;
      appShortName?: string;
      appLogo?: string | null;
      appLogoDark?: string | null;
      appFavicon?: string | null;
      contactEmail?: string | null;
      contactPhone?: string | null;
      contactAddress?: string | null;
      copyrightText?: string;
      metaDescription?: string | null;
      metaKeywords?: string | null;
      maintenanceMode?: boolean;
    },
  ) {
    const data = await this.service.upsertSettings(cadisdikId, body);
    return {
      status: 'success',
      message: 'System settings successfully updated.',
      data,
    };
  }
}
