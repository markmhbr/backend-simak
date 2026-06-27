import { Module } from '@nestjs/common';
import { DapodikController } from './dapodik.controller';
import { DapodikService } from './dapodik.service';
import { ReferenceModule } from '../reference/reference.module';

@Module({
  imports: [ReferenceModule],
  controllers: [DapodikController],
  providers: [DapodikService],
})
export class DapodikModule {}
