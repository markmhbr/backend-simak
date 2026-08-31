import type { Request } from 'express';
import { MutasiPdService } from './mutasi-pd.service';
export declare class MutasiPdController {
    private readonly mutasiService;
    constructor(mutasiService: MutasiPdService);
    private getSekolahId;
    getReference(): Promise<{
        jenis_keluar_id: string;
        ket_keluar: string;
    }[]>;
    getList(req: Request, paramSekolahId: string): Promise<{
        status: string;
        data: ({
            jenis_keluar: {
                ket_keluar: string;
            };
            peserta_didik: {
                nama: string;
                nisn: string;
                foto: string;
                rombongan_belajar: {
                    nama: string;
                };
            };
            ptk: {
                nama: string;
            };
        } & {
            peserta_didik_id: string;
            sekolah_id: string;
            jenis_keluar_id: string;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            mutasi_id: string;
            alasan: string | null;
            bukti: string | null;
            alasan_tolak: string | null;
        })[];
    }>;
    create(req: Request, data: {
        peserta_didik_id: string;
        jenis_keluar_id: string;
        alasan?: string;
    }, file?: Express.Multer.File): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik_id: string;
            sekolah_id: string;
            jenis_keluar_id: string;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            mutasi_id: string;
            alasan: string | null;
            bukti: string | null;
            alasan_tolak: string | null;
        };
    }>;
    approve(req: Request, id: string): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik_id: string;
            sekolah_id: string;
            jenis_keluar_id: string;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            mutasi_id: string;
            alasan: string | null;
            bukti: string | null;
            alasan_tolak: string | null;
        };
    }>;
    reject(req: Request, id: string, body: {
        alasan_tolak: string;
    }): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik_id: string;
            sekolah_id: string;
            jenis_keluar_id: string;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            mutasi_id: string;
            alasan: string | null;
            bukti: string | null;
            alasan_tolak: string | null;
        };
    }>;
}
