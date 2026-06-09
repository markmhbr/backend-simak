import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AppKeyService } from './app-key.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class ApiKeyGuard implements CanActivate {
    private readonly appKeyService;
    private readonly configService;
    private readonly prisma;
    constructor(appKeyService: AppKeyService, configService: ConfigService, prisma: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
