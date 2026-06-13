import { Injectable, OnModuleInit, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
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
          bentuk_pendidikan_is_str: school.bentuk_pendidikan_id_str,
          bentuk_pendidikan_id_str: school.bentuk_pendidikan_id_str,
          kabupate_kota: school.kabupaten_kota,
          kabupaten_kota: school.kabupaten_kota,
          kecamatan: school.kecamatan,
          lintang: school.lintang,
          bujur: school.bujur,
          desa_kelurahan: school.desa_kelurahan,
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

  async getPesertaDidikForMandala(
    sekolahId: string | undefined,
    query: {
      limit: number;
      page: number;
      search?: string;
      status?: 'aktif' | 'non-aktif';
    }
  ) {
    const { limit, page, search, status } = query;

    const whereClause: any = {};
    if (sekolahId) {
      whereClause.sekolah_id = sekolahId;
    }

    if (search) {
      whereClause.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nisn: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'aktif') {
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
        },
        orderBy: { nama: 'asc' },
      }),
    ]);

    const formattedData = students.map((pd) => {
      // Construct alamat lengkap
      const addressParts = [
        pd.alamat_jalan,
        pd.rt ? `RT ${pd.rt}` : null,
        pd.rw ? `RW ${pd.rw}` : null,
        pd.dusun ? `Dusun ${pd.dusun}` : null,
        pd.desa_kelurahan ? `Desa/Kel. ${pd.desa_kelurahan}` : null,
        pd.kecamatan ? `Kec. ${pd.kecamatan}` : null,
        pd.kabupaten_kota,
        pd.provinsi,
        pd.kode_pos
      ].filter(Boolean);
      const alamatLengkap = addressParts.length > 0 ? addressParts.join(', ') : '';

      // Select HP Orang Tua (priority: no_wa_ayah -> no_wa_ibu -> no_wa -> nomor_telepon_seluler)
      const hpOrangTua = pd.no_wa_ayah || pd.no_wa_ibu || pd.no_wa || pd.nomor_telepon_seluler || '';

      return {
        identitas: {
          id: pd.peserta_didik_id,
          sekolah_id: pd.sekolah_id,
          nama: pd.nama,
          nisn: pd.nisn,
          nik: pd.nik,
          jenis_kelamin: pd.jenis_kelamin,
          tempat_lahir: pd.tempat_lahir,
          tanggal_lahir: pd.tanggal_lahir,
          agama: pd.agama_id_str || pd.agama_id || '',
        },
        akademik: {
          nama_rombel: pd.nama_rombel || pd.rombongan_belajar?.nama || '',
          tingkat: pd.rombongan_belajar?.tingkat_pendidikan_id_str || pd.rombongan_belajar?.tingkat_pendidikan_id || pd.tingkat_pendidikan_id || '',
          jurusan: pd.rombongan_belajar?.jurusan_id_str || pd.rombongan_belajar?.jurusan_id || pd.jurusan_sp_id || '',
        },
        data_pendukung: {
          alamat_lengkap: alamatLengkap,
          nama_ayah: pd.nama_ayah || '',
          nama_ibu: pd.nama_ibu_kandung || pd.nama_ibu || '',
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

  async getGtkForMandala(
    sekolahId: string | undefined,
    query: {
      limit: number;
      page: number;
      search?: string;
      status?: 'aktif' | 'non-aktif';
      type?: 'guru' | 'tendik';
    }
  ) {
    const { limit, page, search, status, type } = query;

    const whereClause: any = {};
    if (sekolahId) {
      whereClause.sekolah_id = sekolahId;
    }

    if (search) {
      whereClause.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nuptk: { contains: search, mode: 'insensitive' } },
        { nip: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (type === 'guru') {
      whereClause.jenis_ptk_id_str = { contains: 'Guru', mode: 'insensitive' };
    } else if (type === 'tendik') {
      whereClause.NOT = {
        jenis_ptk_id_str: { contains: 'Guru', mode: 'insensitive' },
      };
    }

    if (status === 'aktif') {
      whereClause.status = 'Aktif';
    } else if (status === 'non-aktif') {
      whereClause.status = { not: 'Aktif' };
    }

    const skip = (page - 1) * limit;

    const [total, gtks] = await Promise.all([
      this.prisma.gtk.count({ where: whereClause }),
      this.prisma.gtk.findMany({
        where: whereClause,
        take: limit,
        skip: skip,
        orderBy: { nama: 'asc' },
      }),
    ]);

    const formattedData = gtks.map((g) => {
      // Construct alamat lengkap
      const addressParts = [
        g.alamat_jalan,
        g.rt ? `RT ${g.rt}` : null,
        g.rw ? `RW ${g.rw}` : null,
        g.dusun ? `Dusun ${g.dusun}` : null,
        g.desa_kelurahan ? `Desa/Kel. ${g.desa_kelurahan}` : null,
        g.kecamatan ? `Kec. ${g.kecamatan}` : null,
        g.kabupaten_kota,
        g.provinsi,
        g.kode_pos
      ].filter(Boolean);
      const alamatLengkap = addressParts.length > 0 ? addressParts.join(', ') : '';

      return {
        identitas: {
          id: g.ptk_id,
          sekolah_id: g.sekolah_id,
          nama: g.nama,
          nip: g.nip || '',
          nik: g.nik || '',
          nuptk: g.nuptk || '',
          jenis_kelamin: g.jenis_kelamin || '',
          tempat_lahir: g.tempat_lahir || '',
          tanggal_lahir: g.tanggal_lahir || null,
          agama: g.agama_id_str || g.agama_id || '',
        },
        kepegawaian: {
          jenis_ptk: g.jenis_ptk_id_str || '',
          jabatan: g.jabatan_ptk_id_str || '',
          status_kepegawaian: g.status_kepegawaian_id_str || '',
          status: g.status,
        },
        data_pendukung: {
          alamat_lengkap: alamatLengkap,
          no_hp: g.no_hp || '',
          no_wa: g.no_wa || '',
          email: g.email || '',
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

  async getGtkRekapForMandala(sekolahId: string | undefined) {
    if (!sekolahId) {
      throw new BadRequestException('sekolah_id query parameter is required for GTK recap.');
    }

    const school = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: sekolahId },
    });
    if (!school) {
      throw new NotFoundException(`School with ID ${sekolahId} not found.`);
    }

    const gtks = await this.prisma.gtk.findMany({
      where: {
        sekolah_id: sekolahId,
        status: 'Aktif',
      },
      select: {
        jenis_ptk_id_str: true,
        jenis_kelamin: true,
        status_kepegawaian_id_str: true,
        tanggal_lahir: true,
        pendidikan_terakhir: true,
      },
    });

    const isGuru = (j: string) => (j || '').toLowerCase().includes('guru');
    const isAsn = (s: string) => ['pns', 'pppk'].includes((s || '').toLowerCase());

    // 1. Rekap Kategori
    const guru = gtks.filter(i => isGuru(i.jenis_ptk_id_str));
    const tendik = gtks.filter(i => !isGuru(i.jenis_ptk_id_str));

    const rekapKategori = [
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

    // 2. Rekap Pendidikan
    const categories = [
      { label: "S2/Pasca Sarjana", keys: ["S2"] },
      { label: "S1/Sarjana", keys: ["S1", null, ""] },
      { label: "D3/Diploma", keys: ["D3"] },
      { label: "SMA/Sederajat", keys: ["SMA", "SMK"] },
    ];

    const rekapPendidikan = categories.map((cat, idx) => {
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

    // 3. Rekap Usia
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

    const rekapUsia = ranges.map((range, idx) => {
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

    return {
      status: 'success',
      data: {
        rekap_kategori: rekapKategori,
        rekap_pendidikan: rekapPendidikan,
        rekap_usia: rekapUsia,
      }
    };
  }
}
