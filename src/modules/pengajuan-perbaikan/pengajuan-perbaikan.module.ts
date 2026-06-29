import { Module } from '@nestjs/common';
import { PengajuanPerbaikanController } from './pengajuan-perbaikan.controller';
import { PengajuanPerbaikanService } from './pengajuan-perbaikan.service';
import { AppKeyModule } from '../../core/app-key/app-key.module';

@Module({
  imports: [AppKeyModule],
  controllers: [PengajuanPerbaikanController],
  providers: [PengajuanPerbaikanService],
})
export class PengajuanPerbaikanModule {}
