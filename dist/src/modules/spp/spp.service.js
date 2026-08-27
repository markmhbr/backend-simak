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
exports.SppService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let SppService = class SppService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createPengaturanTagihan(dto) {
        const sekolah = await this.prisma.sekolah.findUnique({
            where: { sekolah_id: dto.sekolah_id },
        });
        if (!sekolah) {
            throw new common_1.NotFoundException('Sekolah tidak ditemukan.');
        }
        return this.prisma.pengaturanTagihan.create({
            data: {
                sekolah_id: dto.sekolah_id,
                nama_tagihan: dto.nama_tagihan,
                nominal: BigInt(dto.nominal),
                tipe: dto.tipe,
                aktif: dto.aktif ?? true,
            },
        });
    }
    async getPengaturanTagihan(sekolahId) {
        return this.prisma.pengaturanTagihan.findMany({
            where: { sekolah_id: sekolahId },
            include: {
                pengaturan_rombel: {
                    include: {
                        rombongan_belajar: {
                            select: {
                                rombongan_belajar_id: true,
                                nama: true,
                                tingkat_pendidikan_id: true,
                                semester_id: true,
                            },
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async updatePengaturanTagihan(id, dto) {
        const existing = await this.prisma.pengaturanTagihan.findUnique({
            where: { pengaturan_tagihan_id: id },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Pengaturan tagihan tidak ditemukan.');
        }
        return this.prisma.pengaturanTagihan.update({
            where: { pengaturan_tagihan_id: id },
            data: {
                ...(dto.nama_tagihan !== undefined && { nama_tagihan: dto.nama_tagihan }),
                ...(dto.nominal !== undefined && { nominal: BigInt(dto.nominal) }),
                ...(dto.tipe !== undefined && { tipe: dto.tipe }),
                ...(dto.aktif !== undefined && { aktif: dto.aktif }),
            },
        });
    }
    async deletePengaturanTagihan(id) {
        const existing = await this.prisma.pengaturanTagihan.findUnique({
            where: { pengaturan_tagihan_id: id },
            include: { spp: { take: 1 } },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Pengaturan tagihan tidak ditemukan.');
        }
        if (existing.spp.length > 0) {
            throw new common_1.BadRequestException('Tidak bisa menghapus pengaturan tagihan yang sudah memiliki tagihan siswa. Nonaktifkan saja.');
        }
        await this.prisma.pengaturanTagihanRombel.deleteMany({
            where: { pengaturan_tagihan_id: id },
        });
        return this.prisma.pengaturanTagihan.delete({
            where: { pengaturan_tagihan_id: id },
        });
    }
    async createPengaturanTagihanRombel(dto) {
        const tagihan = await this.prisma.pengaturanTagihan.findUnique({
            where: { pengaturan_tagihan_id: dto.pengaturan_tagihan_id },
        });
        if (!tagihan) {
            throw new common_1.NotFoundException('Pengaturan tagihan tidak ditemukan.');
        }
        const rombel = await this.prisma.rombonganBelajar.findUnique({
            where: { rombongan_belajar_id: dto.rombongan_belajar_id },
        });
        if (!rombel) {
            throw new common_1.NotFoundException('Rombongan belajar tidak ditemukan.');
        }
        const existingRelation = await this.prisma.pengaturanTagihanRombel.findUnique({
            where: {
                pengaturan_tagihan_id_rombongan_belajar_id: {
                    pengaturan_tagihan_id: dto.pengaturan_tagihan_id,
                    rombongan_belajar_id: dto.rombongan_belajar_id,
                },
            },
        });
        if (existingRelation) {
            throw new common_1.BadRequestException('Rombongan belajar sudah terhubung dengan pengaturan tagihan ini.');
        }
        return this.prisma.pengaturanTagihanRombel.create({
            data: {
                pengaturan_tagihan_id: dto.pengaturan_tagihan_id,
                rombongan_belajar_id: dto.rombongan_belajar_id,
            },
            include: {
                rombongan_belajar: {
                    select: {
                        nama: true,
                    },
                },
            },
        });
    }
    async deletePengaturanTagihanRombel(id) {
        const check = await this.prisma.pengaturanTagihanRombel.findUnique({
            where: { pengaturan_tagihan_rombel_id: id },
        });
        if (!check) {
            throw new common_1.NotFoundException('Relasi pengaturan tagihan rombel tidak ditemukan.');
        }
        return this.prisma.$transaction(async (tx) => {
            const deletedRelation = await tx.pengaturanTagihanRombel.delete({
                where: { pengaturan_tagihan_rombel_id: id },
            });
            const anggotaList = await tx.anggotaRombel.findMany({
                where: {
                    rombongan_belajar_id: check.rombongan_belajar_id,
                    soft_delete: 0,
                },
                select: {
                    peserta_didik_id: true,
                },
            });
            const directSiswaList = await tx.pesertaDidik.findMany({
                where: {
                    rombongan_belajar_id: check.rombongan_belajar_id,
                },
                select: {
                    peserta_didik_id: true,
                },
            });
            const siswaIds = Array.from(new Set([
                ...anggotaList.map((a) => a.peserta_didik_id),
                ...directSiswaList.map((s) => s.peserta_didik_id),
            ]));
            if (siswaIds.length > 0) {
                await tx.spp.deleteMany({
                    where: {
                        pengaturan_tagihan_id: check.pengaturan_tagihan_id,
                        peserta_didik_id: { in: siswaIds },
                        nominal_terbayar: 0,
                        riwayat_transaksi: { none: {} },
                    },
                });
            }
            return deletedRelation;
        });
    }
    async deleteSpp(id) {
        const spp = await this.prisma.spp.findUnique({
            where: { spp_id: id },
            include: {
                riwayat_transaksi: true,
            },
        });
        if (!spp) {
            throw new common_1.NotFoundException('Data tagihan SPP tidak ditemukan.');
        }
        if (spp.nominal_terbayar > BigInt(0) || spp.riwayat_transaksi.length > 0) {
            throw new common_1.BadRequestException('Tagihan yang sudah memiliki riwayat pembayaran tidak dapat dihapus.');
        }
        return this.prisma.spp.delete({
            where: { spp_id: id },
        });
    }
    async generateSppTagihan(sekolahId, pengaturanTagihanId) {
        const tagihan = await this.prisma.pengaturanTagihan.findUnique({
            where: { pengaturan_tagihan_id: pengaturanTagihanId },
            include: {
                pengaturan_rombel: true,
            },
        });
        if (!tagihan) {
            throw new common_1.NotFoundException('Pengaturan tagihan tidak ditemukan.');
        }
        if (tagihan.sekolah_id !== sekolahId) {
            throw new common_1.BadRequestException('Pengaturan tagihan tidak terdaftar di sekolah ini.');
        }
        if (!tagihan.aktif) {
            throw new common_1.BadRequestException('Pengaturan tagihan sedang tidak aktif.');
        }
        const rombelIds = tagihan.pengaturan_rombel.map((r) => r.rombongan_belajar_id);
        if (rombelIds.length === 0) {
            throw new common_1.BadRequestException('Pengaturan tagihan belum dihubungkan ke kelas (rombongan belajar) mana pun.');
        }
        const anggotaList = await this.prisma.anggotaRombel.findMany({
            where: {
                rombongan_belajar_id: { in: rombelIds },
                sekolah_id: sekolahId,
                soft_delete: 0,
                peserta_didik: {
                    status: 'Aktif',
                },
            },
            select: {
                peserta_didik_id: true,
                rombongan_belajar_id: true,
            },
        });
        if (anggotaList.length === 0) {
            return {
                message: 'Tidak ada peserta didik aktif ditemukan pada kelas yang terpilih.',
                count: 0,
            };
        }
        const siswaIds = anggotaList.map((s) => s.peserta_didik_id);
        const existingSpps = await this.prisma.spp.findMany({
            where: {
                peserta_didik_id: { in: siswaIds },
                pengaturan_tagihan_id: pengaturanTagihanId,
            },
            select: {
                peserta_didik_id: true,
            },
        });
        const existingSiswaIds = new Set(existingSpps.map((s) => s.peserta_didik_id));
        const siswaBelumAdaTagihan = anggotaList.filter((s) => !existingSiswaIds.has(s.peserta_didik_id));
        if (siswaBelumAdaTagihan.length === 0) {
            return {
                message: 'Semua peserta didik di kelas terpilih sudah memiliki tagihan ini.',
                count: 0,
            };
        }
        let createdCount = 0;
        await this.prisma.$transaction(async (tx) => {
            for (const siswa of siswaBelumAdaTagihan) {
                const totalNominalTagihan = tagihan.tipe === 1 ? (tagihan.nominal * BigInt(12)) : tagihan.nominal;
                const newSpp = await tx.spp.create({
                    data: {
                        sekolah_id: sekolahId,
                        peserta_didik_id: siswa.peserta_didik_id,
                        pengaturan_tagihan_id: pengaturanTagihanId,
                        nominal_tagihan: totalNominalTagihan,
                        nominal_terbayar: BigInt(0),
                        status: 1,
                    },
                });
                createdCount++;
                const unlinkedSpps = await tx.spp.findMany({
                    where: {
                        peserta_didik_id: siswa.peserta_didik_id,
                        nominal_terbayar: { gt: 0 },
                        pengaturan_tagihan: {
                            pengaturan_rombel: {
                                none: {
                                    rombongan_belajar_id: siswa.rombongan_belajar_id,
                                },
                            },
                        },
                    },
                });
                if (unlinkedSpps.length > 0) {
                    let totalTransferredPaid = BigInt(0);
                    const oldSppIdsToDelete = [];
                    for (const oldSpp of unlinkedSpps) {
                        const oldTransactions = await tx.riwayatTransaksiSpp.findMany({
                            where: { spp_id: oldSpp.spp_id },
                        });
                        if (oldTransactions.length > 0) {
                            await tx.riwayatTransaksiSpp.updateMany({
                                where: { spp_id: oldSpp.spp_id },
                                data: {
                                    spp_id: newSpp.spp_id,
                                },
                            });
                            for (const t of oldTransactions) {
                                if (t.jenis_transaksi === 1 || t.jenis_transaksi === 2 || t.jenis_transaksi === 4) {
                                    totalTransferredPaid += t.nominal;
                                }
                                else if (t.jenis_transaksi === 5) {
                                    totalTransferredPaid -= t.nominal;
                                }
                            }
                        }
                        oldSppIdsToDelete.push(oldSpp.spp_id);
                    }
                    if (oldSppIdsToDelete.length > 0) {
                        await tx.spp.deleteMany({
                            where: { spp_id: { in: oldSppIdsToDelete } },
                        });
                    }
                    let newStatus = 1;
                    if (totalTransferredPaid >= tagihan.nominal) {
                        newStatus = 3;
                    }
                    else if (totalTransferredPaid > 0) {
                        newStatus = 2;
                    }
                    await tx.spp.update({
                        where: { spp_id: newSpp.spp_id },
                        data: {
                            nominal_terbayar: totalTransferredPaid,
                            status: newStatus,
                        },
                    });
                }
            }
        });
        return {
            message: `Berhasil meng-generate ${createdCount} tagihan SPP baru.`,
            count: createdCount,
        };
    }
    async getTagihanSpp(sekolahId, filter) {
        const whereClause = { sekolah_id: sekolahId };
        if (filter) {
            if (filter.peserta_didik_id) {
                whereClause.peserta_didik_id = filter.peserta_didik_id;
            }
            if (filter.status !== undefined) {
                whereClause.status = Number(filter.status);
            }
        }
        const [spps, rombelMap] = await Promise.all([
            this.prisma.spp.findMany({
                where: whereClause,
                include: {
                    peserta_didik: {
                        select: {
                            nama: true,
                            nisn: true,
                            rombongan_belajar: { select: { rombongan_belajar_id: true, nama: true, semester_id: true } },
                        },
                    },
                    pengaturan_tagihan: {
                        select: {
                            nama_tagihan: true,
                            tipe: true,
                            pengaturan_rombel: {
                                include: {
                                    rombongan_belajar: {
                                        select: {
                                            rombongan_belajar_id: true,
                                            nama: true,
                                            semester_id: true,
                                            tingkat_pendidikan_id: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                    riwayat_transaksi: {
                        orderBy: {
                            tanggal_transaksi: 'desc',
                        },
                    },
                },
                orderBy: { created_at: 'desc' },
            }),
            this.getStudentRombelMap(sekolahId),
        ]);
        return spps.map((item) => {
            const rombelInfo = rombelMap.get(item.peserta_didik_id);
            const connectedRombels = item.pengaturan_tagihan?.pengaturan_rombel?.map((pr) => pr.rombongan_belajar) || [];
            const matchingRombel = connectedRombels.find((r) => r && r.rombongan_belajar_id === rombelInfo?.id);
            const effectiveRombel = matchingRombel || rombelInfo || item.peserta_didik?.rombongan_belajar || connectedRombels[0];
            const rombelNama = effectiveRombel?.nama || '-';
            const semesterId = effectiveRombel?.semester_id || 'unassigned';
            const tahunAjaranId = this.getTahunAjaranId(semesterId);
            return {
                ...item,
                semester_id: semesterId,
                tahun_ajaran_id: tahunAjaranId,
                tahun_ajaran: this.formatTahunAjaranLabel(tahunAjaranId),
                peserta_didik: item.peserta_didik
                    ? {
                        ...item.peserta_didik,
                        rombongan_belajar: {
                            nama: rombelNama,
                        },
                    }
                    : null,
            };
        });
    }
    async createTransaksiSpp(dto) {
        return this.prisma.$transaction(async (tx) => {
            const spp = await tx.spp.findUnique({
                where: { spp_id: dto.spp_id },
            });
            if (!spp) {
                throw new common_1.NotFoundException('Data tagihan SPP tidak ditemukan.');
            }
            const transaksi = await tx.riwayatTransaksiSpp.create({
                data: {
                    spp_id: dto.spp_id,
                    sekolah_id: dto.sekolah_id,
                    peserta_didik_id: dto.peserta_didik_id,
                    jenis_transaksi: dto.jenis_transaksi,
                    nominal: BigInt(dto.nominal),
                    tanggal_transaksi: new Date(dto.tanggal_transaksi),
                    metode_pembayaran: dto.metode_pembayaran ?? null,
                    keterangan: dto.keterangan || null,
                },
            });
            const allTx = await tx.riwayatTransaksiSpp.findMany({
                where: { spp_id: dto.spp_id },
            });
            let nominalTerbayarSum = BigInt(0);
            for (const t of allTx) {
                if (t.jenis_transaksi === 1 || t.jenis_transaksi === 2 || t.jenis_transaksi === 4) {
                    nominalTerbayarSum += t.nominal;
                }
                else if (t.jenis_transaksi === 5) {
                    nominalTerbayarSum -= t.nominal;
                }
            }
            if (nominalTerbayarSum < BigInt(0)) {
                nominalTerbayarSum = BigInt(0);
            }
            let status = 1;
            if (nominalTerbayarSum > BigInt(0)) {
                if (nominalTerbayarSum >= spp.nominal_tagihan) {
                    status = 3;
                }
                else {
                    status = 2;
                }
            }
            await tx.spp.update({
                where: { spp_id: dto.spp_id },
                data: {
                    nominal_terbayar: nominalTerbayarSum,
                    status: status,
                },
            });
            return transaksi;
        });
    }
    async updateTransaksiSpp(id, dto) {
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.riwayatTransaksiSpp.findUnique({
                where: { riwayat_transaksi_spp_id: id },
            });
            if (!existing) {
                throw new common_1.NotFoundException('Data transaksi SPP tidak ditemukan.');
            }
            const spp = await tx.spp.findUnique({
                where: { spp_id: existing.spp_id },
            });
            if (!spp) {
                throw new common_1.NotFoundException('Data tagihan SPP tidak ditemukan.');
            }
            const updateData = {};
            if (dto.jenis_transaksi !== undefined)
                updateData.jenis_transaksi = dto.jenis_transaksi;
            if (dto.nominal !== undefined)
                updateData.nominal = BigInt(dto.nominal);
            if (dto.tanggal_transaksi !== undefined)
                updateData.tanggal_transaksi = new Date(dto.tanggal_transaksi);
            if (dto.metode_pembayaran !== undefined)
                updateData.metode_pembayaran = dto.metode_pembayaran;
            if (dto.keterangan !== undefined)
                updateData.keterangan = dto.keterangan;
            const updatedTx = await tx.riwayatTransaksiSpp.update({
                where: { riwayat_transaksi_spp_id: id },
                data: updateData,
            });
            const allTx = await tx.riwayatTransaksiSpp.findMany({
                where: { spp_id: existing.spp_id },
            });
            let nominalTerbayarSum = BigInt(0);
            for (const t of allTx) {
                if (t.jenis_transaksi === 1 || t.jenis_transaksi === 2 || t.jenis_transaksi === 4) {
                    nominalTerbayarSum += t.nominal;
                }
                else if (t.jenis_transaksi === 5) {
                    nominalTerbayarSum -= t.nominal;
                }
            }
            if (nominalTerbayarSum < BigInt(0)) {
                nominalTerbayarSum = BigInt(0);
            }
            let status = 1;
            if (nominalTerbayarSum > BigInt(0)) {
                if (nominalTerbayarSum >= spp.nominal_tagihan) {
                    status = 3;
                }
                else {
                    status = 2;
                }
            }
            await tx.spp.update({
                where: { spp_id: existing.spp_id },
                data: {
                    nominal_terbayar: nominalTerbayarSum,
                    status: status,
                },
            });
            return updatedTx;
        });
    }
    async deleteTransaksiSpp(id) {
        return this.prisma.$transaction(async (tx) => {
            const existing = await tx.riwayatTransaksiSpp.findUnique({
                where: { riwayat_transaksi_spp_id: id },
            });
            if (!existing) {
                throw new common_1.NotFoundException('Data transaksi SPP tidak ditemukan.');
            }
            const spp = await tx.spp.findUnique({
                where: { spp_id: existing.spp_id },
            });
            await tx.riwayatTransaksiSpp.delete({
                where: { riwayat_transaksi_spp_id: id },
            });
            if (spp) {
                const allTx = await tx.riwayatTransaksiSpp.findMany({
                    where: { spp_id: existing.spp_id },
                });
                let nominalTerbayarSum = BigInt(0);
                for (const t of allTx) {
                    if (t.jenis_transaksi === 1 || t.jenis_transaksi === 2 || t.jenis_transaksi === 4) {
                        nominalTerbayarSum += t.nominal;
                    }
                    else if (t.jenis_transaksi === 5) {
                        nominalTerbayarSum -= t.nominal;
                    }
                }
                if (nominalTerbayarSum < BigInt(0)) {
                    nominalTerbayarSum = BigInt(0);
                }
                let status = 1;
                if (nominalTerbayarSum > BigInt(0)) {
                    if (nominalTerbayarSum >= spp.nominal_tagihan) {
                        status = 3;
                    }
                    else {
                        status = 2;
                    }
                }
                await tx.spp.update({
                    where: { spp_id: existing.spp_id },
                    data: {
                        nominal_terbayar: nominalTerbayarSum,
                        status: status,
                    },
                });
            }
            return { success: true };
        });
    }
    async getStudentRombelMap(sekolahId) {
        const [mappings, directSiswa] = await Promise.all([
            this.prisma.anggotaRombel.findMany({
                where: {
                    sekolah_id: sekolahId,
                    soft_delete: 0,
                },
                select: {
                    peserta_didik_id: true,
                    rombongan_belajar_id: true,
                    rombongan_belajar: {
                        select: {
                            rombongan_belajar_id: true,
                            nama: true,
                            semester_id: true,
                            tingkat_pendidikan_id: true,
                            jenis_rombel: true,
                        },
                    },
                },
            }),
            this.prisma.pesertaDidik.findMany({
                where: {
                    sekolah_id: sekolahId,
                    rombongan_belajar_id: { not: null },
                },
                select: {
                    peserta_didik_id: true,
                    rombongan_belajar: {
                        select: {
                            rombongan_belajar_id: true,
                            nama: true,
                            semester_id: true,
                            tingkat_pendidikan_id: true,
                            jenis_rombel: true,
                        },
                    },
                },
            }),
        ]);
        const studentMap = new Map();
        const sorted = [...mappings].sort((a, b) => {
            const aIsReg = a.rombongan_belajar && Number(a.rombongan_belajar.jenis_rombel) === 1 ? 1 : 0;
            const bIsReg = b.rombongan_belajar && Number(b.rombongan_belajar.jenis_rombel) === 1 ? 1 : 0;
            if (aIsReg !== bIsReg)
                return aIsReg - bIsReg;
            const aSem = a.rombongan_belajar?.semester_id || '';
            const bSem = b.rombongan_belajar?.semester_id || '';
            if (aSem !== bSem)
                return aSem.localeCompare(bSem);
            const aTingkat = Number(a.rombongan_belajar?.tingkat_pendidikan_id || 0);
            const bTingkat = Number(b.rombongan_belajar?.tingkat_pendidikan_id || 0);
            return aTingkat - bTingkat;
        });
        for (const m of sorted) {
            if (m.rombongan_belajar) {
                studentMap.set(m.peserta_didik_id, {
                    id: m.rombongan_belajar.rombongan_belajar_id,
                    nama: m.rombongan_belajar.nama,
                    semester_id: m.rombongan_belajar.semester_id,
                    tingkat: Number(m.rombongan_belajar.tingkat_pendidikan_id || 0),
                });
            }
        }
        for (const s of directSiswa) {
            if (s.rombongan_belajar) {
                const existing = studentMap.get(s.peserta_didik_id);
                const directSem = s.rombongan_belajar.semester_id || '';
                const existingSem = existing?.semester_id || '';
                const directTingkat = Number(s.rombongan_belajar.tingkat_pendidikan_id || 0);
                const existingTingkat = existing?.tingkat || 0;
                if (!existing || directSem > existingSem || (directSem === existingSem && directTingkat >= existingTingkat)) {
                    studentMap.set(s.peserta_didik_id, {
                        id: s.rombongan_belajar.rombongan_belajar_id,
                        nama: s.rombongan_belajar.nama,
                        semester_id: s.rombongan_belajar.semester_id,
                        tingkat: directTingkat,
                    });
                }
            }
        }
        return studentMap;
    }
    getTahunAjaranId(semesterId) {
        if (!semesterId || semesterId === 'unassigned')
            return 'unassigned';
        if (semesterId.length >= 4) {
            return semesterId.substring(0, 4);
        }
        return semesterId;
    }
    formatTahunAjaranLabel(tahunAjaranId) {
        if (!tahunAjaranId || tahunAjaranId === 'unassigned')
            return 'Lainnya / Tanpa Tahun Ajaran';
        if (tahunAjaranId.length === 4 && !isNaN(Number(tahunAjaranId))) {
            const year = parseInt(tahunAjaranId);
            return `Tahun Ajaran ${year}/${year + 1}`;
        }
        return tahunAjaranId;
    }
    async getTunggakanPerSiswa(sekolahId) {
        const [listSpp, rombelMap] = await Promise.all([
            this.prisma.spp.findMany({
                where: {
                    sekolah_id: sekolahId,
                    status: { in: [1, 2] },
                },
                include: {
                    peserta_didik: {
                        select: {
                            nama: true,
                            nisn: true,
                            rombongan_belajar: { select: { rombongan_belajar_id: true, nama: true, semester_id: true } },
                        },
                    },
                    pengaturan_tagihan: {
                        select: {
                            nama_tagihan: true,
                            pengaturan_rombel: {
                                include: {
                                    rombongan_belajar: {
                                        select: {
                                            rombongan_belajar_id: true,
                                            nama: true,
                                            semester_id: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            this.getStudentRombelMap(sekolahId)
        ]);
        return listSpp.map((s) => {
            const sisaTunggakan = s.nominal_tagihan - s.nominal_terbayar;
            const rInfo = rombelMap.get(s.peserta_didik_id);
            const connectedRombels = s.pengaturan_tagihan?.pengaturan_rombel?.map((pr) => pr.rombongan_belajar) || [];
            const matchingRombel = connectedRombels.find((r) => r && r.rombongan_belajar_id === rInfo?.id);
            const effectiveRombel = matchingRombel || rInfo || s.peserta_didik?.rombongan_belajar || connectedRombels[0];
            const semesterId = effectiveRombel?.semester_id || 'unassigned';
            const tahunAjaranId = this.getTahunAjaranId(semesterId);
            return {
                spp_id: s.spp_id,
                peserta_didik_id: s.peserta_didik_id,
                nama: s.peserta_didik?.nama || 'Unknown',
                nisn: s.peserta_didik?.nisn || '-',
                kelas: effectiveRombel?.nama || '-',
                semester_id: semesterId,
                tahun_ajaran_id: tahunAjaranId,
                tahun_ajaran: this.formatTahunAjaranLabel(tahunAjaranId),
                nama_tagihan: s.pengaturan_tagihan?.nama_tagihan || 'Tagihan',
                nominal_tagihan: s.nominal_tagihan.toString(),
                nominal_terbayar: s.nominal_terbayar.toString(),
                sisa_tunggakan: sisaTunggakan.toString(),
            };
        });
    }
    async getTunggakanPerKelas(sekolahId) {
        const [listSpp, rombelMap] = await Promise.all([
            this.prisma.spp.findMany({
                where: {
                    sekolah_id: sekolahId,
                    status: { in: [1, 2] },
                },
                include: {
                    pengaturan_tagihan: {
                        select: {
                            pengaturan_rombel: {
                                include: {
                                    rombongan_belajar: {
                                        select: {
                                            rombongan_belajar_id: true,
                                            nama: true,
                                            semester_id: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            this.getStudentRombelMap(sekolahId)
        ]);
        const rekapMap = {};
        for (const s of listSpp) {
            const rInfo = rombelMap.get(s.peserta_didik_id);
            const connectedRombels = s.pengaturan_tagihan?.pengaturan_rombel?.map((pr) => pr.rombongan_belajar) || [];
            const matchingRombel = connectedRombels.find((r) => r && r.rombongan_belajar_id === rInfo?.id);
            const effectiveRombel = matchingRombel || rInfo || connectedRombels[0];
            const rombelId = effectiveRombel?.rombongan_belajar_id || effectiveRombel?.id || rInfo?.id || 'unassigned';
            const rombelNama = effectiveRombel?.nama || 'Tanpa Kelas';
            const semesterId = effectiveRombel?.semester_id || 'unassigned';
            const tahunAjaranId = this.getTahunAjaranId(semesterId);
            const tunggakan = s.nominal_tagihan - s.nominal_terbayar;
            const key = `${rombelId}_${tahunAjaranId}`;
            if (!rekapMap[key]) {
                rekapMap[key] = {
                    rombel_id: rombelId,
                    kelas: rombelNama,
                    tahun_ajaran_id: tahunAjaranId,
                    tahun_ajaran: this.formatTahunAjaranLabel(tahunAjaranId),
                    total_tunggakan: BigInt(0),
                    siswaIds: new Set(),
                };
            }
            rekapMap[key].total_tunggakan += tunggakan;
            rekapMap[key].siswaIds.add(s.peserta_didik_id);
        }
        return Object.values(rekapMap).map((item) => ({
            rombel_id: item.rombel_id,
            kelas: item.kelas,
            semester_id: item.tahun_ajaran_id,
            tahun_ajaran_id: item.tahun_ajaran_id,
            tahun_ajaran: item.tahun_ajaran,
            jumlah_siswa: item.siswaIds.size,
            total_tunggakan: item.total_tunggakan.toString(),
        })).sort((a, b) => b.tahun_ajaran_id.localeCompare(a.tahun_ajaran_id) || a.kelas.localeCompare(b.kelas));
    }
    async getTotalPembayaran(sekolahId) {
        const aggregate = await this.prisma.riwayatTransaksiSpp.aggregate({
            where: {
                sekolah_id: sekolahId,
                jenis_transaksi: 1,
            },
            _sum: {
                nominal: true,
            },
        });
        return {
            sekolah_id: sekolahId,
            total_pembayaran: (aggregate._sum.nominal || BigInt(0)).toString(),
        };
    }
    async getTotalBeasiswa(sekolahId) {
        const aggregate = await this.prisma.riwayatTransaksiSpp.aggregate({
            where: {
                sekolah_id: sekolahId,
                jenis_transaksi: 2,
            },
            _sum: {
                nominal: true,
            },
        });
        return {
            sekolah_id: sekolahId,
            total_beasiswa: (aggregate._sum.nominal || BigInt(0)).toString(),
        };
    }
    async getRekapBulanan(sekolahId) {
        const transactions = await this.prisma.riwayatTransaksiSpp.findMany({
            where: {
                sekolah_id: sekolahId,
                jenis_transaksi: 1,
            },
            select: {
                nominal: true,
                tanggal_transaksi: true,
            },
        });
        const monthlyMap = {};
        for (const tx of transactions) {
            const date = new Date(tx.tanggal_transaksi);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const key = `${year}-${month}`;
            if (!monthlyMap[key]) {
                monthlyMap[key] = BigInt(0);
            }
            monthlyMap[key] += tx.nominal;
        }
        return Object.entries(monthlyMap)
            .map(([key, nominal]) => {
            const [year, month] = key.split('-');
            const monthNames = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];
            const monthName = monthNames[parseInt(month) - 1];
            return {
                bulan_tahun: `${monthName} ${year}`,
                nominal,
            };
        })
            .map((item) => ({
            bulan_tahun: item.bulan_tahun,
            nominal: item.nominal.toString(),
        }))
            .sort((a, b) => b.bulan_tahun.localeCompare(a.bulan_tahun));
    }
    async getRekapTahunPelajaran(sekolahId) {
        const [allSpps, rombelMap] = await Promise.all([
            this.prisma.spp.findMany({
                where: { sekolah_id: sekolahId },
                select: {
                    peserta_didik_id: true,
                    nominal_tagihan: true,
                    nominal_terbayar: true,
                    status: true,
                    pengaturan_tagihan: {
                        select: {
                            pengaturan_rombel: {
                                include: {
                                    rombongan_belajar: {
                                        select: {
                                            rombongan_belajar_id: true,
                                            nama: true,
                                            semester_id: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            }),
            this.getStudentRombelMap(sekolahId),
        ]);
        const tahunAjaranMap = {};
        for (const s of allSpps) {
            const rInfo = rombelMap.get(s.peserta_didik_id);
            const connectedRombels = s.pengaturan_tagihan?.pengaturan_rombel?.map((pr) => pr.rombongan_belajar) || [];
            const matchingRombel = connectedRombels.find((r) => r && r.rombongan_belajar_id === rInfo?.id);
            const effectiveRombel = matchingRombel || rInfo || connectedRombels[0];
            const semesterId = effectiveRombel?.semester_id || 'unassigned';
            const tahunAjaranId = this.getTahunAjaranId(semesterId);
            const rombelId = effectiveRombel?.rombongan_belajar_id || effectiveRombel?.id || rInfo?.id || 'unassigned';
            const rombelNama = effectiveRombel?.nama || 'Tanpa Kelas';
            if (!tahunAjaranMap[tahunAjaranId]) {
                tahunAjaranMap[tahunAjaranId] = {
                    tahun_ajaran_id: tahunAjaranId,
                    total_target: BigInt(0),
                    total_pembayaran: BigInt(0),
                    total_tunggakan: BigInt(0),
                    siswaIds: new Set(),
                    rombelMap: {},
                };
            }
            const semData = tahunAjaranMap[tahunAjaranId];
            semData.total_target += s.nominal_tagihan;
            semData.total_pembayaran += s.nominal_terbayar;
            const tunggakan = s.nominal_tagihan > s.nominal_terbayar ? s.nominal_tagihan - s.nominal_terbayar : BigInt(0);
            semData.total_tunggakan += tunggakan;
            semData.siswaIds.add(s.peserta_didik_id);
            if (!semData.rombelMap[rombelId]) {
                semData.rombelMap[rombelId] = {
                    rombel_id: rombelId,
                    rombel_nama: rombelNama,
                    target_tagihan: BigInt(0),
                    total_terbayar: BigInt(0),
                    sisa_tunggakan: BigInt(0),
                    siswaIds: new Set(),
                };
            }
            const rData = semData.rombelMap[rombelId];
            rData.target_tagihan += s.nominal_tagihan;
            rData.total_terbayar += s.nominal_terbayar;
            rData.sisa_tunggakan += tunggakan;
            rData.siswaIds.add(s.peserta_didik_id);
        }
        return Object.values(tahunAjaranMap).map((item) => {
            const label = this.formatTahunAjaranLabel(item.tahun_ajaran_id);
            const totalTargetNum = Number(item.total_target);
            const totalBayarNum = Number(item.total_pembayaran);
            const persentase = totalTargetNum > 0 ? Math.round((totalBayarNum / totalTargetNum) * 100) : 0;
            const rombelBreakdown = Object.values(item.rombelMap).map((r) => {
                const rTargetNum = Number(r.target_tagihan);
                const rBayarNum = Number(r.total_terbayar);
                const rPersen = rTargetNum > 0 ? Math.round((rBayarNum / rTargetNum) * 100) : 0;
                return {
                    rombel_id: r.rombel_id,
                    rombel_nama: r.rombel_nama,
                    jumlah_siswa: r.siswaIds.size,
                    target_tagihan: r.target_tagihan.toString(),
                    total_terbayar: r.total_terbayar.toString(),
                    sisa_tunggakan: r.sisa_tunggakan.toString(),
                    persentase: rPersen,
                };
            }).sort((a, b) => a.rombel_nama.localeCompare(b.rombel_nama));
            return {
                semester_id: item.tahun_ajaran_id,
                tahun_ajaran_id: item.tahun_ajaran_id,
                label: label,
                total_target: item.total_target.toString(),
                total_pembayaran: item.total_pembayaran.toString(),
                total_tunggakan: item.total_tunggakan.toString(),
                jumlah_siswa: item.siswaIds.size,
                persentase: persentase,
                rombel_breakdown: rombelBreakdown,
            };
        }).sort((a, b) => b.tahun_ajaran_id.localeCompare(a.tahun_ajaran_id));
    }
};
exports.SppService = SppService;
exports.SppService = SppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SppService);
//# sourceMappingURL=spp.service.js.map