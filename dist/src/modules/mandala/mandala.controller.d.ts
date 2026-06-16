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
        }[];
    }>;
    getCadisdiks(): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            email: string | null;
            alamat: string | null;
            nomor_telepon: string | null;
            website: string | null;
            cadisdik_id: string;
            aktif: boolean;
            nama_instansi: string;
        }[];
    }>;
    getCadisdikDetail(id: string): Promise<{
        status: string;
        data: {
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
        };
    }>;
    createCadisdik(body: any): Promise<{
        status: string;
        message: string;
        data: {
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
    }>;
    updateCadisdik(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
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
    }>;
    deleteCadisdik(id: string): Promise<{
        status: string;
        message: string;
    }>;
    loginPegawai(body: any): Promise<{
        status: string;
        data: {
            accessToken: string;
            refreshToken: string;
            pegawai: {
                id: string;
                nama: string;
                nip: string;
                email: string;
                role: string;
                cadisdik: string;
            };
        };
    }>;
    getPegawais(cadisdikId?: string): Promise<{
        status: string;
        data: ({
            cadisdik: {
                nama_instansi: string;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            password: string;
            email: string;
            jenis_kelamin: number;
            foto: string | null;
            nip: string;
            nomor_telepon: string | null;
            cadisdik_id: string;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            authenticator_secret: string | null;
            jabatan: number;
        })[];
    }>;
    getPegawaiDetail(id: string): Promise<{
        status: string;
        data: {
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
            jenis_kelamin: number;
            foto: string | null;
            nip: string;
            nomor_telepon: string | null;
            cadisdik_id: string;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            authenticator_secret: string | null;
            jabatan: number;
        };
    }>;
    createPegawai(body: any): Promise<{
        status: string;
        message: string;
        data: {
            created_at: Date;
            updated_at: Date;
            password: string;
            email: string;
            jenis_kelamin: number;
            foto: string | null;
            nip: string;
            nomor_telepon: string | null;
            cadisdik_id: string;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            authenticator_secret: string | null;
            jabatan: number;
        };
    }>;
    updatePegawai(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            created_at: Date;
            updated_at: Date;
            password: string;
            email: string;
            jenis_kelamin: number;
            foto: string | null;
            nip: string;
            nomor_telepon: string | null;
            cadisdik_id: string;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            authenticator_secret: string | null;
            jabatan: number;
        };
    }>;
    deletePegawai(id: string): Promise<{
        status: string;
        message: string;
    }>;
    getMappingPengawas(pegawaiId?: string, sekolahId?: string): Promise<{
        status: string;
        data: ({
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
        })[];
    }>;
    createMappingPengawas(body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            pegawai_id: string;
            mapping_pengawas_id: string;
        };
    }>;
    deleteMappingPengawas(id: string): Promise<{
        status: string;
        message: string;
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
            alamat_jalan: string | null;
            rt: string | null;
            rw: string | null;
            desa_kelurahan: string | null;
            kode_wilayah: string | null;
            kode_pos: string | null;
            lintang: import("@prisma/client-runtime-utils").Decimal | null;
            bujur: import("@prisma/client-runtime-utils").Decimal | null;
            dusun: string | null;
            kabupaten_kota: string | null;
            kecamatan: string | null;
            provinsi: string | null;
            nss: string | null;
            npsn: string | null;
            bentuk_pendidikan_id: number | null;
            bentuk_pendidikan_id_str: string | null;
            status_sekolah: string | null;
            status_sekolah_str: string | null;
            nomor_telepon: string | null;
            nomor_fax: string | null;
            website: string | null;
            is_sks: boolean | null;
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
    getPesertaDidik(sekolahId?: string, limit?: string, page?: string, search?: string, status?: 'aktif' | 'non-aktif'): Promise<{
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
    getGtk(sekolahId?: string, limit?: string, page?: string, search?: string, status?: 'aktif' | 'non-aktif', type?: 'guru' | 'tendik', tab?: string): Promise<{
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
    } | {
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
    getPesertaDidikPresence(sekolahId: string, tanggal?: string): Promise<{
        status: string;
        data: {
            status_masuk_str: string;
            status_pulang_str: string;
            peserta_didik: {
                nama: string;
                nisn: string;
                nipd: string;
                foto: string;
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
        }[];
    }>;
    getGtkPresence(sekolahId: string, tanggal?: string): Promise<{
        status: string;
        data: {
            status_masuk_str: string;
            status_pulang_str: string;
            gtk: {
                nama: string;
                foto: string;
                nuptk: string;
                jenis_ptk_id_str: string;
                nip: string;
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
        }[];
    }>;
}
