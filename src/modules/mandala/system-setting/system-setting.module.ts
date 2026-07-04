import { Module } from '@nestjs/common';
import { SystemSettingService } from './system-setting.service';
import { SystemSettingController } from './system-setting.controller';
import { PrismaModule } from '../../../core/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [SystemSettingController],
  providers: [SystemSettingService],
  exports: [SystemSettingService],
})
export class MandalaSystemSettingModule {}
