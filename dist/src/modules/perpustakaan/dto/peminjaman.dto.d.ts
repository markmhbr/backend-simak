export declare class PeminjamanItemDto {
    buku_id: string;
    jumlah: number;
    keterangan?: string;
}
export declare class CreatePeminjamanDto {
    peserta_didik_id?: string;
    ptk_id?: string;
    nomor_peminjaman?: string;
    tanggal_pinjam: string;
    tanggal_jatuh_tempo: string;
    keterangan?: string;
    items: PeminjamanItemDto[];
}
