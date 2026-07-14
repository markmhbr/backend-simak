import { Module } from '@nestjs/common';
import { MutasiPdService } from './mutasi-pd.service';
import { MutasiPdController } from './mutasi-pd.controller';

@Module({
  controllers: [MutasiPdController],
  providers: [MutasiPdService],
  exports: [MutasiPdService],
})
export class MutasiPdModule {}
