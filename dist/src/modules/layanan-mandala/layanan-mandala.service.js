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
exports.LayananMandalaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let LayananMandalaService = class LayananMandalaService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createLayanan(dto) {
        return await this.prisma.layanan.create({
            data: dto,
        });
    }
    async getLayanan(kategori) {
        return await this.prisma.layanan.findMany({
            where: kategori !== undefined ? { kategori, aktif: true } : { aktif: true },
            include: { syarat: true },
            orderBy: { nama_layanan: 'asc' },
        });
    }
    async updateLayanan(id, dto) {
        return await this.prisma.layanan.update({
            where: { layanan_id: id },
            data: dto,
        });
    }
    async createSyarat(layananId, dto) {
        return await this.prisma.layananSyarat.create({
            data: {
                ...dto,
                layanan_id: layananId,
            },
        });
    }
    async getSyaratByLayanan(layananId) {
        return await this.prisma.layananSyarat.findMany({
            where: { layanan_id: layananId, aktif: true },
            orderBy: { urutan: 'asc' },
        });
    }
    async createPermohonan(dto) {
        if (dto.kategori === 0) {
            if (!dto.ptk_id)
                throw new common_1.BadRequestException('ptk_id wajib terisi untuk kategori GTK');
            if (dto.peserta_didik_id)
                throw new common_1.BadRequestException('peserta_didik_id harus NULL untuk kategori GTK');
        }
        else if (dto.kategori === 1) {
            if (!dto.peserta_didik_id)
                throw new common_1.BadRequestException('peserta_didik_id wajib terisi untuk kategori Peserta Didik');
            if (dto.ptk_id)
                throw new common_1.BadRequestException('ptk_id harus NULL untuk kategori Peserta Didik');
        }
        else if (dto.kategori === 2) {
            if (dto.ptk_id || dto.peserta_didik_id)
                throw new common_1.BadRequestException('ptk_id dan peserta_didik_id harus NULL for kategori Sekolah');
        }
        else {
            throw new common_1.BadRequestException('Kategori tidak valid');
        }
        return await this.prisma.permohonanLayanan.create({
            data: {
                ...dto,
                status: 1,
                tanggal_pengajuan: new Date(),
            },
        });
    }
    async getPermohonan(filters) {
        return await this.prisma.permohonanLayanan.findMany({
            where: filters,
            include: {
                layanan: true,
                permohonan_layanan_file: true,
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async getPermohonanById(id) {
        const permohonan = await this.prisma.permohonanLayanan.findUnique({
            where: { permohonan_layanan_id: id },
            include: {
                layanan: {
                    include: { syarat: true }
                },
                permohonan_layanan_file: true,
                permohonan_layanan_log: {
                    include: { pegawai: true },
                    orderBy: { created_at: 'desc' }
                }
            },
        });
        if (!permohonan)
            throw new common_1.NotFoundException('Permohonan tidak ditemukan');
        return permohonan;
    }
    async updatePermohonanStatus(id, dto) {
        return await this.prisma.$transaction(async (tx) => {
            const permohonan = await tx.permohonanLayanan.update({
                where: { permohonan_layanan_id: id },
                data: { status: dto.status },
            });
            await tx.permohonanLayananLog.create({
                data: {
                    permohonan_layanan_id: id,
                    pegawai_id: dto.pegawai_id,
                    status: dto.status,
                    catatan: dto.catatan,
                },
            });
            return permohonan;
        });
    }
    async uploadFile(permohonanId, dto) {
        return await this.prisma.permohonanLayananFile.create({
            data: {
                ...dto,
                permohonan_layanan_id: permohonanId,
                status: 0,
            },
        });
    }
    async updateFileStatus(fileId, status, catatan) {
        return await this.prisma.permohonanLayananFile.update({
            where: { permohonan_layanan_file_id: fileId },
            data: { status, catatan },
        });
    }
};
exports.LayananMandalaService = LayananMandalaService;
exports.LayananMandalaService = LayananMandalaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LayananMandalaService);
//# sourceMappingURL=layanan-mandala.service.js.map