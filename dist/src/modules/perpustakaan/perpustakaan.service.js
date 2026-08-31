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
exports.PerpustakaanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let PerpustakaanService = class PerpustakaanService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(sekolahId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const [totalJudulBuku, aggregateBuku, totalPeminjamanAktif, totalPeminjamanSelesai, kunjunganHariIni, pengunjungSedangDiPerpus, literasiBulanIni,] = await Promise.all([
            this.prisma.buku.count({
                where: { sekolah_id: sekolahId, status: 1 },
            }),
            this.prisma.buku.aggregate({
                where: { sekolah_id: sekolahId, status: 1 },
                _sum: {
                    jumlah: true,
                    tersedia: true,
                },
            }),
            this.prisma.peminjaman.count({
                where: {
                    sekolah_id: sekolahId,
                    status: { in: [1, 2, 4] },
                },
            }),
            this.prisma.peminjaman.count({
                where: {
                    sekolah_id: sekolahId,
                    status: 3,
                },
            }),
            this.prisma.kunjunganPerpustakaan.count({
                where: {
                    sekolah_id: sekolahId,
                    tanggal: { gte: today, lt: tomorrow },
                },
            }),
            this.prisma.kunjunganPerpustakaan.count({
                where: {
                    sekolah_id: sekolahId,
                    tanggal: { gte: today, lt: tomorrow },
                    jam_keluar: null,
                },
            }),
            this.prisma.literasiPerpustakaan.count({
                where: {
                    sekolah_id: sekolahId,
                    tanggal: { gte: firstDayOfMonth },
                },
            }),
        ]);
        const totalKoleksiBuku = aggregateBuku._sum.jumlah || 0;
        const totalBukuTersedia = aggregateBuku._sum.tersedia || 0;
        const totalBukuDipinjam = Math.max(0, totalKoleksiBuku - totalBukuTersedia);
        return {
            total_judul_buku: totalJudulBuku,
            total_koleksi_buku: totalKoleksiBuku,
            total_buku_tersedia: totalBukuTersedia,
            total_buku_dipinjam: totalBukuDipinjam,
            total_peminjaman_aktif: totalPeminjamanAktif,
            total_peminjaman_selesai: totalPeminjamanSelesai,
            kunjungan_hari_ini: kunjunganHariIni,
            pengunjung_sedang_di_perpus: pengunjungSedangDiPerpus,
            literasi_bulan_ini: literasiBulanIni,
        };
    }
    async getKategoriList(sekolahId) {
        return this.prisma.kategoriBuku.findMany({
            where: { sekolah_id: sekolahId },
            orderBy: { nama: 'asc' },
            include: {
                _count: {
                    select: { buku: true },
                },
            },
        });
    }
    async getKategoriById(sekolahId, id) {
        const data = await this.prisma.kategoriBuku.findFirst({
            where: {
                kategori_buku_id: id,
                sekolah_id: sekolahId,
            },
            include: {
                _count: {
                    select: { buku: true },
                },
            },
        });
        if (!data) {
            throw new common_1.NotFoundException('Kategori buku tidak ditemukan.');
        }
        return data;
    }
    async createKategori(sekolahId, dto) {
        const existing = await this.prisma.kategoriBuku.findUnique({
            where: {
                sekolah_id_nama: {
                    sekolah_id: sekolahId,
                    nama: dto.nama.trim(),
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Kategori '${dto.nama}' sudah ada di sekolah ini.`);
        }
        return this.prisma.kategoriBuku.create({
            data: {
                sekolah_id: sekolahId,
                nama: dto.nama.trim(),
                deskripsi: dto.deskripsi,
            },
        });
    }
    async updateKategori(sekolahId, id, dto) {
        await this.getKategoriById(sekolahId, id);
        if (dto.nama) {
            const duplicate = await this.prisma.kategoriBuku.findFirst({
                where: {
                    sekolah_id: sekolahId,
                    nama: dto.nama.trim(),
                    NOT: { kategori_buku_id: id },
                },
            });
            if (duplicate) {
                throw new common_1.ConflictException(`Kategori '${dto.nama}' sudah ada.`);
            }
        }
        return this.prisma.kategoriBuku.update({
            where: { kategori_buku_id: id },
            data: {
                ...(dto.nama && { nama: dto.nama.trim() }),
                ...(dto.deskripsi !== undefined && { deskripsi: dto.deskripsi }),
            },
        });
    }
    async deleteKategori(sekolahId, id) {
        await this.getKategoriById(sekolahId, id);
        const countBuku = await this.prisma.buku.count({
            where: { kategori_buku_id: id, sekolah_id: sekolahId },
        });
        if (countBuku > 0) {
            throw new common_1.BadRequestException(`Kategori tidak dapat dihapus karena masih digunakan oleh ${countBuku} buku.`);
        }
        return this.prisma.kategoriBuku.delete({
            where: { kategori_buku_id: id },
        });
    }
    async getBukuList(sekolahId, params) {
        const page = Math.max(1, Number(params.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
        const skip = (page - 1) * limit;
        const whereClause = {
            sekolah_id: sekolahId,
        };
        if (params.kategori_buku_id) {
            whereClause.kategori_buku_id = params.kategori_buku_id;
        }
        if (params.status !== undefined && !isNaN(Number(params.status))) {
            whereClause.status = Number(params.status);
        }
        if (params.search) {
            const search = params.search.trim();
            whereClause.OR = [
                { judul: { contains: search, mode: 'insensitive' } },
                { kode: { contains: search, mode: 'insensitive' } },
                { penulis: { contains: search, mode: 'insensitive' } },
                { penerbit: { contains: search, mode: 'insensitive' } },
                { isbn: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [total, data] = await Promise.all([
            this.prisma.buku.count({ where: whereClause }),
            this.prisma.buku.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
                include: {
                    kategori: {
                        select: {
                            kategori_buku_id: true,
                            nama: true,
                        },
                    },
                },
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                total_pages: Math.ceil(total / limit),
            },
        };
    }
    async getBukuById(sekolahId, id) {
        const buku = await this.prisma.buku.findFirst({
            where: {
                buku_id: id,
                sekolah_id: sekolahId,
            },
            include: {
                kategori: true,
            },
        });
        if (!buku) {
            throw new common_1.NotFoundException('Buku tidak ditemukan.');
        }
        return buku;
    }
    async createBuku(sekolahId, dto) {
        const kategori = await this.prisma.kategoriBuku.findFirst({
            where: {
                kategori_buku_id: dto.kategori_buku_id,
                sekolah_id: sekolahId,
            },
        });
        if (!kategori) {
            throw new common_1.BadRequestException('Kategori buku tidak valid.');
        }
        const existingKode = await this.prisma.buku.findUnique({
            where: {
                sekolah_id_kode: {
                    sekolah_id: sekolahId,
                    kode: dto.kode.trim(),
                },
            },
        });
        if (existingKode) {
            throw new common_1.ConflictException(`Kode buku '${dto.kode}' sudah digunakan di sekolah ini.`);
        }
        const jumlah = Number(dto.jumlah);
        const tersedia = dto.tersedia !== undefined ? Number(dto.tersedia) : jumlah;
        if (tersedia > jumlah) {
            throw new common_1.BadRequestException('Stok tersedia tidak boleh melebihi total jumlah buku.');
        }
        return this.prisma.buku.create({
            data: {
                sekolah_id: sekolahId,
                kategori_buku_id: dto.kategori_buku_id,
                kode: dto.kode.trim(),
                isbn: dto.isbn?.trim() || null,
                judul: dto.judul.trim(),
                penulis: dto.penulis?.trim() || null,
                penerbit: dto.penerbit?.trim() || null,
                tahun_terbit: dto.tahun_terbit ? Number(dto.tahun_terbit) : null,
                jumlah,
                tersedia,
                kondisi: dto.kondisi ? Number(dto.kondisi) : 1,
                lokasi_rak: dto.lokasi_rak?.trim() || null,
                sampul: dto.sampul || null,
                deskripsi: dto.deskripsi || null,
                status: dto.status !== undefined ? Number(dto.status) : 1,
            },
            include: {
                kategori: true,
            },
        });
    }
    async updateBuku(sekolahId, id, dto) {
        const existing = await this.getBukuById(sekolahId, id);
        if (dto.kategori_buku_id) {
            const kategori = await this.prisma.kategoriBuku.findFirst({
                where: {
                    kategori_buku_id: dto.kategori_buku_id,
                    sekolah_id: sekolahId,
                },
            });
            if (!kategori) {
                throw new common_1.BadRequestException('Kategori buku tidak valid.');
            }
        }
        if (dto.kode && dto.kode.trim() !== existing.kode) {
            const duplicateKode = await this.prisma.buku.findUnique({
                where: {
                    sekolah_id_kode: {
                        sekolah_id: sekolahId,
                        kode: dto.kode.trim(),
                    },
                },
            });
            if (duplicateKode) {
                throw new common_1.ConflictException(`Kode buku '${dto.kode}' sudah digunakan.`);
            }
        }
        const newJumlah = dto.jumlah !== undefined ? Number(dto.jumlah) : existing.jumlah;
        const newTersedia = dto.tersedia !== undefined ? Number(dto.tersedia) : existing.tersedia;
        if (newTersedia > newJumlah) {
            throw new common_1.BadRequestException('Stok tersedia tidak boleh melebihi total jumlah buku.');
        }
        return this.prisma.buku.update({
            where: { buku_id: id },
            data: {
                ...(dto.kategori_buku_id && { kategori_buku_id: dto.kategori_buku_id }),
                ...(dto.kode && { kode: dto.kode.trim() }),
                ...(dto.isbn !== undefined && { isbn: dto.isbn?.trim() || null }),
                ...(dto.judul && { judul: dto.judul.trim() }),
                ...(dto.penulis !== undefined && { penulis: dto.penulis?.trim() || null }),
                ...(dto.penerbit !== undefined && { penerbit: dto.penerbit?.trim() || null }),
                ...(dto.tahun_terbit !== undefined && {
                    tahun_terbit: dto.tahun_terbit ? Number(dto.tahun_terbit) : null,
                }),
                ...(dto.jumlah !== undefined && { jumlah: newJumlah }),
                ...(dto.tersedia !== undefined && { tersedia: newTersedia }),
                ...(dto.kondisi !== undefined && { kondisi: Number(dto.kondisi) }),
                ...(dto.lokasi_rak !== undefined && { lokasi_rak: dto.lokasi_rak?.trim() || null }),
                ...(dto.sampul !== undefined && { sampul: dto.sampul || null }),
                ...(dto.deskripsi !== undefined && { deskripsi: dto.deskripsi || null }),
                ...(dto.status !== undefined && { status: Number(dto.status) }),
            },
            include: {
                kategori: true,
            },
        });
    }
    async deleteBuku(sekolahId, id) {
        await this.getBukuById(sekolahId, id);
        const activeLoan = await this.prisma.detailPeminjaman.findFirst({
            where: {
                buku_id: id,
                peminjaman: {
                    sekolah_id: sekolahId,
                    status: { in: [1, 2, 4] },
                },
            },
        });
        if (activeLoan) {
            throw new common_1.BadRequestException('Buku sedang dalam proses peminjaman aktif dan tidak dapat dihapus.');
        }
        return this.prisma.buku.delete({
            where: { buku_id: id },
        });
    }
    async getPeminjamanList(sekolahId, params) {
        const page = Math.max(1, Number(params.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
        const skip = (page - 1) * limit;
        const whereClause = {
            sekolah_id: sekolahId,
        };
        if (params.status !== undefined && !isNaN(Number(params.status))) {
            whereClause.status = Number(params.status);
        }
        if (params.peserta_didik_id) {
            whereClause.peserta_didik_id = params.peserta_didik_id;
        }
        if (params.ptk_id) {
            whereClause.ptk_id = params.ptk_id;
        }
        if (params.tanggal_mulai || params.tanggal_selesai) {
            whereClause.tanggal_pinjam = {};
            if (params.tanggal_mulai) {
                whereClause.tanggal_pinjam.gte = new Date(params.tanggal_mulai);
            }
            if (params.tanggal_selesai) {
                whereClause.tanggal_pinjam.lte = new Date(params.tanggal_selesai);
            }
        }
        if (params.search) {
            const search = params.search.trim();
            whereClause.OR = [
                { nomor_peminjaman: { contains: search, mode: 'insensitive' } },
                { peserta_didik: { nama: { contains: search, mode: 'insensitive' } } },
                { ptk: { nama: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [total, data] = await Promise.all([
            this.prisma.peminjaman.count({ where: whereClause }),
            this.prisma.peminjaman.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { tanggal_pinjam: 'desc' },
                include: {
                    peserta_didik: {
                        select: {
                            peserta_didik_id: true,
                            nama: true,
                            nisn: true,
                            nipd: true,
                            foto: true,
                            rombongan_belajar: {
                                select: { nama: true, jenis_rombel: true, semester_id: true },
                            },
                            anggota_rombel: {
                                where: {
                                    rombongan_belajar: {
                                        jenis_rombel: 1,
                                    },
                                },
                                orderBy: {
                                    rombongan_belajar: {
                                        semester_id: 'desc',
                                    },
                                },
                                select: {
                                    rombongan_belajar: {
                                        select: { nama: true, jenis_rombel: true, semester_id: true },
                                    },
                                },
                                take: 1,
                            },
                        },
                    },
                    ptk: {
                        select: {
                            ptk_id: true,
                            nama: true,
                            nip: true,
                            nuptk: true,
                            foto: true,
                            jenis_ptk: { select: { jenis_ptk: true } },
                        },
                    },
                    detail_peminjaman: {
                        include: {
                            buku: {
                                select: {
                                    buku_id: true,
                                    kode: true,
                                    judul: true,
                                    sampul: true,
                                },
                            },
                        },
                    },
                },
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                total_pages: Math.ceil(total / limit),
            },
        };
    }
    async getPeminjamanById(sekolahId, id) {
        const data = await this.prisma.peminjaman.findFirst({
            where: {
                peminjaman_id: id,
                sekolah_id: sekolahId,
            },
            include: {
                peserta_didik: {
                    select: {
                        peserta_didik_id: true,
                        nama: true,
                        nisn: true,
                        nipd: true,
                        rombongan_belajar: {
                            select: {
                                rombongan_belajar_id: true,
                                nama: true,
                            },
                        },
                    },
                },
                ptk: {
                    select: {
                        ptk_id: true,
                        nama: true,
                        nip: true,
                        nuptk: true,
                    },
                },
                detail_peminjaman: {
                    include: {
                        buku: {
                            select: {
                                buku_id: true,
                                kode: true,
                                judul: true,
                                penulis: true,
                                penerbit: true,
                                lokasi_rak: true,
                                sampul: true,
                            },
                        },
                    },
                },
            },
        });
        if (!data) {
            throw new common_1.NotFoundException('Data peminjaman tidak ditemukan.');
        }
        return data;
    }
    async createPeminjaman(sekolahId, dto) {
        const hasPd = Boolean(dto.peserta_didik_id);
        const hasPtk = Boolean(dto.ptk_id);
        if ((hasPd && hasPtk) || (!hasPd && !hasPtk)) {
            throw new common_1.BadRequestException('Peminjam harus ditentukan tepat salah satu: peserta_didik_id atau ptk_id.');
        }
        const tglPinjam = new Date(dto.tanggal_pinjam);
        const tglJatuhTempo = new Date(dto.tanggal_jatuh_tempo);
        if (tglJatuhTempo < tglPinjam) {
            throw new common_1.BadRequestException('Tanggal jatuh tempo tidak boleh sebelum tanggal pinjam.');
        }
        if (dto.peserta_didik_id) {
            const pd = await this.prisma.pesertaDidik.findFirst({
                where: { peserta_didik_id: dto.peserta_didik_id, sekolah_id: sekolahId },
            });
            if (!pd) {
                throw new common_1.BadRequestException('Peserta didik tidak ditemukan di sekolah ini.');
            }
        }
        else if (dto.ptk_id) {
            const ptk = await this.prisma.gtk.findFirst({
                where: { ptk_id: dto.ptk_id, sekolah_id: sekolahId },
            });
            if (!ptk) {
                throw new common_1.BadRequestException('PTK / Guru tidak ditemukan di sekolah ini.');
            }
        }
        return this.prisma.$transaction(async (tx) => {
            let nomorPeminjaman = dto.nomor_peminjaman?.trim();
            if (!nomorPeminjaman) {
                const dateStr = dto.tanggal_pinjam.replace(/-/g, '');
                const todayCount = await tx.peminjaman.count({
                    where: {
                        sekolah_id: sekolahId,
                        tanggal_pinjam: tglPinjam,
                    },
                });
                const sequence = String(todayCount + 1).padStart(4, '0');
                nomorPeminjaman = `PJ-${dateStr}-${sequence}`;
            }
            else {
                const duplicateNo = await tx.peminjaman.findUnique({
                    where: {
                        sekolah_id_nomor_peminjaman: {
                            sekolah_id: sekolahId,
                            nomor_peminjaman: nomorPeminjaman,
                        },
                    },
                });
                if (duplicateNo) {
                    throw new common_1.ConflictException(`Nomor peminjaman '${nomorPeminjaman}' sudah digunakan.`);
                }
            }
            for (const item of dto.items) {
                const buku = await tx.buku.findFirst({
                    where: { buku_id: item.buku_id, sekolah_id: sekolahId },
                });
                if (!buku) {
                    throw new common_1.NotFoundException(`Buku dengan ID ${item.buku_id} tidak ditemukan.`);
                }
                if (buku.status !== 1) {
                    throw new common_1.BadRequestException(`Buku '${buku.judul}' sedang tidak aktif.`);
                }
                if (buku.tersedia < item.jumlah) {
                    throw new common_1.BadRequestException(`Stok buku '${buku.judul}' tidak mencukupi. Tersedia: ${buku.tersedia}, Diminta: ${item.jumlah}.`);
                }
                await tx.buku.update({
                    where: { buku_id: item.buku_id },
                    data: {
                        tersedia: { decrement: item.jumlah },
                    },
                });
            }
            return tx.peminjaman.create({
                data: {
                    sekolah_id: sekolahId,
                    peserta_didik_id: dto.peserta_didik_id || null,
                    ptk_id: dto.ptk_id || null,
                    nomor_peminjaman: nomorPeminjaman,
                    tanggal_pinjam: tglPinjam,
                    tanggal_jatuh_tempo: tglJatuhTempo,
                    status: 1,
                    denda: 0,
                    keterangan: dto.keterangan || null,
                    detail_peminjaman: {
                        create: dto.items.map((item) => ({
                            buku_id: item.buku_id,
                            jumlah: item.jumlah,
                            jumlah_kembali: 0,
                            keterangan: item.keterangan || null,
                        })),
                    },
                },
                include: {
                    peserta_didik: { select: { nama: true, nisn: true } },
                    ptk: { select: { nama: true, nip: true } },
                    detail_peminjaman: {
                        include: {
                            buku: { select: { kode: true, judul: true } },
                        },
                    },
                },
            });
        });
    }
    async prosesPengembalian(sekolahId, peminjamanId, dto) {
        return this.prisma.$transaction(async (tx) => {
            const peminjaman = await tx.peminjaman.findFirst({
                where: { peminjaman_id: peminjamanId, sekolah_id: sekolahId },
                include: { detail_peminjaman: true },
            });
            if (!peminjaman) {
                throw new common_1.NotFoundException('Data peminjaman tidak ditemukan.');
            }
            if (peminjaman.status === 3) {
                throw new common_1.BadRequestException('Peminjaman ini sudah selesai dikembalikan.');
            }
            if (peminjaman.status === 5) {
                throw new common_1.BadRequestException('Peminjaman ini berstatus dibatalkan.');
            }
            const tglKembali = dto.tanggal_kembali ? new Date(dto.tanggal_kembali) : new Date();
            for (const returnItem of dto.items) {
                const detail = peminjaman.detail_peminjaman.find((d) => d.detail_peminjaman_id === returnItem.detail_peminjaman_id);
                if (!detail) {
                    throw new common_1.NotFoundException(`Detail peminjaman ID ${returnItem.detail_peminjaman_id} tidak valid untuk transaksi ini.`);
                }
                const sisaDipinjam = detail.jumlah - detail.jumlah_kembali;
                if (returnItem.jumlah_kembali > sisaDipinjam) {
                    throw new common_1.BadRequestException(`Jumlah pengembalian (${returnItem.jumlah_kembali}) melebihi sisa pinjaman (${sisaDipinjam}).`);
                }
                await tx.buku.update({
                    where: { buku_id: detail.buku_id },
                    data: {
                        tersedia: { increment: returnItem.jumlah_kembali },
                    },
                });
                await tx.detailPeminjaman.update({
                    where: { detail_peminjaman_id: returnItem.detail_peminjaman_id },
                    data: {
                        jumlah_kembali: { increment: returnItem.jumlah_kembali },
                        ...(returnItem.kondisi_kembali && { kondisi_kembali: Number(returnItem.kondisi_kembali) }),
                        ...(returnItem.keterangan && { keterangan: returnItem.keterangan }),
                    },
                });
            }
            const updatedDetails = await tx.detailPeminjaman.findMany({
                where: { peminjaman_id: peminjamanId },
            });
            const allReturned = updatedDetails.every((d) => d.jumlah_kembali >= d.jumlah);
            const someReturned = updatedDetails.some((d) => d.jumlah_kembali > 0);
            let newStatus = 1;
            if (allReturned) {
                newStatus = 3;
            }
            else if (someReturned) {
                newStatus = 2;
            }
            return tx.peminjaman.update({
                where: { peminjaman_id: peminjamanId },
                data: {
                    status: newStatus,
                    tanggal_kembali: allReturned ? tglKembali : peminjaman.tanggal_kembali,
                    ...(dto.denda !== undefined && { denda: Number(dto.denda) }),
                    ...(dto.keterangan && { keterangan: dto.keterangan }),
                },
                include: {
                    peserta_didik: { select: { nama: true, nisn: true } },
                    ptk: { select: { nama: true, nip: true } },
                    detail_peminjaman: {
                        include: {
                            buku: { select: { kode: true, judul: true } },
                        },
                    },
                },
            });
        });
    }
    async batalkanPeminjaman(sekolahId, id) {
        return this.prisma.$transaction(async (tx) => {
            const peminjaman = await tx.peminjaman.findFirst({
                where: { peminjaman_id: id, sekolah_id: sekolahId },
                include: { detail_peminjaman: true },
            });
            if (!peminjaman) {
                throw new common_1.NotFoundException('Data peminjaman tidak ditemukan.');
            }
            if (peminjaman.status === 5) {
                throw new common_1.BadRequestException('Peminjaman sudah dibatalkan sebelumnya.');
            }
            if (peminjaman.status === 3) {
                throw new common_1.BadRequestException('Peminjaman sudah selesai, tidak dapat dibatalkan.');
            }
            for (const item of peminjaman.detail_peminjaman) {
                const sisa = item.jumlah - item.jumlah_kembali;
                if (sisa > 0) {
                    await tx.buku.update({
                        where: { buku_id: item.buku_id },
                        data: { tersedia: { increment: sisa } },
                    });
                }
            }
            return tx.peminjaman.update({
                where: { peminjaman_id: id },
                data: { status: 5 },
            });
        });
    }
    async deletePeminjaman(sekolahId, id) {
        return this.prisma.$transaction(async (tx) => {
            const peminjaman = await tx.peminjaman.findFirst({
                where: { peminjaman_id: id, sekolah_id: sekolahId },
                include: { detail_peminjaman: true },
            });
            if (!peminjaman) {
                throw new common_1.NotFoundException('Data peminjaman tidak ditemukan.');
            }
            if (peminjaman.status !== 3 && peminjaman.status !== 5) {
                for (const item of peminjaman.detail_peminjaman) {
                    const sisa = item.jumlah - item.jumlah_kembali;
                    if (sisa > 0) {
                        await tx.buku.update({
                            where: { buku_id: item.buku_id },
                            data: { tersedia: { increment: sisa } },
                        });
                    }
                }
            }
            return tx.peminjaman.delete({
                where: { peminjaman_id: id },
            });
        });
    }
    async getKunjunganList(sekolahId, params) {
        const page = Math.max(1, Number(params.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
        const skip = (page - 1) * limit;
        const whereClause = {
            sekolah_id: sekolahId,
        };
        if (params.tanggal) {
            whereClause.tanggal = new Date(params.tanggal);
        }
        if (params.sedang_berada_di_perpus === true) {
            whereClause.jam_keluar = null;
        }
        if (params.peserta_didik_id) {
            whereClause.peserta_didik_id = params.peserta_didik_id;
        }
        if (params.ptk_id) {
            whereClause.ptk_id = params.ptk_id;
        }
        const [total, data] = await Promise.all([
            this.prisma.kunjunganPerpustakaan.count({ where: whereClause }),
            this.prisma.kunjunganPerpustakaan.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: [{ tanggal: 'desc' }, { jam_masuk: 'desc' }],
                include: {
                    peserta_didik: {
                        select: {
                            peserta_didik_id: true,
                            nama: true,
                            nisn: true,
                            nipd: true,
                            foto: true,
                            rombongan_belajar: {
                                select: { nama: true, jenis_rombel: true, semester_id: true },
                            },
                            anggota_rombel: {
                                where: {
                                    rombongan_belajar: {
                                        jenis_rombel: 1,
                                    },
                                },
                                orderBy: {
                                    rombongan_belajar: {
                                        semester_id: 'desc',
                                    },
                                },
                                select: {
                                    rombongan_belajar: {
                                        select: { nama: true, jenis_rombel: true, semester_id: true },
                                    },
                                },
                                take: 1,
                            },
                        },
                    },
                    ptk: {
                        select: {
                            ptk_id: true,
                            nama: true,
                            nip: true,
                            nuptk: true,
                            foto: true,
                            jenis_ptk: { select: { jenis_ptk: true } },
                        },
                    },
                },
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                total_pages: Math.ceil(total / limit),
            },
        };
    }
    async getKunjunganById(sekolahId, id) {
        const data = await this.prisma.kunjunganPerpustakaan.findFirst({
            where: {
                kunjungan_perpustakaan_id: id,
                sekolah_id: sekolahId,
            },
            include: {
                peserta_didik: {
                    select: {
                        peserta_didik_id: true,
                        nama: true,
                        nisn: true,
                    },
                },
                ptk: {
                    select: {
                        ptk_id: true,
                        nama: true,
                        nip: true,
                    },
                },
            },
        });
        if (!data) {
            throw new common_1.NotFoundException('Data kunjungan perpustakaan tidak ditemukan.');
        }
        return data;
    }
    async checkInKunjungan(sekolahId, dto) {
        const hasPd = Boolean(dto.peserta_didik_id);
        const hasPtk = Boolean(dto.ptk_id);
        if ((hasPd && hasPtk) || (!hasPd && !hasPtk)) {
            throw new common_1.BadRequestException('Pengunjung harus ditentukan tepat salah satu: peserta_didik_id atau ptk_id.');
        }
        if (dto.peserta_didik_id) {
            const pd = await this.prisma.pesertaDidik.findFirst({
                where: { peserta_didik_id: dto.peserta_didik_id, sekolah_id: sekolahId },
            });
            if (!pd) {
                throw new common_1.BadRequestException('Peserta didik tidak ditemukan di sekolah ini.');
            }
        }
        else if (dto.ptk_id) {
            const ptk = await this.prisma.gtk.findFirst({
                where: { ptk_id: dto.ptk_id, sekolah_id: sekolahId },
            });
            if (!ptk) {
                throw new common_1.BadRequestException('PTK / Guru tidak ditemukan di sekolah ini.');
            }
        }
        const now = new Date();
        const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const tanggal = dto.tanggal ? new Date(dto.tanggal) : now;
        const jamMasuk = dto.jam_masuk || currentHourMin;
        return this.prisma.kunjunganPerpustakaan.create({
            data: {
                sekolah_id: sekolahId,
                peserta_didik_id: dto.peserta_didik_id || null,
                ptk_id: dto.ptk_id || null,
                tanggal,
                jam_masuk: jamMasuk,
                keperluan: dto.keperluan?.trim() || null,
                keterangan: dto.keterangan?.trim() || null,
            },
            include: {
                peserta_didik: {
                    select: {
                        nama: true,
                        nisn: true,
                        foto: true,
                        rombongan_belajar: { select: { nama: true } },
                        anggota_rombel: { select: { rombongan_belajar: { select: { nama: true } } }, take: 1 },
                    },
                },
                ptk: { select: { nama: true, nip: true, foto: true, jenis_ptk: { select: { jenis_ptk: true } } } },
            },
        });
    }
    async smartScanKunjungan(sekolahId, dto) {
        const hasPd = Boolean(dto.peserta_didik_id);
        const hasPtk = Boolean(dto.ptk_id);
        if ((hasPd && hasPtk) || (!hasPd && !hasPtk)) {
            throw new common_1.BadRequestException('Pengunjung harus ditentukan tepat salah satu: peserta_didik_id atau ptk_id.');
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const activeVisit = await this.prisma.kunjunganPerpustakaan.findFirst({
            where: {
                sekolah_id: sekolahId,
                ...(dto.peserta_didik_id ? { peserta_didik_id: dto.peserta_didik_id } : { ptk_id: dto.ptk_id }),
                tanggal: { gte: today, lt: tomorrow },
                jam_keluar: null,
            },
            orderBy: { jam_masuk: 'desc' },
            include: {
                peserta_didik: {
                    select: {
                        nama: true,
                        nisn: true,
                        foto: true,
                        rombongan_belajar: { select: { nama: true, jenis_rombel: true, semester_id: true } },
                        anggota_rombel: {
                            where: { rombongan_belajar: { jenis_rombel: 1 } },
                            orderBy: { rombongan_belajar: { semester_id: 'desc' } },
                            select: { rombongan_belajar: { select: { nama: true, jenis_rombel: true, semester_id: true } } },
                            take: 1,
                        },
                    },
                },
                ptk: { select: { nama: true, nip: true, foto: true, jenis_ptk: { select: { jenis_ptk: true } } } },
            },
        });
        const now = new Date();
        const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        if (activeVisit) {
            const updated = await this.prisma.kunjunganPerpustakaan.update({
                where: { kunjungan_perpustakaan_id: activeVisit.kunjungan_perpustakaan_id },
                data: { jam_keluar: currentHourMin },
                include: {
                    peserta_didik: {
                        select: {
                            nama: true,
                            nisn: true,
                            foto: true,
                            rombongan_belajar: { select: { nama: true } },
                            anggota_rombel: { select: { rombongan_belajar: { select: { nama: true } } }, take: 1 },
                        },
                    },
                    ptk: { select: { nama: true, nip: true, foto: true, jenis_ptk: { select: { jenis_ptk: true } } } },
                },
            });
            const memberName = updated.peserta_didik?.nama || updated.ptk?.nama || 'Pengunjung';
            return {
                action: 'check_out',
                data: updated,
                message: `${memberName} berhasil Check-Out (Keluar) pada pukul ${currentHourMin}`,
            };
        }
        else {
            const created = await this.checkInKunjungan(sekolahId, dto);
            const memberName = created.peserta_didik?.nama || created.ptk?.nama || 'Pengunjung';
            return {
                action: 'check_in',
                data: created,
                message: `${memberName} berhasil Check-In (Masuk) pada pukul ${created.jam_masuk}`,
            };
        }
    }
    async checkOutKunjungan(sekolahId, id, dto) {
        const existing = await this.getKunjunganById(sekolahId, id);
        if (existing.jam_keluar) {
            throw new common_1.BadRequestException('Kunjungan ini sudah melakukan check-out sebelumnya.');
        }
        const now = new Date();
        const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const jamKeluar = dto.jam_keluar || currentHourMin;
        return this.prisma.kunjunganPerpustakaan.update({
            where: { kunjungan_perpustakaan_id: id },
            data: { jam_keluar: jamKeluar },
            include: {
                peserta_didik: { select: { nama: true, nisn: true } },
                ptk: { select: { nama: true, nip: true } },
            },
        });
    }
    async updateKunjungan(sekolahId, id, data) {
        await this.getKunjunganById(sekolahId, id);
        return this.prisma.kunjunganPerpustakaan.update({
            where: { kunjungan_perpustakaan_id: id },
            data: {
                ...(data.keperluan !== undefined && { keperluan: data.keperluan?.trim() || null }),
                ...(data.keterangan !== undefined && { keterangan: data.keterangan?.trim() || null }),
                ...(data.jam_masuk && { jam_masuk: data.jam_masuk }),
                ...(data.jam_keluar !== undefined && { jam_keluar: data.jam_keluar || null }),
            },
            include: {
                peserta_didik: { select: { nama: true, nisn: true } },
                ptk: { select: { nama: true, nip: true } },
            },
        });
    }
    async deleteKunjungan(sekolahId, id) {
        await this.getKunjunganById(sekolahId, id);
        return this.prisma.kunjunganPerpustakaan.delete({
            where: { kunjungan_perpustakaan_id: id },
        });
    }
    async getLiterasiList(sekolahId, params) {
        const page = Math.max(1, Number(params.page) || 1);
        const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
        const skip = (page - 1) * limit;
        const whereClause = {
            sekolah_id: sekolahId,
        };
        if (params.peserta_didik_id) {
            whereClause.peserta_didik_id = params.peserta_didik_id;
        }
        if (params.tanggal) {
            whereClause.tanggal = new Date(params.tanggal);
        }
        if (params.search) {
            const search = params.search.trim();
            whereClause.OR = [
                { nama_buku: { contains: search, mode: 'insensitive' } },
                { kesimpulan: { contains: search, mode: 'insensitive' } },
                { peserta_didik: { nama: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [total, data] = await Promise.all([
            this.prisma.literasiPerpustakaan.count({ where: whereClause }),
            this.prisma.literasiPerpustakaan.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { tanggal: 'desc' },
                include: {
                    peserta_didik: {
                        select: {
                            peserta_didik_id: true,
                            nama: true,
                            nisn: true,
                            nipd: true,
                            foto: true,
                            rombongan_belajar: {
                                select: { nama: true, jenis_rombel: true, semester_id: true },
                            },
                            anggota_rombel: {
                                where: {
                                    rombongan_belajar: {
                                        jenis_rombel: 1,
                                    },
                                },
                                orderBy: {
                                    rombongan_belajar: {
                                        semester_id: 'desc',
                                    },
                                },
                                select: {
                                    rombongan_belajar: {
                                        select: { nama: true, jenis_rombel: true, semester_id: true },
                                    },
                                },
                                take: 1,
                            },
                        },
                    },
                },
            }),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                total_pages: Math.ceil(total / limit),
            },
        };
    }
    async getLiterasiById(sekolahId, id) {
        const data = await this.prisma.literasiPerpustakaan.findFirst({
            where: {
                literasi_id: id,
                sekolah_id: sekolahId,
            },
            include: {
                peserta_didik: {
                    select: {
                        peserta_didik_id: true,
                        nama: true,
                        nisn: true,
                    },
                },
            },
        });
        if (!data) {
            throw new common_1.NotFoundException('Data literasi perpustakaan tidak ditemukan.');
        }
        return data;
    }
    async createLiterasi(sekolahId, dto) {
        if (dto.halaman_sampai < dto.halaman_dari) {
            throw new common_1.BadRequestException('halaman_sampai tidak boleh lebih kecil dari halaman_dari.');
        }
        const pd = await this.prisma.pesertaDidik.findFirst({
            where: { peserta_didik_id: dto.peserta_didik_id, sekolah_id: sekolahId },
        });
        if (!pd) {
            throw new common_1.BadRequestException('Peserta didik tidak ditemukan di sekolah ini.');
        }
        return this.prisma.literasiPerpustakaan.create({
            data: {
                sekolah_id: sekolahId,
                peserta_didik_id: dto.peserta_didik_id,
                nama_buku: dto.nama_buku.trim(),
                halaman_dari: Number(dto.halaman_dari),
                halaman_sampai: Number(dto.halaman_sampai),
                kesimpulan: dto.kesimpulan?.trim() || null,
                tanggal: new Date(dto.tanggal),
            },
            include: {
                peserta_didik: {
                    select: {
                        peserta_didik_id: true,
                        nama: true,
                        nisn: true,
                    },
                },
            },
        });
    }
    async updateLiterasi(sekolahId, id, dto) {
        const existing = await this.getLiterasiById(sekolahId, id);
        const hDari = dto.halaman_dari !== undefined ? Number(dto.halaman_dari) : existing.halaman_dari;
        const hSampai = dto.halaman_sampai !== undefined ? Number(dto.halaman_sampai) : existing.halaman_sampai;
        if (hSampai < hDari) {
            throw new common_1.BadRequestException('halaman_sampai tidak boleh lebih kecil dari halaman_dari.');
        }
        if (dto.peserta_didik_id && dto.peserta_didik_id !== existing.peserta_didik_id) {
            const pd = await this.prisma.pesertaDidik.findFirst({
                where: { peserta_didik_id: dto.peserta_didik_id, sekolah_id: sekolahId },
            });
            if (!pd) {
                throw new common_1.BadRequestException('Peserta didik tidak ditemukan di sekolah ini.');
            }
        }
        return this.prisma.literasiPerpustakaan.update({
            where: { literasi_id: id },
            data: {
                ...(dto.peserta_didik_id && { peserta_didik_id: dto.peserta_didik_id }),
                ...(dto.nama_buku && { nama_buku: dto.nama_buku.trim() }),
                ...(dto.halaman_dari !== undefined && { halaman_dari: hDari }),
                ...(dto.halaman_sampai !== undefined && { halaman_sampai: hSampai }),
                ...(dto.kesimpulan !== undefined && { kesimpulan: dto.kesimpulan?.trim() || null }),
                ...(dto.tanggal && { tanggal: new Date(dto.tanggal) }),
            },
            include: {
                peserta_didik: {
                    select: {
                        peserta_didik_id: true,
                        nama: true,
                        nisn: true,
                    },
                },
            },
        });
    }
    async deleteLiterasi(sekolahId, id) {
        await this.getLiterasiById(sekolahId, id);
        return this.prisma.literasiPerpustakaan.delete({
            where: { literasi_id: id },
        });
    }
};
exports.PerpustakaanService = PerpustakaanService;
exports.PerpustakaanService = PerpustakaanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PerpustakaanService);
//# sourceMappingURL=perpustakaan.service.js.map