import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { ReferenceService } from '../reference/reference.service';
import { Prisma } from '@prisma/client';

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
  private async resolveWilayahHierarchy(kodeWilayah: string | null, cache?: Map<string, any>) {
    const result = {
      desa: null as string | null,
      kecamatan: null as string | null,
      kabupaten: null as string | null,
      provinsi: null as string | null,
      negara: null as string | null,
    };

    if (!kodeWilayah) return result;
    const trimmed = kodeWilayah.trim();
    if (cache && cache.has(trimmed)) {
      return cache.get(trimmed);
    }

    try {
      let currentKode: string | null = trimmed;
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

    if (cache) {
      cache.set(trimmed, result);
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

    // Calculate GTK completeness
    const allGtk = await this.prisma.gtk.findMany({
      where: {
        sekolah_id: sekolahId,
        status: 'Aktif'
      },
      select: {
        ptk_id: true,
        nama: true,
        nuptk: true,
        nik: true,
        nip: true,
        ptk_induk: true,
        jenis_kelamin: true,
        tempat_lahir: true,
        tanggal_lahir: true,
        nama_ibu_kandung: true,
        alamat_jalan: true,
        rt: true,
        rw: true,
        nama_dusun: true,
        desa_kelurahan: true,
        kode_wilayah: true,
        kode_pos: true,
        lintang: true,
        bujur: true,
        status_perkawinan: true,
        nama_suami_istri: true,
        pekerjaan_suami_istri: true,
        nm_wp: true,
        npwp: true,
        id_bank: true,
        rekening_bank: true,
        rekening_atas_nama: true,
        nama_kcp: true,
        no_whatsapp: true,
        id_telegram: true,
        status: true,
        no_kk: true,
        no_hp: true,
        email: true,
        sumber_gaji: {
          select: { nama: true }
        },
        agama: {
          select: { nama: true }
        },
        rwy_sertifikasi: {
          select: { riwayat_sertifikasi_id: true }
        }
      }
    });

    const mappedGtk = allGtk.map((item: any) => {
      return {
        ...item,
        rt: item.rt !== null && item.rt !== undefined ? String(item.rt) : null,
        rw: item.rw !== null && item.rw !== undefined ? String(item.rw) : null,
        status_perkawinan: item.status_perkawinan !== null && item.status_perkawinan !== undefined ? String(item.status_perkawinan) : null,
        pekerjaan_suami_istri: item.pekerjaan_suami_istri !== null && item.pekerjaan_suami_istri !== undefined ? String(item.pekerjaan_suami_istri) : null,
        agama_id_str: item.agama?.nama || null,
        sumber_gaji: item.sumber_gaji?.nama || null,
        memilikiSertifikasi: item.rwy_sertifikasi && item.rwy_sertifikasi.length > 0 ? "Ya" : "Tidak",
      };
    });

    const checkGtkCompleteness = (item: any) => {
      const allFields = [
        'nama', 'nik', 'no_kk', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
        'nama_ibu_kandung', 'agama_id_str', 'status_perkawinan', 'nama_suami_istri',
        'pekerjaan_suami_istri', 'nm_wp', 'npwp', 'alamat_jalan', 'rt', 'rw',
        'nama_dusun', 'desa_kelurahan', 'provinsi', 'kabupaten_kota', 'kecamatan',
        'kode_pos', 'lintang', 'bujur', 'sumber_gaji', 'id_bank', 'rekening_bank',
        'rekening_atas_nama', 'nama_kcp', 'no_hp', 'no_whatsapp', 'id_telegram',
        'email', 'tanda_tangan'
      ];

      const isFieldFilled = (key: string) => {
        if (key === 'provinsi' || key === 'kabupaten_kota' || key === 'kecamatan') {
          const desa = item['desa_kelurahan'];
          const kodeWilayah = item['kode_wilayah'];
          if ((desa && desa !== '-' && desa !== '') || (kodeWilayah && kodeWilayah !== '-' && kodeWilayah !== '')) {
            return true;
          }
        }
        const value = item[key];
        if (value && value !== '-' && value !== '' && value !== 0 && value !== '0') {
          return true;
        }
        return false;
      };

      const fields = allFields.filter(key => {
        if (key === 'id_bank' || key === 'rekening_bank' || key === 'rekening_atas_nama' || key === 'nama_kcp') {
          return item['memilikiSertifikasi'] === 'Ya';
        }
        if (key === 'nama_suami_istri' || key === 'pekerjaan_suami_istri') {
          const statusPerkawinan = item['status_perkawinan'];
          return statusPerkawinan === '1' || statusPerkawinan === 1;
        }
        return true;
      });

      let filled = 0;
      fields.forEach(f => {
        if (isFieldFilled(f)) {
          filled++;
        }
      });
      return Math.round((filled / fields.length) * 100);
    };

    let completedGtkCount = 0;
    let totalGtkCompletenessPercentSum = 0;
    mappedGtk.forEach((gtk: any) => {
      const pct = checkGtkCompleteness(gtk);
      totalGtkCompletenessPercentSum += pct;
      if (pct === 100) {
        completedGtkCount++;
      }
    });

    const avgGtkCompleteness = mappedGtk.length > 0 ? Math.round((completedGtkCount / mappedGtk.length) * 100) : 0;

    // Calculate Student completeness
    const allStudents = await this.prisma.pesertaDidik.findMany({
      where: {
        sekolah_id: sekolahId,
        status: 'Aktif'
      },
      select: {
        peserta_didik_id: true,
        nama: true,
        nisn: true,
        nipd: true,
        nik: true,
        no_kk: true,
        jenis_kelamin: true,
        tempat_lahir: true,
        tanggal_lahir: true,
        alamat_jalan: true,
        rt: true,
        rw: true,
        desa_kelurahan: true,
        nomor_telepon_seluler: true,
        email: true,
        nama_ayah: true,
        nama_ibu_kandung: true,
        kode_wilayah: true,
        tinggi_badan: true,
        berat_badan: true,
        agama: {
          select: {
            nama: true,
          }
        },
        reg_akta_lahir: true,
        kebutuhan_khusus_id: true,
        anak_keberapa: true,
        nomor_telepon_rumah: true,
        no_whatsapp: true,
        email_aktif: true,
        nama_dusun: true,
        kode_pos: true,
        lintang: true,
        bujur: true,
        jenis_tinggal_id: true,
        alat_transportasi_id: true,
        lingkar_kepala: true,
        jarak_rumah_ke_sekolah: true,
        waktu_tempuh_ke_sekolah: true,
        menit_tempuh_ke_sekolah: true,
        jumlah_saudara_kandung: true,
        nik_ayah: true,
        tahun_lahir_ayah: true,
        jenjang_pendidikan_ayah: true,
        pekerjaan_id_ayah: true,
        penghasilan_id_ayah: true,
        nik_ibu: true,
        tahun_lahir_ibu: true,
        jenjang_pendidikan_ibu: true,
        pekerjaan_id_ibu: true,
        penghasilan_id_ibu: true,
        is_wali: true,
        nama_wali: true,
        nik_wali: true,
        tahun_lahir_wali: true,
        jenjang_pendidikan_wali: true,
        pekerjaan_id_wali: true,
        penghasilan_id_wali: true,
      }
    });

    const mappedStudents = allStudents.map((item: any) => {
      return {
        ...item,
        agama_id_str: item.agama?.nama || null,
        nama_ibu: item.nama_ibu_kandung || null,
        rt: item.rt !== null && item.rt !== undefined ? String(item.rt) : null,
        rw: item.rw !== null && item.rw !== undefined ? String(item.rw) : null,
        is_wali: item.is_wali === true || item.is_wali === 1 || item.is_wali === "1" || !!(item.nama_wali || item.nik_wali),
        tinggi_badan: item.tinggi_badan !== null && item.tinggi_badan !== undefined ? Number(item.tinggi_badan) : null,
        berat_badan: item.berat_badan !== null && item.berat_badan !== undefined ? Number(item.berat_badan) : null,
        lingkar_kepala: item.lingkar_kepala !== null && item.lingkar_kepala !== undefined ? Number(item.lingkar_kepala) : null,
        jarak_rumah_ke_sekolah: item.jarak_rumah_ke_sekolah !== null && item.jarak_rumah_ke_sekolah !== undefined ? Number(item.jarak_rumah_ke_sekolah) : null,
        waktu_tempuh_ke_sekolah: item.waktu_tempuh_ke_sekolah !== null && item.waktu_tempuh_ke_sekolah !== undefined ? Number(item.waktu_tempuh_ke_sekolah) : null,
        menit_tempuh_ke_sekolah: item.menit_tempuh_ke_sekolah !== null && item.menit_tempuh_ke_sekolah !== undefined ? Number(item.menit_tempuh_ke_sekolah) : null,
        jumlah_saudara_kandung: item.jumlah_saudara_kandung !== null && item.jumlah_saudara_kandung !== undefined ? Number(item.jumlah_saudara_kandung) : null,
        penghasilan_id_ayah: item.penghasilan_id_ayah !== null && item.penghasilan_id_ayah !== undefined ? Number(item.penghasilan_id_ayah) : null,
        pekerjaan_id_ayah: item.pekerjaan_id_ayah !== null && item.pekerjaan_id_ayah !== undefined ? Number(item.pekerjaan_id_ayah) : null,
        penghasilan_id_ibu: item.penghasilan_id_ibu !== null && item.penghasilan_id_ibu !== undefined ? Number(item.penghasilan_id_ibu) : null,
        pekerjaan_id_ibu: item.pekerjaan_id_ibu !== null && item.pekerjaan_id_ibu !== undefined ? Number(item.pekerjaan_id_ibu) : null,
        penghasilan_id_wali: item.penghasilan_id_wali !== null && item.penghasilan_id_wali !== undefined ? Number(item.penghasilan_id_wali) : null,
        pekerjaan_id_wali: item.pekerjaan_id_wali !== null && item.pekerjaan_id_wali !== undefined ? Number(item.pekerjaan_id_wali) : null,
        jenjang_pendidikan_ayah: item.jenjang_pendidikan_ayah !== null && item.jenjang_pendidikan_ayah !== undefined ? Number(item.jenjang_pendidikan_ayah) : null,
        jenjang_pendidikan_ibu: item.jenjang_pendidikan_ibu !== null && item.jenjang_pendidikan_ibu !== undefined ? Number(item.jenjang_pendidikan_ibu) : null,
        jenjang_pendidikan_wali: item.jenjang_pendidikan_wali !== null && item.jenjang_pendidikan_wali !== undefined ? Number(item.jenjang_pendidikan_wali) : null,
        anak_keberapa: item.anak_keberapa !== null && item.anak_keberapa !== undefined ? Number(item.anak_keberapa) : null,
        kebutuhan_khusus_id: item.kebutuhan_khusus_id !== null && item.kebutuhan_khusus_id !== undefined ? Number(item.kebutuhan_khusus_id) : null,
        jenis_tinggal_id: item.jenis_tinggal_id !== null && item.jenis_tinggal_id !== undefined ? Number(item.jenis_tinggal_id) : null,
        alat_transportasi_id: item.alat_transportasi_id !== null && item.alat_transportasi_id !== undefined ? Number(item.alat_transportasi_id) : null,
      };
    });

    const checkStudentCompleteness = (item: any) => {
      const allFields = [
        'nama', 'jenis_kelamin', 'nik', 'tempat_lahir', 'tanggal_lahir',
        'agama_id_str', 'no_kk', 'reg_akta_lahir', 'anak_keberapa',
        'nomor_telepon_seluler', 'no_whatsapp', 'email_aktif',
        'alamat_jalan', 'rt', 'rw', 'nama_dusun', 'desa_kelurahan', 'provinsi', 'kabupaten_kota', 'kecamatan',
        'kode_pos', 'jenis_tinggal_id', 'alat_transportasi_id', 'lintang', 'bujur',
        'tinggi_badan', 'berat_badan', 'lingkar_kepala', 'jarak_rumah_ke_sekolah', 'waktu_tempuh_ke_sekolah',
        'menit_tempuh_ke_sekolah', 'jumlah_saudara_kandung',
        'nama_ayah', 'nik_ayah', 'tahun_lahir_ayah', 'jenjang_pendidikan_ayah', 'pekerjaan_id_ayah', 'penghasilan_id_ayah',
        'nama_ibu', 'nik_ibu', 'tahun_lahir_ibu', 'jenjang_pendidikan_ibu', 'pekerjaan_id_ibu', 'penghasilan_id_ibu',
        'nama_wali', 'nik_wali', 'tahun_lahir_wali', 'jenjang_pendidikan_wali', 'pekerjaan_id_wali', 'penghasilan_id_wali'
      ];
      
      const isFieldFilled = (key: string) => {
        if (key === 'provinsi' || key === 'kabupaten_kota' || key === 'kecamatan') {
          const desa = item['desa_kelurahan'];
          const kodeWilayah = item['kode_wilayah'];
          return !!((desa && desa !== '-' && desa !== '') || (kodeWilayah && kodeWilayah !== '-' && kodeWilayah !== ''));
        }
        
        const value = item[key];
        if (value && value !== '-' && value !== '' && value !== 0 && value !== '0') {
          return true;
        }
        return false;
      };

      const fields = allFields.filter(key => {
        if (key.endsWith('_wali')) {
          return item['is_wali'] === true || item['is_wali'] === 1 || item['is_wali'] === '1' || !!(item['nama_wali'] || item['nik_wali']);
        }
        return true;
      });

      let filled = 0;
      fields.forEach(f => {
        if (isFieldFilled(f)) {
          filled++;
        }
      });
      return Math.round((filled / fields.length) * 100);
    };

    let completedStudentCount = 0;
    let totalStudentCompletenessPercentSum = 0;
    mappedStudents.forEach((student: any) => {
      const pct = checkStudentCompleteness(student);
      totalStudentCompletenessPercentSum += pct;
      if (pct === 100) {
        completedStudentCount++;
      }
    });

    const avgStudentCompleteness = mappedStudents.length > 0 ? Math.round((completedStudentCount / mappedStudents.length) * 100) : 0;

    // Calculate weekly attendance stats for Monday to Saturday of this week
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
    startOfWeek.setDate(today.getDate() + distanceToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyGtkAttendance: number[] = [];
    const weeklyPdAttendance: number[] = [];

    for (let i = 0; i < 6; i++) {
      const targetDate = new Date(startOfWeek);
      targetDate.setDate(startOfWeek.getDate() + i);
      const nextDate = new Date(targetDate);
      nextDate.setDate(targetDate.getDate() + 1);

      const presentGTK = await this.prisma.presensiGtk.count({
        where: {
          sekolah_id: sekolahId,
          tanggal: {
            gte: targetDate,
            lt: nextDate,
          },
          status_masuk: { in: [1, 2] },
        },
      });
      const gtkRate = totalGtk > 0 ? Math.round((presentGTK / totalGtk) * 100) : 0;
      weeklyGtkAttendance.push(gtkRate);

      const presentPD = await this.prisma.presensiPesertaDidik.count({
        where: {
          sekolah_id: sekolahId,
          tanggal: {
            gte: targetDate,
            lt: nextDate,
          },
          status_masuk: { in: [1, 2] },
        },
      });
      const pdRate = totalSiswa > 0 ? Math.round((presentPD / totalSiswa) * 100) : 0;
      weeklyPdAttendance.push(pdRate);
    }

    return {
      sekolah_id: sekolahId,
      total_tanah: totalTanah,
      total_bangunan: totalBangunan,
      total_ruang: totalRuang,
      total_siswa: totalSiswa,
      total_pd: totalSiswa,
      total_gtk: totalGtk,
      total_rombel: totalRombel,
      completed_gtk: completedGtkCount,
      avg_gtk_completeness: avgGtkCompleteness,
      completed_pd: completedStudentCount,
      avg_pd_completeness: avgStudentCompleteness,
      weekly_gtk_attendance: weeklyGtkAttendance,
      weekly_pd_attendance: weeklyPdAttendance,
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
      select: { nama: true, ptk_id: true }
    });

    let namaKepalaSekolah = kepalaSekolah?.nama || null;
    let nipKepalaSekolah = null;
    let tandaTanganKepalaSekolah = null;

    if (kepalaSekolah && kepalaSekolah.ptk_id) {
      const gtkKepsek = await this.prisma.gtk.findUnique({
        where: { ptk_id: kepalaSekolah.ptk_id },
        select: { nip: true, tanda_tangan: true }
      });
      if (gtkKepsek) {
        nipKepalaSekolah = gtkKepsek.nip || null;
        tandaTanganKepalaSekolah = gtkKepsek.tanda_tangan || null;
      }
    }

    // Fallback ke tabel GTK jika tidak ditemukan di pengguna
    if (!namaKepalaSekolah || !nipKepalaSekolah || !tandaTanganKepalaSekolah) {
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
        select: { nama: true, nip: true, tanda_tangan: true }
      });
      if (kepalaSekolahGtk) {
        if (!namaKepalaSekolah) namaKepalaSekolah = kepalaSekolahGtk.nama || null;
        if (!nipKepalaSekolah) nipKepalaSekolah = kepalaSekolahGtk.nip || null;
        if (!tandaTanganKepalaSekolah) tandaTanganKepalaSekolah = kepalaSekolahGtk.tanda_tangan || null;
      }
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
      nip_kepala_sekolah: nipKepalaSekolah,
      tanda_tangan_kepala_sekolah: tandaTanganKepalaSekolah,
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

  async uploadGtkTandaTangan(sekolahId: string, uuidGtk: string, file: Express.Multer.File) {
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
    const fs = require('fs');
    
    // Hapus tanda tangan lama untuk menghemat penyimpanan
    if (fs.existsSync(destDir)) {
      try {
        const files = fs.readdirSync(destDir);
        for (const f of files) {
          if (f.startsWith('tanda_tangan')) {
            fs.unlinkSync(path.join(destDir, f));
          }
        }
      } catch (err) {
        console.error('Gagal membersihkan tanda tangan lama:', err);
      }
    }

    const timestamp = Date.now();
    const fileName = `tanda_tangan_${timestamp}`; // sharp helper will append .jpg automatically

    // Kompres & Simpan foto tanda tangan
    const savedPath = await compressAndSaveImage(file.buffer, destDir, fileName);

    // Path yang disimpan di DB (untuk diakses web client)
    const relativePath = `/storage/${sekolahId}/gtk/${uuidGtk}/tanda_tangan_${timestamp}.jpg`;

    await this.prisma.gtk.update({
      where: { ptk_id: uuidGtk },
      data: { tanda_tangan: relativePath }
    });

    return {
      filePath: relativePath,
      savedPath
    };
  }

  async uploadSiswaDokumen(sekolahId: string, uuidSiswa: string, file: Express.Multer.File, docName: string) {
    const fs = require('fs');
    const path = require('path');
    const { saveDocument } = require('../../common/utils/upload.util');

    const siswa = await this.prisma.pesertaDidik.findFirst({
      where: { peserta_didik_id: uuidSiswa, sekolah_id: sekolahId }
    });
    if (!siswa) {
      throw new Error('Siswa tidak ditemukan atau tidak terdaftar di sekolah Anda.');
    }

    const destDir = path.join(process.cwd(), 'storage', sekolahId, 'siswa', uuidSiswa, 'dokumen');
    
    const fileExt = path.extname(file.originalname).toLowerCase();
    const cleanDocName = docName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const finalFileName = `${cleanDocName}_${Date.now()}${fileExt}`;

    // Hapus file lama dengan nama dokumen yang diawali cleanDocName (contoh: ijazah_*.pdf)
    if (fs.existsSync(destDir)) {
      const existingFiles = fs.readdirSync(destDir) as string[];
      for (const existingFile of existingFiles) {
        if (existingFile.startsWith(`${cleanDocName}_`) || existingFile === `${cleanDocName}.pdf` || existingFile === `${cleanDocName}.jpg` || existingFile === `${cleanDocName}.png` || existingFile === `${cleanDocName}.jpeg`) {
          try {
            fs.unlinkSync(path.join(destDir, existingFile));
          } catch (e) {
            console.error('Gagal menghapus file lama:', e);
          }
        }
      }
    }

    let savedPath = '';
    let isCompressed = false;

    // Hanya perbolehkan berkas PDF untuk dokumen
    if (fileExt !== '.pdf') {
      throw new Error('Format dokumen tidak didukung. Hanya berkas PDF (.pdf) yang diperbolehkan.');
    }

    // Simpan PDF dengan batas ukuran 200KB
    savedPath = saveDocument(file.buffer, destDir, finalFileName, 200 * 1024);

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
    const fs = require('fs');
    const path = require('path');
    const { saveDocument } = require('../../common/utils/upload.util');

    const gtk = await this.prisma.gtk.findFirst({
      where: { ptk_id: uuidGtk, sekolah_id: sekolahId }
    });
    if (!gtk) {
      throw new Error('GTK tidak ditemukan atau tidak terdaftar di sekolah Anda.');
    }

    const destDir = path.join(process.cwd(), 'storage', sekolahId, 'gtk', uuidGtk, 'dokumen');
    
    const fileExt = path.extname(file.originalname).toLowerCase();
    const cleanDocName = docName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
    const finalFileName = `${cleanDocName}_${Date.now()}${fileExt}`;

    // Hapus file lama dengan nama dokumen yang diawali cleanDocName (contoh: ijazah_*.pdf)
    if (fs.existsSync(destDir)) {
      const existingFiles = fs.readdirSync(destDir) as string[];
      for (const existingFile of existingFiles) {
        if (existingFile.startsWith(`${cleanDocName}_`) || existingFile === `${cleanDocName}.pdf` || existingFile === `${cleanDocName}.jpg` || existingFile === `${cleanDocName}.png` || existingFile === `${cleanDocName}.jpeg`) {
          try {
            fs.unlinkSync(path.join(destDir, existingFile));
          } catch (e) {
            console.error('Gagal menghapus file lama:', e);
          }
        }
      }
    }

    let savedPath = '';
    let isCompressed = false;

    if (fileExt !== '.pdf') {
      throw new Error('Format dokumen tidak didukung. Hanya berkas PDF (.pdf) yang diperbolehkan.');
    }

    savedPath = saveDocument(file.buffer, destDir, finalFileName, 200 * 1024);

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

  async getNotifications(sekolahId: string, user?: any) {
    const filter = this.getSekolahFilter(sekolahId);
    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    // Determinisasi apakah user adalah Operator/Admin
    const isOperator = !user || 
      user.role === 'Super Admin' || 
      user.role === 'superadmin' || 
      user.role === 'Operator Sekolah' || 
      user.role === 'operator_sekolah' || 
      user.role?.toLowerCase()?.includes('operator') ||
      user.role?.toLowerCase()?.includes('admin');
    
    let ptkId = user?.ptkId || user?.ptk_id;
    let pesertaDidikId = user?.pesertaDidikId || user?.peserta_didik_id;

    // Jika pengguna login tetapi ptkId/pesertaDidikId tidak tersimpan dalam token JWT payload,
    // maka kita selidiki langsung dari data pengguna di database menggunakan user.sub (pengguna_id).
    if (user?.sub && (!ptkId && !pesertaDidikId)) {
      try {
        const dbUser = await this.prisma.pengguna.findUnique({
          where: { pengguna_id: user.sub },
          select: { ptk_id: true, peserta_didik_id: true }
        });
        if (dbUser) {
          ptkId = dbUser.ptk_id;
          pesertaDidikId = dbUser.peserta_didik_id;
        }
      } catch (err) {
        console.error('Gagal memuat detail pengguna relasi:', err);
      }
    }

    // 1. PENGATURAN FILTER PENGAJUAN DATA PERBAIKAN
    const changesWhereClause: any = {
      sekolah_id: filter.sekolah_id,
    };

    if (isOperator) {
      // Operator hanya melihat yang PENDING
      changesWhereClause.status = 'PENDING';
    } else {
      if (ptkId) {
        changesWhereClause.ptk_id = ptkId;
        changesWhereClause.status = { in: ['PENDING', 'APPROVED', 'REJECTED'] };
      } else if (pesertaDidikId) {
        changesWhereClause.peserta_didik_id = pesertaDidikId;
        changesWhereClause.status = { in: ['PENDING', 'APPROVED', 'REJECTED'] };
      } else {
        // Jika bukan operator dan tidak punya ID yang valid, tidak tampilkan apapun
        changesWhereClause.id = '00000000-0000-0000-0000-000000000000';
      }
    }

    // Fetch pending/processed data changes
    const pendingChanges = await this.prisma.pengajuanPerbaikan.findMany({
      where: changesWhereClause,
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    // Resolve names for pendingChanges
    const changesWithNames = await Promise.all(
      pendingChanges.map(async (item) => {
        let name = 'Pengguna';
        let foto = null;
        if (item.tipe === 'GTK' && item.ptk_id) {
          const gtk = await this.prisma.gtk.findUnique({
            where: { ptk_id: item.ptk_id },
            select: { nama: true, foto: true }
          });
          if (gtk) {
            name = gtk.nama;
            foto = gtk.foto ? (gtk.foto.startsWith('http') ? gtk.foto : `${appUrl}${gtk.foto}`) : null;
          }
        } else if (item.tipe === 'SISWA' && item.peserta_didik_id) {
          const pd = await this.prisma.pesertaDidik.findUnique({
            where: { peserta_didik_id: item.peserta_didik_id },
            select: { nama: true, foto: true }
          });
          if (pd) {
            name = pd.nama;
            foto = pd.foto ? (pd.foto.startsWith('http') ? pd.foto : `${appUrl}${pd.foto}`) : null;
          }
        }

        let title = 'Pengajuan Perbaikan Data';
        let message = `${name} mengajukan perubahan data profil`;
        
        if (!isOperator) {
          if (item.status === 'PENDING') {
            title = 'Pengajuan Perbaikan Data';
            message = `Pengajuan perbaikan data profil Anda sedang diproses (Menunggu Persetujuan).`;
          }
        }
        
        if (item.status === 'APPROVED') {
          title = 'Perbaikan Data Disetujui';
          message = `Pengajuan perbaikan data profil Anda telah DISETUJUI dan data telah diperbarui.`;
        } else if (item.status === 'REJECTED') {
          title = 'Perbaikan Data Ditolak';
          message = `Pengajuan perbaikan data profil Anda telah DITOLAK. Alasan: ${item.alasan_tolak || '-'}`;
        }

        return {
          id: item.id,
          type: 'perbaikan',
          title,
          message,
          time: item.updated_at || item.created_at,
          foto,
          tipe: item.tipe,
        };
      })
    );

    // 2. PENGATURAN FILTER PENGAJUAN MUTASI
    const mutationsWhereClause: any = {
      sekolah_id: filter.sekolah_id,
    };

    if (isOperator) {
      // Operator hanya melihat yang PENDING (status 0)
      mutationsWhereClause.status = 0;
    } else {
      if (ptkId) {
        // PTK yang mengajukan mutasi ini bisa melihat status PENDING (0), APPROVED (1), dan REJECTED (2)
        mutationsWhereClause.ptk_id = ptkId;
        mutationsWhereClause.status = { in: [0, 1, 2] };
      } else {
        // Siswa tidak berhak melihat pengajuan mutasi
        mutationsWhereClause.mutasi_id = '00000000-0000-0000-0000-000000000000';
      }
    }

    // Fetch pending/processed mutations
    const pendingMutations = await this.prisma.mutasiPd.findMany({
      where: mutationsWhereClause,
      include: {
        peserta_didik: {
          select: { nama: true }
        },
        ptk: {
          select: { nama: true, foto: true }
        }
      },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    const mutationsFormatted = pendingMutations.map((item) => {
      const ptkFoto = item.ptk?.foto;
      const formattedFoto = ptkFoto ? (ptkFoto.startsWith('http') ? ptkFoto : `${appUrl}${ptkFoto}`) : null;
      
      let title = 'Pengajuan Mutasi Siswa';
      let message = `Pengajuan mutasi keluar untuk siswa ${item.peserta_didik?.nama || 'Siswa'}`;
      if (item.status === 1) {
        title = 'Mutasi Siswa Disetujui';
        message = `Pengajuan mutasi untuk siswa ${item.peserta_didik?.nama || 'Siswa'} telah DISETUJUI oleh Operator.`;
      } else if (item.status === 2) {
        title = 'Mutasi Siswa Ditolak';
        message = `Pengajuan mutasi untuk siswa ${item.peserta_didik?.nama || 'Siswa'} telah DITOLAK. Alasan: ${item.alasan_tolak || '-'}`;
      }

      return {
        id: item.mutasi_id,
        type: 'mutasi',
        title,
        message,
        time: item.updated_at || item.created_at,
        foto: formattedFoto,
        tipe: 'GTK',
        alasan: item.alasan,
      };
    });

    // Combine and sort by time
    const allNotifications = [...changesWithNames, ...mutationsFormatted].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    return allNotifications.slice(0, 15);
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

  async getPesertaDidik(
    sekolahId: string | null,
    limit: number = 10,
    search?: string,
    page: number = 1,
    rombelName?: string,
    status?: 'aktif' | 'non-aktif',
    tingkat?: string,
    completeness?: string
  ) {
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

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const hasCompletenessFilter = completeness && completeness !== 'all';
    
    // Select fields for query
    const querySelect = {
      peserta_didik_id: true,
      sekolah_id: true,
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
      kode_wilayah: true,
      tinggi_badan: true,
      berat_badan: true,
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
      },
      reg_akta_lahir: true,
      kebutuhan_khusus_id: true,
      anak_keberapa: true,
      nomor_telepon_rumah: true,
      no_whatsapp: true,
      email_aktif: true,
      nama_dusun: true,
      kode_pos: true,
      lintang: true,
      bujur: true,
      jenis_tinggal_id: true,
      alat_transportasi_id: true,
      lingkar_kepala: true,
      jarak_rumah_ke_sekolah: true,
      waktu_tempuh_ke_sekolah: true,
      menit_tempuh_ke_sekolah: true,
      jumlah_saudara_kandung: true,
      nik_ayah: true,
      tahun_lahir_ayah: true,
      jenjang_pendidikan_ayah: true,
      pekerjaan_id_ayah: true,
      penghasilan_id_ayah: true,
      nik_ibu: true,
      tahun_lahir_ibu: true,
      jenjang_pendidikan_ibu: true,
      pekerjaan_id_ibu: true,
      penghasilan_id_ibu: true,
      is_wali: true,
      nama_wali: true,
      nik_wali: true,
      tahun_lahir_wali: true,
      jenjang_pendidikan_wali: true,
      pekerjaan_id_wali: true,
      penghasilan_id_wali: true,
    };

    const refJenisPendaftaran = await this.prisma.jenis_pendaftaran.findMany({
      select: {
        jenis_pendaftaran_id: true,
        nama: true
      }
    });

    const refJenisKeluar = await this.prisma.jenis_keluar.findMany({
      select: {
        jenis_keluar_id: true,
        ket_keluar: true
      }
    });

    const checkStudentCompleteness = (item: any) => {
      const fs = require('fs');
      const path = require('path');
      const allFields = [
        'nama', 'jenis_kelamin', 'nik', 'tempat_lahir', 'tanggal_lahir',
        'agama_id_str', 'no_kk', 'reg_akta_lahir', 'anak_keberapa',
        'nomor_telepon_seluler', 'no_whatsapp', 'email_aktif',
        'alamat_jalan', 'rt', 'rw', 'nama_dusun', 'desa_kelurahan', 'provinsi', 'kabupaten_kota', 'kecamatan',
        'kode_pos', 'jenis_tinggal_id', 'alat_transportasi_id', 'lintang', 'bujur',
        'tinggi_badan', 'berat_badan', 'lingkar_kepala', 'jarak_rumah_ke_sekolah', 'waktu_tempuh_ke_sekolah',
        'menit_tempuh_ke_sekolah', 'jumlah_saudara_kandung',
        'nama_ayah', 'nik_ayah', 'tahun_lahir_ayah', 'jenjang_pendidikan_ayah', 'pekerjaan_id_ayah', 'penghasilan_id_ayah',
        'nama_ibu', 'nik_ibu', 'tahun_lahir_ibu', 'jenjang_pendidikan_ibu', 'pekerjaan_id_ibu', 'penghasilan_id_ibu',
        'nama_wali', 'nik_wali', 'tahun_lahir_wali', 'jenjang_pendidikan_wali', 'pekerjaan_id_wali', 'penghasilan_id_wali'
      ];
      
      const isFieldFilled = (key: string) => {
        if (key === 'provinsi' || key === 'kabupaten_kota' || key === 'kecamatan') {
          const desa = item['desa_kelurahan'];
          const kodeWilayah = item['kode_wilayah'];
          return !!((desa && desa !== '-' && desa !== '') || (kodeWilayah && kodeWilayah !== '-' && kodeWilayah !== ''));
        }
        
        const value = item[key];
        if (value && value !== '-' && value !== '' && value !== 0 && value !== '0') {
          return true;
        }
        return false;
      };

      const fields = allFields.filter(key => {
        if (key.endsWith('_wali')) {
          return item['is_wali'] === true || item['is_wali'] === 1 || item['is_wali'] === '1' || !!(item['nama_wali'] || item['nik_wali']);
        }
        return true;
      });

      let filled = 0;
      fields.forEach(f => {
        if (isFieldFilled(f)) {
          filled++;
        }
      });

      // Scan dokumen fisik di storage (5 dokumen wajib: ijazah_sekolah_asal, kartu_keluarga, akta_kelahiran, ktp_ayah, ktp_ibu)
      const docTypes = ["ijazah_sekolah_asal", "kartu_keluarga", "akta_kelahiran", "ktp_ayah", "ktp_ibu"];
      const destDir = path.join(process.cwd(), 'storage', String(item.sekolah_id), 'siswa', String(item.peserta_didik_id), 'dokumen');
      let uploadedDocs: string[] = [];
      if (fs.existsSync(destDir)) {
        try {
          uploadedDocs = fs.readdirSync(destDir);
        } catch (e) {
          console.error(e);
        }
      }

      // Tambahkan total 5 dokumen wajib ke basis perhitungan fields
      const totalFieldsCount = fields.length + docTypes.length;
      
      let docFilled = 0;
      docTypes.forEach(docType => {
        const hasDoc = uploadedDocs.some(f => f.startsWith(docType));
        if (hasDoc) {
          docFilled++;
        }
      });

      return Math.round(((filled + docFilled) / totalFieldsCount) * 100);
    };

    if (hasCompletenessFilter) {
      // 1. Fetch ALL matching records to apply completeness filter in memory
      const rawData = await this.prisma.pesertaDidik.findMany({
        where: whereClause,
        select: querySelect,
        orderBy: { nama: 'asc' },
      });

      const wilayahCache = new Map<string, any>();
      const mappedAll = await Promise.all(rawData.map(async (item: any) => {
        const jp = refJenisPendaftaran.find(
          (r: any) => String(r.jenis_pendaftaran_id) === String(item.jenis_pendaftaran_id)
        );
        const jk = refJenisKeluar.find(
          (r: any) => String(r.jenis_keluar_id) === String(item.jenis_keluar_id)
        );
        const rombel = item.rombongan_belajar || item.anggota_rombel?.[0]?.rombongan_belajar;
        const wilayahHierarchy = await this.resolveWilayahHierarchy(item.kode_wilayah, wilayahCache);

        return {
          ...item,
          foto: item.foto ? (item.foto.startsWith('http') ? `${item.foto}${item.foto.includes('?') ? '&' : '?'}t=${Date.now()}` : `${appUrl}${item.foto}?t=${Date.now()}`) : null,
          nama_rombel: rombel?.nama || null,
          tingkat_pendidikan_id: rombel?.tingkat_pendidikan_id ? String(rombel.tingkat_pendidikan_id) : null,
          agama_id_str: item.agama?.nama || null,
          nama_ibu: item.nama_ibu_kandung || null,
          ket_keluar: item.keterangan || null,
          provinsi: wilayahHierarchy.provinsi,
          kabupaten_kota: wilayahHierarchy.kabupaten,
          kecamatan: wilayahHierarchy.kecamatan,
          tinggi_badan: item.tinggi_badan !== null && item.tinggi_badan !== undefined ? Number(item.tinggi_badan) : null,
          lengkapData: checkStudentCompleteness(item),
          uploaded_docs: (() => {
            const fs = require('fs');
            const path = require('path');
            const destDir = path.join(process.cwd(), 'storage', String(item.sekolah_id), 'siswa', String(item.peserta_didik_id), 'dokumen');
            if (fs.existsSync(destDir)) {
              try { return fs.readdirSync(destDir); } catch(e) { return []; }
            }
            return [];
          })(),
          berat_badan: item.berat_badan !== null && item.berat_badan !== undefined ? Number(item.berat_badan) : null,
          jenis_pendaftaran_id_str: jp?.nama || null,
          jenis_keluar_id_str: jk?.ket_keluar || null,
          rt: item.rt !== null && item.rt !== undefined ? String(item.rt) : null,
          rw: item.rw !== null && item.rw !== undefined ? String(item.rw) : null,
          is_wali: item.is_wali === true || item.is_wali === 1 || item.is_wali === "1" || !!(item.nama_wali || item.nik_wali),
          lingkar_kepala: item.lingkar_kepala !== null && item.lingkar_kepala !== undefined ? Number(item.lingkar_kepala) : null,
          jarak_rumah_ke_sekolah: item.jarak_rumah_ke_sekolah !== null && item.jarak_rumah_ke_sekolah !== undefined ? Number(item.jarak_rumah_ke_sekolah) : null,
          waktu_tempuh_ke_sekolah: item.waktu_tempuh_ke_sekolah !== null && item.waktu_tempuh_ke_sekolah !== undefined ? Number(item.waktu_tempuh_ke_sekolah) : null,
          menit_tempuh_ke_sekolah: item.menit_tempuh_ke_sekolah !== null && item.menit_tempuh_ke_sekolah !== undefined ? Number(item.menit_tempuh_ke_sekolah) : null,
          jumlah_saudara_kandung: item.jumlah_saudara_kandung !== null && item.jumlah_saudara_kandung !== undefined ? Number(item.jumlah_saudara_kandung) : null,
          penghasilan_id_ayah: item.penghasilan_id_ayah !== null && item.penghasilan_id_ayah !== undefined ? Number(item.penghasilan_id_ayah) : null,
          pekerjaan_id_ayah: item.pekerjaan_id_ayah !== null && item.pekerjaan_id_ayah !== undefined ? Number(item.pekerjaan_id_ayah) : null,
          penghasilan_id_ibu: item.penghasilan_id_ibu !== null && item.penghasilan_id_ibu !== undefined ? Number(item.penghasilan_id_ibu) : null,
          pekerjaan_id_ibu: item.pekerjaan_id_ibu !== null && item.pekerjaan_id_ibu !== undefined ? Number(item.pekerjaan_id_ibu) : null,
          penghasilan_id_wali: item.penghasilan_id_wali !== null && item.penghasilan_id_wali !== undefined ? Number(item.penghasilan_id_wali) : null,
          pekerjaan_id_wali: item.pekerjaan_id_wali !== null && item.pekerjaan_id_wali !== undefined ? Number(item.pekerjaan_id_wali) : null,
          jenjang_pendidikan_ayah: item.jenjang_pendidikan_ayah !== null && item.jenjang_pendidikan_ayah !== undefined ? Number(item.jenjang_pendidikan_ayah) : null,
          jenjang_pendidikan_ibu: item.jenjang_pendidikan_ibu !== null && item.jenjang_pendidikan_ibu !== undefined ? Number(item.jenjang_pendidikan_ibu) : null,
          jenjang_pendidikan_wali: item.jenjang_pendidikan_wali !== null && item.jenjang_pendidikan_wali !== undefined ? Number(item.jenjang_pendidikan_wali) : null,
          anak_keberapa: item.anak_keberapa !== null && item.anak_keberapa !== undefined ? Number(item.anak_keberapa) : null,
          kebutuhan_khusus_id: item.kebutuhan_khusus_id !== null && item.kebutuhan_khusus_id !== undefined ? Number(item.kebutuhan_khusus_id) : null,
          jenis_tinggal_id: item.jenis_tinggal_id !== null && item.jenis_tinggal_id !== undefined ? Number(item.jenis_tinggal_id) : null,
          alat_transportasi_id: item.alat_transportasi_id !== null && item.alat_transportasi_id !== undefined ? Number(item.alat_transportasi_id) : null,
        };
      }));

      // 2. Filter by completeness
      let filteredData = mappedAll;
      if (completeness === '100') {
        filteredData = mappedAll.filter((item: any) => checkStudentCompleteness(item) === 100);
      } else if (completeness === '99') {
        filteredData = mappedAll.filter((item: any) => checkStudentCompleteness(item) < 100);
      } else if (completeness === '50') {
        filteredData = mappedAll.filter((item: any) => checkStudentCompleteness(item) < 50);
      }

      // 3. Paginate
      const totalFiltered = filteredData.length;
      const skip = (page - 1) * limit;
      const paginatedData = filteredData.slice(skip, skip + limit);

      return { total: totalFiltered, data: paginatedData };

    } else {
      // Standard database pagination (when not filtering by completeness)
      const skip = (page - 1) * limit;
      const [totalCount, rawData] = await Promise.all([
        this.prisma.pesertaDidik.count({ where: whereClause }),
        this.prisma.pesertaDidik.findMany({
          where: whereClause,
          take: limit,
          skip: skip,
          select: querySelect,
          orderBy: { nama: 'asc' },
        })
      ]);

      const wilayahCache = new Map<string, any>();
      const mappedData = await Promise.all(rawData.map(async (item: any) => {
        const jp = refJenisPendaftaran.find(
          (r: any) => String(r.jenis_pendaftaran_id) === String(item.jenis_pendaftaran_id)
        );
        const jk = refJenisKeluar.find(
          (r: any) => String(r.jenis_keluar_id) === String(item.jenis_keluar_id)
        );
        const rombel = item.rombongan_belajar || item.anggota_rombel?.[0]?.rombongan_belajar;
        const wilayahHierarchy = await this.resolveWilayahHierarchy(item.kode_wilayah, wilayahCache);

        return {
          ...item,
          foto: item.foto ? (item.foto.startsWith('http') ? `${item.foto}${item.foto.includes('?') ? '&' : '?'}t=${Date.now()}` : `${appUrl}${item.foto}?t=${Date.now()}`) : null,
          nama_rombel: rombel?.nama || null,
          tingkat_pendidikan_id: rombel?.tingkat_pendidikan_id ? String(rombel.tingkat_pendidikan_id) : null,
          agama_id_str: item.agama?.nama || null,
          nama_ibu: item.nama_ibu_kandung || null,
          ket_keluar: item.keterangan || null,
          provinsi: wilayahHierarchy.provinsi,
          kabupaten_kota: wilayahHierarchy.kecamatan,
          kecamatan: wilayahHierarchy.kecamatan,
          tinggi_badan: item.tinggi_badan !== null && item.tinggi_badan !== undefined ? Number(item.tinggi_badan) : null,
          lengkapData: checkStudentCompleteness(item),
          uploaded_docs: (() => {
            const fs = require('fs');
            const path = require('path');
            const destDir = path.join(process.cwd(), 'storage', String(item.sekolah_id), 'siswa', String(item.peserta_didik_id), 'dokumen');
            if (fs.existsSync(destDir)) {
              try { return fs.readdirSync(destDir); } catch(e) { return []; }
            }
            return [];
          })(),
          berat_badan: item.berat_badan !== null && item.berat_badan !== undefined ? Number(item.berat_badan) : null,
          jenis_pendaftaran_id_str: jp?.nama || null,
          jenis_keluar_id_str: jk?.ket_keluar || null,
          rt: item.rt !== null && item.rt !== undefined ? String(item.rt) : null,
          rw: item.rw !== null && item.rw !== undefined ? String(item.rw) : null,
          is_wali: item.is_wali === true || item.is_wali === 1 || item.is_wali === "1" || !!(item.nama_wali || item.nik_wali),
          lingkar_kepala: item.lingkar_kepala !== null && item.lingkar_kepala !== undefined ? Number(item.lingkar_kepala) : null,
          jarak_rumah_ke_sekolah: item.jarak_rumah_ke_sekolah !== null && item.jarak_rumah_ke_sekolah !== undefined ? Number(item.jarak_rumah_ke_sekolah) : null,
          waktu_tempuh_ke_sekolah: item.waktu_tempuh_ke_sekolah !== null && item.waktu_tempuh_ke_sekolah !== undefined ? Number(item.waktu_tempuh_ke_sekolah) : null,
          menit_tempuh_ke_sekolah: item.menit_tempuh_ke_sekolah !== null && item.menit_tempuh_ke_sekolah !== undefined ? Number(item.menit_tempuh_ke_sekolah) : null,
          jumlah_saudara_kandung: item.jumlah_saudara_kandung !== null && item.jumlah_saudara_kandung !== undefined ? Number(item.jumlah_saudara_kandung) : null,
          penghasilan_id_ayah: item.penghasilan_id_ayah !== null && item.penghasilan_id_ayah !== undefined ? Number(item.penghasilan_id_ayah) : null,
          pekerjaan_id_ayah: item.pekerjaan_id_ayah !== null && item.pekerjaan_id_ayah !== undefined ? Number(item.pekerjaan_id_ayah) : null,
          penghasilan_id_ibu: item.penghasilan_id_ibu !== null && item.penghasilan_id_ibu !== undefined ? Number(item.penghasilan_id_ibu) : null,
          pekerjaan_id_ibu: item.pekerjaan_id_ibu !== null && item.pekerjaan_id_ibu !== undefined ? Number(item.pekerjaan_id_ibu) : null,
          penghasilan_id_wali: item.penghasilan_id_wali !== null && item.penghasilan_id_wali !== undefined ? Number(item.penghasilan_id_wali) : null,
          pekerjaan_id_wali: item.pekerjaan_id_wali !== null && item.pekerjaan_id_wali !== undefined ? Number(item.pekerjaan_id_wali) : null,
          jenjang_pendidikan_ayah: item.jenjang_pendidikan_ayah !== null && item.jenjang_pendidikan_ayah !== undefined ? Number(item.jenjang_pendidikan_ayah) : null,
          jenjang_pendidikan_ibu: item.jenjang_pendidikan_ibu !== null && item.jenjang_pendidikan_ibu !== undefined ? Number(item.jenjang_pendidikan_ibu) : null,
          jenjang_pendidikan_wali: item.jenjang_pendidikan_wali !== null && item.jenjang_pendidikan_wali !== undefined ? Number(item.jenjang_pendidikan_wali) : null,
          anak_keberapa: item.anak_keberapa !== null && item.anak_keberapa !== undefined ? Number(item.anak_keberapa) : null,
          kebutuhan_khusus_id: item.kebutuhan_khusus_id !== null && item.kebutuhan_khusus_id !== undefined ? Number(item.kebutuhan_khusus_id) : null,
          jenis_tinggal_id: item.jenis_tinggal_id !== null && item.jenis_tinggal_id !== undefined ? Number(item.jenis_tinggal_id) : null,
          alat_transportasi_id: item.alat_transportasi_id !== null && item.alat_transportasi_id !== undefined ? Number(item.alat_transportasi_id) : null,
        };
      }));

      return { total: totalCount, data: mappedData };
    }
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
              }
            }
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
      const rombel = pd.rombongan_belajar || pd.anggota_rombel?.[0]?.rombongan_belajar;
      const nama_rombel = rombel?.nama || null;
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

  async getPdRekapAgama(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    const students = await this.prisma.pesertaDidik.findMany({
      where: {
        sekolah_id: filter.sekolah_id,
        status: 'Aktif',
      },
      select: {
        jenis_kelamin: true,
        jenis_pendaftaran_id: true,
        agama: {
          select: {
            nama: true,
          }
        }
      }
    });

    const rekapMap = new Map();
    ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Khonghucu'].forEach(agama => {
      rekapMap.set(agama, { agama, l: 0, p: 0, total: 0, siswaBaru: 0, pindahan: 0, mengulang: 0 });
    });

    students.forEach((pd: any) => {
      const agamaName = pd.agama?.nama || 'Lainnya';
      if (!rekapMap.has(agamaName)) {
        rekapMap.set(agamaName, { agama: agamaName, l: 0, p: 0, total: 0, siswaBaru: 0, pindahan: 0, mengulang: 0 });
      }
      
      const data = rekapMap.get(agamaName);
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

  async getPdRekapMasukAktif(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    
    const semesterId = await this.getLatestSemesterId(sekolahId) || '20252';
    const startYear = parseInt(semesterId.substring(0, 4), 10);
    const startDate = new Date(startYear, 6, 1);
    const endDate = new Date(startYear + 1, 5, 30, 23, 59, 59);

    const students = await this.prisma.pesertaDidik.findMany({
      where: {
        sekolah_id: filter.sekolah_id,
        status: 'Aktif',
        tanggal_masuk_sekolah: {
          gte: startDate,
          lte: endDate,
        }
      },
      select: {
        jenis_kelamin: true,
        jenis_pendaftaran_id: true,
      }
    });

    const refJenisPendaftaran = await this.prisma.jenis_pendaftaran.findMany({
      select: {
        jenis_pendaftaran_id: true,
        nama: true,
      }
    });

    const jpMap = new Map<number, string>();
    refJenisPendaftaran.forEach(ref => {
      jpMap.set(Number(ref.jenis_pendaftaran_id), ref.nama);
    });

    const rekapMap = new Map();
    refJenisPendaftaran.forEach(ref => {
      rekapMap.set(ref.nama, { statusMasuk: ref.nama, l: 0, p: 0, total: 0 });
    });

    students.forEach((pd: any) => {
      const jpId = pd.jenis_pendaftaran_id ? Number(pd.jenis_pendaftaran_id) : 1;
      const jpName = jpMap.get(jpId) || 'Siswa Baru';
      
      if (!rekapMap.has(jpName)) {
        rekapMap.set(jpName, { statusMasuk: jpName, l: 0, p: 0, total: 0 });
      }
      
      const data = rekapMap.get(jpName);
      if (pd.jenis_kelamin === 'L') data.l += 1;
      if (pd.jenis_kelamin === 'P') data.p += 1;
      data.total += 1;
    });

    return Array.from(rekapMap.values()).filter((item: any) => item.total > 0);
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
      },
      select: {
        jenis_kelamin: true,
        rombongan_belajar: {
          select: {
            nama: true,
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
              }
            }
          }
        }
      }
    });

    const rekapMap = new Map();
    
    students.forEach((pd: any) => {
      const rombelObj = pd.rombongan_belajar || pd.anggota_rombel?.[0]?.rombongan_belajar;
      const rombel = rombelObj?.nama || '';
      const parts = rombel.split(' ');
      let kode = parts.length > 1 ? parts[1] : 'Umum';
      if (kode === 'MIPA' || kode === 'IPS') kode = parts[1];
      
      const kompetensiName = kode;

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
        jenis_pendaftaran_id: true,
      }
    });

    const now = new Date();
    const result = {
      '< 15 Tahun': { l: 0, p: 0, total: 0, baru: 0, pindahan: 0 },
      '15 Tahun': { l: 0, p: 0, total: 0, baru: 0, pindahan: 0 },
      '16 Tahun': { l: 0, p: 0, total: 0, baru: 0, pindahan: 0 },
      '17 Tahun': { l: 0, p: 0, total: 0, baru: 0, pindahan: 0 },
      '18 Tahun': { l: 0, p: 0, total: 0, baru: 0, pindahan: 0 },
      '> 18 Tahun': { l: 0, p: 0, total: 0, baru: 0, pindahan: 0 }
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

      const jp = pd.jenis_pendaftaran_id ? Number(pd.jenis_pendaftaran_id) : 1;
      if (jp === 1) {
        data.baru += 1;
      } else {
        data.pindahan += 1;
      }
    });

    return Object.keys(result).map(key => ({
      usia: key,
      // @ts-ignore
      l: result[key].l,
      // @ts-ignore
      p: result[key].p,
      // @ts-ignore
      total: result[key].total,
      // @ts-ignore
      baru: result[key].baru,
      // @ts-ignore
      pindahan: result[key].pindahan
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
    const filter = this.getSekolahFilter(sekolahId);
    const rombels = await this.prisma.rombonganBelajar.findMany({
      where: {
        sekolah_id: filter.sekolah_id,
      },
      select: {
        jenis_rombel: true,
        tingkat_pendidikan_id: true,
      }
    });

    const categories = [
      { id: 1, name: 'Reguler', jenisIds: [1] },
      { id: 2, name: 'Praktik', jenisIds: [2] },
      { id: 3, name: 'Ekskul', jenisIds: [51] },
      { id: 4, name: 'Matpel Pilihan', jenisIds: [16] },
      { id: 5, name: 'Wali', jenisIds: [18] }
    ];

    const result = categories.map(cat => {
      let t10 = 0;
      let t11 = 0;
      let t12 = 0;

      rombels.forEach(r => {
        const jr = r.jenis_rombel ? Number(r.jenis_rombel) : 0;
        if (cat.jenisIds.includes(jr)) {
          const tingkat = r.tingkat_pendidikan_id ? Number(r.tingkat_pendidikan_id) : 0;
          if (tingkat === 10) t10++;
          else if (tingkat === 11) t11++;
          else if (tingkat === 12) t12++;
        }
      });

      return {
        id: cat.id,
        kategori: cat.name,
        tingkat10: t10,
        tingkat11: t11,
        tingkat12: t12,
        total: t10 + t11 + t12
      };
    });

    return result;
  }

  async getRombelRekapKompetensi(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    const rombels = await this.prisma.rombonganBelajar.findMany({
      where: {
        sekolah_id: filter.sekolah_id,
        jenis_rombel: 1,
      },
      select: {
        nama: true,
        tingkat_pendidikan_id: true,
      }
    });

    const rekapMap = new Map<string, { t10: number, t11: number, t12: number }>();

    rombels.forEach(r => {
      const parts = r.nama.split(' ');
      let kode = parts.length > 1 ? parts[1] : 'Umum';
      if (kode === 'MIPA' || kode === 'IPS') kode = parts[1];

      if (!rekapMap.has(kode)) {
        rekapMap.set(kode, { t10: 0, t11: 0, t12: 0 });
      }

      const data = rekapMap.get(kode)!;
      const tingkat = r.tingkat_pendidikan_id ? Number(r.tingkat_pendidikan_id) : 0;
      if (tingkat === 10) data.t10++;
      else if (tingkat === 11) data.t11++;
      else if (tingkat === 12) data.t12++;
    });

    let index = 1;
    return Array.from(rekapMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([kode, counts]) => ({
        id: index++,
        kompetensi: kode,
        tingkat10: counts.t10,
        tingkat11: counts.t11,
        tingkat12: counts.t12,
        total: counts.t10 + counts.t11 + counts.t12
      }));
  }

  async getRombonganBelajar(sekolahId: string | null, type?: string, limit: number = 10, page: number = 1, search?: string, tingkat?: string) {
    const filter = this.getSekolahFilter(sekolahId);
    
    let whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
      ],
    };

    if (type === 'reguler') {
      whereClause.AND.push({ jenis_rombel: 1 });
    } else if (type === 'praktik' || type === 'praktek') {
      whereClause.AND.push({ jenis_rombel: 2 });
    } else if (type === 'ekskul') {
      whereClause.AND.push({ jenis_rombel: 51 });
    } else if (type === 'pilihan') {
      whereClause.AND.push({ jenis_rombel: 16 });
    } else if (type === 'wali') {
      whereClause.AND.push({ jenis_rombel: 18 });
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

    // Collect IDs
    const ptkIds = data.map(item => item.ptk_id).filter(Boolean) as string[];
    const kurikulumIds = data.map(item => item.kurikulum_id).filter(Boolean) as number[];
    const idRuangs = data.map(item => item.id_ruang).filter(Boolean) as string[];

    // Fetch related
    const [gtks, kurikulums, ruangs] = await Promise.all([
      ptkIds.length > 0 ? this.prisma.gtk.findMany({
        where: { ptk_id: { in: ptkIds } },
        select: { ptk_id: true, nama: true }
      }) : [],
      kurikulumIds.length > 0 ? this.prisma.kurikulum.findMany({
        where: { kurikulum_id: { in: kurikulumIds } },
        select: { kurikulum_id: true, nama_kurikulum: true }
      }) : [],
      idRuangs.length > 0 ? this.prisma.ruang.findMany({
        where: { id_ruang: { in: idRuangs } },
        select: { id_ruang: true, nm_ruang: true }
      }) : []
    ]);

    // Create maps
    const gtkMap = new Map(gtks.map(item => [item.ptk_id, item.nama] as [any, any]));
    const kurikulumMap = new Map(kurikulums.map(item => [item.kurikulum_id, item.nama_kurikulum] as [any, any]));
    const ruangMap = new Map(ruangs.map(item => [item.id_ruang, item.nm_ruang] as [any, any]));

    return {
      total,
      data: data.map(item => ({
        ...item,
        jumlah_siswa: item._count.anggota_rombel,
        ptk_id_str: item.ptk_id ? (gtkMap.get(item.ptk_id) || "") : "",
        tingkat_pendidikan_id_str: item.tingkat_pendidikan_id ? `Tingkat ${item.tingkat_pendidikan_id}` : "",
        kurikulum_id_str: item.kurikulum_id ? (kurikulumMap.get(item.kurikulum_id) || "") : "",
        id_ruang_str: item.id_ruang ? (ruangMap.get(item.id_ruang) || "") : ""
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
      select: { nama: true, sekolah_id: true, kurikulum_id: true, tingkat_pendidikan_id: true },
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
    const pembelajarans = await this.prisma.pembelajaran.findMany({
      where: { rombongan_belajar_id: { in: rombelIds } },
      select: {
        pembelajaran_id: true,
        mata_pelajaran_id: true,
        nama_mata_pelajaran: true,
        jam_mengajar_per_minggu: true,
        ptk_id: true,
        ptk_terdaftar_id: true,
      },
      orderBy: { nama_mata_pelajaran: 'asc' },
    });

    // 4. Tarik semua GTK di sekolah untuk pemetaan in-memory ptk_terdaftar_id
    const gtks = await this.prisma.gtk.findMany({
      where: { sekolah_id: rombel.sekolah_id },
      select: {
        ptk_id: true,
        ptk_terdaftar_id: true,
        nama: true,
      },
    });

    // 5. Tarik info mata_pelajaran untuk menentukan jurusan_id secara in-memory
    const matpelIds = pembelajarans
      .map((p) => p.mata_pelajaran_id)
      .filter((id): id is number => id !== null);

    const matpels = await this.prisma.mata_pelajaran.findMany({
      where: { mata_pelajaran_id: { in: matpelIds } },
      select: {
        mata_pelajaran_id: true,
        jurusan_id: true,
      },
    });

    // Fetch mata_pelajaran_kurikulum mapping supporting classification
    let matpelKuris: any[] = [];
    if (rombel.kurikulum_id) {
      matpelKuris = await this.prisma.mata_pelajaran_kurikulum.findMany({
        where: {
          kurikulum_id: rombel.kurikulum_id,
          mata_pelajaran_id: { in: matpelIds },
        },
        select: {
          mata_pelajaran_id: true,
          a_peminatan: true,
          area_kompetensi: true,
        },
      });
    }

    const matpelKuriMap = new Map<number, any>();
    matpelKuris.forEach((mk) => {
      matpelKuriMap.set(mk.mata_pelajaran_id, mk);
    });

    const matpelMap = new Map<number, string | null>();
    matpels.forEach((m) => {
      matpelMap.set(m.mata_pelajaran_id, m.jurusan_id);
    });

    const gtkMap = new Map<string, any>();
    gtks.forEach((g) => {
      if (g.ptk_terdaftar_id) {
        gtkMap.set(g.ptk_terdaftar_id, g);
      }
    });

    return pembelajarans.map((p) => {
      const match = p.ptk_terdaftar_id ? gtkMap.get(p.ptk_terdaftar_id) : null;
      let jurusanId = p.mata_pelajaran_id ? matpelMap.get(p.mata_pelajaran_id) : null;

      // Fallback: classify based on mata_pelajaran_kurikulum if database jurusan_id is null/empty
      if (!jurusanId && p.mata_pelajaran_id) {
        const mkInfo = matpelKuriMap.get(p.mata_pelajaran_id);
        if (mkInfo) {
          const aPeminatanNum = mkInfo.a_peminatan ? Number(mkInfo.a_peminatan) : 0;
          if (aPeminatanNum === 1 || mkInfo.area_kompetensi === 'P' || mkInfo.area_kompetensi === 'C') {
            jurusanId = 'KEJURUAN';
          }
        }
      }

      return {
        ...p,
        gtk: match || null,
        jurusan_id: jurusanId || null,
      };
    });
  }

  async getEkstrakurikuler(sekolahId: string | null, search?: string) {
    const filter = this.getSekolahFilter(sekolahId);
    
    let whereClause: any = {
      AND: [
        { sekolah_id: filter.sekolah_id },
        { jenis_rombel: 51 }, // 51 for Ekstrakurikuler
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
        ptk_id: true,
        _count: {
          select: { anggota_rombel: true }
        }
      },
      orderBy: { nama: 'asc' },
    });

    // Collect IDs
    const ptkIds = data.map(item => item.ptk_id).filter(Boolean) as string[];
    const idRuangs = data.map(item => item.id_ruang).filter(Boolean) as string[];

    // Fetch related
    const [gtks, ruangs] = await Promise.all([
      ptkIds.length > 0 ? this.prisma.gtk.findMany({
        where: { ptk_id: { in: ptkIds } },
        select: { ptk_id: true, nama: true }
      }) : [],
      idRuangs.length > 0 ? this.prisma.ruang.findMany({
        where: { id_ruang: { in: idRuangs } },
        select: { id_ruang: true, nm_ruang: true }
      }) : []
    ]);

    // Create maps
    const gtkMap = new Map(gtks.map(item => [item.ptk_id, item.nama] as [any, any]));
    const ruangMap = new Map(ruangs.map(item => [item.id_ruang, item.nm_ruang] as [any, any]));

    return data.map(item => ({
      ...item,
      nm_ekskul: item.nama,
      anggotaRombel: item._count.anggota_rombel,
      ptk_id_str: item.ptk_id ? (gtkMap.get(item.ptk_id) || "") : "",
      id_ruang_str: item.id_ruang ? (ruangMap.get(item.id_ruang) || "") : ""
    }));
  }

  async getJurusan(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);

    const rombels = await this.prisma.rombonganBelajar.findMany({
      where: {
        sekolah_id: filter.sekolah_id,
        jenis_rombel: 1,
        soft_delete: 0,
        jurusan_sp_id: { not: null },
      },
      select: {
        nama: true,
        jurusan_sp: {
          select: {
            nama_jurusan_sp: true,
          },
        },
      },
    });

    const uniqueJurusan = new Map<string, string>();
    for (const r of rombels) {
      if (!r.jurusan_sp) continue;
      const parts = r.nama.trim().split(/\s+/);
      const kode = parts.length > 2 ? parts[1] : (parts.length > 1 ? parts[1] : parts[0]);
      if (kode) {
        uniqueJurusan.set(kode, r.jurusan_sp.nama_jurusan_sp);
      }
    }

    return Array.from(uniqueJurusan.entries()).map(([kode, nama]) => ({
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

  async getAllPembelajaran(sekolahId: string | null) {
    const filter = this.getSekolahFilter(sekolahId);
    const pembelajarans = await this.prisma.pembelajaran.findMany({
      where: { sekolah_id: filter.sekolah_id },
      select: {
        pembelajaran_id: true,
        rombongan_belajar_id: true,
        nama_mata_pelajaran: true,
        jam_mengajar_per_minggu: true,
        ptk_id: true,
        ptk_terdaftar_id: true,
        semester_id: true,
        rombongan_belajar: {
          select: {
            rombongan_belajar_id: true,
            nama: true,
            semester_id: true,
          },
        },
      },
      orderBy: { nama_mata_pelajaran: 'asc' },
    });

    if (pembelajarans.length === 0) return [];

    // Tarik semua GTK di sekolah untuk pemetaan in-memory
    const gtks = await this.prisma.gtk.findMany({
      where: { sekolah_id: filter.sekolah_id },
      select: {
        ptk_id: true,
        ptk_terdaftar_id: true,
        nama: true,
      },
    });

    const gtkMap = new Map<string, any>();
    gtks.forEach((g) => {
      if (g.ptk_terdaftar_id) {
        gtkMap.set(g.ptk_terdaftar_id, g);
      }
    });

    return pembelajarans.map((p) => {
      const match = p.ptk_terdaftar_id ? gtkMap.get(p.ptk_terdaftar_id) : null;
      return {
        ...p,
        gtk: match || null,
      };
    });
  }

  async getGtk(
    sekolahId: string | null,
    limit: number = 10,
    search?: string,
    page: number = 1,
    type?: 'guru' | 'tendik',
    status?: 'aktif' | 'non-aktif',
    completeness?: string
  ) {
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

    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const hasCompletenessFilter = completeness && completeness !== 'all';

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

    const querySelect = {
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
      rt: true,
      rw: true,
      nama_dusun: true,
      desa_kelurahan: true,
      kode_wilayah: true,
      kode_pos: true,
      lintang: true,
      bujur: true,
      status_perkawinan: true,
      nama_suami_istri: true,
      pekerjaan_suami_istri: true,
      nm_wp: true,
      npwp: true,
      id_bank: true,
      rekening_bank: true,
      rekening_atas_nama: true,
      nama_kcp: true,
      no_whatsapp: true,
      id_telegram: true,
      tanggal_surat_tugas: true,
      status: true,
      no_kk: true,
      no_hp: true,
      email: true,
      tanda_tangan: true,
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
      agama: {
        select: { nama: true }
      },
      rwy_sertifikasi: {
        select: { riwayat_sertifikasi_id: true }
      },
      riwayat_pendidikan_formal: {
        select: {
          jenjang_pendidikan_id: true
        }
      }
    };

    const checkGtkCompleteness = (item: any) => {
      const allFields = [
        'nama', 'nik', 'no_kk', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
        'nama_ibu_kandung', 'agama_id_str', 'status_perkawinan', 'nama_suami_istri',
        'pekerjaan_suami_istri', 'nm_wp', 'npwp', 'alamat_jalan', 'rt', 'rw',
        'nama_dusun', 'desa_kelurahan', 'provinsi', 'kabupaten_kota', 'kecamatan',
        'kode_pos', 'lintang', 'bujur', 'sumber_gaji', 'id_bank', 'rekening_bank',
        'rekening_atas_nama', 'nama_kcp', 'no_hp', 'no_whatsapp', 'id_telegram',
        'email', 'tanda_tangan'
      ];

      const isFieldFilled = (key: string) => {
        if (key === 'provinsi' || key === 'kabupaten_kota' || key === 'kecamatan') {
          const desa = item['desa_kelurahan'];
          const kodeWilayah = item['kode_wilayah'];
          if ((desa && desa !== '-' && desa !== '') || (kodeWilayah && kodeWilayah !== '-' && kodeWilayah !== '')) {
            return true;
          }
        }
        const value = item[key];
        if (value && value !== '-' && value !== '' && value !== 0 && value !== '0') {
          return true;
        }
        return false;
      };

      const fields = allFields.filter(key => {
        if (key === 'id_bank' || key === 'rekening_bank' || key === 'rekening_atas_nama' || key === 'nama_kcp') {
          return item['memilikiSertifikasi'] === 'Ya';
        }
        if (key === 'nama_suami_istri' || key === 'pekerjaan_suami_istri') {
          const statusPerkawinan = item['status_perkawinan'];
          return statusPerkawinan === '1' || statusPerkawinan === 1;
        }
        return true;
      });

      let filled = 0;
      fields.forEach(f => {
        if (isFieldFilled(f)) {
          filled++;
        }
      });
      return Math.round((filled / fields.length) * 100);
    };

    if (hasCompletenessFilter) {
      // 1. Fetch ALL matching records
      const rawData = await this.prisma.gtk.findMany({
        where: whereClause,
        select: querySelect,
        orderBy: { nama: 'asc' },
      });

      const wilayahCache = new Map<string, any>();
      const mappedAll = await Promise.all(rawData.map(async (item: any) => {
        const wilayahHierarchy = await this.resolveWilayahHierarchy(item.kode_wilayah, wilayahCache);
        return {
          ptk_id: item.ptk_id,
          nama: item.nama,
          nuptk: item.nuptk,
          nik: item.nik,
          nip: item.nip,
          foto: item.foto ? (item.foto.startsWith('http') ? `${item.foto}${item.foto.includes('?') ? '&' : '?'}t=${Date.now()}` : `${appUrl}${item.foto}?t=${Date.now()}`) : null,
          qr_token: item.qr_token,
          ptk_induk: item.ptk_induk,
          jenis_kelamin: item.jenis_kelamin,
          tempat_lahir: item.tempat_lahir,
          tanggal_lahir: item.tanggal_lahir,
          nama_ibu_kandung: item.nama_ibu_kandung,
          alamat_jalan: item.alamat_jalan,
          rt: item.rt !== null && item.rt !== undefined ? String(item.rt) : null,
          rw: item.rw !== null && item.rw !== undefined ? String(item.rw) : null,
          nama_dusun: item.nama_dusun,
          desa_kelurahan: item.desa_kelurahan || wilayahHierarchy.desa,
          kode_wilayah: item.kode_wilayah,
          provinsi: wilayahHierarchy.provinsi,
          kabupaten_kota: wilayahHierarchy.kabupaten,
          kecamatan: wilayahHierarchy.kecamatan,
          kode_pos: item.kode_pos,
          lintang: item.lintang !== null && item.lintang !== undefined ? String(item.lintang) : null,
          bujur: item.bujur !== null && item.bujur !== undefined ? String(item.bujur) : null,
          status_perkawinan: item.status_perkawinan !== null && item.status_perkawinan !== undefined ? String(item.status_perkawinan) : null,
          nama_suami_istri: item.nama_suami_istri,
          pekerjaan_suami_istri: item.pekerjaan_suami_istri !== null && item.pekerjaan_suami_istri !== undefined ? String(item.pekerjaan_suami_istri) : null,
          nm_wp: item.nm_wp,
          npwp: item.npwp,
          id_bank: item.id_bank,
          rekening_bank: item.rekening_bank,
          rekening_atas_nama: item.rekening_atas_nama,
          nama_kcp: item.nama_kcp,
          no_whatsapp: item.no_whatsapp,
          id_telegram: item.id_telegram,
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
          agama_id_str: item.agama?.nama || null,
          memilikiSertifikasi: item.rwy_sertifikasi && item.rwy_sertifikasi.length > 0 ? "Ya" : "Tidak",
          pendidikan_terakhir: getPendidikanTerakhir(item.riwayat_pendidikan_formal),
          updated_at: item.last_update,
        };
      }));

      // 2. Filter by completeness
      let filteredData = mappedAll;
      if (completeness === '100') {
        filteredData = mappedAll.filter((item: any) => checkGtkCompleteness(item) === 100);
      } else if (completeness === '99') {
        filteredData = mappedAll.filter((item: any) => checkGtkCompleteness(item) < 100);
      } else if (completeness === '50') {
        filteredData = mappedAll.filter((item: any) => checkGtkCompleteness(item) < 50);
      }

      // 3. Paginate
      const totalFiltered = filteredData.length;
      const skip = (page - 1) * limit;
      const paginatedData = filteredData.slice(skip, skip + limit);

      return { total: totalFiltered, data: paginatedData };

    } else {
      // Standard database pagination (when not filtering by completeness)
      const skip = (page - 1) * limit;
      const [totalCount, rawData] = await Promise.all([
        this.prisma.gtk.count({ where: whereClause }),
        this.prisma.gtk.findMany({
          where: whereClause,
          take: limit,
          skip: skip,
          select: querySelect,
          orderBy: { nama: 'asc' },
        })
      ]);

      const wilayahCache = new Map<string, any>();
      const mappedData = await Promise.all(rawData.map(async (item: any) => {
        const wilayahHierarchy = await this.resolveWilayahHierarchy(item.kode_wilayah, wilayahCache);
        return {
          ptk_id: item.ptk_id,
          nama: item.nama,
          nuptk: item.nuptk,
          nik: item.nik,
          nip: item.nip,
          foto: item.foto ? (item.foto.startsWith('http') ? `${item.foto}${item.foto.includes('?') ? '&' : '?'}t=${Date.now()}` : `${appUrl}${item.foto}?t=${Date.now()}`) : null,
          qr_token: item.qr_token,
          ptk_induk: item.ptk_induk,
          jenis_kelamin: item.jenis_kelamin,
          tempat_lahir: item.tempat_lahir,
          tanggal_lahir: item.tanggal_lahir,
          nama_ibu_kandung: item.nama_ibu_kandung,
          alamat_jalan: item.alamat_jalan,
          rt: item.rt !== null && item.rt !== undefined ? String(item.rt) : null,
          rw: item.rw !== null && item.rw !== undefined ? String(item.rw) : null,
          nama_dusun: item.nama_dusun,
          desa_kelurahan: item.desa_kelurahan || wilayahHierarchy.desa,
          kode_wilayah: item.kode_wilayah,
          provinsi: wilayahHierarchy.provinsi,
          kabupaten_kota: wilayahHierarchy.kabupaten,
          kecamatan: wilayahHierarchy.kecamatan,
          kode_pos: item.kode_pos,
          lintang: item.lintang !== null && item.lintang !== undefined ? String(item.lintang) : null,
          bujur: item.bujur !== null && item.bujur !== undefined ? String(item.bujur) : null,
          status_perkawinan: item.status_perkawinan !== null && item.status_perkawinan !== undefined ? String(item.status_perkawinan) : null,
          nama_suami_istri: item.nama_suami_istri,
          pekerjaan_suami_istri: item.pekerjaan_suami_istri !== null && item.pekerjaan_suami_istri !== undefined ? String(item.pekerjaan_suami_istri) : null,
          nm_wp: item.nm_wp,
          npwp: item.npwp,
          id_bank: item.id_bank,
          rekening_bank: item.rekening_bank,
          rekening_atas_nama: item.rekening_atas_nama,
          nama_kcp: item.nama_kcp,
          no_whatsapp: item.no_whatsapp,
          id_telegram: item.id_telegram,
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
          agama_id_str: item.agama?.nama || null,
          memilikiSertifikasi: item.rwy_sertifikasi && item.rwy_sertifikasi.length > 0 ? "Ya" : "Tidak",
          pendidikan_terakhir: getPendidikanTerakhir(item.riwayat_pendidikan_formal),
          updated_at: item.last_update,
        };
      }));

      return { total: totalCount, data: mappedData };
    }
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
        tugas_tambahan: true,
        anak: {
          include: {
            status_anak: true,
            jenjang_pendidikan: true
          }
        },
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

      const refBidangStudi = await this.prisma.bidang_studi.findMany({
        select: {
          bidang_studi_id: true,
          bidang_studi: true,
        }
      });

      const mappedRiwayat = gtk.riwayat_pendidikan_formal.map(edu => {
        const { jenjang_pendidikan, ...rest } = edu as any;
        const bs = refBidangStudi.find((x: any) => x.bidang_studi_id === edu.bidang_studi_id);
        return {
          ...rest,
          jenjang_pendidikan_id_str: jenjang_pendidikan?.nama || null,
          bidang_studi_id_str: bs?.bidang_studi || null,
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
        const bs = refBidangStudi.find((x: any) => x.bidang_studi_id === highest.bidang_studi_id);
        bidangStudiTerakhir = bs?.bidang_studi || null;
      }

      const refStatusKurikulum = await this.prisma.status_di_kurikulum.findMany({
        select: {
          status_di_kurikulum: true,
          ket_stat_di_kurikulum: true,
        }
      });

      const orConditions: any[] = [];
      if (gtk.ptk_terdaftar_id) orConditions.push({ ptk_terdaftar_id: gtk.ptk_terdaftar_id });
      if (gtk.ptk_id) orConditions.push({ ptk_id: gtk.ptk_id });

      let rawPembelajaran: any[] = [];
      if (orConditions.length > 0) {
        rawPembelajaran = await this.prisma.pembelajaran.findMany({
          where: {
            OR: orConditions,
            sekolah_id: sekolahId
          },
          include: {
            rombongan_belajar: true
          }
        });
      }

      const mappedPembelajaran = rawPembelajaran.map((p: any) => {
        const statusVal = p.status_di_kurikulum !== null && p.status_di_kurikulum !== undefined ? Number(p.status_di_kurikulum) : null;
        const refStatus = refStatusKurikulum.find((x: any) => Number(x.status_di_kurikulum) === statusVal);
        return {
          ...p,
          status_kurikulum_id_str: refStatus?.ket_stat_di_kurikulum || null,
        };
      });

      const refJabatanTugas = await this.prisma.jabatan_tugas_ptk.findMany({
        select: {
          jabatan_ptk_id: true,
          nama: true,
          jumlah_jam_diakui: true,
        }
      });

      const mappedTugasTambahan = (gtk.tugas_tambahan || []).map((t: any) => {
        const jabVal = t.jabatan_ptk_id !== null && t.jabatan_ptk_id !== undefined ? Number(t.jabatan_ptk_id) : null;
        const refJab = refJabatanTugas.find((x: any) => Number(x.jabatan_ptk_id) === jabVal);
        return {
          ...t,
          jabatan_tugas_nama: refJab?.nama || null,
          jumlah_jam_diakui: refJab?.jumlah_jam_diakui !== null && refJab?.jumlah_jam_diakui !== undefined ? Number(refJab.jumlah_jam_diakui) : 0,
        };
      });

      const g = gtk as any;
      const resolved = await this.referenceService.resolveGtk(gtk);
      return {
        ...resolved,
        riwayat_pendidikan_formal: mappedRiwayat,
        pembelajaran: mappedPembelajaran,
        tugas_tambahan: mappedTugasTambahan,
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

  async createGtkAnak(sekolahId: string, ptkId: string, body: any) {
    const ptk = await this.prisma.gtk.findFirst({
      where: { ptk_id: ptkId, sekolah_id: sekolahId },
    });
    if (!ptk) {
      throw new NotFoundException(`GTK not found.`);
    }

    return await this.prisma.anak.create({
      data: {
        sekolah_id: sekolahId,
        ptk_id: ptkId,
        nama: body.nama,
        nik: body.nik || null,
        nisn: body.nisn || null,
        jenis_kelamin: body.jenis_kelamin,
        tempat_lahir: body.tempat_lahir || null,
        tanggal_lahir: new Date(body.tanggal_lahir),
        status_anak_id: Number(body.status_anak_id),
        jenjang_pendidikan_id: Number(body.jenjang_pendidikan_id),
        tahun_masuk: body.tahun_masuk ? Number(body.tahun_masuk) : null,
        soft_delete: 0,
        updater_id: ptkId,
      },
    });
  }

  async updateGtkAnak(sekolahId: string, ptkId: string, anakId: string, body: any) {
    const child = await this.prisma.anak.findFirst({
      where: { anak_id: anakId, ptk_id: ptkId, sekolah_id: sekolahId },
    });
    if (!child) {
      throw new NotFoundException(`Child record not found.`);
    }

    return await this.prisma.anak.update({
      where: { anak_id: anakId },
      data: {
        nama: body.nama,
        nik: body.nik || null,
        nisn: body.nisn || null,
        jenis_kelamin: body.jenis_kelamin,
        tempat_lahir: body.tempat_lahir || null,
        tanggal_lahir: new Date(body.tanggal_lahir),
        status_anak_id: Number(body.status_anak_id),
        jenjang_pendidikan_id: Number(body.jenjang_pendidikan_id),
        tahun_masuk: body.tahun_masuk ? Number(body.tahun_masuk) : null,
        soft_delete: body.soft_delete !== undefined ? Number(body.soft_delete) : child.soft_delete,
        last_update: new Date(),
      },
    });
  }

  async deleteGtkAnak(sekolahId: string, ptkId: string, anakId: string) {
    const child = await this.prisma.anak.findFirst({
      where: { anak_id: anakId, ptk_id: ptkId, sekolah_id: sekolahId },
    });
    if (!child) {
      throw new NotFoundException(`Child record not found.`);
    }

    return await this.prisma.anak.update({
      where: { anak_id: anakId },
      data: {
        soft_delete: 1,
        last_update: new Date(),
      },
    });
  }

  async updateGtk(sekolahId: string, id: string, data: any) {
    const updateData: any = { ...data };
    delete updateData.ptk_id;
    delete updateData.sekolah_id;

    const cleanData: any = {};
    const safeGtkFields = [
      'no_kk', 'nm_wp', 'npwp', 'alamat_jalan', 'rt', 'rw', 'nama_dusun',
      'desa_kelurahan', 'kode_pos', 'lintang', 'bujur', 'no_telepon_rumah',
      'no_hp', 'rekening_bank', 'rekening_atas_nama', 'no_whatsapp', 'id_telegram',
      'nama_kcp'
    ];

    for (const field of safeGtkFields) {
      if (updateData[field] !== undefined) {
        cleanData[field] = updateData[field];
      }
    }

    const mapNumeric = (val: any) => (val !== undefined && val !== null && val !== '' ? Number(val) : undefined);
    const mapString = (val: any) => (val !== undefined && val !== null && val !== '' ? String(val) : undefined);

    if (updateData.no_wa !== undefined) {
      cleanData.no_whatsapp = updateData.no_wa;
    }
    if (updateData.id_telegram !== undefined) {
      cleanData.id_telegram = updateData.id_telegram;
    }
    if (updateData.kecamatan !== undefined && updateData.kecamatan !== "") {
      const isNumericOnly = /^[0-9.\s-]+$/.test(String(updateData.kecamatan).trim());
      if (isNumericOnly) {
        const cleanKec = String(updateData.kecamatan).replace(/[^0-9]/g, '');
        if (cleanKec.length >= 6) {
          cleanData.kode_wilayah = cleanKec;
        }
      }
    }

    if (updateData.status_perkawinan !== undefined) cleanData.status_perkawinan = mapNumeric(updateData.status_perkawinan);
    if (updateData.agama_id !== undefined) cleanData.agama_id = mapNumeric(updateData.agama_id);
    if (updateData.sumber_gaji_id !== undefined) cleanData.sumber_gaji_id = mapNumeric(updateData.sumber_gaji_id);
    if (updateData.pekerjaan_suami_istri !== undefined) cleanData.pekerjaan_suami_istri = mapNumeric(updateData.pekerjaan_suami_istri);
    if (updateData.id_bank !== undefined) cleanData.id_bank = mapString(updateData.id_bank);
    else if (updateData.namaBank !== undefined) cleanData.id_bank = mapString(updateData.namaBank);

    const updatedGtk = await this.prisma.gtk.update({
      where: { ptk_id: id },
      data: cleanData,
    });

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
        rombongan_belajar: {
          select: {
            rombongan_belajar_id: true,
            nama: true,
            tingkat_pendidikan_id: true,
            semester_id: true,
            ptk_id: true,
          }
        },
        anggota_rombel: {
          where: {
            rombongan_belajar: {
              jenis_rombel: { in: [1, 51] },
            }
          },
          select: {
            rombongan_belajar: {
              select: {
                rombongan_belajar_id: true,
                nama: true,
                tingkat_pendidikan_id: true,
                semester_id: true,
                jenis_rombel: true,
                ptk_id: true,
              }
            }
          }
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

    const cleanData: any = {};
    const safePdFields = [
      'no_kk', 'reg_akta_lahir', 'alamat_jalan', 'rt', 'rw', 'nama_dusun',
      'desa_kelurahan', 'kode_pos', 'lintang', 'bujur', 'nik_ayah', 'nik_ibu',
      'nik_wali', 'nomor_telepon_rumah', 'nomor_telepon_seluler', 'nama_ayah',
      'tahun_lahir_ayah', 'tahun_lahir_ibu', 'nama_wali', 'tahun_lahir_wali',
      'berat_badan', 'tinggi_badan', 'lingkar_kepala', 'jarak_rumah_ke_sekolah',
      'jarak_rumah_ke_sekolah_km', 'waktu_tempuh_ke_sekolah', 'menit_tempuh_ke_sekolah',
      'jumlah_saudara_kandung', 'anak_keberapa', 'email', 'email_aktif', 'no_whatsapp'
    ];

    for (const field of safePdFields) {
      if (updateData[field] !== undefined) {
        cleanData[field] = updateData[field];
      }
    }

    const mapNumeric = (val: any) => (val !== undefined ? (val === null || val === '' ? null : Number(val)) : undefined);
    const mapString = (val: any) => (val !== undefined ? (val === null || val === '' ? null : String(val)) : undefined);

    if (updateData.kecamatan !== undefined && updateData.kecamatan !== "") {
      const isNumericOnly = /^[0-9.\s-]+$/.test(String(updateData.kecamatan).trim());
      if (isNumericOnly) {
        const cleanKec = String(updateData.kecamatan).replace(/[^0-9]/g, '');
        if (cleanKec.length >= 6) {
          cleanData.kode_wilayah = cleanKec;
        }
      }
    }

    if (updateData.no_wa !== undefined) {
      cleanData.no_whatsapp = updateData.no_wa;
    }

    if (updateData.email !== undefined) {
      cleanData.email_aktif = updateData.email;
    }

    if (updateData.id_hobby !== undefined) cleanData.id_hobby = mapNumeric(updateData.id_hobby);
    if (updateData.id_cita !== undefined) cleanData.id_cita = mapNumeric(updateData.id_cita);

    if (updateData.agama_id !== undefined) cleanData.agama_id = mapNumeric(updateData.agama_id);
    else if (updateData.agama_id_str !== undefined) cleanData.agama_id = mapNumeric(updateData.agama_id_str);

    if (updateData.jenis_tinggal_id !== undefined) cleanData.jenis_tinggal_id = mapNumeric(updateData.jenis_tinggal_id);
    else if (updateData.jenis_tinggal_id_str !== undefined) cleanData.jenis_tinggal_id = mapNumeric(updateData.jenis_tinggal_id_str);

    if (updateData.alat_transportasi_id !== undefined) cleanData.alat_transportasi_id = mapNumeric(updateData.alat_transportasi_id);
    else if (updateData.alat_transportasi_id_str !== undefined) cleanData.alat_transportasi_id = mapNumeric(updateData.alat_transportasi_id_str);

    if (updateData.kebutuhan_khusus_id !== undefined) {
      cleanData.kebutuhan_khusus_id = (updateData.kebutuhan_khusus_id === null || updateData.kebutuhan_khusus_id === '') ? 0 : Number(updateData.kebutuhan_khusus_id);
    }
    if (updateData.kebutuhan_khusus_id_ayah !== undefined) {
      cleanData.kebutuhan_khusus_id_ayah = (updateData.kebutuhan_khusus_id_ayah === null || updateData.kebutuhan_khusus_id_ayah === '') ? 0 : Number(updateData.kebutuhan_khusus_id_ayah);
    }
    if (updateData.kebutuhan_khusus_id_ibu !== undefined) {
      cleanData.kebutuhan_khusus_id_ibu = (updateData.kebutuhan_khusus_id_ibu === null || updateData.kebutuhan_khusus_id_ibu === '') ? 0 : Number(updateData.kebutuhan_khusus_id_ibu);
    }

    // Pekerjaan
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

    const updatedPd = await this.prisma.pesertaDidik.update({
      where: { peserta_didik_id: id },
      data: cleanData,
    });

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

  async getDistinctRoles(sekolahId?: string) {
    const users = await this.prisma.pengguna.findMany({
      where: sekolahId ? { sekolah_id: sekolahId } : undefined,
      select: {
        peran_id: true,
        peran_nama: true,
      }
    });
    const distinct = Array.from(
      new Map(users.map(u => [`${u.peran_id}-${u.peran_nama}`, u])).values()
    );
    
    // Filter out generic PTK role (peran_id: 53)
    const baseRoles = distinct.filter(r => r.peran_id !== 53);

    // Fetch distinct jenis_ptk_id from gtk table filtered by sekolah_id
    const distinctGtks = await this.prisma.gtk.findMany({
      select: {
        jenis_ptk_id: true,
      },
      where: {
        jenis_ptk_id: { not: null },
        sekolah_id: sekolahId ? sekolahId : undefined,
      },
      distinct: ['jenis_ptk_id'],
    });

    const activeJenisPtkIds = distinctGtks.map(g => Number(g.jenis_ptk_id));

    // Fetch only the types of PTK (jenis_ptk) that are active in gtks
    const jenisPtks = await this.prisma.jenis_ptk.findMany({
      where: {
        jenis_ptk_id: { in: activeJenisPtkIds }
      },
      select: {
        jenis_ptk_id: true,
        jenis_ptk: true,
      },
      orderBy: {
        jenis_ptk: 'asc'
      }
    });

    const ptkRoles = jenisPtks.map(j => ({
      peran_id: 1000 + Number(j.jenis_ptk_id),
      peran_nama: j.jenis_ptk,
    }));

    // Fetch distinct tugas_tambahan jabatan_ptk_id active in this school
    const distinctTugas = await this.prisma.tugasTambahan.findMany({
      select: {
        jabatan_ptk_id: true,
      },
      where: {
        sekolah_id: sekolahId ? sekolahId : undefined,
        jabatan_ptk_id: { not: null }
      },
      distinct: ['jabatan_ptk_id']
    });

    const activeJabatanIds = distinctTugas.map(t => Number(t.jabatan_ptk_id));

    const jabatans = await this.prisma.jabatan_tugas_ptk.findMany({
      where: {
        jabatan_ptk_id: { in: activeJabatanIds }
      },
      select: {
        jabatan_ptk_id: true,
        nama: true,
      },
      orderBy: {
        nama: 'asc'
      }
    });

    const tugasRoles = jabatans.map(j => ({
      peran_id: 2000 + Number(j.jabatan_ptk_id),
      peran_nama: j.nama,
    }));

    // Fetch distinct custom jabatans active in this school
    const distinctCustomTugas = await this.prisma.tugasTambahan.findMany({
      select: {
        jabatan: true,
      },
      where: {
        sekolah_id: sekolahId ? sekolahId : undefined,
        jabatan: { not: null, notIn: [''] },
        jabatan_ptk_id: null,
      },
      distinct: ['jabatan'],
    });

    const customRoles = distinctCustomTugas.map((t) => {
      const name = t.jabatan!;
      let hash = 0;
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hashId = 30000 + (Math.abs(hash) % 10000);
      return {
        peran_id: hashId,
        peran_nama: name,
      };
    });

    return [...tugasRoles, ...customRoles];
  }

  async getMenuRoles() {
    return this.prisma.menuRole.findMany();
  }

  async saveMenuRoles(peranId: number, peranNama: string, menuIds: string[]) {
    await this.prisma.$transaction([
      this.prisma.menuRole.deleteMany({
        where: { peran_id: peranId }
      }),
      this.prisma.menuRole.createMany({
        data: menuIds.map(menuId => ({
          menu_id: menuId,
          peran_id: peranId,
          peran_nama: peranNama,
        }))
      })
    ]);
    return { success: true };
  }

  async getMyMenus(peranId: number) {
    const mappings = await this.prisma.menuRole.findMany({
      where: { peran_id: peranId },
      select: { menu_id: true }
    });
    return mappings.map(m => m.menu_id);
  }

  async getMyMenusByUserId(penggunaId: string) {
    const pengguna = await this.prisma.pengguna.findUnique({
      where: { pengguna_id: penggunaId },
      select: { peran_id: true, ptk_id: true, sekolah_id: true }
    });
    if (!pengguna) return [];

    let allowedMenuIds: string[] = [];

    if (pengguna.ptk_id) {
      // 1. Fetch from jenis_ptk
      const gtk = await this.prisma.gtk.findUnique({
        where: { ptk_id: pengguna.ptk_id },
        select: { jenis_ptk_id: true }
      });
      if (gtk && gtk.jenis_ptk_id) {
        const jPtk = await this.prisma.jenis_ptk.findUnique({
          where: { jenis_ptk_id: gtk.jenis_ptk_id },
          select: { jenis_ptk: true }
        });
        if (jPtk) {
          const mappings = await this.prisma.menuRole.findMany({
            where: { peran_nama: jPtk.jenis_ptk },
            select: { menu_id: true }
          });
          allowedMenuIds.push(...mappings.map(m => m.menu_id));
        }
      }

      // 2. Fetch from tugas_tambahan
      const additionalTasks = await this.prisma.tugasTambahan.findMany({
        where: { ptk_id: pengguna.ptk_id, sekolah_id: pengguna.sekolah_id || undefined },
        select: { jabatan_ptk_id: true }
      });

      const taskJabatanIds = additionalTasks.map(t => Number(t.jabatan_ptk_id));

      if (taskJabatanIds.length > 0) {
        const jabatans = await this.prisma.jabatan_tugas_ptk.findMany({
          where: { jabatan_ptk_id: { in: taskJabatanIds } },
          select: { nama: true }
        });

        const taskNames = jabatans.map(j => j.nama);

        if (taskNames.length > 0) {
          const taskMappings = await this.prisma.menuRole.findMany({
            where: { peran_nama: { in: taskNames } },
            select: { menu_id: true }
          });
          allowedMenuIds.push(...taskMappings.map(m => m.menu_id));
        }
      }

      if (allowedMenuIds.length > 0) {
        return Array.from(new Set(allowedMenuIds));
      }
    }

    return this.getMyMenus(pengguna.peran_id);
  }

  async getUpdateGtk(sekolahId: string) {
    return this.prisma.gtk.findMany({
      where: {
        sekolah_id: sekolahId,
      },
      select: {
        ptk_id: true,
        no_kk: true,
        agama_id: true,
        status_perkawinan: true,
        nama_suami_istri: true,
        pekerjaan_suami_istri: true,
        alamat_jalan: true,
        rt: true,
        rw: true,
        nama_dusun: true,
        desa_kelurahan: true,
        kode_wilayah: true,
        kode_pos: true,
        lintang: true,
        bujur: true,
        no_telepon_rumah: true,
        no_hp: true,
        nm_wp: true,
        npwp: true,
        anak: {
          select: {
            anak_id: true,
            ptk_id: true,
            status_anak_id: true,
            jenjang_pendidikan_id: true,
            nik: true,
            nisn: true,
            nama: true,
            jenis_kelamin: true,
            tempat_lahir: true,
            tanggal_lahir: true,
            tahun_masuk: true,
            soft_delete: true,
            updater_id: true,
          }
        }
      },
    });
  }

  async getUpdatePesertaDidik(sekolahId: string) {
    return this.prisma.pesertaDidik.findMany({
      where: {
        sekolah_id: sekolahId,
      },
      select: {
        peserta_didik_id: true,
        no_kk: true,
        reg_akta_lahir: true,
        agama_id: true,
        anak_keberapa: true,
        alamat_jalan: true,
        rt: true,
        rw: true,
        nama_dusun: true,
        desa_kelurahan: true,
        kode_wilayah: true,
        kode_pos: true,
        jenis_tinggal_id: true,
        alat_transportasi_id: true,
        lintang: true,
        bujur: true,
        nomor_telepon_rumah: true,
        nomor_telepon_seluler: true,
        tinggi_badan: true,
        berat_badan: true,
        lingkar_kepala: true,
        jarak_rumah_ke_sekolah: true,
        jarak_rumah_ke_sekolah_km: true,
        waktu_tempuh_ke_sekolah: true,
        menit_tempuh_ke_sekolah: true,
        jumlah_saudara_kandung: true,
        nik_ayah: true,
        nik_ibu: true,
        nik_wali: true,
        nama_ayah: true,
        tahun_lahir_ayah: true,
        tahun_lahir_ibu: true,
        nama_wali: true,
        tahun_lahir_wali: true,
        pekerjaan_id_ayah: true,
        pekerjaan_id_ibu: true,
        pekerjaan_id_wali: true,
        jenjang_pendidikan_ayah: true,
        jenjang_pendidikan_ibu: true,
        jenjang_pendidikan_wali: true,
        penghasilan_id_ayah: true,
        penghasilan_id_ibu: true,
        penghasilan_id_wali: true,
        id_hobby: true,
        id_cita: true,
        kebutuhan_khusus_id: true,
        kebutuhan_khusus_id_ayah: true,
        kebutuhan_khusus_id_ibu: true,
      },
    });
  }

  private formatSqlValue(val: any): string {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (typeof val === 'number') return String(val);
    if (val instanceof Date) return `'${val.toISOString()}'`;
    if (typeof val === 'object') {
      if (val.toFixed) return String(val); // Decimal
      return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
    }
    return `'${String(val).replace(/'/g, "''")}'`;
  }

  async generateBackupSql(sekolahId: string): Promise<string> {
    if (!sekolahId) throw new Error('Sekolah ID is required for backup.');

    const tables = await this.prisma.$queryRawUnsafe(`
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema IN ('dapodik', 'simak', 'mandala')
    `) as any[];

    const tablesWithSekolahId: { schema: string; name: string }[] = [];
    for (const t of tables) {
      const cols = await this.prisma.$queryRawUnsafe(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = $1 AND table_name = $2 AND column_name = 'sekolah_id'
      `, t.table_schema, t.table_name) as any[];
      if (cols.length > 0) {
        tablesWithSekolahId.push({ schema: t.table_schema, name: t.table_name });
      }
    }

    let sqlLines: string[] = [];
    sqlLines.push('-- ===================================================');
    sqlLines.push('-- SIMAK POSTGRESQL SCHEMA DUMP');
    sqlLines.push('-- SCHOOL ID: ' + sekolahId);
    sqlLines.push('-- EXPORT DATE: ' + new Date().toISOString());
    sqlLines.push('-- ===================================================\n');

    sqlLines.push("SET session_replication_role = 'replica';\n");

    for (const t of tablesWithSekolahId) {
      const fullTableName = '"' + t.schema + '"."' + t.name + '"';
      
      const columnInfo = await this.prisma.$queryRawUnsafe(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = $1 AND table_name = $2
      `, t.schema, t.name) as any[];
      const cols = columnInfo.map(c => c.column_name);

      if (cols.length === 0) continue;

      const rows = await this.prisma.$queryRawUnsafe(
        'SELECT * FROM ' + fullTableName + ' WHERE "sekolah_id" = $1',
        sekolahId
      ) as any[];

      if (rows.length > 0) {
        sqlLines.push('-- Data for table ' + fullTableName + ' (' + rows.length + ' rows)');
        sqlLines.push('TRUNCATE TABLE ' + fullTableName + ' CASCADE;');
        
        for (const row of rows) {
          const colNames = cols.map(c => '"' + c + '"').join(', ');
          const values = cols.map(c => this.formatSqlValue(row[c])).join(', ');
          sqlLines.push('INSERT INTO ' + fullTableName + ' (' + colNames + ') VALUES (' + values + ');');
        }
        sqlLines.push('');
      }
    }

    sqlLines.push("SET session_replication_role = 'origin';");

    return sqlLines.join('\n');
  }

  async getTugasTambahan(
    sekolahId: string | null,
    index?: number,
    search?: string,
    limit: number = 10,
    page: number = 1
  ) {
    const filter = this.getSekolahFilter(sekolahId);
    const skip = (page - 1) * limit;
    
    let whereClause: any = {
      AND: [{ sekolah_id: filter.sekolah_id }],
    };

    if (index !== undefined && !isNaN(index)) {
      whereClause.AND.push({ index });
    }

    if (search) {
      whereClause.AND.push({
        OR: [
          { nomor_sk: { contains: search, mode: 'insensitive' } },
          { jabatan: { contains: search, mode: 'insensitive' } },
          {
            gtk: {
              nama: { contains: search, mode: 'insensitive' },
            },
          },
          {
            peserta_didik: {
              nama: { contains: search, mode: 'insensitive' },
            },
          },
        ],
      });
    }

    const [total, tasks, refJabatan] = await Promise.all([
      this.prisma.tugasTambahan.count({ where: whereClause }),
      this.prisma.tugasTambahan.findMany({
        where: whereClause,
        include: {
          gtk: {
            select: {
              nama: true,
              nuptk: true,
              nip: true,
            },
          },
          peserta_didik: {
            select: {
              nama: true,
              nisn: true,
            },
          },
        },
        take: limit,
        skip: skip,
        orderBy: { create_date: 'desc' },
      }),
      this.prisma.jabatan_tugas_ptk.findMany({
        select: {
          jabatan_ptk_id: true,
          nama: true,
          jumlah_jam_diakui: true,
        },
      }),
    ]);

    const formattedData = tasks.map((t: any) => {
      let roleName = '';
      let displayJam = t.jumlah_jam !== null && t.jumlah_jam !== undefined ? Number(t.jumlah_jam) : 0;
      if (t.jabatan_ptk_id !== null && t.jabatan_ptk_id !== undefined) {
        const jId = Number(t.jabatan_ptk_id);
        const match = refJabatan.find(rj => Number(rj.jabatan_ptk_id) === jId);
        roleName = match ? match.nama : `Jabatan ID ${jId}`;
        if (displayJam === 0 && match && match.jumlah_jam_diakui !== null && match.jumlah_jam_diakui !== undefined) {
          displayJam = Number(match.jumlah_jam_diakui);
        }
      } else {
        roleName = t.jabatan || '';
      }

      const entityName = t.index === 1 ? t.peserta_didik?.nama || '' : t.gtk?.nama || '';
      const entityIdCode = t.index === 1 
        ? (t.peserta_didik?.nisn ? `NISN: ${t.peserta_didik.nisn}` : '-')
        : (t.gtk?.nip ? `NIP: ${t.gtk.nip}` : (t.gtk?.nuptk ? `NUPTK: ${t.gtk.nuptk}` : '-'));

      return {
        ...t,
        role_name: roleName,
        jumlah_jam: displayJam,
        nama: entityName,
        nip_nisn: entityIdCode,
      };
    });

    return {
      data: formattedData,
      total,
      limit,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async createTugasTambahan(sekolahId: string | null, data: any) {
    const filter = this.getSekolahFilter(sekolahId);
    const payload: any = {
      sekolah_id: filter.sekolah_id,
      index: Number(data.index) || 0,
      ptk_id: data.index === 0 ? data.ptk_id : null,
      peserta_didik_id: data.index === 1 ? data.peserta_didik_id : null,
      jabatan_ptk_id: data.jabatan_ptk_id !== undefined && data.jabatan_ptk_id !== null ? new Prisma.Decimal(data.jabatan_ptk_id) : null,
      jabatan: data.jabatan || null,
      jumlah_jam: data.jumlah_jam !== undefined && data.jumlah_jam !== null ? new Prisma.Decimal(data.jumlah_jam) : null,
      nomor_sk: data.nomor_sk || null,
      tmt_tambahan: data.tmt_tambahan ? new Date(data.tmt_tambahan) : null,
      tst_tambahan: data.tst_tambahan ? new Date(data.tst_tambahan) : null,
      soft_delete: new Prisma.Decimal(0),
    };

    const created = await this.prisma.tugasTambahan.create({
      data: payload,
    });

    if (payload.jabatan && payload.jumlah_jam && payload.jabatan_ptk_id === null) {
      await this.prisma.tugasTambahan.updateMany({
        where: {
          sekolah_id: filter.sekolah_id,
          jabatan: payload.jabatan,
          jabatan_ptk_id: null,
          ptk_tugas_tambahan_id: { not: created.ptk_tugas_tambahan_id }
        },
        data: {
          jumlah_jam: payload.jumlah_jam
        }
      });
    }

    return created;
  }

  async updateTugasTambahan(id: string, data: any) {
    const payload: any = {
      index: Number(data.index) !== undefined ? Number(data.index) : undefined,
      ptk_id: data.index === 0 ? data.ptk_id : (data.index === 1 ? null : undefined),
      peserta_didik_id: data.index === 1 ? data.peserta_didik_id : (data.index === 0 ? null : undefined),
      jabatan_ptk_id: data.jabatan_ptk_id !== undefined ? (data.jabatan_ptk_id !== null ? new Prisma.Decimal(data.jabatan_ptk_id) : null) : undefined,
      jabatan: data.jabatan !== undefined ? (data.jabatan || null) : undefined,
      jumlah_jam: data.jumlah_jam !== undefined ? (data.jumlah_jam !== null ? new Prisma.Decimal(data.jumlah_jam) : null) : undefined,
      nomor_sk: data.nomor_sk !== undefined ? (data.nomor_sk || null) : undefined,
      tmt_tambahan: data.tmt_tambahan !== undefined ? (data.tmt_tambahan ? new Date(data.tmt_tambahan) : null) : undefined,
      tst_tambahan: data.tst_tambahan !== undefined ? (data.tst_tambahan ? new Date(data.tst_tambahan) : null) : undefined,
      soft_delete: data.soft_delete !== undefined ? new Prisma.Decimal(data.soft_delete) : undefined,
    };

    const currentTask = await this.prisma.tugasTambahan.findUnique({
      where: { ptk_tugas_tambahan_id: id },
      select: { sekolah_id: true, jabatan: true, jabatan_ptk_id: true }
    });

    const updatedTask = await this.prisma.tugasTambahan.update({
      where: { ptk_tugas_tambahan_id: id },
      data: payload,
    });

    const targetJabatan = payload.jabatan !== undefined ? payload.jabatan : (currentTask ? currentTask.jabatan : null);
    const newJam = payload.jumlah_jam;
    const isCustom = currentTask ? currentTask.jabatan_ptk_id === null : true;

    if (isCustom && targetJabatan && newJam !== undefined) {
      await this.prisma.tugasTambahan.updateMany({
        where: {
          sekolah_id: currentTask?.sekolah_id,
          jabatan: targetJabatan,
          jabatan_ptk_id: null,
          ptk_tugas_tambahan_id: { not: id }
        },
        data: {
          jumlah_jam: newJam
        }
      });
    }

    return updatedTask;
  }

  async deleteTugasTambahan(id: string) {
    const task = await this.prisma.tugasTambahan.findUnique({
      where: { ptk_tugas_tambahan_id: id },
      select: { last_sync: true }
    });

    if (!task) {
      throw new BadRequestException('Tugas tambahan tidak ditemukan.');
    }

    if (task.last_sync !== null) {
      throw new BadRequestException('Tugas tambahan dari Dapodik tidak dapat dihapus.');
    }

    return this.prisma.tugasTambahan.delete({
      where: { ptk_tugas_tambahan_id: id },
    });
  }

  async getUniqueCustomJabatans(sekolahId: string | null, index?: number) {
    const filter = this.getSekolahFilter(sekolahId);
    let whereClause: any = {
      sekolah_id: filter.sekolah_id,
      jabatan: { not: null, notIn: [''] },
      jabatan_ptk_id: null,
    };
    if (index !== undefined && !isNaN(index)) {
      whereClause.index = index;
    }
    const result = await this.prisma.tugasTambahan.findMany({
      where: whereClause,
      select: {
        jabatan: true,
      },
      distinct: ['jabatan'],
      orderBy: { jabatan: 'asc' },
    });
    return result.map(r => r.jabatan!);
  }

  async getUniqueCustomJumlahJam(sekolahId: string | null, index?: number) {
    const filter = this.getSekolahFilter(sekolahId);
    let whereClause: any = {
      sekolah_id: filter.sekolah_id,
      jumlah_jam: { not: null },
      jabatan_ptk_id: null,
    };
    if (index !== undefined && !isNaN(index)) {
      whereClause.index = index;
    }
    const result = await this.prisma.tugasTambahan.findMany({
      where: whereClause,
      select: {
        jumlah_jam: true,
      },
      distinct: ['jumlah_jam'],
      orderBy: { jumlah_jam: 'asc' },
    });
    return result.map(r => Number(r.jumlah_jam!));
  }
}
