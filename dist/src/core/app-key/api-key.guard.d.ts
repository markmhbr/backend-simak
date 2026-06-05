import { CanActivate, ExecutionContext } from '@nestjs/common';
import { AppKeyService } from './app-key.service';
export declare class ApiKeyGuard implements CanActivate {
    private readonly appKeyService;
    constructor(appKeyService: AppKeyService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
