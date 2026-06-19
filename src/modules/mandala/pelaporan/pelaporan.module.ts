import { Module } from '@nestjs/common';
import { PelaporanService } from './pelaporan.service';
import { PelaporanController } from './pelaporan.controller';
import { SimakPelaporanController } from './simak-pelaporan.controller';
import { PrismaModule } from '../../../core/prisma/prisma.module';
import { AppKeyModule } from '../../../core/app-key/app-key.module';

@Module({
  imports: [PrismaModule, AppKeyModule],
  controllers: [PelaporanController, SimakPelaporanController],
  providers: [PelaporanService],
})
export class PelaporanModule {}
