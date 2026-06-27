import { Module } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { ReferenceController } from './reference.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';
import { AppKeyModule } from '../../core/app-key/app-key.module';

@Module({
  imports: [PrismaModule, AppKeyModule],
  controllers: [ReferenceController],
  providers: [ReferenceService],
  exports: [ReferenceService],
})
export class ReferenceModule {}
