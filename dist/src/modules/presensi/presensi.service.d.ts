import { PrismaService } from '../../core/prisma/prisma.service';
export declare class PresensiService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHariLibur(sekolahId: string): Promise<{
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama: string;
        keterangan: string | null;
        aktif: boolean;
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
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama: string;
        keterangan: string | null;
        aktif: boolean;
        hari_libur_id: string;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
    }>;
    deleteHariLibur(sekolahId: string, hariLiburId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    private checkHoliday;
    private getActiveSchedule;
    presensiPesertaDidik(sekolahId: string, data: {
        peserta_didik_id: string;
        waktu: string;
        tipe: 'masuk' | 'pulang';
    }): Promise<{
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        peserta_didik_id: string;
        jam_masuk: Date | null;
        jam_pulang: Date | null;
        tanggal: Date;
        status_masuk: number | null;
        status_pulang: number | null;
    }>;
    presensiGtk(sekolahId: string, data: {
        ptk_id: string;
        waktu: string;
        tipe: 'masuk' | 'pulang';
    }): Promise<{
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        ptk_id: string;
        jam_masuk: Date | null;
        jam_pulang: Date | null;
        tanggal: Date;
        status_masuk: number | null;
        status_pulang: number | null;
    }>;
    presensiMapel(sekolahId: string, data: {
        jadwal_pelajaran_id: string;
        peserta_didik_id: string;
        tanggal: string;
        status: number;
    }): Promise<{
        created_at: Date;
        sekolah_id: string;
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
    }): Promise<any>;
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
            foto: string;
            rombongan_belajar_id: string;
            nisn: string;
            nama_rombel: string;
        };
        activeIzinKeluar: {
            created_at: Date;
            updated_at: Date;
            sekolah_id: string;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            keterangan: string;
            tanggal: Date;
            izin_id: string;
            jenis: number;
            jam_keluar: Date | null;
            jam_kembali: Date | null;
            disetujui: boolean;
        };
    } | {
        type: string;
        data: {
            nama: string;
            ptk_id: string;
            nuptk: string;
            jenis_ptk_id_str: string;
            foto: string;
        };
        activeIzinKeluar: {
            created_at: Date;
            updated_at: Date;
            sekolah_id: string;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            keterangan: string;
            tanggal: Date;
            izin_id: string;
            jenis: number;
            jam_keluar: Date | null;
            jam_kembali: Date | null;
            disetujui: boolean;
        };
    }>;
    scanQr(sekolahId: string, token: string): Promise<{
        peserta_didik: {
            nama: string;
            foto: string;
            nisn: string;
            rombongan_belajar_id: string;
            nama_rombel: string;
        };
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        peserta_didik_id: string;
        jam_masuk: Date | null;
        jam_pulang: Date | null;
        tanggal: Date;
        status_masuk: number | null;
        status_pulang: number | null;
    } | {
        gtk: {
            nama: string;
            foto: string;
            nuptk: string;
            jenis_ptk_id_str: string;
        };
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        ptk_id: string;
        jam_masuk: Date | null;
        jam_pulang: Date | null;
        tanggal: Date;
        status_masuk: number | null;
        status_pulang: number | null;
    }>;
    getPresensiPesertaDidik(sekolahId: string, dateStr?: string): Promise<{
        presensi: {
            created_at: Date;
            updated_at: Date;
            sekolah_id: string;
            peserta_didik_id: string;
            jam_masuk: Date | null;
            jam_pulang: Date | null;
            tanggal: Date;
            status_masuk: number | null;
            status_pulang: number | null;
        };
        nama: string;
        peserta_didik_id: string;
        foto: string;
        nisn: string;
        nama_rombel: string;
    }[]>;
    getPresensiGtk(sekolahId: string, dateStr?: string): Promise<{
        presensi: {
            created_at: Date;
            updated_at: Date;
            sekolah_id: string;
            ptk_id: string;
            jam_masuk: Date | null;
            jam_pulang: Date | null;
            tanggal: Date;
            status_masuk: number | null;
            status_pulang: number | null;
        };
        nama: string;
        ptk_id: string;
        nuptk: string;
        jenis_ptk_id_str: string;
        foto: string;
    }[]>;
}
