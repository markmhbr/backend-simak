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
    async updateHariLibur(sekolahId, id, data) {
        const updateData = {};
        if (data.nama !== undefined)
            updateData.nama = data.nama;
        if (data.tanggal_mulai !== undefined)
            updateData.tanggal_mulai = new Date(data.tanggal_mulai);
        if (data.tanggal_selesai !== undefined)
            updateData.tanggal_selesai = new Date(data.tanggal_selesai);
        if (data.keterangan !== undefined)
            updateData.keterangan = data.keterangan;
        return this.prisma.hariLibur.update({
            where: { hari_libur_id: id },
            data: updateData,
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
        const activeSchedule = await this.prisma.jenisJadwal.findFirst({
            where: { sekolah_id: sekolahId, aktif: true },
            include: {
                pengaturan_hari: {
                    where: { aktif: true },
                    select: { hari: true },
                },
            },
        });
        const activeDays = activeSchedule?.pengaturan_hari.map(h => h.hari) || [1, 2, 3, 4, 5, 6];
        if (!activeDays.includes(dayOfWeek)) {
            throw new common_1.BadRequestException('Hari ini merupakan libur akhir pekan. Tidak dapat melakukan presensi.');
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
    async updateGtkMode(sekolahId, ptkId, modePresensi) {
        const gtk = await this.prisma.gtk.findFirst({
            where: { ptk_id: ptkId, sekolah_id: sekolahId },
        });
        if (!gtk) {
            throw new Error('GTK not found in this school');
        }
        const updated = await this.prisma.gtk.update({
            where: { ptk_id: ptkId },
            data: { mode_presensi: modePresensi },
        });
        return {
            status: 'success',
            message: 'Mode presensi GTK berhasil diperbarui.',
            data: updated,
        };
    }
    async presensiGtk(sekolahId, data) {
        const dateObj = new Date(data.waktu);
        const wibDate = new Date(dateObj.getTime() + 7 * 60 * 60 * 1000);
        const dateOnly = new Date(wibDate.toISOString().split('T')[0]);
        const dayOfWeek = wibDate.getUTCDay() === 0 ? 7 : wibDate.getUTCDay();
        const holiday = await this.checkHoliday(sekolahId, dateOnly);
        if (holiday)
            throw new common_1.BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}`);
        const activeSchedule = await this.prisma.jenisJadwal.findFirst({
            where: { sekolah_id: sekolahId, aktif: true },
            include: {
                pengaturan_hari: {
                    where: { aktif: true },
                    select: { hari: true },
                },
            },
        });
        const activeDays = activeSchedule?.pengaturan_hari.map(h => h.hari) || [1, 2, 3, 4, 5, 6];
        if (!activeDays.includes(dayOfWeek)) {
            throw new common_1.BadRequestException('Hari ini merupakan libur akhir pekan. Tidak dapat melakukan presensi.');
        }
        const dayConfig = await this.getActiveSchedule(sekolahId, dayOfWeek);
        const gtk = await this.prisma.gtk.findUnique({
            where: { ptk_id: data.ptk_id },
            select: { mode_presensi: true },
        });
        if (!gtk) {
            throw new common_1.NotFoundException('Data GTK tidak ditemukan');
        }
        const baseInMinutes = dayConfig.jam_masuk.getUTCHours() * 60 + dayConfig.jam_masuk.getUTCMinutes();
        let configInMinutes = baseInMinutes;
        let configOutMinutes = dayConfig.jam_pulang.getUTCHours() * 60 + dayConfig.jam_pulang.getUTCMinutes();
        if (gtk.mode_presensi === 1) {
            const jadwalGtk = await this.prisma.jadwalPelajaran.findMany({
                where: {
                    sekolah_id: sekolahId,
                    jenis_jadwal_id: activeSchedule.jenis_jadwal_id,
                    hari: dayOfWeek,
                    aktif: true,
                    pembelajaran: {
                        ptk_id: data.ptk_id,
                    },
                },
                select: {
                    urutan: true,
                },
                orderBy: {
                    urutan: 'asc',
                },
            });
            if (jadwalGtk.length === 0) {
                throw new common_1.BadRequestException('Anda tidak memiliki jadwal mengajar hari ini.');
            }
            const firstUrutan = jadwalGtk[0].urutan;
            const lastUrutan = jadwalGtk[jadwalGtk.length - 1].urutan;
            const listPengaturan = await this.prisma.pengaturanJadwal.findMany({
                where: {
                    sekolah_id: sekolahId,
                    jenis_jadwal_id: activeSchedule.jenis_jadwal_id,
                    hari: dayOfWeek,
                    aktif: true,
                },
                orderBy: {
                    urutan: 'asc',
                },
            });
            let startOffset = 0;
            let endOffset = 0;
            for (const p of listPengaturan) {
                if (p.urutan < firstUrutan) {
                    startOffset += p.durasi_menit;
                }
                if (p.urutan <= lastUrutan) {
                    endOffset += p.durasi_menit;
                }
            }
            configInMinutes = baseInMinutes + startOffset;
            configOutMinutes = baseInMinutes + endOffset;
        }
        const currentTimeMinutes = wibDate.getUTCHours() * 60 + wibDate.getUTCMinutes();
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
        const holiday = await this.checkHoliday(sekolahId, dateOnly);
        if (holiday) {
            throw new common_1.BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}. Tidak dapat mengajukan izin.`);
        }
        const activeSchedule = await this.prisma.jenisJadwal.findFirst({
            where: { sekolah_id: sekolahId, aktif: true },
            include: {
                pengaturan_hari: {
                    where: { aktif: true },
                    select: { hari: true },
                },
            },
        });
        const activeDays = activeSchedule?.pengaturan_hari.map(h => h.hari) || [1, 2, 3, 4, 5, 6];
        const dayOfWeek = dateOnly.getDay() === 0 ? 7 : dateOnly.getDay();
        if (!activeDays.includes(dayOfWeek)) {
            throw new common_1.BadRequestException('Hari ini merupakan libur akhir pekan. Tidak dapat mengajukan izin.');
        }
        if (data.jenis === 2 || data.jenis === 3) {
            if (data.peserta_didik_id) {
                const checkin = await this.prisma.presensiPesertaDidik.findUnique({
                    where: {
                        peserta_didik_id_tanggal: {
                            peserta_didik_id: data.peserta_didik_id,
                            tanggal: dateOnly,
                        },
                    },
                });
                if (!checkin || !checkin.jam_masuk) {
                    throw new common_1.BadRequestException('Subjek belum melakukan presensi masuk hari ini. Tidak dapat memberikan izin.');
                }
            }
            else if (data.ptk_id) {
                const checkin = await this.prisma.presensiGtk.findUnique({
                    where: {
                        ptk_id_tanggal: {
                            ptk_id: data.ptk_id,
                            tanggal: dateOnly,
                        },
                    },
                });
                if (!checkin || !checkin.jam_masuk) {
                    throw new common_1.BadRequestException('Subjek belum melakukan presensi masuk hari ini. Tidak dapat memberikan izin.');
                }
            }
        }
        let izin;
        const parseTime = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            const d = new Date(dateOnly);
            d.setHours(h, m, 0, 0);
            return d;
        };
        const jamKeluarDate = data.jam_keluar ? parseTime(data.jam_keluar) : currentTimestamp;
        const jamKembaliEstimasiDate = data.jam_kembali_estimasi ? parseTime(data.jam_kembali_estimasi) : null;
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
                        jam_keluar: jamKeluarDate,
                        jam_kembali_estimasi: jamKembaliEstimasiDate,
                        disetujui: false,
                    },
                });
            }
        }
        else if (data.jenis === 7) {
            await this.prisma.izin.deleteMany({
                where: {
                    sekolah_id: sekolahId,
                    peserta_didik_id: data.peserta_didik_id || null,
                    ptk_id: data.ptk_id || null,
                    tanggal: dateOnly,
                    jenis: { not: 2 },
                },
            });
            izin = null;
        }
        else {
            if (data.jenis !== 1 && data.jenis !== 3) {
                const existingIzin = await this.prisma.izin.findFirst({
                    where: {
                        sekolah_id: sekolahId,
                        peserta_didik_id: data.peserta_didik_id || null,
                        ptk_id: data.ptk_id || null,
                        tanggal: dateOnly,
                        jenis: { not: 2 },
                    },
                });
                if (existingIzin) {
                    izin = await this.prisma.izin.update({
                        where: { izin_id: existingIzin.izin_id },
                        data: {
                            jenis: data.jenis,
                            keterangan: data.keterangan,
                        },
                    });
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
            }
            else {
                izin = null;
            }
        }
        if (data.jenis === 1) {
            if (data.peserta_didik_id) {
                const existingPres = await this.prisma.presensiPesertaDidik.findFirst({
                    where: {
                        peserta_didik_id: data.peserta_didik_id,
                        tanggal: dateOnly,
                    },
                });
                if (existingPres) {
                    await this.prisma.presensiPesertaDidik.update({
                        where: {
                            peserta_didik_id_tanggal: {
                                peserta_didik_id: data.peserta_didik_id,
                                tanggal: dateOnly,
                            },
                        },
                        data: {
                            jam_masuk: currentTimestamp,
                            status_masuk: 2,
                            sekolah_id: sekolahId,
                        },
                    });
                }
                else {
                    await this.prisma.presensiPesertaDidik.create({
                        data: {
                            peserta_didik_id: data.peserta_didik_id,
                            tanggal: dateOnly,
                            jam_masuk: currentTimestamp,
                            status_masuk: 2,
                            sekolah_id: sekolahId,
                        },
                    });
                }
            }
            else if (data.ptk_id) {
                const existingPres = await this.prisma.presensiGtk.findFirst({
                    where: {
                        ptk_id: data.ptk_id,
                        tanggal: dateOnly,
                    },
                });
                if (existingPres) {
                    await this.prisma.presensiGtk.update({
                        where: {
                            ptk_id_tanggal: {
                                ptk_id: data.ptk_id,
                                tanggal: dateOnly,
                            },
                        },
                        data: {
                            jam_masuk: currentTimestamp,
                            status_masuk: 2,
                            sekolah_id: sekolahId,
                        },
                    });
                }
                else {
                    await this.prisma.presensiGtk.create({
                        data: {
                            ptk_id: data.ptk_id,
                            tanggal: dateOnly,
                            jam_masuk: currentTimestamp,
                            status_masuk: 2,
                            sekolah_id: sekolahId,
                        },
                    });
                }
            }
        }
        if (data.jenis === 3) {
            if (data.peserta_didik_id) {
                const existingPres = await this.prisma.presensiPesertaDidik.findFirst({
                    where: {
                        peserta_didik_id: data.peserta_didik_id,
                        tanggal: dateOnly,
                    },
                });
                if (existingPres) {
                    await this.prisma.presensiPesertaDidik.update({
                        where: {
                            peserta_didik_id_tanggal: {
                                peserta_didik_id: data.peserta_didik_id,
                                tanggal: dateOnly,
                            },
                        },
                        data: {
                            jam_pulang: currentTimestamp,
                            status_pulang: 2,
                            sekolah_id: sekolahId,
                        },
                    });
                }
                else {
                    await this.prisma.presensiPesertaDidik.create({
                        data: {
                            peserta_didik_id: data.peserta_didik_id,
                            tanggal: dateOnly,
                            jam_pulang: currentTimestamp,
                            status_pulang: 2,
                            sekolah_id: sekolahId,
                        },
                    });
                }
            }
            else if (data.ptk_id) {
                const existingPres = await this.prisma.presensiGtk.findFirst({
                    where: {
                        ptk_id: data.ptk_id,
                        tanggal: dateOnly,
                    },
                });
                if (existingPres) {
                    await this.prisma.presensiGtk.update({
                        where: {
                            ptk_id_tanggal: {
                                ptk_id: data.ptk_id,
                                tanggal: dateOnly,
                            },
                        },
                        data: {
                            jam_pulang: currentTimestamp,
                            status_pulang: 2,
                            sekolah_id: sekolahId,
                        },
                    });
                }
                else {
                    await this.prisma.presensiGtk.create({
                        data: {
                            ptk_id: data.ptk_id,
                            tanggal: dateOnly,
                            jam_pulang: currentTimestamp,
                            status_pulang: 2,
                            sekolah_id: sekolahId,
                        },
                    });
                }
            }
        }
        if (data.jenis === 4 || data.jenis === 5 || data.jenis === 6 || data.jenis === 7) {
            const statusAbsen = data.jenis === 4 ? 3 : (data.jenis === 5 ? 4 : (data.jenis === 6 ? 5 : 1));
            if (data.peserta_didik_id) {
                const existingPres = await this.prisma.presensiPesertaDidik.findFirst({
                    where: {
                        peserta_didik_id: data.peserta_didik_id,
                        tanggal: dateOnly,
                    },
                });
                if (existingPres) {
                    await this.prisma.presensiPesertaDidik.update({
                        where: {
                            peserta_didik_id_tanggal: {
                                peserta_didik_id: data.peserta_didik_id,
                                tanggal: dateOnly,
                            },
                        },
                        data: {
                            status_masuk: statusAbsen,
                            jam_masuk: data.jenis === 7 ? currentTimestamp : null,
                            sekolah_id: sekolahId,
                        },
                    });
                }
                else {
                    await this.prisma.presensiPesertaDidik.create({
                        data: {
                            peserta_didik_id: data.peserta_didik_id,
                            tanggal: dateOnly,
                            status_masuk: statusAbsen,
                            jam_masuk: data.jenis === 7 ? currentTimestamp : null,
                            sekolah_id: sekolahId,
                        },
                    });
                }
            }
            else if (data.ptk_id) {
                const existingPres = await this.prisma.presensiGtk.findFirst({
                    where: {
                        ptk_id: data.ptk_id,
                        tanggal: dateOnly,
                    },
                });
                if (existingPres) {
                    await this.prisma.presensiGtk.update({
                        where: {
                            ptk_id_tanggal: {
                                ptk_id: data.ptk_id,
                                tanggal: dateOnly,
                            },
                        },
                        data: {
                            status_masuk: statusAbsen,
                            jam_masuk: data.jenis === 7 ? currentTimestamp : null,
                            sekolah_id: sekolahId,
                        },
                    });
                }
                else {
                    await this.prisma.presensiGtk.create({
                        data: {
                            ptk_id: data.ptk_id,
                            tanggal: dateOnly,
                            status_masuk: statusAbsen,
                            jam_masuk: data.jenis === 7 ? currentTimestamp : null,
                            sekolah_id: sekolahId,
                        },
                    });
                }
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
            where: {
                sekolah_id: sekolahId,
                OR: [
                    { qr_token: token },
                    { nisn: token },
                    { nik: token },
                ],
            },
            include: {
                rombongan_belajar: {
                    select: {
                        nama: true,
                    }
                },
                anggota_rombel: {
                    where: {
                        soft_delete: 0,
                        rombongan_belajar: {
                            jenis_rombel: 1,
                        }
                    },
                    orderBy: {
                        rombongan_belajar: {
                            semester_id: 'desc'
                        }
                    },
                    take: 1,
                    select: {
                        rombongan_belajar: {
                            select: {
                                nama: true
                            }
                        }
                    }
                },
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
            const pdMapped = {
                ...pd,
                nama_rombel: pd.anggota_rombel?.[0]?.rombongan_belajar?.nama || pd.rombongan_belajar?.nama || '',
            };
            return { type: 'pd', data: pdMapped, activeIzinKeluar };
        }
        const rawGtk = await this.prisma.gtk.findFirst({
            where: {
                sekolah_id: sekolahId,
                OR: [
                    { qr_token: token },
                    { nuptk: token },
                    { nik: token },
                    { nip: token },
                ],
            },
            select: {
                ptk_id: true,
                nama: true,
                nuptk: true,
                foto: true,
                jenis_ptk: {
                    select: { jenis_ptk: true }
                },
            },
        });
        if (rawGtk) {
            const { jenis_ptk, ...gtkRest } = rawGtk;
            const gtk = {
                ...gtkRest,
                jenis_ptk_id_str: jenis_ptk?.jenis_ptk || null
            };
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
        throw new common_1.NotFoundException('Data Barcode / QR Token tidak ditemukan');
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
            where: {
                sekolah_id: sekolahId,
                OR: [
                    { qr_token: token },
                    { nisn: token },
                    { nik: token },
                ],
            },
            include: {
                rombongan_belajar: { select: { nama: true } },
                anggota_rombel: {
                    where: {
                        soft_delete: 0,
                        rombongan_belajar: {
                            jenis_rombel: 1,
                        }
                    },
                    orderBy: {
                        rombongan_belajar: {
                            semester_id: 'desc'
                        }
                    },
                    take: 1,
                    include: {
                        rombongan_belajar: { select: { nama: true } }
                    }
                }
            },
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
                    },
                    orderBy: { created_at: 'desc' },
                });
                if (activeIzin) {
                    const now = new Date();
                    const isReturned = activeIzin.jam_kembali !== null;
                    const isLate = activeIzin.jam_kembali_estimasi && (isReturned
                        ? activeIzin.jam_kembali > activeIzin.jam_kembali_estimasi
                        : now > activeIzin.jam_kembali_estimasi);
                    if (!isReturned) {
                        if (isLate) {
                            if (!activeIzin.disetujui) {
                                throw new common_1.BadRequestException('Anda tidak bisa presensi pulang karena terlambat kembali dari izin keluar. Harap lapor ke Guru Piket.');
                            }
                        }
                        else {
                            if (!activeIzin.disetujui) {
                                throw new common_1.BadRequestException('Anda tidak bisa presensi pulang karena belum dicatat kembali dari izin keluar. Harap lapor ke Guru Piket.');
                            }
                        }
                    }
                    else {
                        if (isLate && !activeIzin.disetujui) {
                            throw new common_1.BadRequestException('Anda tidak bisa presensi pulang karena terlambat kembali dari izin keluar. Harap lapor ke Guru Piket.');
                        }
                    }
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
                    nama_rombel: pd.anggota_rombel?.[0]?.rombongan_belajar?.nama || pd.rombongan_belajar?.nama || null,
                },
            };
        }
        const gtk = await this.prisma.gtk.findFirst({
            where: {
                sekolah_id: sekolahId,
                OR: [
                    { qr_token: token },
                    { nuptk: token },
                    { nik: token },
                    { nip: token },
                ],
            },
            include: {
                jenis_ptk: true,
            }
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
                    },
                    orderBy: { created_at: 'desc' },
                });
                if (activeIzin) {
                    const now = new Date();
                    const isReturned = activeIzin.jam_kembali !== null;
                    const isLate = activeIzin.jam_kembali_estimasi && (isReturned
                        ? activeIzin.jam_kembali > activeIzin.jam_kembali_estimasi
                        : now > activeIzin.jam_kembali_estimasi);
                    if (!isReturned) {
                        if (isLate) {
                            if (!activeIzin.disetujui) {
                                throw new common_1.BadRequestException('Anda tidak bisa presensi pulang karena terlambat kembali dari izin keluar. Harap lapor ke Guru Piket.');
                            }
                        }
                        else {
                            if (!activeIzin.disetujui) {
                                throw new common_1.BadRequestException('Anda tidak bisa presensi pulang karena belum dicatat kembali dari izin keluar. Harap lapor ke Guru Piket.');
                            }
                        }
                    }
                    else {
                        if (isLate && !activeIzin.disetujui) {
                            throw new common_1.BadRequestException('Anda tidak bisa presensi pulang karena terlambat kembali dari izin keluar. Harap lapor ke Guru Piket.');
                        }
                    }
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
                    jenis_ptk_id_str: gtk.jenis_ptk?.jenis_ptk || null,
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
                OR: [
                    {
                        rombongan_belajar: {
                            jenis_rombel: 1,
                        }
                    },
                    {
                        anggota_rombel: {
                            some: {
                                soft_delete: 0,
                                rombongan_belajar: {
                                    jenis_rombel: 1,
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                peserta_didik_id: true,
                nama: true,
                nisn: true,
                rombongan_belajar: {
                    select: {
                        nama: true,
                    }
                },
                anggota_rombel: {
                    where: {
                        soft_delete: 0,
                        rombongan_belajar: {
                            jenis_rombel: 1,
                        }
                    },
                    orderBy: {
                        rombongan_belajar: {
                            semester_id: 'desc'
                        }
                    },
                    take: 1,
                    select: {
                        rombongan_belajar: {
                            select: {
                                nama: true
                            }
                        }
                    }
                },
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
        const izins = await this.prisma.izin.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: dateOnly,
            },
        });
        const attendanceMap = new Map(attendance.map(a => [a.peserta_didik_id, a]));
        const izinMap = new Map(izins
            .filter(i => i.peserta_didik_id)
            .map(i => [i.peserta_didik_id, i]));
        return students.map((student) => {
            const att = attendanceMap.get(student.peserta_didik_id);
            const iz = izinMap.get(student.peserta_didik_id);
            return {
                ...student,
                nama_rombel: student.anggota_rombel?.[0]?.rombongan_belajar?.nama || student.rombongan_belajar?.nama || '',
                presensi: att || null,
                izin: iz || null,
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
        const dayOfWeek = dateOnly.getUTCDay() === 0 ? 7 : dateOnly.getUTCDay();
        const activeSchedules = await this.prisma.jenisJadwal.findMany({
            where: { sekolah_id: sekolahId, aktif: true },
            select: { jenis_jadwal_id: true },
        });
        let targetJenisIds = activeSchedules.map(s => s.jenis_jadwal_id);
        if (targetJenisIds.length === 0) {
            const allSchedules = await this.prisma.jenisJadwal.findMany({
                where: { sekolah_id: sekolahId },
                select: { jenis_jadwal_id: true },
            });
            targetJenisIds = allSchedules.map(s => s.jenis_jadwal_id);
        }
        const ptkIdsWithJadwal = new Set();
        const gtks = await this.prisma.gtk.findMany({
            where: {
                sekolah_id: sekolahId,
                status: 'Aktif',
            },
            select: {
                ptk_id: true,
                ptk_terdaftar_id: true,
                nama: true,
                nuptk: true,
                foto: true,
                mode_presensi: true,
                jenis_ptk: {
                    select: { jenis_ptk: true }
                },
            },
            orderBy: {
                nama: 'asc',
            },
        });
        const ptkTerdaftarMap = new Map();
        gtks.forEach(g => {
            if (g.ptk_terdaftar_id) {
                ptkTerdaftarMap.set(g.ptk_terdaftar_id, g.ptk_id);
            }
        });
        if (targetJenisIds.length > 0) {
            const jadwals = await this.prisma.jadwalPelajaran.findMany({
                where: {
                    sekolah_id: sekolahId,
                    jenis_jadwal_id: { in: targetJenisIds },
                    hari: dayOfWeek,
                    aktif: true,
                },
                select: {
                    pembelajaran: {
                        select: {
                            ptk_id: true,
                            ptk_terdaftar_id: true,
                        }
                    }
                }
            });
            jadwals.forEach(j => {
                if (j.pembelajaran?.ptk_id) {
                    ptkIdsWithJadwal.add(j.pembelajaran.ptk_id);
                }
                if (j.pembelajaran?.ptk_terdaftar_id) {
                    const mappedPtkId = ptkTerdaftarMap.get(j.pembelajaran.ptk_terdaftar_id);
                    if (mappedPtkId) {
                        ptkIdsWithJadwal.add(mappedPtkId);
                    }
                }
            });
        }
        const attendance = await this.prisma.presensiGtk.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: dateOnly,
            },
        });
        const izins = await this.prisma.izin.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: dateOnly,
            },
        });
        const attendanceMap = new Map(attendance.map(a => [a.ptk_id, a]));
        const izinMap = new Map(izins
            .filter(i => i.ptk_id)
            .map(i => [i.ptk_id, i]));
        let isDinamisMode = true;
        try {
            const generalSetting = await this.prisma.pengaturanUmum.findUnique({
                where: { sekolah_id: sekolahId },
                select: { mode_presensi_guru: true },
            });
            if (generalSetting && generalSetting.mode_presensi_guru === 0) {
                isDinamisMode = false;
            }
            else if (generalSetting && generalSetting.mode_presensi_guru === 1) {
                isDinamisMode = true;
            }
        }
        catch (e) { }
        return gtks.map(g => {
            const att = attendanceMap.get(g.ptk_id);
            const iz = izinMap.get(g.ptk_id);
            const { jenis_ptk, ptk_terdaftar_id, ...gtkRest } = g;
            const jenisPtkName = (jenis_ptk?.jenis_ptk || "").toLowerCase();
            const isExplicitTendik = jenisPtkName.includes("administrasi") ||
                jenisPtkName.includes("kebersihan") ||
                jenisPtkName.includes("satpam") ||
                jenisPtkName.includes("penjaga") ||
                jenisPtkName.includes("perpustakaan") ||
                jenisPtkName.includes("laboran") ||
                jenisPtkName.includes("tenaga kependidikan") ||
                jenisPtkName.includes("tendik");
            let hasJadwalToday;
            if (!isDinamisMode) {
                hasJadwalToday = true;
            }
            else {
                hasJadwalToday = ptkIdsWithJadwal.has(g.ptk_id) || (isExplicitTendik && !jenisPtkName.includes("guru"));
            }
            return {
                ...gtkRest,
                jenis_ptk_id_str: jenis_ptk?.jenis_ptk || null,
                presensi: att || null,
                izin: iz || null,
                hasJadwalToday,
            };
        });
    }
    async getRekapPeriodik(sekolahId, rombel, startStr, endStr, tipe = 'pd') {
        const startDate = new Date(startStr);
        const endDate = new Date(endStr);
        const activeSchedule = await this.prisma.jenisJadwal.findFirst({
            where: { sekolah_id: sekolahId, aktif: true },
            include: {
                pengaturan_hari: {
                    where: { aktif: true },
                    select: { hari: true },
                },
            },
        });
        const activeDays = activeSchedule?.pengaturan_hari.map(h => h.hari) || [1, 2, 3, 4, 5, 6];
        const holidays = await this.prisma.hariLibur.findMany({
            where: {
                sekolah_id: sekolahId,
                aktif: true,
                tanggal_mulai: { lte: endDate },
                tanggal_selesai: { gte: startDate },
            },
            select: {
                nama: true,
                tanggal_mulai: true,
                tanggal_selesai: true,
            },
        });
        let data = [];
        if (tipe === 'gtk') {
            const gtks = await this.prisma.gtk.findMany({
                where: {
                    sekolah_id: sekolahId,
                    status: 'Aktif',
                },
                select: {
                    ptk_id: true,
                    nama: true,
                    nuptk: true,
                    jenis_ptk: {
                        select: { jenis_ptk: true }
                    },
                },
                orderBy: {
                    nama: 'asc',
                },
            });
            const attendances = await this.prisma.presensiGtk.findMany({
                where: {
                    sekolah_id: sekolahId,
                    tanggal: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const izins = await this.prisma.izin.findMany({
                where: {
                    sekolah_id: sekolahId,
                    tanggal: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            data = gtks.map((gtk) => {
                const gtkAtts = attendances.filter(a => a.ptk_id === gtk.ptk_id);
                const gtkIzins = izins.filter(i => i.ptk_id === gtk.ptk_id);
                return {
                    peserta_didik_id: gtk.ptk_id,
                    nama: gtk.nama,
                    nisn: gtk.nuptk || '-',
                    jenis_ptk_id_str: gtk.jenis_ptk?.jenis_ptk || 'Guru/Staf',
                    presensi: gtkAtts,
                    izin: gtkIzins,
                };
            });
        }
        else {
            const latestRombel = await this.prisma.rombonganBelajar.findFirst({
                where: { sekolah_id: sekolahId },
                select: { semester_id: true },
                orderBy: { semester_id: 'desc' },
            });
            const semesterId = latestRombel?.semester_id || null;
            const students = await this.prisma.pesertaDidik.findMany({
                where: {
                    sekolah_id: sekolahId,
                    status: 'Aktif',
                    OR: [
                        {
                            rombongan_belajar: {
                                nama: rombel,
                                semester_id: semesterId || undefined,
                            }
                        },
                        {
                            anggota_rombel: {
                                some: {
                                    soft_delete: 0,
                                    rombongan_belajar: {
                                        nama: rombel,
                                        semester_id: semesterId || undefined,
                                    }
                                }
                            }
                        }
                    ]
                },
                select: {
                    peserta_didik_id: true,
                    nama: true,
                    nisn: true,
                },
                orderBy: {
                    nama: 'asc',
                },
            });
            const attendances = await this.prisma.presensiPesertaDidik.findMany({
                where: {
                    sekolah_id: sekolahId,
                    tanggal: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            const izins = await this.prisma.izin.findMany({
                where: {
                    sekolah_id: sekolahId,
                    tanggal: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
            data = students.map((student) => {
                const studentAtts = attendances.filter(a => a.peserta_didik_id === student.peserta_didik_id);
                const studentIzins = izins.filter(i => i.peserta_didik_id === student.peserta_didik_id);
                return {
                    ...student,
                    presensi: studentAtts,
                    izin: studentIzins,
                };
            });
        }
        return {
            data,
            holidays,
            activeDays,
        };
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
    async getIzinKeluarHariIni(sekolahId, dateStr) {
        let dateOnly;
        if (dateStr) {
            dateOnly = new Date(new Date(dateStr).toISOString().split('T')[0]);
        }
        else {
            const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
            dateOnly = new Date(wibDate.toISOString().split('T')[0]);
        }
        const izins = await this.prisma.izin.findMany({
            where: {
                sekolah_id: sekolahId,
                jenis: 2,
                tanggal: dateOnly,
            },
            include: {
                peserta_didik: {
                    select: {
                        nama: true,
                        rombongan_belajar: {
                            select: {
                                nama: true
                            }
                        },
                        nisn: true,
                    },
                },
                gtk: {
                    select: {
                        nama: true,
                        nuptk: true,
                        jenis_ptk: {
                            select: { jenis_ptk: true }
                        },
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });
        const mappedIzins = izins.map((item) => {
            const formattedItem = {
                ...item,
                peserta_didik: item.peserta_didik ? {
                    nama: item.peserta_didik.nama,
                    nisn: item.peserta_didik.nisn,
                    nama_rombel: item.peserta_didik.rombongan_belajar?.nama || ''
                } : null
            };
            if (item.gtk) {
                const { jenis_ptk, ...gtkRest } = item.gtk;
                return {
                    ...formattedItem,
                    gtk: {
                        ...gtkRest,
                        jenis_ptk_id_str: jenis_ptk?.jenis_ptk || null
                    }
                };
            }
            return formattedItem;
        });
        const presPd = await this.prisma.presensiPesertaDidik.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: dateOnly,
                OR: [
                    { status_masuk: 2 },
                    { status_pulang: 2 }
                ]
            },
            include: {
                peserta_didik: {
                    select: {
                        nama: true,
                        rombongan_belajar: {
                            select: {
                                nama: true
                            }
                        },
                        nisn: true,
                    }
                }
            }
        });
        const mappedPresPd = presPd.map((item) => ({
            izin_id: `pd_${item.peserta_didik_id}_${item.tanggal.toISOString().split('T')[0]}`,
            sekolah_id: item.sekolah_id,
            peserta_didik_id: item.peserta_didik_id,
            ptk_id: null,
            jenis: item.status_masuk === 2 ? 1 : 3,
            tanggal: item.tanggal,
            keterangan: item.status_masuk === 2 ? "Terlambat Masuk" : "Pulang Lebih Awal",
            jam_keluar: null,
            jam_kembali_estimasi: null,
            jam_kembali: null,
            disetujui: true,
            created_at: item.created_at || item.updated_at,
            updated_at: item.updated_at,
            peserta_didik: item.peserta_didik ? {
                nama: item.peserta_didik.nama,
                nisn: item.peserta_didik.nisn,
                nama_rombel: item.peserta_didik.rombongan_belajar?.nama || ''
            } : null,
            gtk: null
        }));
        const presGtk = await this.prisma.presensiGtk.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: dateOnly,
                OR: [
                    { status_masuk: 2 },
                    { status_pulang: 2 }
                ]
            },
            include: {
                gtk: {
                    select: {
                        nama: true,
                        nuptk: true,
                        jenis_ptk: {
                            select: { jenis_ptk: true }
                        }
                    }
                }
            }
        });
        const mappedPresGtk = presGtk.map((item) => {
            const gtkInfo = item.gtk ? {
                nama: item.gtk.nama,
                nuptk: item.gtk.nuptk,
                jenis_ptk_id_str: item.gtk.jenis_ptk?.jenis_ptk || null
            } : null;
            return {
                izin_id: `gtk_${item.ptk_id}_${item.tanggal.toISOString().split('T')[0]}`,
                sekolah_id: item.sekolah_id,
                peserta_didik_id: null,
                ptk_id: item.ptk_id,
                jenis: item.status_masuk === 2 ? 1 : 3,
                tanggal: item.tanggal,
                keterangan: item.status_masuk === 2 ? "Terlambat Masuk" : "Pulang Lebih Awal",
                jam_keluar: null,
                jam_kembali_estimasi: null,
                jam_kembali: null,
                disetujui: true,
                created_at: item.created_at || item.updated_at,
                updated_at: item.updated_at,
                peserta_didik: null,
                gtk: gtkInfo
            };
        });
        const combined = [...mappedIzins, ...mappedPresPd, ...mappedPresGtk];
        combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return combined;
    }
    async catatKembali(sekolahId, izinId) {
        const izin = await this.prisma.izin.findFirst({
            where: { izin_id: izinId, sekolah_id: sekolahId },
        });
        if (!izin)
            throw new common_1.NotFoundException('Data izin tidak ditemukan');
        return this.prisma.izin.update({
            where: { izin_id: izinId },
            data: {
                jam_kembali: new Date(),
            },
        });
    }
    async setujuiIzin(sekolahId, izinId) {
        const izin = await this.prisma.izin.findFirst({
            where: { izin_id: izinId, sekolah_id: sekolahId },
        });
        if (!izin)
            throw new common_1.NotFoundException('Data izin tidak ditemukan');
        return this.prisma.izin.update({
            where: { izin_id: izinId },
            data: {
                disetujui: true,
            },
        });
    }
    async deleteIzin(sekolahId, izinId) {
        if (izinId.startsWith("pd_")) {
            const parts = izinId.split("_");
            const pdId = parts[1];
            const dateStr = parts[2];
            const dateObj = new Date(dateStr);
            const presPd = await this.prisma.presensiPesertaDidik.findFirst({
                where: {
                    peserta_didik_id: pdId,
                    tanggal: dateObj,
                    sekolah_id: sekolahId,
                },
            });
            if (presPd) {
                if (presPd.status_masuk === 2 && !presPd.jam_pulang) {
                    await this.prisma.presensiPesertaDidik.delete({
                        where: {
                            peserta_didik_id_tanggal: {
                                peserta_didik_id: pdId,
                                tanggal: dateObj,
                            },
                        },
                    });
                }
                else {
                    const updateData = {};
                    if (presPd.status_masuk === 2) {
                        updateData.status_masuk = null;
                        updateData.jam_masuk = null;
                    }
                    if (presPd.status_pulang === 2) {
                        updateData.status_pulang = null;
                        updateData.jam_pulang = null;
                    }
                    await this.prisma.presensiPesertaDidik.update({
                        where: {
                            peserta_didik_id_tanggal: {
                                peserta_didik_id: pdId,
                                tanggal: dateObj,
                            },
                        },
                        data: updateData,
                    });
                }
                return { success: true };
            }
            throw new common_1.NotFoundException('Data presensi tidak ditemukan');
        }
        if (izinId.startsWith("gtk_")) {
            const parts = izinId.split("_");
            const ptkId = parts[1];
            const dateStr = parts[2];
            const dateObj = new Date(dateStr);
            const presGtk = await this.prisma.presensiGtk.findFirst({
                where: {
                    ptk_id: ptkId,
                    tanggal: dateObj,
                    sekolah_id: sekolahId,
                },
            });
            if (presGtk) {
                if (presGtk.status_masuk === 2 && !presGtk.jam_pulang) {
                    await this.prisma.presensiGtk.delete({
                        where: {
                            ptk_id_tanggal: {
                                ptk_id: ptkId,
                                tanggal: dateObj,
                            },
                        },
                    });
                }
                else {
                    const updateData = {};
                    if (presGtk.status_masuk === 2) {
                        updateData.status_masuk = null;
                        updateData.jam_masuk = null;
                    }
                    if (presGtk.status_pulang === 2) {
                        updateData.status_pulang = null;
                        updateData.jam_pulang = null;
                    }
                    await this.prisma.presensiGtk.update({
                        where: {
                            ptk_id_tanggal: {
                                ptk_id: ptkId,
                                tanggal: dateObj,
                            },
                        },
                        data: updateData,
                    });
                }
                return { success: true };
            }
            throw new common_1.NotFoundException('Data presensi tidak ditemukan');
        }
        const izin = await this.prisma.izin.findFirst({
            where: { izin_id: izinId, sekolah_id: sekolahId },
        });
        if (izin) {
            await this.prisma.izin.delete({
                where: { izin_id: izinId },
            });
            return { success: true };
        }
        throw new common_1.NotFoundException('Data izin tidak ditemukan');
    }
};
exports.PresensiService = PresensiService;
exports.PresensiService = PresensiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PresensiService);
//# sourceMappingURL=presensi.service.js.map