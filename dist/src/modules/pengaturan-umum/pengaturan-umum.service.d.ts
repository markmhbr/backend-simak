import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
export declare class PengaturanUmumService implements OnModuleInit {
    private readonly prisma;
    constructor(prisma: PrismaService);
    onModuleInit(): Promise<void>;
    getSettings(sekolahId: string): Promise<{
        sekolah_id: string;
        create_date: Date;
        last_update: Date;
        pengaturan_umum_id: string;
        background_gtk: string | null;
        background_pd: string | null;
        waktu_mulai_pengajuan: string | null;
        waktu_sampai_pengajuan: string | null;
        mode_presensi_guru: number | null;
    } | {
        sekolah_id: string;
        background_gtk: any;
        background_pd: any;
        waktu_mulai_pengajuan: any;
        waktu_sampai_pengajuan: any;
        mode_presensi_guru: number;
    }>;
    updateSettings(sekolahId: string, data: {
        background_gtk?: string | null;
        background_pd?: string | null;
        waktu_mulai_pengajuan?: string | null;
        waktu_sampai_pengajuan?: string | null;
        mode_presensi_guru?: number | null;
    }): Promise<{
        sekolah_id: string;
        create_date: Date;
        last_update: Date;
        pengaturan_umum_id: string;
        background_gtk: string | null;
        background_pd: string | null;
        waktu_mulai_pengajuan: string | null;
        waktu_sampai_pengajuan: string | null;
        mode_presensi_guru: number | null;
    }>;
}
