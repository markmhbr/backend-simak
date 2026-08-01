import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateKategoriPelanggaranDto {
  @IsString()
  @IsNotEmpty()
  sekolah_id: string;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsInt()
  @IsOptional()
  target?: number; // 1 = Peserta Didik, 2 = GTK, 3 = Semua

  @IsString()
  @IsOptional()
  keterangan?: string;

  @IsBoolean()
  @IsOptional()
  aktif?: boolean;
}
