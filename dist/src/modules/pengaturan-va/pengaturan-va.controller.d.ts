import { PengaturanVaService } from './pengaturan-va.service';
import { UpdatePengaturanVaDto } from './dto/update-pengaturan-va.dto';
export declare class PengaturanVaController {
    private readonly service;
    constructor(service: PengaturanVaService);
    getSettings(sekolahId: string): Promise<{
        status: string;
        data: {
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
        };
    }>;
    updateSettings(sekolahId: string, body: UpdatePengaturanVaDto): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
}
