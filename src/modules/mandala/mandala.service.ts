import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class MandalaService implements OnModuleInit {
  private readonly logger = new Logger(MandalaService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const urlMandala = process.env.URL_MANDALA;
    const keyMandala = process.env.KEY_MANDALA || 'simak_mandala_secure_connection_key_2026';

    if (urlMandala) {
      try {
        const count = await this.prisma.mandala.count();
        if (count === 0) {
          this.logger.log(`Seeding default Mandala connection: URL=${urlMandala}`);
          await this.prisma.mandala.create({
            data: {
              key: keyMandala,
              url_mandala: urlMandala,
            },
          });
        }
      } catch (error) {
        this.logger.error('Failed to seed default Mandala connection:', error);
      }
    }
  }

  async getConnection() {
    return await this.prisma.mandala.findFirst({
      orderBy: { created_at: 'desc' },
    });
  }

  async saveOrUpdateConnection(key: string, urlMandala: string) {
    const existing = await this.prisma.mandala.findFirst();

    if (existing) {
      return await this.prisma.mandala.update({
        where: { id: existing.id },
        data: {
          key,
          url_mandala: urlMandala,
        },
      });
    } else {
      return await this.prisma.mandala.create({
        data: {
          key,
          url_mandala: urlMandala,
        },
      });
    }
  }

  async getSchools() {
    const schools = await this.prisma.sekolah.findMany({
      orderBy: { nama: 'asc' },
    });

    const richSchools = await Promise.all(
      schools.map(async (school) => {
        const [totalSiswa, totalGtk] = await Promise.all([
          this.prisma.pesertaDidik.count({ where: { sekolah_id: school.sekolah_id } }),
          this.prisma.gtk.count({ where: { sekolah_id: school.sekolah_id } }),
        ]);

        return {
          sekolah_id: school.sekolah_id,
          nama: school.nama,
          npsn: school.npsn,
          status_sekolah: school.status_sekolah_str || school.status_sekolah,
          alamat: school.alamat_jalan,
          email: school.email,
          website: school.website,
          total_siswa: totalSiswa,
          total_gtk: totalGtk,
        };
      }),
    );

    return richSchools;
  }

  async getSchoolDetail(sekolahId: string) {
    const school = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: sekolahId },
    });

    if (!school) return null;

    const kepalaSekolah = await this.prisma.gtk.findFirst({
      where: {
        AND: [
          { sekolah_id: sekolahId },
          {
            OR: [
              { jabatan_ptk_id_str: { contains: 'Kepala Sekolah', mode: 'insensitive' } },
              { jenis_ptk_id_str: { contains: 'Kepala Sekolah', mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: { nama: true },
    });

    return {
      ...school,
      nama_kepala_sekolah: kepalaSekolah?.nama || null,
    };
  }

  async getSchoolSummary(sekolahId: string) {
    const filter = { sekolah_id: sekolahId };

    const [totalTanah, totalBangunan, totalRuang, totalSiswa, totalGtk] = await Promise.all([
      this.prisma.tanah.count({ where: filter }),
      this.prisma.bangunan.count({ where: filter }),
      this.prisma.ruang.count({ where: filter }),
      this.prisma.pesertaDidik.count({ where: filter }),
      this.prisma.gtk.count({ where: filter }),
    ]);

    return {
      sekolah_id: sekolahId,
      total_tanah: totalTanah,
      total_bangunan: totalBangunan,
      total_ruang: totalRuang,
      total_siswa: totalSiswa,
      total_gtk: totalGtk,
    };
  }
}
