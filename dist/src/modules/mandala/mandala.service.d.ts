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
}
