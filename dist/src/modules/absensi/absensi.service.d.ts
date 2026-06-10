import { PrismaService } from '../../core/prisma/prisma.service';
export declare class AbsensiService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHariLibur(sekolahId: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        nama: string;
        aktif: boolean;
        keterangan: string | null;
        hari_libur_id: string;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
    }[]>;
    createHariLibur(sekolahId: string, data: {
        nama: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
        keterangan?: string;
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        nama: string;
        aktif: boolean;
        keterangan: string | null;
        hari_libur_id: string;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
    }>;
    deleteHariLibur(sekolahId: string, hariLiburId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    private checkHoliday;
    private getActiveSchedule;
    absenPesertaDidik(sekolahId: string, data: {
        peserta_didik_id: string;
        waktu: string;
        tipe: 'masuk' | 'pulang';
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        peserta_didik_id: string;
        jam_masuk: Date | null;
        jam_pulang: Date | null;
        tanggal: Date;
        status_masuk: number | null;
        status_pulang: number | null;
    }>;
    absenGtk(sekolahId: string, data: {
        ptk_id: string;
        waktu: string;
        tipe: 'masuk' | 'pulang';
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string;
        jam_masuk: Date | null;
        jam_pulang: Date | null;
        tanggal: Date;
        status_masuk: number | null;
        status_pulang: number | null;
    }>;
    absenMapel(sekolahId: string, data: {
        jadwal_pelajaran_id: string;
        peserta_didik_id: string;
        tanggal: string;
        status: number;
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        peserta_didik_id: string;
        status: number;
        jadwal_pelajaran_id: string;
        tanggal: Date;
        waktu_absen: Date;
    }>;
    createIzin(sekolahId: string, data: {
        peserta_didik_id?: string;
        ptk_id?: string;
        jenis: number;
        tanggal: string;
        keterangan: string;
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        keterangan: string;
        tanggal: Date;
        izin_id: string;
        jenis: number;
        disetujui: boolean;
    }>;
    getAttendanceConfig(sekolahId: string): Promise<{
        sekolah_nama: string;
        sekolah_id: string;
        base_url: string;
    }>;
    findUserByQr(sekolahId: string, token: string): Promise<{
        type: string;
        data: {
            nama: string;
            peserta_didik_id: string;
            rombongan_belajar_id: string;
            nisn: string;
        };
    } | {
        type: string;
        data: {
            nama: string;
            ptk_id: string;
            nuptk: string;
        };
    }>;
    scanQr(sekolahId: string, token: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        peserta_didik_id: string;
        jam_masuk: Date | null;
        jam_pulang: Date | null;
        tanggal: Date;
        status_masuk: number | null;
        status_pulang: number | null;
    } | {
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string;
        jam_masuk: Date | null;
        jam_pulang: Date | null;
        tanggal: Date;
        status_masuk: number | null;
        status_pulang: number | null;
    }>;
}
