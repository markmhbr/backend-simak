import { Module } from '@nestjs/common';
import { AbsensiService } from './absensi.service';
import { AbsensiController } from './absensi.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { AppKeyModule } from '../../core/app-key/app-key.module';

@Module({
  imports: [PrismaModule, AppKeyModule],
  controllers: [AbsensiController],
  providers: [AbsensiService],
  exports: [AbsensiService],
})
export class AbsensiModule {}
