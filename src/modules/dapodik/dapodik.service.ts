import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ReferenceService } from '../reference/reference.service';

@Injectable()
export class DapodikService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly referenceService: ReferenceService,
  ) {}

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
   * Resolve hierarki wilayah dari kode_wilayah (desa) ke atas:
   * kecamatan, kabupaten/kota, provinsi, negara.
   * Walk up parent chain via mst_kode_wilayah, identify level via id_level_wilayah:
   *   4 = desa/kelurahan, 3 = kecamatan, 2 = kabupaten/kota, 1 = provinsi, 0 = negara
   */
  private async resolveWilayahHierarchy(kodeWilayah: string | null) {
    const result = {
      desa: null as string | null,
      kecamatan: null as string | null,
      kabupaten: null as string | null,
      provinsi: null as string | null,
      negara: null as string | null,
    };

    if (!kodeWilayah) return result;

    try {
      let currentKode: string | null = kodeWilayah.trim();
      let maxDepth = 6; // Safety limit agar tidak infinite loop

      while (currentKode && maxDepth > 0) {
        const wil = await this.prisma.mst_wilayah.findUnique({
          where: { kode_wilayah: currentKode },
          select: { nama: true, id_level_wilayah: true, mst_kode_wilayah: true },
        });

        if (!wil) break;

        switch (wil.id_level_wilayah) {
          case 4: result.desa = wil.nama; break;
          case 3: result.kecamatan = wil.nama; break;
          case 2: result.kabupaten = wil.nama; break;
          case 1: result.provinsi = wil.nama; break;
          case 0: result.negara = wil.nama; break;
        }

        currentKode = wil.mst_kode_wilayah?.trim() || null;
        maxDepth--;
      }
    } catch (e) {
      // Jika tabel ref belum ada datanya, tetap kembalikan null
    }

    return result;
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
    if (!sekolahId) return null;

    const semesterId = await this.getLatestSemesterId(sekolahId);

    const [totalTanah, totalBangunan, totalRuang, totalSiswa, totalGtk, totalRombel] = await Promise.all([
      this.prisma.tanah.count({ where: { sekolah_id: sekolahId } }),
      this.prisma.bangunan.count({ where: { sekolah_id: sekolahId } }),
      this.prisma.ruang.count({ where: { sekolah_id: sekolahId } }),
      this.prisma.pesertaDidik.count({ 
        where: { 
          sekolah_id: sekolahId,
          status: 'Aktif'
        } 
      }),
      this.prisma.gtk.count({ 
        where: { 
          sekolah_id: sekolahId,
          status: 'Aktif'
        } 
      }),
      this.prisma.rombonganBelajar.count({ 
        where: { 
          sekolah_id: sekolahId,
          semester_id: semesterId || undefined,
          jenis_rombel: 1 // 1 for Kelas
        } 
      }),
    ]);

    return {
      sekolah_id: sekolahId,
      total_tanah: totalTanah,
      total_bangunan: totalBangunan,
      total_ruang: totalRuang,
      total_siswa: totalSiswa,
      total_pd: totalSiswa,
      total_gtk: totalGtk,
      total_rombel: totalRombel,
    };
  }

  async getSekolah(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    const sekolah = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: filter.sekolah_id },
    });

    if (!sekolah) return null;

    // Resolve reference table names/strings dynamically
    let bentuk_pendidikan_id_str = null;
    if (sekolah.bentuk_pendidikan_id) {
      const bp = await this.prisma.bentuk_pendidikan.findUnique({
        where: { bentuk_pendidikan_id: sekolah.bentuk_pendidikan_id },
        select: { nama: true }
      });
      bentuk_pendidikan_id_str = bp?.nama || null;
    }

    let kode_wilayah_str = null;
    if (sekolah.kode_wilayah) {
      const wil = await this.prisma.mst_wilayah.findUnique({
        where: { kode_wilayah: sekolah.kode_wilayah },
        select: { nama: true }
      });
      kode_wilayah_str = wil?.nama || null;
    }

    // Resolve hierarki wilayah: kecamatan, kabupaten, provinsi, negara
    const wilayahHierarchy = await this.resolveWilayahHierarchy(sekolah.kode_wilayah);

    let kebutuhan_khusus_id_str = null;
    if (sekolah.kebutuhan_khusus_id) {
      const kk = await this.prisma.kebutuhan_khusus.findUnique({
        where: { kebutuhan_khusus_id: sekolah.kebutuhan_khusus_id },
        select: { kebutuhan_khusus: true }
      });
      kebutuhan_khusus_id_str = kk?.kebutuhan_khusus || null;
    }

    let status_kepemilikan_id_str = null;
    if (sekolah.status_kepemilikan_id) {
      const sk = await this.prisma.status_kepemilikan.findUnique({
        where: { status_kepemilikan_id: Number(sekolah.status_kepemilikan_id) },
        select: { nama: true }
      });
      status_kepemilikan_id_str = sk?.nama || null;
    }

    let status_sekolah_str = null;
    if (sekolah.status_sekolah) {
      if (sekolah.status_sekolah === '1') status_sekolah_str = 'Negeri';
      else if (sekolah.status_sekolah === '2') status_sekolah_str = 'Swasta';
    }

    // 1. Cari Kepala Sekolah dari tabel pengguna
    let kepalaSekolah = await this.prisma.pengguna.findFirst({
      where: {
        sekolah_id: filter.sekolah_id,
        peran_nama: { contains: 'Kepala Sekolah', mode: 'insensitive' }
      },
      select: { nama: true }
    });

    let namaKepalaSekolah = kepalaSekolah?.nama || null;

    // Fallback ke tabel GTK jika tidak ditemukan di pengguna
    if (!namaKepalaSekolah) {
      const kepalaSekolahGtk = await this.prisma.gtk.findFirst({
        where: {
          AND: [
            { sekolah_id: filter.sekolah_id },
            { 
              OR: [
                { jenis_ptk: { jenis_ptk: { contains: 'Kepala Sekolah', mode: 'insensitive' } } },
                { jabatan_ptk: { jabatan_ptk: { contains: 'Kepala Sekolah', mode: 'insensitive' } } }
              ]
            }
          ]
        },
        select: { nama: true }
      });
      namaKepalaSekolah = kepalaSekolahGtk?.nama || null;
    }

    // 2. Cari Operator Sekolah dari tabel pengguna
    const operatorSekolah = await this.prisma.pengguna.findFirst({
      where: {
        sekolah_id: filter.sekolah_id,
        peran_nama: { contains: 'Operator Sekolah', mode: 'insensitive' }
      },
      select: { nama: true }
    });

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const logoUrl = sekolah.logo ? (sekolah.logo.startsWith('http') ? sekolah.logo : `${appUrl}${sekolah.logo}`) : null;

    return {
      ...sekolah,
      bentuk_pendidikan_id_str,
      kode_wilayah_str,
      kecamatan: wilayahHierarchy.kecamatan,
      kabupaten: wilayahHierarchy.kabupaten,
      provinsi: wilayahHierarchy.provinsi,
      negara: wilayahHierarchy.negara,
      kebutuhan_khusus_id_str,
      status_kepemilikan_id_str,
      status_sekolah_str,
      logo: logoUrl,
      nama_kepala_sekolah: namaKepalaSekolah,
      nama_operator: operatorSekolah?.nama || null
    };
  }

  async updateSekolah(sekolahId: string, data: any) {
    return await this.prisma.sekolah.update({
      where: { sekolah_id: sekolahId },
      data: {
        nama: data.nama,
        npsn: data.npsn,
        nomor_telepon: data.nomor_telepon,
        nomor_fax: data.nomor_fax,
        email: data.email,
        website: data.website,
        social_media: data.social_media,
        cadisdik_id: data.cadisdik_id !== undefined ? (data.cadisdik_id !== "" && data.cadisdik_id !== null ? data.cadisdik_id : null) : undefined,
        radius: data.radius !== undefined ? (data.radius !== null && data.radius !== "" ? Number(data.radius) : null) : undefined,
      },
    });
  }

  async uploadLogo(sekolahId: string, file: Express.Multer.File) {
    const path = require('path');
    const { compressAndSaveImage } = require('../../common/utils/upload.util');
    
    const destDir = path.join(process.cwd(), 'storage', sekolahId);
    const fileName = 'logo'; // sharp helper will append .jpg automatically

    // Kompres & Simpan logo
    await compressAndSaveImage(file.buffer, destDir, fileName);

    // Path relatif untuk diakses klien
    const relativePath = `/storage/${sekolahId}/logo.jpg`;

    return await this.prisma.sekolah.update({
      where: { sekolah_id: sekolahId },
      data: { logo: relativePath },
    });
  }

  async uploadSiswaFoto(sekolahId: string, uuidSiswa: string, file: Express.Multer.File) {
    const path = require('path');
    const { compressAndSaveImage } = require('../../common/utils/upload.util');
    
    // Validasi siswa ada dan milik sekolah ini
    const siswa = await this.prisma.pesertaDidik.findFirst({
      where: { peserta_didik_id: uuidSiswa, sekolah_id: sekolahId }
    });
    if (!siswa) {
      throw new Error('Siswa tidak ditemukan atau tidak terdaftar di sekolah Anda.');
    }

    const destDir = path.join(process.cwd(), 'storage', sekolahId, 'siswa', uuidSiswa);
    const fileName = 'foto_profil'; // sharp helper will append .jpg automatically

    // Kompres & Simpan foto
    const savedPath = await compressAndSaveImage(file.buffer, destDir, fileName);

    // Path yang disimpan di DB (untuk diakses web client)
    const relativePath = `/storage/${sekolahId}/siswa/${uuidSiswa}/foto_profil.jpg`;

    await this.prisma.pesertaDidik.update({
      where: { peserta_didik_id: uuidSiswa },
      data: { foto: relativePath }
    });

    return {
      filePath: relativePath,
      savedPath
    };
  }

  async uploadGtkFoto(sekolahId: string, uuidGtk: string, file: Express.Multer.File) {
    const path = require('path');
    const { compressAndSaveImage } = require('../../common/utils/upload.util');
    
    // Validasi GTK ada dan milik sekolah ini
    const gtk = await this.prisma.gtk.findFirst({
      where: { ptk_id: uuidGtk, sekolah_id: sekolahId }
    });
    if (!gtk) {
      throw new Error('GTK tidak ditemukan atau tidak terdaftar di sekolah Anda.');
    }

    const destDir = path.join(process.cwd(), 'storage', sekolahId, 'gtk', uuidGtk);
    const fileName = 'foto_profil'; // sharp helper will append .jpg automatically

    // Kompres & Simpan foto
    const savedPath = await compressAndSaveImage(file.buffer, destDir, fileName);

    // Path yang disimpan di DB (untuk diakses web client)
    const relativePath = `/storage/${sekolahId}/gtk/${uuidGtk}/foto_profil.jpg`;

    await this.prisma.gtk.update({
      where: { ptk_id: uuidGtk },
      data: { foto: relativePath }
    });

    return {
      filePath: relativePath,
      savedPath
    };
  }

  async uploadSiswaDokumen(sekolahId: string, uuidSiswa: string, file: Express.Multer.File, docName: string) {
    const path = require('path');
    const { compressAndSaveImage, saveDocument } = require('../../common/utils/upload.util');

    const siswa = await this.prisma.pesertaDidik.findFirst({
      where: { peserta_didik_id: uuidSiswa, sekolah_id: sekolahId }
    });
    if (!siswa) {
      throw new Error('Siswa tidak ditemukan atau tidak terdaftar di sekolah Anda.');
    }

    const destDir = path.join(process.cwd(), 'storage', sekolahId, 'siswa', uuidSiswa, 'dokumen');
    
    const fileExt = path.extname(file.originalname).toLowerCase();
    const cleanDocName = docName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const finalFileName = `${cleanDocName}${fileExt}`;

    let savedPath = '';
    let isCompressed = false;

    // Jika file adalah gambar, kompres di bawah 100KB
    if (['.jpg', '.jpeg', '.png', '.webp'].includes(fileExt)) {
      savedPath = await compressAndSaveImage(file.buffer, destDir, finalFileName);
      isCompressed = true;
    } else if (fileExt === '.pdf') {
      // Jika file PDF, simpan dengan validasi di bawah 200KB
      savedPath = saveDocument(file.buffer, destDir, finalFileName, 200 * 1024);
    } else {
      throw new Error('Format dokumen tidak didukung. Gunakan PDF atau Gambar (JPG, PNG, WebP).');
    }

    const savedFileName = path.basename(savedPath);
    const relativePath = `/storage/${sekolahId}/siswa/${uuidSiswa}/dokumen/${savedFileName}`;

    return {
      fileName: savedFileName,
      filePath: relativePath,
      isCompressed,
      sizeBytes: file.buffer.length
    };
  }

  async uploadGtkDokumen(sekolahId: string, uuidGtk: string, file: Express.Multer.File, docName: string) {
    const path = require('path');
    const { compressAndSaveImage, saveDocument } = require('../../common/utils/upload.util');

    const gtk = await this.prisma.gtk.findFirst({
      where: { ptk_id: uuidGtk, sekolah_id: sekolahId }
    });
    if (!gtk) {
      throw new Error('GTK tidak ditemukan atau tidak terdaftar di sekolah Anda.');
    }

    const destDir = path.join(process.cwd(), 'storage', sekolahId, 'gtk', uuidGtk, 'dokumen');
    
    const fileExt = path.extname(file.originalname).toLowerCase();
    const cleanDocName = docName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const finalFileName = `${cleanDocName}${fileExt}`;

    let savedPath = '';
    let isCompressed = false;

    if (['.jpg', '.jpeg', '.png', '.webp'].includes(fileExt)) {
      savedPath = await compressAndSaveImage(file.buffer, destDir, finalFileName);
      isCompressed = true;
    } else if (fileExt === '.pdf') {
      savedPath = saveDocument(file.buffer, destDir, finalFileName, 200 * 1024);
    } else {
      throw new Error('Format dokumen tidak didukung. Gunakan PDF atau Gambar (JPG, PNG, WebP).');
    }

    const savedFileName = path.basename(savedPath);
    const relativePath = `/storage/${sekolahId}/gtk/${uuidGtk}/dokumen/${savedFileName}`;

    return {
      fileName: savedFileName,
      filePath: relativePath,
      isCompressed,
      sizeBytes: file.buffer.length
    };
  }

  async deleteGtkDokumen(sekolahId: string, uuidGtk: string, fileName: string) {
    const fs = require('fs');
    const path = require('path');
    const destFile = path.join(process.cwd(), 'storage', sekolahId, 'gtk', uuidGtk, 'dokumen', fileName);
    if (fs.existsSync(destFile)) {
      fs.unlinkSync(destFile);
    }
  }

  async deleteSiswaDokumen(sekolahId: string, uuidSiswa: string, fileName: string) {
    const fs = require('fs');
    const path = require('path');
    const destFile = path.join(process.cwd(), 'storage', sekolahId, 'siswa', uuidSiswa, 'dokumen', fileName);
    if (fs.existsSync(destFile)) {
      fs.unlinkSync(destFile);
    }
  }

  async getTanah(sekolahId: string | null, limit: number = 10, search?: string, page: number = 1) {
    const filter = this.getSekolahFilter(sekolahId);
    let whereClause: any = {
      AND: [{ sekolah_id: filter.sekolah_id }],
    };

    if (search) {
      whereClause.AND.push({
        OR: [
          { nama: { contains: search, mode: 'insensitive' } },
          { alamat_jalan: { contains: search, mode: 'insensitive' } },
          { no_sertifikat_tanah: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.tanah.count({ where: whereClause }),
      this.prisma.tanah.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { nama: 'asc' },
      }),
    ]);

    return { total, data };
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

  async getBangunan(sekolahId: string | null, limit: number = 10, search?: string, page: number = 1) {
    const filter = this.getSekolahFilter(sekolahId);
    let whereClause: any = {
      AND: [{ sekolah_id: filter.sekolah_id }],
    };

    if (search) {
      whereClause.AND.push({
        OR: [
          { nama: { contains: search, mode: 'insensitive' } },
          { thn_dibangun: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.bangunan.count({ where: whereClause }),
      this.prisma.bangunan.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { nama: 'asc' },
      }),
    ]);

    return { total, data };
  }

  async getRuang(sekolahId: string | null, limit: number = 10, search?: string, page: number = 1) {
    const filter = this.getSekolahFilter(sekolahId);
    let whereClause: any = {
      AND: [{ sekolah_id: filter.sekolah_id }],
    };

    if (search) {
      whereClause.AND.push({
        OR: [
          { nm_ruang: { contains: search, mode: 'insensitive' } },
          { kd_ruang: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    const skip = (page - 1) * limit;

    const [total, data] = await Promise.all([
      this.prisma.ruang.count({ where: whereClause }),
      this.prisma.ruang.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { nm_ruang: 'asc' },
      }),
    ]);

    return { total, data };
  }

  async getPesertaDidik(sekolahId: string | null, limit: number = 10, search?: string, page: number = 1, rombelName?: string, status?: 'aktif' | 'non-aktif', tingkat?: string) {
    const filter = this.getSekolahFilter(sekolahId);
    
    let whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
      ],
    };

    // Filter rombel hanya jika mencari siswa aktif atau jika rombelName/tingkat ditentukan
    if (status !== 'non-aktif') {
      whereClause.AND.push({
        AND: [
          { NOT: { rombongan_belajar: { nama: { contains: 'Ekstrakurikuler', mode: 'insensitive' } } } },
          { NOT: { anggota_rombel: { some: { rombongan_belajar: { nama: { contains: 'Ekstrakurikuler', mode: 'insensitive' } } } } } }
        ]
      });
    }

    if (rombelName) {
      whereClause.AND.push({
        OR: [
          { rombongan_belajar: { nama: rombelName } },
          { anggota_rombel: { some: { rombongan_belajar: { nama: rombelName } } } }
        ]
      });
    }

    if (tingkat && tingkat !== 'all') {
      let rombelPrefix = '';
      if (tingkat === '10') rombelPrefix = 'X';
      else if (tingkat === '11') rombelPrefix = 'XI';
      else if (tingkat === '12') rombelPrefix = 'XII';

      if (rombelPrefix) {
        if (rombelPrefix === 'X') {
          whereClause.AND.push({
            OR: [
              {
                AND: [
                  { rombongan_belajar: { nama: { startsWith: 'X', mode: 'insensitive' } } },
                  { NOT: { rombongan_belajar: { nama: { startsWith: 'XI', mode: 'insensitive' } } } }
                ]
              },
              {
                AND: [
                  { anggota_rombel: { some: { rombongan_belajar: { nama: { startsWith: 'X', mode: 'insensitive' } } } } },
                  { NOT: { anggota_rombel: { some: { rombongan_belajar: { nama: { startsWith: 'XI', mode: 'insensitive' } } } } } }
                ]
              }
            ]
          });
        } else if (rombelPrefix === 'XI') {
          whereClause.AND.push({
            OR: [
              {
                AND: [
                  { rombongan_belajar: { nama: { startsWith: 'XI', mode: 'insensitive' } } },
                  { NOT: { rombongan_belajar: { nama: { startsWith: 'XII', mode: 'insensitive' } } } }
                ]
              },
              {
                AND: [
                  { anggota_rombel: { some: { rombongan_belajar: { nama: { startsWith: 'XI', mode: 'insensitive' } } } } },
                  { NOT: { anggota_rombel: { some: { rombongan_belajar: { nama: { startsWith: 'XII', mode: 'insensitive' } } } } } }
                ]
              }
            ]
          });
        } else {
          whereClause.AND.push({
            OR: [
              { rombongan_belajar: { nama: { startsWith: 'XII', mode: 'insensitive' } } },
              { anggota_rombel: { some: { rombongan_belajar: { nama: { startsWith: 'XII', mode: 'insensitive' } } } } }
            ]
          });
        }
      }
    }

    // Default to 'aktif' if status is not specified
    if (status === 'aktif' || !status) {
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

    const [total, data, refJenisPendaftaran] = await Promise.all([
      this.prisma.pesertaDidik.count({ where: whereClause }),
      this.prisma.pesertaDidik.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        select: {
          peserta_didik_id: true,
          nama: true,
          nisn: true,
          nipd: true,
          nik: true,
          no_kk: true,
          jenis_kelamin: true,
          foto: true,
          qr_token: true,
          tempat_lahir: true,
          tanggal_lahir: true,
          jenis_keluar_id: true,
          keterangan: true,
          tanggal_keluar: true,
          status: true,
          tanggal_masuk_sekolah: true,
          jenis_pendaftaran_id: true,
          alamat_jalan: true,
          rt: true,
          rw: true,
          desa_kelurahan: true,
          nomor_telepon_seluler: true,
          email: true,
          nama_ayah: true,
          nama_ibu_kandung: true,
          rombongan_belajar: {
            select: {
              nama: true,
              tingkat_pendidikan_id: true,
            }
          },
          anggota_rombel: {
            where: {
              rombongan_belajar: {
                jenis_rombel: 1,
              }
            },
            select: {
              rombongan_belajar: {
                select: {
                  nama: true,
                  tingkat_pendidikan_id: true,
                }
              }
            }
          },
          agama: {
            select: {
              nama: true,
            }
          }
        },
        orderBy: { nama: 'asc' },
      }),
      this.prisma.jenis_pendaftaran.findMany({
        select: {
          jenis_pendaftaran_id: true,
          nama: true
        }
      })
    ]);

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const formattedData = data.map((item: any) => {
      const jp = refJenisPendaftaran.find(
        (r: any) => String(r.jenis_pendaftaran_id) === String(item.jenis_pendaftaran_id)
      );

      const rombel = item.rombongan_belajar || item.anggota_rombel?.[0]?.rombongan_belajar;

      return {
        ...item,
        foto: item.foto ? (item.foto.startsWith('http') ? item.foto : `${appUrl}${item.foto}`) : null,
        nama_rombel: rombel?.nama || null,
        tingkat_pendidikan_id: rombel?.tingkat_pendidikan_id ? String(rombel.tingkat_pendidikan_id) : null,
        agama_id_str: item.agama?.nama || null,
        nama_ibu: item.nama_ibu_kandung || null,
        ket_keluar: item.keterangan || null,
        provinsi: null,
        kabupaten_kota: null,
        kecamatan: null,
        tinggi_badan: null,
        berat_badan: null,
        jenis_pendaftaran_id_str: jp?.nama || null,
      };
    });

    return { total, data: formattedData };
  }

  async getPesertaDidikForMandala(
    sekolahId: string,
    query: {
      limit: number;
      page: number;
      search?: string;
      status?: 'aktif' | 'non-aktif';
    }
  ) {
    const { limit, page, search, status } = query;

    const whereClause: any = {
      sekolah_id: sekolahId,
    };

    if (search) {
      whereClause.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nisn: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Default to 'aktif' if status is not specified
    if (status === 'aktif' || !status) {
      whereClause.status = 'Aktif';
    } else if (status === 'non-aktif') {
      whereClause.status = { not: 'Aktif' };
    }

    const skip = (page - 1) * limit;

    const [total, students] = await Promise.all([
      this.prisma.pesertaDidik.count({ where: whereClause }),
      this.prisma.pesertaDidik.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        include: {
          rombongan_belajar: true,
          agama: true,
        },
        orderBy: { nama: 'asc' },
      }),
    ]);

    const formattedData = students.map((pd: any) => {
      // Construct alamat lengkap
      const addressParts = [
        pd.alamat_jalan,
        pd.rt ? `RT ${pd.rt}` : null,
        pd.rw ? `RW ${pd.rw}` : null,
        pd.nama_dusun ? `Dusun ${pd.nama_dusun}` : null,
        pd.desa_kelurahan ? `Desa/Kel. ${pd.desa_kelurahan}` : null,
        pd.kode_pos
      ].filter(Boolean);
      const alamatLengkap = addressParts.length > 0 ? addressParts.join(', ') : '';

      // Select HP Orang Tua
      const hpOrangTua = pd.nomor_telepon_seluler || '';

      return {
        identitas: {
          id: pd.peserta_didik_id,
          nama: pd.nama,
          nisn: pd.nisn,
          nik: pd.nik,
          jenis_kelamin: pd.jenis_kelamin,
          tempat_lahir: pd.tempat_lahir,
          tanggal_lahir: pd.tanggal_lahir,
          agama: pd.agama?.nama || pd.agama_id || '',
        },
        akademik: {
          nama_rombel: pd.rombongan_belajar?.nama || '',
          tingkat: pd.rombongan_belajar?.tingkat_pendidikan_id?.toString() || '',
          jurusan: pd.rombongan_belajar?.jurusan_sp_id || '',
        },
        data_pendukung: {
          alamat_lengkap: alamatLengkap,
          nama_ayah: pd.nama_ayah || '',
          nama_ibu: pd.nama_ibu_kandung || '',
          hp_orang_tua: hpOrangTua,
        },
      };
    });

    return {
      status: 'success',
      data: formattedData,
      total_data: total,
      total_pages: Math.ceil(total / limit),
      current_page: page,
      meta: {
        total_data: total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
      },
    };
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
        jenis_kelamin: true,
        jenis_pendaftaran_id: true,
        rombongan_belajar: {
          select: {
            nama: true,
          }
        }
      }
    });

    const rekapMap = new Map();
    // Default levels
    ['10', '11', '12'].forEach(tingkat => {
      rekapMap.set(tingkat, { tingkat, l: 0, p: 0, total: 0, siswaBaru: 0, pindahan: 0, mengulang: 0 });
    });

    students.forEach((pd: any) => {
      const nama_rombel = pd.rombongan_belajar?.nama || null;
      let t = 'Lainnya';
      if (nama_rombel) {
        if (nama_rombel.startsWith('XII')) t = '12';
        else if (nama_rombel.startsWith('XI')) t = '11';
        else if (nama_rombel.startsWith('X')) t = '10';
      }

      if (!rekapMap.has(t)) {
        rekapMap.set(t, { tingkat: t, l: 0, p: 0, total: 0, siswaBaru: 0, pindahan: 0, mengulang: 0 });
      }
      const data = rekapMap.get(t);
      if (pd.jenis_kelamin === 'L') data.l += 1;
      if (pd.jenis_kelamin === 'P') data.p += 1;
      data.total += 1;
      
      const jpNum = pd.jenis_pendaftaran_id ? Number(pd.jenis_pendaftaran_id) : 1;
      if (jpNum === 1) data.siswaBaru += 1;
      else if (jpNum === 2) data.pindahan += 1;
      else data.mengulang += 1;
    });

    return Array.from(rekapMap.values());
  }

  async getPdRekapKompetensi(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    const rombels = await this.prisma.rombonganBelajar.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { jurusan_sp_id: { not: null } },
        ],
      },
      select: {
        nama: true,
        jurusan_sp_id: true,
      },
    });

    const jurusanMap = new Map<string, string>();
    rombels.forEach((r: any) => {
      const parts = r.nama.split(' ');
      let kode = parts.length > 1 ? parts[1] : parts[0];
      if (!jurusanMap.has(kode) && r.jurusan_sp_id) {
        jurusanMap.set(kode, r.jurusan_sp_id);
      }
    });

    const students = await this.prisma.pesertaDidik.findMany({
      where: {
        sekolah_id: filter.sekolah_id,
        status: 'Aktif',
        rombongan_belajar_id: { not: null }
      },
      select: {
        jenis_kelamin: true,
        rombongan_belajar: {
          select: {
            nama: true,
          }
        }
      }
    });

    const rekapMap = new Map();
    
    students.forEach((pd: any) => {
      const rombel = pd.rombongan_belajar?.nama || '';
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

    async getCadisdiks() {
    return await this.prisma.cadisdik.findMany({
      where: { aktif: true },
      orderBy: { nama_instansi: 'asc' },
    });
  }

  async getLayananMaster(sekolahId: string | null, kategori?: number) {
    if (!sekolahId) return [];
    const sekolah = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: sekolahId },
      select: { cadisdik_id: true }
    });
    if (!sekolah?.cadisdik_id) return [];

    return await this.prisma.layanan.findMany({
      where: {
        cadisdik_id: sekolah.cadisdik_id,
        aktif: true,
        ...(kategori !== undefined ? { kategori } : {}),
      },
      include: {
        syarat: {
          where: { aktif: true },
          orderBy: { urutan: 'asc' },
        },
      },
      orderBy: { nama_layanan: 'asc' },
    });
  }

  async getPermohonanLayanan(filters: { sekolah_id?: string; status?: number; kategori?: number }) {
    const where: any = {};
    if (filters.sekolah_id) where.sekolah_id = filters.sekolah_id;
    if (filters.status !== undefined) where.status = filters.status;
    if (filters.kategori !== undefined) where.kategori = filters.kategori;

    const results = await this.prisma.permohonanLayanan.findMany({
      where,
      include: {
        layanan: {
          include: {
            syarat: {
              orderBy: { urutan: 'asc' }
            }
          }
        },
        permohonan_layanan_file: {
          include: { layanan_syarat: true }
        },
        permohonan_layanan_log: {
          orderBy: { created_at: 'desc' },
          include: { pegawai: { select: { nama_lengkap: true } } }
        },
      },
      orderBy: { created_at: 'desc' },
    });

    // Manually enrich with ptk and peserta_didik data if needed since cross-schema relations might be missing or tricky
    const enrichedResults = await Promise.all(results.map(async (item) => {
      let ptk = null;
      let peserta_didik = null;

      if (item.ptk_id) {
        ptk = await this.prisma.gtk.findUnique({ where: { ptk_id: item.ptk_id } });
      }
      if (item.peserta_didik_id) {
        peserta_didik = await this.prisma.pesertaDidik.findUnique({ where: { peserta_didik_id: item.peserta_didik_id } });
      }

      return {
        ...item,
        ptk,
        peserta_didik,
      };
    }));

    return enrichedResults;
  }

  async createPermohonanLayanan(dto: any) {
    if (dto.kategori === 0) {
      if (!dto.ptk_id) throw new Error('ptk_id wajib diisi untuk kategori GTK');
      dto.peserta_didik_id = null;
    } else if (dto.kategori === 1) {
      if (!dto.peserta_didik_id) throw new Error('peserta_didik_id wajib diisi untuk kategori Peserta Didik');
      dto.ptk_id = null;
    } else if (dto.kategori === 2) {
      dto.ptk_id = null;
      dto.peserta_didik_id = null;
    }

    // Resolve cadisdik_id from sekolah
    const sekolah = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: dto.sekolah_id },
      select: { cadisdik_id: true }
    });
    if (!sekolah?.cadisdik_id) {
      throw new Error('Sekolah tidak terasosiasi dengan Cabang Dinas (Cadisdik)');
    }

    const nomorPermohonan = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return await this.prisma.permohonanLayanan.create({
      data: {
        cadisdik_id: sekolah.cadisdik_id,
        sekolah_id: dto.sekolah_id,
        layanan_id: dto.layanan_id,
        kategori: dto.kategori,
        ptk_id: dto.ptk_id,
        peserta_didik_id: dto.peserta_didik_id,
        nomor_permohonan: nomorPermohonan,
        keterangan: dto.keterangan,
        status: 1, // Diajukan
        tanggal_pengajuan: new Date(),
      },
    });
  }

  async getRombelRekapKategori(sekolahId: string | null) {
    return [];
  }

  async getRombelRekapKompetensi(sekolahId: string | null) {
    return [];
  }

  async getRombonganBelajar(sekolahId: string | null, type?: 'reguler' | 'pilihan', limit: number = 10, page: number = 1, search?: string, tingkat?: string) {
    const filter = this.getSekolahFilter(sekolahId);
    
    let whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
      ],
    };

    if (type === 'reguler') {
      whereClause.AND.push({ jenis_rombel: 1 }); // 1 for Kelas
    } else if (type === 'pilihan') {
      whereClause.AND.push({ jenis_rombel: 14 }); // 14 for Pilihan
    }

    if (tingkat && tingkat !== 'all') {
      whereClause.AND.push({ tingkat_pendidikan_id: Number(tingkat) });
    }

    if (search) {
      whereClause.AND.push({
        nama: { contains: search, mode: 'insensitive' },
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
          tingkat_pendidikan_id: true,
          kurikulum_id: true,
          ptk_id: true,
          id_ruang: true,
          jenis_rombel: true,
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
          qr_token: true,
        },
        orderBy: { nama: 'asc' },
      });
    }

    const students = await this.prisma.pesertaDidik.findMany({
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
        qr_token: true,
      },
      orderBy: { nama: 'asc' },
    });

    return students;
  }

  async getRombelPembelajaran(rombelId: string) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(rombelId)) {
      return [];
    }

    // 1. Cari dulu nama rombel ini
    const rombel = await this.prisma.rombonganBelajar.findUnique({
      where: { rombongan_belajar_id: rombelId },
      select: { nama: true, sekolah_id: true },
    });

    if (!rombel) return [];

    // 2. Cari semua rombel yang namanya sama (untuk menarik Matapelajaran Pilihan yang namanya sama dengan Kelas)
    const relatedRombels = await this.prisma.rombonganBelajar.findMany({
      where: {
        nama: rombel.nama,
        sekolah_id: rombel.sekolah_id,
        jenis_rombel: { in: [1, 14] }, // Kelas (1) and Matapelajaran Pilihan (14)
      },
      select: { rombongan_belajar_id: true },
    });

    const rombelIds = relatedRombels.map((r) => r.rombongan_belajar_id);

    // 3. Tarik semua pembelajaran dari rombel-rombel tersebut
    return this.prisma.pembelajaran.findMany({
      where: { rombongan_belajar_id: { in: rombelIds } },
      select: {
        pembelajaran_id: true,
        nama_mata_pelajaran: true,
        jam_mengajar_per_minggu: true,
        ptk_id: true,
        gtk: {
          select: {
            nama: true,
            sekolah_id: true,
          },
        },
      },
      orderBy: { nama_mata_pelajaran: 'asc' },
    });
  }

  async getEkstrakurikuler(sekolahId: string | null, search?: string) {
    const filter = this.getSekolahFilter(sekolahId);
    
    let whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
        { jenis_rombel: 5 }, // 5 for Ekstrakurikuler
      ],
    };

    if (search) {
      whereClause.AND.push({
        nama: { contains: search, mode: 'insensitive' },
      });
    }

    const data = await this.prisma.rombonganBelajar.findMany({
      where: whereClause,
      select: {
        rombongan_belajar_id: true,
        nama: true,
        id_ruang: true,
        _count: {
          select: { anggota_rombel: true }
        }
      },
      orderBy: { nama: 'asc' },
    });

    return data.map(item => ({
      ...item,
      nm_ekskul: item.nama,
      anggotaRombel: item._count.anggota_rombel
    }));
  }

  async getJurusan(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);

    const rombels = await this.prisma.rombonganBelajar.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { jurusan_sp_id: { not: null } },
        ],
      },
      select: {
        nama: true,
        jurusan_sp_id: true,
      },
    });

    const jurusanMap = new Map();
    rombels.forEach((r: any) => {
      const parts = r.nama.split(' ');
      let kode = parts.length > 1 ? parts[1] : parts[0];
      if (!jurusanMap.has(kode)) {
        jurusanMap.set(kode, r.jurusan_sp_id);
      }
    });

    return Array.from(jurusanMap.entries()).map(([kode, id]) => ({
      kode,
      nama: kode,
      jurusan_sp_id: id
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

  async getAllPembelajaran(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    return this.prisma.pembelajaran.findMany({
      where: { sekolah_id: filter.sekolah_id },
      select: {
        pembelajaran_id: true,
        rombongan_belajar_id: true,
        nama_mata_pelajaran: true,
        jam_mengajar_per_minggu: true,
        ptk_id: true,
        gtk: {
          select: {
            nama: true,
          },
        },
        rombongan_belajar: {
          select: {
            rombongan_belajar_id: true,
            nama: true,
          },
        },
      },
      orderBy: { nama_mata_pelajaran: 'asc' },
    });
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
      whereClause.AND.push({
        jenis_ptk: {
          is: {
            jenis_ptk: { contains: 'Guru', mode: 'insensitive' }
          }
        }
      });
    } else if (type === 'tendik') {
      whereClause.AND.push({
        jenis_ptk: {
          is: {
            NOT: {
              jenis_ptk: { contains: 'Guru', mode: 'insensitive' }
            }
          }
        }
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
        select: {
          ptk_id: true,
          nama: true,
          nuptk: true,
          nik: true,
          nip: true,
          foto: true,
          qr_token: true,
          ptk_induk: true,
          jenis_kelamin: true,
          tempat_lahir: true,
          tanggal_lahir: true,
          nama_ibu_kandung: true,
          alamat_jalan: true,
          tanggal_surat_tugas: true,
          status: true,
          no_kk: true,
          no_hp: true,
          email: true,
          sk_pengangkatan: true,
          tmt_pengangkatan: true,
          last_update: true,
          jenis_ptk: {
            select: { jenis_ptk: true }
          },
          status_kepegawaian: {
            select: { nama: true }
          },
          jabatan_ptk: {
            select: { jabatan_ptk: true }
          },
          sumber_gaji: {
            select: { nama: true }
          },
          riwayat_pendidikan_formal: {
            select: {
              jenjang_pendidikan_id: true
            }
          }
        },
        orderBy: { nama: 'asc' },
      }),
    ]);

    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    const getPendidikanTerakhir = (riwayat: { jenjang_pendidikan_id: any }[]): string => {
      const ids = riwayat.map(r => r.jenjang_pendidikan_id ? Number(r.jenjang_pendidikan_id) : 0);
      if (ids.some(id => id === 40 || id === 41)) return 'S3';
      if (ids.some(id => id === 35 || id === 36)) return 'S2';
      if (ids.some(id => id === 30 || id === 31 || id === 23)) return 'S1';
      if (ids.some(id => id === 22)) return 'D3';
      if (ids.some(id => id === 21)) return 'D2';
      if (ids.some(id => id === 20)) return 'D1';
      if (ids.some(id => id === 6 || id === 9)) return 'SMA';
      return '';
    };

    const formattedData = data.map(item => ({
      ptk_id: item.ptk_id,
      nama: item.nama,
      nuptk: item.nuptk,
      nik: item.nik,
      nip: item.nip,
      foto: item.foto ? (item.foto.startsWith('http') ? item.foto : `${appUrl}${item.foto}`) : null,
      qr_token: item.qr_token,
      ptk_induk: item.ptk_induk,
      jenis_kelamin: item.jenis_kelamin,
      tempat_lahir: item.tempat_lahir,
      tanggal_lahir: item.tanggal_lahir,
      nama_ibu_kandung: item.nama_ibu_kandung,
      alamat_jalan: item.alamat_jalan,
      tanggal_surat_tugas: item.tanggal_surat_tugas,
      status: item.status,
      no_kk: item.no_kk,
      no_hp: item.no_hp,
      email: item.email,
      sk_pengangkatan: item.sk_pengangkatan,
      tmt_pengangkatan: item.tmt_pengangkatan,
      jabatan_ptk_id_str: item.jabatan_ptk?.jabatan_ptk || null,
      jenis_ptk_id_str: item.jenis_ptk?.jenis_ptk || null,
      status_kepegawaian_id_str: item.status_kepegawaian?.nama || null,
      sumber_gaji: item.sumber_gaji?.nama || null,
      pendidikan_terakhir: getPendidikanTerakhir(item.riwayat_pendidikan_formal),
      updated_at: item.last_update,
    }));

    return { total, data: formattedData };
  }

  async getGtkById(sekolahId: string, id: string) {
    const gtk = await this.prisma.gtk.findFirst({
      where: {
        AND: [{ ptk_id: id }, { sekolah_id: sekolahId }],
      },
      include: {
        penggunas: {
          select: { email: true },
        },
        pembelajaran: {
          select: {
            rombongan_belajar: true,
            jam_mengajar_per_minggu: true,
          }
        },
        jenis_ptk: {
          select: { jenis_ptk: true }
        },
        status_kepegawaian: {
          select: { nama: true }
        },
        jabatan_ptk: {
          select: { jabatan_ptk: true }
        },
        sumber_gaji: {
          select: { nama: true }
        },
        riwayat_pendidikan_formal: {
          include: {
            jenjang_pendidikan: true
          }
        },
        rwy_sertifikasi: true,
        rwy_kepangkatan: true,
      },
    });

    if (gtk) {
      const fs = require('fs');
      const path = require('path');
      const destDir = path.join(process.cwd(), 'storage', sekolahId, 'gtk', id, 'dokumen');
      let fotoDokumen: any[] = [];
      if (fs.existsSync(destDir)) {
        try {
          const files = fs.readdirSync(destDir);
          fotoDokumen = files.map((file: string, index: number) => {
            const baseName = file.substring(0, file.lastIndexOf('.'));
            const nameWords = baseName.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            return {
              id: index,
              nama: nameWords,
              fileName: file,
              fileUrl: `/storage/${sekolahId}/gtk/${id}/dokumen/${file}`
            };
          });
        } catch (e) {
          console.error('Error reading GTK documents directory:', e);
        }
      }
      const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const formattedFoto = gtk.foto ? (gtk.foto.startsWith('http') ? gtk.foto : `${appUrl}${gtk.foto}`) : null;
      // Resolve hierarki wilayah untuk GTK
      const wilayahHierarchy = await this.resolveWilayahHierarchy(gtk.kode_wilayah);

      const mappedRiwayat = gtk.riwayat_pendidikan_formal.map(edu => {
        const { jenjang_pendidikan, ...rest } = edu as any;
        return {
          ...rest,
          jenjang_pendidikan_id_str: jenjang_pendidikan?.nama || null,
          bidang_studi_id_str: null,
          gelar_akademik_id_str: null,
        };
      });

      // Sort by jenjang_pendidikan_id descending, if same sort by tahun_lulus descending
      let pendidikanTerakhir = null;
      let bidangStudiTerakhir = null;
      if (gtk.riwayat_pendidikan_formal && gtk.riwayat_pendidikan_formal.length > 0) {
        const sortedEdu = [...gtk.riwayat_pendidikan_formal].sort((a: any, b: any) => {
          const idA = a.jenjang_pendidikan_id ? Number(a.jenjang_pendidikan_id) : 0;
          const idB = b.jenjang_pendidikan_id ? Number(b.jenjang_pendidikan_id) : 0;
          if (idB !== idA) return idB - idA;
          const yrA = a.tahun_lulus ? Number(a.tahun_lulus) : 0;
          const yrB = b.tahun_lulus ? Number(b.tahun_lulus) : 0;
          return yrB - yrA;
        });
        const highest = sortedEdu[0];
        pendidikanTerakhir = highest.jenjang_pendidikan?.nama || null;
        bidangStudiTerakhir = highest.satuan_pendidikan_formal || null;
      }

      const g = gtk as any;
      const resolved = await this.referenceService.resolveGtk(gtk);
      return {
        ...resolved,
        riwayat_pendidikan_formal: mappedRiwayat,
        foto: formattedFoto,
        foto_dokumen: fotoDokumen,
        desa_kelurahan: resolved.desa_kelurahan || wilayahHierarchy.desa,
        kecamatan: wilayahHierarchy.kecamatan,
        kabupaten: wilayahHierarchy.kabupaten,
        provinsi: wilayahHierarchy.provinsi,
        negara: wilayahHierarchy.negara,
        pendidikan_terakhir: resolved.pendidikan_terakhir || pendidikanTerakhir,
        bidang_studi_terakhir: resolved.bidang_studi_terakhir || bidangStudiTerakhir,
        jenis_ptk_id_str: g.jenis_ptk?.jenis_ptk || null,
        status_kepegawaian_id_str: g.status_kepegawaian?.nama || null,
        jabatan_ptk_id_str: g.jabatan_ptk?.jabatan_ptk || null,
        sumber_gaji_id_str: g.sumber_gaji?.nama || null,
      };
    }
    return null;
  }

  async updateGtk(sekolahId: string, id: string, data: any) {
    // Handle JSON fields
    const updateData: any = { ...data };
    delete updateData.ptk_id;
    delete updateData.sekolah_id;

    const emailAkun = updateData.email_akun;
    delete updateData.email_akun;

    if (updateData.foto && updateData.foto.startsWith('http')) {
      try {
        const url = new URL(updateData.foto);
        updateData.foto = url.pathname;
      } catch (e) {
        // ignore
      }
    }

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

    const cleanData: any = {};
    const safeGtkFields = [
      'nama', 'nip', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'nik', 'no_kk',
      'niy_nigk', 'nuptk', 'nrg', 'nuks', 'alamat_jalan', 'rt', 'rw', 'nama_dusun',
      'desa_kelurahan', 'kode_wilayah', 'kode_pos', 'lintang', 'bujur', 'no_telepon_rumah',
      'no_hp', 'email', 'status_keaktifan_id', 'sk_cpns', 'tgl_cpns', 'sk_pengangkatan',
      'tmt_pengangkatan', 'nama_ibu_kandung', 'status_perkawinan', 'nama_suami_istri',
      'nip_suami_istri', 'tmt_pns', 'sudah_lisensi_kepala_sekolah', 'jumlah_sekolah_binaan',
      'pernah_diklat_kepengawasan', 'nm_wp', 'status_data', 'karpeg', 'karpas', 'mampu_handle_kk',
      'keahlian_braille', 'keahlian_bhs_isyarat', 'npwp', 'kewarganegaraan', 'rekening_bank',
      'rekening_atas_nama', 'ptk_terdaftar_id', 'jenis_keluar_id', 'tahun_ajaran_id',
      'nomor_surat_tugas', 'tanggal_surat_tugas', 'tgl_ptk_keluar', 'status', 'foto', 'qr_token',
      'nama_kcp'
    ];

    for (const field of safeGtkFields) {
      if (updateData[field] !== undefined) {
        cleanData[field] = updateData[field];
      }
    }

    const mapNumeric = (val: any) => (val !== undefined && val !== null && val !== '' ? Number(val) : undefined);
    const mapString = (val: any) => (val !== undefined && val !== null && val !== '' ? String(val) : undefined);

    if (updateData.status_perkawinan !== undefined) cleanData.status_perkawinan = mapNumeric(updateData.status_perkawinan);

    if (updateData.agama_id !== undefined) cleanData.agama_id = mapNumeric(updateData.agama_id);
    else if (updateData.agama_id_str !== undefined) cleanData.agama_id = mapNumeric(updateData.agama_id_str);

    if (updateData.id_bank !== undefined) cleanData.id_bank = mapString(updateData.id_bank);
    else if (updateData.namaBank !== undefined) cleanData.id_bank = mapString(updateData.namaBank);

    if (updateData.jenis_ptk_id !== undefined) cleanData.jenis_ptk_id = mapNumeric(updateData.jenis_ptk_id);
    else if (updateData.jenis_ptk_id_str !== undefined) cleanData.jenis_ptk_id = mapNumeric(updateData.jenis_ptk_id_str);

    if (updateData.jabatan_ptk_id !== undefined) cleanData.jabatan_ptk_id = mapNumeric(updateData.jabatan_ptk_id);
    else if (updateData.jabatan_ptk_id_str !== undefined) cleanData.jabatan_ptk_id = mapNumeric(updateData.jabatan_ptk_id_str);

    if (updateData.status_kepegawaian_id !== undefined) cleanData.status_kepegawaian_id = mapNumeric(updateData.status_kepegawaian_id);
    else if (updateData.status_kepegawaian_id_str !== undefined) cleanData.status_kepegawaian_id = mapNumeric(updateData.status_kepegawaian_id_str);

    if (updateData.sumber_gaji_id !== undefined) cleanData.sumber_gaji_id = mapNumeric(updateData.sumber_gaji_id);
    else if (updateData.sumber_gaji !== undefined) cleanData.sumber_gaji_id = mapNumeric(updateData.sumber_gaji);

    if (updateData.lembaga_pengangkat_id !== undefined) cleanData.lembaga_pengangkat_id = mapNumeric(updateData.lembaga_pengangkat_id);
    else if (updateData.lembaga_pengangkat !== undefined) cleanData.lembaga_pengangkat_id = mapNumeric(updateData.lembaga_pengangkat);

    if (updateData.pangkat_golongan_id !== undefined) cleanData.pangkat_golongan_id = mapNumeric(updateData.pangkat_golongan_id);
    else if (updateData.pangkat_golongan_terakhir !== undefined) cleanData.pangkat_golongan_id = mapNumeric(updateData.pangkat_golongan_terakhir);

    if (updateData.keahlian_laboratorium_id !== undefined) cleanData.keahlian_laboratorium_id = mapNumeric(updateData.keahlian_laboratorium_id);
    else if (updateData.keahlian_laboratorium !== undefined) cleanData.keahlian_laboratorium_id = mapNumeric(updateData.keahlian_laboratorium);

    if (updateData.kebutuhan_khusus_id !== undefined) cleanData.kebutuhan_khusus_id = mapNumeric(updateData.kebutuhan_khusus_id);
    else if (updateData.mampu_menangani_kebutuhan_khusus !== undefined) cleanData.kebutuhan_khusus_id = mapNumeric(updateData.mampu_menangani_kebutuhan_khusus);

    if (updateData.pekerjaan_suami_istri !== undefined) cleanData.pekerjaan_suami_istri = mapNumeric(updateData.pekerjaan_suami_istri);
    if (updateData.ptk_induk !== undefined) cleanData.ptk_induk = mapNumeric(updateData.ptk_induk);

    const updatedGtk = await this.prisma.gtk.update({
      where: { ptk_id: id },
      data: cleanData,
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
    const student = await this.prisma.pesertaDidik.findFirst({
      where: {
        AND: [{ peserta_didik_id: id }, { sekolah_id: sekolahId }],
      },
      include: {
        penggunas: {
          select: { email: true },
        },
      },
    });

    if (student) {
      const fs = require('fs');
      const path = require('path');
      const destDir = path.join(process.cwd(), 'storage', sekolahId, 'siswa', id, 'dokumen');
      let uploadedDocs: string[] = [];
      if (fs.existsSync(destDir)) {
        try {
          uploadedDocs = fs.readdirSync(destDir);
        } catch (e) {
          console.error('Error reading student documents directory:', e);
        }
      }
       const appUrl = process.env.APP_URL || 'http://localhost:3000';
      const formattedFoto = student.foto ? (student.foto.startsWith('http') ? student.foto : `${appUrl}${student.foto}`) : null;
      // Resolve hierarki wilayah untuk Peserta Didik
      const wilayahHierarchy = await this.resolveWilayahHierarchy(student.kode_wilayah);
      const resolved = await this.referenceService.resolvePesertaDidik(student);

       return {
        ...resolved,
        foto: formattedFoto,
        uploaded_docs: uploadedDocs,
        desa_kelurahan: resolved.desa_kelurahan || wilayahHierarchy.desa,
        kecamatan: wilayahHierarchy.kecamatan,
        kabupaten: wilayahHierarchy.kabupaten,
        provinsi: wilayahHierarchy.provinsi,
        negara: wilayahHierarchy.negara,
      };
    }
    return null;
  }

  async updatePesertaDidik(sekolahId: string, id: string, data: any) {
    const updateData: any = { ...data };
    delete updateData.peserta_didik_id;
    delete updateData.sekolah_id;

    const emailAkun = updateData.email_akun;
    delete updateData.email_akun;

    if (updateData.foto && updateData.foto.startsWith('http')) {
      try {
        const url = new URL(updateData.foto);
        updateData.foto = url.pathname;
      } catch (e) {
        // ignore
      }
    }

    if (updateData.tanggal_lahir) {
      updateData.tanggal_lahir = new Date(updateData.tanggal_lahir);
    }
    if (updateData.tanggal_masuk_sekolah) {
      updateData.tanggal_masuk_sekolah = new Date(updateData.tanggal_masuk_sekolah);
    }

    const cleanData: any = {};
    const safePdFields = [
      'nama', 'jenis_kelamin', 'nisn', 'nik', 'no_kk', 'tempat_lahir', 'tanggal_lahir',
      'alamat_jalan', 'rt', 'rw', 'nama_dusun', 'desa_kelurahan', 'kode_wilayah', 'kode_pos',
      'lintang', 'bujur', 'nik_ayah', 'nik_ibu', 'anak_keberapa', 'nik_wali', 'nomor_telepon_rumah',
      'nomor_telepon_seluler', 'email', 'no_kps', 'no_kip', 'nm_kip', 'no_kks', 'reg_akta_lahir',
      'rekening_bank', 'nama_kcp', 'rekening_atas_nama', 'status_data', 'nama_ayah', 'tahun_lahir_ayah',
      'nama_ibu_kandung', 'tahun_lahir_ibu', 'nama_wali', 'tahun_lahir_wali', 'kewarganegaraan',
      'registrasi_id', 'jurusan_sp_id', 'nipd', 'tanggal_masuk_sekolah', 'tanggal_keluar',
      'keterangan', 'no_skhun', 'no_peserta_ujian', 'no_seri_ijazah', 'sekolah_asal',
      'qr_token', 'foto', 'status', 'rombongan_belajar_id', 'soft_delete'
    ];

    for (const field of safePdFields) {
      if (updateData[field] !== undefined) {
        cleanData[field] = updateData[field];
      }
    }

    const mapNumeric = (val: any) => (val !== undefined && val !== null && val !== '' ? Number(val) : undefined);
    const mapString = (val: any) => (val !== undefined && val !== null && val !== '' ? String(val) : undefined);

    if (updateData.agama_id !== undefined) cleanData.agama_id = mapNumeric(updateData.agama_id);
    else if (updateData.agama_id_str !== undefined) cleanData.agama_id = mapNumeric(updateData.agama_id_str);

    if (updateData.id_bank !== undefined) cleanData.id_bank = mapString(updateData.id_bank);
    else if (updateData.id_bank_str !== undefined) cleanData.id_bank = mapString(updateData.id_bank_str);

    if (updateData.jenis_tinggal_id !== undefined) cleanData.jenis_tinggal_id = mapNumeric(updateData.jenis_tinggal_id);
    else if (updateData.jenis_tinggal_id_str !== undefined) cleanData.jenis_tinggal_id = mapNumeric(updateData.jenis_tinggal_id_str);

    if (updateData.alat_transportasi_id !== undefined) cleanData.alat_transportasi_id = mapNumeric(updateData.alat_transportasi_id);
    else if (updateData.alat_transportasi_id_str !== undefined) cleanData.alat_transportasi_id = mapNumeric(updateData.alat_transportasi_id_str);

    if (updateData.id_cita !== undefined) cleanData.id_cita = mapNumeric(updateData.id_cita);
    if (updateData.id_hobby !== undefined) cleanData.id_hobby = mapNumeric(updateData.id_hobby);
    if (updateData.id_layak_pip !== undefined) cleanData.id_layak_pip = mapNumeric(updateData.id_layak_pip);
    if (updateData.jenis_pendaftaran_id !== undefined) cleanData.jenis_pendaftaran_id = mapNumeric(updateData.jenis_pendaftaran_id);
    if (updateData.jenis_keluar_id !== undefined) cleanData.jenis_keluar_id = mapString(updateData.jenis_keluar_id);

    // Kebutuhan Khusus
    if (updateData.kebutuhan_khusus_id !== undefined) cleanData.kebutuhan_khusus_id = mapNumeric(updateData.kebutuhan_khusus_id);
    if (updateData.kebutuhan_khusus_id_ayah !== undefined) cleanData.kebutuhan_khusus_id_ayah = mapNumeric(updateData.kebutuhan_khusus_id_ayah);
    if (updateData.kebutuhan_khusus_id_ibu !== undefined) cleanData.kebutuhan_khusus_id_ibu = mapNumeric(updateData.kebutuhan_khusus_id_ibu);

    // Pekerjaan
    if (updateData.pekerjaan_id !== undefined) cleanData.pekerjaan_id = mapNumeric(updateData.pekerjaan_id);
    if (updateData.pekerjaan_id_ayah !== undefined) cleanData.pekerjaan_id_ayah = mapNumeric(updateData.pekerjaan_id_ayah);
    else if (updateData.pekerjaan_ayah_id_str !== undefined) cleanData.pekerjaan_id_ayah = mapNumeric(updateData.pekerjaan_ayah_id_str);

    if (updateData.pekerjaan_id_ibu !== undefined) cleanData.pekerjaan_id_ibu = mapNumeric(updateData.pekerjaan_id_ibu);
    else if (updateData.pekerjaan_ibu_id_str !== undefined) cleanData.pekerjaan_id_ibu = mapNumeric(updateData.pekerjaan_ibu_id_str);

    if (updateData.pekerjaan_id_wali !== undefined) cleanData.pekerjaan_id_wali = mapNumeric(updateData.pekerjaan_id_wali);
    else if (updateData.pekerjaan_wali_id_str !== undefined) cleanData.pekerjaan_id_wali = mapNumeric(updateData.pekerjaan_wali_id_str);

    // Jenjang Pendidikan
    if (updateData.jenjang_pendidikan_ayah !== undefined) cleanData.jenjang_pendidikan_ayah = mapNumeric(updateData.jenjang_pendidikan_ayah);
    else if (updateData.pendidikan_ayah_id_str !== undefined) cleanData.jenjang_pendidikan_ayah = mapNumeric(updateData.pendidikan_ayah_id_str);

    if (updateData.jenjang_pendidikan_ibu !== undefined) cleanData.jenjang_pendidikan_ibu = mapNumeric(updateData.jenjang_pendidikan_ibu);
    else if (updateData.pendidikan_ibu_id_str !== undefined) cleanData.jenjang_pendidikan_ibu = mapNumeric(updateData.pendidikan_ibu_id_str);

    if (updateData.jenjang_pendidikan_wali !== undefined) cleanData.jenjang_pendidikan_wali = mapNumeric(updateData.jenjang_pendidikan_wali);
    else if (updateData.pendidikan_wali_id_str !== undefined) cleanData.jenjang_pendidikan_wali = mapNumeric(updateData.pendidikan_wali_id_str);

    // Penghasilan
    if (updateData.penghasilan_id_ayah !== undefined) cleanData.penghasilan_id_ayah = mapNumeric(updateData.penghasilan_id_ayah);
    else if (updateData.penghasilan_ayah_id_str !== undefined) cleanData.penghasilan_id_ayah = mapNumeric(updateData.penghasilan_ayah_id_str);

    if (updateData.penghasilan_id_ibu !== undefined) cleanData.penghasilan_id_ibu = mapNumeric(updateData.penghasilan_id_ibu);
    else if (updateData.penghasilan_ibu_id_str !== undefined) cleanData.penghasilan_id_ibu = mapNumeric(updateData.penghasilan_ibu_id_str);

    if (updateData.penghasilan_id_wali !== undefined) cleanData.penghasilan_id_wali = mapNumeric(updateData.penghasilan_id_wali);
    else if (updateData.penghasilan_wali_id_str !== undefined) cleanData.penghasilan_id_wali = mapNumeric(updateData.penghasilan_wali_id_str);

    // Booleans
    if (updateData.penerima_kps !== undefined) cleanData.penerima_kps = mapNumeric(updateData.penerima_kps);
    if (updateData.penerima_kip !== undefined) cleanData.penerima_kip = mapNumeric(updateData.penerima_kip);
    if (updateData.layak_pip !== undefined) cleanData.layak_pip = mapNumeric(updateData.layak_pip);

    const updatedPd = await this.prisma.pesertaDidik.update({
      where: { peserta_didik_id: id },
      data: cleanData,
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
    
    const rawGtks = await this.prisma.gtk.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { status: 'Aktif' }
        ]
      },
      select: {
        jenis_kelamin: true,
        jenis_ptk: {
          select: { jenis_ptk: true }
        },
        status_kepegawaian: {
          select: { nama: true }
        },
      }
    });

    const gtks = rawGtks.map(g => ({
      jenis_ptk_id_str: g.jenis_ptk?.jenis_ptk || '',
      jenis_kelamin: g.jenis_kelamin,
      status_kepegawaian_id_str: g.status_kepegawaian?.nama || '',
    }));

    const isGuru = (j: string) => (j || '').toLowerCase().includes('guru');
    const isAsn = (s: string) => ['pns', 'pppk'].some(x => (s || '').toLowerCase().includes(x));

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
    
    const rawGtks = await this.prisma.gtk.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { status: 'Aktif' }
        ]
      },
      select: {
        jenis_kelamin: true,
        status_kepegawaian: {
          select: { nama: true }
        },
        riwayat_pendidikan_formal: {
          select: {
            riwayat_pendidikan_formal_id: true,
            satuan_pendidikan_formal: true,
            fakultas: true,
            kependidikan: true,
            tahun_masuk: true,
            tahun_lulus: true,
            nim: true,
            status_kuliah: true,
            semester: true,
            ipk: true,
            prodi: true,
            bidang_studi_id: true,
            jenjang_pendidikan_id: true,
            gelar_akademik_id: true,
          }
        }
      }
    });

    const getPendidikanTerakhir = (riwayat: { jenjang_pendidikan_id: any }[]): string => {
      const ids = riwayat.map(r => r.jenjang_pendidikan_id ? Number(r.jenjang_pendidikan_id) : 0);
      if (ids.some(id => id === 40 || id === 41)) return 'S3';
      if (ids.some(id => id === 35 || id === 36)) return 'S2';
      if (ids.some(id => id === 30 || id === 31 || id === 23)) return 'S1';
      if (ids.some(id => id === 22)) return 'D3';
      if (ids.some(id => id === 21)) return 'D2';
      if (ids.some(id => id === 20)) return 'D1';
      if (ids.some(id => id === 6 || id === 9)) return 'SMA';
      return '';
    };

    const gtks = rawGtks.map((g: any) => ({
      jenis_kelamin: g.jenis_kelamin,
      status_kepegawaian_nama: g.status_kepegawaian?.nama || '',
      pendidikan_terakhir: getPendidikanTerakhir(g.riwayat_pendidikan_formal)
    }));

    const isAsn = (s: string) => ['pns', 'pppk'].some(x => (s || '').toLowerCase().includes(x));
    
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
        asn: subset.filter(i => isAsn(i.status_kepegawaian_nama)).length,
        nonAsn: subset.filter(i => !isAsn(i.status_kepegawaian_nama)).length,
        totalStatus: subset.length
      };
    });
  }

  async getGtkRekapUsia(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    const rawGtks = await this.prisma.gtk.findMany({
      where: {
        AND: [
          { sekolah_id: filter.sekolah_id },
          { status: 'Aktif' }
        ]
      },
      select: {
        tanggal_lahir: true,
        jenis_kelamin: true,
        status_kepegawaian: {
          select: { nama: true }
        },
      }
    });

    const gtks = rawGtks.map(g => ({
      tanggal_lahir: g.tanggal_lahir,
      jenis_kelamin: g.jenis_kelamin,
      status_kepegawaian_nama: g.status_kepegawaian?.nama || ''
    }));

    const isAsn = (s: string) => ['pns', 'pppk'].some(x => (s || '').toLowerCase().includes(x));
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
        asn: subset.filter(i => isAsn(i.status_kepegawaian_nama)).length,
        nonAsn: subset.filter(i => !isAsn(i.status_kepegawaian_nama)).length,
        totalStatus: subset.length
      };
    });
  }

  // ========================
  // DUDI (Dunia Usaha & Industri)
  // ========================

  async getDudi(sekolahId: string) {
    const list = await this.prisma.dudi.findMany({
      where: { sekolah_id: sekolahId, soft_delete: { in: [null, 0] } },
      include: {
        mou: {
          where: { soft_delete: { in: [null, 0] } },
          orderBy: { tanggal_mulai: 'desc' },
        },
      },
      orderBy: { nama: 'asc' },
    });

    return list.map(d => ({
      ...d,
      jumlah_mou: d.mou.length,
    }));
  }

  async getDudiById(sekolahId: string, dudiId: string) {
    const dudi = await this.prisma.dudi.findFirst({
      where: { dudi_id: dudiId, sekolah_id: sekolahId },
      include: {
        mou: {
          where: { soft_delete: { in: [null, 0] } },
          orderBy: { tanggal_mulai: 'desc' },
          include: {
            akt_pd: {
              where: { soft_delete: { in: [null, 0] } },
              include: {
                anggota_akt_pd: {
                  where: { soft_delete: { in: [null, 0] } },
                  include: {
                    peserta_didik: {
                      select: { peserta_didik_id: true, nama: true, nisn: true },
                    },
                  },
                },
                bimbing_pd: {
                  where: { soft_delete: { in: [null, 0] } },
                  include: {
                    gtk: {
                      select: { ptk_id: true, nama: true, nuptk: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!dudi) return null;

    // Resolve wilayah hierarchy
    const wilayah = await this.resolveWilayahHierarchy(dudi.kode_wilayah);

    return {
      ...dudi,
      ...wilayah,
    };
  }
}
