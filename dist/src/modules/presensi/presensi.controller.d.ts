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
        latitude?: number;
        longitude?: number;
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
            nama_rombel: string;
            foto: string;
            nama: string;
            peserta_didik_id: string;
            nisn: string;
            rombongan_belajar_id: string;
            rombongan_belajar: {
                nama: string;
            };
        };
        activeIzinKeluar: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            keterangan: string;
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
            foto: string;
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
            jenis: number;
            tanggal: Date;
            izin_id: string;
            disetujui: boolean;
            jam_keluar: Date | null;
            jam_kembali: Date | null;
            jam_kembali_estimasi: Date | null;
        };
    }>;
    getHariLibur(sekolahId: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama: string;
        keterangan: string | null;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
        hari_libur_id: string;
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
        aktif: boolean;
        nama: string;
        keterangan: string | null;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
        hari_libur_id: string;
    }>;
    updateHariLibur(sekolahId: string, id: string, data: {
        nama?: string;
        tanggal_mulai?: string;
        tanggal_selesai?: string;
        keterangan?: string;
    }): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama: string;
        keterangan: string | null;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
        hari_libur_id: string;
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
        jam_keluar?: string;
        jam_kembali_estimasi?: string;
    }): Promise<any>;
    getIzinKeluar(sekolahId: string, tanggal?: string): Promise<any[]>;
    catatKembali(sekolahId: string, izinId: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        keterangan: string;
        jenis: number;
        tanggal: Date;
        izin_id: string;
        disetujui: boolean;
        jam_keluar: Date | null;
        jam_kembali: Date | null;
        jam_kembali_estimasi: Date | null;
    }>;
    setujuiIzin(sekolahId: string, izinId: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        keterangan: string;
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
    getRekapPesertaDidik(sekolahId: string, tanggal?: string): Promise<any[]>;
    getRekapGtk(sekolahId: string, tanggal?: string): Promise<{
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
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            keterangan: string;
            jenis: number;
            tanggal: Date;
            izin_id: string;
            disetujui: boolean;
            jam_keluar: Date | null;
            jam_kembali: Date | null;
            jam_kembali_estimasi: Date | null;
        };
        foto: string;
        nama: string;
        ptk_id: string;
        nuptk: string;
    }[]>;
    getRekapPeriodik(sekolahId: string, rombel: string, tanggalMulai: string, tanggalSelesai: string, tipe?: 'pd' | 'gtk'): Promise<{
        data: any[];
        holidays: {
            nama: string;
            tanggal_mulai: Date;
            tanggal_selesai: Date;
        }[];
        activeDays: number[];
    }>;
    updateGtkMode(sekolahId: string, ptkId: string, data: {
        mode_presensi: number;
    }): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string | null;
            email: string | null;
            nip: string | null;
            jenis_kelamin: string | null;
            foto: string | null;
            nik: string | null;
            tanggal_lahir: Date | null;
            tempat_lahir: string | null;
            nama: string;
            no_hp: string | null;
            ptk_id: string;
            no_kk: string | null;
            niy_nigk: string | null;
            nuptk: string | null;
            nrg: string | null;
            nuks: string | null;
            status_kepegawaian_id: number | null;
            pengawas_bidang_studi_id: number | null;
            agama_id: number | null;
            alamat_jalan: string | null;
            rt: import("@prisma/client-runtime-utils").Decimal | null;
            rw: import("@prisma/client-runtime-utils").Decimal | null;
            nama_dusun: string | null;
            desa_kelurahan: string | null;
            kode_wilayah: string | null;
            kode_pos: string | null;
            lintang: import("@prisma/client-runtime-utils").Decimal | null;
            bujur: import("@prisma/client-runtime-utils").Decimal | null;
            no_telepon_rumah: string | null;
            status_keaktifan_id: import("@prisma/client-runtime-utils").Decimal | null;
            sk_cpns: string | null;
            tgl_cpns: Date | null;
            sk_pengangkatan: string | null;
            tmt_pengangkatan: Date | null;
            lembaga_pengangkat_id: import("@prisma/client-runtime-utils").Decimal | null;
            pangkat_golongan_id: import("@prisma/client-runtime-utils").Decimal | null;
            keahlian_laboratorium_id: number | null;
            sumber_gaji_id: import("@prisma/client-runtime-utils").Decimal | null;
            nama_ibu_kandung: string | null;
            status_perkawinan: import("@prisma/client-runtime-utils").Decimal | null;
            nama_suami_istri: string | null;
            nip_suami_istri: string | null;
            pekerjaan_suami_istri: number | null;
            tmt_pns: Date | null;
            sudah_lisensi_kepala_sekolah: import("@prisma/client-runtime-utils").Decimal | null;
            jumlah_sekolah_binaan: number | null;
            pernah_diklat_kepengawasan: import("@prisma/client-runtime-utils").Decimal | null;
            nm_wp: string | null;
            status_data: number | null;
            karpeg: string | null;
            karpas: string | null;
            mampu_handle_kk: number | null;
            keahlian_braille: import("@prisma/client-runtime-utils").Decimal | null;
            keahlian_bhs_isyarat: import("@prisma/client-runtime-utils").Decimal | null;
            kebutuhan_khusus_id: number | null;
            npwp: string | null;
            kewarganegaraan: string | null;
            id_bank: string | null;
            rekening_bank: string | null;
            rekening_atas_nama: string | null;
            blob_id: string | null;
            create_date: Date;
            last_update: Date;
            soft_delete: import("@prisma/client-runtime-utils").Decimal | null;
            last_sync: Date | null;
            updater_id: string | null;
            ptk_terdaftar_id: string | null;
            jenis_keluar_id: string | null;
            jabatan_ptk_id: import("@prisma/client-runtime-utils").Decimal | null;
            tahun_ajaran_id: import("@prisma/client-runtime-utils").Decimal | null;
            jenis_ptk_id: import("@prisma/client-runtime-utils").Decimal | null;
            nomor_surat_tugas: string | null;
            tanggal_surat_tugas: Date | null;
            ptk_induk: import("@prisma/client-runtime-utils").Decimal | null;
            tmt_tugas: Date | null;
            tgl_ptk_keluar: Date | null;
            qr_token: string | null;
            status: string;
            no_whatsapp: string | null;
            id_telegram: string | null;
            nama_kcp: string | null;
            mode_presensi: number;
        };
    }>;
}
