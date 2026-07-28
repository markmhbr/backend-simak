import { Module } from '@nestjs/common';
import { PengaturanVaService } from './pengaturan-va.service';
import { PengaturanVaController } from './pengaturan-va.controller';

@Module({
  controllers: [PengaturanVaController],
  providers: [PengaturanVaService],
})
export class PengaturanVaModule {}
