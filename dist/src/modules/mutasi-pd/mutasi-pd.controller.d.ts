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
            peserta_didik: {
                foto: string;
                nama: string;
                nisn: string;
                rombongan_belajar: {
                    nama: string;
                };
            };
            jenis_keluar: {
                ket_keluar: string;
            };
            ptk: {
                nama: string;
            };
        } & {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string;
            jenis_keluar_id: string;
            status: number;
            alasan_tolak: string | null;
            mutasi_id: string;
            alasan: string | null;
            bukti: string | null;
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
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string;
            jenis_keluar_id: string;
            status: number;
            alasan_tolak: string | null;
            mutasi_id: string;
            alasan: string | null;
            bukti: string | null;
        };
    }>;
    approve(req: Request, id: string): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string;
            jenis_keluar_id: string;
            status: number;
            alasan_tolak: string | null;
            mutasi_id: string;
            alasan: string | null;
            bukti: string | null;
        };
    }>;
    reject(req: Request, id: string, body: {
        alasan_tolak: string;
    }): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            peserta_didik_id: string;
            jenis_keluar_id: string;
            status: number;
            alasan_tolak: string | null;
            mutasi_id: string;
            alasan: string | null;
            bukti: string | null;
        };
    }>;
}
