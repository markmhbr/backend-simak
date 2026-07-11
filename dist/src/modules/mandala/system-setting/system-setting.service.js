"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemSettingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../core/prisma/prisma.service");
let SystemSettingService = class SystemSettingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings(cadisdikId) {
        let settings = await this.prisma.systemSetting.findUnique({
            where: { cadisdik_id: cadisdikId },
        });
        if (!settings) {
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
    async upsertSettings(cadisdikId, data) {
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
};
exports.SystemSettingService = SystemSettingService;
exports.SystemSettingService = SystemSettingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SystemSettingService);
//# sourceMappingURL=system-setting.service.js.map