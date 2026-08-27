import type { Request } from 'express';
import { PerpustakaanService } from './perpustakaan.service';
import { CreateKategoriBukuDto, UpdateKategoriBukuDto } from './dto/kategori-buku.dto';
import { CreateBukuDto, UpdateBukuDto } from './dto/buku.dto';
import { CreatePeminjamanDto } from './dto/peminjaman.dto';
import { PengembalianDto } from './dto/pengembalian.dto';
import { CreateKunjunganDto, CheckOutKunjunganDto } from './dto/kunjungan.dto';
import { CreateLiterasiDto, UpdateLiterasiDto } from './dto/literasi.dto';
export declare class PerpustakaanController {
    private readonly perpustakaanService;
    constructor(perpustakaanService: PerpustakaanService);
    private getSekolahId;
    getDashboardStats(req: Request): Promise<{
        status: string;
        data: {
            total_judul_buku: number;
            total_koleksi_buku: number;
            total_buku_tersedia: number;
            total_buku_dipinjam: number;
            total_peminjaman_aktif: number;
            total_peminjaman_selesai: number;
            kunjungan_hari_ini: number;
            pengunjung_sedang_di_perpus: number;
            literasi_bulan_ini: number;
        };
    }>;
    getKategoriList(req: Request): Promise<{
        status: string;
        data: ({
            _count: {
                buku: number;
            };
        } & {
            sekolah_id: string;
            nama: string;
            created_at: Date;
            updated_at: Date;
            kategori_buku_id: string;
            deskripsi: string | null;
        })[];
    }>;
    getKategoriById(req: Request, id: string): Promise<{
        status: string;
        data: {
            _count: {
                buku: number;
            };
        } & {
            sekolah_id: string;
            nama: string;
            created_at: Date;
            updated_at: Date;
            kategori_buku_id: string;
            deskripsi: string | null;
        };
    }>;
    createKategori(req: Request, dto: CreateKategoriBukuDto): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            nama: string;
            created_at: Date;
            updated_at: Date;
            kategori_buku_id: string;
            deskripsi: string | null;
        };
    }>;
    updateKategori(req: Request, id: string, dto: UpdateKategoriBukuDto): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            nama: string;
            created_at: Date;
            updated_at: Date;
            kategori_buku_id: string;
            deskripsi: string | null;
        };
    }>;
    deleteKategori(req: Request, id: string): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            nama: string;
            created_at: Date;
            updated_at: Date;
            kategori_buku_id: string;
            deskripsi: string | null;
        };
    }>;
    getBukuList(req: Request, search?: string, kategori_buku_id?: string, status?: number, page?: number, limit?: number): Promise<{
        data: ({
            kategori: {
                nama: string;
                kategori_buku_id: string;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            status: number;
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
        status: string;
    }>;
    getBukuById(req: Request, id: string): Promise<{
        status: string;
        data: {
            kategori: {
                sekolah_id: string;
                nama: string;
                created_at: Date;
                updated_at: Date;
                kategori_buku_id: string;
                deskripsi: string | null;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            status: number;
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
        };
    }>;
    createBuku(req: Request, dto: CreateBukuDto): Promise<{
        status: string;
        message: string;
        data: {
            kategori: {
                sekolah_id: string;
                nama: string;
                created_at: Date;
                updated_at: Date;
                kategori_buku_id: string;
                deskripsi: string | null;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            status: number;
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
        };
    }>;
    updateBuku(req: Request, id: string, dto: UpdateBukuDto): Promise<{
        status: string;
        message: string;
        data: {
            kategori: {
                sekolah_id: string;
                nama: string;
                created_at: Date;
                updated_at: Date;
                kategori_buku_id: string;
                deskripsi: string | null;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            status: number;
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
        };
    }>;
    deleteBuku(req: Request, id: string): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            status: number;
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
        };
    }>;
    getPeminjamanList(req: Request, search?: string, status?: number, peserta_didik_id?: string, ptk_id?: string, tanggal_mulai?: string, tanggal_selesai?: string, page?: number, limit?: number): Promise<{
        data: ({
            peserta_didik: {
                nama: string;
                peserta_didik_id: string;
                nisn: string;
                nipd: string;
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
                    sampul: string;
                };
            } & {
                created_at: Date;
                updated_at: Date;
                keterangan: string | null;
                buku_id: string;
                jumlah: number;
                peminjaman_id: string;
                detail_peminjaman_id: string;
                jumlah_kembali: number;
                kondisi_kembali: number | null;
            })[];
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            status: number;
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
        status: string;
    }>;
    getPeminjamanById(req: Request, id: string): Promise<{
        status: string;
        data: {
            peserta_didik: {
                nama: string;
                peserta_didik_id: string;
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
                created_at: Date;
                updated_at: Date;
                keterangan: string | null;
                buku_id: string;
                jumlah: number;
                peminjaman_id: string;
                detail_peminjaman_id: string;
                jumlah_kembali: number;
                kondisi_kembali: number | null;
            })[];
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            status: number;
            peminjaman_id: string;
            nomor_peminjaman: string;
            tanggal_pinjam: Date;
            tanggal_jatuh_tempo: Date;
            tanggal_kembali: Date | null;
            denda: import("@prisma/client-runtime-utils").Decimal;
        };
    }>;
    createPeminjaman(req: Request, dto: CreatePeminjamanDto): Promise<{
        status: string;
        message: string;
        data: {
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
                created_at: Date;
                updated_at: Date;
                keterangan: string | null;
                buku_id: string;
                jumlah: number;
                peminjaman_id: string;
                detail_peminjaman_id: string;
                jumlah_kembali: number;
                kondisi_kembali: number | null;
            })[];
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            status: number;
            peminjaman_id: string;
            nomor_peminjaman: string;
            tanggal_pinjam: Date;
            tanggal_jatuh_tempo: Date;
            tanggal_kembali: Date | null;
            denda: import("@prisma/client-runtime-utils").Decimal;
        };
    }>;
    prosesPengembalian(req: Request, id: string, dto: PengembalianDto): Promise<{
        status: string;
        message: string;
        data: {
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
                created_at: Date;
                updated_at: Date;
                keterangan: string | null;
                buku_id: string;
                jumlah: number;
                peminjaman_id: string;
                detail_peminjaman_id: string;
                jumlah_kembali: number;
                kondisi_kembali: number | null;
            })[];
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            status: number;
            peminjaman_id: string;
            nomor_peminjaman: string;
            tanggal_pinjam: Date;
            tanggal_jatuh_tempo: Date;
            tanggal_kembali: Date | null;
            denda: import("@prisma/client-runtime-utils").Decimal;
        };
    }>;
    batalkanPeminjaman(req: Request, id: string): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            status: number;
            peminjaman_id: string;
            nomor_peminjaman: string;
            tanggal_pinjam: Date;
            tanggal_jatuh_tempo: Date;
            tanggal_kembali: Date | null;
            denda: import("@prisma/client-runtime-utils").Decimal;
        };
    }>;
    deletePeminjaman(req: Request, id: string): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            status: number;
            peminjaman_id: string;
            nomor_peminjaman: string;
            tanggal_pinjam: Date;
            tanggal_jatuh_tempo: Date;
            tanggal_kembali: Date | null;
            denda: import("@prisma/client-runtime-utils").Decimal;
        };
    }>;
    getKunjunganList(req: Request, tanggal?: string, sedang_berada_di_perpus?: string, peserta_didik_id?: string, ptk_id?: string, page?: number, limit?: number): Promise<{
        data: ({
            peserta_didik: {
                nama: string;
                peserta_didik_id: string;
                nisn: string;
                nipd: string;
                rombongan_belajar: {
                    nama: string;
                };
            };
            ptk: {
                nama: string;
                ptk_id: string;
                nip: string;
                nuptk: string;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
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
        status: string;
    }>;
    getKunjunganById(req: Request, id: string): Promise<{
        status: string;
        data: {
            peserta_didik: {
                nama: string;
                peserta_didik_id: string;
                nisn: string;
            };
            ptk: {
                nama: string;
                ptk_id: string;
                nip: string;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            tanggal: Date;
            jam_keluar: string | null;
            jam_masuk: string;
            kunjungan_perpustakaan_id: string;
            keperluan: string | null;
        };
    }>;
    checkInKunjungan(req: Request, dto: CreateKunjunganDto): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik: {
                nama: string;
                nisn: string;
            };
            ptk: {
                nama: string;
                nip: string;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            tanggal: Date;
            jam_keluar: string | null;
            jam_masuk: string;
            kunjungan_perpustakaan_id: string;
            keperluan: string | null;
        };
    }>;
    checkOutKunjungan(req: Request, id: string, dto: CheckOutKunjunganDto): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik: {
                nama: string;
                nisn: string;
            };
            ptk: {
                nama: string;
                nip: string;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            tanggal: Date;
            jam_keluar: string | null;
            jam_masuk: string;
            kunjungan_perpustakaan_id: string;
            keperluan: string | null;
        };
    }>;
    updateKunjungan(req: Request, id: string, body: {
        keperluan?: string;
        keterangan?: string;
        jam_masuk?: string;
        jam_keluar?: string;
    }): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik: {
                nama: string;
                nisn: string;
            };
            ptk: {
                nama: string;
                nip: string;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            tanggal: Date;
            jam_keluar: string | null;
            jam_masuk: string;
            kunjungan_perpustakaan_id: string;
            keperluan: string | null;
        };
    }>;
    deleteKunjungan(req: Request, id: string): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            peserta_didik_id: string | null;
            ptk_id: string | null;
            tanggal: Date;
            jam_keluar: string | null;
            jam_masuk: string;
            kunjungan_perpustakaan_id: string;
            keperluan: string | null;
        };
    }>;
    getLiterasiList(req: Request, peserta_didik_id?: string, tanggal?: string, search?: string, page?: number, limit?: number): Promise<{
        data: ({
            peserta_didik: {
                nama: string;
                peserta_didik_id: string;
                nisn: string;
                nipd: string;
                rombongan_belajar: {
                    nama: string;
                };
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            peserta_didik_id: string;
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
        status: string;
    }>;
    getLiterasiById(req: Request, id: string): Promise<{
        status: string;
        data: {
            peserta_didik: {
                nama: string;
                peserta_didik_id: string;
                nisn: string;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            peserta_didik_id: string;
            tanggal: Date;
            literasi_id: string;
            nama_buku: string;
            halaman_dari: number;
            halaman_sampai: number;
            kesimpulan: string | null;
        };
    }>;
    createLiterasi(req: Request, dto: CreateLiterasiDto): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik: {
                nama: string;
                peserta_didik_id: string;
                nisn: string;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            peserta_didik_id: string;
            tanggal: Date;
            literasi_id: string;
            nama_buku: string;
            halaman_dari: number;
            halaman_sampai: number;
            kesimpulan: string | null;
        };
    }>;
    updateLiterasi(req: Request, id: string, dto: UpdateLiterasiDto): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik: {
                nama: string;
                peserta_didik_id: string;
                nisn: string;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            peserta_didik_id: string;
            tanggal: Date;
            literasi_id: string;
            nama_buku: string;
            halaman_dari: number;
            halaman_sampai: number;
            kesimpulan: string | null;
        };
    }>;
    deleteLiterasi(req: Request, id: string): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            peserta_didik_id: string;
            tanggal: Date;
            literasi_id: string;
            nama_buku: string;
            halaman_dari: number;
            halaman_sampai: number;
            kesimpulan: string | null;
        };
    }>;
}
