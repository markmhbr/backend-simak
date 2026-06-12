import { Module } from '@nestjs/common';
import { SppService } from './spp.service';
import { SppController } from './spp.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SppController],
  providers: [SppService],
  exports: [SppService],
})
export class SppModule {}
