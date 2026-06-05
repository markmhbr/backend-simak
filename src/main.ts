import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Best practice: Add API prefix
  app.setGlobalPrefix('api');
  
  app.enableCors();

  // Tambahkan limit payload agar tidak kena error 413 (Payload Too Large)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  
  const port = configService.get<number>('PORT') || 3000;
  const appUrl = configService.get<string>('APP_URL');

  await app.listen(port);
  
  logger.log(`Application is running on: ${appUrl}`);
  logger.log(`API endpoints available at: ${appUrl}/api`);
}
bootstrap();
