import { PrismaService } from '../../core/prisma/prisma.service';
export declare class MutasiPdService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getReferenceJenisKeluar(): Promise<{
        jenis_keluar_id: string;
        ket_keluar: string;
    }[]>;
    getMutasiPdList(sekolahId: string): Promise<({
        peserta_didik: {
            foto: string;
            nama: string;
            nisn: string;
            rombongan_belajar: {
                nama: string;
            };
        };
        jenis_keluar: {
            ket_keluar: string;
        };
        ptk: {
            nama: string;
        };
    } & {
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string;
        jenis_keluar_id: string;
        status: number;
        mutasi_id: string;
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
        ptk_id: string | null;
        peserta_didik_id: string;
        jenis_keluar_id: string;
        status: number;
        mutasi_id: string;
        alasan: string | null;
        bukti: string | null;
        alasan_tolak: string | null;
    }>;
    approveMutasiPd(sekolahId: string, mutasiId: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string;
        jenis_keluar_id: string;
        status: number;
        mutasi_id: string;
        alasan: string | null;
        bukti: string | null;
        alasan_tolak: string | null;
    }>;
    rejectMutasiPd(sekolahId: string, mutasiId: string, alasanTolak: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string;
        jenis_keluar_id: string;
        status: number;
        mutasi_id: string;
        alasan: string | null;
        bukti: string | null;
        alasan_tolak: string | null;
    }>;
}
