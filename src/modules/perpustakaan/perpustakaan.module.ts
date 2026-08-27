import { Module } from '@nestjs/common';
import { PerpustakaanController } from './perpustakaan.controller';
import { PerpustakaanService } from './perpustakaan.service';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { AppKeyModule } from '../../core/app-key/app-key.module';

@Module({
  imports: [PrismaModule, AppKeyModule],
  controllers: [PerpustakaanController],
  providers: [PerpustakaanService],
  exports: [PerpustakaanService],
})
export class PerpustakaanModule {}
