import { MandalaService } from './mandala.service';
export declare class MandalaController {
    private readonly mandalaService;
    constructor(mandalaService: MandalaService);
    getConnection(): Promise<{
        status: string;
        data: {
            id: string;
            key: string;
            url_mandala: string;
            created_at: Date;
            updated_at: Date;
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
            key: string;
            url_mandala: string;
            created_at: Date;
            updated_at: Date;
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
            bentuk_pendidikan_is_str: any;
            bentuk_pendidikan_id_str: any;
            kabupaten_kota: any;
            kecamatan: any;
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
            nomor_telepon: string | null;
            email: string | null;
            website: string | null;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            alamat: string | null;
            nama_instansi: string;
            aktif: boolean;
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
            nomor_telepon: string | null;
            email: string | null;
            website: string | null;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            alamat: string | null;
            nama_instansi: string;
            aktif: boolean;
        };
    }>;
    createCadisdik(body: any): Promise<{
        status: string;
        message: string;
        data: {
            nomor_telepon: string | null;
            email: string | null;
            website: string | null;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            alamat: string | null;
            nama_instansi: string;
            aktif: boolean;
        };
    }>;
    updateCadisdik(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            nomor_telepon: string | null;
            email: string | null;
            website: string | null;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            alamat: string | null;
            nama_instansi: string;
            aktif: boolean;
        };
    }>;
    deleteCadisdik(id: string): Promise<{
        status: string;
        message: string;
    }>;
    getKategoriKeperluan(cadisdikId?: string): Promise<{
        status: string;
        data: {
            nama: string;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori_keperluan_id: string;
        }[];
    }>;
    createKategoriKeperluan(body: any): Promise<{
        status: string;
        message: string;
        data: {
            nama: string;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori_keperluan_id: string;
        };
    }>;
    updateKategoriKeperluan(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            nama: string;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori_keperluan_id: string;
        };
    }>;
    deleteKategoriKeperluan(id: string): Promise<{
        status: string;
        message: string;
    }>;
    getAntrian(cadisdikId?: string, status?: string, startDate?: string, endDate?: string): Promise<{
        status: string;
        data: ({
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
            nama_lengkap: string;
            jabatan: string | null;
            status: number;
            tanggal: Date;
            kategori_keperluan_id: string;
            antrian_id: string;
            nomor_antrian: number;
            unit_instansi: string | null;
            nomor_hp: string | null;
            keperluan: string | null;
        })[];
    }>;
    createAntrian(body: any): Promise<{
        status: string;
        message: string;
        data: {
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            nama_lengkap: string;
            jabatan: string | null;
            status: number;
            tanggal: Date;
            kategori_keperluan_id: string;
            antrian_id: string;
            nomor_antrian: number;
            unit_instansi: string | null;
            nomor_hp: string | null;
            keperluan: string | null;
        };
    }>;
    updateAntrianStatus(id: string, status: number): Promise<{
        status: string;
        message: string;
        data: {
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            nama_lengkap: string;
            jabatan: string | null;
            status: number;
            tanggal: Date;
            kategori_keperluan_id: string;
            antrian_id: string;
            nomor_antrian: number;
            unit_instansi: string | null;
            nomor_hp: string | null;
            keperluan: string | null;
        };
    }>;
    getAntrianRekap(cadisdikId?: string): Promise<{
        status: string;
        data: {
            hari_ini: string;
            total: number;
            menunggu: number;
            dipanggil: number;
            melayani: number;
            selesai: number;
            batal: number;
        };
    }>;
    loginPegawai(body: any): Promise<{
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
    verify2FA(body: {
        tempToken: string;
        code: string;
        secretToSave?: string;
    }): Promise<{
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
    refresh(refreshToken: string): Promise<{
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
    }>;
    getPegawais(cadisdikId?: string): Promise<{
        status: string;
        data: ({
            cadisdik: {
                nama_instansi: string;
            };
        } & {
            nomor_telepon: string | null;
            email: string;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            password: string;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            nip: string;
            authenticator_secret: string | null;
            jabatan: number;
            jenis_kelamin: number;
            foto: string | null;
            alamat_lengkap: string | null;
            nik: string | null;
            tanggal_lahir: Date | null;
            tempat_lahir: string | null;
        })[];
    }>;
    getPegawaiDetail(id: string): Promise<{
        status: string;
        data: {
            cadisdik: {
                nomor_telepon: string | null;
                email: string | null;
                website: string | null;
                cadisdik_id: string;
                created_at: Date;
                updated_at: Date;
                alamat: string | null;
                nama_instansi: string;
                aktif: boolean;
            };
        } & {
            nomor_telepon: string | null;
            email: string;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            password: string;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            nip: string;
            authenticator_secret: string | null;
            jabatan: number;
            jenis_kelamin: number;
            foto: string | null;
            alamat_lengkap: string | null;
            nik: string | null;
            tanggal_lahir: Date | null;
            tempat_lahir: string | null;
        };
    }>;
    createPegawai(body: any): Promise<{
        status: string;
        message: string;
        data: {
            nomor_telepon: string | null;
            email: string;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            password: string;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            nip: string;
            authenticator_secret: string | null;
            jabatan: number;
            jenis_kelamin: number;
            foto: string | null;
            alamat_lengkap: string | null;
            nik: string | null;
            tanggal_lahir: Date | null;
            tempat_lahir: string | null;
        };
    }>;
    updatePegawai(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            nomor_telepon: string | null;
            email: string;
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            password: string;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            nip: string;
            authenticator_secret: string | null;
            jabatan: number;
            jenis_kelamin: number;
            foto: string | null;
            alamat_lengkap: string | null;
            nik: string | null;
            tanggal_lahir: Date | null;
            tempat_lahir: string | null;
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
                nama_lengkap: string;
                nip: string;
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
                id: any;
                sekolah_id: any;
                nama: any;
                nisn: any;
                nik: any;
                jenis_kelamin: any;
                tempat_lahir: any;
                tanggal_lahir: any;
                agama: any;
                jenis_pendaftaran_id_str: any;
            };
            akademik: {
                nama_rombel: any;
                tingkat: any;
                jurusan: any;
            };
            data_pendukung: {
                alamat_lengkap: string;
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
                id: any;
                sekolah_id: any;
                nama: any;
                nip: any;
                nik: any;
                nuptk: any;
                jenis_kelamin: any;
                tempat_lahir: any;
                tanggal_lahir: any;
                agama: any;
            };
            kepegawaian: {
                jenis_ptk: any;
                jabatan: any;
                status_kepegawaian: any;
                status: any;
                pendidikan_terakhir: string;
            };
            data_pendukung: {
                alamat_lengkap: string;
                no_hp: any;
                no_wa: string;
                email: any;
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
                foto: string;
                rombongan_belajar: {
                    nama: string;
                    tingkat_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
                };
                nisn: string;
                nipd: string;
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
            gtk: any;
            status_masuk_str: string;
            status_pulang_str: string;
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
    getPesertaDidikPresenceSummary(sekolahId: string, tahun?: string): Promise<{
        status: string;
        data: {
            bulan: string;
            index: number;
            hadir: number;
            sakit: number;
            izin: number;
            alpha: number;
        }[];
    }>;
    getGtkPresenceSummary(sekolahId: string, tahun?: string): Promise<{
        status: string;
        data: {
            bulan: string;
            index: number;
            hadir: number;
            sakit: number;
            izin: number;
            alpha: number;
        }[];
    }>;
}
