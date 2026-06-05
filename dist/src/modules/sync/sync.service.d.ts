import { PrismaService } from '../../core/prisma/prisma.service';
export declare class SyncService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private parseDate;
    private parseNumber;
    syncSekolah(sekolahId: string, dataRows: any[], rawApiKey?: string): Promise<{
        successCount: number;
    }>;
    syncRombel(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
    syncSiswa(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
    syncGtk(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
    syncPengguna(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
    syncSarpras(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
    syncBidangStudi(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
    syncLembSertifikasi(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
    syncRwySertifikat(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
}
