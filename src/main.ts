import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as path from 'path';

async function bootstrap() {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Best practice: Add API prefix
  app.setGlobalPrefix('api');
  
  app.enableCors({
    origin: true, // Sesuaikan dengan URL frontend di produksi
    credentials: true, // Izinkan pengiriman cookie
  });

  app.use(cookieParser());

  // Serve static files from storage directory
  app.use('/storage', express.static(path.join(process.cwd(), 'storage')));

  // Tambahkan ValidationPipe global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

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
