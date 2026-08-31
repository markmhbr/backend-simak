import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateKategoriBukuDto, UpdateKategoriBukuDto } from './dto/kategori-buku.dto';
import { CreateBukuDto, UpdateBukuDto } from './dto/buku.dto';
import { CreatePeminjamanDto } from './dto/peminjaman.dto';
import { PengembalianDto } from './dto/pengembalian.dto';
import { CreateKunjunganDto, CheckOutKunjunganDto } from './dto/kunjungan.dto';
import { CreateLiterasiDto, UpdateLiterasiDto } from './dto/literasi.dto';
export declare class PerpustakaanService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(sekolahId: string): Promise<{
        total_judul_buku: number;
        total_koleksi_buku: number;
        total_buku_tersedia: number;
        total_buku_dipinjam: number;
        total_peminjaman_aktif: number;
        total_peminjaman_selesai: number;
        kunjungan_hari_ini: number;
        pengunjung_sedang_di_perpus: number;
        literasi_bulan_ini: number;
    }>;
    getKategoriList(sekolahId: string): Promise<({
        _count: {
            buku: number;
        };
    } & {
        nama: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        kategori_buku_id: string;
        deskripsi: string | null;
    })[]>;
    getKategoriById(sekolahId: string, id: string): Promise<{
        _count: {
            buku: number;
        };
    } & {
        nama: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        kategori_buku_id: string;
        deskripsi: string | null;
    }>;
    createKategori(sekolahId: string, dto: CreateKategoriBukuDto): Promise<{
        nama: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        kategori_buku_id: string;
        deskripsi: string | null;
    }>;
    updateKategori(sekolahId: string, id: string, dto: UpdateKategoriBukuDto): Promise<{
        nama: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        kategori_buku_id: string;
        deskripsi: string | null;
    }>;
    deleteKategori(sekolahId: string, id: string): Promise<{
        nama: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        kategori_buku_id: string;
        deskripsi: string | null;
    }>;
    getBukuList(sekolahId: string, params: {
        search?: string;
        kategori_buku_id?: string;
        status?: number;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            kategori: {
                nama: string;
                kategori_buku_id: string;
            };
        } & {
            sekolah_id: string;
            status: number;
            created_at: Date;
            updated_at: Date;
            kategori_buku_id: string;
            deskripsi: string | null;
            buku_id: string;
            kode: string;
            isbn: string | null;
            judul: string;
            penulis: string | null;
            penerbit: string | null;
            tahun_terbit: number | null;
            jumlah: number;
            tersedia: number;
            kondisi: number;
            lokasi_rak: string | null;
            sampul: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            total_pages: number;
        };
    }>;
    getBukuById(sekolahId: string, id: string): Promise<{
        kategori: {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            kategori_buku_id: string;
            deskripsi: string | null;
        };
    } & {
        sekolah_id: string;
        status: number;
        created_at: Date;
        updated_at: Date;
        kategori_buku_id: string;
        deskripsi: string | null;
        buku_id: string;
        kode: string;
        isbn: string | null;
        judul: string;
        penulis: string | null;
        penerbit: string | null;
        tahun_terbit: number | null;
        jumlah: number;
        tersedia: number;
        kondisi: number;
        lokasi_rak: string | null;
        sampul: string | null;
    }>;
    createBuku(sekolahId: string, dto: CreateBukuDto): Promise<{
        kategori: {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            kategori_buku_id: string;
            deskripsi: string | null;
        };
    } & {
        sekolah_id: string;
        status: number;
        created_at: Date;
        updated_at: Date;
        kategori_buku_id: string;
        deskripsi: string | null;
        buku_id: string;
        kode: string;
        isbn: string | null;
        judul: string;
        penulis: string | null;
        penerbit: string | null;
        tahun_terbit: number | null;
        jumlah: number;
        tersedia: number;
        kondisi: number;
        lokasi_rak: string | null;
        sampul: string | null;
    }>;
    updateBuku(sekolahId: string, id: string, dto: UpdateBukuDto): Promise<{
        kategori: {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            kategori_buku_id: string;
            deskripsi: string | null;
        };
    } & {
        sekolah_id: string;
        status: number;
        created_at: Date;
        updated_at: Date;
        kategori_buku_id: string;
        deskripsi: string | null;
        buku_id: string;
        kode: string;
        isbn: string | null;
        judul: string;
        penulis: string | null;
        penerbit: string | null;
        tahun_terbit: number | null;
        jumlah: number;
        tersedia: number;
        kondisi: number;
        lokasi_rak: string | null;
        sampul: string | null;
    }>;
    deleteBuku(sekolahId: string, id: string): Promise<{
        sekolah_id: string;
        status: number;
        created_at: Date;
        updated_at: Date;
        kategori_buku_id: string;
        deskripsi: string | null;
        buku_id: string;
        kode: string;
        isbn: string | null;
        judul: string;
        penulis: string | null;
        penerbit: string | null;
        tahun_terbit: number | null;
        jumlah: number;
        tersedia: number;
        kondisi: number;
        lokasi_rak: string | null;
        sampul: string | null;
    }>;
    getPeminjamanList(sekolahId: string, params: {
        search?: string;
        status?: number;
        peserta_didik_id?: string;
        ptk_id?: string;
        tanggal_mulai?: string;
        tanggal_selesai?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            peserta_didik: {
                peserta_didik_id: string;
                nama: string;
                nisn: string;
                nipd: string;
                foto: string;
                rombongan_belajar: {
                    nama: string;
                    jenis_rombel: import("@prisma/client-runtime-utils").Decimal;
                    semester_id: string;
                };
                anggota_rombel: {
                    rombongan_belajar: {
                        nama: string;
                        jenis_rombel: import("@prisma/client-runtime-utils").Decimal;
                        semester_id: string;
                    };
                }[];
            };
            ptk: {
                nama: string;
                foto: string;
                ptk_id: string;
                nip: string;
                jenis_ptk: {
                    jenis_ptk: string;
                };
                nuptk: string;
            };
            detail_peminjaman: ({
                buku: {
                    buku_id: string;
                    kode: string;
                    judul: string;
                    sampul: string;
                };
            } & {
                keterangan: string | null;
                created_at: Date;
                updated_at: Date;
                buku_id: string;
                jumlah: number;
                peminjaman_id: string;
                detail_peminjaman_id: string;
                jumlah_kembali: number;
                kondisi_kembali: number | null;
            })[];
        } & {
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peminjaman_id: string;
            nomor_peminjaman: string;
            tanggal_pinjam: Date;
            tanggal_jatuh_tempo: Date;
            tanggal_kembali: Date | null;
            denda: import("@prisma/client-runtime-utils").Decimal;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            total_pages: number;
        };
    }>;
    getPeminjamanById(sekolahId: string, id: string): Promise<{
        peserta_didik: {
            peserta_didik_id: string;
            nama: string;
            nisn: string;
            nipd: string;
            rombongan_belajar: {
                nama: string;
                rombongan_belajar_id: string;
            };
        };
        ptk: {
            nama: string;
            ptk_id: string;
            nip: string;
            nuptk: string;
        };
        detail_peminjaman: ({
            buku: {
                buku_id: string;
                kode: string;
                judul: string;
                penulis: string;
                penerbit: string;
                lokasi_rak: string;
                sampul: string;
            };
        } & {
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            buku_id: string;
            jumlah: number;
            peminjaman_id: string;
            detail_peminjaman_id: string;
            jumlah_kembali: number;
            kondisi_kembali: number | null;
        })[];
    } & {
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string | null;
        status: number;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peminjaman_id: string;
        nomor_peminjaman: string;
        tanggal_pinjam: Date;
        tanggal_jatuh_tempo: Date;
        tanggal_kembali: Date | null;
        denda: import("@prisma/client-runtime-utils").Decimal;
    }>;
    createPeminjaman(sekolahId: string, dto: CreatePeminjamanDto): Promise<{
        peserta_didik: {
            nama: string;
            nisn: string;
        };
        ptk: {
            nama: string;
            nip: string;
        };
        detail_peminjaman: ({
            buku: {
                kode: string;
                judul: string;
            };
        } & {
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            buku_id: string;
            jumlah: number;
            peminjaman_id: string;
            detail_peminjaman_id: string;
            jumlah_kembali: number;
            kondisi_kembali: number | null;
        })[];
    } & {
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string | null;
        status: number;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peminjaman_id: string;
        nomor_peminjaman: string;
        tanggal_pinjam: Date;
        tanggal_jatuh_tempo: Date;
        tanggal_kembali: Date | null;
        denda: import("@prisma/client-runtime-utils").Decimal;
    }>;
    prosesPengembalian(sekolahId: string, peminjamanId: string, dto: PengembalianDto): Promise<{
        peserta_didik: {
            nama: string;
            nisn: string;
        };
        ptk: {
            nama: string;
            nip: string;
        };
        detail_peminjaman: ({
            buku: {
                kode: string;
                judul: string;
            };
        } & {
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            buku_id: string;
            jumlah: number;
            peminjaman_id: string;
            detail_peminjaman_id: string;
            jumlah_kembali: number;
            kondisi_kembali: number | null;
        })[];
    } & {
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string | null;
        status: number;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peminjaman_id: string;
        nomor_peminjaman: string;
        tanggal_pinjam: Date;
        tanggal_jatuh_tempo: Date;
        tanggal_kembali: Date | null;
        denda: import("@prisma/client-runtime-utils").Decimal;
    }>;
    batalkanPeminjaman(sekolahId: string, id: string): Promise<{
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string | null;
        status: number;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peminjaman_id: string;
        nomor_peminjaman: string;
        tanggal_pinjam: Date;
        tanggal_jatuh_tempo: Date;
        tanggal_kembali: Date | null;
        denda: import("@prisma/client-runtime-utils").Decimal;
    }>;
    deletePeminjaman(sekolahId: string, id: string): Promise<{
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string | null;
        status: number;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peminjaman_id: string;
        nomor_peminjaman: string;
        tanggal_pinjam: Date;
        tanggal_jatuh_tempo: Date;
        tanggal_kembali: Date | null;
        denda: import("@prisma/client-runtime-utils").Decimal;
    }>;
    getKunjunganList(sekolahId: string, params: {
        tanggal?: string;
        sedang_berada_di_perpus?: boolean;
        peserta_didik_id?: string;
        ptk_id?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            peserta_didik: {
                peserta_didik_id: string;
                nama: string;
                nisn: string;
                nipd: string;
                foto: string;
                rombongan_belajar: {
                    nama: string;
                    jenis_rombel: import("@prisma/client-runtime-utils").Decimal;
                    semester_id: string;
                };
                anggota_rombel: {
                    rombongan_belajar: {
                        nama: string;
                        jenis_rombel: import("@prisma/client-runtime-utils").Decimal;
                        semester_id: string;
                    };
                }[];
            };
            ptk: {
                nama: string;
                foto: string;
                ptk_id: string;
                nip: string;
                jenis_ptk: {
                    jenis_ptk: string;
                };
                nuptk: string;
            };
        } & {
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            tanggal: Date;
            jam_keluar: string | null;
            jam_masuk: string;
            kunjungan_perpustakaan_id: string;
            keperluan: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            total_pages: number;
        };
    }>;
    getKunjunganById(sekolahId: string, id: string): Promise<{
        peserta_didik: {
            peserta_didik_id: string;
            nama: string;
            nisn: string;
        };
        ptk: {
            nama: string;
            ptk_id: string;
            nip: string;
        };
    } & {
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string | null;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        tanggal: Date;
        jam_keluar: string | null;
        jam_masuk: string;
        kunjungan_perpustakaan_id: string;
        keperluan: string | null;
    }>;
    checkInKunjungan(sekolahId: string, dto: CreateKunjunganDto): Promise<{
        peserta_didik: {
            nama: string;
            nisn: string;
            foto: string;
            rombongan_belajar: {
                nama: string;
            };
            anggota_rombel: {
                rombongan_belajar: {
                    nama: string;
                };
            }[];
        };
        ptk: {
            nama: string;
            foto: string;
            nip: string;
            jenis_ptk: {
                jenis_ptk: string;
            };
        };
    } & {
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string | null;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        tanggal: Date;
        jam_keluar: string | null;
        jam_masuk: string;
        kunjungan_perpustakaan_id: string;
        keperluan: string | null;
    }>;
    smartScanKunjungan(sekolahId: string, dto: CreateKunjunganDto): Promise<{
        action: string;
        data: {
            peserta_didik: {
                nama: string;
                nisn: string;
                foto: string;
                rombongan_belajar: {
                    nama: string;
                };
                anggota_rombel: {
                    rombongan_belajar: {
                        nama: string;
                    };
                }[];
            };
            ptk: {
                nama: string;
                foto: string;
                nip: string;
                jenis_ptk: {
                    jenis_ptk: string;
                };
            };
        } & {
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            tanggal: Date;
            jam_keluar: string | null;
            jam_masuk: string;
            kunjungan_perpustakaan_id: string;
            keperluan: string | null;
        };
        message: string;
    }>;
    checkOutKunjungan(sekolahId: string, id: string, dto: CheckOutKunjunganDto): Promise<{
        peserta_didik: {
            nama: string;
            nisn: string;
        };
        ptk: {
            nama: string;
            nip: string;
        };
    } & {
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string | null;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        tanggal: Date;
        jam_keluar: string | null;
        jam_masuk: string;
        kunjungan_perpustakaan_id: string;
        keperluan: string | null;
    }>;
    updateKunjungan(sekolahId: string, id: string, data: {
        keperluan?: string;
        keterangan?: string;
        jam_masuk?: string;
        jam_keluar?: string;
    }): Promise<{
        peserta_didik: {
            nama: string;
            nisn: string;
        };
        ptk: {
            nama: string;
            nip: string;
        };
    } & {
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string | null;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        tanggal: Date;
        jam_keluar: string | null;
        jam_masuk: string;
        kunjungan_perpustakaan_id: string;
        keperluan: string | null;
    }>;
    deleteKunjungan(sekolahId: string, id: string): Promise<{
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string | null;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        tanggal: Date;
        jam_keluar: string | null;
        jam_masuk: string;
        kunjungan_perpustakaan_id: string;
        keperluan: string | null;
    }>;
    getLiterasiList(sekolahId: string, params: {
        peserta_didik_id?: string;
        tanggal?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: ({
            peserta_didik: {
                peserta_didik_id: string;
                nama: string;
                nisn: string;
                nipd: string;
                foto: string;
                rombongan_belajar: {
                    nama: string;
                    jenis_rombel: import("@prisma/client-runtime-utils").Decimal;
                    semester_id: string;
                };
                anggota_rombel: {
                    rombongan_belajar: {
                        nama: string;
                        jenis_rombel: import("@prisma/client-runtime-utils").Decimal;
                        semester_id: string;
                    };
                }[];
            };
        } & {
            peserta_didik_id: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            tanggal: Date;
            literasi_id: string;
            nama_buku: string;
            halaman_dari: number;
            halaman_sampai: number;
            kesimpulan: string | null;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            total_pages: number;
        };
    }>;
    getLiterasiById(sekolahId: string, id: string): Promise<{
        peserta_didik: {
            peserta_didik_id: string;
            nama: string;
            nisn: string;
        };
    } & {
        peserta_didik_id: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        literasi_id: string;
        nama_buku: string;
        halaman_dari: number;
        halaman_sampai: number;
        kesimpulan: string | null;
    }>;
    createLiterasi(sekolahId: string, dto: CreateLiterasiDto): Promise<{
        peserta_didik: {
            peserta_didik_id: string;
            nama: string;
            nisn: string;
        };
    } & {
        peserta_didik_id: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        literasi_id: string;
        nama_buku: string;
        halaman_dari: number;
        halaman_sampai: number;
        kesimpulan: string | null;
    }>;
    updateLiterasi(sekolahId: string, id: string, dto: UpdateLiterasiDto): Promise<{
        peserta_didik: {
            peserta_didik_id: string;
            nama: string;
            nisn: string;
        };
    } & {
        peserta_didik_id: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        literasi_id: string;
        nama_buku: string;
        halaman_dari: number;
        halaman_sampai: number;
        kesimpulan: string | null;
    }>;
    deleteLiterasi(sekolahId: string, id: string): Promise<{
        peserta_didik_id: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        literasi_id: string;
        nama_buku: string;
        halaman_dari: number;
        halaman_sampai: number;
        kesimpulan: string | null;
    }>;
}
