import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class DapodikService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mengembalikan filter sekolah_id yang wajib digunakan di setiap query.
   * Jika sekolahId null (tidak mungkin dengan API Key valid), akan melempar error demi keamanan.
   */
  private getSekolahFilter(sekolahId: string | null) {
    if (!sekolahId) {
      throw new Error('Akses ditolak: Sekolah ID tidak ditemukan dalam kredensial API.');
    }
    return { sekolah_id: sekolahId };
  }

  /**
   * Mencari semester_id terbaru khusus untuk sekolah yang sedang login.
   */
  private async getLatestSemesterId(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);

    const latestRombel = await this.prisma.rombonganBelajar.findFirst({
      where: filter,
      select: { semester_id: true },
      orderBy: { semester_id: 'desc' },
    });

    return latestRombel?.semester_id || null;
  }

  async getSummary(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);

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

  async getSekolah(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    return await this.prisma.sekolah.findUnique({
      where: { sekolah_id: filter.sekolah_id },
    });
  }

  async updateSekolah(sekolahId: string, data: any) {
    return await this.prisma.sekolah.update({
      where: { sekolah_id: sekolahId },
      data: {
        nama: data.nama,
        npsn: data.npsn,
        spmb: data.spmb,
        peta: data.peta,
        social_media: data.social_media,
        cadisdik_id: data.cadisdik_id,
      },
    });
  }

  async uploadLogo(sekolahId: string, file: Express.Multer.File) {
    const fs = require('fs');
    const path = require('path');
    const frontendPublicDir = path.join(process.cwd(), '../frontend-simak/public/uploads');
    
    if (!fs.existsSync(frontendPublicDir)) {
      fs.mkdirSync(frontendPublicDir, { recursive: true });
    }

    const fileExt = path.extname(file.originalname);
    const fileName = `logo_${sekolahId}${fileExt}`;
    const filePath = path.join(frontendPublicDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const relativePath = `/uploads/${fileName}`;
    return await this.prisma.sekolah.update({
      where: { sekolah_id: sekolahId },
      data: { logo: relativePath },
    });
  }

  async getTanah(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    return await this.prisma.tanah.findMany({
      where: filter,
      orderBy: { nama: 'asc' },
    });
  }

  async getTahunPelajaran(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);

    const semesters = await this.prisma.rombonganBelajar.findMany({
      where: filter,
      select: { semester_id: true },
      distinct: ['semester_id'],
      orderBy: { semester_id: 'desc' },
    });

    if (semesters.length === 0) return [];

    const latestSemesterId = semesters[0].semester_id;

    return semesters.map((s) => {
      const sId = s.semester_id || '';
      const yearPrefix = sId.substring(0, 4);
      const semesterCode = sId.substring(4, 5);
      const yearStart = parseInt(yearPrefix, 10);
      const yearEnd = yearStart + 1;
      
      return {
        semester_id: sId,
        tahun_pelajaran: `${yearStart}/${yearEnd}`,
        semester: semesterCode === '1' ? 'Ganjil' : 'Genap',
        status: sId === latestSemesterId ? 'Aktif' : 'Non-Aktif',
      };
    });
  }

  async getBangunan(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    return await this.prisma.bangunan.findMany({
      where: filter,
      orderBy: { nama: 'asc' },
    });
  }

  async getRuang(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    return await this.prisma.ruang.findMany({
      where: filter,
      orderBy: { nm_ruang: 'asc' },
    });
  }

  async getPesertaDidik(sekolahId: string | null, limit: number = 10, search?: string, page: number = 1, rombelName?: string) {
    const filter = this.getSekolahFilter(sekolahId);
    
    let whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
      ],
    };

    if (rombelName) {
      whereClause.AND.push({ nama_rombel: rombelName });
    }

    if (search) {
      whereClause.AND.push({
        OR: [
          { nama: { contains: search, mode: 'insensitive' } },
          { nisn: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.pesertaDidik.count({ where: whereClause }),
      this.prisma.pesertaDidik.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { nama: 'asc' },
      }),
    ]);

    return { total, data };
  }

  async getRombonganBelajar(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    const whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
      ],
    };

    return await this.prisma.rombonganBelajar.findMany({
      where: whereClause,
      select: { nama: true },
      distinct: ['nama'],
      orderBy: { nama: 'asc' },
    });
  }
  async getJurusan(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);

    const rombels = await this.prisma.rombonganBelajar.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { jurusan_id_str: { not: null } },
        ],
      },
      select: {
        nama: true,
        jurusan_id_str: true,
      },
    });

    const jurusanMap = new Map();
    rombels.forEach((r: any) => {
      const parts = r.nama.split(' ');
      let kode = parts.length > 1 ? parts[1] : parts[0];
      if (!jurusanMap.has(kode)) {
        jurusanMap.set(kode, r.jurusan_id_str);
      }
    });

    return Array.from(jurusanMap.entries()).map(([kode, nama]) => ({
      kode,
      nama_jurusan: nama,
    }));
  }

  async getMataPelajaran(sekolahId: string | null, limit: number = 10, search?: string, page: number = 1) {
    const filter = this.getSekolahFilter(sekolahId);
    
    const whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
      ],
    };

    if (search) {
      whereClause.AND.push({
        nama_mata_pelajaran: { contains: search, mode: 'insensitive' },
      });
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.pembelajaran.groupBy({
        by: ['mata_pelajaran_id', 'nama_mata_pelajaran'],
        where: whereClause,
      }).then(res => res.length),
      
      this.prisma.pembelajaran.findMany({
        where: whereClause,
        select: {
          mata_pelajaran_id: true,
          nama_mata_pelajaran: true,
        },
        distinct: ['mata_pelajaran_id', 'nama_mata_pelajaran'],
        take: limit,
        skip: skip,
        orderBy: { nama_mata_pelajaran: 'asc' },
      }),
    ]);

    return { total, data };
  }

  async getGtk(sekolahId: string | null, limit: number = 10, search?: string, page: number = 1, type?: 'guru' | 'tendik') {
    const filter = this.getSekolahFilter(sekolahId);
    let whereClause: any = {
      AND: [{ sekolah_id: filter.sekolah_id }],
    };

    if (search) {
      whereClause.AND.push({
        OR: [
          { nama: { contains: search, mode: 'insensitive' } },
          { nuptk: { contains: search, mode: 'insensitive' } },
          { nip: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (type === 'guru') {
      whereClause.AND.push({ jenis_ptk_id_str: { contains: 'Guru', mode: 'insensitive' } });
    } else if (type === 'tendik') {
      whereClause.AND.push({
        NOT: { jenis_ptk_id_str: { contains: 'Guru', mode: 'insensitive' } },
      });
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.gtk.count({ where: whereClause }),
      this.prisma.gtk.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { nama: 'asc' },
      }),
    ]);

    return { total, data };
  }
}
