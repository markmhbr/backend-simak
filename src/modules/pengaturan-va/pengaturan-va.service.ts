import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { UpdatePengaturanVaDto } from './dto/update-pengaturan-va.dto';

@Injectable()
export class PengaturanVaService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(sekolahId: string) {
    let settings = await this.prisma.pengaturanVa.findUnique({
      where: { sekolah_id: sekolahId },
    });

    if (!settings) {
      // Kembalikan nilai default jika belum pernah dikonfigurasi
      return {
        sekolah_id: sekolahId,
        is_active: false,
        client_id: null,
        secret_key: null,
        private_key: null,
        bjb_public_key: null,
        api_url: null,
        mode: 'sandbox',
      };
    }

    return settings;
  }

  async updateSettings(sekolahId: string, data: UpdatePengaturanVaDto) {
    return this.prisma.pengaturanVa.upsert({
      where: { sekolah_id: sekolahId },
      update: {
        is_active: data.is_active,
        client_id: data.client_id,
        secret_key: data.secret_key,
        private_key: data.private_key,
        bjb_public_key: data.bjb_public_key,
        api_url: data.api_url,
        mode: data.mode,
      },
      create: {
        sekolah_id: sekolahId,
        is_active: data.is_active ?? false,
        client_id: data.client_id,
        secret_key: data.secret_key,
        private_key: data.private_key,
        bjb_public_key: data.bjb_public_key,
        api_url: data.api_url,
        mode: data.mode ?? 'sandbox',
      },
    });
  }
}
