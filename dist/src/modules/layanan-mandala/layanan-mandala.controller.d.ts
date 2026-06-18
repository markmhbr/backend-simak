import { LayananMandalaService } from './layanan-mandala.service';
import { CreateLayananDto, CreateLayananSyaratDto, CreatePermohonanLayananDto, CreatePermohonanLayananFileDto, UpdatePermohonanStatusDto } from './dto/layanan-mandala.dto';
export declare class LayananMandalaController {
    private readonly layananMandalaService;
    constructor(layananMandalaService: LayananMandalaService);
    createLayanan(dto: CreateLayananDto): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            layanan_id: string;
            nama_layanan: string;
            kategori: number;
        };
    }>;
    getLayanan(kategori?: string): Promise<{
        status: string;
        data: ({
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
        })[];
    }>;
    updateLayanan(id: string, dto: Partial<CreateLayananDto>): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            layanan_id: string;
            nama_layanan: string;
            kategori: number;
        };
    }>;
    deleteLayanan(id: string): Promise<{
        status: string;
        message: string;
    }>;
    createSyarat(layananId: string, dto: CreateLayananSyaratDto): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            layanan_id: string;
            urutan: number;
            layanan_syarat_id: string;
            nama_syarat: string;
            wajib: boolean;
        };
    }>;
    updateSyarat(syaratId: string, dto: Partial<CreateLayananSyaratDto>): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            layanan_id: string;
            urutan: number;
            layanan_syarat_id: string;
            nama_syarat: string;
            wajib: boolean;
        };
    }>;
    deleteSyarat(syaratId: string): Promise<{
        status: string;
        message: string;
    }>;
    getSyarat(layananId: string): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            layanan_id: string;
            urutan: number;
            layanan_syarat_id: string;
            nama_syarat: string;
            wajib: boolean;
        }[];
    }>;
    createPermohonan(dto: CreatePermohonanLayananDto): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
    getPermohonan(sekolahId?: string, status?: string, kategori?: string): Promise<{
        status: string;
        data: ({
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
        })[];
    }>;
    getPermohonanById(id: string): Promise<{
        status: string;
        data: {
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
        };
    }>;
    updateStatus(id: string, dto: UpdatePermohonanStatusDto): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
    uploadFile(id: string, dto: CreatePermohonanLayananFileDto): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
    updateFileStatus(fileId: string, body: {
        status: number;
        catatan?: string;
    }): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
}
