import { MandalaService } from './mandala.service';
export declare class MandalaController {
    private readonly mandalaService;
    constructor(mandalaService: MandalaService);
    getConnection(): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            id: string;
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
            created_at: Date;
            updated_at: Date;
            id: string;
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
            last_update: Date;
            cadisdik: {
                id: string;
                nama: string;
            };
        }[];
    }>;
    getCadisdiks(): Promise<{
        status: string;
        data: {
            email: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nama_instansi: string;
            alamat: string | null;
            nomor_telepon: string | null;
            website: string | null;
            provinsi: string | null;
            kabupaten: string[];
            aktif: boolean;
        }[];
    }>;
    getCadisdikDetail(id: string): Promise<{
        status: string;
        data: {
            sekolah: {
                nama: string;
                sekolah_id: string;
                npsn: string;
            }[];
        } & {
            email: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nama_instansi: string;
            alamat: string | null;
            nomor_telepon: string | null;
            website: string | null;
            provinsi: string | null;
            kabupaten: string[];
            aktif: boolean;
        };
    }>;
    createCadisdik(body: any): Promise<{
        status: string;
        message: string;
        data: {
            email: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nama_instansi: string;
            alamat: string | null;
            nomor_telepon: string | null;
            website: string | null;
            provinsi: string | null;
            kabupaten: string[];
            aktif: boolean;
        };
    }>;
    updateCadisdik(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            email: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nama_instansi: string;
            alamat: string | null;
            nomor_telepon: string | null;
            website: string | null;
            provinsi: string | null;
            kabupaten: string[];
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            aktif: boolean;
            kategori_keperluan_id: string;
        }[];
    }>;
    createKategoriKeperluan(body: any): Promise<{
        status: string;
        message: string;
        data: {
            nama: string;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            aktif: boolean;
            kategori_keperluan_id: string;
        };
    }>;
    updateKategoriKeperluan(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            nama: string;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
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
                created_at: Date;
                updated_at: Date;
                cadisdik_id: string;
                aktif: boolean;
                kategori_keperluan_id: string;
            };
        } & {
            status: number;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nama_lengkap: string;
            jabatan: string | null;
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
            status: number;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nama_lengkap: string;
            jabatan: string | null;
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
            status: number;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nama_lengkap: string;
            jabatan: string | null;
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
                id: any;
                nama: any;
                nip: any;
                nik: any;
                email: any;
                role: string;
                cadisdik: any;
            };
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        pegawai: any;
    }>;
    getPegawais(cadisdikId?: string): Promise<{
        status: string;
        data: ({
            cadisdik: {
                nama_instansi: string;
            };
        } & {
            jenis_kelamin: number;
            nik: string | null;
            tempat_lahir: string | null;
            tanggal_lahir: Date | null;
            email: string;
            foto: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nomor_telepon: string | null;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            nip: string | null;
            password: string;
            authenticator_secret: string | null;
            jabatan: number;
            alamat_lengkap: string | null;
            golongan: number | null;
        })[];
    }>;
    getPegawaiDetail(id: string): Promise<{
        status: string;
        data: {
            cadisdik: {
                email: string | null;
                created_at: Date;
                updated_at: Date;
                cadisdik_id: string;
                nama_instansi: string;
                alamat: string | null;
                nomor_telepon: string | null;
                website: string | null;
                provinsi: string | null;
                kabupaten: string[];
                aktif: boolean;
            };
        } & {
            jenis_kelamin: number;
            nik: string | null;
            tempat_lahir: string | null;
            tanggal_lahir: Date | null;
            email: string;
            foto: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nomor_telepon: string | null;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            nip: string | null;
            password: string;
            authenticator_secret: string | null;
            jabatan: number;
            alamat_lengkap: string | null;
            golongan: number | null;
        };
    }>;
    createPegawai(body: any): Promise<{
        status: string;
        message: string;
        data: {
            jenis_kelamin: number;
            nik: string | null;
            tempat_lahir: string | null;
            tanggal_lahir: Date | null;
            email: string;
            foto: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nomor_telepon: string | null;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            nip: string | null;
            password: string;
            authenticator_secret: string | null;
            jabatan: number;
            alamat_lengkap: string | null;
            golongan: number | null;
        };
    }>;
    updatePegawai(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            jenis_kelamin: number;
            nik: string | null;
            tempat_lahir: string | null;
            tanggal_lahir: Date | null;
            email: string;
            foto: string | null;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            nomor_telepon: string | null;
            aktif: boolean;
            pegawai_id: string;
            nama_lengkap: string;
            nip: string | null;
            password: string;
            authenticator_secret: string | null;
            jabatan: number;
            alamat_lengkap: string | null;
            golongan: number | null;
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
            create_date: Date;
            last_update: Date;
            last_sync: Date | null;
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
            updater_id: string | null;
            cadisdik_id: string | null;
            nomor_telepon: string | null;
            website: string | null;
            nm_wp: string | null;
            npwp: string | null;
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
                    tingkat_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
                };
            };
            peserta_didik_id: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
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
    getSemesterIds(): Promise<{
        status: string;
        data: {
            semester_id: string;
            nama: string;
            tahun_ajaran: string;
            semester: string;
            periode_aktif: boolean;
        }[];
    }>;
}
