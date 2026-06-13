import { Module } from '@nestjs/common';
import { SuratService } from './surat.service';
import { SuratController } from './surat.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { AppKeyModule } from '../../core/app-key/app-key.module';

@Module({
  imports: [PrismaModule, AppKeyModule],
  controllers: [SuratController],
  providers: [SuratService],
  exports: [SuratService],
})
export class SuratModule {}
