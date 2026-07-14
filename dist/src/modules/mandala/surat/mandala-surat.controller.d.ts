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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
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
            sekolah_id: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string | null;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string | null;
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
            sekolah: {
                sekolah_id: string;
                cadisdik_id: string | null;
                email: string | null;
                nomor_telepon: string | null;
                website: string | null;
                nama: string;
                alamat_jalan: string | null;
                rt: string | null;
                rw: string | null;
                nama_dusun: string | null;
                desa_kelurahan: string | null;
                kode_wilayah: string | null;
                kode_pos: string | null;
                lintang: import("@prisma/client-runtime-utils").Decimal | null;
                bujur: import("@prisma/client-runtime-utils").Decimal | null;
                nm_wp: string | null;
                kebutuhan_khusus_id: number | null;
                npwp: string | null;
                rekening_atas_nama: string | null;
                create_date: Date;
                last_update: Date;
                soft_delete: string | null;
                last_sync: Date | null;
                updater_id: string | null;
                nama_nomenklatur: string | null;
                nss: string | null;
                npsn: string | null;
                bentuk_pendidikan_id: number | null;
                nomor_fax: string | null;
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
                keaktifan: string | null;
                flag: string | null;
                logo: string | null;
                social_media: import("@prisma/client/runtime/client").JsonValue | null;
                radius: number | null;
            };
            pegawai: {
                created_at: Date;
                updated_at: Date;
                cadisdik_id: string;
                email: string;
                nomor_telepon: string | null;
                aktif: boolean;
                pegawai_id: string;
                nama_lengkap: string;
                nip: string | null;
                password: string;
                authenticator_secret: string | null;
                jabatan: number | null;
                jenis_kelamin: number;
                foto: string | null;
                alamat_lengkap: string | null;
                nik: string | null;
                tanggal_lahir: Date | null;
                tempat_lahir: string | null;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string | null;
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
            sekolah_id: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string | null;
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
            sekolah_id: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string | null;
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
