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
    dapatkanDaftar(sekolahId: string): Promise<{
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
    setujuiPengajuan(sekolahId: string, id: string): Promise<{
        status: string;
        message: string;
    }>;
    tolakPengajuan(sekolahId: string, id: string): Promise<{
        status: string;
        message: string;
    }>;
}
