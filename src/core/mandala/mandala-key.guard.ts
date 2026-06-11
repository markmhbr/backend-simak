import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class MandalaKeyGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 1. Get mandala key from header or query param
    let key = request.headers['x-mandala-key'] as string;
    if (!key && request.query.key) {
      key = request.query.key as string;
    }

    if (!key) {
      throw new UnauthorizedException('Mandala API key is missing. Please provide x-mandala-key header or key query param.');
    }

    // 2. Validate key against the database
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
