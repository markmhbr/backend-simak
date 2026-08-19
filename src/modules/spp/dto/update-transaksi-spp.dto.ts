import { IsInt, Min, Max, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateTransaksiSppDto {
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  jenis_transaksi?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  nominal?: number;

  @IsDateString()
  @IsOptional()
  tanggal_transaksi?: string;

  @IsInt()
  @Min(1)
  @Max(4)
  @IsOptional()
  metode_pembayaran?: number;

  @IsString()
  @IsOptional()
  keterangan?: string;
}
