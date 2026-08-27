import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsUUID, 
  IsDateString, 
  IsInt, 
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLiterasiDto {
  @IsNotEmpty({ message: 'peserta_didik_id wajib diisi' })
  @IsUUID('4', { message: 'peserta_didik_id harus format UUID' })
  peserta_didik_id: string;

  @IsNotEmpty({ message: 'nama_buku wajib diisi' })
  @IsString()
  nama_buku: string;

  @IsNotEmpty({ message: 'halaman_dari wajib diisi' })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'halaman_dari minimal 1' })
  halaman_dari: number;

  @IsNotEmpty({ message: 'halaman_sampai wajib diisi' })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'halaman_sampai minimal 1' })
  halaman_sampai: number;

  @IsOptional()
  @IsString()
  kesimpulan?: string;

  @IsNotEmpty({ message: 'Tanggal wajib diisi' })
  @IsDateString({}, { message: 'Format tanggal tidak valid (YYYY-MM-DD)' })
  tanggal: string;
}

export class UpdateLiterasiDto {
  @IsOptional()
  @IsUUID('4', { message: 'peserta_didik_id harus format UUID' })
  peserta_didik_id?: string;

  @IsOptional()
  @IsString()
  nama_buku?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  halaman_dari?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  halaman_sampai?: number;

  @IsOptional()
  @IsString()
  kesimpulan?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal tidak valid (YYYY-MM-DD)' })
  tanggal?: string;
}
