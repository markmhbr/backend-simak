import { PengajuanPerbaikanService } from './pengajuan-perbaikan.service';
import type { Request } from 'express';
export declare class PengajuanPerbaikanController {
    private readonly service;
    constructor(service: PengajuanPerbaikanService);
    private getSekolahId;
    buatPengajuan(req: Request, body: any): Promise<{
        id: string;
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: string;
        tipe: string;
        perubahan: import("@prisma/client/runtime/client").JsonValue;
    }>;
    dapatkanPerbaikanDisetujui(req: Request): Promise<({
        id: string;
        sekolah_id: string;
        tipe: string;
        ptk_id: string;
        updates: any;
        updated_at: Date;
        peserta_didik_id?: undefined;
    } | {
        id: string;
        sekolah_id: string;
        tipe: string;
        peserta_didik_id: string;
        updates: any;
        updated_at: Date;
        ptk_id?: undefined;
    })[]>;
    clearPerbaikanDisetujui(req: Request, body: {
        ids?: string[];
    }): Promise<{
        status: string;
        message: string;
    }>;
    dapatkanDaftar(req: Request): Promise<{
        nama: string;
        id: string;
        sekolah_id: string;
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
