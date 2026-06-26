import { PrismaService } from '../../core/prisma/prisma.service';
import { AppKeyService } from '../../core/app-key/app-key.service';
export declare class SyncService {
    private readonly prisma;
    private readonly appKeyService;
    private readonly logger;
    constructor(prisma: PrismaService, appKeyService: AppKeyService);
    validateAndRegisterDomain(key: string, domain: string): Promise<{
        nama_app: string;
        sekolah_id: string;
    }>;
    private parseDate;
    private parseNumber;
    syncSekolah(sekolahId: string, dataRows: any[], rawApiKey?: string): Promise<{
        successCount: number;
    }>;
    syncRombel(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
    syncPesertaDidik(sekolahId: string, dataRows: any[]): Promise<{
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
    syncDudi(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
    syncRwySertifikat(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
    syncPembelajaran(sekolahId: string, dataRows: any[]): Promise<{
        successCount: number;
    }>;
}
