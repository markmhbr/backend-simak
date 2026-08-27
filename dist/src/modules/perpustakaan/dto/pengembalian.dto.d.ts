export declare class PengembalianItemDto {
    detail_peminjaman_id: string;
    jumlah_kembali: number;
    kondisi_kembali?: number;
    keterangan?: string;
}
export declare class PengembalianDto {
    tanggal_kembali?: string;
    denda?: number;
    keterangan?: string;
    items: PengembalianItemDto[];
}
