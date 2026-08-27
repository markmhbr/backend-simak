import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from '../../core/crypto/crypto.service';
import { MailService } from '../../core/mail/mail.service';
export declare class MandalaService implements OnModuleInit {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    private readonly cryptoService;
    private readonly mailService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, cryptoService: CryptoService, mailService: MailService);
    onModuleInit(): Promise<void>;
    getConnection(): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        key: string;
        url_mandala: string;
    }>;
    saveOrUpdateConnection(key: string, urlMandala: string): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        key: string;
        url_mandala: string;
    }>;
    getSchools(sekolahId?: string): Promise<{
        sekolah_id: string;
        nama: string;
        npsn: string;
        status_sekolah: string;
        alamat: string;
        email: string;
        website: string;
        bentuk_pendidikan_is_str: string;
        bentuk_pendidikan_id_str: string;
        kabupaten_kota: any;
        kecamatan: any;
        provinsi: any;
        lintang: import("@prisma/client-runtime-utils").Decimal;
        bujur: import("@prisma/client-runtime-utils").Decimal;
        desa_kelurahan: any;
        total_siswa: number;
        total_gtk: number;
        nomor_telepon: string;
        kode_wilayah: string;
        last_update: Date;
        cadisdik: {
            id: string;
            nama: string;
        };
    }[]>;
    getCadisdiks(): Promise<{
        nomor_telepon: string | null;
        email: string | null;
        website: string | null;
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama_instansi: string;
        alamat: string | null;
        provinsi: string | null;
        kabupaten: string[];
    }[]>;
    getCadisdikById(id: string): Promise<{
        sekolah: {
            sekolah_id: string;
            nama: string;
            npsn: string;
        }[];
    } & {
        nomor_telepon: string | null;
        email: string | null;
        website: string | null;
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama_instansi: string;
        alamat: string | null;
        provinsi: string | null;
        kabupaten: string[];
    }>;
    validateKabupatenDuplication(kabupatenList: string[], excludeId?: string): Promise<void>;
    getAllProvinsi(): Promise<string[]>;
    getKabupatenByProvinsi(provinsiNama: string): Promise<string[]>;
    createCadisdik(data: any): Promise<{
        nomor_telepon: string | null;
        email: string | null;
        website: string | null;
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama_instansi: string;
        alamat: string | null;
        provinsi: string | null;
        kabupaten: string[];
    }>;
    updateCadisdik(id: string, data: any): Promise<{
        nomor_telepon: string | null;
        email: string | null;
        website: string | null;
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama_instansi: string;
        alamat: string | null;
        provinsi: string | null;
        kabupaten: string[];
    }>;
    deleteCadisdik(id: string): Promise<{
        nomor_telepon: string | null;
        email: string | null;
        website: string | null;
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nama_instansi: string;
        alamat: string | null;
        provinsi: string | null;
        kabupaten: string[];
    }>;
    getKategoriKeperluan(cadisdikId?: string): Promise<{
        nama: string;
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori_keperluan_id: string;
    }[]>;
    createKategoriKeperluan(data: {
        cadisdik_id: string;
        nama: string;
        aktif?: boolean;
    }): Promise<{
        nama: string;
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori_keperluan_id: string;
    }>;
    updateKategoriKeperluan(id: string, data: any): Promise<{
        nama: string;
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori_keperluan_id: string;
    }>;
    deleteKategoriKeperluan(id: string): Promise<{
        nama: string;
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori_keperluan_id: string;
    }>;
    getAntrian(filters: {
        cadisdik_id?: string;
        status?: number;
        start_date?: string;
        end_date?: string;
    }): Promise<({
        kategori_keperluan: {
            nama: string;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori_keperluan_id: string;
        };
    } & {
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        status: number;
        keperluan: string | null;
        antrian_id: string;
        kategori_keperluan_id: string;
        nomor_antrian: number;
        nama_lengkap: string;
        jabatan: string | null;
        unit_instansi: string | null;
        nomor_hp: string | null;
    })[]>;
    createAntrian(data: {
        cadisdik_id: string;
        kategori_keperluan_id: string;
        nama_lengkap: string;
        jabatan?: string;
        unit_instansi?: string;
        nomor_hp?: string;
        keperluan?: string;
    }): Promise<{
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        status: number;
        keperluan: string | null;
        antrian_id: string;
        kategori_keperluan_id: string;
        nomor_antrian: number;
        nama_lengkap: string;
        jabatan: string | null;
        unit_instansi: string | null;
        nomor_hp: string | null;
    }>;
    updateAntrianStatus(id: string, status: number): Promise<{
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal: Date;
        status: number;
        keperluan: string | null;
        antrian_id: string;
        kategori_keperluan_id: string;
        nomor_antrian: number;
        nama_lengkap: string;
        jabatan: string | null;
        unit_instansi: string | null;
        nomor_hp: string | null;
    }>;
    getAntrianSummary(cadisdikId?: string): Promise<{
        hari_ini: string;
        total: number;
        menunggu: number;
        dipanggil: number;
        melayani: number;
        selesai: number;
        batal: number;
    }>;
    getJenisJabatans(): Promise<{
        nama: string;
        created_at: Date;
        updated_at: Date;
        jenis_jabatan_id: string;
    }[]>;
    getJenisJabatanById(id: string): Promise<{
        nama: string;
        created_at: Date;
        updated_at: Date;
        jenis_jabatan_id: string;
    }>;
    createJenisJabatan(data: {
        nama: string;
    }): Promise<{
        nama: string;
        created_at: Date;
        updated_at: Date;
        jenis_jabatan_id: string;
    }>;
    updateJenisJabatan(id: string, data: {
        nama: string;
    }): Promise<{
        nama: string;
        created_at: Date;
        updated_at: Date;
        jenis_jabatan_id: string;
    }>;
    deleteJenisJabatan(id: string): Promise<{
        nama: string;
        created_at: Date;
        updated_at: Date;
        jenis_jabatan_id: string;
    }>;
    getPegawais(cadisdikId?: string): Promise<({
        cadisdik: {
            nama_instansi: string;
        };
        jenis_jabatan: {
            nama: string;
            created_at: Date;
            updated_at: Date;
            jenis_jabatan_id: string;
        };
    } & {
        nomor_telepon: string | null;
        email: string;
        cadisdik_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nik: string | null;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nama_lengkap: string;
        jabatan: number | null;
        nip: string | null;
        password: string;
        authenticator_secret: string | null;
        foto: string | null;
        alamat_lengkap: string | null;
        golongan: number | null;
        jenis_jabatan_id: string | null;
    })[]>;
    getPegawaiById(id: string): Promise<{
        cadisdik: {
            nomor_telepon: string | null;
            email: string | null;
            website: string | null;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            nama_instansi: string;
            alamat: string | null;
            provinsi: string | null;
            kabupaten: string[];
        };
        jenis_jabatan: {
            nama: string;
            created_at: Date;
            updated_at: Date;
            jenis_jabatan_id: string;
        };
    } & {
        nomor_telepon: string | null;
        email: string;
        cadisdik_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nik: string | null;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nama_lengkap: string;
        jabatan: number | null;
        nip: string | null;
        password: string;
        authenticator_secret: string | null;
        foto: string | null;
        alamat_lengkap: string | null;
        golongan: number | null;
        jenis_jabatan_id: string | null;
    }>;
    createPegawai(data: any): Promise<{
        nomor_telepon: string | null;
        email: string;
        cadisdik_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nik: string | null;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nama_lengkap: string;
        jabatan: number | null;
        nip: string | null;
        password: string;
        authenticator_secret: string | null;
        foto: string | null;
        alamat_lengkap: string | null;
        golongan: number | null;
        jenis_jabatan_id: string | null;
    }>;
    updatePegawai(id: string, data: any): Promise<{
        nomor_telepon: string | null;
        email: string;
        cadisdik_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nik: string | null;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nama_lengkap: string;
        jabatan: number | null;
        nip: string | null;
        password: string;
        authenticator_secret: string | null;
        foto: string | null;
        alamat_lengkap: string | null;
        golongan: number | null;
        jenis_jabatan_id: string | null;
    }>;
    deletePegawai(id: string): Promise<{
        nomor_telepon: string | null;
        email: string;
        cadisdik_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nik: string | null;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nama_lengkap: string;
        jabatan: number | null;
        nip: string | null;
        password: string;
        authenticator_secret: string | null;
        foto: string | null;
        alamat_lengkap: string | null;
        golongan: number | null;
        jenis_jabatan_id: string | null;
    }>;
    reset2FAPegawai(id: string): Promise<{
        nomor_telepon: string | null;
        email: string;
        cadisdik_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        nik: string | null;
        jenis_kelamin: number;
        tempat_lahir: string | null;
        tanggal_lahir: Date | null;
        nama_lengkap: string;
        jabatan: number | null;
        nip: string | null;
        password: string;
        authenticator_secret: string | null;
        foto: string | null;
        alamat_lengkap: string | null;
        golongan: number | null;
        jenis_jabatan_id: string | null;
    }>;
    getMappingPengawas(pegawaiId?: string, sekolahId?: string): Promise<({
        sekolah: {
            nama: string;
            npsn: string;
        };
        pegawai: {
            nama_lengkap: string;
            nip: string;
        };
    } & {
        sekolah_id: string;
        mapping_pengawas_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
    })[]>;
    createMappingPengawas(data: any): Promise<{
        sekolah_id: string;
        mapping_pengawas_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
    }>;
    deleteMappingPengawas(id: string): Promise<{
        sekolah_id: string;
        mapping_pengawas_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
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
                id: any;
                nama: any;
                nip: string;
                nik: string;
                email: any;
                role: string;
                cadisdik: string;
                sekolahId: any;
                sekolah_id: any;
                jabatan?: undefined;
            } | {
                id: any;
                nama: any;
                nip: any;
                nik: any;
                email: any;
                role: string;
                jabatan: any;
                cadisdik: any;
                sekolahId?: undefined;
                sekolah_id?: undefined;
            };
        };
    }>;
    refreshTokensPegawai(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        pegawai: any;
    }>;
    requestReset2FAPegawai(identifier: string, pass: string): Promise<{
        status: string;
        message: string;
        resetToken: string;
    }>;
    verifyReset2FAPegawai(resetToken: string, code: string): Promise<{
        status: string;
        message: string;
    }>;
    getSchoolDetail(sekolahId: string): Promise<{
        nama_kepala_sekolah: string;
        sekolah_id: string;
        nama: string;
        nama_nomenklatur: string | null;
        nss: string | null;
        npsn: string | null;
        bentuk_pendidikan_id: number | null;
        alamat_jalan: string | null;
        rt: string | null;
        rw: string | null;
        nama_dusun: string | null;
        desa_kelurahan: string | null;
        kode_wilayah: string | null;
        kode_pos: string | null;
        lintang: import("@prisma/client-runtime-utils").Decimal | null;
        bujur: import("@prisma/client-runtime-utils").Decimal | null;
        nomor_telepon: string | null;
        nomor_fax: string | null;
        email: string | null;
        website: string | null;
        kebutuhan_khusus_id: number | null;
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
        rekening_atas_nama: string | null;
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
        soft_delete: string | null;
        last_sync: Date | null;
        updater_id: string | null;
        logo: string | null;
        cadisdik_id: string | null;
        social_media: import("@prisma/client/runtime/client").JsonValue | null;
        radius: number | null;
    }>;
    getSchoolSummary(sekolahId: string): Promise<{
        sekolah_id: string;
        total_tanah: number;
        total_bangunan: number;
        total_ruang: number;
        total_siswa: number;
        total_gtk: number;
        total_rombel: number;
        statistik: {
            jumlah_siswa: number;
            jumlah_gtk: number;
            jumlah_rombel: number;
        };
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
                id: any;
                sekolah_id: any;
                nama: any;
                nisn: any;
                nik: any;
                nipd: any;
                desa: any;
                jenis_kelamin: any;
                tempat_lahir: any;
                tanggal_lahir: any;
                agama: any;
                jenis_pendaftaran_id_str: any;
                foto: any;
                tanggal_masuk_sekolah: any;
                tanggal_keluar: any;
                jenis_keluar_id: any;
                last_update: any;
            };
            akademik: {
                nama_rombel: any;
                tingkat: any;
                jurusan: any;
                tahun_ajaran: string;
                tahun_pelajaran: string;
                semester: string;
            };
            data_pendukung: {
                alamat_lengkap: string;
                desa: any;
                nama_ayah: any;
                nama_ibu: any;
                hp_orang_tua: any;
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
                id: any;
                sekolah_id: any;
                nama: any;
                nip: any;
                nik: any;
                nuptk: any;
                desa: any;
                jenis_kelamin: any;
                tempat_lahir: any;
                tanggal_lahir: any;
                agama: any;
                foto: any;
                jenis_keluar_id: any;
                last_update: any;
            };
            kepegawaian: {
                jenis_ptk: any;
                jabatan: any;
                status_kepegawaian: any;
                status: any;
                pendidikan_terakhir: string;
                ptk_induk: number;
            };
            data_pendukung: {
                alamat_lengkap: string;
                desa: any;
                no_hp: any;
                no_wa: string;
                email: any;
                nama_ibu_kandung: any;
            };
            sertifikasi: any;
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
    getRombonganBelajarForMandala(sekolahId: string | undefined, query: {
        type?: string;
        limit: number;
        page: number;
        search?: string;
        tingkat?: string;
        semester_id?: string;
    }): Promise<{
        status: string;
        data: {
            jumlah_siswa: number;
            ptk_id_str: any;
            tingkat_pendidikan_id_str: string;
            kurikulum_id_str: any;
            id_ruang_str: any;
            nama: string;
            ptk_id: string;
            rombongan_belajar_id: string;
            _count: {
                anggota_rombel: number;
            };
            jenis_rombel: import("@prisma/client-runtime-utils").Decimal;
            id_ruang: string;
            tingkat_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
            kurikulum_id: number;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            total_pages: number;
        };
    }>;
    getRombelAnggotaForMandala(rombelId: string): Promise<{
        status: string;
        data: {
            nama: string;
            peserta_didik_id: string;
            nisn: string;
            jenis_kelamin: string;
            foto: string;
            nipd: string;
            qr_token: string;
        }[];
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
            rombongan_belajar: {
                nama: string;
                tingkat_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
            };
            nama: string;
            nisn: string;
            foto: string;
            nipd: string;
            anggota_rombel: {
                rombongan_belajar: {
                    nama: string;
                    tingkat_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
                };
            }[];
        };
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        peserta_didik_id: string;
        tanggal: Date;
        jam_masuk: Date | null;
        jam_pulang: Date | null;
        status_masuk: number | null;
        status_pulang: number | null;
    }[]>;
    getGtkPresenceForMandala(sekolahId: string, date: Date): Promise<{
        gtk: any;
        status_masuk_str: string;
        status_pulang_str: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string;
        tanggal: Date;
        jam_masuk: Date | null;
        jam_pulang: Date | null;
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
    private resolveWilayahHierarchy;
    getSemestersForMandala(): Promise<{
        semester_id: any;
        nama: any;
        tahun_ajaran: any;
        semester: any;
        periode_aktif: boolean;
    }[]>;
    getMenuRoles(): Promise<({
        jenis_jabatan: {
            nama: string;
            created_at: Date;
            updated_at: Date;
            jenis_jabatan_id: string;
        };
    } & {
        jenis_jabatan_id: string | null;
        menu_role_id: string;
        menu_key: string;
        jabatan_id: number | null;
        jabatan_nama: string | null;
    })[]>;
    updateMenuRoles(roles: Array<{
        menu_key: string;
        jabatan_id?: number;
        jabatan_nama?: string;
        jenis_jabatan_id?: string;
    }>): Promise<any[]>;
    getSekolahBinaan(pegawaiId: string, cadisdikId: string): Promise<{
        sekolah_id: string;
        nama: string;
        npsn: string;
    }[]>;
    getJadwalMonitoring(cadisdikId: string, query: {
        start_date?: string;
        end_date?: string;
        sekolah_id?: string;
        pegawai_id?: string;
    }): Promise<{
        tanggal_mulai: string;
        tanggal_selesai: string;
        sekolah: {
            nama: string;
            npsn: string;
        };
        pegawai: {
            nama_lengkap: string;
            nip: string;
        };
        sekolah_id: string;
        cadisdik_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
        keterangan: string | null;
        status: string;
        jadwal_monitoring_id: string;
        agenda: string;
    }[]>;
    createJadwalMonitoring(cadisdikId: string, pegawaiId: string, body: {
        sekolah_id: string;
        tanggal_mulai: string;
        tanggal_selesai: string;
        agenda: string;
        keterangan?: string;
    }): Promise<{
        tanggal_mulai: string;
        tanggal_selesai: string;
        sekolah_id: string;
        cadisdik_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
        keterangan: string | null;
        status: string;
        jadwal_monitoring_id: string;
        agenda: string;
    }>;
    updateJadwalMonitoring(id: string, cadisdikId: string, user: any, body: any): Promise<{
        sekolah_id: string;
        cadisdik_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
        keterangan: string | null;
        status: string;
        jadwal_monitoring_id: string;
        agenda: string;
    }>;
    deleteJadwalMonitoring(id: string, cadisdikId: string, user: any): Promise<{
        sekolah_id: string;
        cadisdik_id: string;
        pegawai_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
        keterangan: string | null;
        status: string;
        jadwal_monitoring_id: string;
        agenda: string;
    }>;
}
