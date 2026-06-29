import { PengajuanPerbaikanService } from './pengajuan-perbaikan.service';
import type { Request } from 'express';
export declare class PengajuanPerbaikanController {
    private readonly service;
    constructor(service: PengajuanPerbaikanService);
    private getSekolahId;
    buatPengajuan(req: Request, body: any): Promise<{
        sekolah_id: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: string;
        tipe: string;
        perubahan: import("@prisma/client/runtime/client").JsonValue;
    }>;
    dapatkanDaftar(req: Request): Promise<{
        nama: string;
        sekolah_id: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: string;
        tipe: string;
        perubahan: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    setujuiPengajuan(req: Request, id: string): Promise<{
        status: string;
        message: string;
    }>;
    tolakPengajuan(req: Request, id: string): Promise<{
        status: string;
        message: string;
    }>;
}
