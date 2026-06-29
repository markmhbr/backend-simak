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
exports.PengajuanPerbaikanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let PengajuanPerbaikanService = class PengajuanPerbaikanService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async buatPengajuan(sekolahId, payload) {
        if (!payload.tipe || !['GTK', 'SISWA'].includes(payload.tipe)) {
            throw new common_1.BadRequestException('Tipe pengajuan tidak valid. Harus GTK atau SISWA.');
        }
        if (payload.tipe === 'GTK' && !payload.ptk_id) {
            throw new common_1.BadRequestException('ptk_id harus diisi untuk tipe pengajuan GTK.');
        }
        if (payload.tipe === 'SISWA' && !payload.peserta_didik_id) {
            throw new common_1.BadRequestException('peserta_didik_id harus diisi untuk tipe pengajuan SISWA.');
        }
        return this.prisma.pengajuanPerbaikan.create({
            data: {
                sekolah_id: sekolahId,
                ptk_id: payload.ptk_id || null,
                peserta_didik_id: payload.peserta_didik_id || null,
                tipe: payload.tipe,
                perubahan: payload.perubahan,
                status: 'PENDING',
            },
        });
    }
    async dapatkanDaftar(sekolahId) {
        const list = await this.prisma.pengajuanPerbaikan.findMany({
            where: {
                sekolah_id: sekolahId,
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        const enrichedList = await Promise.all(list.map(async (item) => {
            let nama = 'Unknown';
            if (item.tipe === 'GTK' && item.ptk_id) {
                const ptk = await this.prisma.gtk.findUnique({
                    where: { ptk_id: item.ptk_id },
                    select: { nama: true }
                });
                if (ptk)
                    nama = ptk.nama;
            }
            else if (item.tipe === 'SISWA' && item.peserta_didik_id) {
                const pd = await this.prisma.pesertaDidik.findUnique({
                    where: { peserta_didik_id: item.peserta_didik_id },
                    select: { nama: true }
                });
                if (pd)
                    nama = pd.nama;
            }
            return {
                ...item,
                nama,
            };
        }));
        return enrichedList;
    }
    async setujuiPengajuan(sekolahId, id) {
        const pengajuan = await this.prisma.pengajuanPerbaikan.findFirst({
            where: { id, sekolah_id: sekolahId },
        });
        if (!pengajuan) {
            throw new common_1.NotFoundException('Data pengajuan tidak ditemukan.');
        }
        const perubahan = pengajuan.perubahan;
        const updateData = {};
        for (const key in perubahan) {
            if (perubahan[key] && perubahan[key].diajukan !== undefined) {
                updateData[key] = perubahan[key].diajukan;
            }
        }
        if (pengajuan.tipe === 'GTK') {
            await this.prisma.gtk.update({
                where: { ptk_id: pengajuan.ptk_id },
                data: updateData,
            });
        }
        else if (pengajuan.tipe === 'SISWA') {
            await this.prisma.pesertaDidik.update({
                where: { peserta_didik_id: pengajuan.peserta_didik_id },
                data: updateData,
            });
        }
        await this.prisma.pengajuanPerbaikan.delete({
            where: { id },
        });
        return { status: 'success', message: 'Pengajuan disetujui, data diperbarui, dan log pengajuan dihapus.' };
    }
    async tolakPengajuan(sekolahId, id) {
        const pengajuan = await this.prisma.pengajuanPerbaikan.findFirst({
            where: { id, sekolah_id: sekolahId },
        });
        if (!pengajuan) {
            throw new common_1.NotFoundException('Data pengajuan tidak ditemukan.');
        }
        await this.prisma.pengajuanPerbaikan.delete({
            where: { id },
        });
        return { status: 'success', message: 'Pengajuan ditolak dan log pengajuan dihapus.' };
    }
};
exports.PengajuanPerbaikanService = PengajuanPerbaikanService;
exports.PengajuanPerbaikanService = PengajuanPerbaikanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PengajuanPerbaikanService);
//# sourceMappingURL=pengajuan-perbaikan.service.js.map