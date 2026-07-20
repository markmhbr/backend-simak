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
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        ptk_id: string | null;
        peserta_didik_id: string;
        jenis_keluar_id: string;
        status: number;
        alasan_tolak: string | null;
        mutasi_id: string;
        alasan: string | null;
        bukti: string | null;
    })[]>;
    createMutasiPd(sekolahId: string, data: {
        peserta_didik_id: string;
        jenis_keluar_id: string;
        alasan?: string;
    }, ptkId: string | null, file?: Express.Multer.File): Promise<{
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        ptk_id: string | null;
        peserta_didik_id: string;
        jenis_keluar_id: string;
        status: number;
        alasan_tolak: string | null;
        mutasi_id: string;
        alasan: string | null;
        bukti: string | null;
    }>;
    approveMutasiPd(sekolahId: string, mutasiId: string): Promise<{
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        ptk_id: string | null;
        peserta_didik_id: string;
        jenis_keluar_id: string;
        status: number;
        alasan_tolak: string | null;
        mutasi_id: string;
        alasan: string | null;
        bukti: string | null;
    }>;
    rejectMutasiPd(sekolahId: string, mutasiId: string, alasanTolak: string): Promise<{
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        ptk_id: string | null;
        peserta_didik_id: string;
        jenis_keluar_id: string;
        status: number;
        alasan_tolak: string | null;
        mutasi_id: string;
        alasan: string | null;
        bukti: string | null;
    }>;
}
