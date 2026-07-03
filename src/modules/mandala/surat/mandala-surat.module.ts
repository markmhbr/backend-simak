import { Module } from '@nestjs/common';
import { MandalaSuratService } from './mandala-surat.service';
import { MandalaSuratController } from './mandala-surat.controller';
import { PrismaModule } from '../../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MandalaSuratController],
  providers: [MandalaSuratService],
  exports: [MandalaSuratService],
})
export class MandalaSuratModule {}
