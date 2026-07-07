import { PrismaService } from '../../core/prisma/prisma.service';
export declare class PresensiService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHariLibur(sekolahId: string): Promise<{
        nama: string;
        sekolah_id: string;
        keterangan: string | null;
        created_at: Date;
        updated_at: Date;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
        aktif: boolean;
        hari_libur_id: string;
    }[]>;
    createHariLibur(sekolahId: string, data: {
        nama: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
        keterangan?: string;
    }): Promise<{
        nama: string;
        sekolah_id: string;
        keterangan: string | null;
        created_at: Date;
        updated_at: Date;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
        aktif: boolean;
        hari_libur_id: string;
    }>;
    deleteHariLibur(sekolahId: string, hariLiburId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    private checkHoliday;
    private getActiveSchedule;
    presensiPesertaDidik(sekolahId: string, data: {
        peserta_didik_id: string;
        waktu: string;
        tipe: 'masuk' | 'pulang';
    }): Promise<{
        peserta_didik_id: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
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
    presensiMapel(sekolahId: string, data: {
        jadwal_pelajaran_id: string;
        peserta_didik_id: string;
        tanggal: string;
        status: number;
    }): Promise<{
        peserta_didik_id: string;
        sekolah_id: string;
        status: number;
        created_at: Date;
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
        jam_keluar?: string;
        jam_kembali_estimasi?: string;
    }): Promise<any>;
    getAttendanceConfig(sekolahId: string): Promise<{
        sekolah_nama: string;
        sekolah_id: string;
        base_url: string;
    }>;
    findUserByQr(sekolahId: string, token: string): Promise<{
        type: string;
        data: {
            nama_rombel: string;
            peserta_didik_id: string;
            nama: string;
            nisn: string;
            foto: string;
            rombongan_belajar_id: string;
            rombongan_belajar: {
                nama: string;
            };
        };
        activeIzinKeluar: {
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            jenis: number;
            tanggal: Date;
            izin_id: string;
            disetujui: boolean;
            jam_keluar: Date | null;
            jam_kembali: Date | null;
            jam_kembali_estimasi: Date | null;
        };
    } | {
        type: string;
        data: {
            jenis_ptk_id_str: string;
            nama: string;
            foto: string;
            ptk_id: string;
            nuptk: string;
        };
        activeIzinKeluar: {
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            jenis: number;
            tanggal: Date;
            izin_id: string;
            disetujui: boolean;
            jam_keluar: Date | null;
            jam_kembali: Date | null;
            jam_kembali_estimasi: Date | null;
        };
    }>;
    scanQr(sekolahId: string, token: string, latitude?: number, longitude?: number): Promise<{
        peserta_didik: {
            nama: string;
            foto: string;
            nisn: string;
            rombongan_belajar_id: string;
            nama_rombel: string;
        };
        peserta_didik_id: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
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
    getPresensiPesertaDidik(sekolahId: string, dateStr?: string): Promise<any[]>;
    getPresensiGtk(sekolahId: string, dateStr?: string): Promise<{
        jenis_ptk_id_str: string;
        presensi: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string;
            jam_masuk: Date | null;
            jam_pulang: Date | null;
            tanggal: Date;
            status_masuk: number | null;
            status_pulang: number | null;
        };
        izin: {
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            jenis: number;
            tanggal: Date;
            izin_id: string;
            disetujui: boolean;
            jam_keluar: Date | null;
            jam_kembali: Date | null;
            jam_kembali_estimasi: Date | null;
        };
        nama: string;
        foto: string;
        ptk_id: string;
        nuptk: string;
    }[]>;
    private getDistance;
    getIzinKeluarHariIni(sekolahId: string, dateStr?: string): Promise<any[]>;
    catatKembali(sekolahId: string, izinId: string): Promise<{
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        jenis: number;
        tanggal: Date;
        izin_id: string;
        disetujui: boolean;
        jam_keluar: Date | null;
        jam_kembali: Date | null;
        jam_kembali_estimasi: Date | null;
    }>;
    setujuiIzin(sekolahId: string, izinId: string): Promise<{
        peserta_didik_id: string | null;
        sekolah_id: string;
        keterangan: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        jenis: number;
        tanggal: Date;
        izin_id: string;
        disetujui: boolean;
        jam_keluar: Date | null;
        jam_kembali: Date | null;
        jam_kembali_estimasi: Date | null;
    }>;
    deleteIzin(sekolahId: string, izinId: string): Promise<{
        success: boolean;
    }>;
}
