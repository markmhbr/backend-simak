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
            const siswaList = await tx.pesertaDidik.findMany({
                where: {
                    rombongan_belajar_id: check.rombongan_belajar_id,
                },
                select: {
                    peserta_didik_id: true,
                },
            });
            const siswaIds = siswaList.map((s) => s.peserta_didik_id);
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
        const siswaList = await this.prisma.pesertaDidik.findMany({
            where: {
                rombongan_belajar_id: { in: rombelIds },
                sekolah_id: sekolahId,
                status: 'Aktif',
            },
            select: {
                peserta_didik_id: true,
                rombongan_belajar_id: true,
            },
        });
        if (siswaList.length === 0) {
            return {
                message: 'Tidak ada peserta didik aktif ditemukan pada kelas yang terpilih.',
                count: 0,
            };
        }
        const siswaIds = siswaList.map((s) => s.peserta_didik_id);
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
        const siswaBelumAdaTagihan = siswaList.filter((s) => !existingSiswaIds.has(s.peserta_didik_id));
        if (siswaBelumAdaTagihan.length === 0) {
            return {
                message: 'Semua peserta didik di kelas terpilih sudah memiliki tagihan ini.',
                count: 0,
            };
        }
        let createdCount = 0;
        await this.prisma.$transaction(async (tx) => {
            for (const siswa of siswaBelumAdaTagihan) {
                const newSpp = await tx.spp.create({
                    data: {
                        sekolah_id: sekolahId,
                        peserta_didik_id: siswa.peserta_didik_id,
                        pengaturan_tagihan_id: pengaturanTagihanId,
                        nominal_tagihan: tagihan.nominal,
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
        return this.prisma.spp.findMany({
            where: whereClause,
            include: {
                peserta_didik: {
                    select: {
                        nama: true,
                        nisn: true,
                        rombongan_belajar: { select: { nama: true } },
                    },
                },
                pengaturan_tagihan: {
                    select: {
                        nama_tagihan: true,
                        tipe: true,
                    },
                },
                riwayat_transaksi: {
                    orderBy: {
                        tanggal_transaksi: 'desc',
                    },
                },
            },
            orderBy: { created_at: 'desc' },
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
    async getTunggakanPerSiswa(sekolahId) {
        const listSpp = await this.prisma.spp.findMany({
            where: {
                sekolah_id: sekolahId,
                status: { in: [1, 2] },
            },
            include: {
                peserta_didik: {
                    select: {
                        nama: true,
                        nisn: true,
                        rombongan_belajar: { select: { nama: true } },
                    },
                },
                pengaturan_tagihan: {
                    select: {
                        nama_tagihan: true,
                    },
                },
            },
        });
        return listSpp.map((s) => {
            const sisaTunggakan = s.nominal_tagihan - s.nominal_terbayar;
            return {
                spp_id: s.spp_id,
                peserta_didik_id: s.peserta_didik_id,
                nama: s.peserta_didik?.nama || 'Unknown',
                nisn: s.peserta_didik?.nisn || '-',
                kelas: s.peserta_didik?.rombongan_belajar?.nama || '-',
                nama_tagihan: s.pengaturan_tagihan?.nama_tagihan || 'Tagihan',
                nominal_tagihan: s.nominal_tagihan.toString(),
                nominal_terbayar: s.nominal_terbayar.toString(),
                sisa_tunggakan: sisaTunggakan.toString(),
            };
        });
    }
    async getTunggakanPerKelas(sekolahId) {
        const listSpp = await this.prisma.spp.findMany({
            where: {
                sekolah_id: sekolahId,
                status: { in: [1, 2] },
            },
            include: {
                peserta_didik: {
                    select: {
                        rombongan_belajar_id: true,
                        rombongan_belajar: { select: { nama: true } },
                    },
                },
            },
        });
        const rekapMap = {};
        for (const s of listSpp) {
            const rombelId = s.peserta_didik?.rombongan_belajar_id || 'unassigned';
            const rombelNama = s.peserta_didik?.rombongan_belajar?.nama || 'Tanpa Kelas';
            const tunggakan = s.nominal_tagihan - s.nominal_terbayar;
            if (!rekapMap[rombelId]) {
                rekapMap[rombelId] = {
                    kelas: rombelNama,
                    total_tunggakan: BigInt(0),
                };
            }
            rekapMap[rombelId].total_tunggakan += tunggakan;
        }
        return Object.values(rekapMap).map((item) => ({
            kelas: item.kelas,
            total_tunggakan: item.total_tunggakan.toString(),
        }));
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
        const listPembayaran = await this.prisma.riwayatTransaksiSpp.findMany({
            where: {
                sekolah_id: sekolahId,
                jenis_transaksi: 1,
            },
            select: {
                nominal: true,
                tanggal_transaksi: true,
            },
        });
        const monthMap = {};
        for (const p of listPembayaran) {
            const date = new Date(p.tanggal_transaksi);
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            const key = `${year}-${month.toString().padStart(2, '0')}`;
            if (!monthMap[key]) {
                monthMap[key] = {
                    bulan_tahun: key,
                    nominal: BigInt(0),
                };
            }
            monthMap[key].nominal += p.nominal;
        }
        return Object.values(monthMap)
            .map((item) => ({
            bulan_tahun: item.bulan_tahun,
            nominal: item.nominal.toString(),
        }))
            .sort((a, b) => b.bulan_tahun.localeCompare(a.bulan_tahun));
    }
    async getRekapTahunPelajaran(sekolahId) {
        const listPembayaran = await this.prisma.riwayatTransaksiSpp.findMany({
            where: {
                sekolah_id: sekolahId,
                jenis_transaksi: 1,
            },
            include: {
                peserta_didik: {
                    select: {
                        rombongan_belajar: {
                            select: {
                                semester_id: true,
                            },
                        },
                    },
                },
            },
        });
        const semesterMap = {};
        for (const p of listPembayaran) {
            const semesterId = p.peserta_didik?.rombongan_belajar?.semester_id || 'unassigned';
            if (!semesterMap[semesterId]) {
                semesterMap[semesterId] = {
                    semester_id: semesterId,
                    total_nominal: BigInt(0),
                };
            }
            semesterMap[semesterId].total_nominal += p.nominal;
        }
        return Object.values(semesterMap).map((item) => {
            let label = item.semester_id;
            if (item.semester_id.length === 5) {
                const year = parseInt(item.semester_id.substring(0, 4));
                const sem = item.semester_id.substring(4) === '1' ? 'Ganjil' : 'Genap';
                label = `Tahun Pelajaran ${year}/${year + 1} - ${sem}`;
            }
            return {
                semester_id: item.semester_id,
                label: label,
                total_pembayaran: item.total_nominal.toString(),
            };
        }).sort((a, b) => b.semester_id.localeCompare(a.semester_id));
    }
};
exports.SppService = SppService;
exports.SppService = SppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SppService);
//# sourceMappingURL=spp.service.js.map