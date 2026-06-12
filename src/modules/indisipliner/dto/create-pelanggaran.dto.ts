import { IsString, IsNotEmpty, IsOptional, IsDateString, IsInt, IsUUID } from 'class-validator';

export class CreatePelanggaranDto {
  @IsString()
  @IsNotEmpty()
  sekolah_id: string;

  @IsUUID()
  @IsOptional()
  peserta_didik_id?: string;

  @IsUUID()
  @IsOptional()
  ptk_id?: string;

  @IsUUID()
  @IsNotEmpty()
  jenis_pelanggaran_id: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal: string;

  @IsDateString()
  @IsNotEmpty()
  waktu: string;

  @IsString()
  @IsOptional()
  keterangan?: string;

  @IsInt()
  @IsOptional()
  status?: number;

  @IsUUID()
  @IsOptional()
  pelapor_ptk_id?: string;
}
