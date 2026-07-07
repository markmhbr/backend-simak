import { PelaporanService } from './pelaporan.service';
import { CreatePelaporanDto } from './dto/create-pelaporan.dto';
import type { Request } from 'express';
export declare class PelaporanController {
    private readonly pelaporanService;
    constructor(pelaporanService: PelaporanService);
    private getCadisdikId;
    createPelaporan(req: Request, dto: CreatePelaporanDto): Promise<{
        status: string;
        message: string;
        data: {
            created_at: Date;
            updated_at: Date;
            tanggal_mulai: Date | null;
            tanggal_selesai: Date | null;
            cadisdik_id: string;
            aktif: boolean;
            judul: string;
            deskripsi: string | null;
            pelaporan_id: string;
        };
    }>;
    getListPelaporan(req: Request, page?: string, limit?: string): Promise<{
        total: number;
        data: {
            pelaporan_id: string;
            judul: string;
            tanggal_mulai: Date;
            tanggal_selesai: Date;
            jumlah_sekolah: number;
            jumlah_dokumen: number;
            aktif: boolean;
            created_at: Date;
        }[];
        status: string;
    }>;
    getDetailPelaporan(req: Request, id: string): Promise<{
        status: string;
        data: {
            pelaporan_id: string;
            judul: string;
            deskripsi: string;
            tanggal_mulai: Date;
            tanggal_selesai: Date;
            aktif: boolean;
            daftar_sekolah: {
                pelaporan_sekolah_id: string;
                sekolah_id: string;
                nama_sekolah: string;
                jumlah_dokumen: number;
            }[];
        };
    }>;
    getDokumenSekolah(req: Request, id: string, sekolahId: string): Promise<{
        status: string;
        data: {
            pelaporan_sekolah_id: string;
            sekolah_id: string;
            nama_sekolah: string;
            dokumen: {
                created_at: Date;
                nama_file: string;
                file_url: string;
                pelaporan_sekolah_id: string;
                pelaporan_dokumen_id: string;
                ukuran_file: bigint | null;
            }[];
        };
    }>;
}
