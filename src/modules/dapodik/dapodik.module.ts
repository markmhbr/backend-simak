import { Module } from '@nestjs/common';
import { DapodikController } from './dapodik.controller';
import { DapodikService } from './dapodik.service';

@Module({
  controllers: [DapodikController],
  providers: [DapodikService],
})
export class DapodikModule {}
