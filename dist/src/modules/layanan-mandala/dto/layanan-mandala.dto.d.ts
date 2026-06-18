export declare class CreateLayananDto {
    nama_layanan: string;
    kategori: number;
    aktif?: boolean;
}
export declare class CreateLayananSyaratDto {
    nama_syarat: string;
    wajib?: boolean;
    urutan: number;
    aktif?: boolean;
}
export declare class CreatePermohonanLayananDto {
    sekolah_id: string;
    layanan_id: string;
    kategori: number;
    ptk_id?: string;
    peserta_didik_id?: string;
    nomor_permohonan?: string;
    keterangan?: string;
}
export declare class CreatePermohonanLayananFileDto {
    layanan_syarat_id?: string;
    jenis_file: number;
    nama_file?: string;
    file_url?: string;
    catatan?: string;
}
export declare class UpdatePermohonanStatusDto {
    status: number;
    pegawai_id: string;
    catatan?: string;
}
