import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateLayananDto, CreateLayananSyaratDto, CreatePermohonanLayananDto, CreatePermohonanLayananFileDto, UpdatePermohonanStatusDto } from './dto/layanan-mandala.dto';
export declare class LayananMandalaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createLayanan(dto: CreateLayananDto): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        layanan_id: string;
        nama_layanan: string;
        kategori: number;
    }>;
    getLayanan(kategori?: number): Promise<({
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
        aktif: boolean;
        layanan_id: string;
        nama_layanan: string;
        kategori: number;
    })[]>;
    updateLayanan(id: string, dto: Partial<CreateLayananDto>): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        layanan_id: string;
        nama_layanan: string;
        kategori: number;
    }>;
    deleteLayanan(id: string): Promise<{
        created_at: Date;
        updated_at: Date;
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
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        layanan_id: string;
        kategori: number;
        nomor_permohonan: string | null;
        permohonan_layanan_id: string;
        tanggal_pengajuan: Date | null;
    }>;
    getPermohonan(filters: {
        sekolah_id?: string;
        status?: number;
        kategori?: number;
    }): Promise<({
        layanan: {
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            layanan_id: string;
            nama_layanan: string;
            kategori: number;
        };
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
            jenis_file: number;
            nama_file: string | null;
            file_url: string | null;
            catatan: string | null;
            permohonan_layanan_id: string;
            permohonan_layanan_file_id: string;
        })[];
        permohonan_layanan_log: ({
            pegawai: {
                nama_lengkap: string;
            };
        } & {
            created_at: Date;
            status: number;
            pegawai_id: string;
            catatan: string | null;
            permohonan_layanan_id: string;
            permohonan_layanan_log_id: string;
        })[];
    } & {
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        layanan_id: string;
        kategori: number;
        nomor_permohonan: string | null;
        permohonan_layanan_id: string;
        tanggal_pengajuan: Date | null;
    })[]>;
    getPermohonanById(id: string): Promise<{
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
            aktif: boolean;
            layanan_id: string;
            nama_layanan: string;
            kategori: number;
        };
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
            jenis_file: number;
            nama_file: string | null;
            file_url: string | null;
            catatan: string | null;
            permohonan_layanan_id: string;
            permohonan_layanan_file_id: string;
        })[];
        permohonan_layanan_log: ({
            pegawai: {
                nama_lengkap: string;
            };
        } & {
            created_at: Date;
            status: number;
            pegawai_id: string;
            catatan: string | null;
            permohonan_layanan_id: string;
            permohonan_layanan_log_id: string;
        })[];
    } & {
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        layanan_id: string;
        kategori: number;
        nomor_permohonan: string | null;
        permohonan_layanan_id: string;
        tanggal_pengajuan: Date | null;
    }>;
    updatePermohonanStatus(id: string, dto: UpdatePermohonanStatusDto): Promise<{
        created_at: Date;
        updated_at: Date;
        sekolah_id: string;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        layanan_id: string;
        kategori: number;
        nomor_permohonan: string | null;
        permohonan_layanan_id: string;
        tanggal_pengajuan: Date | null;
    }>;
    uploadFile(id: string, dto: CreatePermohonanLayananFileDto): Promise<{
        created_at: Date;
        updated_at: Date;
        status: number;
        layanan_syarat_id: string | null;
        jenis_file: number;
        nama_file: string | null;
        file_url: string | null;
        catatan: string | null;
        permohonan_layanan_id: string;
        permohonan_layanan_file_id: string;
    }>;
    updateFileStatus(fileId: string, status: number, catatan?: string): Promise<{
        created_at: Date;
        updated_at: Date;
        status: number;
        layanan_syarat_id: string | null;
        jenis_file: number;
        nama_file: string | null;
        file_url: string | null;
        catatan: string | null;
        permohonan_layanan_id: string;
        permohonan_layanan_file_id: string;
    }>;
}
