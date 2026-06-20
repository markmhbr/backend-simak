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
exports.PresensiService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let PresensiService = class PresensiService {
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
    async presensiPesertaDidik(sekolahId, data) {
        const dateObj = new Date(data.waktu);
        const wibDate = new Date(dateObj.getTime() + 7 * 60 * 60 * 1000);
        const dateOnly = new Date(wibDate.toISOString().split('T')[0]);
        const dayOfWeek = wibDate.getUTCDay() === 0 ? 7 : wibDate.getUTCDay();
        const holiday = await this.checkHoliday(sekolahId, dateOnly);
        if (holiday) {
            throw new common_1.BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}`);
        }
        const dayConfig = await this.getActiveSchedule(sekolahId, dayOfWeek);
        const currentTimeMinutes = wibDate.getUTCHours() * 60 + wibDate.getUTCMinutes();
        const configInMinutes = dayConfig.jam_masuk.getUTCHours() * 60 + dayConfig.jam_masuk.getUTCMinutes();
        const configOutMinutes = dayConfig.jam_pulang.getUTCHours() * 60 + dayConfig.jam_pulang.getUTCMinutes();
        if (data.tipe === 'masuk') {
            if (currentTimeMinutes > configInMinutes) {
                throw new common_1.BadRequestException('Batas waktu masuk sudah lewat (pelajaran telah dimulai).');
            }
            const status_masuk = 1;
            return this.prisma.presensiPesertaDidik.upsert({
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
            if (currentTimeMinutes < configOutMinutes) {
                throw new common_1.BadRequestException('Jadwal pelajaran belum selesai. Belum saatnya presensi pulang.');
            }
            const status_pulang = 1;
            return this.prisma.presensiPesertaDidik.upsert({
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
    async presensiGtk(sekolahId, data) {
        const dateObj = new Date(data.waktu);
        const wibDate = new Date(dateObj.getTime() + 7 * 60 * 60 * 1000);
        const dateOnly = new Date(wibDate.toISOString().split('T')[0]);
        const dayOfWeek = wibDate.getUTCDay() === 0 ? 7 : wibDate.getUTCDay();
        const holiday = await this.checkHoliday(sekolahId, dateOnly);
        if (holiday)
            throw new common_1.BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}`);
        const dayConfig = await this.getActiveSchedule(sekolahId, dayOfWeek);
        const currentTimeMinutes = wibDate.getUTCHours() * 60 + wibDate.getUTCMinutes();
        const configInMinutes = dayConfig.jam_masuk.getUTCHours() * 60 + dayConfig.jam_masuk.getUTCMinutes();
        const configOutMinutes = dayConfig.jam_pulang.getUTCHours() * 60 + dayConfig.jam_pulang.getUTCMinutes();
        if (data.tipe === 'masuk') {
            if (currentTimeMinutes > configInMinutes) {
                throw new common_1.BadRequestException('Batas waktu masuk sudah lewat (jam mengajar telah dimulai).');
            }
            const status_masuk = 1;
            return this.prisma.presensiGtk.upsert({
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
            if (currentTimeMinutes < configOutMinutes) {
                throw new common_1.BadRequestException('Jam pulang belum tiba. Belum saatnya presensi pulang.');
            }
            const status_pulang = 1;
            return this.prisma.presensiGtk.upsert({
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
    async presensiMapel(sekolahId, data) {
        const dateOnly = new Date(data.tanggal);
        const holiday = await this.checkHoliday(sekolahId, dateOnly);
        if (holiday)
            throw new common_1.BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}`);
        return this.prisma.presensiMapel.upsert({
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
        const dateObj = new Date(data.tanggal);
        const dateOnly = new Date(dateObj.toISOString().split('T')[0]);
        const currentTimestamp = new Date();
        let izin;
        if (data.jenis === 2) {
            const activeIzin = await this.prisma.izin.findFirst({
                where: {
                    sekolah_id: sekolahId,
                    peserta_didik_id: data.peserta_didik_id || null,
                    ptk_id: data.ptk_id || null,
                    jenis: 2,
                    tanggal: dateOnly,
                    jam_kembali: null,
                },
            });
            if (activeIzin) {
                izin = await this.prisma.izin.update({
                    where: { izin_id: activeIzin.izin_id },
                    data: {
                        jam_kembali: currentTimestamp,
                        keterangan: data.keterangan || activeIzin.keterangan,
                    },
                });
            }
            else {
                izin = await this.prisma.izin.create({
                    data: {
                        sekolah_id: sekolahId,
                        peserta_didik_id: data.peserta_didik_id,
                        ptk_id: data.ptk_id,
                        jenis: 2,
                        tanggal: dateOnly,
                        keterangan: data.keterangan,
                        jam_keluar: currentTimestamp,
                    },
                });
            }
        }
        else {
            izin = await this.prisma.izin.create({
                data: {
                    sekolah_id: sekolahId,
                    peserta_didik_id: data.peserta_didik_id,
                    ptk_id: data.ptk_id,
                    jenis: data.jenis,
                    tanggal: dateOnly,
                    keterangan: data.keterangan,
                },
            });
        }
        if (data.jenis === 1) {
            if (data.peserta_didik_id) {
                await this.prisma.presensiPesertaDidik.upsert({
                    where: {
                        peserta_didik_id_tanggal: {
                            peserta_didik_id: data.peserta_didik_id,
                            tanggal: dateOnly,
                        },
                    },
                    update: {
                        jam_masuk: currentTimestamp,
                        status_masuk: 2,
                        sekolah_id: sekolahId,
                    },
                    create: {
                        peserta_didik_id: data.peserta_didik_id,
                        tanggal: dateOnly,
                        jam_masuk: currentTimestamp,
                        status_masuk: 2,
                        sekolah_id: sekolahId,
                    },
                });
            }
            else if (data.ptk_id) {
                await this.prisma.presensiGtk.upsert({
                    where: {
                        ptk_id_tanggal: {
                            ptk_id: data.ptk_id,
                            tanggal: dateOnly,
                        },
                    },
                    update: {
                        jam_masuk: currentTimestamp,
                        status_masuk: 2,
                        sekolah_id: sekolahId,
                    },
                    create: {
                        ptk_id: data.ptk_id,
                        tanggal: dateOnly,
                        jam_masuk: currentTimestamp,
                        status_masuk: 2,
                        sekolah_id: sekolahId,
                    },
                });
            }
        }
        if (data.jenis === 3) {
            if (data.peserta_didik_id) {
                await this.prisma.presensiPesertaDidik.upsert({
                    where: {
                        peserta_didik_id_tanggal: {
                            peserta_didik_id: data.peserta_didik_id,
                            tanggal: dateOnly,
                        },
                    },
                    update: {
                        jam_pulang: currentTimestamp,
                        status_pulang: 2,
                        sekolah_id: sekolahId,
                    },
                    create: {
                        peserta_didik_id: data.peserta_didik_id,
                        tanggal: dateOnly,
                        jam_pulang: currentTimestamp,
                        status_pulang: 2,
                        sekolah_id: sekolahId,
                    },
                });
            }
            else if (data.ptk_id) {
                await this.prisma.presensiGtk.upsert({
                    where: {
                        ptk_id_tanggal: {
                            ptk_id: data.ptk_id,
                            tanggal: dateOnly,
                        },
                    },
                    update: {
                        jam_pulang: currentTimestamp,
                        status_pulang: 2,
                        sekolah_id: sekolahId,
                    },
                    create: {
                        ptk_id: data.ptk_id,
                        tanggal: dateOnly,
                        jam_pulang: currentTimestamp,
                        status_pulang: 2,
                        sekolah_id: sekolahId,
                    },
                });
            }
        }
        if (data.jenis === 4 || data.jenis === 5) {
            const statusAbsen = data.jenis === 4 ? 3 : 4;
            if (data.peserta_didik_id) {
                await this.prisma.presensiPesertaDidik.upsert({
                    where: {
                        peserta_didik_id_tanggal: {
                            peserta_didik_id: data.peserta_didik_id,
                            tanggal: dateOnly,
                        },
                    },
                    update: {
                        status_masuk: statusAbsen,
                        sekolah_id: sekolahId,
                    },
                    create: {
                        peserta_didik_id: data.peserta_didik_id,
                        tanggal: dateOnly,
                        status_masuk: statusAbsen,
                        sekolah_id: sekolahId,
                    },
                });
            }
            else if (data.ptk_id) {
                await this.prisma.presensiGtk.upsert({
                    where: {
                        ptk_id_tanggal: {
                            ptk_id: data.ptk_id,
                            tanggal: dateOnly,
                        },
                    },
                    update: {
                        status_masuk: statusAbsen,
                        sekolah_id: sekolahId,
                    },
                    create: {
                        ptk_id: data.ptk_id,
                        tanggal: dateOnly,
                        status_masuk: statusAbsen,
                        sekolah_id: sekolahId,
                    },
                });
            }
        }
        return izin;
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
        const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
        const dateOnly = new Date(wibDate.toISOString().split('T')[0]);
        const pd = await this.prisma.pesertaDidik.findFirst({
            where: { sekolah_id: sekolahId, qr_token: token },
            select: {
                peserta_didik_id: true,
                nama: true,
                nisn: true,
                rombongan_belajar_id: true,
                nama_rombel: true,
                foto: true,
            },
        });
        if (pd) {
            const activeIzinKeluar = await this.prisma.izin.findFirst({
                where: {
                    sekolah_id: sekolahId,
                    peserta_didik_id: pd.peserta_didik_id,
                    jenis: 2,
                    tanggal: dateOnly,
                    jam_kembali: null,
                },
            });
            return { type: 'pd', data: pd, activeIzinKeluar };
        }
        const gtk = await this.prisma.gtk.findFirst({
            where: { sekolah_id: sekolahId, qr_token: token },
            select: {
                ptk_id: true,
                nama: true,
                nuptk: true,
                foto: true,
                jenis_ptk_id_str: true,
            },
        });
        if (gtk) {
            const activeIzinKeluar = await this.prisma.izin.findFirst({
                where: {
                    sekolah_id: sekolahId,
                    ptk_id: gtk.ptk_id,
                    jenis: 2,
                    tanggal: dateOnly,
                    jam_kembali: null,
                },
            });
            return { type: 'gtk', data: gtk, activeIzinKeluar };
        }
        throw new common_1.NotFoundException('Data QR Token tidak ditemukan');
    }
    async scanQr(sekolahId, token, latitude, longitude) {
        const sekolah = await this.prisma.sekolah.findUnique({
            where: { sekolah_id: sekolahId },
            select: { lintang: true, bujur: true, radius: true },
        });
        if (sekolah && sekolah.lintang && sekolah.bujur && sekolah.radius !== null && sekolah.radius > 0) {
            if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
                throw new common_1.BadRequestException('Lokasi perangkat tidak terdeteksi. Silakan aktifkan GPS/Layanan Lokasi pada browser.');
            }
            const distance = this.getDistance(Number(latitude), Number(longitude), Number(sekolah.lintang), Number(sekolah.bujur));
            if (distance > sekolah.radius) {
                throw new common_1.BadRequestException(`Presensi gagal. Anda berada di luar area scan sekolah. Jarak Anda: ${Math.round(distance)} meter, Radius maksimal: ${sekolah.radius} meter.`);
            }
        }
        const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
        const dateOnly = new Date(wibDate.toISOString().split('T')[0]);
        const pd = await this.prisma.pesertaDidik.findFirst({
            where: { sekolah_id: sekolahId, qr_token: token },
        });
        if (pd) {
            const existing = await this.prisma.presensiPesertaDidik.findUnique({
                where: {
                    peserta_didik_id_tanggal: {
                        peserta_didik_id: pd.peserta_didik_id,
                        tanggal: dateOnly,
                    },
                },
            });
            if (existing && existing.jam_masuk && existing.jam_pulang) {
                throw new common_1.BadRequestException('Anda sudah melakukan presensi masuk dan pulang hari ini.');
            }
            const tipe = existing && existing.jam_masuk ? 'pulang' : 'masuk';
            if (tipe === 'pulang') {
                const activeIzin = await this.prisma.izin.findFirst({
                    where: {
                        sekolah_id: sekolahId,
                        peserta_didik_id: pd.peserta_didik_id,
                        jenis: 2,
                        tanggal: dateOnly,
                        jam_kembali: null,
                    },
                });
                if (activeIzin) {
                    throw new common_1.BadRequestException('Anda tidak bisa presensi pulang karena belum dicatat kembali dari izin keluar. Harap lapor ke Guru Piket.');
                }
            }
            const attendance = await this.presensiPesertaDidik(sekolahId, {
                peserta_didik_id: pd.peserta_didik_id,
                waktu: new Date().toISOString(),
                tipe,
            });
            return {
                ...attendance,
                peserta_didik: {
                    nama: pd.nama,
                    foto: pd.foto,
                    nisn: pd.nisn,
                    rombongan_belajar_id: pd.rombongan_belajar_id,
                    nama_rombel: pd.nama_rombel,
                },
            };
        }
        const gtk = await this.prisma.gtk.findFirst({
            where: { sekolah_id: sekolahId, qr_token: token },
        });
        if (gtk) {
            const existing = await this.prisma.presensiGtk.findUnique({
                where: {
                    ptk_id_tanggal: {
                        ptk_id: gtk.ptk_id,
                        tanggal: dateOnly,
                    },
                },
            });
            if (existing && existing.jam_masuk && existing.jam_pulang) {
                throw new common_1.BadRequestException('Anda sudah melakukan presensi masuk dan pulang hari ini.');
            }
            const tipe = existing && existing.jam_masuk ? 'pulang' : 'masuk';
            if (tipe === 'pulang') {
                const activeIzin = await this.prisma.izin.findFirst({
                    where: {
                        sekolah_id: sekolahId,
                        ptk_id: gtk.ptk_id,
                        jenis: 2,
                        tanggal: dateOnly,
                        jam_kembali: null,
                    },
                });
                if (activeIzin) {
                    throw new common_1.BadRequestException('Anda tidak bisa presensi pulang karena belum dicatat kembali dari izin keluar. Harap lapor ke Guru Piket.');
                }
            }
            const attendance = await this.presensiGtk(sekolahId, {
                ptk_id: gtk.ptk_id,
                waktu: new Date().toISOString(),
                tipe,
            });
            return {
                ...attendance,
                gtk: {
                    nama: gtk.nama,
                    foto: gtk.foto,
                    nuptk: gtk.nuptk,
                    jenis_ptk_id_str: gtk.jenis_ptk_id_str,
                },
            };
        }
        throw new common_1.NotFoundException('Data QR Token tidak dikenali atau tidak terdaftar di sekolah ini');
    }
    async getPresensiPesertaDidik(sekolahId, dateStr) {
        let dateOnly;
        if (dateStr) {
            dateOnly = new Date(new Date(dateStr).toISOString().split('T')[0]);
        }
        else {
            const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
            dateOnly = new Date(wibDate.toISOString().split('T')[0]);
        }
        const students = await this.prisma.pesertaDidik.findMany({
            where: {
                sekolah_id: sekolahId,
                status: 'Aktif',
            },
            select: {
                peserta_didik_id: true,
                nama: true,
                nisn: true,
                nama_rombel: true,
                foto: true,
            },
            orderBy: {
                nama: 'asc',
            },
        });
        const attendance = await this.prisma.presensiPesertaDidik.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: dateOnly,
            },
        });
        const attendanceMap = new Map(attendance.map(a => [a.peserta_didik_id, a]));
        return students.map(student => {
            const att = attendanceMap.get(student.peserta_didik_id);
            return {
                ...student,
                presensi: att || null,
            };
        });
    }
    async getPresensiGtk(sekolahId, dateStr) {
        let dateOnly;
        if (dateStr) {
            dateOnly = new Date(new Date(dateStr).toISOString().split('T')[0]);
        }
        else {
            const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
            dateOnly = new Date(wibDate.toISOString().split('T')[0]);
        }
        const gtks = await this.prisma.gtk.findMany({
            where: {
                sekolah_id: sekolahId,
                status: 'Aktif',
            },
            select: {
                ptk_id: true,
                nama: true,
                nuptk: true,
                foto: true,
                jenis_ptk_id_str: true,
            },
            orderBy: {
                nama: 'asc',
            },
        });
        const attendance = await this.prisma.presensiGtk.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: dateOnly,
            },
        });
        const attendanceMap = new Map(attendance.map(a => [a.ptk_id, a]));
        return gtks.map(gtk => {
            const att = attendanceMap.get(gtk.ptk_id);
            return {
                ...gtk,
                presensi: att || null,
            };
        });
    }
    getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
};
exports.PresensiService = PresensiService;
exports.PresensiService = PresensiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PresensiService);
//# sourceMappingURL=presensi.service.js.map