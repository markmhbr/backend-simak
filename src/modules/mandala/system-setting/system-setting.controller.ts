import { Controller, Get, Post, Body, Param, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { SystemSettingService } from './system-setting.service';
import { MandalaKeyGuard } from '../../../core/mandala/mandala-key.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'appLogo', maxCount: 1 },
      { name: 'appLogoDark', maxCount: 1 },
      { name: 'appFavicon', maxCount: 1 },
    ]),
  )
  async upsertSettings(
    @Param('cadisdik_id') cadisdikId: string,
    @Body()
    body: {
      appName?: string;
      appShortName?: string;
      contactEmail?: string | null;
      contactPhone?: string | null;
      contactAddress?: string | null;
      copyrightText?: string;
      metaDescription?: string | null;
      metaKeywords?: string | null;
      maintenanceMode?: string | boolean;
    },
    @UploadedFiles()
    files?: {
      appLogo?: Express.Multer.File[];
      appLogoDark?: Express.Multer.File[];
      appFavicon?: Express.Multer.File[];
    },
  ) {
    const path = require('path');
    const { compressAndSaveImage } = require('../../../common/utils/upload.util');

    const destDir = path.join(process.cwd(), 'storage', 'settings', cadisdikId);

    let appLogoPath = undefined;
    let appLogoDarkPath = undefined;
    let appFaviconPath = undefined;

    if (files?.appLogo?.[0]) {
      const file = files.appLogo[0];
      await compressAndSaveImage(file.buffer, destDir, 'logo');
      appLogoPath = `/storage/settings/${cadisdikId}/logo.jpg`;
    }

    if (files?.appLogoDark?.[0]) {
      const file = files.appLogoDark[0];
      await compressAndSaveImage(file.buffer, destDir, 'logo_dark');
      appLogoDarkPath = `/storage/settings/${cadisdikId}/logo_dark.jpg`;
    }

    if (files?.appFavicon?.[0]) {
      const file = files.appFavicon[0];
      await compressAndSaveImage(file.buffer, destDir, 'favicon');
      appFaviconPath = `/storage/settings/${cadisdikId}/favicon.jpg`;
    }

    let maintenanceMode = body.maintenanceMode;
    if (typeof maintenanceMode === 'string') {
      maintenanceMode = maintenanceMode === 'true';
    }

    const payload = {
      appName: body.appName,
      appShortName: body.appShortName,
      contactEmail: body.contactEmail === 'null' ? null : body.contactEmail,
      contactPhone: body.contactPhone === 'null' ? null : body.contactPhone,
      contactAddress: body.contactAddress === 'null' ? null : body.contactAddress,
      copyrightText: body.copyrightText,
      metaDescription: body.metaDescription === 'null' ? null : body.metaDescription,
      metaKeywords: body.metaKeywords === 'null' ? null : body.metaKeywords,
      maintenanceMode: maintenanceMode as boolean | undefined,
      ...(appLogoPath ? { appLogo: appLogoPath } : {}),
      ...(appLogoDarkPath ? { appLogoDark: appLogoDarkPath } : {}),
      ...(appFaviconPath ? { appFavicon: appFaviconPath } : {}),
    };

    const data = await this.service.upsertSettings(cadisdikId, payload);
    return {
      status: 'success',
      message: 'System settings successfully updated.',
      data,
    };
  }
}
