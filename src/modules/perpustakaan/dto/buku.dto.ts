import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsUUID, 
  IsInt, 
  Min, 
  Max 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBukuDto {
  @IsNotEmpty({ message: 'kategori_buku_id wajib diisi' })
  @IsUUID('4', { message: 'kategori_buku_id harus format UUID' })
  kategori_buku_id: string;

  @IsNotEmpty({ message: 'Kode buku wajib diisi' })
  @IsString()
  kode: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsNotEmpty({ message: 'Judul buku wajib diisi' })
  @IsString()
  judul: string;

  @IsOptional()
  @IsString()
  penulis?: string;

  @IsOptional()
  @IsString()
  penerbit?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1000)
  @Max(9999)
  tahun_terbit?: number;

  @IsNotEmpty({ message: 'Jumlah buku wajib diisi' })
  @Type(() => Number)
  @IsInt()
  @Min(0, { message: 'Jumlah buku minimal 0' })
  jumlah: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0, { message: 'Stok tersedia minimal 0' })
  tersedia?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  kondisi?: number; // 1: Baik, 2: Rusak Ringan, 3: Rusak Berat, 4: Tidak Layak

  @IsOptional()
  @IsString()
  lokasi_rak?: string;

  @IsOptional()
  @IsString()
  sampul?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2)
  status?: number; // 1: Aktif, 2: Tidak Aktif
}

export class UpdateBukuDto {
  @IsOptional()
  @IsUUID('4', { message: 'kategori_buku_id harus format UUID' })
  kategori_buku_id?: string;

  @IsOptional()
  @IsString()
  kode?: string;

  @IsOptional()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsString()
  judul?: string;

  @IsOptional()
  @IsString()
  penulis?: string;

  @IsOptional()
  @IsString()
  penerbit?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tahun_terbit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  jumlah?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  tersedia?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  kondisi?: number;

  @IsOptional()
  @IsString()
  lokasi_rak?: string;

  @IsOptional()
  @IsString()
  sampul?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(2)
  status?: number;
}
