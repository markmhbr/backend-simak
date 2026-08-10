import { PrismaService } from '../../core/prisma/prisma.service';
import { CreatePengaturanTagihanDto } from './dto/create-pengaturan-tagihan.dto';
import { UpdatePengaturanTagihanDto } from './dto/update-pengaturan-tagihan.dto';
import { CreatePengaturanTagihanRombelDto } from './dto/create-pengaturan-tagihan-rombel.dto';
import { CreateTransaksiSppDto } from './dto/create-transaksi-spp.dto';
export declare class SppService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createPengaturanTagihan(dto: CreatePengaturanTagihanDto): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        pengaturan_tagihan_id: string;
        nama_tagihan: string;
        nominal: bigint;
        tipe: number;
    }>;
    getPengaturanTagihan(sekolahId: string): Promise<({
        pengaturan_rombel: ({
            rombongan_belajar: {
                nama: string;
                rombongan_belajar_id: string;
                semester_id: string;
                tingkat_pendidikan_id: import("@prisma/client-runtime-utils").Decimal;
            };
        } & {
            created_at: Date;
            rombongan_belajar_id: string;
            pengaturan_tagihan_id: string;
            pengaturan_tagihan_rombel_id: string;
        })[];
    } & {
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        pengaturan_tagihan_id: string;
        nama_tagihan: string;
        nominal: bigint;
        tipe: number;
    })[]>;
    updatePengaturanTagihan(id: string, dto: UpdatePengaturanTagihanDto): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        pengaturan_tagihan_id: string;
        nama_tagihan: string;
        nominal: bigint;
        tipe: number;
    }>;
    deletePengaturanTagihan(id: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        pengaturan_tagihan_id: string;
        nama_tagihan: string;
        nominal: bigint;
        tipe: number;
    }>;
    createPengaturanTagihanRombel(dto: CreatePengaturanTagihanRombelDto): Promise<{
        rombongan_belajar: {
            nama: string;
        };
    } & {
        created_at: Date;
        rombongan_belajar_id: string;
        pengaturan_tagihan_id: string;
        pengaturan_tagihan_rombel_id: string;
    }>;
    deletePengaturanTagihanRombel(id: string): Promise<{
        created_at: Date;
        rombongan_belajar_id: string;
        pengaturan_tagihan_id: string;
        pengaturan_tagihan_rombel_id: string;
    }>;
    generateSppTagihan(sekolahId: string, pengaturanTagihanId: string): Promise<{
        message: string;
        count: number;
    }>;
    getTagihanSpp(sekolahId: string, filter?: {
        peserta_didik_id?: string;
        status?: number;
    }): Promise<({
        pengaturan_tagihan: {
            nama_tagihan: string;
            tipe: number;
        };
        peserta_didik: {
            nama: string;
            nisn: string;
            rombongan_belajar: {
                nama: string;
            };
        };
        riwayat_transaksi: {
            sekolah_id: string;
            created_at: Date;
            keterangan: string | null;
            peserta_didik_id: string;
            nominal: bigint;
            riwayat_transaksi_spp_id: string;
            spp_id: string;
            jenis_transaksi: number;
            tanggal_transaksi: Date;
            metode_pembayaran: number | null;
        }[];
    } & {
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        peserta_didik_id: string;
        pengaturan_tagihan_id: string;
        status: number;
        spp_id: string;
        nominal_tagihan: bigint;
        nominal_terbayar: bigint;
        jatuh_tempo: Date | null;
    })[]>;
    createTransaksiSpp(dto: CreateTransaksiSppDto): Promise<{
        sekolah_id: string;
        created_at: Date;
        keterangan: string | null;
        peserta_didik_id: string;
        nominal: bigint;
        riwayat_transaksi_spp_id: string;
        spp_id: string;
        jenis_transaksi: number;
        tanggal_transaksi: Date;
        metode_pembayaran: number | null;
    }>;
    private getStudentRombelMap;
    getTunggakanPerSiswa(sekolahId: string): Promise<{
        spp_id: string;
        peserta_didik_id: string;
        nama: string;
        nisn: string;
        kelas: string;
        nama_tagihan: string;
        nominal_tagihan: string;
        nominal_terbayar: string;
        sisa_tunggakan: string;
    }[]>;
    getTunggakanPerKelas(sekolahId: string): Promise<{
        kelas: string;
        total_tunggakan: string;
    }[]>;
    getTotalPembayaran(sekolahId: string): Promise<{
        sekolah_id: string;
        total_pembayaran: string;
    }>;
    getTotalBeasiswa(sekolahId: string): Promise<{
        sekolah_id: string;
        total_beasiswa: string;
    }>;
    getRekapBulanan(sekolahId: string): Promise<{
        bulan_tahun: string;
        nominal: string;
    }[]>;
    getRekapTahunPelajaran(sekolahId: string): Promise<{
        semester_id: string;
        label: string;
        total_pembayaran: string;
    }[]>;
}
