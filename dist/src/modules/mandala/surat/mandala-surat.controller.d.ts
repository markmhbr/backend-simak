import { MandalaSuratService } from './mandala-surat.service';
import type { Request } from 'express';
export declare class MandalaSuratController {
    private readonly suratService;
    constructor(suratService: MandalaSuratService);
    private getCadisdikId;
    createPengaturanNomor(req: Request, body: any): Promise<{
        status: string;
        message: string;
        data: {
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            aktif: boolean;
            pengaturan_nomor_surat_id: string;
            kategori: number;
            nama_label: string;
            format_nomor: string;
            counter: number;
        };
    }>;
    getPengaturanNomorList(req: Request): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            aktif: boolean;
            pengaturan_nomor_surat_id: string;
            kategori: number;
            nama_label: string;
            format_nomor: string;
            counter: number;
        }[];
    }>;
    updatePengaturanNomor(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            aktif: boolean;
            pengaturan_nomor_surat_id: string;
            kategori: number;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
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
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nomor_surat: string;
            tanggal_surat: Date;
            perihal: string;
            surat_masuk_id: string;
            tanggal_diterima: Date;
            nomor_agenda: string;
            asal_surat: string;
            tujuan_disposisi: string;
            file_url: string;
        };
    }>;
    getSuratMasukList(req: Request, search?: string, limit?: string, page?: string): Promise<{
        status: string;
        data: {
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nomor_surat: string;
            tanggal_surat: Date;
            perihal: string;
            surat_masuk_id: string;
            tanggal_diterima: Date;
            nomor_agenda: string;
            asal_surat: string;
            tujuan_disposisi: string;
            file_url: string;
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
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nomor_surat: string;
            tanggal_surat: Date;
            perihal: string;
            surat_masuk_id: string;
            tanggal_diterima: Date;
            nomor_agenda: string;
            asal_surat: string;
            tujuan_disposisi: string;
            file_url: string;
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
            sekolah_id: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string | null;
            pengaturan_nomor_surat_id: string;
            kategori: number;
            surat_keluar_id: string;
            template_surat_id: string;
            nomor_surat: string | null;
            tanggal_surat: Date;
            perihal: string;
            isi_final_html: string;
            file_pdf: string | null;
        };
    }>;
    getSuratKeluarList(req: Request, search?: string, limit?: string, page?: string, status?: string, kategori?: string): Promise<{
        status: string;
        data: ({
            sekolah: {
                nama: string;
            };
            pegawai: {
                nama_lengkap: string;
            };
            template_surat: {
                nama_template: string;
            };
        } & {
            sekolah_id: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string | null;
            pengaturan_nomor_surat_id: string;
            kategori: number;
            surat_keluar_id: string;
            template_surat_id: string;
            nomor_surat: string | null;
            tanggal_surat: Date;
            perihal: string;
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
            sekolah: {
                nama: string;
                kebutuhan_khusus_id: number | null;
                alamat_jalan: string | null;
                rt: string | null;
                rw: string | null;
                nama_dusun: string | null;
                desa_kelurahan: string | null;
                kode_wilayah: string | null;
                kode_pos: string | null;
                lintang: import("@prisma/client-runtime-utils").Decimal | null;
                bujur: import("@prisma/client-runtime-utils").Decimal | null;
                email: string | null;
                rekening_atas_nama: string | null;
                soft_delete: string | null;
                sekolah_id: string;
                nama_nomenklatur: string | null;
                nss: string | null;
                npsn: string | null;
                bentuk_pendidikan_id: number | null;
                nomor_telepon: string | null;
                nomor_fax: string | null;
                website: string | null;
                status_sekolah: string | null;
                sk_pendirian_sekolah: string | null;
                tanggal_sk_pendirian: string | null;
                status_kepemilikan_id: string | null;
                yayasan_id: string | null;
                sk_izin_operasional: string | null;
                tanggal_sk_izin_operasional: string | null;
                no_rekening: string | null;
                nama_bank: string | null;
                cabang_kcp_unit: string | null;
                mbs: string | null;
                luas_tanah_milik: string | null;
                luas_tanah_bukan_milik: string | null;
                kode_registrasi: string | null;
                npwp: string | null;
                nm_wp: string | null;
                keaktifan: string | null;
                flag: string | null;
                create_date: Date;
                last_update: Date;
                last_sync: Date | null;
                updater_id: string | null;
                logo: string | null;
                cadisdik_id: string | null;
                social_media: import("@prisma/client/runtime/client").JsonValue | null;
                radius: number | null;
            };
            pegawai: {
                jenis_kelamin: number;
                nik: string | null;
                tempat_lahir: string | null;
                tanggal_lahir: Date | null;
                email: string;
                foto: string | null;
                created_at: Date;
                updated_at: Date;
                nomor_telepon: string | null;
                cadisdik_id: string;
                pegawai_id: string;
                aktif: boolean;
                nama_lengkap: string;
                jabatan: number | null;
                nip: string | null;
                password: string;
                authenticator_secret: string | null;
                alamat_lengkap: string | null;
                golongan: number | null;
                jenis_jabatan_id: string | null;
            };
            template_surat: {
                created_at: Date;
                updated_at: Date;
                cadisdik_id: string;
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
        } & {
            sekolah_id: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string | null;
            pengaturan_nomor_surat_id: string;
            kategori: number;
            surat_keluar_id: string;
            template_surat_id: string;
            nomor_surat: string | null;
            tanggal_surat: Date;
            perihal: string;
            isi_final_html: string;
            file_pdf: string | null;
        };
    }>;
    updateSuratKeluar(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string | null;
            pengaturan_nomor_surat_id: string;
            kategori: number;
            surat_keluar_id: string;
            template_surat_id: string;
            nomor_surat: string | null;
            tanggal_surat: Date;
            perihal: string;
            isi_final_html: string;
            file_pdf: string | null;
        };
    }>;
    terbitkanSurat(id: string): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string | null;
            pengaturan_nomor_surat_id: string;
            kategori: number;
            surat_keluar_id: string;
            template_surat_id: string;
            nomor_surat: string | null;
            tanggal_surat: Date;
            perihal: string;
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
