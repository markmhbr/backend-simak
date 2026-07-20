import { SppService } from './spp.service';
import { CreatePengaturanTagihanDto } from './dto/create-pengaturan-tagihan.dto';
import { UpdatePengaturanTagihanDto } from './dto/update-pengaturan-tagihan.dto';
import { CreatePengaturanTagihanRombelDto } from './dto/create-pengaturan-tagihan-rombel.dto';
import { CreateTransaksiSppDto } from './dto/create-transaksi-spp.dto';
export declare class GenerateSppDto {
    sekolah_id: string;
    pengaturan_tagihan_id: string;
}
export declare class SppController {
    private readonly sppService;
    constructor(sppService: SppService);
    createPengaturanTagihan(dto: CreatePengaturanTagihanDto): Promise<{
        status: string;
        message: string;
        data: {
            aktif: boolean;
            created_at: Date;
            updated_at: Date;
            sekolah_id: string;
            tipe: number;
            nama_tagihan: string;
            nominal: bigint;
            pengaturan_tagihan_id: string;
        };
    }>;
    getPengaturanTagihan(sekolahId: string): Promise<{
        status: string;
        data: ({
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
            aktif: boolean;
            created_at: Date;
            updated_at: Date;
            sekolah_id: string;
            tipe: number;
            nama_tagihan: string;
            nominal: bigint;
            pengaturan_tagihan_id: string;
        })[];
    }>;
    updatePengaturanTagihan(id: string, dto: UpdatePengaturanTagihanDto): Promise<{
        status: string;
        message: string;
        data: {
            aktif: boolean;
            created_at: Date;
            updated_at: Date;
            sekolah_id: string;
            tipe: number;
            nama_tagihan: string;
            nominal: bigint;
            pengaturan_tagihan_id: string;
        };
    }>;
    deletePengaturanTagihan(id: string): Promise<{
        status: string;
        message: string;
    }>;
    createPengaturanTagihanRombel(dto: CreatePengaturanTagihanRombelDto): Promise<{
        status: string;
        message: string;
        data: {
            rombongan_belajar: {
                nama: string;
            };
        } & {
            created_at: Date;
            rombongan_belajar_id: string;
            pengaturan_tagihan_id: string;
            pengaturan_tagihan_rombel_id: string;
        };
    }>;
    deletePengaturanTagihanRombel(id: string): Promise<{
        status: string;
        message: string;
    }>;
    generateSppTagihan(dto: GenerateSppDto): Promise<{
        status: string;
        message: string;
        data: {
            message: string;
            count: number;
        };
    }>;
    getTagihanSpp(sekolahId: string, pesertaDidikId?: string, status?: number): Promise<{
        status: string;
        data: ({
            peserta_didik: {
                nama: string;
                nisn: string;
                rombongan_belajar: {
                    nama: string;
                };
            };
            pengaturan_tagihan: {
                tipe: number;
                nama_tagihan: string;
            };
            riwayat_transaksi: {
                created_at: Date;
                sekolah_id: string;
                peserta_didik_id: string;
                keterangan: string | null;
                nominal: bigint;
                spp_id: string;
                jenis_transaksi: number;
                tanggal_transaksi: Date;
                metode_pembayaran: number | null;
                riwayat_transaksi_spp_id: string;
            }[];
        } & {
            created_at: Date;
            updated_at: Date;
            sekolah_id: string;
            peserta_didik_id: string;
            status: number;
            pengaturan_tagihan_id: string;
            spp_id: string;
            nominal_tagihan: bigint;
            nominal_terbayar: bigint;
            jatuh_tempo: Date | null;
        })[];
    }>;
    createTransaksiSpp(dto: CreateTransaksiSppDto): Promise<{
        status: string;
        message: string;
        data: {
            created_at: Date;
            sekolah_id: string;
            peserta_didik_id: string;
            keterangan: string | null;
            nominal: bigint;
            spp_id: string;
            jenis_transaksi: number;
            tanggal_transaksi: Date;
            metode_pembayaran: number | null;
            riwayat_transaksi_spp_id: string;
        };
    }>;
    getTunggakanPerSiswa(sekolahId: string): Promise<{
        status: string;
        data: {
            spp_id: string;
            peserta_didik_id: string;
            nama: string;
            nisn: string;
            kelas: string;
            nama_tagihan: string;
            nominal_tagihan: string;
            nominal_terbayar: string;
            sisa_tunggakan: string;
        }[];
    }>;
    getTunggakanPerKelas(sekolahId: string): Promise<{
        status: string;
        data: {
            kelas: string;
            total_tunggakan: string;
        }[];
    }>;
    getTotalPembayaran(sekolahId: string): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            total_pembayaran: string;
        };
    }>;
    getTotalBeasiswa(sekolahId: string): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            total_beasiswa: string;
        };
    }>;
    getRekapBulanan(sekolahId: string): Promise<{
        status: string;
        data: {
            bulan_tahun: string;
            nominal: string;
        }[];
    }>;
    getRekapTahunPelajaran(sekolahId: string): Promise<{
        status: string;
        data: {
            semester_id: string;
            label: string;
            total_pembayaran: string;
        }[];
    }>;
}
