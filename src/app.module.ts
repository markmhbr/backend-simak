import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, HttpAdapterHost } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClientExceptionFilter } from './common/filters/prisma-client-exception.filter';
import { validate } from './config/env.validation';
import { PrismaModule } from './core/prisma/prisma.module';
import { AppKeyModule } from './core/app-key/app-key.module';
import { DapodikModule } from './modules/dapodik/dapodik.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    PrismaModule,
    AppKeyModule,
    DapodikModule,
  ],


  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useFactory: ({ httpAdapter }: HttpAdapterHost) => {
        return new PrismaClientExceptionFilter(httpAdapter);
      },
      inject: [HttpAdapterHost],
    },
  ],
})
export class AppModule {}
