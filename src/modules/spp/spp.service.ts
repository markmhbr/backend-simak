import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreatePengaturanTagihanDto } from './dto/create-pengaturan-tagihan.dto';
import { UpdatePengaturanTagihanDto } from './dto/update-pengaturan-tagihan.dto';
import { CreatePengaturanTagihanRombelDto } from './dto/create-pengaturan-tagihan-rombel.dto';
import { CreateTransaksiSppDto } from './dto/create-transaksi-spp.dto';

@Injectable()
export class SppService {
  constructor(private readonly prisma: PrismaService) {}

  // ===================================
  // 1. MASTER PENGATURAN TAGIHAN
  // ===================================

  async createPengaturanTagihan(dto: CreatePengaturanTagihanDto) {
    // Validasi sekolah_id
    const sekolah = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: dto.sekolah_id },
    });
    if (!sekolah) {
      throw new NotFoundException('Sekolah tidak ditemukan.');
    }

    return this.prisma.pengaturanTagihan.create({
      data: {
        sekolah_id: dto.sekolah_id,
        nama_tagihan: dto.nama_tagihan,
        nominal: BigInt(dto.nominal),
        tipe: dto.tipe,
        aktif: dto.aktif ?? true,
      },
    });
  }

  async getPengaturanTagihan(sekolahId: string) {
    return this.prisma.pengaturanTagihan.findMany({
      where: { sekolah_id: sekolahId },
      include: {
        pengaturan_rombel: {
          include: {
            rombongan_belajar: {
              select: {
                rombongan_belajar_id: true,
                nama: true,
                tingkat_pendidikan_id_str: true,
                semester_id: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updatePengaturanTagihan(id: string, dto: UpdatePengaturanTagihanDto) {
    const existing = await this.prisma.pengaturanTagihan.findUnique({
      where: { pengaturan_tagihan_id: id },
    });
    if (!existing) {
      throw new NotFoundException('Pengaturan tagihan tidak ditemukan.');
    }

    return this.prisma.pengaturanTagihan.update({
      where: { pengaturan_tagihan_id: id },
      data: {
        ...(dto.nama_tagihan !== undefined && { nama_tagihan: dto.nama_tagihan }),
        ...(dto.nominal !== undefined && { nominal: BigInt(dto.nominal) }),
        ...(dto.tipe !== undefined && { tipe: dto.tipe }),
        ...(dto.aktif !== undefined && { aktif: dto.aktif }),
      },
    });
  }

  async deletePengaturanTagihan(id: string) {
    const existing = await this.prisma.pengaturanTagihan.findUnique({
      where: { pengaturan_tagihan_id: id },
      include: { spp: { take: 1 } },
    });
    if (!existing) {
      throw new NotFoundException('Pengaturan tagihan tidak ditemukan.');
    }
    if (existing.spp.length > 0) {
      throw new BadRequestException('Tidak bisa menghapus pengaturan tagihan yang sudah memiliki tagihan siswa. Nonaktifkan saja.');
    }

    // Delete related rombel links first
    await this.prisma.pengaturanTagihanRombel.deleteMany({
      where: { pengaturan_tagihan_id: id },
    });

    return this.prisma.pengaturanTagihan.delete({
      where: { pengaturan_tagihan_id: id },
    });
  }

  async createPengaturanTagihanRombel(dto: CreatePengaturanTagihanRombelDto) {
    // 1. Validasi PengaturanTagihan
    const tagihan = await this.prisma.pengaturanTagihan.findUnique({
      where: { pengaturan_tagihan_id: dto.pengaturan_tagihan_id },
    });
    if (!tagihan) {
      throw new NotFoundException('Pengaturan tagihan tidak ditemukan.');
    }

    // 2. Validasi RombonganBelajar
    const rombel = await this.prisma.rombonganBelajar.findUnique({
      where: { rombongan_belajar_id: dto.rombongan_belajar_id },
    });
    if (!rombel) {
      throw new NotFoundException('Rombongan belajar tidak ditemukan.');
    }

    // 3. Validasi Kombinasi Unik
    const existingRelation = await this.prisma.pengaturanTagihanRombel.findUnique({
      where: {
        pengaturan_tagihan_id_rombongan_belajar_id: {
          pengaturan_tagihan_id: dto.pengaturan_tagihan_id,
          rombongan_belajar_id: dto.rombongan_belajar_id,
        },
      },
    });

    if (existingRelation) {
      throw new BadRequestException(
        'Rombongan belajar sudah terhubung dengan pengaturan tagihan ini.'
      );
    }

    return this.prisma.pengaturanTagihanRombel.create({
      data: {
        pengaturan_tagihan_id: dto.pengaturan_tagihan_id,
        rombongan_belajar_id: dto.rombongan_belajar_id,
      },
      include: {
        rombongan_belajar: {
          select: {
            nama: true,
          },
        },
      },
    });
  }

  async deletePengaturanTagihanRombel(id: string) {
    const check = await this.prisma.pengaturanTagihanRombel.findUnique({
      where: { pengaturan_tagihan_rombel_id: id },
    });

    if (!check) {
      throw new NotFoundException('Relasi pengaturan tagihan rombel tidak ditemukan.');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Delete the relation
      const deletedRelation = await tx.pengaturanTagihanRombel.delete({
        where: { pengaturan_tagihan_rombel_id: id },
      });

      // 2. Find all students in the unlinked class
      const siswaList = await tx.pesertaDidik.findMany({
        where: {
          rombongan_belajar_id: check.rombongan_belajar_id,
        },
        select: {
          peserta_didik_id: true,
        },
      });

      const siswaIds = siswaList.map((s) => s.peserta_didik_id);

      if (siswaIds.length > 0) {
        // 3. Delete generated unpaid SPP bills (where nominal_terbayar = 0 and status = 1 and no transaction history)
        await tx.spp.deleteMany({
          where: {
            pengaturan_tagihan_id: check.pengaturan_tagihan_id,
            peserta_didik_id: { in: siswaIds },
            nominal_terbayar: 0,
            riwayat_transaksi: { none: {} },
          },
        });
      }

      return deletedRelation;
    });
  }

  // ===================================
  // 2. GENERATE TAGIHAN SPP SISWA
  // ===================================

  async generateSppTagihan(sekolahId: string, pengaturanTagihanId: string) {
    // 1. Dapatkan PengaturanTagihan dan Rombel terkait
    const tagihan = await this.prisma.pengaturanTagihan.findUnique({
      where: { pengaturan_tagihan_id: pengaturanTagihanId },
      include: {
        pengaturan_rombel: true,
      },
    });

    if (!tagihan) {
      throw new NotFoundException('Pengaturan tagihan tidak ditemukan.');
    }

    if (tagihan.sekolah_id !== sekolahId) {
      throw new BadRequestException('Pengaturan tagihan tidak terdaftar di sekolah ini.');
    }

    if (!tagihan.aktif) {
      throw new BadRequestException('Pengaturan tagihan sedang tidak aktif.');
    }

    const rombelIds = tagihan.pengaturan_rombel.map((r) => r.rombongan_belajar_id);
    if (rombelIds.length === 0) {
      throw new BadRequestException('Pengaturan tagihan belum dihubungkan ke kelas (rombongan belajar) mana pun.');
    }

    // 2. Dapatkan seluruh siswa aktif yang berada pada rombel-rombel tersebut
    const siswaList = await this.prisma.pesertaDidik.findMany({
      where: {
        rombongan_belajar_id: { in: rombelIds },
        sekolah_id: sekolahId,
        status: 'Aktif',
      },
      select: {
        peserta_didik_id: true,
        rombongan_belajar_id: true,
      },
    });

    if (siswaList.length === 0) {
      return {
        message: 'Tidak ada peserta didik aktif ditemukan pada kelas yang terpilih.',
        count: 0,
      };
    }

    const siswaIds = siswaList.map((s) => s.peserta_didik_id);

    // Ambil semua tagihan yang sudah ada untuk siswa-siswa tersebut dalam sekali query
    const existingSpps = await this.prisma.spp.findMany({
      where: {
        peserta_didik_id: { in: siswaIds },
        pengaturan_tagihan_id: pengaturanTagihanId,
      },
      select: {
        peserta_didik_id: true,
      },
    });

    // Buat Set berisi ID siswa yang sudah memiliki tagihan agar pencarian O(1) cepat
    const existingSiswaIds = new Set(existingSpps.map((s) => s.peserta_didik_id));

    // Filter daftar siswa yang BENAR-BENAR belum punya tagihan ini
    const siswaBelumAdaTagihan = siswaList.filter(
      (s) => !existingSiswaIds.has(s.peserta_didik_id),
    );

    if (siswaBelumAdaTagihan.length === 0) {
      return {
        message: 'Semua peserta didik di kelas terpilih sudah memiliki tagihan ini.',
        count: 0,
      };
    }

    let createdCount = 0;

    // 3. Generate tagihan SPP untuk masing-masing siswa yang belum memiliki tagihan
    await this.prisma.$transaction(async (tx) => {
      for (const siswa of siswaBelumAdaTagihan) {
        const newSpp = await tx.spp.create({
          data: {
            sekolah_id: sekolahId,
            peserta_didik_id: siswa.peserta_didik_id,
            pengaturan_tagihan_id: pengaturanTagihanId,
            nominal_tagihan: tagihan.nominal,
            nominal_terbayar: BigInt(0),
            status: 1, // Belum Bayar
          },
        });
        createdCount++;

        // Cari jika siswa ini memiliki tagihan unlinked yang memiliki dana terbayar
        const unlinkedSpps = await tx.spp.findMany({
          where: {
            peserta_didik_id: siswa.peserta_didik_id,
            nominal_terbayar: { gt: 0 },
            pengaturan_tagihan: {
              pengaturan_rombel: {
                none: {
                  rombongan_belajar_id: siswa.rombongan_belajar_id,
                },
              },
            },
          },
        });

        if (unlinkedSpps.length > 0) {
          let totalTransferredPaid = BigInt(0);
          const oldSppIdsToDelete = [];

          for (const oldSpp of unlinkedSpps) {
            const oldTransactions = await tx.riwayatTransaksiSpp.findMany({
              where: { spp_id: oldSpp.spp_id },
            });

            if (oldTransactions.length > 0) {
              // Alihkan semua transaksi riwayat pembayaran ke newSpp
              await tx.riwayatTransaksiSpp.updateMany({
                where: { spp_id: oldSpp.spp_id },
                data: {
                  spp_id: newSpp.spp_id,
                },
              });

              // Hitung total dana yang dialihkan
              for (const t of oldTransactions) {
                if (t.jenis_transaksi === 1 || t.jenis_transaksi === 2 || t.jenis_transaksi === 4) {
                  totalTransferredPaid += t.nominal;
                } else if (t.jenis_transaksi === 5) {
                  totalTransferredPaid -= t.nominal;
                }
              }
            }
            oldSppIdsToDelete.push(oldSpp.spp_id);
          }

          // Hapus tagihan unlinked yang sudah kosong/tidak berlaku
          if (oldSppIdsToDelete.length > 0) {
            await tx.spp.deleteMany({
              where: { spp_id: { in: oldSppIdsToDelete } },
            });
          }

          // Update nominal terbayar dan status pada tagihan baru
          let newStatus = 1; // Belum Bayar
          if (totalTransferredPaid >= tagihan.nominal) {
            newStatus = 3; // Lunas
          } else if (totalTransferredPaid > 0) {
            newStatus = 2; // Sebagian
          }

          await tx.spp.update({
            where: { spp_id: newSpp.spp_id },
            data: {
              nominal_terbayar: totalTransferredPaid,
              status: newStatus,
            },
          });
        }
      }
    });

    return {
      message: `Berhasil meng-generate ${createdCount} tagihan SPP baru.`,
      count: createdCount,
    };
  }

  async getTagihanSpp(sekolahId: string, filter?: { peserta_didik_id?: string; status?: number }) {
    const whereClause: any = { sekolah_id: sekolahId };

    if (filter) {
      if (filter.peserta_didik_id) {
        whereClause.peserta_didik_id = filter.peserta_didik_id;
      }
      if (filter.status !== undefined) {
        whereClause.status = Number(filter.status);
      }
    }

    return this.prisma.spp.findMany({
      where: whereClause,
      include: {
        peserta_didik: {
          select: {
            nama: true,
            nisn: true,
            nama_rombel: true,
          },
        },
        pengaturan_tagihan: {
          select: {
            nama_tagihan: true,
            tipe: true,
          },
        },
        riwayat_transaksi: {
          orderBy: {
            tanggal_transaksi: 'desc',
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  // ===================================
  // 3. PENCATATAN TRANSAKSI SPP
  // ===================================

  async createTransaksiSpp(dto: CreateTransaksiSppDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Cek Spp
      const spp = await tx.spp.findUnique({
        where: { spp_id: dto.spp_id },
      });

      if (!spp) {
        throw new NotFoundException('Data tagihan SPP tidak ditemukan.');
      }

      // 2. Simpan RiwayatTransaksiSpp
      const transaksi = await tx.riwayatTransaksiSpp.create({
        data: {
          spp_id: dto.spp_id,
          sekolah_id: dto.sekolah_id,
          peserta_didik_id: dto.peserta_didik_id,
          jenis_transaksi: dto.jenis_transaksi,
          nominal: BigInt(dto.nominal),
          tanggal_transaksi: new Date(dto.tanggal_transaksi),
          metode_pembayaran: dto.metode_pembayaran ?? null,
          keterangan: dto.keterangan || null,
        },
      });

      // 3. Ambil semua transaksi terkait spp_id ini untuk kalkulasi ulang
      const allTx = await tx.riwayatTransaksiSpp.findMany({
        where: { spp_id: dto.spp_id },
      });

      let nominalTerbayarSum = BigInt(0);

      for (const t of allTx) {
        // jenis_transaksi: 
        // 1 = Pembayaran (+)
        // 2 = Beasiswa (+)
        // 4 = Pengurangan (+)
        // 5 = Pengembalian Dana (-)
        // 3 = Denda (tidak mengurangi / diabaikan dalam sum pembayaran)
        if (t.jenis_transaksi === 1 || t.jenis_transaksi === 2 || t.jenis_transaksi === 4) {
          nominalTerbayarSum += t.nominal;
        } else if (t.jenis_transaksi === 5) {
          nominalTerbayarSum -= t.nominal;
        }
      }

      if (nominalTerbayarSum < BigInt(0)) {
        nominalTerbayarSum = BigInt(0);
      }

      // 4. Update Spp
      let status = 1; // Belum Bayar
      if (nominalTerbayarSum > BigInt(0)) {
        if (nominalTerbayarSum >= spp.nominal_tagihan) {
          status = 3; // Lunas
        } else {
          status = 2; // Sebagian
        }
      }

      await tx.spp.update({
        where: { spp_id: dto.spp_id },
        data: {
          nominal_terbayar: nominalTerbayarSum,
          status: status,
        },
      });

      return transaksi;
    });
  }

  // ===================================
  // 4. LAPORAN & REKAPITULASI
  // ===================================

  // A. Tunggakan per Siswa
  async getTunggakanPerSiswa(sekolahId: string) {
    const listSpp = await this.prisma.spp.findMany({
      where: {
        sekolah_id: sekolahId,
        status: { in: [1, 2] }, // Belum Bayar, Sebagian
      },
      include: {
        peserta_didik: {
          select: {
            nama: true,
            nisn: true,
            nama_rombel: true,
          },
        },
        pengaturan_tagihan: {
          select: {
            nama_tagihan: true,
          },
        },
      },
    });

    return listSpp.map((s) => {
      const sisaTunggakan = s.nominal_tagihan - s.nominal_terbayar;
      return {
        spp_id: s.spp_id,
        peserta_didik_id: s.peserta_didik_id,
        nama: s.peserta_didik?.nama || 'Unknown',
        nisn: s.peserta_didik?.nisn || '-',
        kelas: s.peserta_didik?.nama_rombel || '-',
        nama_tagihan: s.pengaturan_tagihan?.nama_tagihan || 'Tagihan',
        nominal_tagihan: s.nominal_tagihan.toString(),
        nominal_terbayar: s.nominal_terbayar.toString(),
        sisa_tunggakan: sisaTunggakan.toString(),
      };
    });
  }

  // B. Tunggakan per Kelas
  async getTunggakanPerKelas(sekolahId: string) {
    const listSpp = await this.prisma.spp.findMany({
      where: {
        sekolah_id: sekolahId,
        status: { in: [1, 2] },
      },
      include: {
        peserta_didik: {
          select: {
            rombongan_belajar_id: true,
            nama_rombel: true,
          },
        },
      },
    });

    const rekapMap: Record<string, { kelas: string; total_tunggakan: bigint }> = {};

    for (const s of listSpp) {
      const rombelId = s.peserta_didik?.rombongan_belajar_id || 'unassigned';
      const rombelNama = s.peserta_didik?.nama_rombel || 'Tanpa Kelas';
      const tunggakan = s.nominal_tagihan - s.nominal_terbayar;

      if (!rekapMap[rombelId]) {
        rekapMap[rombelId] = {
          kelas: rombelNama,
          total_tunggakan: BigInt(0),
        };
      }
      rekapMap[rombelId].total_tunggakan += tunggakan;
    }

    return Object.values(rekapMap).map((item) => ({
      kelas: item.kelas,
      total_tunggakan: item.total_tunggakan.toString(),
    }));
  }

  // C. Total Pembayaran
  async getTotalPembayaran(sekolahId: string) {
    const aggregate = await this.prisma.riwayatTransaksiSpp.aggregate({
      where: {
        sekolah_id: sekolahId,
        jenis_transaksi: 1, // Pembayaran
      },
      _sum: {
        nominal: true,
      },
    });

    return {
      sekolah_id: sekolahId,
      total_pembayaran: (aggregate._sum.nominal || BigInt(0)).toString(),
    };
  }

  // D. Total Beasiswa
  async getTotalBeasiswa(sekolahId: string) {
    const aggregate = await this.prisma.riwayatTransaksiSpp.aggregate({
      where: {
        sekolah_id: sekolahId,
        jenis_transaksi: 2, // Beasiswa
      },
      _sum: {
        nominal: true,
      },
    });

    return {
      sekolah_id: sekolahId,
      total_beasiswa: (aggregate._sum.nominal || BigInt(0)).toString(),
    };
  }

  // E. Rekap Pembayaran per Bulan
  async getRekapBulanan(sekolahId: string) {
    const listPembayaran = await this.prisma.riwayatTransaksiSpp.findMany({
      where: {
        sekolah_id: sekolahId,
        jenis_transaksi: 1,
      },
      select: {
        nominal: true,
        tanggal_transaksi: true,
      },
    });

    const monthMap: Record<string, { bulan_tahun: string; nominal: bigint }> = {};

    for (const p of listPembayaran) {
      const date = new Date(p.tanggal_transaksi);
      const month = date.getMonth() + 1; // 1-indexed
      const year = date.getFullYear();
      const key = `${year}-${month.toString().padStart(2, '0')}`;

      if (!monthMap[key]) {
        monthMap[key] = {
          bulan_tahun: key,
          nominal: BigInt(0),
        };
      }
      monthMap[key].nominal += p.nominal;
    }

    return Object.values(monthMap)
      .map((item) => ({
        bulan_tahun: item.bulan_tahun,
        nominal: item.nominal.toString(),
      }))
      .sort((a, b) => b.bulan_tahun.localeCompare(a.bulan_tahun)); // Descending order
  }

  // F. Rekap Pembayaran per Tahun Pelajaran
  async getRekapTahunPelajaran(sekolahId: string) {
    const listPembayaran = await this.prisma.riwayatTransaksiSpp.findMany({
      where: {
        sekolah_id: sekolahId,
        jenis_transaksi: 1,
      },
      include: {
        peserta_didik: {
          select: {
            rombongan_belajar: {
              select: {
                semester_id: true,
              },
            },
          },
        },
      },
    });

    const semesterMap: Record<string, { semester_id: string; total_nominal: bigint }> = {};

    for (const p of listPembayaran) {
      // Semester id didapatkan dari rombongan belajar peserta didik
      const semesterId = p.peserta_didik?.rombongan_belajar?.semester_id || 'unassigned';

      if (!semesterMap[semesterId]) {
        semesterMap[semesterId] = {
          semester_id: semesterId,
          total_nominal: BigInt(0),
        };
      }
      semesterMap[semesterId].total_nominal += p.nominal;
    }

    return Object.values(semesterMap).map((item) => {
      // Format semester_id (misal 20231) menjadi "Tahun Ajaran 2023/2024 Ganjil"
      let label = item.semester_id;
      if (item.semester_id.length === 5) {
        const year = parseInt(item.semester_id.substring(0, 4));
        const sem = item.semester_id.substring(4) === '1' ? 'Ganjil' : 'Genap';
        label = `Tahun Pelajaran ${year}/${year + 1} - ${sem}`;
      }

      return {
        semester_id: item.semester_id,
        label: label,
        total_pembayaran: item.total_nominal.toString(),
      };
    }).sort((a, b) => b.semester_id.localeCompare(a.semester_id));
  }
}
