import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateLayananDto, CreateLayananSyaratDto, CreatePermohonanLayananDto, CreatePermohonanLayananFileDto, UpdatePermohonanStatusDto } from './dto/layanan-mandala.dto';
export declare class LayananMandalaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createLayanan(dto: CreateLayananDto, defaultCadisdikId?: string): Promise<{
        cadisdik_id: string | null;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori: number;
        layanan_id: string;
        nama_layanan: string;
    }>;
    getLayanan(cadisdikId: string, kategori?: number): Promise<({
        syarat: {
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            urutan: number;
            layanan_id: string;
            layanan_syarat_id: string;
            nama_syarat: string;
            wajib: boolean;
        }[];
    } & {
        cadisdik_id: string | null;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori: number;
        layanan_id: string;
        nama_layanan: string;
    })[]>;
    updateLayanan(id: string, dto: Partial<CreateLayananDto>): Promise<{
        cadisdik_id: string | null;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori: number;
        layanan_id: string;
        nama_layanan: string;
    }>;
    deleteLayanan(id: string): Promise<{
        cadisdik_id: string | null;
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori: number;
        layanan_id: string;
        nama_layanan: string;
    }>;
    createSyarat(layananId: string, dto: CreateLayananSyaratDto): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        urutan: number;
        layanan_id: string;
        layanan_syarat_id: string;
        nama_syarat: string;
        wajib: boolean;
    }>;
    updateSyarat(id: string, dto: Partial<CreateLayananSyaratDto>): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        urutan: number;
        layanan_id: string;
        layanan_syarat_id: string;
        nama_syarat: string;
        wajib: boolean;
    }>;
    deleteSyarat(id: string): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        urutan: number;
        layanan_id: string;
        layanan_syarat_id: string;
        nama_syarat: string;
        wajib: boolean;
    }>;
    getSyaratByLayanan(layananId: string): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        urutan: number;
        layanan_id: string;
        layanan_syarat_id: string;
        nama_syarat: string;
        wajib: boolean;
    }[]>;
    createPermohonan(dto: CreatePermohonanLayananDto): Promise<{
        sekolah_id: string;
        cadisdik_id: string | null;
        created_at: Date;
        updated_at: Date;
        keterangan: string | null;
        peserta_didik_id: string | null;
        ptk_id: string | null;
        kategori: number;
        status: number;
        layanan_id: string;
        permohonan_layanan_id: string;
        nomor_permohonan: string | null;
        tanggal_pengajuan: Date | null;
    }>;
    getPermohonan(filters: {
        cadisdik_id?: string;
        sekolah_id?: string;
        status?: number;
        kategori?: number;
    }): Promise<{
        sekolah: any;
        ptk: any;
        peserta_didik: any;
        layanan: {
            cadisdik_id: string | null;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            layanan_id: string;
            nama_layanan: string;
        };
        permohonan_layanan_log: ({
            pegawai: {
                nama_lengkap: string;
            };
        } & {
            pegawai_id: string;
            created_at: Date;
            status: number;
            permohonan_layanan_id: string;
            permohonan_layanan_log_id: string;
            catatan: string | null;
        })[];
        permohonan_layanan_file: ({
            layanan_syarat: {
                created_at: Date;
                updated_at: Date;
                aktif: boolean;
                urutan: number;
                layanan_id: string;
                layanan_syarat_id: string;
                nama_syarat: string;
                wajib: boolean;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            status: number;
            file_url: string | null;
            permohonan_layanan_id: string;
            nama_file: string | null;
            catatan: string | null;
            layanan_syarat_id: string | null;
            permohonan_layanan_file_id: string;
            jenis_file: number;
        })[];
        sekolah_id: string;
        cadisdik_id: string | null;
        created_at: Date;
        updated_at: Date;
        keterangan: string | null;
        peserta_didik_id: string | null;
        ptk_id: string | null;
        kategori: number;
        status: number;
        layanan_id: string;
        permohonan_layanan_id: string;
        nomor_permohonan: string | null;
        tanggal_pengajuan: Date | null;
    }[]>;
    getPermohonanById(id: string): Promise<{
        sekolah: any;
        ptk: any;
        peserta_didik: any;
        layanan: {
            syarat: {
                created_at: Date;
                updated_at: Date;
                aktif: boolean;
                urutan: number;
                layanan_id: string;
                layanan_syarat_id: string;
                nama_syarat: string;
                wajib: boolean;
            }[];
        } & {
            cadisdik_id: string | null;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            layanan_id: string;
            nama_layanan: string;
        };
        permohonan_layanan_log: ({
            pegawai: {
                nama_lengkap: string;
            };
        } & {
            pegawai_id: string;
            created_at: Date;
            status: number;
            permohonan_layanan_id: string;
            permohonan_layanan_log_id: string;
            catatan: string | null;
        })[];
        permohonan_layanan_file: ({
            layanan_syarat: {
                created_at: Date;
                updated_at: Date;
                aktif: boolean;
                urutan: number;
                layanan_id: string;
                layanan_syarat_id: string;
                nama_syarat: string;
                wajib: boolean;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            status: number;
            file_url: string | null;
            permohonan_layanan_id: string;
            nama_file: string | null;
            catatan: string | null;
            layanan_syarat_id: string | null;
            permohonan_layanan_file_id: string;
            jenis_file: number;
        })[];
        sekolah_id: string;
        cadisdik_id: string | null;
        created_at: Date;
        updated_at: Date;
        keterangan: string | null;
        peserta_didik_id: string | null;
        ptk_id: string | null;
        kategori: number;
        status: number;
        layanan_id: string;
        permohonan_layanan_id: string;
        nomor_permohonan: string | null;
        tanggal_pengajuan: Date | null;
    }>;
    updatePermohonanStatus(id: string, dto: UpdatePermohonanStatusDto): Promise<{
        sekolah_id: string;
        cadisdik_id: string | null;
        created_at: Date;
        updated_at: Date;
        keterangan: string | null;
        peserta_didik_id: string | null;
        ptk_id: string | null;
        kategori: number;
        status: number;
        layanan_id: string;
        permohonan_layanan_id: string;
        nomor_permohonan: string | null;
        tanggal_pengajuan: Date | null;
    }>;
    uploadFile(id: string, dto: CreatePermohonanLayananFileDto, file: Express.Multer.File): Promise<{
        created_at: Date;
        updated_at: Date;
        status: number;
        file_url: string | null;
        permohonan_layanan_id: string;
        nama_file: string | null;
        catatan: string | null;
        layanan_syarat_id: string | null;
        permohonan_layanan_file_id: string;
        jenis_file: number;
    }>;
    updateFileStatus(fileId: string, status: number, catatan?: string): Promise<{
        created_at: Date;
        updated_at: Date;
        status: number;
        file_url: string | null;
        permohonan_layanan_id: string;
        nama_file: string | null;
        catatan: string | null;
        layanan_syarat_id: string | null;
        permohonan_layanan_file_id: string;
        jenis_file: number;
    }>;
}
