import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

const jwt = require('jsonwebtoken');

@Injectable()
export class MandalaKeyGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 1. Check for Bearer token in Authorization header (For employee access)
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const secret = this.configService.get<string>('JWT_SECRET');
        const decoded = jwt.verify(token, secret) as any;
        if (decoded) {
          request['user'] = decoded;
          return true;
        }
      } catch (err) {
        // Token invalid or expired, fall back to API Key check
      }
    }

    // 2. Get mandala key from header or query param (For API/System access)
    let key = request.headers['x-mandala-key'] as string;
    if (!key && request.query['x-mandala-key']) {
      key = request.query['x-mandala-key'] as string;
    }
    if (!key && request.query.key) {
      key = request.query.key as string;
    }

    if (!key) {
      throw new UnauthorizedException('Authentication required. Please provide a valid Bearer token or x-mandala-key header/query param.');
    }

    // 3. Validate key against the database
    const connection = await this.prisma.mandala.findUnique({
      where: { key },
    });

    if (!connection) {
      throw new UnauthorizedException('Invalid Mandala API key.');
    }

    // Attach mandala config to request for potential future usage
    request['mandala'] = connection;

    return true;
  }
}
