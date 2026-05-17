import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AppKeyService } from './app-key.service';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly appKeyService: AppKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // 1. Cek dari header 'x-api-key'
    let apiKey = request.headers['x-api-key'] as string;

    // 2. Jika tidak ada di header, cek dari query parameter '?key_api=...'
    if (!apiKey && request.query.key_api) {
      apiKey = request.query.key_api as string;
    }

    // 3. Jika tidak ada, cek dari route parameter ':key_api' jika ada
    if (!apiKey && request.params && request.params.key_api) {
      apiKey = request.params.key_api;
    }

    if (!apiKey) {
      throw new UnauthorizedException('API Key tidak ditemukan dalam request (Header X-API-Key atau param key_api)');
    }

    const validKey = await this.appKeyService.validateApiKey(apiKey);
    if (!validKey) {
      throw new UnauthorizedException('API Key tidak valid atau tidak aktif');
    }

    // Simpan informasi key ke dalam request agar bisa digunakan di controller/service
    request['appKey'] = validKey;

    return true;
  }
}
