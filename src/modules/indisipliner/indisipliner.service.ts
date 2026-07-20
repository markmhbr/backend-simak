import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateJenisPelanggaranDto } from './dto/create-jenis-pelanggaran.dto';
import { CreateJenisTindakLanjutDto } from './dto/create-jenis-tindak-lanjut.dto';
import { CreatePelanggaranDto } from './dto/create-pelanggaran.dto';
import { CreateTindakLanjutDto } from './dto/create-tindak-lanjut.dto';

@Injectable()
export class IndisiplinerService {
  constructor(private readonly prisma: PrismaService) {}

  // =====================
  // MASTER JENIS PELANGGARAN
  // =====================

  async getJenisPelanggaran(sekolahId: string) {
    return this.prisma.jenisPelanggaran.findMany({
      where: { sekolah_id: sekolahId },
      orderBy: { nama: 'asc' },
    });
  }

  async createJenisPelanggaran(dto: CreateJenisPelanggaranDto) {
    return this.prisma.jenisPelanggaran.create({
      data: {
        sekolah_id: dto.sekolah_id,
        nama: dto.nama,
        target: dto.target,
        poin: dto.poin,
        aktif: dto.aktif ?? true,
      },
    });
  }

  // =====================
  // MASTER JENIS TINDAK LANJUT
  // =====================

  async getJenisTindakLanjut(sekolahId: string) {
    return this.prisma.jenisTindakLanjut.findMany({
      where: { sekolah_id: sekolahId },
      orderBy: { nama: 'asc' },
    });
  }

  async createJenisTindakLanjut(dto: CreateJenisTindakLanjutDto) {
    return this.prisma.jenisTindakLanjut.create({
      data: {
        sekolah_id: dto.sekolah_id,
        nama: dto.nama,
        target: dto.target,
        aktif: dto.aktif ?? true,
      },
    });
  }

  // =====================
  // TRANSAKSI PELANGGARAN
  // =====================

  async getPelanggaran(sekolahId: string, filter?: { peserta_didik_id?: string; ptk_id?: string; status?: number }) {
    const whereClause: any = { 
      sekolah_id: sekolahId,
      OR: [
        {
          peserta_didik_id: { not: null },
          peserta_didik: { status: 'Aktif' }
        },
        {
          ptk_id: { not: null },
          gtk: { status: 'Aktif' }
        }
      ]
    };

    if (filter) {
      if (filter.peserta_didik_id) {
        whereClause.peserta_didik_id = filter.peserta_didik_id;
        delete whereClause.OR;
        whereClause.peserta_didik = { status: 'Aktif' };
      } else if (filter.ptk_id) {
        whereClause.ptk_id = filter.ptk_id;
        delete whereClause.OR;
        whereClause.gtk = { status: 'Aktif' };
      }
      if (filter.status) {
        whereClause.status = Number(filter.status);
      }
    }

    const data = await this.prisma.pelanggaran.findMany({
      where: whereClause,
      include: {
        jenis_pelanggaran: true,
        peserta_didik: {
          select: {
            peserta_didik_id: true,
            nama: true,
            nisn: true,
            foto: true,
            rombongan_belajar: {
              select: {
                nama: true
              }
            },
          },
        },
        gtk: {
          select: {
            ptk_id: true,
            nama: true,
            nuptk: true,
            foto: true,
            jenis_ptk: {
              select: { jenis_ptk: true }
            },
          },
        },
        pelapor: {
          select: {
            ptk_id: true,
            nama: true,
          },
        },
        tindak_lanjut: {
          include: {
            jenis_tindak_lanjut: true,
            petugas: {
              select: {
                ptk_id: true,
                nama: true,
              },
            },
          },
        },
      },
      orderBy: { waktu: 'desc' },
    });

    return data.map((item: any) => {
      if (item.gtk) {
        const { jenis_ptk, ...gtkRest } = item.gtk;
        return {
          ...item,
          gtk: {
            ...gtkRest,
            jenis_ptk_id_str: jenis_ptk?.jenis_ptk || null
          }
        };
      }
      return item;
    });
  }

  async createPelanggaran(dto: CreatePelanggaranDto) {
    // 1. Validasi keberadaan Master JenisPelanggaran
    const jp = await this.prisma.jenisPelanggaran.findUnique({
      where: { jenis_pelanggaran_id: dto.jenis_pelanggaran_id },
    });

    if (!jp) {
      throw new NotFoundException('Jenis pelanggaran tidak ditemukan.');
    }

    // 2. Validasi target pelaku pelanggaran
    // target: 0 = GTK, 1 = Peserta Didik, 2 = Keduanya
    if (jp.target === 0) {
      if (!dto.ptk_id) {
        throw new BadRequestException('Pelanggaran khusus GTK wajib menyertakan ptk_id.');
      }
      if (dto.peserta_didik_id) {
        throw new BadRequestException('Pelanggaran khusus GTK tidak boleh menyertakan peserta_didik_id.');
      }
    } else if (jp.target === 1) {
      if (!dto.peserta_didik_id) {
        throw new BadRequestException('Pelanggaran khusus Peserta Didik wajib menyertakan peserta_didik_id.');
      }
      if (dto.ptk_id) {
        throw new BadRequestException('Pelanggaran khusus Peserta Didik tidak boleh menyertakan ptk_id.');
      }
    } else if (jp.target === 2) {
      if (!dto.peserta_didik_id && !dto.ptk_id) {
        throw new BadRequestException('Pelanggaran dengan target Keduanya wajib menyertakan ptk_id atau peserta_didik_id.');
      }
      if (dto.peserta_didik_id && dto.ptk_id) {
        throw new BadRequestException('Satu entitas pelanggaran hanya boleh mencatat satu pelaku saja (GTK atau Peserta Didik).');
      }
    }

    // 3. Simpan data pelanggaran, poin otomatis diambil dari master saat dibuat
    return this.prisma.pelanggaran.create({
      data: {
        sekolah_id: dto.sekolah_id,
        peserta_didik_id: dto.peserta_didik_id || null,
        ptk_id: dto.ptk_id || null,
        jenis_pelanggaran_id: dto.jenis_pelanggaran_id,
        tanggal: new Date(dto.tanggal),
        waktu: new Date(dto.waktu),
        keterangan: dto.keterangan || null,
        poin: jp.poin,
        status: dto.status ?? 1, // 1 = Draft
        pelapor_ptk_id: dto.pelapor_ptk_id || null,
      },
    });
  }

  async updatePelanggaranStatus(id: string, status: number) {
    const check = await this.prisma.pelanggaran.findUnique({
      where: { pelanggaran_id: id },
    });

    if (!check) {
      throw new NotFoundException('Pelanggaran tidak ditemukan.');
    }

    return this.prisma.pelanggaran.update({
      where: { pelanggaran_id: id },
      data: { status: Number(status) },
    });
  }

  // =====================
  // TRANSAKSI TINDAK LANJUT
  // =====================

  async createTindakLanjut(dto: CreateTindakLanjutDto) {
    // 1. Ambil data Pelanggaran
    const pelanggaran = await this.prisma.pelanggaran.findUnique({
      where: { pelanggaran_id: dto.pelanggaran_id },
    });

    if (!pelanggaran) {
      throw new NotFoundException('Pelanggaran tidak ditemukan.');
    }

    // 2. Ambil Jenis Tindak Lanjut
    const jtl = await this.prisma.jenisTindakLanjut.findUnique({
      where: { jenis_tindak_lanjut_id: dto.jenis_tindak_lanjut_id },
    });

    if (!jtl) {
      throw new NotFoundException('Jenis tindak lanjut tidak ditemukan.');
    }

    // 3. Validasi Target Tindak Lanjut harus cocok dengan pelaku
    // target: 0 = GTK, 1 = Peserta Didik, 2 = Keduanya
    const isGtkOffender = !!pelanggaran.ptk_id;
    const isStudentOffender = !!pelanggaran.peserta_didik_id;

    if (isGtkOffender && jtl.target === 1) {
      throw new BadRequestException('Tindak lanjut untuk Peserta Didik tidak bisa diberikan kepada GTK.');
    }
    if (isStudentOffender && jtl.target === 0) {
      throw new BadRequestException('Tindak lanjut untuk GTK tidak bisa diberikan kepada Peserta Didik.');
    }

    // 4. Buat record tindak lanjut
    return this.prisma.tindakLanjut.create({
      data: {
        pelanggaran_id: dto.pelanggaran_id,
        jenis_tindak_lanjut_id: dto.jenis_tindak_lanjut_id,
        tanggal: new Date(dto.tanggal),
        keterangan: dto.keterangan || null,
        petugas_ptk_id: dto.petugas_ptk_id || null,
      },
    });
  }

  // =====================
  // REKAP & SUMMARY SEKOLAH
  // =====================

  async getSchoolSummary(sekolahId: string) {
    const [totalPelanggaran, totalPelanggaranGtk, totalPelanggaranSiswa, jpList, jtlList] = await Promise.all([
      this.prisma.pelanggaran.count({
        where: {
          sekolah_id: sekolahId,
          OR: [
            { peserta_didik_id: { not: null }, peserta_didik: { status: 'Aktif' } },
            { ptk_id: { not: null }, gtk: { status: 'Aktif' } }
          ]
        }
      }),
      this.prisma.pelanggaran.count({
        where: {
          sekolah_id: sekolahId,
          ptk_id: { not: null },
          gtk: { status: 'Aktif' }
        }
      }),
      this.prisma.pelanggaran.count({
        where: {
          sekolah_id: sekolahId,
          peserta_didik_id: { not: null },
          peserta_didik: { status: 'Aktif' }
        }
      }),
      this.prisma.jenisPelanggaran.count({ where: { sekolah_id: sekolahId } }),
      this.prisma.jenisTindakLanjut.count({ where: { sekolah_id: sekolahId } }),
    ]);

    // Top Pelanggar (Siswa dengan akumulasi poin tertinggi)
    const topSiswaPoints = await this.prisma.pelanggaran.groupBy({
      by: ['peserta_didik_id'],
      where: {
        sekolah_id: sekolahId,
        peserta_didik_id: { not: null },
        peserta_didik: { status: 'Aktif' },
        status: { in: [1, 2, 3] }, // Draft, Diproses, Selesai
      },
      _sum: { poin: true },
      _count: { pelanggaran_id: true },
      orderBy: { _sum: { poin: 'desc' } },
      take: 5,
    });

    const richTopSiswa = await Promise.all(
      topSiswaPoints.map(async (item) => {
        const pd = await this.prisma.pesertaDidik.findUnique({
          where: { peserta_didik_id: item.peserta_didik_id! },
          select: { nama: true, nisn: true, rombongan_belajar: { select: { nama: true } }, foto: true },
        });

        return {
          peserta_didik_id: item.peserta_didik_id,
          nama: pd?.nama || 'Unknown',
          nisn: pd?.nisn || '-',
          rombongan_belajar: pd?.rombongan_belajar?.nama || '-',
          foto: pd?.foto || null,
          total_poin: item._sum.poin || 0,
          total_pelanggaran: item._count.pelanggaran_id || 0,
        };
      })
    );

    // Top Pelanggar (GTK dengan akumulasi poin tertinggi)
    const topGtkPoints = await this.prisma.pelanggaran.groupBy({
      by: ['ptk_id'],
      where: {
        sekolah_id: sekolahId,
        ptk_id: { not: null },
        gtk: { status: 'Aktif' },
        status: { in: [1, 2, 3] }, // Draft, Diproses, Selesai
      },
      _sum: { poin: true },
      _count: { pelanggaran_id: true },
      orderBy: { _sum: { poin: 'desc' } },
      take: 5,
    });

    const richTopGtk = await Promise.all(
      topGtkPoints.map(async (item) => {
        const gtk = await this.prisma.gtk.findUnique({
          where: { ptk_id: item.ptk_id! },
          select: {
            nama: true,
            nuptk: true,
            foto: true,
            jenis_ptk: {
              select: { jenis_ptk: true }
            }
          },
        });

        return {
          ptk_id: item.ptk_id,
          nama: gtk?.nama || 'Unknown',
          nuptk: gtk?.nuptk || '-',
          jabatan: gtk?.jenis_ptk?.jenis_ptk || 'Staff',
          foto: gtk?.foto || null,
          total_poin: item._sum.poin || 0,
          total_pelanggaran: item._count.pelanggaran_id || 0,
        };
      })
    );

    // Statistik Pelanggaran Terbanyak Berdasarkan Jenis
    const jpStats = await this.prisma.pelanggaran.groupBy({
      by: ['jenis_pelanggaran_id'],
      where: { sekolah_id: sekolahId },
      _count: { pelanggaran_id: true },
      orderBy: { _count: { pelanggaran_id: 'desc' } },
      take: 5,
    });

    const richJpStats = await Promise.all(
      jpStats.map(async (item) => {
        const jp = await this.prisma.jenisPelanggaran.findUnique({
          where: { jenis_pelanggaran_id: item.jenis_pelanggaran_id },
          select: { nama: true, target: true },
        });

        return {
          nama: jp?.nama || 'Unknown',
          target: jp?.target ?? 1,
          count: item._count.pelanggaran_id,
        };
      })
    );

    return {
      stats: {
        total_pelanggaran: totalPelanggaran,
        total_pelanggaran_gtk: totalPelanggaranGtk,
        total_pelanggaran_siswa: totalPelanggaranSiswa,
        master_jenis_pelanggaran: jpList,
        master_jenis_tindak_lanjut: jtlList,
      },
      top_siswa: richTopSiswa,
      top_gtk: richTopGtk,
      top_pelanggaran_jenis: richJpStats,
    };
  }
}
