import { JadwalService } from './jadwal.service';
import type { Request } from 'express';
export declare class JadwalController {
    private readonly jadwalService;
    constructor(jadwalService: JadwalService);
    private getSekolahInfo;
    getJenisJadwal(req: Request): Promise<{
        status: string;
        klien: any;
        data: ({
            pengaturan_jadwal: {
                sekolah_id: string;
                created_at: Date;
                updated_at: Date;
                aktif: boolean;
                urutan: number;
                jenis_jadwal_id: string;
                pengaturan_jadwal_id: string;
                hari: number;
                tipe: number;
                durasi_menit: number;
            }[];
            pengaturan_hari: {
                sekolah_id: string;
                created_at: Date;
                updated_at: Date;
                aktif: boolean;
                jenis_jadwal_id: string;
                hari: number;
                pengaturan_hari_id: string;
                jam_masuk: Date;
                jam_pulang: Date;
            }[];
        } & {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            jenis_jadwal_id: string;
            custom_mapel: boolean;
        })[];
    }>;
    createJenisJadwal(req: Request, body: {
        nama: string;
        jam_masuk: string;
        jam_pulang: string;
        custom_mapel?: boolean;
    }): Promise<{
        status: string;
        klien: any;
        data: {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            jenis_jadwal_id: string;
            custom_mapel: boolean;
        };
    }>;
    updateJenisJadwal(req: Request, id: string, body: {
        nama?: string;
        jam_masuk?: string;
        jam_pulang?: string;
        custom_mapel?: boolean;
        aktif?: boolean;
    }): Promise<{
        status: string;
        klien: any;
        data: {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            jenis_jadwal_id: string;
            custom_mapel: boolean;
        };
    }>;
    deleteJenisJadwal(req: Request, id: string): Promise<{
        status: string;
        klien: any;
        data: {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            jenis_jadwal_id: string;
            custom_mapel: boolean;
        };
    }>;
    toggleJenisJadwal(req: Request, id: string, body: {
        aktif: boolean;
    }): Promise<{
        status: string;
        klien: any;
        data: {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            jenis_jadwal_id: string;
            custom_mapel: boolean;
        };
    }>;
    updatePengaturanHari(req: Request, body: {
        jenis_jadwal_id: string;
        hari: number;
        jam_masuk?: string;
        jam_pulang?: string;
        aktif?: boolean;
    }): Promise<{
        status: string;
        klien: any;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            jenis_jadwal_id: string;
            hari: number;
            pengaturan_hari_id: string;
            jam_masuk: Date;
            jam_pulang: Date;
        };
    }>;
    getPengaturanJadwal(req: Request, jenisJadwalId: string, hari?: string): Promise<{
        status: string;
        klien: any;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            urutan: number;
            jenis_jadwal_id: string;
            pengaturan_jadwal_id: string;
            hari: number;
            tipe: number;
            durasi_menit: number;
        }[];
    }>;
    upsertPengaturanJadwal(req: Request, body: {
        jenis_jadwal_id: string;
        hari: number;
        urutan: number;
        tipe: number;
        durasi_menit: number;
        aktif?: boolean;
    }): Promise<{
        status: string;
        klien: any;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            urutan: number;
            jenis_jadwal_id: string;
            pengaturan_jadwal_id: string;
            hari: number;
            tipe: number;
            durasi_menit: number;
        };
    }>;
    deletePengaturanJadwal(req: Request, id: string): Promise<{
        status: string;
        klien: any;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            urutan: number;
            jenis_jadwal_id: string;
            pengaturan_jadwal_id: string;
            hari: number;
            tipe: number;
            durasi_menit: number;
        };
    }>;
    getJadwalPelajaran(req: Request, jenisJadwalId: string, rombelId?: string): Promise<{
        status: string;
        klien: any;
        data: (({
            rombongan_belajar: {
                nama: string;
                rombongan_belajar_id: string;
                tingkat_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
            };
            pembelajaran: {
                create_date: Date;
                last_update: Date;
                last_sync: Date | null;
                soft_delete: import("@prisma/client-runtime-utils").Decimal | null;
                sekolah_id: string | null;
                rombongan_belajar_id: string;
                semester_id: string | null;
                ptk_id: string | null;
                updater_id: string | null;
                ptk_terdaftar_id: string | null;
                status_di_kurikulum: import("@prisma/client-runtime-utils").Decimal | null;
                pembelajaran_id: string;
                mata_pelajaran_id: number | null;
                sk_mengajar: string | null;
                tanggal_sk_mengajar: Date | null;
                jam_mengajar_per_minggu: import("@prisma/client-runtime-utils").Decimal | null;
                nama_mata_pelajaran: string | null;
                induk_pembelajaran_id: string | null;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            rombongan_belajar_id: string;
            aktif: boolean;
            urutan: number;
            pembelajaran_id: string;
            jenis_jadwal_id: string;
            hari: number;
            jadwal_pelajaran_id: string;
        }) | {
            pembelajaran: {
                gtk: any;
                create_date: Date;
                last_update: Date;
                last_sync: Date | null;
                soft_delete: import("@prisma/client-runtime-utils").Decimal | null;
                sekolah_id: string | null;
                rombongan_belajar_id: string;
                semester_id: string | null;
                ptk_id: string | null;
                updater_id: string | null;
                ptk_terdaftar_id: string | null;
                status_di_kurikulum: import("@prisma/client-runtime-utils").Decimal | null;
                pembelajaran_id: string;
                mata_pelajaran_id: number | null;
                sk_mengajar: string | null;
                tanggal_sk_mengajar: Date | null;
                jam_mengajar_per_minggu: import("@prisma/client-runtime-utils").Decimal | null;
                nama_mata_pelajaran: string | null;
                induk_pembelajaran_id: string | null;
            };
            rombongan_belajar: {
                nama: string;
                rombongan_belajar_id: string;
                tingkat_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
            };
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            rombongan_belajar_id: string;
            aktif: boolean;
            urutan: number;
            pembelajaran_id: string;
            jenis_jadwal_id: string;
            hari: number;
            jadwal_pelajaran_id: string;
        })[];
    }>;
    upsertJadwalPelajaran(req: Request, body: {
        jenis_jadwal_id: string;
        rombongan_belajar_id: string;
        pembelajaran_id: string;
        hari: number;
        urutan: number;
    }): Promise<{
        status: string;
        klien: any;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            rombongan_belajar_id: string;
            aktif: boolean;
            urutan: number;
            pembelajaran_id: string;
            jenis_jadwal_id: string;
            hari: number;
            jadwal_pelajaran_id: string;
        };
    }>;
    deleteJadwalPelajaran(req: Request, id: string): Promise<{
        status: string;
        klien: any;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            rombongan_belajar_id: string;
            aktif: boolean;
            urutan: number;
            pembelajaran_id: string;
            jenis_jadwal_id: string;
            hari: number;
            jadwal_pelajaran_id: string;
        };
    }>;
}
