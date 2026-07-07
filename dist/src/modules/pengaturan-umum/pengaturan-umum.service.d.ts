import { PrismaService } from '../../core/prisma/prisma.service';
export declare class PengaturanUmumService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(sekolahId: string): Promise<{
        create_date: Date;
        last_update: Date;
        sekolah_id: string;
        pengaturan_umum_id: string;
        background_gtk: string | null;
        background_pd: string | null;
        waktu_mulai_pengajuan: string | null;
        waktu_sampai_pengajuan: string | null;
    } | {
        sekolah_id: string;
        background_gtk: any;
        background_pd: any;
        waktu_mulai_pengajuan: any;
        waktu_sampai_pengajuan: any;
    }>;
    updateSettings(sekolahId: string, data: {
        background_gtk?: string | null;
        background_pd?: string | null;
        waktu_mulai_pengajuan?: string | null;
        waktu_sampai_pengajuan?: string | null;
    }): Promise<{
        create_date: Date;
        last_update: Date;
        sekolah_id: string;
        pengaturan_umum_id: string;
        background_gtk: string | null;
        background_pd: string | null;
        waktu_mulai_pengajuan: string | null;
        waktu_sampai_pengajuan: string | null;
    }>;
}
