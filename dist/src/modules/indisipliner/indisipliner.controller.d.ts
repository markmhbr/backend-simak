import { IndisiplinerService } from './indisipliner.service';
import { CreateKategoriPelanggaranDto } from './dto/create-kategori-pelanggaran.dto';
import { CreateJenisPelanggaranDto } from './dto/create-jenis-pelanggaran.dto';
import { CreateJenisTindakLanjutDto } from './dto/create-jenis-tindak-lanjut.dto';
import { CreatePelanggaranDto } from './dto/create-pelanggaran.dto';
import { CreateTindakLanjutDto } from './dto/create-tindak-lanjut.dto';
export declare class IndisiplinerController {
    private readonly indisiplinerService;
    constructor(indisiplinerService: IndisiplinerService);
    getKategoriPelanggaran(sekolahId: string, target?: number): Promise<{
        status: string;
        data: ({
            jenis_pelanggaran: {
                nama: string;
                sekolah_id: string;
                created_at: Date;
                updated_at: Date;
                aktif: boolean;
                jenis_pelanggaran_id: string;
                poin: number;
                kategori_pelanggaran_id: string | null;
                target: number;
            }[];
        } & {
            nama: string;
            sekolah_id: string;
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori_pelanggaran_id: string;
            target: number;
        })[];
    }>;
    createKategoriPelanggaran(dto: CreateKategoriPelanggaranDto): Promise<{
        status: string;
        message: string;
        data: {
            nama: string;
            sekolah_id: string;
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori_pelanggaran_id: string;
            target: number;
        };
    }>;
    getJenisPelanggaran(sekolahId: string): Promise<{
        status: string;
        data: ({
            kategori_pelanggaran: {
                nama: string;
                sekolah_id: string;
                keterangan: string | null;
                created_at: Date;
                updated_at: Date;
                aktif: boolean;
                kategori_pelanggaran_id: string;
                target: number;
            };
        } & {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            jenis_pelanggaran_id: string;
            poin: number;
            kategori_pelanggaran_id: string | null;
            target: number;
        })[];
    }>;
    createJenisPelanggaran(dto: CreateJenisPelanggaranDto): Promise<{
        status: string;
        message: string;
        data: {
            kategori_pelanggaran: {
                nama: string;
                sekolah_id: string;
                keterangan: string | null;
                created_at: Date;
                updated_at: Date;
                aktif: boolean;
                kategori_pelanggaran_id: string;
                target: number;
            };
        } & {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            jenis_pelanggaran_id: string;
            poin: number;
            kategori_pelanggaran_id: string | null;
            target: number;
        };
    }>;
    getJenisTindakLanjut(sekolahId: string): Promise<{
        status: string;
        data: {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            jenis_tindak_lanjut_id: string;
            target: number;
        }[];
    }>;
    createJenisTindakLanjut(dto: CreateJenisTindakLanjutDto): Promise<{
        status: string;
        message: string;
        data: {
            nama: string;
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            jenis_tindak_lanjut_id: string;
            target: number;
        };
    }>;
    getPelanggaran(sekolahId: string, pesertaDidikId?: string, ptkId?: string, status?: number): Promise<{
        status: string;
        data: any[];
    }>;
    createPelanggaran(dto: CreatePelanggaranDto): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            tanggal: Date;
            pelanggaran_id: string;
            jenis_pelanggaran_id: string;
            waktu: Date;
            poin: number;
            pelapor_ptk_id: string | null;
        };
    }>;
    updatePelanggaranStatus(id: string, status: number): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            tanggal: Date;
            pelanggaran_id: string;
            jenis_pelanggaran_id: string;
            waktu: Date;
            poin: number;
            pelapor_ptk_id: string | null;
        };
    }>;
    createTindakLanjut(dto: CreateTindakLanjutDto): Promise<{
        status: string;
        message: string;
        data: {
            keterangan: string | null;
            created_at: Date;
            updated_at: Date;
            tanggal: Date;
            pelanggaran_id: string;
            tindak_lanjut_id: string;
            jenis_tindak_lanjut_id: string;
            petugas_ptk_id: string | null;
        };
    }>;
    getSchoolSummary(sekolahId: string): Promise<{
        status: string;
        data: {
            stats: {
                total_pelanggaran: number;
                total_pelanggaran_gtk: number;
                total_pelanggaran_siswa: number;
                master_jenis_pelanggaran: number;
                master_jenis_tindak_lanjut: number;
            };
            top_siswa: {
                peserta_didik_id: string;
                nama: string;
                nisn: string;
                rombongan_belajar: string;
                foto: string;
                total_poin: number;
                total_pelanggaran: number;
            }[];
            top_gtk: {
                ptk_id: string;
                nama: string;
                nuptk: string;
                jabatan: string;
                foto: string;
                total_poin: number;
                total_pelanggaran: number;
            }[];
            top_pelanggaran_jenis: {
                nama: string;
                target: number;
                count: number;
            }[];
        };
    }>;
}
