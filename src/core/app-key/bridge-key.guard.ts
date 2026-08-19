import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

/**
 * Guard khusus untuk memvalidasi request dari aplikasi Bridge (Sinkronisasi Dapodik).
 * Memeriksa header 'x-bridge-key' terhadap BRIDGE_SYNC_KEY di .env.
 * Jika key tidak cocok atau tidak ada, request akan ditolak.
 */
@Injectable()
export class BridgeKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const bridgeKey = request.headers['x-bridge-key'] as string;
    const expectedKey = this.configService.get<string>('BRIDGE_SYNC_KEY');

    if (!expectedKey) {
      throw new ForbiddenException('BRIDGE_SYNC_KEY belum dikonfigurasi di server.');
    }

    if (!bridgeKey) {
      throw new ForbiddenException('Akses ditolak. Header x-bridge-key tidak ditemukan.');
    }

    if (bridgeKey !== expectedKey) {
      throw new ForbiddenException('Akses ditolak. Bridge key tidak valid.');
    }

    return true;
  }
}
