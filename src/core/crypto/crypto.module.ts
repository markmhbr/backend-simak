import { Global, Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
