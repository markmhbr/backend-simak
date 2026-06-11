import { Module } from '@nestjs/common';
import { MandalaService } from './mandala.service';
import { MandalaController } from './mandala.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [MandalaController],
  providers: [MandalaService],
  exports: [MandalaService],
})
export class MandalaModule {}
