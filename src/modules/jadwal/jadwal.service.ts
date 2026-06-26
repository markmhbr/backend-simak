import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class JadwalService {
  constructor(private readonly prisma: PrismaService) {}

  // =====================
  // JENIS JADWAL
  // =====================

  async getJenisJadwal(sekolahId: string) {
    const list = await this.prisma.jenisJadwal.findMany({
      where: { sekolah_id: sekolahId },
      include: {
        pengaturan_jadwal: { orderBy: { urutan: 'asc' } },
        pengaturan_hari: true,
      },
      orderBy: { created_at: 'asc' },
    });

    if (list.length === 0) {
      // Auto-seed first/default JenisJadwal
      const defaultJenis = await this.prisma.jenisJadwal.create({
        data: {
          sekolah_id: sekolahId,
          nama: 'Jadwal Reguler',
        },
      });

      // Seed default daily settings for this default template (Senin-Minggu)
      const defaultHariSettings = [];
      const defaultMasuk = new Date(`1970-01-01T07:00:00Z`);
      const defaultPulang = new Date(`1970-01-01T15:00:00Z`);
      for (let hari = 1; hari <= 7; hari++) {
        defaultHariSettings.push({
          sekolah_id: sekolahId,
          jenis_jadwal_id: defaultJenis.jenis_jadwal_id,
          hari,
          jam_masuk: defaultMasuk,
          jam_pulang: defaultPulang,
          aktif: true,
        });
      }
      await this.prisma.pengaturanJadwalHari.createMany({
        data: defaultHariSettings,
      });

      const defaultSlots = [];
      for (let hari = 1; hari <= 7; hari++) {
        for (let urutan = 1; urutan <= 8; urutan++) {
          const tipe = urutan === 4 ? 2 : 1;
          const durasi_menit = urutan === 4 ? 30 : 45;
          defaultSlots.push({
            sekolah_id: sekolahId,
            jenis_jadwal_id: defaultJenis.jenis_jadwal_id,
            hari,
            urutan,
            tipe,
            durasi_menit,
            aktif: true,
          });
        }
      }

      await this.prisma.pengaturanJadwal.createMany({
        data: defaultSlots,
      });

      // Fetch again
      return this.prisma.jenisJadwal.findMany({
        where: { sekolah_id: sekolahId },
        include: {
          pengaturan_jadwal: { orderBy: { urutan: 'asc' } },
          pengaturan_hari: true,
        },
        orderBy: { created_at: 'asc' },
      });
    }

    // Auto-seed missing days in pengaturan_hari for existing templates
    let needsRefetch = false;
    for (const jenis of list) {
      const existingDays = jenis.pengaturan_hari ? jenis.pengaturan_hari.map(h => h.hari) : [];
      const missingDays = [];
      for (let d = 1; d <= 7; d++) {
        if (!existingDays.includes(d)) {
          missingDays.push(d);
        }
      }
      if (missingDays.length > 0) {
        const firstDaySetting = jenis.pengaturan_hari && jenis.pengaturan_hari.length > 0 ? jenis.pengaturan_hari[0] : null;
        const refMasuk = firstDaySetting ? firstDaySetting.jam_masuk : new Date(`1970-01-01T07:00:00Z`);
        const refPulang = firstDaySetting ? firstDaySetting.jam_pulang : new Date(`1970-01-01T15:00:00Z`);

        const defaultHariSettings = [];
        for (const hari of missingDays) {
          defaultHariSettings.push({
            sekolah_id: sekolahId,
            jenis_jadwal_id: jenis.jenis_jadwal_id,
            hari,
            jam_masuk: refMasuk,
            jam_pulang: refPulang,
            aktif: true,
          });
        }
        await this.prisma.pengaturanJadwalHari.createMany({
          data: defaultHariSettings,
        });
        needsRefetch = true;
      }
    }

    if (needsRefetch) {
      return this.prisma.jenisJadwal.findMany({
        where: { sekolah_id: sekolahId },
        include: {
          pengaturan_jadwal: { orderBy: { urutan: 'asc' } },
          pengaturan_hari: true,
        },
        orderBy: { created_at: 'asc' },
      });
    }

    return list;
  }

  async createJenisJadwal(sekolahId: string, data: {
    nama: string;
    jam_masuk: string;
    jam_pulang: string;
    custom_mapel?: boolean;
  }) {
    const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
    if (!timeRegex.test(data.jam_masuk) || !timeRegex.test(data.jam_pulang)) {
      throw new BadRequestException('Format jam harus HH:mm');
    }
    if (data.jam_masuk >= data.jam_pulang) {
      throw new BadRequestException('Jam masuk harus sebelum jam pulang');
    }

    const newJenis = await this.prisma.jenisJadwal.create({
      data: {
        sekolah_id: sekolahId,
        nama: data.nama,
        custom_mapel: data.custom_mapel || false,
      },
    });

    // Auto-seed daily settings for this new template (Senin-Minggu)
    const defaultHariSettings = [];
    const dateMasuk = new Date(`1970-01-01T${data.jam_masuk}:00Z`);
    const datePulang = new Date(`1970-01-01T${data.jam_pulang}:00Z`);
    for (let hari = 1; hari <= 7; hari++) {
      defaultHariSettings.push({
        sekolah_id: sekolahId,
        jenis_jadwal_id: newJenis.jenis_jadwal_id,
        hari,
        jam_masuk: dateMasuk,
        jam_pulang: datePulang,
        aktif: true,
      });
    }
    await this.prisma.pengaturanJadwalHari.createMany({
      data: defaultHariSettings,
    });

    return newJenis;
  }

  async updateJenisJadwal(sekolahId: string, jenisJadwalId: string, data: {
    nama?: string;
    custom_mapel?: boolean;
    aktif?: boolean;
  }) {
    const existing = await this.prisma.jenisJadwal.findFirst({
      where: { jenis_jadwal_id: jenisJadwalId, sekolah_id: sekolahId },
    });
    if (!existing) throw new NotFoundException('Jenis jadwal tidak ditemukan');

    const updateData: any = {};
    if (data.nama !== undefined) updateData.nama = data.nama;
    if (data.custom_mapel !== undefined) updateData.custom_mapel = data.custom_mapel;

    if (data.aktif === true) {
      return this.prisma.$transaction(async (tx) => {
        await tx.jenisJadwal.updateMany({
          where: { sekolah_id: sekolahId, aktif: true },
          data: { aktif: false },
        });
        return tx.jenisJadwal.update({
          where: { jenis_jadwal_id: jenisJadwalId },
          data: { ...updateData, aktif: true },
        });
      });
    }

    if (data.aktif !== undefined) updateData.aktif = data.aktif;

    return this.prisma.jenisJadwal.update({
      where: { jenis_jadwal_id: jenisJadwalId },
      data: updateData,
    });
  }

  async deleteJenisJadwal(sekolahId: string, jenisJadwalId: string) {
    const existing = await this.prisma.jenisJadwal.findFirst({
      where: { jenis_jadwal_id: jenisJadwalId, sekolah_id: sekolahId },
    });
    if (!existing) throw new NotFoundException('Jenis jadwal tidak ditemukan');

    return this.prisma.jenisJadwal.delete({
      where: { jenis_jadwal_id: jenisJadwalId },
    });
  }

  async toggleJenisJadwal(sekolahId: string, jenisJadwalId: string, aktif: boolean) {
    const existing = await this.prisma.jenisJadwal.findFirst({
      where: { jenis_jadwal_id: jenisJadwalId, sekolah_id: sekolahId },
    });
    if (!existing) throw new NotFoundException('Jenis jadwal tidak ditemukan');

    if (aktif) {
      return this.prisma.$transaction(async (tx) => {
        await tx.jenisJadwal.updateMany({
          where: { sekolah_id: sekolahId, aktif: true },
          data: { aktif: false },
        });
        return tx.jenisJadwal.update({
          where: { jenis_jadwal_id: jenisJadwalId },
          data: { aktif: true },
        });
      });
    }

    return this.prisma.jenisJadwal.update({
      where: { jenis_jadwal_id: jenisJadwalId },
      data: { aktif: false },
    });
  }

  async updatePengaturanHari(sekolahId: string, data: {
    jenis_jadwal_id: string;
    hari: number;
    jam_masuk?: string;
    jam_pulang?: string;
    aktif?: boolean;
  }) {
    const jenisJadwal = await this.prisma.jenisJadwal.findFirst({
      where: { jenis_jadwal_id: data.jenis_jadwal_id, sekolah_id: sekolahId },
    });
    if (!jenisJadwal) throw new NotFoundException('Jenis jadwal tidak ditemukan');

    const updateData: any = {};
    if (data.aktif !== undefined) {
      updateData.aktif = data.aktif;
    }

    if (data.jam_masuk !== undefined && data.jam_pulang !== undefined) {
      const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
      if (!timeRegex.test(data.jam_masuk) || !timeRegex.test(data.jam_pulang)) {
        throw new BadRequestException('Format jam harus HH:mm');
      }
      if (data.jam_masuk >= data.jam_pulang) {
        throw new BadRequestException('Jam masuk harus sebelum jam pulang');
      }

      const existingSlots = await this.prisma.pengaturanJadwal.findMany({
        where: {
          sekolah_id: sekolahId,
          jenis_jadwal_id: data.jenis_jadwal_id,
          hari: data.hari,
          aktif: true,
        },
      });

      const totalDuration = existingSlots.reduce((sum, s) => sum + s.durasi_menit, 0);
      const [inH, inM] = data.jam_masuk.split(':').map(Number);
      const [outH, outM] = data.jam_pulang.split(':').map(Number);
      const availableMinutes = (outH * 60 + outM) - (inH * 60 + inM);

      if (totalDuration > availableMinutes) {
        throw new BadRequestException(
          `Gagal memperbarui jam operasional: Total durasi slot yang sudah ada (${totalDuration} menit) melebihi batas waktu baru (${availableMinutes} menit)`
        );
      }

      updateData.jam_masuk = new Date(`1970-01-01T${data.jam_masuk}:00Z`);
      updateData.jam_pulang = new Date(`1970-01-01T${data.jam_pulang}:00Z`);
    }

    const defaultIn = data.jam_masuk ? new Date(`1970-01-01T${data.jam_masuk}:00Z`) : new Date(`1970-01-01T07:00:00Z`);
    const defaultOut = data.jam_pulang ? new Date(`1970-01-01T${data.jam_pulang}:00Z`) : new Date(`1970-01-01T15:00:00Z`);

    return this.prisma.pengaturanJadwalHari.upsert({
      where: {
        sekolah_id_jenis_jadwal_id_hari: {
          sekolah_id: sekolahId,
          jenis_jadwal_id: data.jenis_jadwal_id,
          hari: data.hari,
        },
      },
      update: updateData,
      create: {
        sekolah_id: sekolahId,
        jenis_jadwal_id: data.jenis_jadwal_id,
        hari: data.hari,
        jam_masuk: defaultIn,
        jam_pulang: defaultOut,
        aktif: data.aktif !== undefined ? data.aktif : true,
      },
    });
  }

  // =====================
  // PENGATURAN JADWAL
  // =====================

  async getPengaturanJadwal(sekolahId: string, jenisJadwalId: string, hari?: number) {
    const whereClause: any = { sekolah_id: sekolahId, jenis_jadwal_id: jenisJadwalId };
    if (hari !== undefined) {
      whereClause.hari = hari;
    }
    return this.prisma.pengaturanJadwal.findMany({
      where: whereClause,
      orderBy: [{ hari: 'asc' }, { urutan: 'asc' }],
    });
  }

  async upsertPengaturanJadwal(sekolahId: string, data: {
    jenis_jadwal_id: string;
    hari: number;
    urutan: number;
    tipe: number;
    durasi_menit: number;
    aktif?: boolean;
  }) {
    if (data.hari < 1 || data.hari > 7) {
      throw new BadRequestException('Hari harus antara 1-7');
    }
    if (data.tipe < 1 || data.tipe > 7) {
      throw new BadRequestException('Tipe kegiatan harus antara 1-7');
    }
    if (data.durasi_menit < 1) {
      throw new BadRequestException('Durasi menit harus lebih dari 0');
    }

    // Verify jenis_jadwal belongs to sekolah
    const jenisJadwal = await this.prisma.jenisJadwal.findFirst({
      where: { jenis_jadwal_id: data.jenis_jadwal_id, sekolah_id: sekolahId },
    });
    if (!jenisJadwal) throw new NotFoundException('Jenis jadwal tidak ditemukan');

    // Validate that the total active slot durations do not exceed available hours for this specific day
    const isProposedActive = data.aktif ?? true;
    if (isProposedActive) {
      const existingSlots = await this.prisma.pengaturanJadwal.findMany({
        where: {
          sekolah_id: sekolahId,
          jenis_jadwal_id: data.jenis_jadwal_id,
          hari: data.hari,
          aktif: true,
          NOT: {
            urutan: data.urutan,
          },
        },
      });

      const otherDuration = existingSlots.reduce((sum, s) => sum + s.durasi_menit, 0);
      const proposedTotalDuration = otherDuration + data.durasi_menit;

      const daySetting = await this.prisma.pengaturanJadwalHari.findUnique({
        where: {
          sekolah_id_jenis_jadwal_id_hari: {
            sekolah_id: sekolahId,
            jenis_jadwal_id: data.jenis_jadwal_id,
            hari: data.hari,
          },
        },
      });

      const masukMinutes = daySetting
        ? daySetting.jam_masuk.getUTCHours() * 60 + daySetting.jam_masuk.getUTCMinutes()
        : 7 * 60;

      const pulangMinutes = daySetting
        ? daySetting.jam_pulang.getUTCHours() * 60 + daySetting.jam_pulang.getUTCMinutes()
        : 15 * 60;

      const availableMinutes = pulangMinutes - masukMinutes;

      if (proposedTotalDuration > availableMinutes) {
        throw new BadRequestException(
          `Total durasi slot (${proposedTotalDuration} menit) pada hari ini melebihi batas waktu jam pulang (${availableMinutes} menit dari jam masuk)`
        );
      }
    }


    return this.prisma.pengaturanJadwal.upsert({
      where: {
        sekolah_id_jenis_jadwal_id_hari_urutan: {
          sekolah_id: sekolahId,
          jenis_jadwal_id: data.jenis_jadwal_id,
          hari: data.hari,
          urutan: data.urutan,
        },
      },
      update: {
        tipe: data.tipe,
        durasi_menit: data.durasi_menit,
        aktif: data.aktif ?? true,
      },
      create: {
        sekolah_id: sekolahId,
        jenis_jadwal_id: data.jenis_jadwal_id,
        hari: data.hari,
        urutan: data.urutan,
        tipe: data.tipe,
        durasi_menit: data.durasi_menit,
        aktif: data.aktif ?? true,
      },
    });
  }

  async deletePengaturanJadwal(sekolahId: string, pengaturanJadwalId: string) {
    const existing = await this.prisma.pengaturanJadwal.findFirst({
      where: { pengaturan_jadwal_id: pengaturanJadwalId, sekolah_id: sekolahId },
    });
    if (!existing) throw new NotFoundException('Pengaturan jadwal tidak ditemukan');

    return this.prisma.pengaturanJadwal.delete({
      where: { pengaturan_jadwal_id: pengaturanJadwalId },
    });
  }

  // =====================
  // JADWAL PELAJARAN
  // =====================

  async getJadwalPelajaran(sekolahId: string, jenisJadwalId: string, rombelId: string) {
    return this.prisma.jadwalPelajaran.findMany({
      where: {
        sekolah_id: sekolahId,
        jenis_jadwal_id: jenisJadwalId,
        rombongan_belajar_id: rombelId,
      },
      include: {
        pembelajaran: {
          include: {
            gtk: true,
          },
        },
      },
      orderBy: [{ hari: 'asc' }, { urutan: 'asc' }],
    });
  }

  async upsertJadwalPelajaran(sekolahId: string, data: {
    jenis_jadwal_id: string;
    rombongan_belajar_id: string;
    pembelajaran_id: string;
    hari: number;
    urutan: number;
  }) {
    // Validate hari 1-7
    if (data.hari < 1 || data.hari > 7) {
      throw new BadRequestException('Hari harus antara 1 (Senin) sampai 7 (Minggu)');
    }

    // Validasi 3: Hanya slot dengan tipe = 1 (Pembelajaran) yang boleh digunakan
    const slot = await this.prisma.pengaturanJadwal.findUnique({
      where: {
        sekolah_id_jenis_jadwal_id_hari_urutan: {
          sekolah_id: sekolahId,
          jenis_jadwal_id: data.jenis_jadwal_id,
          hari: data.hari,
          urutan: data.urutan,
        },
      },
    });
    if (!slot) {
      throw new BadRequestException(`Slot waktu untuk hari ${data.hari} urutan ${data.urutan} belum diatur pada jenis jadwal ini`);
    }
    if (slot.tipe !== 1) {
      throw new BadRequestException(`Slot waktu ini bertipe ${slot.tipe}, hanya tipe Pembelajaran (1) yang diperbolehkan`);
    }

    // Validasi 1: Guru tidak boleh mengajar dua kelas pada hari dan urutan yang sama
    const pembelajaran = await this.prisma.pembelajaran.findUnique({
      where: { pembelajaran_id: data.pembelajaran_id },
    });
    if (!pembelajaran) {
      throw new NotFoundException('Data pembelajaran tidak ditemukan');
    }

    if (pembelajaran.ptk_id) {
      const guruConflict = await this.prisma.jadwalPelajaran.findFirst({
        where: {
          sekolah_id: sekolahId,
          jenis_jadwal_id: data.jenis_jadwal_id,
          pembelajaran: {
            ptk_id: pembelajaran.ptk_id,
          },
          hari: data.hari,
          urutan: data.urutan,
          NOT: {
            rombongan_belajar_id: data.rombongan_belajar_id,
          },
        },
        include: { pembelajaran: true },
      });
      if (guruConflict) {
        throw new ConflictException(
          `Guru sudah mengajar di kelas lain pada hari ${data.hari} urutan ${data.urutan}`
        );
      }
    }

    // Validasi 4: Total slot jadwal untuk pembelajaran_id harus <= jam_mengajar_perminggu
    const jamMengajar = parseInt(pembelajaran.jam_mengajar_per_minggu?.toString() || '0');
    if (jamMengajar > 0) {
      // Count existing slots for this pembelajaran (exclude current slot being upserted)
      const existingCount = await this.prisma.jadwalPelajaran.count({
        where: {
          pembelajaran_id: data.pembelajaran_id,
          NOT: {
            AND: {
              sekolah_id: sekolahId,
              jenis_jadwal_id: data.jenis_jadwal_id,
              rombongan_belajar_id: data.rombongan_belajar_id,
              hari: data.hari,
              urutan: data.urutan,
            },
          },
        },
      });

      // Check if adding this one would exceed quota
      if (existingCount >= jamMengajar) {
        throw new BadRequestException(
          `Kuota jam mengajar untuk mata pelajaran ini sudah terpenuhi (${existingCount}/${jamMengajar} jam/minggu)`
        );
      }
    }

    // Validasi 2: handled by unique constraint @@unique([sekolah_id, jenis_jadwal_id, rombongan_belajar_id, hari, urutan])
    return this.prisma.jadwalPelajaran.upsert({
      where: {
        sekolah_id_jenis_jadwal_id_rombongan_belajar_id_hari_urutan: {
          sekolah_id: sekolahId,
          jenis_jadwal_id: data.jenis_jadwal_id,
          rombongan_belajar_id: data.rombongan_belajar_id,
          hari: data.hari,
          urutan: data.urutan,
        },
      },
      update: {
        pembelajaran_id: data.pembelajaran_id,
      },
      create: {
        sekolah_id: sekolahId,
        jenis_jadwal_id: data.jenis_jadwal_id,
        rombongan_belajar_id: data.rombongan_belajar_id,
        pembelajaran_id: data.pembelajaran_id,
        hari: data.hari,
        urutan: data.urutan,
      },
    });
  }

  async deleteJadwalPelajaran(sekolahId: string, jadwalPelajaranId: string) {
    const existing = await this.prisma.jadwalPelajaran.findFirst({
      where: { jadwal_pelajaran_id: jadwalPelajaranId, sekolah_id: sekolahId },
    });
    if (!existing) throw new NotFoundException('Jadwal pelajaran tidak ditemukan');

    return this.prisma.jadwalPelajaran.delete({
      where: { jadwal_pelajaran_id: jadwalPelajaranId },
    });
  }
}
