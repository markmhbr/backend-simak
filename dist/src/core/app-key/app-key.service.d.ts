import { PrismaService } from '../prisma/prisma.service';
export declare class AppKeyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSecureToken;
    validateApiKey(keyApi: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    findByDomain(domain: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    createKey(namaApp: string, sekolahId: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    updateWebServiceKey(sekolahId: string, keyWs: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    updateAdminPanelKey(sekolahId: string, keyAdm: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    getAllKeys(): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }[]>;
    regenerateKeys(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    updateSchoolDomain(sekolahId: string, domain: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    toggleActive(id: string): Promise<{
        id: string;
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
}
