import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsUUID, 
  IsDateString, 
  IsArray, 
  ValidateNested, 
  IsInt, 
  IsNumber, 
  Min, 
  Max, 
  ArrayMinSize 
} from 'class-validator';
import { Type } from 'class-transformer';

export class PengembalianItemDto {
  @IsNotEmpty({ message: 'detail_peminjaman_id wajib diisi' })
  @IsUUID('4', { message: 'detail_peminjaman_id harus format UUID' })
  detail_peminjaman_id: string;

  @IsNotEmpty({ message: 'jumlah_kembali wajib diisi' })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Jumlah pengembalian minimal 1' })
  jumlah_kembali: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  kondisi_kembali?: number; // 1: Baik, 2: Rusak Ringan, 3: Rusak Berat, 4: Tidak Layak

  @IsOptional()
  @IsString()
  keterangan?: string;
}

export class PengembalianDto {
  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal_kembali tidak valid (YYYY-MM-DD)' })
  tanggal_kembali?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  denda?: number;

  @IsOptional()
  @IsString()
  keterangan?: string;

  @IsArray({ message: 'Items pengembalian harus berupa array' })
  @ArrayMinSize(1, { message: 'Minimal harus ada 1 item yang dikembalikan' })
  @ValidateNested({ each: true })
  @Type(() => PengembalianItemDto)
  items: PengembalianItemDto[];
}
