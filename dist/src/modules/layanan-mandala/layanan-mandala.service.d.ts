import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateLayananDto, CreateLayananSyaratDto, CreatePermohonanLayananDto, CreatePermohonanLayananFileDto, UpdatePermohonanStatusDto } from './dto/layanan-mandala.dto';
export declare class LayananMandalaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createLayanan(dto: CreateLayananDto): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori: number;
        nama_layanan: string;
        layanan_id: string;
    }>;
    getLayanan(kategori?: number): Promise<({
        syarat: {
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            urutan: number;
            nama_syarat: string;
            wajib: boolean;
            layanan_id: string;
            layanan_syarat_id: string;
        }[];
    } & {
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori: number;
        nama_layanan: string;
        layanan_id: string;
    })[]>;
    updateLayanan(id: string, dto: Partial<CreateLayananDto>): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        kategori: number;
        nama_layanan: string;
        layanan_id: string;
    }>;
    createSyarat(layananId: string, dto: CreateLayananSyaratDto): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        urutan: number;
        nama_syarat: string;
        wajib: boolean;
        layanan_id: string;
        layanan_syarat_id: string;
    }>;
    getSyaratByLayanan(layananId: string): Promise<{
        created_at: Date;
        updated_at: Date;
        aktif: boolean;
        urutan: number;
        nama_syarat: string;
        wajib: boolean;
        layanan_id: string;
        layanan_syarat_id: string;
    }[]>;
    createPermohonan(dto: CreatePermohonanLayananDto): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        kategori: number;
        layanan_id: string;
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
            kategori: number;
            nama_layanan: string;
            layanan_id: string;
        };
        permohonan_layanan_file: {
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
        }[];
    } & {
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        kategori: number;
        layanan_id: string;
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
                urutan: number;
                nama_syarat: string;
                wajib: boolean;
                layanan_id: string;
                layanan_syarat_id: string;
            }[];
        } & {
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            nama_layanan: string;
            layanan_id: string;
        };
        permohonan_layanan_log: ({
            pegawai: {
                created_at: Date;
                updated_at: Date;
                password: string;
                email: string;
                nomor_telepon: string | null;
                cadisdik_id: string;
                jenis_kelamin: number;
                tempat_lahir: string | null;
                tanggal_lahir: Date | null;
                nik: string | null;
                nip: string;
                foto: string | null;
                aktif: boolean;
                pegawai_id: string;
                nama_lengkap: string;
                alamat_lengkap: string | null;
                authenticator_secret: string | null;
                jabatan: number;
            };
        } & {
            created_at: Date;
            status: number;
            pegawai_id: string;
            catatan: string | null;
            permohonan_layanan_id: string;
            permohonan_layanan_log_id: string;
        })[];
        permohonan_layanan_file: {
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
        }[];
    } & {
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        kategori: number;
        layanan_id: string;
        nomor_permohonan: string | null;
        permohonan_layanan_id: string;
        tanggal_pengajuan: Date | null;
    }>;
    updatePermohonanStatus(id: string, dto: UpdatePermohonanStatusDto): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        ptk_id: string | null;
        peserta_didik_id: string | null;
        status: number;
        keterangan: string | null;
        kategori: number;
        layanan_id: string;
        nomor_permohonan: string | null;
        permohonan_layanan_id: string;
        tanggal_pengajuan: Date | null;
    }>;
    uploadFile(permohonanId: string, dto: CreatePermohonanLayananFileDto): Promise<{
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
