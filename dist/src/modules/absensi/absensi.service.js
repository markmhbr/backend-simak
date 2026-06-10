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
exports.AbsensiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let AbsensiService = class AbsensiService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHariLibur(sekolahId) {
        return this.prisma.hariLibur.findMany({
            where: { sekolah_id: sekolahId },
            orderBy: { tanggal_mulai: 'asc' },
        });
    }
    async createHariLibur(sekolahId, data) {
        return this.prisma.hariLibur.create({
            data: {
                sekolah_id: sekolahId,
                nama: data.nama,
                tanggal_mulai: new Date(data.tanggal_mulai),
                tanggal_selesai: new Date(data.tanggal_selesai),
                keterangan: data.keterangan,
            },
        });
    }
    async deleteHariLibur(sekolahId, hariLiburId) {
        return this.prisma.hariLibur.deleteMany({
            where: { hari_libur_id: hariLiburId, sekolah_id: sekolahId },
        });
    }
    async checkHoliday(sekolahId, date) {
        const holiday = await this.prisma.hariLibur.findFirst({
            where: {
                sekolah_id: sekolahId,
                aktif: true,
                tanggal_mulai: { lte: date },
                tanggal_selesai: { gte: date },
            },
        });
        return holiday;
    }
    async getActiveSchedule(sekolahId, dayOfWeek) {
        const activeJenis = await this.prisma.jenisJadwal.findFirst({
            where: { sekolah_id: sekolahId, aktif: true },
            include: {
                pengaturan_hari: {
                    where: { hari: dayOfWeek, aktif: true },
                },
            },
        });
        if (!activeJenis) {
            throw new common_1.BadRequestException('Sekolah belum memiliki jadwal aktif');
        }
        const dayConfig = activeJenis.pengaturan_hari[0];
        if (!dayConfig) {
            throw new common_1.BadRequestException('Jadwal tidak aktif untuk hari ini');
        }
        return dayConfig;
    }
    async absenPesertaDidik(sekolahId, data) {
        const dateObj = new Date(data.waktu);
        const dateOnly = new Date(dateObj.toISOString().split('T')[0]);
        const dayOfWeek = dateObj.getUTCDay() === 0 ? 7 : dateObj.getUTCDay();
        const holiday = await this.checkHoliday(sekolahId, dateOnly);
        if (holiday) {
            throw new common_1.BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}`);
        }
        const dayConfig = await this.getActiveSchedule(sekolahId, dayOfWeek);
        const currentTimeMinutes = dateObj.getUTCHours() * 60 + dateObj.getUTCMinutes();
        const configInMinutes = dayConfig.jam_masuk.getUTCHours() * 60 + dayConfig.jam_masuk.getUTCMinutes();
        const configOutMinutes = dayConfig.jam_pulang.getUTCHours() * 60 + dayConfig.jam_pulang.getUTCMinutes();
        if (data.tipe === 'masuk') {
            const status_masuk = currentTimeMinutes > configInMinutes ? 2 : 1;
            return this.prisma.absensiPesertaDidik.upsert({
                where: {
                    peserta_didik_id_tanggal: {
                        peserta_didik_id: data.peserta_didik_id,
                        tanggal: dateOnly,
                    },
                },
                update: {
                    jam_masuk: dateObj,
                    status_masuk,
                    sekolah_id: sekolahId,
                },
                create: {
                    peserta_didik_id: data.peserta_didik_id,
                    tanggal: dateOnly,
                    jam_masuk: dateObj,
                    status_masuk,
                    sekolah_id: sekolahId,
                },
            });
        }
        else {
            const status_pulang = currentTimeMinutes < configOutMinutes ? 2 : 1;
            return this.prisma.absensiPesertaDidik.upsert({
                where: {
                    peserta_didik_id_tanggal: {
                        peserta_didik_id: data.peserta_didik_id,
                        tanggal: dateOnly,
                    },
                },
                update: {
                    jam_pulang: dateObj,
                    status_pulang,
                    sekolah_id: sekolahId,
                },
                create: {
                    peserta_didik_id: data.peserta_didik_id,
                    tanggal: dateOnly,
                    jam_pulang: dateObj,
                    status_pulang,
                    sekolah_id: sekolahId,
                },
            });
        }
    }
    async absenGtk(sekolahId, data) {
        const dateObj = new Date(data.waktu);
        const dateOnly = new Date(dateObj.toISOString().split('T')[0]);
        const dayOfWeek = dateObj.getUTCDay() === 0 ? 7 : dateObj.getUTCDay();
        const holiday = await this.checkHoliday(sekolahId, dateOnly);
        if (holiday)
            throw new common_1.BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}`);
        const dayConfig = await this.getActiveSchedule(sekolahId, dayOfWeek);
        const currentTimeMinutes = dateObj.getUTCHours() * 60 + dateObj.getUTCMinutes();
        const configInMinutes = dayConfig.jam_masuk.getUTCHours() * 60 + dayConfig.jam_masuk.getUTCMinutes();
        const configOutMinutes = dayConfig.jam_pulang.getUTCHours() * 60 + dayConfig.jam_pulang.getUTCMinutes();
        if (data.tipe === 'masuk') {
            const status_masuk = currentTimeMinutes > configInMinutes ? 2 : 1;
            return this.prisma.absensiGtk.upsert({
                where: {
                    ptk_id_tanggal: {
                        ptk_id: data.ptk_id,
                        tanggal: dateOnly,
                    },
                },
                update: {
                    jam_masuk: dateObj,
                    status_masuk,
                    sekolah_id: sekolahId,
                },
                create: {
                    ptk_id: data.ptk_id,
                    tanggal: dateOnly,
                    jam_masuk: dateObj,
                    status_masuk,
                    sekolah_id: sekolahId,
                },
            });
        }
        else {
            const status_pulang = currentTimeMinutes < configOutMinutes ? 2 : 1;
            return this.prisma.absensiGtk.upsert({
                where: {
                    ptk_id_tanggal: {
                        ptk_id: data.ptk_id,
                        tanggal: dateOnly,
                    },
                },
                update: {
                    jam_pulang: dateObj,
                    status_pulang,
                    sekolah_id: sekolahId,
                },
                create: {
                    ptk_id: data.ptk_id,
                    tanggal: dateOnly,
                    jam_pulang: dateObj,
                    status_pulang,
                    sekolah_id: sekolahId,
                },
            });
        }
    }
    async absenMapel(sekolahId, data) {
        const dateOnly = new Date(data.tanggal);
        const holiday = await this.checkHoliday(sekolahId, dateOnly);
        if (holiday)
            throw new common_1.BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}`);
        return this.prisma.absensiMapel.upsert({
            where: {
                jadwal_pelajaran_id_peserta_didik_id_tanggal: {
                    jadwal_pelajaran_id: data.jadwal_pelajaran_id,
                    peserta_didik_id: data.peserta_didik_id,
                    tanggal: dateOnly,
                },
            },
            update: {
                status: data.status,
                waktu_absen: new Date(),
                sekolah_id: sekolahId,
            },
            create: {
                jadwal_pelajaran_id: data.jadwal_pelajaran_id,
                peserta_didik_id: data.peserta_didik_id,
                tanggal: dateOnly,
                status: data.status,
                waktu_absen: new Date(),
                sekolah_id: sekolahId,
            },
        });
    }
    async createIzin(sekolahId, data) {
        return this.prisma.izin.create({
            data: {
                sekolah_id: sekolahId,
                peserta_didik_id: data.peserta_didik_id,
                ptk_id: data.ptk_id,
                jenis: data.jenis,
                tanggal: new Date(data.tanggal),
                keterangan: data.keterangan,
            },
        });
    }
    async getAttendanceConfig(sekolahId) {
        const sekolah = await this.prisma.sekolah.findUnique({
            where: { sekolah_id: sekolahId },
            select: { nama: true, sekolah_id: true },
        });
        if (!sekolah)
            throw new common_1.NotFoundException('Sekolah tidak ditemukan');
        const appKey = await this.prisma.appKey.findUnique({
            where: { sekolah_id: sekolahId },
        });
        return {
            sekolah_nama: sekolah.nama,
            sekolah_id: sekolah.sekolah_id,
            base_url: appKey?.domain || '',
        };
    }
    async findUserByQr(sekolahId, token) {
        const pd = await this.prisma.pesertaDidik.findFirst({
            where: { sekolah_id: sekolahId, qr_token: token },
            select: {
                peserta_didik_id: true,
                nama: true,
                nisn: true,
                rombongan_belajar_id: true,
            },
        });
        if (pd) {
            return { type: 'pd', data: pd };
        }
        const gtk = await this.prisma.gtk.findFirst({
            where: { sekolah_id: sekolahId, qr_token: token },
            select: {
                ptk_id: true,
                nama: true,
                nuptk: true,
            },
        });
        if (gtk) {
            return { type: 'gtk', data: gtk };
        }
        throw new common_1.NotFoundException('Data QR Token tidak ditemukan');
    }
    async scanQr(sekolahId, token) {
        const dateOnly = new Date(new Date().toISOString().split('T')[0]);
        const pd = await this.prisma.pesertaDidik.findFirst({
            where: { sekolah_id: sekolahId, qr_token: token },
        });
        if (pd) {
            const existing = await this.prisma.absensiPesertaDidik.findUnique({
                where: {
                    peserta_didik_id_tanggal: {
                        peserta_didik_id: pd.peserta_didik_id,
                        tanggal: dateOnly,
                    },
                },
            });
            const tipe = existing && existing.jam_masuk ? 'pulang' : 'masuk';
            return this.absenPesertaDidik(sekolahId, {
                peserta_didik_id: pd.peserta_didik_id,
                waktu: new Date().toISOString(),
                tipe,
            });
        }
        const gtk = await this.prisma.gtk.findFirst({
            where: { sekolah_id: sekolahId, qr_token: token },
        });
        if (gtk) {
            const existing = await this.prisma.absensiGtk.findUnique({
                where: {
                    ptk_id_tanggal: {
                        ptk_id: gtk.ptk_id,
                        tanggal: dateOnly,
                    },
                },
            });
            const tipe = existing && existing.jam_masuk ? 'pulang' : 'masuk';
            return this.absenGtk(sekolahId, {
                ptk_id: gtk.ptk_id,
                waktu: new Date().toISOString(),
                tipe,
            });
        }
        throw new common_1.NotFoundException('Data QR Token tidak dikenali atau tidak terdaftar di sekolah ini');
    }
};
exports.AbsensiService = AbsensiService;
exports.AbsensiService = AbsensiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AbsensiService);
//# sourceMappingURL=absensi.service.js.map