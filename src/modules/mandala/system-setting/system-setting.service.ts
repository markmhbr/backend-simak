import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class SystemSettingService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(cadisdikId: string) {
    let settings = await this.prisma.systemSetting.findUnique({
      where: { cadisdik_id: cadisdikId },
    });

    if (!settings) {
      // Return defaults if not configured yet
      return {
        system_setting_id: null,
        cadisdik_id: cadisdikId,
        appName: 'SIMAK',
        appShortName: 'Mandala',
        appLogo: null,
        appLogoDark: null,
        appFavicon: null,
        contactEmail: null,
        contactPhone: null,
        contactAddress: null,
        copyrightText: '© 2026 SIMAK. All Rights Reserved.',
        metaDescription: null,
        metaKeywords: null,
        maintenanceMode: false,
      };
    }

    return settings;
  }

  async upsertSettings(
    cadisdikId: string,
    data: {
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
    return this.prisma.systemSetting.upsert({
      where: { cadisdik_id: cadisdikId },
      update: {
        appName: data.appName,
        appShortName: data.appShortName,
        appLogo: data.appLogo,
        appLogoDark: data.appLogoDark,
        appFavicon: data.appFavicon,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        contactAddress: data.contactAddress,
        copyrightText: data.copyrightText,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        maintenanceMode: data.maintenanceMode,
      },
      create: {
        cadisdik_id: cadisdikId,
        appName: data.appName ?? 'SIMAK',
        appShortName: data.appShortName ?? 'Mandala',
        appLogo: data.appLogo,
        appLogoDark: data.appLogoDark,
        appFavicon: data.appFavicon,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        contactAddress: data.contactAddress,
        copyrightText: data.copyrightText ?? '© 2026 SIMAK. All Rights Reserved.',
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        maintenanceMode: data.maintenanceMode ?? false,
      },
    });
  }
}
