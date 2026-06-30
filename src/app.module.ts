import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { validate } from './config/env.validation';
import { PrismaModule } from './core/prisma/prisma.module';
import { AppKeyModule } from './core/app-key/app-key.module';
import { CryptoModule } from './core/crypto/crypto.module';
import { AuthModule } from './modules/auth/auth.module';
import { DapodikModule } from './modules/dapodik/dapodik.module';
import { SyncModule } from './modules/sync/sync.module';
import { KurikulumModule } from './modules/kurikulum/kurikulum.module';
import { JadwalModule } from './modules/jadwal/jadwal.module';
import { PresensiModule } from './modules/presensi/presensi.module';
import { MandalaModule } from './modules/mandala/mandala.module';
import { LayananMandalaModule } from './modules/layanan-mandala/layanan-mandala.module';
import { PelaporanModule } from './modules/mandala/pelaporan/pelaporan.module';
import { IndisiplinerModule } from './modules/indisipliner/indisipliner.module';
import { SppModule } from './modules/spp/spp.module';
import { SuratModule } from './modules/surat/surat.module';
import { ReferenceModule } from './modules/reference/reference.module';
import { PengajuanPerbaikanModule } from './modules/pengajuan-perbaikan/pengajuan-perbaikan.module';
import { PengaturanUmumModule } from './modules/pengaturan-umum/pengaturan-umum.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    PrismaModule,
    AppKeyModule,
    CryptoModule,
    AuthModule,
    DapodikModule,
    SyncModule,
    KurikulumModule,
    JadwalModule,
    PresensiModule,
    MandalaModule,
    LayananMandalaModule,
    PelaporanModule,
    IndisiplinerModule,
    SppModule,
    SuratModule,
    ReferenceModule,
    PengajuanPerbaikanModule,
    PengaturanUmumModule,
  ],


  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter);
      },
      inject: [HttpAdapterHost],
    },
  ],
})
export class AppModule {}
