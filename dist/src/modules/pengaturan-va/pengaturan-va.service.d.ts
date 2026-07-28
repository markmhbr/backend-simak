import { PrismaService } from '../../core/prisma/prisma.service';
import { UpdatePengaturanVaDto } from './dto/update-pengaturan-va.dto';
export declare class PengaturanVaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getSettings(sekolahId: string): Promise<{
        sekolah_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        mode: string;
        client_id: string | null;
        secret_key: string | null;
        private_key: string | null;
        bjb_public_key: string | null;
        api_url: string | null;
        pengaturan_va_id: string;
    } | {
        sekolah_id: string;
        is_active: boolean;
        client_id: any;
        secret_key: any;
        private_key: any;
        bjb_public_key: any;
        api_url: any;
        mode: string;
    }>;
    updateSettings(sekolahId: string, data: UpdatePengaturanVaDto): Promise<{
        sekolah_id: string;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        mode: string;
        client_id: string | null;
        secret_key: string | null;
        private_key: string | null;
        bjb_public_key: string | null;
        api_url: string | null;
        pengaturan_va_id: string;
    }>;
}
