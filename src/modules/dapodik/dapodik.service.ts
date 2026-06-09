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
    const sekolah = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: filter.sekolah_id },
    });

    if (!sekolah) return null;

    // Diagnostic: Cek total GTK di sekolah ini
    const totalGtk = await this.prisma.gtk.count({
      where: { sekolah_id: filter.sekolah_id }
    });

    // Cari Kepala Sekolah dengan kriteria lebih luas
    const kepalaSekolah = await this.prisma.gtk.findFirst({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { 
            OR: [
              { jabatan_ptk_id_str: { contains: 'Kepala Sekolah', mode: 'insensitive' } },
              { jenis_ptk_id_str: { contains: 'Kepala Sekolah', mode: 'insensitive' } },
              { ptk_induk: { contains: 'Kepala Sekolah', mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: { nama: true, jabatan_ptk_id_str: true, jenis_ptk_id_str: true, status: true }
    });


    return {
      ...sekolah,
      nama_kepala_sekolah: kepalaSekolah?.nama || null
    };
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

  async getPesertaDidik(sekolahId: string | null, limit: number = 10, search?: string, page: number = 1, rombelName?: string, status?: 'aktif' | 'non-aktif', tingkat?: string) {
    const filter = this.getSekolahFilter(sekolahId);
    
    let whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
        { NOT: { nama_rombel: { contains: 'Ekstrakurikuler', mode: 'insensitive' } } },
      ],
    };

    if (rombelName) {
      whereClause.AND[1] = { nama_rombel: rombelName };
    }

    if (tingkat && tingkat !== 'all') {
      let rombelPrefix = '';
      if (tingkat === '10') rombelPrefix = 'X';
      else if (tingkat === '11') rombelPrefix = 'XI';
      else if (tingkat === '12') rombelPrefix = 'XII';

      if (rombelPrefix) {
        if (rombelPrefix === 'X') {
          // Khusus X: harus X tapi bukan XI (dan otomatis bukan XII)
          whereClause.AND.push({
            nama_rombel: { startsWith: 'X', mode: 'insensitive' },
          });
          whereClause.AND.push({
            NOT: { nama_rombel: { startsWith: 'XI', mode: 'insensitive' } },
          });
        } else if (rombelPrefix === 'XI') {
          // Khusus XI: harus XI tapi bukan XII
          whereClause.AND.push({
            nama_rombel: { startsWith: 'XI', mode: 'insensitive' },
          });
          whereClause.AND.push({
            NOT: { nama_rombel: { startsWith: 'XII', mode: 'insensitive' } },
          });
        } else {
          // Khusus XII
          whereClause.AND.push({
            nama_rombel: { startsWith: 'XII', mode: 'insensitive' },
          });
        }
      }
    }

    if (status === 'aktif') {
      whereClause.AND.push({ status: 'Aktif' });
    } else if (status === 'non-aktif') {
      whereClause.AND.push({ NOT: { status: 'Aktif' } });
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
  async getPdRekapTingkat(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    // Get all active students
    const students = await this.prisma.pesertaDidik.findMany({
      where: {
        sekolah_id: filter.sekolah_id,
        status: 'Aktif',
      },
      select: {
        nama_rombel: true,
        jenis_kelamin: true,
        jenis_pendaftaran_id_str: true,
      }
    });

    const rekapMap = new Map();
    // Default levels
    ['10', '11', '12'].forEach(tingkat => {
      rekapMap.set(tingkat, { tingkat, l: 0, p: 0, total: 0, siswaBaru: 0, pindahan: 0, mengulang: 0 });
    });

    students.forEach(pd => {
      let t = 'Lainnya';
      if (pd.nama_rombel) {
        if (pd.nama_rombel.startsWith('XII')) t = '12';
        else if (pd.nama_rombel.startsWith('XI')) t = '11';
        else if (pd.nama_rombel.startsWith('X')) t = '10';
      }

      if (!rekapMap.has(t)) {
        rekapMap.set(t, { tingkat: t, l: 0, p: 0, total: 0, siswaBaru: 0, pindahan: 0, mengulang: 0 });
      }
      const data = rekapMap.get(t);
      if (pd.jenis_kelamin === 'L') data.l += 1;
      if (pd.jenis_kelamin === 'P') data.p += 1;
      data.total += 1;
      
      const jp = (pd.jenis_pendaftaran_id_str || '').toLowerCase();
      if (jp.includes('siswa baru')) data.siswaBaru += 1;
      else if (jp.includes('pindahan')) data.pindahan += 1;
      else if (jp.includes('mengulang')) data.mengulang += 1;
    });

    return Array.from(rekapMap.values());
  }

  async getPdRekapKompetensi(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    const rombels = await this.prisma.rombonganBelajar.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { jurusan_id_str: { not: null } },
          { jenis_rombel_str: { not: 'Ekstrakurikuler' } },
        ],
      },
      select: {
        nama: true,
        jurusan_id_str: true,
      },
    });

    const jurusanMap = new Map<string, string>();
    rombels.forEach((r: any) => {
      const parts = r.nama.split(' ');
      let kode = parts.length > 1 ? parts[1] : parts[0];
      if (!jurusanMap.has(kode) && r.jurusan_id_str) {
        jurusanMap.set(kode, r.jurusan_id_str);
      }
    });

    const students = await this.prisma.pesertaDidik.findMany({
      where: {
        sekolah_id: filter.sekolah_id,
        status: 'Aktif',
        nama_rombel: { not: null }
      },
      select: {
        nama_rombel: true,
        jenis_kelamin: true,
      }
    });

    const rekapMap = new Map();
    
    students.forEach(pd => {
      const rombel = pd.nama_rombel || '';
      const parts = rombel.split(' ');
      let kode = parts.length > 1 ? parts[1] : 'Umum';
      if (kode === 'MIPA' || kode === 'IPS') kode = parts[1];
      
      const namaJurusan = jurusanMap.get(kode);
      const kompetensiName = namaJurusan ? `${namaJurusan} (${kode})` : kode;

      if (!rekapMap.has(kode)) {
        rekapMap.set(kode, {
          kompetensi: kompetensiName,
          xL: 0, xP: 0, xJml: 0,
          xiL: 0, xiP: 0, xiJml: 0,
          xiiL: 0, xiiP: 0, xiiJml: 0,
          grandTotal: 0
        });
      }
      
      const data = rekapMap.get(kode);
      const isL = pd.jenis_kelamin === 'L';
      const isP = pd.jenis_kelamin === 'P';
      
      let t = '';
      if (rombel.startsWith('XII')) t = '12';
      else if (rombel.startsWith('XI')) t = '11';
      else if (rombel.startsWith('X')) t = '10';

      if (t === '10') {
        if (isL) data.xL += 1;
        if (isP) data.xP += 1;
        data.xJml += 1;
      } else if (t === '11') {
        if (isL) data.xiL += 1;
        if (isP) data.xiP += 1;
        data.xiJml += 1;
      } else if (t === '12') {
        if (isL) data.xiiL += 1;
        if (isP) data.xiiP += 1;
        data.xiiJml += 1;
      }
      
      data.grandTotal += 1;
    });

    return Array.from(rekapMap.values()).sort((a: any, b: any) => a.kompetensi.localeCompare(b.kompetensi));
  }

  async getPdRekapUsia(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    const students = await this.prisma.pesertaDidik.findMany({
      where: {
        sekolah_id: filter.sekolah_id,
        status: 'Aktif',
      },
      select: {
        tanggal_lahir: true,
        tingkat_pendidikan_id: true,
        jenis_kelamin: true,
      }
    });

    const now = new Date();
    const result = {
      '< 15 Tahun': { l: 0, p: 0, total: 0 },
      '15 Tahun': { l: 0, p: 0, total: 0 },
      '16 Tahun': { l: 0, p: 0, total: 0 },
      '17 Tahun': { l: 0, p: 0, total: 0 },
      '18 Tahun': { l: 0, p: 0, total: 0 },
      '> 18 Tahun': { l: 0, p: 0, total: 0 }
    };

    students.forEach(pd => {
      if (!pd.tanggal_lahir) return;
      
      const birthDate = new Date(pd.tanggal_lahir);
      let age = now.getFullYear() - birthDate.getFullYear();
      const m = now.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
        age--;
      }

      let category = '';
      if (age < 15) category = '< 15 Tahun';
      else if (age === 15) category = '15 Tahun';
      else if (age === 16) category = '16 Tahun';
      else if (age === 17) category = '17 Tahun';
      else if (age === 18) category = '18 Tahun';
      else category = '> 18 Tahun';

      // @ts-ignore
      const data = result[category];
      if (pd.jenis_kelamin === 'L') data.l += 1;
      if (pd.jenis_kelamin === 'P') data.p += 1;
      data.total += 1;
    });

    return Object.keys(result).map(key => ({
      usia: key,
      // @ts-ignore
      l: result[key].l,
      // @ts-ignore
      p: result[key].p,
      // @ts-ignore
      total: result[key].total
    }));
  }
  async getRombonganBelajar(sekolahId: string | null, type?: 'reguler' | 'pilihan', limit: number = 10, page: number = 1, search?: string, tingkat?: string) {
    const filter = this.getSekolahFilter(sekolahId);
    
    let whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
      ],
    };

    if (type === 'reguler') {
      whereClause.AND.push({ jenis_rombel_str: 'Kelas' });
    } else if (type === 'pilihan') {
      whereClause.AND.push({ jenis_rombel_str: 'Matapelajaran Pilihan' });
    } else {
      whereClause.AND.push({ jenis_rombel_str: { not: 'Ekstrakurikuler' } });
    }

    if (tingkat && tingkat !== 'all') {
      whereClause.AND.push({ tingkat_pendidikan_id: tingkat });
    }

    if (search) {
      whereClause.AND.push({
        OR: [
          { nama: { contains: search, mode: 'insensitive' } },
          { ptk_id_str: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.rombonganBelajar.count({ where: whereClause }),
      this.prisma.rombonganBelajar.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        select: {
          rombongan_belajar_id: true,
          nama: true,
          tingkat_pendidikan_id_str: true,
          jurusan_id_str: true,
          kurikulum_id_str: true,
          ptk_id_str: true,
          id_ruang_str: true,
          jenis_rombel_str: true,
          _count: {
            select: { anggota_rombel: true }
          }
        },
        orderBy: { nama: 'asc' },
      })
    ]);

    return {
      total,
      data: data.map(item => ({
        ...item,
        jumlah_siswa: item._count.anggota_rombel
      }))
    };
  }

  async getRombelAnggota(rombelId: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(rombelId)) {
      return [];
    }

    // Ambil data siswa yang terdaftar di rombel ini
    // Kita bisa ambil dari anggotaRombel (tabel relasi) 
    // ATAU dari PesertaDidik langsung (karena syncSiswa menyimpan rombongan_belajar_id)
    
    const anggota = await this.prisma.anggotaRombel.findMany({
      where: { rombongan_belajar_id: rombelId },
      select: { peserta_didik_id: true },
    });

    let pdIds = anggota.map((a) => a.peserta_didik_id);

    if (pdIds.length > 0) {
      return await this.prisma.pesertaDidik.findMany({
        where: {
          peserta_didik_id: { in: pdIds },
        },
        select: {
          peserta_didik_id: true,
          nama: true,
          nisn: true,
          nipd: true,
          jenis_kelamin: true,
          foto: true,
        },
        orderBy: { nama: 'asc' },
      });
    }

    // Jika di anggotaRombel kosong, coba cari langsung di tabel PesertaDidik
    // karena syncSiswa biasanya mengisi rombongan_belajar_id di sana
    return await this.prisma.pesertaDidik.findMany({
      where: {
        rombongan_belajar_id: rombelId,
        status: 'Aktif'
      },
      select: {
        peserta_didik_id: true,
        nama: true,
        nisn: true,
        nipd: true,
        jenis_kelamin: true,
        foto: true,
      },
      orderBy: { nama: 'asc' },
    });
  }

  async getEkstrakurikuler(sekolahId: string | null, search?: string) {
    const filter = this.getSekolahFilter(sekolahId);
    
    let whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
        { jenis_rombel_str: 'Ekstrakurikuler' },
      ],
    };

    if (search) {
      whereClause.AND.push({
        OR: [
          { nm_ekskul: { contains: search, mode: 'insensitive' } },
          { nama: { contains: search, mode: 'insensitive' } },
          { ptk_id_str: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const data = await this.prisma.rombonganBelajar.findMany({
      where: whereClause,
      select: {
        rombongan_belajar_id: true,
        nm_ekskul: true,
        nama: true,
        ptk_id_str: true,
        id_ruang_str: true,
        _count: {
          select: { anggota_rombel: true }
        }
      },
      orderBy: { nama: 'asc' },
    });

    return data.map(item => ({
      ...item,
      anggotaRombel: item._count.anggota_rombel
    }));
  }

  async getJurusan(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);

    const rombels = await this.prisma.rombonganBelajar.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { jurusan_id_str: { not: null } },
          { jenis_rombel_str: { not: 'Ekstrakurikuler' } },
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

  async getGtk(sekolahId: string | null, limit: number = 10, search?: string, page: number = 1, type?: 'guru' | 'tendik', status?: 'aktif' | 'non-aktif') {
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

    if (status === 'aktif') {
      whereClause.AND.push({ status: 'Aktif' });
    } else if (status === 'non-aktif') {
      whereClause.AND.push({ NOT: { status: 'Aktif' } });
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

  async getGtkById(sekolahId: string, id: string) {
    return await this.prisma.gtk.findFirst({
      where: {
        AND: [{ ptk_id: id }, { sekolah_id: sekolahId }],
      },
      include: {
        penggunas: {
          select: { email: true },
        },
        rwy_sertifikasi: {
          include: {
            bidang_studi: true,
            lemb_sertifikasi: true,
          }
        }
      },
    });
  }

  async updateGtk(sekolahId: string, id: string, data: any) {
    // Handle JSON fields
    const updateData: any = { ...data };
    delete updateData.ptk_id;
    delete updateData.sekolah_id;

    const emailAkun = updateData.email_akun;
    delete updateData.email_akun;

    if (updateData.tmt_pengangkatan) {
      updateData.tmt_pengangkatan = new Date(updateData.tmt_pengangkatan);
    }
    if (updateData.tanggal_surat_tugas) {
      updateData.tanggal_surat_tugas = new Date(updateData.tanggal_surat_tugas);
    }
    if (updateData.tmt_cpns) {
      updateData.tmt_cpns = new Date(updateData.tmt_cpns);
    }
    if (updateData.tmt_pns) {
      updateData.tmt_pns = new Date(updateData.tmt_pns);
    }

    const updatedGtk = await this.prisma.gtk.update({
      where: { ptk_id: id },
      data: updateData,
    });

    if (emailAkun !== undefined) {
      await this.prisma.pengguna.updateMany({
        where: { ptk_id: id },
        data: { email: emailAkun || null },
      });
    }

    return updatedGtk;
  }

  async getPesertaDidikById(sekolahId: string, id: string) {
    return await this.prisma.pesertaDidik.findFirst({
      where: {
        AND: [{ peserta_didik_id: id }, { sekolah_id: sekolahId }],
      },
      include: {
        penggunas: {
          select: { email: true },
        },
      },
    });
  }

  async updatePesertaDidik(sekolahId: string, id: string, data: any) {
    const updateData: any = { ...data };
    delete updateData.peserta_didik_id;
    delete updateData.sekolah_id;

    const emailAkun = updateData.email_akun;
    delete updateData.email_akun;

    if (updateData.tanggal_lahir) {
      updateData.tanggal_lahir = new Date(updateData.tanggal_lahir);
    }
    if (updateData.tanggal_masuk_sekolah) {
      updateData.tanggal_masuk_sekolah = new Date(updateData.tanggal_masuk_sekolah);
    }

    const updatedPd = await this.prisma.pesertaDidik.update({
      where: { peserta_didik_id: id },
      data: updateData,
    });

    if (emailAkun !== undefined) {
      await this.prisma.pengguna.updateMany({
        where: { peserta_didik_id: id },
        data: { email: emailAkun || null },
      });
    }

    return updatedPd;
  }

  async getGtkRekapKategori(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    // Ambil semua GTK aktif untuk sekolah ini
    const gtks = await this.prisma.gtk.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { status: 'Aktif' }
        ]
      },
      select: {
        jenis_ptk_id_str: true,
        jenis_kelamin: true,
        status_kepegawaian_id_str: true,
      }
    });

    const isGuru = (j: string) => (j || '').toLowerCase().includes('guru');
    const isAsn = (s: string) => ['pns', 'pppk'].includes((s || '').toLowerCase());

    const guru = gtks.filter(i => isGuru(i.jenis_ptk_id_str));
    const tendik = gtks.filter(i => !isGuru(i.jenis_ptk_id_str));

    return [
      {
        id: 1,
        kategori: "Guru",
        lakiLaki: guru.filter(i => i.jenis_kelamin === 'L').length,
        perempuan: guru.filter(i => i.jenis_kelamin === 'P').length,
        totalJK: guru.length,
        asn: guru.filter(i => isAsn(i.status_kepegawaian_id_str)).length,
        nonAsn: guru.filter(i => !isAsn(i.status_kepegawaian_id_str)).length,
        totalStatus: guru.length
      },
      {
        id: 2,
        kategori: "Tendik",
        lakiLaki: tendik.filter(i => i.jenis_kelamin === 'L').length,
        perempuan: tendik.filter(i => i.jenis_kelamin === 'P').length,
        totalJK: tendik.length,
        asn: tendik.filter(i => isAsn(i.status_kepegawaian_id_str)).length,
        nonAsn: tendik.filter(i => !isAsn(i.status_kepegawaian_id_str)).length,
        totalStatus: tendik.length
      }
    ];
  }

  async getGtkRekapPendidikan(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    const gtks = await this.prisma.gtk.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { status: 'Aktif' }
        ]
      },
      select: {
        pendidikan_terakhir: true,
        jenis_kelamin: true,
        status_kepegawaian_id_str: true,
      }
    });

    const isAsn = (s: string) => ['pns', 'pppk'].includes((s || '').toLowerCase());
    
    const categories = [
      { label: "S2/Pasca Sarjana", keys: ["S2"] },
      { label: "S1/Sarjana", keys: ["S1", null, ""] },
      { label: "D3/Diploma", keys: ["D3"] },
      { label: "SMA/Sederajat", keys: ["SMA", "SMK"] },
    ];

    return categories.map((cat, idx) => {
      const subset = gtks.filter(i => {
        if (cat.keys.includes(null) && !i.pendidikan_terakhir) return true;
        return cat.keys.includes(i.pendidikan_terakhir);
      });

      return {
        id: idx + 1,
        pendidikan: cat.label,
        lakiLaki: subset.filter(i => i.jenis_kelamin === 'L').length,
        perempuan: subset.filter(i => i.jenis_kelamin === 'P').length,
        totalJK: subset.length,
        asn: subset.filter(i => isAsn(i.status_kepegawaian_id_str)).length,
        nonAsn: subset.filter(i => !isAsn(i.status_kepegawaian_id_str)).length,
        totalStatus: subset.length
      };
    });
  }

  async getGtkRekapUsia(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    const gtks = await this.prisma.gtk.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { status: 'Aktif' }
        ]
      },
      select: {
        tanggal_lahir: true,
        jenis_kelamin: true,
        status_kepegawaian_id_str: true,
      }
    });

    const isAsn = (s: string) => ['pns', 'pppk'].includes((s || '').toLowerCase());
    const calculateAge = (birthDate: Date | null) => {
      if (!birthDate) return 0;
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    const ranges = [
      { label: "< 30 Tahun", min: 0, max: 30 },
      { label: "31 - 40 Tahun", min: 31, max: 40 },
      { label: "41 - 50 Tahun", min: 41, max: 50 },
      { label: "> 50 Tahun", min: 51, max: 150 },
    ];

    return ranges.map((range, idx) => {
      const subset = gtks.filter(i => {
        const age = calculateAge(i.tanggal_lahir);
        return age >= range.min && age <= range.max;
      });

      return {
        id: idx + 1,
        rentangUsia: range.label,
        lakiLaki: subset.filter(i => i.jenis_kelamin === 'L').length,
        perempuan: subset.filter(i => i.jenis_kelamin === 'P').length,
        totalJK: subset.length,
        asn: subset.filter(i => isAsn(i.status_kepegawaian_id_str)).length,
        nonAsn: subset.filter(i => !isAsn(i.status_kepegawaian_id_str)).length,
        totalStatus: subset.length
      };
    });
  }
}
