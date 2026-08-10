import { LayananMandalaService } from './layanan-mandala.service';
import { CreateLayananDto, CreateLayananSyaratDto, CreatePermohonanLayananDto, UpdatePermohonanStatusDto } from './dto/layanan-mandala.dto';
import type { Request } from 'express';
export declare class LayananMandalaController {
    private readonly layananMandalaService;
    constructor(layananMandalaService: LayananMandalaService);
    createLayanan(req: Request, dto: CreateLayananDto): Promise<{
        status: string;
        data: {
            cadisdik_id: string | null;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            layanan_id: string;
            nama_layanan: string;
        };
    }>;
    getLayanan(req: Request, kategori?: string): Promise<{
        status: string;
        data: ({
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
        })[];
    }>;
    updateLayanan(id: string, dto: Partial<CreateLayananDto>): Promise<{
        status: string;
        data: {
            cadisdik_id: string | null;
            created_at: Date;
            updated_at: Date;
            aktif: boolean;
            kategori: number;
            layanan_id: string;
            nama_layanan: string;
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
            urutan: number;
            layanan_id: string;
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
            urutan: number;
            layanan_id: string;
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
            urutan: number;
            layanan_id: string;
            layanan_syarat_id: string;
            nama_syarat: string;
            wajib: boolean;
        }[];
    }>;
    createPermohonan(dto: CreatePermohonanLayananDto): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
    getPermohonan(req: Request, sekolahId?: string, status?: string, kategori?: string): Promise<{
        status: string;
        data: {
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
        }[];
    }>;
    getPermohonanById(id: string): Promise<{
        status: string;
        data: {
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
        };
    }>;
    updateStatus(id: string, dto: UpdatePermohonanStatusDto): Promise<{
        status: string;
        message: string;
        data: {
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
        };
    }>;
    uploadFile(id: string, file: Express.Multer.File, body: any): Promise<{
        status: string;
        message: string;
        data: {
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
            file_url: string | null;
            permohonan_layanan_id: string;
            nama_file: string | null;
            catatan: string | null;
            layanan_syarat_id: string | null;
            permohonan_layanan_file_id: string;
            jenis_file: number;
        };
    }>;
}
