import { PrismaService } from '../../core/prisma/prisma.service';
export declare class PengajuanPerbaikanService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    buatPengajuan(sekolahId: string, payload: {
        ptk_id?: string;
        peserta_didik_id?: string;
        tipe: 'GTK' | 'SISWA';
        perubahan: any;
    }): Promise<{
        peserta_didik_id: string | null;
        sekolah_id: string;
        status: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        id: string;
        tipe: string;
        perubahan: import("@prisma/client/runtime/client").JsonValue;
    }>;
    dapatkanDaftar(sekolahId: string): Promise<{
        nama: string;
        peserta_didik_id: string | null;
        sekolah_id: string;
        status: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        id: string;
        tipe: string;
        perubahan: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    setujuiPengajuan(sekolahId: string, id: string): Promise<{
        status: string;
        message: string;
    }>;
    tolakPengajuan(sekolahId: string, id: string): Promise<{
        status: string;
        message: string;
    }>;
    dapatkanPerbaikanDisetujui(sekolahId: string): Promise<({
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
    clearPerbaikanDisetujui(sekolahId: string, ids?: string[]): Promise<{
        status: string;
        message: string;
    }>;
}
