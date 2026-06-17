import { Injectable, OnModuleInit, Logger, BadRequestException, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class MandalaService implements OnModuleInit {
  private readonly logger = new Logger(MandalaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
      include: {
        cadisdik: true,
      },
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
          kabupaten_kota: school.kabupaten_kota,
          kecamatan: school.kecamatan,
          lintang: school.lintang,
          bujur: school.bujur,
          desa_kelurahan: school.desa_kelurahan,
          total_siswa: totalSiswa,
          total_gtk: totalGtk,
          nomor_telepon: school.nomor_telepon,
          kode_wilayah: school.kode_wilayah,
          cadisdik: school.cadisdik ? {
            id: school.cadisdik.cadisdik_id,
            nama: school.cadisdik.nama_instansi,
          } : null,
        };
      }),
    );

    return richSchools;
  }

  // --- CADISDIK CRUD ---

  async getCadisdiks() {
    return await this.prisma.cadisdik.findMany({
      orderBy: { nama_instansi: 'asc' },
    });
  }

  async getCadisdikById(id: string) {
    const data = await this.prisma.cadisdik.findUnique({
      where: { cadisdik_id: id },
      include: {
        sekolah: {
          select: {
            sekolah_id: true,
            nama: true,
            npsn: true,
          },
        },
      },
    });
    if (!data) throw new NotFoundException(`Cadisdik with ID ${id} not found.`);
    return data;
  }

  async createCadisdik(data: any) {
    return await this.prisma.cadisdik.create({
      data: {
        nama_instansi: data.nama_instansi,
        alamat: data.alamat,
        email: data.email,
        nomor_telepon: data.nomor_telepon,
        website: data.website,
        aktif: data.aktif !== undefined ? data.aktif : true,
      },
    });
  }

  async updateCadisdik(id: string, data: any) {
    await this.getCadisdikById(id); // Ensure exists
    return await this.prisma.cadisdik.update({
      where: { cadisdik_id: id },
      data: {
        nama_instansi: data.nama_instansi,
        alamat: data.alamat,
        email: data.email,
        nomor_telepon: data.nomor_telepon,
        website: data.website,
        aktif: data.aktif,
        updated_at: new Date(),
      },
    });
  }

  async deleteCadisdik(id: string) {
    await this.getCadisdikById(id); // Ensure exists
    return await this.prisma.cadisdik.delete({
      where: { cadisdik_id: id },
    });
  }

  // --- PEGAWAI CRUD ---

  async getPegawais(cadisdikId?: string) {
    const where: any = {};
    if (cadisdikId) where.cadisdik_id = cadisdikId;

    return await this.prisma.pegawai.findMany({
      where,
      include: {
        cadisdik: {
          select: {
            nama_instansi: true,
          },
        },
      },
      orderBy: { nama_lengkap: 'asc' },
    });
  }

  async getPegawaiById(id: string) {
    const data = await this.prisma.pegawai.findUnique({
      where: { pegawai_id: id },
      include: {
        cadisdik: true,
      },
    });
    if (!data) throw new NotFoundException(`Pegawai with ID ${id} not found.`);
    return data;
  }

  async createPegawai(data: any) {
    // Check for duplicate NIP or Email
    const existing = await this.prisma.pegawai.findFirst({
      where: {
        OR: [
          { nip: data.nip },
          { email: data.email },
        ],
      },
    });

    if (existing) {
      throw new BadRequestException('Pegawai with this NIP or Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.prisma.pegawai.create({
      data: {
        cadisdik_id: data.cadisdik_id,
        nama_lengkap: data.nama_lengkap,
        nip: data.nip,
        email: data.email,
        password: hashedPassword,
        jabatan: data.jabatan,
        jenis_kelamin: data.jenis_kelamin,
        nomor_telepon: data.nomor_telepon,
        foto: data.foto,
        aktif: data.aktif !== undefined ? data.aktif : true,
      },
    });
  }

  async updatePegawai(id: string, data: any) {
    const pegawai = await this.getPegawaiById(id);

    const updateData: any = {
      nama_lengkap: data.nama_lengkap,
      nip: data.nip,
      email: data.email,
      jabatan: data.jabatan,
      jenis_kelamin: data.jenis_kelamin,
      nomor_telepon: data.nomor_telepon,
      foto: data.foto,
      aktif: data.aktif,
      cadisdik_id: data.cadisdik_id,
      updated_at: new Date(),
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return await this.prisma.pegawai.update({
      where: { pegawai_id: id },
      data: updateData,
    });
  }

  async deletePegawai(id: string) {
    await this.getPegawaiById(id);
    return await this.prisma.pegawai.delete({
      where: { pegawai_id: id },
    });
  }

  // --- MAPPING PENGAWAS CRUD ---

  async getMappingPengawas(pegawaiId?: string, sekolahId?: string) {
    const where: any = {};
    if (pegawaiId) where.pegawai_id = pegawaiId;
    if (sekolahId) where.sekolah_id = sekolahId;

    return await this.prisma.mappingPengawas.findMany({
      where,
      include: {
        pegawai: {
          select: { nama_lengkap: true, nip: true },
        },
        sekolah: {
          select: { nama: true, npsn: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async createMappingPengawas(data: any) {
    const existing = await this.prisma.mappingPengawas.findFirst({
      where: {
        pegawai_id: data.pegawai_id,
        sekolah_id: data.sekolah_id,
      },
    });

    if (existing) {
      throw new BadRequestException('Mapping for this Pegawai and Sekolah already exists.');
    }

    return await this.prisma.mappingPengawas.create({
      data: {
        pegawai_id: data.pegawai_id,
        sekolah_id: data.sekolah_id,
      },
    });
  }

  async deleteMappingPengawas(id: string) {
    const existing = await this.prisma.mappingPengawas.findUnique({ where: { mapping_pengawas_id: id } });
    if (!existing) {
      throw new NotFoundException(`MappingPengawas with ID ${id} not found.`);
    }

    return await this.prisma.mappingPengawas.delete({
      where: { mapping_pengawas_id: id },
    });
  }

  // --- PEGAWAI AUTH ---

  async loginPegawai(credentials: { identifier: string; password: any }) {
    const { identifier, password } = credentials;

    const pegawai = await this.prisma.pegawai.findFirst({
      where: {
        OR: [
          { nip: identifier },
          { email: identifier },
        ],
      },
      include: {
        cadisdik: true,
      },
    });

    if (!pegawai) {
      throw new UnauthorizedException('Kredensial tidak valid (User tidak ditemukan).');
    }

    if (!pegawai.aktif) {
      throw new ForbiddenException('Akun Anda telah dinonaktifkan.');
    }

    const isMatch = await bcrypt.compare(password, pegawai.password);
    if (!isMatch) {
      throw new UnauthorizedException('Kredensial tidak valid (Password salah).');
    }

    const payload = {
      sub: pegawai.pegawai_id,
      email: pegawai.email,
      nip: pegawai.nip,
      role: 'Mandala Pegawai',
      cadisdik_id: pegawai.cadisdik_id,
      cadisdik_nama: pegawai.cadisdik?.nama_instansi,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
    });

    return {
      status: 'success',
      data: {
        accessToken,
        refreshToken,
        pegawai: {
          id: pegawai.pegawai_id,
          nama: pegawai.nama_lengkap,
          nip: pegawai.nip,
          email: pegawai.email,
          role: 'Mandala Pegawai',
          cadisdik: pegawai.cadisdik?.nama_instansi,
        },
      },
    };
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
          jenis_pendaftaran_id_str: pd.jenis_pendaftaran_id_str || pd.jenis_pendaftaran_id || '',
        },
        akademik: {
          nama_rombel: pd.nama_rombel || pd.rombongan_belajar?.nama || '',
          tingkat: pd.rombongan_belajar?.tingkat_pendidikan_id_str || pd.rombongan_belajar?.tingkat_pendidikan_id || pd.tingkat_pendidikan_id || '',
          jurusan: pd.rombongan_belajar?.jurusan_id_str || pd.rombongan_belajar?.jurusan_id || pd.jurusan_sp_id || '',
        },
        data_pendukung: {
          alamat_lengkap: alamatLengkap,
          nama_ayah: pd.nama_ayah || '',
          nama_ibu: pd.nama_ibu || '',
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
          pendidikan_terakhir: g.pendidikan_terakhir || '',
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

  async getPesertaDidikPresenceForMandala(sekolahId: string, date: Date) {
    // Adopsi logika presensi yang ada (WIB offset UTC+7)
    const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const dateOnly = new Date(wibDate.toISOString().split('T')[0]);

    const data = await this.prisma.presensiPesertaDidik.findMany({
      where: {
        sekolah_id: sekolahId,
        tanggal: dateOnly,
      },
      include: {
        peserta_didik: {
          select: {
            nama: true,
            nisn: true,
            nipd: true,
            foto: true,
            rombongan_belajar: {
              select: {
                nama: true,
                tingkat_pendidikan_id_str: true,
              }
            }
          }
        }
      },
      orderBy: { jam_masuk: 'desc' },
    });

    return data.map(item => ({
      ...item,
      status_masuk_str: this.mapStatusMasuk(item.status_masuk),
      status_pulang_str: this.mapStatusPulang(item.status_pulang),
    }));
  }

  async getGtkPresenceForMandala(sekolahId: string, date: Date) {
    // Adopsi logika presensi yang ada (WIB offset UTC+7)
    const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const dateOnly = new Date(wibDate.toISOString().split('T')[0]);

    const data = await this.prisma.presensiGtk.findMany({
      where: {
        sekolah_id: sekolahId,
        tanggal: dateOnly,
      },
      include: {
        gtk: {
          select: {
            nama: true,
            nuptk: true,
            nip: true,
            foto: true,
            jenis_ptk_id_str: true,
          }
        }
      },
      orderBy: { jam_masuk: 'desc' },
    });

    return data.map(item => ({
      ...item,
      status_masuk_str: this.mapStatusMasuk(item.status_masuk),
      status_pulang_str: this.mapStatusPulang(item.status_pulang),
    }));
  }

  private mapStatusMasuk(status: number | null): string {
    switch (status) {
      case 1: return 'Hadir';
      case 2: return 'Terlambat';
      case 3: return 'Izin';
      case 4: return 'Sakit';
      case 5: return 'Alpha';
      default: return '-';
    }
  }

  private mapStatusPulang(status: number | null): string {
    switch (status) {
      case 1: return 'Normal';
      case 2: return 'Pulang Awal';
      case 3: return 'Izin Pulang';
      default: return '-';
    }
  }

  async getPesertaDidikAnnualSummaryForMandala(sekolahId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const presensi = await this.prisma.presensiPesertaDidik.findMany({
      where: {
        sekolah_id: sekolahId,
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        tanggal: true,
        status_masuk: true,
      },
    });

    return this.calculateMonthlySummary(presensi);
  }

  async getGtkAnnualSummaryForMandala(sekolahId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const presensi = await this.prisma.presensiGtk.findMany({
      where: {
        sekolah_id: sekolahId,
        tanggal: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        tanggal: true,
        status_masuk: true,
      },
    });

    return this.calculateMonthlySummary(presensi);
  }

  private calculateMonthlySummary(presensi: any[]) {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const summary = months.map((month, index) => ({
      bulan: month,
      index: index + 1,
      hadir: 0,
      sakit: 0,
      izin: 0,
      alpha: 0,
    }));

    presensi.forEach(item => {
      const monthIndex = new Date(item.tanggal).getMonth();
      const status = item.status_masuk;

      if (status === 1 || status === 2) {
        summary[monthIndex].hadir++;
      } else if (status === 3) {
        summary[monthIndex].izin++;
      } else if (status === 4) {
        summary[monthIndex].sakit++;
      } else if (status === 5) {
        summary[monthIndex].alpha++;
      }
    });

    return summary;
  }
}
