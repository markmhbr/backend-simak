import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
    const hexKey = this.configService.get<string>('ENCRYPTION_KEY');
    if (!hexKey || hexKey.length !== 64) {
      throw new Error('ENCRYPTION_KEY harus 32 byte (64 karakter hex)');
    }
    this.key = Buffer.from(hexKey, 'hex');
  }

  /**
   * Enkripsi teks menggunakan AES-256-GCM
   * Hasil format: iv:authTag:encryptedData (semua hex)
   */
  encrypt(text: string): string {
    const iv = crypto.randomBytes(12); // GCM merekomendasikan 12 byte IV
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  }

  /**
   * Dekripsi teks menggunakan AES-256-GCM
   */
  decrypt(encryptedText: string): string {
    const [ivHex, authTagHex, encryptedData] = encryptedText.split(':');
    
    if (!ivHex || !authTagHex || !encryptedData) {
      throw new Error('Format enkripsi tidak valid');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
}
