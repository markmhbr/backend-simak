import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
export declare class MandalaService implements OnModuleInit {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    getConnection(): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        key: string;
        url_mandala: string;
    }>;
    saveOrUpdateConnection(key: string, urlMandala: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        key: string;
        url_mandala: string;
    }>;
    getSchools(): Promise<{
        sekolah_id: string;
        nama: string;
        npsn: string;
        status_sekolah: string;
        alamat: string;
        email: string;
        website: string;
        bentuk_pendidikan_is_str: string;
        bentuk_pendidikan_id_str: string;
        kabupate_kota: string;
        kabupaten_kota: string;
        kecamatan: string;
        lintang: import("@prisma/client-runtime-utils").Decimal;
        bujur: import("@prisma/client-runtime-utils").Decimal;
        desa_kelurahan: string;
        total_siswa: number;
        total_gtk: number;
    }[]>;
    getSchoolDetail(sekolahId: string): Promise<{
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
    }>;
    getSchoolSummary(sekolahId: string): Promise<{
        sekolah_id: string;
        total_tanah: number;
        total_bangunan: number;
        total_ruang: number;
        total_siswa: number;
        total_gtk: number;
    }>;
    getPesertaDidikForMandala(sekolahId: string | undefined, query: {
        limit: number;
        page: number;
        search?: string;
        status?: 'aktif' | 'non-aktif';
    }): Promise<{
        status: string;
        data: {
            identitas: {
                id: string;
                sekolah_id: string;
                nama: string;
                nisn: string;
                nik: string;
                jenis_kelamin: string;
                tempat_lahir: string;
                tanggal_lahir: Date;
                agama: string;
                jenis_pendaftaran_id_str: string;
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
    getGtkForMandala(sekolahId: string | undefined, query: {
        limit: number;
        page: number;
        search?: string;
        status?: 'aktif' | 'non-aktif';
        type?: 'guru' | 'tendik';
    }): Promise<{
        status: string;
        data: {
            identitas: {
                id: string;
                sekolah_id: string;
                nama: string;
                nip: string;
                nik: string;
                nuptk: string;
                jenis_kelamin: string;
                tempat_lahir: string;
                tanggal_lahir: Date;
                agama: string;
            };
            kepegawaian: {
                jenis_ptk: string;
                jabatan: string;
                status_kepegawaian: string;
                status: string;
                pendidikan_terakhir: string;
            };
            data_pendukung: {
                alamat_lengkap: string;
                no_hp: string;
                no_wa: string;
                email: string;
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
    getGtkRekapForMandala(sekolahId: string | undefined): Promise<{
        status: string;
        data: {
            rekap_kategori: {
                id: number;
                kategori: string;
                lakiLaki: number;
                perempuan: number;
                totalJK: number;
                asn: number;
                nonAsn: number;
                totalStatus: number;
            }[];
            rekap_pendidikan: {
                id: number;
                pendidikan: string;
                lakiLaki: number;
                perempuan: number;
                totalJK: number;
                asn: number;
                nonAsn: number;
                totalStatus: number;
            }[];
            rekap_usia: {
                id: number;
                rentangUsia: string;
                lakiLaki: number;
                perempuan: number;
                totalJK: number;
                asn: number;
                nonAsn: number;
                totalStatus: number;
            }[];
        };
    }>;
}
