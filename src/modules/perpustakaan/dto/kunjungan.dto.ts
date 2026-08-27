import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsUUID, 
  IsDateString, 
  Matches 
} from 'class-validator';

export class CreateKunjunganDto {
  @IsOptional()
  @IsUUID('4', { message: 'peserta_didik_id harus format UUID' })
  peserta_didik_id?: string;

  @IsOptional()
  @IsUUID('4', { message: 'ptk_id harus format UUID' })
  ptk_id?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Format tanggal tidak valid (YYYY-MM-DD)' })
  tanggal?: string;

  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'Format jam_masuk harus HH:mm atau HH:mm:ss',
  })
  jam_masuk?: string;

  @IsOptional()
  @IsString()
  keperluan?: string;

  @IsOptional()
  @IsString()
  keterangan?: string;
}

export class CheckOutKunjunganDto {
  @IsOptional()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'Format jam_keluar harus HH:mm atau HH:mm:ss',
  })
  jam_keluar?: string;
}
