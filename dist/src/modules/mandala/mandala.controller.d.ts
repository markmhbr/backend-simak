import { MandalaService } from './mandala.service';
export declare class MandalaController {
    private readonly mandalaService;
    constructor(mandalaService: MandalaService);
    getConnection(): Promise<{
        status: string;
        data: {
            id: string;
            created_at: Date;
            updated_at: Date;
            key: string;
            url_mandala: string;
        };
    }>;
    updateConnection(body: {
        key: string;
        url_mandala: string;
    }): Promise<{
        status: string;
        message: string;
        data?: undefined;
    } | {
        status: string;
        message: string;
        data: {
            id: string;
            created_at: Date;
            updated_at: Date;
            key: string;
            url_mandala: string;
        };
    }>;
    getSchools(): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            nama: string;
            npsn: string;
            status_sekolah: string;
            alamat: string;
            email: string;
            website: string;
            total_siswa: number;
            total_gtk: number;
        }[];
    }>;
    getSchoolDetail(id: string): Promise<{
        status: string;
        data: {
            nama_kepala_sekolah: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            nama: string;
            email: string | null;
            nss: string | null;
            npsn: string | null;
            bentuk_pendidikan_id: number | null;
            bentuk_pendidikan_id_str: string | null;
            status_sekolah: string | null;
            status_sekolah_str: string | null;
            alamat_jalan: string | null;
            rt: string | null;
            rw: string | null;
            kode_wilayah: string | null;
            kode_pos: string | null;
            nomor_telepon: string | null;
            nomor_fax: string | null;
            website: string | null;
            is_sks: boolean | null;
            lintang: import("@prisma/client-runtime-utils").Decimal | null;
            bujur: import("@prisma/client-runtime-utils").Decimal | null;
            dusun: string | null;
            desa_kelurahan: string | null;
            kecamatan: string | null;
            kabupaten_kota: string | null;
            provinsi: string | null;
            cadisdik_edit_count: number;
            spmb: string | null;
            logo: string | null;
            background_kartu_gtk: string | null;
            background_kartu_pesertadidik: string | null;
            peta: string | null;
            social_media: import("@prisma/client/runtime/client").JsonValue | null;
            cadisdik_id: string | null;
        };
    }>;
    getSchoolSummary(id: string): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            total_tanah: number;
            total_bangunan: number;
            total_ruang: number;
            total_siswa: number;
            total_gtk: number;
        };
    }>;
    getPesertaDidik(sekolahId: string, limit?: string, page?: string, search?: string, status?: 'aktif' | 'non-aktif'): Promise<{
        status: string;
        data: {
            identitas: {
                id: string;
                nama: string;
                nisn: string;
                nik: string;
                jenis_kelamin: string;
                tempat_lahir: string;
                tanggal_lahir: Date;
                agama: string;
            };
            akademik: {
                nama_rombel: string;
                tingkat: string;
                jurusan: string;
            };
            data_pendukung: {
                alamat_lengkap: string;
                nama_ayah: string;
                nama_ibu: string;
                hp_orang_tua: string;
            };
        }[];
        total_data: number;
        total_pages: number;
        current_page: number;
        meta: {
            total_data: number;
            total_pages: number;
            current_page: number;
        };
    }>;
}
