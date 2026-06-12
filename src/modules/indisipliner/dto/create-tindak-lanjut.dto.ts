import { IsString, IsNotEmpty, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateTindakLanjutDto {
  @IsUUID()
  @IsNotEmpty()
  pelanggaran_id: string;

  @IsUUID()
  @IsNotEmpty()
  jenis_tindak_lanjut_id: string;

  @IsDateString()
  @IsNotEmpty()
  tanggal: string;

  @IsString()
  @IsOptional()
  keterangan?: string;

  @IsUUID()
  @IsOptional()
  petugas_ptk_id?: string;
}
