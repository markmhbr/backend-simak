export declare class CreateTransaksiSppDto {
    spp_id: string;
    sekolah_id: string;
    peserta_didik_id: string;
    jenis_transaksi: number;
    nominal: number;
    tanggal_transaksi: string;
    metode_pembayaran?: number;
    keterangan?: string;
}
