import { IndisiplinerService } from './indisipliner.service';
import { CreateJenisPelanggaranDto } from './dto/create-jenis-pelanggaran.dto';
import { CreateJenisTindakLanjutDto } from './dto/create-jenis-tindak-lanjut.dto';
import { CreatePelanggaranDto } from './dto/create-pelanggaran.dto';
import { CreateTindakLanjutDto } from './dto/create-tindak-lanjut.dto';
export declare class IndisiplinerController {
    private readonly indisiplinerService;
    constructor(indisiplinerService: IndisiplinerService);
    getJenisPelanggaran(sekolahId: string): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            nama: string;
            target: number;
            poin: number;
            jenis_pelanggaran_id: string;
        }[];
    }>;
    createJenisPelanggaran(dto: CreateJenisPelanggaranDto): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            nama: string;
            target: number;
            poin: number;
            jenis_pelanggaran_id: string;
        };
    }>;
    getJenisTindakLanjut(sekolahId: string): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            nama: string;
            target: number;
            jenis_tindak_lanjut_id: string;
        }[];
    }>;
    createJenisTindakLanjut(dto: CreateJenisTindakLanjutDto): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            nama: string;
            target: number;
            jenis_tindak_lanjut_id: string;
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
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            status: number;
            keterangan: string | null;
            tanggal: Date;
            poin: number;
            jenis_pelanggaran_id: string;
            waktu: Date;
            pelapor_ptk_id: string | null;
            pelanggaran_id: string;
        };
    }>;
    updatePelanggaranStatus(id: string, status: number): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string | null;
            status: number;
            keterangan: string | null;
            tanggal: Date;
            poin: number;
            jenis_pelanggaran_id: string;
            waktu: Date;
            pelapor_ptk_id: string | null;
            pelanggaran_id: string;
        };
    }>;
    createTindakLanjut(dto: CreateTindakLanjutDto): Promise<{
        status: string;
        message: string;
        data: {
            created_at: Date;
            updated_at: Date;
            keterangan: string | null;
            tanggal: Date;
            pelanggaran_id: string;
            jenis_tindak_lanjut_id: string;
            petugas_ptk_id: string | null;
            tindak_lanjut_id: string;
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
