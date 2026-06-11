import { PresensiService } from './presensi.service';
import * as express from 'express';
export declare class PresensiController {
    private readonly presensiService;
    constructor(presensiService: PresensiService);
    getConfig(req: express.Request): Promise<{
        sekolah_nama: string;
        sekolah_id: string;
        base_url: string;
    }>;
    scanQr(req: express.Request, data: {
        token: string;
    }): Promise<{
        peserta_didik: {
            nama: string;
            foto: string;
            nisn: string;
            rombongan_belajar_id: string;
            nama_rombel: string;
        };
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
    lookupUser(req: express.Request, data: {
        token: string;
    }): Promise<{
        type: string;
        data: {
            nama: string;
            peserta_didik_id: string;
            rombongan_belajar_id: string;
            nisn: string;
        };
        activeIzinKeluar: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
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
        };
        activeIzinKeluar: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
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
    deleteHariLibur(sekolahId: string, id: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    presensiPesertaDidik(sekolahId: string, data: {
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
    }): Promise<any>;
    getRekapPesertaDidik(sekolahId: string, tanggal?: string): Promise<{
        presensi: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
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
    getRekapGtk(sekolahId: string, tanggal?: string): Promise<{
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
        nama: string;
        ptk_id: string;
        nuptk: string;
        jenis_ptk_id_str: string;
        foto: string;
    }[]>;
}
