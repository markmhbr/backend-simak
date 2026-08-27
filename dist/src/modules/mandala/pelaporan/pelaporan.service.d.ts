import { PrismaService } from '../../../core/prisma/prisma.service';
import { CreatePelaporanDto } from './dto/create-pelaporan.dto';
export declare class PelaporanService {
    private prisma;
    constructor(prisma: PrismaService);
    createPelaporan(cadisdikId: string, dto: CreatePelaporanDto): Promise<{
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal_mulai: Date | null;
        tanggal_selesai: Date | null;
        aktif: boolean;
        deskripsi: string | null;
        judul: string;
        pelaporan_id: string;
        template_konten: string | null;
    }>;
    getListPelaporan(cadisdikId: string, page?: number, limit?: number): Promise<{
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
    }>;
    getDetailPelaporan(cadisdikId: string, pelaporanId: string): Promise<{
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
    }>;
    getDokumenSekolah(cadisdikId: string, pelaporanId: string, sekolahId: string): Promise<{
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
    }>;
    getSimakListPelaporan(sekolahId: string, page?: number, limit?: number): Promise<{
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
    }>;
    getSimakDetailPelaporan(sekolahId: string, pelaporanId: string): Promise<{
        pelaporan_id: string;
        pelaporan_sekolah_id: string;
        judul: string;
        deskripsi: string;
        template_konten: string;
        tanggal_mulai: Date;
        tanggal_selesai: Date;
        dokumen: {
            created_at: Date;
            file_url: string;
            pelaporan_sekolah_id: string;
            pelaporan_dokumen_id: string;
            nama_file: string;
            ukuran_file: bigint | null;
        }[];
    }>;
    uploadDokumenSimak(sekolahId: string, pelaporanId: string, files: Express.Multer.File[]): Promise<any[]>;
    private resolveWilayahHierarchy;
    renderPelaporanHtml(cadisdikId: string, pelaporanId: string, sekolahId: string): Promise<string>;
    deleteDokumenSimak(sekolahId: string, dokumenId: string): Promise<void>;
    deletePelaporan(cadisdikId: string, id: string): Promise<void>;
    renderAllSekolahPelaporanHtml(cadisdikId: string, pelaporanId: string): Promise<string>;
    exportAllSekolahExcel(cadisdikId: string, pelaporanId: string): Promise<Buffer>;
    updatePelaporan(cadisdikId: string, pelaporanId: string, dto: CreatePelaporanDto): Promise<{
        cadisdik_id: string;
        created_at: Date;
        updated_at: Date;
        tanggal_mulai: Date | null;
        tanggal_selesai: Date | null;
        aktif: boolean;
        deskripsi: string | null;
        judul: string;
        pelaporan_id: string;
        template_konten: string | null;
    }>;
}
