import { SuratService } from './surat.service';
import type { Request } from 'express';
export declare class SuratController {
    private readonly suratService;
    constructor(suratService: SuratService);
    private getSekolahId;
    createPengaturanNomor(req: Request, body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            pengaturan_nomor_surat_id: string;
            nama_label: string;
            format_nomor: string;
            counter: number;
        };
    }>;
    getPengaturanNomorList(req: Request): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            pengaturan_nomor_surat_id: string;
            nama_label: string;
            format_nomor: string;
            counter: number;
        }[];
    }>;
    updatePengaturanNomor(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            pengaturan_nomor_surat_id: string;
            nama_label: string;
            format_nomor: string;
            counter: number;
        };
    }>;
    deletePengaturanNomor(id: string): Promise<{
        status: string;
        message: string;
    }>;
    createTemplate(req: Request, body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            template_surat_id: string;
            nama_template: string;
            ukuran_kertas: number;
            margin_atas: number;
            margin_bawah: number;
            margin_kiri: number;
            margin_kanan: number;
            konten_html: string;
        };
    }>;
    getTemplateList(req: Request): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            template_surat_id: string;
            nama_template: string;
            ukuran_kertas: number;
            margin_atas: number;
            margin_bawah: number;
            margin_kiri: number;
            margin_kanan: number;
            konten_html: string;
        }[];
    }>;
    getTemplateDetail(id: string): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            template_surat_id: string;
            nama_template: string;
            ukuran_kertas: number;
            margin_atas: number;
            margin_bawah: number;
            margin_kiri: number;
            margin_kanan: number;
            konten_html: string;
        };
    }>;
    updateTemplate(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            template_surat_id: string;
            nama_template: string;
            ukuran_kertas: number;
            margin_atas: number;
            margin_bawah: number;
            margin_kiri: number;
            margin_kanan: number;
            konten_html: string;
        };
    }>;
    deleteTemplate(id: string): Promise<{
        status: string;
        message: string;
    }>;
    createSuratMasuk(req: Request, body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            file_url: string;
            surat_masuk_id: string;
            tanggal_surat: Date;
            tanggal_diterima: Date;
            nomor_agenda: string;
            nomor_surat: string;
            asal_surat: string;
            tujuan_disposisi: string;
            perihal: string;
        };
    }>;
    getSuratMasukList(req: Request, search?: string, limit?: string, page?: string): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            file_url: string;
            surat_masuk_id: string;
            tanggal_surat: Date;
            tanggal_diterima: Date;
            nomor_agenda: string;
            nomor_surat: string;
            asal_surat: string;
            tujuan_disposisi: string;
            perihal: string;
        }[];
        meta: {
            total_data: number;
            total_pages: number;
            current_page: number;
        };
    }>;
    updateSuratMasuk(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            file_url: string;
            surat_masuk_id: string;
            tanggal_surat: Date;
            tanggal_diterima: Date;
            nomor_agenda: string;
            nomor_surat: string;
            asal_surat: string;
            tujuan_disposisi: string;
            perihal: string;
        };
    }>;
    deleteSuratMasuk(id: string): Promise<{
        status: string;
        message: string;
    }>;
    createSuratKeluar(req: Request, body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            status: number;
            kategori: number;
            pengaturan_nomor_surat_id: string;
            template_surat_id: string;
            tanggal_surat: Date;
            nomor_surat: string | null;
            perihal: string;
            surat_keluar_id: string;
            isi_final_html: string;
            file_pdf: string | null;
        };
    }>;
    getSuratKeluarList(req: Request, search?: string, limit?: string, page?: string, status?: string, kategori?: string, sub?: string): Promise<{
        status: string;
        data: (({
            template_surat: {
                nama_template: string;
            };
            peserta_didik: {
                nama: string;
            };
            gtk: {
                nama: string;
                jenis_ptk: {
                    jenis_ptk: string;
                };
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            status: number;
            kategori: number;
            pengaturan_nomor_surat_id: string;
            template_surat_id: string;
            tanggal_surat: Date;
            nomor_surat: string | null;
            perihal: string;
            surat_keluar_id: string;
            isi_final_html: string;
            file_pdf: string | null;
        }) | {
            gtk: {
                jenis_ptk_id_str: string;
                nama: string;
            };
            template_surat: {
                nama_template: string;
            };
            peserta_didik: {
                nama: string;
            };
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            status: number;
            kategori: number;
            pengaturan_nomor_surat_id: string;
            template_surat_id: string;
            tanggal_surat: Date;
            nomor_surat: string | null;
            perihal: string;
            surat_keluar_id: string;
            isi_final_html: string;
            file_pdf: string | null;
        })[];
        meta: {
            total_data: number;
            total_pages: number;
            current_page: number;
        };
    }>;
    getSuratKeluarDetail(id: string): Promise<{
        status: string;
        data: {
            template_surat: {
                sekolah_id: string;
                created_at: Date;
                updated_at: Date;
                aktif: boolean;
                kategori: number;
                template_surat_id: string;
                nama_template: string;
                ukuran_kertas: number;
                margin_atas: number;
                margin_bawah: number;
                margin_kiri: number;
                margin_kanan: number;
                konten_html: string;
            };
            peserta_didik: {
                sekolah_id: string | null;
                nama: string;
                alamat_jalan: string | null;
                rt: import("@prisma/client-runtime-utils").Decimal | null;
                rw: import("@prisma/client-runtime-utils").Decimal | null;
                nama_dusun: string | null;
                desa_kelurahan: string | null;
                kode_wilayah: string | null;
                kode_pos: string | null;
                lintang: import("@prisma/client-runtime-utils").Decimal | null;
                bujur: import("@prisma/client-runtime-utils").Decimal | null;
                email: string | null;
                kebutuhan_khusus_id: number | null;
                rekening_atas_nama: string | null;
                soft_delete: import("@prisma/client-runtime-utils").Decimal | null;
                created_at: Date;
                updated_at: Date;
                peserta_didik_id: string;
                jenis_kelamin: string | null;
                foto: string | null;
                nik: string | null;
                tanggal_lahir: Date | null;
                tempat_lahir: string | null;
                no_kk: string | null;
                agama_id: number | null;
                nama_ibu_kandung: string | null;
                status_data: number | null;
                kewarganegaraan: string | null;
                id_bank: string | null;
                rekening_bank: string | null;
                jenis_keluar_id: string | null;
                qr_token: string | null;
                status: string;
                rombongan_belajar_id: string | null;
                jurusan_sp_id: string | null;
                nisn: string | null;
                jenis_tinggal_id: import("@prisma/client-runtime-utils").Decimal | null;
                alat_transportasi_id: import("@prisma/client-runtime-utils").Decimal | null;
                nik_ayah: string | null;
                nik_ibu: string | null;
                anak_keberapa: import("@prisma/client-runtime-utils").Decimal | null;
                nik_wali: string | null;
                nomor_telepon_rumah: string | null;
                nomor_telepon_seluler: string | null;
                penerima_kps: import("@prisma/client-runtime-utils").Decimal | null;
                no_kps: string | null;
                layak_pip: import("@prisma/client-runtime-utils").Decimal | null;
                penerima_kip: import("@prisma/client-runtime-utils").Decimal | null;
                no_kip: string | null;
                nm_kip: string | null;
                no_kks: string | null;
                reg_akta_lahir: string | null;
                id_layak_pip: import("@prisma/client-runtime-utils").Decimal | null;
                nama_kcp: string | null;
                nama_ayah: string | null;
                tahun_lahir_ayah: import("@prisma/client-runtime-utils").Decimal | null;
                jenjang_pendidikan_ayah: import("@prisma/client-runtime-utils").Decimal | null;
                pekerjaan_id_ayah: number | null;
                penghasilan_id_ayah: number | null;
                kebutuhan_khusus_id_ayah: number | null;
                tahun_lahir_ibu: import("@prisma/client-runtime-utils").Decimal | null;
                jenjang_pendidikan_ibu: import("@prisma/client-runtime-utils").Decimal | null;
                penghasilan_id_ibu: number | null;
                pekerjaan_id_ibu: number | null;
                kebutuhan_khusus_id_ibu: number | null;
                nama_wali: string | null;
                tahun_lahir_wali: import("@prisma/client-runtime-utils").Decimal | null;
                jenjang_pendidikan_wali: import("@prisma/client-runtime-utils").Decimal | null;
                pekerjaan_id_wali: number | null;
                penghasilan_id_wali: number | null;
                pekerjaan_id: number | null;
                registrasi_id: string | null;
                jenis_pendaftaran_id: import("@prisma/client-runtime-utils").Decimal | null;
                nipd: string | null;
                tanggal_masuk_sekolah: Date | null;
                tanggal_keluar: Date | null;
                keterangan: string | null;
                no_skhun: string | null;
                no_peserta_ujian: string | null;
                no_seri_ijazah: string | null;
                a_pernah_paud: import("@prisma/client-runtime-utils").Decimal | null;
                a_pernah_tk: import("@prisma/client-runtime-utils").Decimal | null;
                sekolah_asal: string | null;
                id_hobby: import("@prisma/client-runtime-utils").Decimal | null;
                id_cita: import("@prisma/client-runtime-utils").Decimal | null;
                telegram_chat_id: string | null;
                telegram_token: string | null;
            };
            gtk: {
                sekolah_id: string | null;
                nama: string;
                alamat_jalan: string | null;
                rt: import("@prisma/client-runtime-utils").Decimal | null;
                rw: import("@prisma/client-runtime-utils").Decimal | null;
                nama_dusun: string | null;
                desa_kelurahan: string | null;
                kode_wilayah: string | null;
                kode_pos: string | null;
                lintang: import("@prisma/client-runtime-utils").Decimal | null;
                bujur: import("@prisma/client-runtime-utils").Decimal | null;
                email: string | null;
                kebutuhan_khusus_id: number | null;
                rekening_atas_nama: string | null;
                npwp: string | null;
                nm_wp: string | null;
                create_date: Date;
                last_update: Date;
                soft_delete: import("@prisma/client-runtime-utils").Decimal | null;
                last_sync: Date | null;
                updater_id: string | null;
                no_hp: string | null;
                ptk_id: string;
                nip: string | null;
                jenis_kelamin: string | null;
                foto: string | null;
                nik: string | null;
                tanggal_lahir: Date | null;
                tempat_lahir: string | null;
                no_kk: string | null;
                niy_nigk: string | null;
                nuptk: string | null;
                nrg: string | null;
                nuks: string | null;
                status_kepegawaian_id: number | null;
                pengawas_bidang_studi_id: number | null;
                agama_id: number | null;
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
                status_data: number | null;
                karpeg: string | null;
                karpas: string | null;
                mampu_handle_kk: number | null;
                keahlian_braille: import("@prisma/client-runtime-utils").Decimal | null;
                keahlian_bhs_isyarat: import("@prisma/client-runtime-utils").Decimal | null;
                kewarganegaraan: string | null;
                id_bank: string | null;
                rekening_bank: string | null;
                blob_id: string | null;
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
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            status: number;
            kategori: number;
            pengaturan_nomor_surat_id: string;
            template_surat_id: string;
            tanggal_surat: Date;
            nomor_surat: string | null;
            perihal: string;
            surat_keluar_id: string;
            isi_final_html: string;
            file_pdf: string | null;
        };
    }>;
    updateSuratKeluar(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            status: number;
            kategori: number;
            pengaturan_nomor_surat_id: string;
            template_surat_id: string;
            tanggal_surat: Date;
            nomor_surat: string | null;
            perihal: string;
            surat_keluar_id: string;
            isi_final_html: string;
            file_pdf: string | null;
        };
    }>;
    terbitkanSurat(id: string): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            status: number;
            kategori: number;
            pengaturan_nomor_surat_id: string;
            template_surat_id: string;
            tanggal_surat: Date;
            nomor_surat: string | null;
            perihal: string;
            surat_keluar_id: string;
            isi_final_html: string;
            file_pdf: string | null;
        };
    }>;
    previewSurat(id: string): Promise<{
        status: string;
        data: {
            konten_html: string;
            ukuran_kertas: number;
            margin: {
                atas: number;
                bawah: number;
                kiri: number;
                kanan: number;
            };
            nomor_surat: string;
            status: number;
        };
    }>;
    deleteSuratKeluar(id: string): Promise<{
        status: string;
        message: string;
    }>;
}
