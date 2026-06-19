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
    async createLayanan(dto, defaultCadisdikId) {
        const cadisdikId = dto.cadisdik_id || defaultCadisdikId;
        if (!cadisdikId) {
            throw new common_1.BadRequestException('cadisdik_id is required');
        }
        return await this.prisma.layanan.create({
            data: {
                cadisdik_id: cadisdikId,
                nama_layanan: dto.nama_layanan,
                kategori: dto.kategori,
                aktif: dto.aktif ?? true,
            },
        });
    }
    async getLayanan(cadisdikId, kategori) {
        const where = { cadisdik_id: cadisdikId };
        if (kategori !== undefined)
            where.kategori = kategori;
        return await this.prisma.layanan.findMany({
            where,
            include: { syarat: { orderBy: { urutan: 'asc' } } },
            orderBy: { created_at: 'desc' },
        });
    }
    async updateLayanan(id, dto) {
        return await this.prisma.layanan.update({
            where: { layanan_id: id },
            data: dto,
        });
    }
    async deleteLayanan(id) {
        return await this.prisma.layanan.delete({
            where: { layanan_id: id },
        });
    }
    async createSyarat(layananId, dto) {
        return await this.prisma.layananSyarat.create({
            data: {
                layanan_id: layananId,
                nama_syarat: dto.nama_syarat,
                wajib: dto.wajib ?? true,
                urutan: dto.urutan,
                aktif: dto.aktif ?? true,
            },
        });
    }
    async updateSyarat(id, dto) {
        return await this.prisma.layananSyarat.update({
            where: { layanan_syarat_id: id },
            data: dto,
        });
    }
    async deleteSyarat(id) {
        return await this.prisma.layananSyarat.delete({
            where: { layanan_syarat_id: id },
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
                throw new common_1.BadRequestException('ptk_id wajib diisi untuk kategori GTK');
            dto.peserta_didik_id = null;
        }
        else if (dto.kategori === 1) {
            if (!dto.peserta_didik_id)
                throw new common_1.BadRequestException('peserta_didik_id wajib diisi untuk kategori Peserta Didik');
            dto.ptk_id = null;
        }
        else if (dto.kategori === 2) {
            dto.ptk_id = null;
            dto.peserta_didik_id = null;
        }
        const sekolah = await this.prisma.sekolah.findUnique({
            where: { sekolah_id: dto.sekolah_id },
            select: { cadisdik_id: true },
        });
        if (!sekolah?.cadisdik_id) {
            throw new common_1.BadRequestException('Sekolah tidak terasosiasi dengan Cabang Dinas (Cadisdik)');
        }
        const nomorPermohonan = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        return await this.prisma.permohonanLayanan.create({
            data: {
                cadisdik_id: sekolah.cadisdik_id,
                sekolah_id: dto.sekolah_id,
                layanan_id: dto.layanan_id,
                kategori: dto.kategori,
                ptk_id: dto.ptk_id,
                peserta_didik_id: dto.peserta_didik_id,
                nomor_permohonan: nomorPermohonan,
                keterangan: dto.keterangan,
                status: 1,
                tanggal_pengajuan: new Date(),
            },
        });
    }
    async getPermohonan(filters) {
        const where = {};
        if (filters.cadisdik_id)
            where.cadisdik_id = filters.cadisdik_id;
        if (filters.sekolah_id)
            where.sekolah_id = filters.sekolah_id;
        if (filters.status !== undefined)
            where.status = filters.status;
        if (filters.kategori !== undefined)
            where.kategori = filters.kategori;
        return await this.prisma.permohonanLayanan.findMany({
            where,
            include: {
                layanan: true,
                permohonan_layanan_file: {
                    include: { layanan_syarat: true }
                },
                permohonan_layanan_log: {
                    orderBy: { created_at: 'desc' },
                    include: { pegawai: { select: { nama_lengkap: true } } }
                }
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async getPermohonanById(id) {
        const permohonan = await this.prisma.permohonanLayanan.findUnique({
            where: { permohonan_layanan_id: id },
            include: {
                layanan: { include: { syarat: true } },
                permohonan_layanan_file: { include: { layanan_syarat: true } },
                permohonan_layanan_log: {
                    orderBy: { created_at: 'desc' },
                    include: { pegawai: { select: { nama_lengkap: true } } }
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
                data: {
                    status: dto.status,
                    updated_at: new Date()
                },
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
    async uploadFile(id, dto) {
        return await this.prisma.permohonanLayananFile.create({
            data: {
                permohonan_layanan_id: id,
                layanan_syarat_id: dto.layanan_syarat_id,
                jenis_file: dto.jenis_file,
                nama_file: dto.nama_file,
                file_url: dto.file_url,
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