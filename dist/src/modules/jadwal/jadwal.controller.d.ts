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
                jenis_jadwal_id: string;
                urutan: number;
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
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            nama: string;
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
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            nama: string;
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
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            nama: string;
            aktif: boolean;
            jenis_jadwal_id: string;
            custom_mapel: boolean;
        };
    }>;
    deleteJenisJadwal(req: Request, id: string): Promise<{
        status: string;
        klien: any;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            nama: string;
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
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            nama: string;
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
            jenis_jadwal_id: string;
            urutan: number;
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
            jenis_jadwal_id: string;
            urutan: number;
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
            jenis_jadwal_id: string;
            urutan: number;
            pengaturan_jadwal_id: string;
            hari: number;
            tipe: number;
            durasi_menit: number;
        };
    }>;
    getJadwalPelajaran(req: Request, jenisJadwalId: string, rombelId: string): Promise<{
        status: string;
        klien: any;
        data: ({
            pembelajaran: {
                gtk: {
                    sekolah_id: string | null;
                    created_at: Date;
                    updated_at: Date;
                    nama: string;
                    email: string | null;
                    no_hp: string | null;
                    ptk_id: string;
                    alamat_jalan: string | null;
                    rt: string | null;
                    rw: string | null;
                    kode_pos: string | null;
                    lintang: import("@prisma/client-runtime-utils").Decimal | null;
                    bujur: import("@prisma/client-runtime-utils").Decimal | null;
                    dusun: string | null;
                    desa_kelurahan: string | null;
                    kecamatan: string | null;
                    kabupaten_kota: string | null;
                    provinsi: string | null;
                    ptk_terdaftar_id: string | null;
                    tahun_ajaran_id: string | null;
                    ptk_induk: string | null;
                    kode: string | null;
                    status: string;
                    sk_mengajar: string | null;
                    qr_token: string | null;
                    jenis_kelamin: string | null;
                    tempat_lahir: string | null;
                    tanggal_lahir: Date | null;
                    nama_ibu_kandung: string | null;
                    agama_id: string | null;
                    agama_id_str: string | null;
                    nuptk: string | null;
                    nik: string | null;
                    no_kk: string | null;
                    npwp: string | null;
                    nama_wajib_pajak: string | null;
                    kewarganegaraan: string | null;
                    status_perkawinan: string | null;
                    nama_suami_istri: string | null;
                    pekerjaan_suami_istri: string | null;
                    jenis_ptk_id: string | null;
                    jenis_ptk_id_str: string | null;
                    jabatan_ptk_id: string | null;
                    jabatan_ptk_id_str: string | null;
                    status_kepegawaian_id: string | null;
                    status_kepegawaian_id_str: string | null;
                    nip: string | null;
                    niy_nigk: string | null;
                    nrg: string | null;
                    sk_pengangkatan: string | null;
                    tanggal_surat_tugas: Date | null;
                    tmt_pengangkatan: Date | null;
                    lembaga_pengangkat: string | null;
                    sk_cpns: string | null;
                    tmt_cpns: Date | null;
                    tmt_pns: Date | null;
                    sumber_gaji: string | null;
                    lisensi_kepsek: boolean;
                    nuks: string | null;
                    keahlian_laboratorium: string | null;
                    mampu_menangani_kebutuhan_khusus: string | null;
                    keahlian_braille: boolean;
                    keahlian_bahasa_isyarat: boolean;
                    pendidikan_terakhir: string | null;
                    bidang_studi_terakhir: string | null;
                    pangkat_golongan_terakhir: string | null;
                    rwy_pend_formal: import("@prisma/client/runtime/client").JsonValue | null;
                    rwy_kepangkatan: import("@prisma/client/runtime/client").JsonValue | null;
                    no_telepon_rumah: string | null;
                    no_wa: string | null;
                    foto: string | null;
                    tandatangan: string | null;
                };
            } & {
                sekolah_id: string | null;
                created_at: Date;
                updated_at: Date;
                ptk_id: string | null;
                ptk_terdaftar_id: string | null;
                rombongan_belajar_id: string;
                ptk_id_str: string | null;
                pembelajaran_id: string;
                mata_pelajaran_id: string | null;
                mata_pelajaran_id_str: string | null;
                nama_mata_pelajaran: string | null;
                induk_pembelajaran_id: string | null;
                jam_mengajar_per_minggu: string | null;
                status_di_kurikulum: string | null;
                status_di_kurikulum_str: string | null;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            rombongan_belajar_id: string;
            aktif: boolean;
            pembelajaran_id: string;
            jenis_jadwal_id: string;
            urutan: number;
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
            pembelajaran_id: string;
            jenis_jadwal_id: string;
            urutan: number;
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
            pembelajaran_id: string;
            jenis_jadwal_id: string;
            urutan: number;
            hari: number;
            jadwal_pelajaran_id: string;
        };
    }>;
}
