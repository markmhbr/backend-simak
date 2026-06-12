import { IsString, IsNotEmpty, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateJenisTindakLanjutDto {
  @IsString()
  @IsNotEmpty()
  sekolah_id: string;

  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsInt()
  target: number; // 0 = GTK, 1 = Peserta Didik, 2 = Keduanya

  @IsBoolean()
  @IsOptional()
  aktif?: boolean;
}
