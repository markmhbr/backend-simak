import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateKategoriBukuDto {
  @IsNotEmpty({ message: 'Nama kategori wajib diisi' })
  @IsString()
  nama: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;
}

export class UpdateKategoriBukuDto {
  @IsOptional()
  @IsString()
  nama?: string;

  @IsOptional()
  @IsString()
  deskripsi?: string;
}
