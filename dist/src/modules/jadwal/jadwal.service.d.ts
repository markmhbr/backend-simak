import { PrismaService } from '../../core/prisma/prisma.service';
export declare class JadwalService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getJenisJadwal(sekolahId: string): Promise<({
        pengaturan_jadwal: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            tipe: number;
            urutan: number;
            jenis_jadwal_id: string;
            pengaturan_jadwal_id: string;
            hari: number;
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
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama: string;
        jenis_jadwal_id: string;
        custom_mapel: boolean;
    })[]>;
    createJenisJadwal(sekolahId: string, data: {
        nama: string;
        jam_masuk: string;
        jam_pulang: string;
        custom_mapel?: boolean;
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama: string;
        jenis_jadwal_id: string;
        custom_mapel: boolean;
    }>;
    updateJenisJadwal(sekolahId: string, jenisJadwalId: string, data: {
        nama?: string;
        custom_mapel?: boolean;
        aktif?: boolean;
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama: string;
        jenis_jadwal_id: string;
        custom_mapel: boolean;
    }>;
    deleteJenisJadwal(sekolahId: string, jenisJadwalId: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama: string;
        jenis_jadwal_id: string;
        custom_mapel: boolean;
    }>;
    toggleJenisJadwal(sekolahId: string, jenisJadwalId: string, aktif: boolean): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama: string;
        jenis_jadwal_id: string;
        custom_mapel: boolean;
    }>;
    updatePengaturanHari(sekolahId: string, data: {
        jenis_jadwal_id: string;
        hari: number;
        jam_masuk?: string;
        jam_pulang?: string;
        aktif?: boolean;
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        jenis_jadwal_id: string;
        hari: number;
        pengaturan_hari_id: string;
        jam_masuk: Date;
        jam_pulang: Date;
    }>;
    getPengaturanJadwal(sekolahId: string, jenisJadwalId: string, hari?: number): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        tipe: number;
        urutan: number;
        jenis_jadwal_id: string;
        pengaturan_jadwal_id: string;
        hari: number;
        durasi_menit: number;
    }[]>;
    upsertPengaturanJadwal(sekolahId: string, data: {
        jenis_jadwal_id: string;
        hari: number;
        urutan: number;
        tipe: number;
        durasi_menit: number;
        aktif?: boolean;
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        tipe: number;
        urutan: number;
        jenis_jadwal_id: string;
        pengaturan_jadwal_id: string;
        hari: number;
        durasi_menit: number;
    }>;
    deletePengaturanJadwal(sekolahId: string, pengaturanJadwalId: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        tipe: number;
        urutan: number;
        jenis_jadwal_id: string;
        pengaturan_jadwal_id: string;
        hari: number;
        durasi_menit: number;
    }>;
    getJadwalPelajaran(sekolahId: string, jenisJadwalId: string, rombelId?: string): Promise<(({
        pembelajaran: {
            sekolah_id: string | null;
            ptk_id: string | null;
            create_date: Date;
            last_update: Date;
            soft_delete: import("@prisma/client-runtime-utils").Decimal | null;
            last_sync: Date | null;
            updater_id: string | null;
            ptk_terdaftar_id: string | null;
            rombongan_belajar_id: string;
            status_di_kurikulum: import("@prisma/client-runtime-utils").Decimal | null;
            semester_id: string | null;
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
    } & {
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        rombongan_belajar_id: string;
        urutan: number;
        pembelajaran_id: string;
        jenis_jadwal_id: string;
        hari: number;
        jadwal_pelajaran_id: string;
    }) | {
        pembelajaran: {
            gtk: any;
            sekolah_id: string | null;
            ptk_id: string | null;
            create_date: Date;
            last_update: Date;
            soft_delete: import("@prisma/client-runtime-utils").Decimal | null;
            last_sync: Date | null;
            updater_id: string | null;
            ptk_terdaftar_id: string | null;
            rombongan_belajar_id: string;
            status_di_kurikulum: import("@prisma/client-runtime-utils").Decimal | null;
            semester_id: string | null;
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
        aktif: boolean;
        rombongan_belajar_id: string;
        urutan: number;
        pembelajaran_id: string;
        jenis_jadwal_id: string;
        hari: number;
        jadwal_pelajaran_id: string;
    })[]>;
    upsertJadwalPelajaran(sekolahId: string, data: {
        jenis_jadwal_id: string;
        rombongan_belajar_id: string;
        pembelajaran_id: string;
        hari: number;
        urutan: number;
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        rombongan_belajar_id: string;
        urutan: number;
        pembelajaran_id: string;
        jenis_jadwal_id: string;
        hari: number;
        jadwal_pelajaran_id: string;
    }>;
    deleteJadwalPelajaran(sekolahId: string, jadwalPelajaranId: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        rombongan_belajar_id: string;
        urutan: number;
        pembelajaran_id: string;
        jenis_jadwal_id: string;
        hari: number;
        jadwal_pelajaran_id: string;
    }>;
}
