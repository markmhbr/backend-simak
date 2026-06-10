import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class KurikulumService {
  constructor(private readonly prisma: PrismaService) {}

  // Jadwal-related methods have been moved to JadwalService
  // Add kurikulum-specific methods here as needed
}
