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
exports.PengaturanVaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let PengaturanVaService = class PengaturanVaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSettings(sekolahId) {
        let settings = await this.prisma.pengaturanVa.findUnique({
            where: { sekolah_id: sekolahId },
        });
        if (!settings) {
            return {
                sekolah_id: sekolahId,
                is_active: false,
                client_id: null,
                secret_key: null,
                private_key: null,
                bjb_public_key: null,
                api_url: null,
                mode: 'sandbox',
            };
        }
        return settings;
    }
    async updateSettings(sekolahId, data) {
        return this.prisma.pengaturanVa.upsert({
            where: { sekolah_id: sekolahId },
            update: {
                is_active: data.is_active,
                client_id: data.client_id,
                secret_key: data.secret_key,
                private_key: data.private_key,
                bjb_public_key: data.bjb_public_key,
                api_url: data.api_url,
                mode: data.mode,
            },
            create: {
                sekolah_id: sekolahId,
                is_active: data.is_active ?? false,
                client_id: data.client_id,
                secret_key: data.secret_key,
                private_key: data.private_key,
                bjb_public_key: data.bjb_public_key,
                api_url: data.api_url,
                mode: data.mode ?? 'sandbox',
            },
        });
    }
};
exports.PengaturanVaService = PengaturanVaService;
exports.PengaturanVaService = PengaturanVaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PengaturanVaService);
//# sourceMappingURL=pengaturan-va.service.js.map