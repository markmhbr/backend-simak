import { PengaturanUmumService } from './pengaturan-umum.service';
export declare class PengaturanUmumController {
    private readonly service;
    constructor(service: PengaturanUmumService);
    getSettings(sekolahId: string): Promise<{
        status: string;
        data: {
            sekolah_id: string;
            create_date: Date;
            last_update: Date;
            pengaturan_umum_id: string;
            background_gtk: string | null;
            background_pd: string | null;
            waktu_mulai_pengajuan: string | null;
            waktu_sampai_pengajuan: string | null;
            mode_presensi_guru: number | null;
        } | {
            sekolah_id: string;
            background_gtk: any;
            background_pd: any;
            waktu_mulai_pengajuan: any;
            waktu_sampai_pengajuan: any;
            mode_presensi_guru: number;
        };
    }>;
    updateSettings(sekolahId: string, body: {
        background_gtk?: string | null;
        background_pd?: string | null;
        waktu_mulai_pengajuan?: string | null;
        waktu_sampai_pengajuan?: string | null;
        mode_presensi_guru?: number | null;
    }): Promise<{
        status: string;
        message: string;
        data: {
            sekolah_id: string;
            create_date: Date;
            last_update: Date;
            pengaturan_umum_id: string;
            background_gtk: string | null;
            background_pd: string | null;
            waktu_mulai_pengajuan: string | null;
            waktu_sampai_pengajuan: string | null;
            mode_presensi_guru: number | null;
        };
    }>;
}
