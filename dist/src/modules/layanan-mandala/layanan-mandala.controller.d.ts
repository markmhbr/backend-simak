import { LayananMandalaService } from './layanan-mandala.service';
import { CreateLayananDto, CreateLayananSyaratDto, CreatePermohonanLayananDto, UpdatePermohonanStatusDto } from './dto/layanan-mandala.dto';
import type { Request } from 'express';
export declare class LayananMandalaController {
    private readonly layananMandalaService;
    constructor(layananMandalaService: LayananMandalaService);
    createLayanan(req: Request, dto: CreateLayananDto): Promise<{
        status: string;
        data: {
            created_at: Date;
            updated_at: Date;
            cadisdik_id: string | null;
            aktif: boolean;
            layanan_id: string;
            nama_layanan: string;
            kategori: number;
        };
    }>;
    getLayanan(req: Request, kategori?: string): Promise<{
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
            cadisdik_id: string | null;
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
            cadisdik_id: string | null;
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
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            cadisdik_id: string | null;
            layanan_id: string;
            kategori: number;
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
                status: number;
                created_at: Date;
                pegawai_id: string;
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
                status: number;
                created_at: Date;
                updated_at: Date;
                layanan_syarat_id: string | null;
                permohonan_layanan_id: string;
                catatan: string | null;
                permohonan_layanan_file_id: string;
                jenis_file: number;
                nama_file: string | null;
                file_url: string | null;
            })[];
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            cadisdik_id: string | null;
            layanan_id: string;
            kategori: number;
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
                status: number;
                created_at: Date;
                pegawai_id: string;
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
                status: number;
                created_at: Date;
                updated_at: Date;
                layanan_syarat_id: string | null;
                permohonan_layanan_id: string;
                catatan: string | null;
                permohonan_layanan_file_id: string;
                jenis_file: number;
                nama_file: string | null;
                file_url: string | null;
            })[];
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            cadisdik_id: string | null;
            layanan_id: string;
            kategori: number;
            permohonan_layanan_id: string;
            nomor_permohonan: string | null;
            tanggal_pengajuan: Date | null;
        };
    }>;
    updateStatus(id: string, dto: UpdatePermohonanStatusDto): Promise<{
        status: string;
        message: string;
        data: {
            peserta_didik_id: string | null;
            sekolah_id: string;
            keterangan: string | null;
            status: number;
            created_at: Date;
            updated_at: Date;
            ptk_id: string | null;
            cadisdik_id: string | null;
            layanan_id: string;
            kategori: number;
            permohonan_layanan_id: string;
            nomor_permohonan: string | null;
            tanggal_pengajuan: Date | null;
        };
    }>;
    uploadFile(id: string, file: Express.Multer.File, body: any): Promise<{
        status: string;
        message: string;
        data: {
            status: number;
            created_at: Date;
            updated_at: Date;
            layanan_syarat_id: string | null;
            permohonan_layanan_id: string;
            catatan: string | null;
            permohonan_layanan_file_id: string;
            jenis_file: number;
            nama_file: string | null;
            file_url: string | null;
        };
    }>;
    updateFileStatus(fileId: string, body: {
        status: number;
        catatan?: string;
    }): Promise<{
        status: string;
        message: string;
        data: {
            status: number;
            created_at: Date;
            updated_at: Date;
            layanan_syarat_id: string | null;
            permohonan_layanan_id: string;
            catatan: string | null;
            permohonan_layanan_file_id: string;
            jenis_file: number;
            nama_file: string | null;
            file_url: string | null;
        };
    }>;
}
