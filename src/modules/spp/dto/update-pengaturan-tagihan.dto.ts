import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsInt, Min, Max, IsUUID } from 'class-validator';

export class UpdatePengaturanTagihanDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nama_tagihan?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  nominal?: number;

  @IsInt()
  @Min(1)
  @Max(3)
  @IsOptional()
  tipe?: number;

  @IsBoolean()
  @IsOptional()
  aktif?: boolean;
}
