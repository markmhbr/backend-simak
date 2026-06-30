import { Module } from '@nestjs/common';
import { PengaturanUmumService } from './pengaturan-umum.service';
import { PengaturanUmumController } from './pengaturan-umum.controller';

@Module({
  controllers: [PengaturanUmumController],
  providers: [PengaturanUmumService],
  exports: [PengaturanUmumService],
})
export class PengaturanUmumModule {}
