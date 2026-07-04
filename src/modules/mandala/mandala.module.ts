import { Module } from '@nestjs/common';
import { MandalaService } from './mandala.service';
import { MandalaController } from './mandala.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptoModule } from '../../core/crypto/crypto.module';
import { MandalaSuratModule } from './surat/mandala-surat.module';
import { MandalaSystemSettingModule } from './system-setting/system-setting.module';

@Module({
  imports: [
    PrismaModule,
    CryptoModule,
    MandalaSuratModule,
    MandalaSystemSettingModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRATION') || '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [MandalaController],
  providers: [MandalaService],
  exports: [MandalaService],
})
export class MandalaModule {}
