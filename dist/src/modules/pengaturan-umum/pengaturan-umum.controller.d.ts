import { PengaturanUmumService } from './pengaturan-umum.service';
export declare class PengaturanUmumController {
    private readonly service;
    constructor(service: PengaturanUmumService);
    getSettings(sekolahId: string): Promise<{
        status: string;
        data: {
            create_date: Date;
            last_update: Date;
            sekolah_id: string;
            pengaturan_umum_id: string;
            background_gtk: string | null;
            background_pd: string | null;
            waktu_mulai_pengajuan: string | null;
            waktu_sampai_pengajuan: string | null;
        } | {
            sekolah_id: string;
            background_gtk: any;
            background_pd: any;
            waktu_mulai_pengajuan: any;
            waktu_sampai_pengajuan: any;
        };
    }>;
    updateSettings(sekolahId: string, body: {
        background_gtk?: string | null;
        background_pd?: string | null;
        waktu_mulai_pengajuan?: string | null;
        waktu_sampai_pengajuan?: string | null;
    }): Promise<{
        status: string;
        message: string;
        data: {
            create_date: Date;
            last_update: Date;
            sekolah_id: string;
            pengaturan_umum_id: string;
            background_gtk: string | null;
            background_pd: string | null;
            waktu_mulai_pengajuan: string | null;
            waktu_sampai_pengajuan: string | null;
        };
    }>;
}
