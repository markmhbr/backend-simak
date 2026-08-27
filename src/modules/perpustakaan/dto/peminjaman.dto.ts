import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsUUID, 
  IsDateString, 
  IsArray, 
  ValidateNested, 
  IsInt, 
  Min, 
  ArrayMinSize 
} from 'class-validator';
import { Type } from 'class-transformer';

export class PeminjamanItemDto {
  @IsNotEmpty({ message: 'buku_id wajib diisi' })
  @IsUUID('4', { message: 'buku_id harus format UUID' })
  buku_id: string;

  @IsNotEmpty({ message: 'Jumlah buku wajib diisi' })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Jumlah peminjaman minimal 1' })
  jumlah: number;

  @IsOptional()
  @IsString()
  keterangan?: string;
}

export class CreatePeminjamanDto {
  @IsOptional()
  @IsUUID('4', { message: 'peserta_didik_id harus format UUID' })
  peserta_didik_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'ptk_id harus format UUID' })
  ptk_id?: string;

  @IsOptional()
  @IsString()
  nomor_peminjaman?: string;

  @IsNotEmpty({ message: 'Tanggal pinjam wajib diisi' })
  @IsDateString({}, { message: 'Format tanggal_pinjam tidak valid (YYYY-MM-DD)' })
  tanggal_pinjam: string;

  @IsNotEmpty({ message: 'Tanggal jatuh tempo wajib diisi' })
  @IsDateString({}, { message: 'Format tanggal_jatuh_tempo tidak valid (YYYY-MM-DD)' })
  tanggal_jatuh_tempo: string;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsArray({ message: 'Items peminjaman harus berupa array' })
  @ArrayMinSize(1, { message: 'Minimal harus ada 1 buku yang dipinjam' })
  @ValidateNested({ each: true })
  @Type(() => PeminjamanItemDto)
  items: PeminjamanItemDto[];
}
