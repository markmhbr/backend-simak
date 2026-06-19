import { IsString, IsNotEmpty, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreatePelaporanDto {
  @IsString()
  @IsNotEmpty()
  judul: string;

  @IsString()
  @IsOptional()
  deskripsi?: string;

  @IsDateString()
  @IsOptional()
  tanggal_mulai?: string;

  @IsDateString()
  @IsOptional()
  tanggal_selesai?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  sekolah_ids: string[];
}
