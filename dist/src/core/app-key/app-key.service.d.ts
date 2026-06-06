import { PrismaService } from '../prisma/prisma.service';
export declare class AppKeyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSecureToken;
    validateApiKey(keyApi: string): Promise<{
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    findByDomain(domain: string): Promise<{
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    createKey(namaApp: string, sekolahId: string): Promise<{
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    updateWebServiceKey(sekolahId: string, keyWs: string): Promise<{
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    updateAdminPanelKey(sekolahId: string, keyAdm: string): Promise<{
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    getAllKeys(): Promise<{
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }[]>;
    regenerateKeys(id: string): Promise<{
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
    toggleActive(id: string): Promise<{
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
    }>;
}
