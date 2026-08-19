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
exports.PengaturanUmumService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let PengaturanUmumService = class PengaturanUmumService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        try {
            await this.prisma.$executeRawUnsafe(`
        ALTER TABLE simak.pengaturan_umum 
        ADD COLUMN IF NOT EXISTS mode_presensi_guru SMALLINT DEFAULT 0;
      `);
        }
        catch (err) {
        }
    }
    async getSettings(sekolahId) {
        let settings = await this.prisma.pengaturanUmum.findUnique({
            where: { sekolah_id: sekolahId },
        });
        if (!settings) {
            return {
                sekolah_id: sekolahId,
                background_gtk: null,
                background_pd: null,
                waktu_mulai_pengajuan: null,
                waktu_sampai_pengajuan: null,
                mode_presensi_guru: 0,
            };
        }
        return settings;
    }
    async updateSettings(sekolahId, data) {
        const updated = await this.prisma.pengaturanUmum.upsert({
            where: { sekolah_id: sekolahId },
            update: {
                background_gtk: data.background_gtk,
                background_pd: data.background_pd,
                waktu_mulai_pengajuan: data.waktu_mulai_pengajuan,
                waktu_sampai_pengajuan: data.waktu_sampai_pengajuan,
                mode_presensi_guru: data.mode_presensi_guru !== undefined ? data.mode_presensi_guru : undefined,
            },
            create: {
                sekolah_id: sekolahId,
                background_gtk: data.background_gtk,
                background_pd: data.background_pd,
                waktu_mulai_pengajuan: data.waktu_mulai_pengajuan,
                waktu_sampai_pengajuan: data.waktu_sampai_pengajuan,
                mode_presensi_guru: data.mode_presensi_guru ?? 0,
            },
        });
        if (data.mode_presensi_guru !== undefined && data.mode_presensi_guru !== null) {
            await this.prisma.gtk.updateMany({
                where: { sekolah_id: sekolahId },
                data: { mode_presensi: data.mode_presensi_guru },
            });
        }
        return updated;
    }
};
exports.PengaturanUmumService = PengaturanUmumService;
exports.PengaturanUmumService = PengaturanUmumService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PengaturanUmumService);
//# sourceMappingURL=pengaturan-umum.service.js.map