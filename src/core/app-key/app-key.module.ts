import { Global, Module } from '@nestjs/common';
import { AppKeyService } from './app-key.service';
import { ApiKeyGuard } from './api-key.guard';

@Global()
@Module({
  providers: [AppKeyService, ApiKeyGuard],
  exports: [AppKeyService, ApiKeyGuard],
})
export class AppKeyModule {}
