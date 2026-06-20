import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AppKeyService } from './app-key.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

const jwt = require('jsonwebtoken');

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly appKeyService: AppKeyService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Cek apakah ada x-mandala-key di header atau query param
    let mandalaKey = request.headers['x-mandala-key'] as string;
    if (!mandalaKey && request.query.key) {
      mandalaKey = request.query.key as string;
    }

    if (mandalaKey) {
      const connection = await this.prisma.mandala.findUnique({
        where: { key: mandalaKey },
      });
      if (connection) {
        request['mandala'] = connection;
        request['isMandala'] = true;
        return true;
      }
      throw new UnauthorizedException('Invalid Mandala API key.');
    }

    // Cek apakah ada Bearer token di header (Untuk akses dari browser)
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const secret = this.configService.get<string>('JWT_SECRET');
        const decoded = jwt.verify(token, secret) as any;
        if (decoded) {
          if (decoded.role === 'Super Admin' || decoded.role === 'superadmin') {
            // Ambil sekolah_id pertama untuk kebutuhan visualisasi data dashboard
            const firstSekolah = await this.prisma.sekolah.findFirst({
              select: { sekolah_id: true }
            });
            const resolvedSekolahId = firstSekolah?.sekolah_id || '00000000-0000-0000-0000-000000000000';

            // Inject appKey dummy agar controller sekolah info / dapodik summary tidak error
            request['appKey'] = {
              id: 'super-admin-bypass',
              nama_app: 'Pusat (Super Admin)',
              sekolah_id: resolvedSekolahId,
              key_api: 'super-admin-bypass-key',
              domain: '*',
              is_active: true,
            };
            return true;
          }

          // Untuk Guru, Siswa, Admin Sekolah
          if (decoded.sekolahId) {
            const appKey = await this.prisma.appKey.findUnique({
              where: { sekolah_id: decoded.sekolahId }
            });
            if (appKey && appKey.is_active) {
              request['appKey'] = appKey;
              request['user'] = decoded;
              return true;
            }
          }
        }
      } catch (err) {
        // Token tidak valid atau kedaluwarsa, lemparkan UnauthorizedException agar Axios interceptor di frontend dapat memicu refresh token!
        throw new UnauthorizedException('Token kedaluwarsa atau tidak valid. Silakan login kembali.');
      }
    }
    
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
      // Izinkan lewat tanpa API Key HANYA untuk route login/auth (pengecekan dilakukan di service)
      // dan cari appKey berdasarkan domain untuk mengeset sekolahId saat login/info.
      if (request.url.includes('/auth/')) {
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
        }
        return true;
      }

      throw new ForbiddenException('Akses ditolak. Silakan login atau sertakan API Key yang valid.');
    }

    const validKey = await this.appKeyService.validateApiKey(apiKey);
    
    // AUTO-REGISTRATION LOGIC:
    // Jika key tidak ditemukan, tapi ini adalah request sinkronisasi Sekolah, 
    // kita izinkan lewat agar bisa dibuatkan Key-nya secara otomatis di Service.
    const isSyncSekolah = request.method === 'POST' && request.url.includes('/api/sync/sekolah');
    
    if (!validKey && !isSyncSekolah) {
      // Jika di route auth tapi key salah, kita tetap tolak demi keamanan
      if (request.url.includes('/api/auth/')) {
        throw new ForbiddenException('API Key tidak valid');
      }
      throw new ForbiddenException('API Key tidak valid atau tidak aktif');
    }

    // Simpan informasi key ke dalam request (bisa null jika isSyncSekolah)
    request['appKey'] = validKey;
    request['rawApiKey'] = apiKey; // Simpan token asli untuk keperluan registrasi otomatis

    return true;
  }
}
