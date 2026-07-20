import { PrismaService } from '../prisma/prisma.service';
export declare class AppKeyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSecureToken;
    validateApiKey(keyApi: string): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    findByDomain(domain: string): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    createKey(namaApp: string, sekolahId: string): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    updateWebServiceKey(sekolahId: string, keyWs: string): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    updateAdminPanelKey(sekolahId: string, keyAdm: string): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    getAllKeys(): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }[]>;
    regenerateKeys(id: string): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    updateSchoolDomain(sekolahId: string, domain: string): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    toggleActive(id: string): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
}
