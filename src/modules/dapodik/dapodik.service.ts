import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class DapodikService {
  constructor(private readonly prisma: PrismaService) {}

  private checkSekolahAccess(sekolahId: string | null) {
    if (!sekolahId) {
      return undefined;
    }
    return sekolahId;
  }

  async getSummary(sekolahId: string | null) {
    const filter = this.checkSekolahAccess(sekolahId);
    const whereClause = filter ? { sekolah_id: filter } : {};

    const [totalTanah, totalBangunan, totalRuang] = await Promise.all([
      this.prisma.tanah.count({ where: whereClause }),
      this.prisma.bangunan.count({ where: whereClause }),
      this.prisma.ruang.count({ where: whereClause }),
    ]);

    return {
      sekolah_id: sekolahId || 'GLOBAL (SELURUH SEKOLAH)',
      total_tanah: totalTanah,
      total_bangunan: totalBangunan,
      total_ruang: totalRuang,
    };
  }

  async getTanah(sekolahId: string | null) {
    const filter = this.checkSekolahAccess(sekolahId);
    const whereClause = filter ? { sekolah_id: filter } : {};

    return await this.prisma.tanah.findMany({
      where: whereClause,
      orderBy: { nama: 'asc' },
    });
  }

  async getBangunan(sekolahId: string | null) {
    const filter = this.checkSekolahAccess(sekolahId);
    const whereClause = filter ? { sekolah_id: filter } : {};

    return await this.prisma.bangunan.findMany({
      where: whereClause,
      orderBy: { nama: 'asc' },
    });
  }

  async getRuang(sekolahId: string | null) {
    const filter = this.checkSekolahAccess(sekolahId);
    const whereClause = filter ? { sekolah_id: filter } : {};

    return await this.prisma.ruang.findMany({
      where: whereClause,
      orderBy: { nm_ruang: 'asc' },
    });
  }
}
