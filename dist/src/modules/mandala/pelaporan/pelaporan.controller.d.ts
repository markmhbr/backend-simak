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
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            tanggal_mulai: Date | null;
            tanggal_selesai: Date | null;
            aktif: boolean;
            pelaporan_id: string;
            judul: string;
            deskripsi: string | null;
            template_konten: string | null;
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
            template_konten: string;
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
                file_url: string;
                pelaporan_sekolah_id: string;
                pelaporan_dokumen_id: string;
                nama_file: string;
                ukuran_file: bigint | null;
            }[];
        };
    }>;
    previewPelaporan(req: Request, res: any, id: string, sekolahId: string): Promise<any>;
    previewRekap(req: Request, res: any, id: string): Promise<any>;
    exportPelaporan(req: Request, res: any, id: string): Promise<any>;
    updatePelaporan(req: Request, id: string, dto: CreatePelaporanDto): Promise<{
        status: string;
        message: string;
        data: {
            cadisdik_id: string;
            created_at: Date;
            updated_at: Date;
            tanggal_mulai: Date | null;
            tanggal_selesai: Date | null;
            aktif: boolean;
            pelaporan_id: string;
            judul: string;
            deskripsi: string | null;
            template_konten: string | null;
        };
    }>;
    deletePelaporan(req: Request, id: string): Promise<{
        status: string;
        message: string;
    }>;
}
