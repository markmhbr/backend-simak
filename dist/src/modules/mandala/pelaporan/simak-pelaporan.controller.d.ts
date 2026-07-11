import { PelaporanService } from './pelaporan.service';
import type { Request } from 'express';
export declare class SimakPelaporanController {
    private readonly pelaporanService;
    constructor(pelaporanService: PelaporanService);
    private getSekolahInfo;
    getSimakListPelaporan(req: Request, page?: string, limit?: string): Promise<{
        total: number;
        data: {
            pelaporan_id: string;
            judul: string;
            deskripsi: string;
            tanggal_mulai: Date;
            tanggal_selesai: Date;
            aktif: boolean;
            jumlah_dokumen: number;
        }[];
        status: string;
    }>;
    getSimakDetailPelaporan(req: Request, id: string): Promise<{
        status: string;
        data: {
            pelaporan_id: string;
            pelaporan_sekolah_id: string;
            judul: string;
            deskripsi: string;
            template_konten: string;
            tanggal_mulai: Date;
            tanggal_selesai: Date;
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
    uploadDokumen(req: Request, id: string, files: Express.Multer.File[]): Promise<{
        status: string;
        message: string;
        data: any[];
    }>;
    deleteDokumen(req: Request, dokumenId: string): Promise<{
        status: string;
        message: string;
    }>;
}
