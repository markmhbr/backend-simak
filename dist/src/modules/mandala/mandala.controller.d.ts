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
    getSchools(req: any): Promise<{
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
        }[];
    }>;
    getProvinsiList(): Promise<{
        status: string;
        data: string[];
    }>;
    getKabupatenList(provinsiNama: string): Promise<{
        status: string;
        data: string[];
    }>;
    getCadisdiks(): Promise<{
        status: string;
        data: {
            email: string | null;
            created_at: Date;
            updated_at: Date;
            nomor_telepon: string | null;
            website: string | null;
            cadisdik_id: string;
            aktif: boolean;
            nama_instansi: string;
            alamat: string | null;
            provinsi: string | null;
            kabupaten: string[];
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
            nomor_telepon: string | null;
            website: string | null;
            cadisdik_id: string;
            aktif: boolean;
            nama_instansi: string;
            alamat: string | null;
            provinsi: string | null;
            kabupaten: string[];
        };
    }>;
    createCadisdik(body: any): Promise<{
        status: string;
        message: string;
        data: {
            email: string | null;
            created_at: Date;
            updated_at: Date;
            nomor_telepon: string | null;
            website: string | null;
            cadisdik_id: string;
            aktif: boolean;
            nama_instansi: string;
            alamat: string | null;
            provinsi: string | null;
            kabupaten: string[];
        };
    }>;
    updateCadisdik(id: string, body: any): Promise<{
        status: string;
        message: string;
        data: {
            email: string | null;
            created_at: Date;
            updated_at: Date;
            nomor_telepon: string | null;
            website: string | null;
            cadisdik_id: string;
            aktif: boolean;
            nama_instansi: string;
            alamat: string | null;
            provinsi: string | null;
            kabupaten: string[];
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
            tanggal: Date;
            keperluan: string | null;
            antrian_id: string;
            kategori_keperluan_id: string;
            nomor_antrian: number;
            nama_lengkap: string;
            jabatan: string | null;
            unit_instansi: string | null;
            nomor_hp: string | null;
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
            tanggal: Date;
            keperluan: string | null;
            antrian_id: string;
            kategori_keperluan_id: string;
            nomor_antrian: number;
            nama_lengkap: string;
            jabatan: string | null;
            unit_instansi: string | null;
            nomor_hp: string | null;
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
            tanggal: Date;
            keperluan: string | null;
            antrian_id: string;
            kategori_keperluan_id: string;
            nomor_antrian: number;
            nama_lengkap: string;
            jabatan: string | null;
            unit_instansi: string | null;
            nomor_hp: string | null;
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
    getJenisJabatans(): Promise<{
        status: string;
        data: {
            nama: string;
            created_at: Date;
            updated_at: Date;
            jenis_jabatan_id: string;
        }[];
    }>;
    getJenisJabatanDetail(id: string): Promise<{
        status: string;
        data: {
            nama: string;
            created_at: Date;
            updated_at: Date;
            jenis_jabatan_id: string;
        };
    }>;
    createJenisJabatan(body: {
        nama: string;
    }): Promise<{
        status: string;
        message: string;
        data: {
            nama: string;
            created_at: Date;
            updated_at: Date;
            jenis_jabatan_id: string;
        };
    }>;
    updateJenisJabatan(id: string, body: {
        nama: string;
    }): Promise<{
        status: string;
        message: string;
        data: {
            nama: string;
            created_at: Date;
            updated_at: Date;
            jenis_jabatan_id: string;
        };
    }>;
    deleteJenisJabatan(id: string): Promise<{
        status: string;
        message: string;
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
    requestReset2FA(body: {
        username: string;
        password: any;
    }): Promise<{
        status: string;
        message: string;
        resetToken: string;
    }>;
    verifyReset2FA(body: {
        resetToken: string;
        code: string;
    }): Promise<{
        status: string;
        message: string;
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
            jenis_jabatan: {
                nama: string;
                created_at: Date;
                updated_at: Date;
                jenis_jabatan_id: string;
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
        })[];
    }>;
    getPegawaiDetail(id: string): Promise<{
        status: string;
        data: {
            cadisdik: {
                email: string | null;
                created_at: Date;
                updated_at: Date;
                nomor_telepon: string | null;
                website: string | null;
                cadisdik_id: string;
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
    }>;
    deletePegawai(id: string): Promise<{
        status: string;
        message: string;
    }>;
    reset2FAPegawai(id: string): Promise<{
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
            mapping_pengawas_id: string;
            pegawai_id: string;
        })[];
    }>;
    createMappingPengawas(body: any): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            mapping_pengawas_id: string;
            pegawai_id: string;
        };
    }>;
    deleteMappingPengawas(id: string): Promise<{
        status: string;
        message: string;
    }>;
    getSchoolDetail(id: string, req: any): Promise<{
        status: string;
        data: {
            nama_kepala_sekolah: string;
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
    }>;
    getSchoolSummary(id: string, req: any): Promise<{
        status: string;
        data: {
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
        };
    }>;
    getPesertaDidik(req: any, sekolahId?: string, limit?: string, page?: string, search?: string, status?: 'aktif' | 'non-aktif'): Promise<{
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
    getGtk(req: any, sekolahId?: string, limit?: string, page?: string, search?: string, status?: 'aktif' | 'non-aktif', type?: 'guru' | 'tendik', tab?: string): Promise<{
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
    getRombonganBelajar(req: any, sekolahId?: string, type?: string, limit?: string, page?: string, search?: string, tingkat?: string, semesterId?: string): Promise<{
        status: string;
        data: {
            jumlah_siswa: number;
            ptk_id_str: any;
            tingkat_pendidikan_id_str: string;
            kurikulum_id_str: any;
            id_ruang_str: any;
            nama: string;
            rombongan_belajar_id: string;
            _count: {
                anggota_rombel: number;
            };
            ptk_id: string;
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
    getRombelAnggota(rombelId: string): Promise<{
        status: string;
        data: any[];
    }>;
    getPesertaDidikPresence(req: any, sekolahId: string, tanggal?: string): Promise<{
        status: string;
        data: {
            status_masuk_str: string;
            status_pulang_str: string;
            peserta_didik: {
                rombongan_belajar: {
                    nama: string;
                    tingkat_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
                };
                nama: string;
                nisn: string;
                nipd: string;
                foto: string;
                anggota_rombel: {
                    rombongan_belajar: {
                        nama: string;
                        tingkat_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
                    };
                }[];
            };
            peserta_didik_id: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            tanggal: Date;
            jam_masuk: Date | null;
            jam_pulang: Date | null;
            status_masuk: number | null;
            status_pulang: number | null;
        }[];
    }>;
    getGtkPresence(req: any, sekolahId: string, tanggal?: string): Promise<{
        status: string;
        data: {
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
        }[];
    }>;
    getPesertaDidikPresenceSummary(req: any, sekolahId: string, tahun?: string): Promise<{
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
    getGtkPresenceSummary(req: any, sekolahId: string, tahun?: string): Promise<{
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
            semester_id: any;
            nama: any;
            tahun_ajaran: any;
            semester: any;
            periode_aktif: boolean;
        }[];
    }>;
    getMenuRoles(): Promise<{
        status: string;
        data: ({
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
        })[];
    }>;
    updateMenuRoles(body: {
        roles: Array<{
            menu_key: string;
            jabatan_id?: number;
            jabatan_nama?: string;
            jenis_jabatan_id?: string;
        }>;
    }): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    getSekolahBinaan(req: any): Promise<{
        status: string;
        data: {
            nama: string;
            sekolah_id: string;
            npsn: string;
        }[];
    }>;
    getJadwalMonitoring(req: any, startDate?: string, endDate?: string, sekolahId?: string, pegawaiId?: string): Promise<{
        status: string;
        data: {
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
            keterangan: string | null;
            status: string;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string;
            jadwal_monitoring_id: string;
            agenda: string;
        }[];
    }>;
    createJadwalMonitoring(req: any, body: any): Promise<{
        status: string;
        message: string;
        data: {
            tanggal_mulai: string;
            tanggal_selesai: string;
            sekolah_id: string;
            keterangan: string | null;
            status: string;
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string;
            pegawai_id: string;
            jadwal_monitoring_id: string;
            agenda: string;
        };
    }>;
    updateJadwalMonitoring(req: any, id: string, body: any): Promise<{
        status: string;
        message: string;
    }>;
    deleteJadwalMonitoring(req: any, id: string): Promise<{
        status: string;
        message: string;
    }>;
}
