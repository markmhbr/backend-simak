import { SyncService } from './sync.service';
import type { Request } from 'express';
export declare class SyncController {
    private readonly syncService;
    constructor(syncService: SyncService);
    private getSekolahId;
    validateSyncKey(body: {
        key: string;
        domain: string;
    }): Promise<{
        status: string;
        message: string;
        data: {
            nama_app: string;
            sekolah_id: string;
        };
    }>;
    syncSekolah(req: Request, data: any[]): Promise<{
        status: string;
        count: number;
    }>;
    syncRombel(req: Request, data: any[]): Promise<{
        status: string;
        count: number;
    }>;
    syncSiswa(req: Request, data: any[]): Promise<{
        status: string;
        count: number;
    }>;
    syncGtk(req: Request, data: any[]): Promise<{
        status: string;
        count: number;
    }>;
    syncPengguna(req: Request, data: any[]): Promise<{
        status: string;
        count: number;
    }>;
    syncSarpras(req: Request, data: any[]): Promise<{
        status: string;
        count: number;
    }>;
    syncBidangStudi(req: Request, data: any[]): Promise<{
        status: string;
        count: number;
    }>;
    syncLembSertifikasi(req: Request, data: any[]): Promise<{
        status: string;
        count: number;
    }>;
    syncRwySertifikat(req: Request, data: any[]): Promise<{
        status: string;
        count: number;
    }>;
}
