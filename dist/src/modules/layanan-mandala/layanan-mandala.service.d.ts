import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateLayananDto, CreateLayananSyaratDto, CreatePermohonanLayananDto, CreatePermohonanLayananFileDto, UpdatePermohonanStatusDto } from './dto/layanan-mandala.dto';
export declare class LayananMandalaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createLayanan(dto: CreateLayananDto, defaultCadisdikId?: string): Promise<{
        created_at: Date;
        updated_at: Date;
        cadisdik_id: string | null;
        aktif: boolean;
        layanan_id: string;
        nama_layanan: string;
        kategori: number;
    }>;
    getLayanan(cadisdikId: string, kategori?: number): Promise<({
        syarat: {
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            layanan_id: string;
            urutan: number;
            layanan_syarat_id: string;
            nama_syarat: string;
            wajib: boolean;
        }[];
    } & {
        created_at: Date;
        updated_at: Date;
        cadisdik_id: string | null;
        aktif: boolean;
        layanan_id: string;
        nama_layanan: string;
        kategori: number;
    })[]>;
    updateLayanan(id: string, dto: Partial<CreateLayananDto>): Promise<{
        created_at: Date;
        updated_at: Date;
        cadisdik_id: string | null;
        aktif: boolean;
        layanan_id: string;
        nama_layanan: string;
        kategori: number;
    }>;
    deleteLayanan(id: string): Promise<{
        created_at: Date;
        updated_at: Date;
        cadisdik_id: string | null;
        aktif: boolean;
        layanan_id: string;
        nama_layanan: string;
        kategori: number;
    }>;
    createSyarat(layananId: string, dto: CreateLayananSyaratDto): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        layanan_id: string;
        urutan: number;
        layanan_syarat_id: string;
        nama_syarat: string;
        wajib: boolean;
    }>;
    updateSyarat(id: string, dto: Partial<CreateLayananSyaratDto>): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        layanan_id: string;
        urutan: number;
        layanan_syarat_id: string;
        nama_syarat: string;
        wajib: boolean;
    }>;
    deleteSyarat(id: string): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        layanan_id: string;
        urutan: number;
        layanan_syarat_id: string;
        nama_syarat: string;
        wajib: boolean;
    }>;
    getSyaratByLayanan(layananId: string): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        layanan_id: string;
        urutan: number;
        layanan_syarat_id: string;
        nama_syarat: string;
        wajib: boolean;
    }[]>;
    createPermohonan(dto: CreatePermohonanLayananDto): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        cadisdik_id: string | null;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        layanan_id: string;
        kategori: number;
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
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string | null;
            aktif: boolean;
            layanan_id: string;
            nama_layanan: string;
            kategori: number;
        };
        permohonan_layanan_log: ({
            pegawai: {
                nama_lengkap: string;
            };
        } & {
            created_at: Date;
            pegawai_id: string;
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
                layanan_id: string;
                urutan: number;
                layanan_syarat_id: string;
                nama_syarat: string;
                wajib: boolean;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            status: number;
            layanan_syarat_id: string | null;
            permohonan_layanan_id: string;
            catatan: string | null;
            permohonan_layanan_file_id: string;
            jenis_file: number;
            nama_file: string | null;
            file_url: string | null;
        })[];
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        cadisdik_id: string | null;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        layanan_id: string;
        kategori: number;
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
                layanan_id: string;
                urutan: number;
                layanan_syarat_id: string;
                nama_syarat: string;
                wajib: boolean;
            }[];
        } & {
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string | null;
            aktif: boolean;
            layanan_id: string;
            nama_layanan: string;
            kategori: number;
        };
        permohonan_layanan_log: ({
            pegawai: {
                nama_lengkap: string;
            };
        } & {
            created_at: Date;
            pegawai_id: string;
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
                layanan_id: string;
                urutan: number;
                layanan_syarat_id: string;
                nama_syarat: string;
                wajib: boolean;
            };
        } & {
            created_at: Date;
            updated_at: Date;
            status: number;
            layanan_syarat_id: string | null;
            permohonan_layanan_id: string;
            catatan: string | null;
            permohonan_layanan_file_id: string;
            jenis_file: number;
            nama_file: string | null;
            file_url: string | null;
        })[];
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        cadisdik_id: string | null;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        layanan_id: string;
        kategori: number;
        permohonan_layanan_id: string;
        nomor_permohonan: string | null;
        tanggal_pengajuan: Date | null;
    }>;
    updatePermohonanStatus(id: string, dto: UpdatePermohonanStatusDto): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        cadisdik_id: string | null;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        layanan_id: string;
        kategori: number;
        permohonan_layanan_id: string;
        nomor_permohonan: string | null;
        tanggal_pengajuan: Date | null;
    }>;
    uploadFile(id: string, dto: CreatePermohonanLayananFileDto, file: Express.Multer.File): Promise<{
        created_at: Date;
        updated_at: Date;
        status: number;
        layanan_syarat_id: string | null;
        permohonan_layanan_id: string;
        catatan: string | null;
        permohonan_layanan_file_id: string;
        jenis_file: number;
        nama_file: string | null;
        file_url: string | null;
    }>;
    updateFileStatus(fileId: string, status: number, catatan?: string): Promise<{
        created_at: Date;
        updated_at: Date;
        status: number;
        layanan_syarat_id: string | null;
        permohonan_layanan_id: string;
        catatan: string | null;
        permohonan_layanan_file_id: string;
        jenis_file: number;
        nama_file: string | null;
        file_url: string | null;
    }>;
}
