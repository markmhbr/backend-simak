import { IsNotEmpty, IsUUID, IsInt, Min, Max, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreateTransaksiSppDto {
  @IsUUID()
  @IsNotEmpty()
  spp_id: string;

  @IsUUID()
  @IsNotEmpty()
  sekolah_id: string;

  @IsUUID()
  @IsNotEmpty()
  peserta_didik_id: string;

  @IsInt()
  @Min(1)
  @Max(5)
  jenis_transaksi: number; // 1 = Pembayaran, 2 = Beasiswa, 3 = Denda, 4 = Pengurangan, 5 = Pengembalian Dana

  @IsNumber()
  @Min(0)
  nominal: number;

  @IsDateString()
  @IsNotEmpty()
  tanggal_transaksi: string;

  @IsInt()
  @Min(1)
  @Max(4)
  @IsOptional()
  metode_pembayaran?: number; // 1 = Tunai, 2 = Transfer, 3 = QRIS, 4 = Virtual Account

  @IsString()
  @IsOptional()
  keterangan?: string;
}
