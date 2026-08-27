export declare class CreateBukuDto {
    kategori_buku_id: string;
    kode: string;
    isbn?: string;
    judul: string;
    penulis?: string;
    penerbit?: string;
    tahun_terbit?: number;
    jumlah: number;
    tersedia?: number;
    kondisi?: number;
    lokasi_rak?: string;
    sampul?: string;
    deskripsi?: string;
    status?: number;
}
export declare class UpdateBukuDto {
    kategori_buku_id?: string;
    kode?: string;
    isbn?: string;
    judul?: string;
    penulis?: string;
    penerbit?: string;
    tahun_terbit?: number;
    jumlah?: number;
    tersedia?: number;
    kondisi?: number;
    lokasi_rak?: string;
    sampul?: string;
    deskripsi?: string;
    status?: number;
}
