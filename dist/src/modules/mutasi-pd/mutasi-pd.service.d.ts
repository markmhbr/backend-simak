import { PrismaService } from '../../core/prisma/prisma.service';
export declare class MutasiPdService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getReferenceJenisKeluar(): Promise<{
        jenis_keluar_id: string;
        ket_keluar: string;
    }[]>;
    getMutasiPdList(sekolahId: string): Promise<({
        jenis_keluar: {
            ket_keluar: string;
        };
        peserta_didik: {
            nama: string;
            nisn: string;
            foto: string;
            rombongan_belajar: {
                nama: string;
            };
        };
        ptk: {
            nama: string;
        };
    } & {
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        peserta_didik_id: string;
        ptk_id: string | null;
        status: number;
        mutasi_id: string;
        jenis_keluar_id: string;
        alasan: string | null;
        bukti: string | null;
        alasan_tolak: string | null;
    })[]>;
    createMutasiPd(sekolahId: string, data: {
        peserta_didik_id: string;
        jenis_keluar_id: string;
        alasan?: string;
    }, ptkId: string | null, file?: Express.Multer.File): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        peserta_didik_id: string;
        ptk_id: string | null;
        status: number;
        mutasi_id: string;
        jenis_keluar_id: string;
        alasan: string | null;
        bukti: string | null;
        alasan_tolak: string | null;
    }>;
    approveMutasiPd(sekolahId: string, mutasiId: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        peserta_didik_id: string;
        ptk_id: string | null;
        status: number;
        mutasi_id: string;
        jenis_keluar_id: string;
        alasan: string | null;
        bukti: string | null;
        alasan_tolak: string | null;
    }>;
    rejectMutasiPd(sekolahId: string, mutasiId: string, alasanTolak: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        peserta_didik_id: string;
        ptk_id: string | null;
        status: number;
        mutasi_id: string;
        jenis_keluar_id: string;
        alasan: string | null;
        bukti: string | null;
        alasan_tolak: string | null;
    }>;
}
