import { PrismaService } from '../prisma/prisma.service';
export declare class AppKeyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSecureToken;
    validateApiKey(keyApi: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
    }>;
    findByDomain(domain: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
    }>;
    createKey(namaApp: string, sekolahId: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
    }>;
    updateWebServiceKey(sekolahId: string, keyWs: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
    }>;
    updateAdminPanelKey(sekolahId: string, keyAdm: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
    }>;
    getAllKeys(): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
    }[]>;
    regenerateKeys(id: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
    }>;
    toggleActive(id: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
    }>;
}
