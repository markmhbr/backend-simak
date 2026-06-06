import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppKeyModule } from '../../core/app-key/app-key.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}), // Konfigurasi detail dilakukan di service
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 20, // Tingkatkan batas menjadi 20 percobaan per menit
    }]),
    AppKeyModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
