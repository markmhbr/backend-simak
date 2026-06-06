import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'Username harus berupa teks' })
  @IsNotEmpty({ message: 'Username wajib diisi' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string;
}

export class Verify2faDto {
  @IsString()
  @IsNotEmpty({ message: 'Token sementara wajib disertakan' })
  tempToken: string;

  @IsString()
  @IsNotEmpty({ message: 'Kode OTP wajib diisi' })
  @Length(6, 6, { message: 'Kode OTP harus 6 digit' })
  code: string;

  @IsString()
  @IsOptional()
  secret?: string;
}
