import { PrismaService } from '../prisma/prisma.service';
export declare class AppKeyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private generateSecureToken;
    validateApiKey(keyApi: string): Promise<{
        sekolah_id: string;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        domain: string | null;
    }>;
    findByDomain(domain: string): Promise<{
        sekolah_id: string;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        domain: string | null;
    }>;
    createKey(namaApp: string, sekolahId: string): Promise<{
        sekolah_id: string;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        domain: string | null;
    }>;
    updateWebServiceKey(sekolahId: string, keyWs: string): Promise<{
        sekolah_id: string;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        domain: string | null;
    }>;
    updateAdminPanelKey(sekolahId: string, keyAdm: string): Promise<{
        sekolah_id: string;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        domain: string | null;
    }>;
    getAllKeys(search?: string): Promise<{
        nama_sekolah: string;
        npsn: string;
        sekolah_id: string;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        domain: string | null;
    }[]>;
    regenerateKeys(id: string): Promise<{
        sekolah_id: string;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        domain: string | null;
    }>;
    updateSchoolDomain(sekolahId: string, domain: string): Promise<{
        sekolah_id: string;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        domain: string | null;
    }>;
    toggleActive(id: string): Promise<{
        sekolah_id: string;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        domain: string | null;
    }>;
}
