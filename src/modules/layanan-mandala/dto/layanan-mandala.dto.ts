import { IsString, IsNotEmpty, IsInt, IsBoolean, IsOptional, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLayananDto {
  @IsString()
  @IsNotEmpty()
  nama_layanan: string;

  @IsInt()
  kategori: number; // 0 = GTK, 1 = Peserta Didik, 2 = Sekolah

  @IsBoolean()
  @IsOptional()
  aktif?: boolean;
}

export class CreateLayananSyaratDto {
  @IsString()
  @IsNotEmpty()
  nama_syarat: string;

  @IsBoolean()
  @IsOptional()
  wajib?: boolean;

  @IsInt()
  urutan: number;

  @IsBoolean()
  @IsOptional()
  aktif?: boolean;
}

export class CreatePermohonanLayananDto {
  @IsUUID()
  sekolah_id: string;

  @IsUUID()
  layanan_id: string;

  @IsInt()
  kategori: number;

  @IsUUID()
  @IsOptional()
  ptk_id?: string;

  @IsUUID()
  @IsOptional()
  peserta_didik_id?: string;

  @IsString()
  @IsOptional()
  nomor_permohonan?: string;

  @IsString()
  @IsOptional()
  keterangan?: string;
}

export class CreatePermohonanLayananFileDto {
  @IsUUID()
  @IsOptional()
  layanan_syarat_id?: string;

  @IsInt()
  jenis_file: number; // 0 = Surat Permohonan Awal, 1 = Dokumen Persyaratan

  @IsString()
  @IsOptional()
  nama_file?: string;

  @IsString()
  @IsOptional()
  file_url?: string;

  @IsString()
  @IsOptional()
  catatan?: string;
}

export class UpdatePermohonanStatusDto {
  @IsInt()
  status: number;

  @IsUUID()
  pegawai_id: string;

  @IsString()
  @IsOptional()
  catatan?: string;
}
