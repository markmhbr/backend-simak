import { SystemSettingService } from './system-setting.service';
export declare class SystemSettingController {
    private readonly service;
    constructor(service: SystemSettingService);
    getSettings(cadisdikId: string): Promise<{
        status: string;
        data: {
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
        };
    }>;
    upsertSettings(cadisdikId: string, body: {
        appName?: string;
        appShortName?: string;
        contactEmail?: string | null;
        contactPhone?: string | null;
        contactAddress?: string | null;
        copyrightText?: string;
        metaDescription?: string | null;
        metaKeywords?: string | null;
        maintenanceMode?: string | boolean;
    }, files?: {
        appLogo?: Express.Multer.File[];
        appLogoDark?: Express.Multer.File[];
        appFavicon?: Express.Multer.File[];
    }): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
}
