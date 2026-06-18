import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from '../../core/crypto/crypto.service';
export declare class MandalaService implements OnModuleInit {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly cryptoService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, cryptoService: CryptoService);
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
        kabupaten_kota: string;
        kecamatan: string;
        lintang: import("@prisma/client-runtime-utils").Decimal;
        bujur: import("@prisma/client-runtime-utils").Decimal;
        desa_kelurahan: string;
        total_siswa: number;
        total_gtk: number;
        nomor_telepon: string;
        kode_wilayah: string;
        cadisdik: {
            id: string;
            nama: string;
        };
    }[]>;
    getCadisdiks(): Promise<{
        created_at: Date;
        updated_at: Date;
        email: string | null;
        alamat: string | null;
        nomor_telepon: string | null;
        website: string | null;
        cadisdik_id: string;
        aktif: boolean;
        nama_instansi: string;
    }[]>;
    getCadisdikById(id: string): Promise<{
        sekolah: {
            sekolah_id: string;
            nama: string;
            npsn: string;
        }[];
    } & {
        created_at: Date;
        updated_at: Date;
        email: string | null;
        alamat: string | null;
        nomor_telepon: string | null;
        website: string | null;
        cadisdik_id: string;
        aktif: boolean;
        nama_instansi: string;
    }>;
    createCadisdik(data: any): Promise<{
        created_at: Date;
        updated_at: Date;
        email: string | null;
        alamat: string | null;
        nomor_telepon: string | null;
        website: string | null;
        cadisdik_id: string;
        aktif: boolean;
        nama_instansi: string;
    }>;
    updateCadisdik(id: string, data: any): Promise<{
        created_at: Date;
        updated_at: Date;
        email: string | null;
        alamat: string | null;
        nomor_telepon: string | null;
        website: string | null;
        cadisdik_id: string;
        aktif: boolean;
        nama_instansi: string;
    }>;
    deleteCadisdik(id: string): Promise<{
        created_at: Date;
        updated_at: Date;
        email: string | null;
        alamat: string | null;
        nomor_telepon: string | null;
        website: string | null;
        cadisdik_id: string;
        aktif: boolean;
        nama_instansi: string;
    }>;
    getPegawais(cadisdikId?: string): Promise<({
        cadisdik: {
            nama_instansi: string;
        };
    } & {
        created_at: Date;
        updated_at: Date;
        password: string;
        email: string;
        nomor_telepon: string | null;
        cadisdik_id: string;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nik: string | null;
        nip: string;
        foto: string | null;
        aktif: boolean;
        pegawai_id: string;
        nama_lengkap: string;
        alamat_lengkap: string | null;
        authenticator_secret: string | null;
        jabatan: number;
    })[]>;
    getPegawaiById(id: string): Promise<{
        cadisdik: {
            created_at: Date;
            updated_at: Date;
            email: string | null;
            alamat: string | null;
            nomor_telepon: string | null;
            website: string | null;
            cadisdik_id: string;
            aktif: boolean;
            nama_instansi: string;
        };
    } & {
        created_at: Date;
        updated_at: Date;
        password: string;
        email: string;
        nomor_telepon: string | null;
        cadisdik_id: string;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nik: string | null;
        nip: string;
        foto: string | null;
        aktif: boolean;
        pegawai_id: string;
        nama_lengkap: string;
        alamat_lengkap: string | null;
        authenticator_secret: string | null;
        jabatan: number;
    }>;
    createPegawai(data: any): Promise<{
        created_at: Date;
        updated_at: Date;
        password: string;
        email: string;
        nomor_telepon: string | null;
        cadisdik_id: string;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nik: string | null;
        nip: string;
        foto: string | null;
        aktif: boolean;
        pegawai_id: string;
        nama_lengkap: string;
        alamat_lengkap: string | null;
        authenticator_secret: string | null;
        jabatan: number;
    }>;
    updatePegawai(id: string, data: any): Promise<{
        created_at: Date;
        updated_at: Date;
        password: string;
        email: string;
        nomor_telepon: string | null;
        cadisdik_id: string;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nik: string | null;
        nip: string;
        foto: string | null;
        aktif: boolean;
        pegawai_id: string;
        nama_lengkap: string;
        alamat_lengkap: string | null;
        authenticator_secret: string | null;
        jabatan: number;
    }>;
    deletePegawai(id: string): Promise<{
        created_at: Date;
        updated_at: Date;
        password: string;
        email: string;
        nomor_telepon: string | null;
        cadisdik_id: string;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nik: string | null;
        nip: string;
        foto: string | null;
        aktif: boolean;
        pegawai_id: string;
        nama_lengkap: string;
        alamat_lengkap: string | null;
        authenticator_secret: string | null;
        jabatan: number;
    }>;
    getMappingPengawas(pegawaiId?: string, sekolahId?: string): Promise<({
        sekolah: {
            nama: string;
            npsn: string;
        };
        pegawai: {
            nip: string;
            nama_lengkap: string;
        };
    } & {
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        pegawai_id: string;
        mapping_pengawas_id: string;
    })[]>;
    createMappingPengawas(data: any): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        pegawai_id: string;
        mapping_pengawas_id: string;
    }>;
    deleteMappingPengawas(id: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        pegawai_id: string;
        mapping_pengawas_id: string;
    }>;
    loginPegawai(credentials: {
        identifier: string;
        password: any;
    }): Promise<{
        status: string;
        requires2FA: boolean;
        is2FASetup: boolean;
        tempToken: string;
        qrCodeUrl: any;
        secret: any;
    } | {
        status: string;
        requires2FA: boolean;
        is2FASetup: boolean;
        tempToken: string;
        qrCodeUrl?: undefined;
        secret?: undefined;
    }>;
    verify2FAPegawai(tempToken: string, code: string, secretToSave?: string): Promise<{
        status: string;
        data: {
            accessToken: string;
            refreshToken: string;
            pegawai: {
                id: string;
                nama: string;
                nip: string;
                nik: string;
                email: string;
                role: string;
                cadisdik: string;
            };
        };
    }>;
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
    getPesertaDidikPresenceForMandala(sekolahId: string, date: Date): Promise<{
        status_masuk_str: string;
        status_pulang_str: string;
        peserta_didik: {
            nama: string;
            foto: string;
            nisn: string;
            nipd: string;
            rombongan_belajar: {
                nama: string;
                tingkat_pendidikan_id_str: string;
            };
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
    }[]>;
    getGtkPresenceForMandala(sekolahId: string, date: Date): Promise<{
        status_masuk_str: string;
        status_pulang_str: string;
        gtk: {
            nama: string;
            nuptk: string;
            jenis_ptk_id_str: string;
            nip: string;
            foto: string;
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
    }[]>;
    private mapStatusMasuk;
    private mapStatusPulang;
    getPesertaDidikAnnualSummaryForMandala(sekolahId: string, year: number): Promise<{
        bulan: string;
        index: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpha: number;
    }[]>;
    getGtkAnnualSummaryForMandala(sekolahId: string, year: number): Promise<{
        bulan: string;
        index: number;
        hadir: number;
        sakit: number;
        izin: number;
        alpha: number;
    }[]>;
    private calculateMonthlySummary;
}
