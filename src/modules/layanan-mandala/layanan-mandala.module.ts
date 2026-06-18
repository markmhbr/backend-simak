import { Module } from '@nestjs/common';
import { LayananMandalaService } from './layanan-mandala.service';
import { LayananMandalaController } from './layanan-mandala.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LayananMandalaController],
  providers: [LayananMandalaService],
  exports: [LayananMandalaService],
})
export class LayananMandalaModule {}
