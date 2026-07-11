import { ReferenceService } from './reference.service';
export declare class ReferenceController {
    private readonly referenceService;
    constructor(referenceService: ReferenceService);
    getOptions(): Promise<{
        status: string;
        data: {
            agama: {
                nama: string;
                agama_id: number;
            }[];
            bank: {
                id_bank: string;
                nm_bank: string;
            }[];
            jabatan_ptk: {
                jabatan_ptk: string;
                jabatan_ptk_id: import("@prisma/client-runtime-utils").Decimal;
            }[];
            jenis_ptk: {
                jenis_ptk: string;
                jenis_ptk_id: import("@prisma/client-runtime-utils").Decimal;
            }[];
            keahlian_laboratorium: {
                nama: string;
                keahlian_laboratorium_id: number;
            }[];
            lembaga_pengangkat: {
                nama: string;
                lembaga_pengangkat_id: import("@prisma/client-runtime-utils").Decimal;
            }[];
            pangkat_golongan: {
                nama: string;
                pangkat_golongan_id: import("@prisma/client-runtime-utils").Decimal;
            }[];
            status_kepegawaian: {
                nama: string;
                status_kepegawaian_id: number;
            }[];
            sumber_gaji: {
                nama: string;
                sumber_gaji_id: import("@prisma/client-runtime-utils").Decimal;
            }[];
            alat_transportasi: {
                nama: string;
                alat_transportasi_id: import("@prisma/client-runtime-utils").Decimal;
            }[];
            jenis_cita: {
                id_cita: import("@prisma/client-runtime-utils").Decimal;
                nm_cita: string;
            }[];
            jenis_hobby: {
                id_hobby: import("@prisma/client-runtime-utils").Decimal;
                nm_hobby: string;
            }[];
            alasan_layak_pip: {
                alasan_layak_pip: string;
                id_layak_pip: import("@prisma/client-runtime-utils").Decimal;
            }[];
            jenis_pendaftaran: {
                nama: string;
                jenis_pendaftaran_id: import("@prisma/client-runtime-utils").Decimal;
            }[];
            jenis_tinggal: {
                nama: string;
                jenis_tinggal_id: import("@prisma/client-runtime-utils").Decimal;
            }[];
            jenis_keluar: {
                jenis_keluar_id: string;
                ket_keluar: string;
            }[];
            kebutuhan_khusus: {
                kebutuhan_khusus: string;
                kebutuhan_khusus_id: number;
            }[];
            pekerjaan: {
                nama: string;
                pekerjaan_id: number;
            }[];
            jenjang_pendidikan: {
                nama: string;
                jenjang_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
            }[];
            penghasilan: {
                nama: string;
                penghasilan_id: number;
            }[];
        };
    }>;
    getAgama(): Promise<{
        status: string;
        data: {
            nama: string;
            agama_id: number;
        }[];
    }>;
    getBank(search?: string): Promise<{
        status: string;
        data: {
            id_bank: string;
            nm_bank: string;
        }[];
    }>;
    getJabatanPtk(): Promise<{
        status: string;
        data: {
            jabatan_ptk: string;
            jabatan_ptk_id: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    getJenisPtk(): Promise<{
        status: string;
        data: {
            jenis_ptk: string;
            jenis_ptk_id: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    getKeahlianLaboratorium(): Promise<{
        status: string;
        data: {
            nama: string;
            keahlian_laboratorium_id: number;
        }[];
    }>;
    getMstWilayah(search?: string, limit?: string): Promise<{
        status: string;
        data: {
            nama: string;
            kode_wilayah: string;
            id_level_wilayah: number;
        }[];
    }>;
    getWilayah(level: string, parentCode?: string): Promise<{
        status: string;
        data: {
            nama: string;
            kode_wilayah: string;
        }[];
    }>;
    getLembagaPengangkat(): Promise<{
        status: string;
        data: {
            nama: string;
            lembaga_pengangkat_id: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    getPangkatGolongan(): Promise<{
        status: string;
        data: {
            nama: string;
            pangkat_golongan_id: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    getStatusKepegawaian(): Promise<{
        status: string;
        data: {
            nama: string;
            status_kepegawaian_id: number;
        }[];
    }>;
    getSumberGaji(): Promise<{
        status: string;
        data: {
            nama: string;
            sumber_gaji_id: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    getAlatTransportasi(): Promise<{
        status: string;
        data: {
            nama: string;
            alat_transportasi_id: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    getJenisCita(): Promise<{
        status: string;
        data: {
            id_cita: import("@prisma/client-runtime-utils").Decimal;
            nm_cita: string;
        }[];
    }>;
    getJenisHobby(): Promise<{
        status: string;
        data: {
            id_hobby: import("@prisma/client-runtime-utils").Decimal;
            nm_hobby: string;
        }[];
    }>;
    getAlasanLayakPip(): Promise<{
        status: string;
        data: {
            alasan_layak_pip: string;
            id_layak_pip: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    getJenisPendaftaran(): Promise<{
        status: string;
        data: {
            nama: string;
            jenis_pendaftaran_id: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    getJenisTinggal(): Promise<{
        status: string;
        data: {
            nama: string;
            jenis_tinggal_id: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    getJenisKeluar(): Promise<{
        status: string;
        data: {
            jenis_keluar_id: string;
            ket_keluar: string;
        }[];
    }>;
    getKebutuhanKhusus(): Promise<{
        status: string;
        data: {
            kebutuhan_khusus: string;
            kebutuhan_khusus_id: number;
        }[];
    }>;
    getPekerjaan(): Promise<{
        status: string;
        data: {
            nama: string;
            pekerjaan_id: number;
        }[];
    }>;
    getJenjangPendidikan(): Promise<{
        status: string;
        data: {
            nama: string;
            jenjang_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
        }[];
    }>;
    getPenghasilan(): Promise<{
        status: string;
        data: {
            nama: string;
            penghasilan_id: number;
        }[];
    }>;
}
