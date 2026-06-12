import { Module } from '@nestjs/common';
import { IndisiplinerService } from './indisipliner.service';
import { IndisiplinerController } from './indisipliner.controller';
import { PrismaModule } from '../../core/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IndisiplinerController],
  providers: [IndisiplinerService],
  exports: [IndisiplinerService],
})
export class IndisiplinerModule {}
