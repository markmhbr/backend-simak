import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsInt, Min, Max, IsUUID } from 'class-validator';

export class CreatePengaturanTagihanDto {
  @IsUUID()
  @IsNotEmpty()
  sekolah_id: string;

  @IsString()
  @IsNotEmpty()
  nama_tagihan: string;

  @IsNumber()
  @Min(0)
  nominal: number;

  @IsInt()
  @Min(1)
  @Max(3)
  tipe: number; // 1 = Bulanan, 2 = Tahunan, 3 = Sekali Bayar

  @IsBoolean()
  @IsOptional()
  aktif?: boolean;
}
