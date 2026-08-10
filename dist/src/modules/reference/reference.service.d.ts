import { PrismaService } from '../../core/prisma/prisma.service';
export declare class ReferenceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAgama(): Promise<{
        nama: string;
        agama_id: number;
    }[]>;
    getBank(search?: string): Promise<{
        id_bank: string;
        nm_bank: string;
    }[]>;
    getJabatanPtk(): Promise<{
        jabatan_ptk: string;
        jabatan_ptk_id: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    getJenisPtk(): Promise<{
        jenis_ptk: string;
        jenis_ptk_id: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    getKeahlianLaboratorium(): Promise<{
        nama: string;
        keahlian_laboratorium_id: number;
    }[]>;
    getMstWilayah(search?: string, limit?: number): Promise<{
        nama: string;
        kode_wilayah: string;
        id_level_wilayah: number;
    }[]>;
    getWilayahByParent(level: number, parentCode?: string): Promise<{
        nama: string;
        kode_wilayah: string;
    }[]>;
    getLembagaPengangkat(): Promise<{
        nama: string;
        lembaga_pengangkat_id: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    getPangkatGolongan(): Promise<{
        nama: string;
        pangkat_golongan_id: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    getStatusKepegawaian(): Promise<{
        nama: string;
        status_kepegawaian_id: number;
    }[]>;
    getSumberGaji(): Promise<{
        nama: string;
        sumber_gaji_id: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    getAlatTransportasi(): Promise<{
        nama: string;
        alat_transportasi_id: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    getJenisCita(): Promise<{
        id_cita: import("@prisma/client-runtime-utils").Decimal;
        nm_cita: string;
    }[]>;
    getJenisHobby(): Promise<{
        id_hobby: import("@prisma/client-runtime-utils").Decimal;
        nm_hobby: string;
    }[]>;
    getAlasanLayakPip(): Promise<{
        alasan_layak_pip: string;
        id_layak_pip: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    getJenisPendaftaran(): Promise<{
        nama: string;
        jenis_pendaftaran_id: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    getJenisTinggal(): Promise<{
        nama: string;
        jenis_tinggal_id: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    getJenisKeluar(): Promise<{
        jenis_keluar_id: string;
        ket_keluar: string;
    }[]>;
    getKebutuhanKhusus(): Promise<{
        kebutuhan_khusus_id: number;
        kebutuhan_khusus: string;
    }[]>;
    getPekerjaan(): Promise<{
        nama: string;
        pekerjaan_id: number;
    }[]>;
    getJenjangPendidikan(): Promise<{
        nama: string;
        jenjang_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    getPenghasilan(): Promise<{
        nama: string;
        penghasilan_id: number;
    }[]>;
    getAllOptions(): Promise<{
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
            kebutuhan_khusus_id: number;
            kebutuhan_khusus: string;
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
    }>;
    private formatYesNo;
    resolveGtk(gtk: any): Promise<any>;
    resolvePesertaDidik(pd: any): Promise<any>;
}
