export declare class CreateLiterasiDto {
    peserta_didik_id: string;
    nama_buku: string;
    halaman_dari: number;
    halaman_sampai: number;
    kesimpulan?: string;
    tanggal: string;
}
export declare class UpdateLiterasiDto {
    peserta_didik_id?: string;
    nama_buku?: string;
    halaman_dari?: number;
    halaman_sampai?: number;
    kesimpulan?: string;
    tanggal?: string;
}
