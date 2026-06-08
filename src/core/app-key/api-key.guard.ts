import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AppKeyService } from './app-key.service';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly appKeyService: AppKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    
    // 1. Cek dari header 'x-api-key' atau 'x-sync-token'
    let apiKey = (request.headers['x-api-key'] || request.headers['x-sync-token']) as string;

    // 2. Jika tidak ada di header, cek dari query parameter '?key_api=...'
    if (!apiKey && request.query.key_api) {
      apiKey = request.query.key_api as string;
    }

    // 3. Jika tidak ada, cek dari route parameter ':key_api' jika ada
    if (!apiKey && request.params && request.params.key_api) {
      apiKey = request.params.key_api as string;
    }

    if (!apiKey) {
      // Jika tidak ada API Key di header, coba cari berdasarkan domain (Domain-Based Identification)
      // Cek Origin atau Referer terlebih dahulu (untuk request dari browser/frontend)
      const origin = request.headers.origin as string;
      const referer = request.headers.referer as string;
      const host = request.headers.host;

      let domainToTest: string;
      if (origin) {
        domainToTest = origin.replace(/^https?:\/\//, '');
      } else if (referer) {
        try {
          const url = new URL(referer);
          domainToTest = url.host;
        } catch {
          domainToTest = host;
        }
      } else {
        domainToTest = host;
      }

      const keyByDomain = await this.appKeyService.findByDomain(domainToTest);
      
      if (keyByDomain) {
        request['appKey'] = keyByDomain;
        return true;
      }

      // Izinkan lewat tanpa API Key HANYA untuk route login/auth (pengecekan dilakukan di service)
      if (request.url.includes('/api/auth/')) {
        return true;
      }
      throw new UnauthorizedException('Sistem belum terhubung. API Key tidak ditemukan dan domain tidak terdaftar.');
    }

    const validKey = await this.appKeyService.validateApiKey(apiKey);
    
    // AUTO-REGISTRATION LOGIC:
    // Jika key tidak ditemukan, tapi ini adalah request sinkronisasi Sekolah, 
    // kita izinkan lewat agar bisa dibuatkan Key-nya secara otomatis di Service.
    const isSyncSekolah = request.method === 'POST' && request.url.includes('/api/sync/sekolah');
    
    if (!validKey && !isSyncSekolah) {
      // Jika di route auth tapi key salah, kita tetap tolak demi keamanan
      if (request.url.includes('/api/auth/')) {
        throw new UnauthorizedException('API Key tidak valid');
      }
      throw new UnauthorizedException('API Key tidak valid atau tidak aktif');
    }

    // Simpan informasi key ke dalam request (bisa null jika isSyncSekolah)
    request['appKey'] = validKey;
    request['rawApiKey'] = apiKey; // Simpan token asli untuk keperluan registrasi otomatis

    return true;
  }
}
