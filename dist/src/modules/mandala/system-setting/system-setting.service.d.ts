import { PrismaService } from '../../../core/prisma/prisma.service';
export declare class SystemSettingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(cadisdikId: string): Promise<{
        cadisdik_id: string;
        system_setting_id: string;
        appName: string;
        appShortName: string;
        appLogo: string | null;
        appLogoDark: string | null;
        appFavicon: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        contactAddress: string | null;
        copyrightText: string;
        metaDescription: string | null;
        metaKeywords: string | null;
        maintenanceMode: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | {
        system_setting_id: any;
        cadisdik_id: string;
        appName: string;
        appShortName: string;
        appLogo: any;
        appLogoDark: any;
        appFavicon: any;
        contactEmail: any;
        contactPhone: any;
        contactAddress: any;
        copyrightText: string;
        metaDescription: any;
        metaKeywords: any;
        maintenanceMode: boolean;
    }>;
    upsertSettings(cadisdikId: string, data: {
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
    }): Promise<{
        cadisdik_id: string;
        system_setting_id: string;
        appName: string;
        appShortName: string;
        appLogo: string | null;
        appLogoDark: string | null;
        appFavicon: string | null;
        contactEmail: string | null;
        contactPhone: string | null;
        contactAddress: string | null;
        copyrightText: string;
        metaDescription: string | null;
        metaKeywords: string | null;
        maintenanceMode: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
