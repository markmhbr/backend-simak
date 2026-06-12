import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreatePengaturanTagihanRombelDto {
  @IsUUID()
  @IsNotEmpty()
  pengaturan_tagihan_id: string;

  @IsUUID()
  @IsNotEmpty()
  rombongan_belajar_id: string;
}
