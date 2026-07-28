import { IsBoolean, IsOptional, IsString, IsIn } from 'class-validator';

export class UpdatePengaturanVaDto {
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsString()
  @IsOptional()
  client_id?: string;

  @IsString()
  @IsOptional()
  secret_key?: string;

  @IsString()
  @IsOptional()
  private_key?: string;

  @IsString()
  @IsOptional()
  bjb_public_key?: string;

  @IsString()
  @IsOptional()
  api_url?: string;

  @IsString()
  @IsIn(['sandbox', 'production'])
  @IsOptional()
  mode?: string;
}
