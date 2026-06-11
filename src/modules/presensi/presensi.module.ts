import { Module } from '@nestjs/common';
import { PresensiService } from './presensi.service';
import { PresensiController } from './presensi.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { AppKeyModule } from '../../core/app-key/app-key.module';

@Module({
  imports: [PrismaModule, AppKeyModule],
  controllers: [PresensiController],
  providers: [PresensiService],
  exports: [PresensiService],
})
export class PresensiModule {}
