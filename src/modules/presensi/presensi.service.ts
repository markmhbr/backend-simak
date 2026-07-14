import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class PresensiService {
  constructor(private readonly prisma: PrismaService) {}

  // =====================
  // HARI LIBUR
  // =====================

  async getHariLibur(sekolahId: string) {
    return this.prisma.hariLibur.findMany({
      where: { sekolah_id: sekolahId },
      orderBy: { tanggal_mulai: 'asc' },
    });
  }

  async createHariLibur(sekolahId: string, data: {
    nama: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    keterangan?: string;
  }) {
    return this.prisma.hariLibur.create({
      data: {
        sekolah_id: sekolahId,
        nama: data.nama,
        tanggal_mulai: new Date(data.tanggal_mulai),
        tanggal_selesai: new Date(data.tanggal_selesai),
        keterangan: data.keterangan,
      },
    });
  }

  async updateHariLibur(sekolahId: string, id: string, data: {
    nama?: string;
    tanggal_mulai?: string;
    tanggal_selesai?: string;
    keterangan?: string;
  }) {
    const updateData: any = {};
    if (data.nama !== undefined) updateData.nama = data.nama;
    if (data.tanggal_mulai !== undefined) updateData.tanggal_mulai = new Date(data.tanggal_mulai);
    if (data.tanggal_selesai !== undefined) updateData.tanggal_selesai = new Date(data.tanggal_selesai);
    if (data.keterangan !== undefined) updateData.keterangan = data.keterangan;

    return this.prisma.hariLibur.update({
      where: { hari_libur_id: id },
      data: updateData,
    });
  }

  async deleteHariLibur(sekolahId: string, hariLiburId: string) {
    return this.prisma.hariLibur.deleteMany({
      where: { hari_libur_id: hariLiburId, sekolah_id: sekolahId },
    });
  }

  // =====================
  // PRESENSI LOGIC
  // =====================

  private async checkHoliday(sekolahId: string, date: Date) {
    const holiday = await this.prisma.hariLibur.findFirst({
      where: {
        sekolah_id: sekolahId,
        aktif: true,
        tanggal_mulai: { lte: date },
        tanggal_selesai: { gte: date },
      },
    });
    return holiday;
  }

  private async getActiveSchedule(sekolahId: string, dayOfWeek: number) {
    const activeJenis = await this.prisma.jenisJadwal.findFirst({
      where: { sekolah_id: sekolahId, aktif: true },
      include: {
        pengaturan_hari: {
          where: { hari: dayOfWeek, aktif: true },
        },
      },
    });

    if (!activeJenis) {
      throw new BadRequestException('Sekolah belum memiliki jadwal aktif');
    }

    const dayConfig = activeJenis.pengaturan_hari[0];
    if (!dayConfig) {
      throw new BadRequestException('Jadwal tidak aktif untuk hari ini');
    }

    return dayConfig;
  }

  async presensiPesertaDidik(sekolahId: string, data: {
    peserta_didik_id: string;
    waktu: string;
    tipe: 'masuk' | 'pulang';
  }) {
    const dateObj = new Date(data.waktu);
    // Konversi current time ke WIB/UTC+7 agar akurat dengan waktu sekolah
    const wibDate = new Date(dateObj.getTime() + 7 * 60 * 60 * 1000);
    const dateOnly = new Date(wibDate.toISOString().split('T')[0]);
    const dayOfWeek = wibDate.getUTCDay() === 0 ? 7 : wibDate.getUTCDay(); // 1=Senin, ..., 7=Minggu

    // 1. Cek Hari Libur
    const holiday = await this.checkHoliday(sekolahId, dateOnly);
    if (holiday) {
      throw new BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}`);
    }

    // 2. Ambil Jadwal Aktif & Cek Hari Libur Pekanan
    const activeSchedule = await this.prisma.jenisJadwal.findFirst({
      where: { sekolah_id: sekolahId, aktif: true },
      include: {
        pengaturan_hari: {
          where: { aktif: true },
          select: { hari: true },
        },
      },
    });
    const activeDays = activeSchedule?.pengaturan_hari.map(h => h.hari) || [1, 2, 3, 4, 5, 6];
    if (!activeDays.includes(dayOfWeek)) {
      throw new BadRequestException('Hari ini merupakan libur akhir pekan. Tidak dapat melakukan presensi.');
    }

    const dayConfig = await this.getActiveSchedule(sekolahId, dayOfWeek);

    // 3. Hitung Status
    const currentTimeMinutes = wibDate.getUTCHours() * 60 + wibDate.getUTCMinutes();
    const configInMinutes = dayConfig.jam_masuk.getUTCHours() * 60 + dayConfig.jam_masuk.getUTCMinutes();
    const configOutMinutes = dayConfig.jam_pulang.getUTCHours() * 60 + dayConfig.jam_pulang.getUTCMinutes();

    if (data.tipe === 'masuk') {
      if (currentTimeMinutes > configInMinutes) {
        throw new BadRequestException('Batas waktu masuk sudah lewat (pelajaran telah dimulai).');
      }
      const status_masuk = 1; // 1=Hadir
      return this.prisma.presensiPesertaDidik.upsert({
        where: {
          peserta_didik_id_tanggal: {
            peserta_didik_id: data.peserta_didik_id,
            tanggal: dateOnly,
          },
        },
        update: {
          jam_masuk: dateObj,
          status_masuk,
          sekolah_id: sekolahId,
        },
        create: {
          peserta_didik_id: data.peserta_didik_id,
          tanggal: dateOnly,
          jam_masuk: dateObj,
          status_masuk,
          sekolah_id: sekolahId,
        },
      });
    } else {
      if (currentTimeMinutes < configOutMinutes) {
        throw new BadRequestException('Jadwal pelajaran belum selesai. Belum saatnya presensi pulang.');
      }
      const status_pulang = 1; // 1=Normal
      return this.prisma.presensiPesertaDidik.upsert({
        where: {
          peserta_didik_id_tanggal: {
            peserta_didik_id: data.peserta_didik_id,
            tanggal: dateOnly,
          },
        },
        update: {
          jam_pulang: dateObj,
          status_pulang,
          sekolah_id: sekolahId,
        },
        create: {
          peserta_didik_id: data.peserta_didik_id,
          tanggal: dateOnly,
          jam_pulang: dateObj,
          status_pulang,
          sekolah_id: sekolahId,
        },
      });
    }
  }

  async updateGtkMode(sekolahId: string, ptkId: string, modePresensi: number) {
    const gtk = await this.prisma.gtk.findFirst({
      where: { ptk_id: ptkId, sekolah_id: sekolahId },
    });

    if (!gtk) {
      throw new Error('GTK not found in this school');
    }

    const updated = await this.prisma.gtk.update({
      where: { ptk_id: ptkId },
      data: { mode_presensi: modePresensi },
    });

    return {
      status: 'success',
      message: 'Mode presensi GTK berhasil diperbarui.',
      data: updated,
    };
  }

  async presensiGtk(sekolahId: string, data: {
    ptk_id: string;
    waktu: string;
    tipe: 'masuk' | 'pulang';
  }) {
    const dateObj = new Date(data.waktu);
    // Konversi current time ke WIB/UTC+7 agar akurat dengan waktu sekolah
    const wibDate = new Date(dateObj.getTime() + 7 * 60 * 60 * 1000);
    const dateOnly = new Date(wibDate.toISOString().split('T')[0]);
    const dayOfWeek = wibDate.getUTCDay() === 0 ? 7 : wibDate.getUTCDay();

    const holiday = await this.checkHoliday(sekolahId, dateOnly);
    if (holiday) throw new BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}`);

    // Cek Hari Libur Pekanan
    const activeSchedule = await this.prisma.jenisJadwal.findFirst({
      where: { sekolah_id: sekolahId, aktif: true },
      include: {
        pengaturan_hari: {
          where: { aktif: true },
          select: { hari: true },
        },
      },
    });
    const activeDays = activeSchedule?.pengaturan_hari.map(h => h.hari) || [1, 2, 3, 4, 5, 6];
    if (!activeDays.includes(dayOfWeek)) {
      throw new BadRequestException('Hari ini merupakan libur akhir pekan. Tidak dapat melakukan presensi.');
    }

    const dayConfig = await this.getActiveSchedule(sekolahId, dayOfWeek);

    // Ambil mode presensi GTK
    const gtk = await this.prisma.gtk.findUnique({
      where: { ptk_id: data.ptk_id },
      select: { mode_presensi: true },
    });
    if (!gtk) {
      throw new NotFoundException('Data GTK tidak ditemukan');
    }

    const baseInMinutes = dayConfig.jam_masuk.getUTCHours() * 60 + dayConfig.jam_masuk.getUTCMinutes();
    let configInMinutes = baseInMinutes;
    let configOutMinutes = dayConfig.jam_pulang.getUTCHours() * 60 + dayConfig.jam_pulang.getUTCMinutes();

    if (gtk.mode_presensi === 1) {
      // Sesuai Pelajaran
      const jadwalGtk = await this.prisma.jadwalPelajaran.findMany({
        where: {
          sekolah_id: sekolahId,
          jenis_jadwal_id: activeSchedule.jenis_jadwal_id,
          hari: dayOfWeek,
          aktif: true,
          pembelajaran: {
            ptk_id: data.ptk_id,
          },
        },
        select: {
          urutan: true,
        },
        orderBy: {
          urutan: 'asc',
        },
      });

      if (jadwalGtk.length === 0) {
        throw new BadRequestException('Anda tidak memiliki jadwal mengajar hari ini.');
      }

      const firstUrutan = jadwalGtk[0].urutan;
      const lastUrutan = jadwalGtk[jadwalGtk.length - 1].urutan;

      // Ambil seluruh pengaturan jadwal hari ini untuk menjumlahkan durasi
      const listPengaturan = await this.prisma.pengaturanJadwal.findMany({
        where: {
          sekolah_id: sekolahId,
          jenis_jadwal_id: activeSchedule.jenis_jadwal_id,
          hari: dayOfWeek,
          aktif: true,
        },
        orderBy: {
          urutan: 'asc',
        },
      });

      let startOffset = 0;
      let endOffset = 0;

      for (const p of listPengaturan) {
        if (p.urutan < firstUrutan) {
          startOffset += p.durasi_menit;
        }
        if (p.urutan <= lastUrutan) {
          endOffset += p.durasi_menit;
        }
      }

      configInMinutes = baseInMinutes + startOffset;
      configOutMinutes = baseInMinutes + endOffset;
    }

    const currentTimeMinutes = wibDate.getUTCHours() * 60 + wibDate.getUTCMinutes();

    if (data.tipe === 'masuk') {
      if (currentTimeMinutes > configInMinutes) {
        throw new BadRequestException('Batas waktu masuk sudah lewat (jam mengajar telah dimulai).');
      }
      const status_masuk = 1; // 1=Hadir
      return this.prisma.presensiGtk.upsert({
        where: {
          ptk_id_tanggal: {
            ptk_id: data.ptk_id,
            tanggal: dateOnly,
          },
        },
        update: {
          jam_masuk: dateObj,
          status_masuk,
          sekolah_id: sekolahId,
        },
        create: {
          ptk_id: data.ptk_id,
          tanggal: dateOnly,
          jam_masuk: dateObj,
          status_masuk,
          sekolah_id: sekolahId,
        },
      });
    } else {
      if (currentTimeMinutes < configOutMinutes) {
        throw new BadRequestException('Jam pulang belum tiba. Belum saatnya presensi pulang.');
      }
      const status_pulang = 1; // 1=Normal
      return this.prisma.presensiGtk.upsert({
        where: {
          ptk_id_tanggal: {
            ptk_id: data.ptk_id,
            tanggal: dateOnly,
          },
        },
        update: {
          jam_pulang: dateObj,
          status_pulang,
          sekolah_id: sekolahId,
        },
        create: {
          ptk_id: data.ptk_id,
          tanggal: dateOnly,
          jam_pulang: dateObj,
          status_pulang,
          sekolah_id: sekolahId,
        },
      });
    }
  }

  async presensiMapel(sekolahId: string, data: {
    jadwal_pelajaran_id: string;
    peserta_didik_id: string;
    tanggal: string;
    status: number;
  }) {
    const dateOnly = new Date(data.tanggal);
    const holiday = await this.checkHoliday(sekolahId, dateOnly);
    if (holiday) throw new BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}`);

    return this.prisma.presensiMapel.upsert({
      where: {
        jadwal_pelajaran_id_peserta_didik_id_tanggal: {
          jadwal_pelajaran_id: data.jadwal_pelajaran_id,
          peserta_didik_id: data.peserta_didik_id,
          tanggal: dateOnly,
        },
      },
      update: {
        status: data.status,
        waktu_absen: new Date(),
        sekolah_id: sekolahId,
      },
      create: {
        jadwal_pelajaran_id: data.jadwal_pelajaran_id,
        peserta_didik_id: data.peserta_didik_id,
        tanggal: dateOnly,
        status: data.status,
        waktu_absen: new Date(),
        sekolah_id: sekolahId,
      },
    });
  }

  async createIzin(sekolahId: string, data: {
    peserta_didik_id?: string;
    ptk_id?: string;
    jenis: number; // 1=Terlambat, 2=Keluar, 3=Pulang Awal, 4=Tidak Masuk, 5=Sakit, 6=Alpha, 7=Hadir
    tanggal: string;
    keterangan: string;
    jam_keluar?: string;
    jam_kembali_estimasi?: string;
  }) {
    const dateObj = new Date(data.tanggal);
    const dateOnly = new Date(dateObj.toISOString().split('T')[0]);
    const currentTimestamp = new Date();

    // Cek Hari Libur Terjadwal
    const holiday = await this.checkHoliday(sekolahId, dateOnly);
    if (holiday) {
      throw new BadRequestException(`Hari ini sekolah sedang libur: ${holiday.nama}. Tidak dapat mengajukan izin.`);
    }

    // Cek Hari Libur Mingguan berdasarkan activeDays sekolah
    const activeSchedule = await this.prisma.jenisJadwal.findFirst({
      where: { sekolah_id: sekolahId, aktif: true },
      include: {
        pengaturan_hari: {
          where: { aktif: true },
          select: { hari: true },
        },
      },
    });
    const activeDays = activeSchedule?.pengaturan_hari.map(h => h.hari) || [1, 2, 3, 4, 5, 6];
    const dayOfWeek = dateOnly.getDay() === 0 ? 7 : dateOnly.getDay(); // 1=Mon, ..., 7=Sun
    if (!activeDays.includes(dayOfWeek)) {
      throw new BadRequestException('Hari ini merupakan libur akhir pekan. Tidak dapat mengajukan izin.');
    }

    // Validasi: Izin Keluar (jenis = 2) & Izin Pulang Awal (jenis = 3) mewajibkan subjek sudah presensi masuk / terlambat hari ini
    if (data.jenis === 2 || data.jenis === 3) {
      if (data.peserta_didik_id) {
        const checkin = await this.prisma.presensiPesertaDidik.findUnique({
          where: {
            peserta_didik_id_tanggal: {
              peserta_didik_id: data.peserta_didik_id,
              tanggal: dateOnly,
            },
          },
        });
        if (!checkin || !checkin.jam_masuk) {
          throw new BadRequestException('Subjek belum melakukan presensi masuk hari ini. Tidak dapat memberikan izin.');
        }
      } else if (data.ptk_id) {
        const checkin = await this.prisma.presensiGtk.findUnique({
          where: {
            ptk_id_tanggal: {
              ptk_id: data.ptk_id,
              tanggal: dateOnly,
            },
          },
        });
        if (!checkin || !checkin.jam_masuk) {
          throw new BadRequestException('Subjek belum melakukan presensi masuk hari ini. Tidak dapat memberikan izin.');
        }
      }
    }

    let izin: any;

    // Helper to parse time string HH:mm
    const parseTime = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      const d = new Date(dateOnly);
      d.setHours(h, m, 0, 0);
      return d;
    };

    const jamKeluarDate = data.jam_keluar ? parseTime(data.jam_keluar) : currentTimestamp;
    const jamKembaliEstimasiDate = data.jam_kembali_estimasi ? parseTime(data.jam_kembali_estimasi) : null;

    // 1. Buat / update record Izin
    if (data.jenis === 2) {
      // Cari izin keluar hari ini yang belum kembali
      const activeIzin = await this.prisma.izin.findFirst({
        where: {
          sekolah_id: sekolahId,
          peserta_didik_id: data.peserta_didik_id || null,
          ptk_id: data.ptk_id || null,
          jenis: 2,
          tanggal: dateOnly,
          jam_kembali: null,
        },
      });

      if (activeIzin) {
        // Update jam_kembali
        izin = await this.prisma.izin.update({
          where: { izin_id: activeIzin.izin_id },
          data: {
            jam_kembali: currentTimestamp,
            keterangan: data.keterangan || activeIzin.keterangan,
          },
        });
      } else {
        // Buat baru dengan jam_keluar
        izin = await this.prisma.izin.create({
          data: {
            sekolah_id: sekolahId,
            peserta_didik_id: data.peserta_didik_id,
            ptk_id: data.ptk_id,
            jenis: 2,
            tanggal: dateOnly,
            keterangan: data.keterangan,
            jam_keluar: jamKeluarDate,
            jam_kembali_estimasi: jamKembaliEstimasiDate,
            disetujui: false,
          },
        });
      }
    } else if (data.jenis === 7) {
      // Hadir: hapus record izin biasa jika ada
      await this.prisma.izin.deleteMany({
        where: {
          sekolah_id: sekolahId,
          peserta_didik_id: data.peserta_didik_id || null,
          ptk_id: data.ptk_id || null,
          tanggal: dateOnly,
          jenis: { not: 2 }, // kecuali izin keluar
        },
      });
      izin = null;
    } else {
      // Buat atau update record Izin biasa untuk mencegah duplikasi
      const existingIzin = await this.prisma.izin.findFirst({
        where: {
          sekolah_id: sekolahId,
          peserta_didik_id: data.peserta_didik_id || null,
          ptk_id: data.ptk_id || null,
          tanggal: dateOnly,
          jenis: { not: 2 }, // Kecuali izin keluar
        },
      });

      if (existingIzin) {
        izin = await this.prisma.izin.update({
          where: { izin_id: existingIzin.izin_id },
          data: {
            jenis: data.jenis,
            keterangan: data.keterangan,
          },
        });
      } else {
        izin = await this.prisma.izin.create({
          data: {
            sekolah_id: sekolahId,
            peserta_didik_id: data.peserta_didik_id,
            ptk_id: data.ptk_id,
            jenis: data.jenis,
            tanggal: dateOnly,
            keterangan: data.keterangan,
          },
        });
      }
    }

    // 2. Jika jenisnya adalah Terlambat (jenis = 1), sinkronisasi ke presensi masuk sebagai Terlambat
    if (data.jenis === 1) {
      if (data.peserta_didik_id) {
        await this.prisma.presensiPesertaDidik.upsert({
          where: {
            peserta_didik_id_tanggal: {
              peserta_didik_id: data.peserta_didik_id,
              tanggal: dateOnly,
            },
          },
          update: {
            jam_masuk: currentTimestamp,
            status_masuk: 2, // 2 = Terlambat
            sekolah_id: sekolahId,
          },
          create: {
            peserta_didik_id: data.peserta_didik_id,
            tanggal: dateOnly,
            jam_masuk: currentTimestamp,
            status_masuk: 2, // 2 = Terlambat
            sekolah_id: sekolahId,
          },
        });
      } else if (data.ptk_id) {
        await this.prisma.presensiGtk.upsert({
          where: {
            ptk_id_tanggal: {
              ptk_id: data.ptk_id,
              tanggal: dateOnly,
            },
          },
          update: {
            jam_masuk: currentTimestamp,
            status_masuk: 2, // 2 = Terlambat
            sekolah_id: sekolahId,
          },
          create: {
            ptk_id: data.ptk_id,
            tanggal: dateOnly,
            jam_masuk: currentTimestamp,
            status_masuk: 2, // 2 = Terlambat
            sekolah_id: sekolahId,
          },
        });
      }
    }

    // 3. Jika jenisnya adalah Pulang Awal (jenis = 3), sinkronisasi ke presensi pulang sebagai Pulang Awal
    if (data.jenis === 3) {
      if (data.peserta_didik_id) {
        await this.prisma.presensiPesertaDidik.upsert({
          where: {
            peserta_didik_id_tanggal: {
              peserta_didik_id: data.peserta_didik_id,
              tanggal: dateOnly,
            },
          },
          update: {
            jam_pulang: currentTimestamp,
            status_pulang: 2, // 2 = Pulang Awal
            sekolah_id: sekolahId,
          },
          create: {
            peserta_didik_id: data.peserta_didik_id,
            tanggal: dateOnly,
            jam_pulang: currentTimestamp,
            status_pulang: 2, // 2 = Pulang Awal
            sekolah_id: sekolahId,
          },
        });
      } else if (data.ptk_id) {
        await this.prisma.presensiGtk.upsert({
          where: {
            ptk_id_tanggal: {
              ptk_id: data.ptk_id,
              tanggal: dateOnly,
            },
          },
          update: {
            jam_pulang: currentTimestamp,
            status_pulang: 2, // 2 = Pulang Awal
            sekolah_id: sekolahId,
          },
          create: {
            ptk_id: data.ptk_id,
            tanggal: dateOnly,
            jam_pulang: currentTimestamp,
            status_pulang: 2, // 2 = Pulang Awal
            sekolah_id: sekolahId,
          },
        });
      }
    }

    // 4. Jika jenisnya adalah Tidak Masuk (4), Sakit (5), Alpha (6), atau Hadir (7), tandai di presensi agar sinkron
    if (data.jenis === 4 || data.jenis === 5 || data.jenis === 6 || data.jenis === 7) {
      const statusAbsen = data.jenis === 4 ? 3 : (data.jenis === 5 ? 4 : (data.jenis === 6 ? 5 : 1)); // Di PresensiPesertaDidik: 3=Izin, 4=Sakit, 5=Alpha, 1=Hadir
      
      if (data.peserta_didik_id) {
        await this.prisma.presensiPesertaDidik.upsert({
          where: {
            peserta_didik_id_tanggal: {
              peserta_didik_id: data.peserta_didik_id,
              tanggal: dateOnly,
            },
          },
          update: {
            status_masuk: statusAbsen,
            jam_masuk: data.jenis === 7 ? currentTimestamp : null,
            sekolah_id: sekolahId,
          },
          create: {
            peserta_didik_id: data.peserta_didik_id,
            tanggal: dateOnly,
            status_masuk: statusAbsen,
            jam_masuk: data.jenis === 7 ? currentTimestamp : null,
            sekolah_id: sekolahId,
          },
        });
      } else if (data.ptk_id) {
        await this.prisma.presensiGtk.upsert({
          where: {
            ptk_id_tanggal: {
              ptk_id: data.ptk_id,
              tanggal: dateOnly,
            },
          },
          update: {
            status_masuk: statusAbsen,
            jam_masuk: data.jenis === 7 ? currentTimestamp : null,
            sekolah_id: sekolahId,
          },
          create: {
            ptk_id: data.ptk_id,
            tanggal: dateOnly,
            status_masuk: statusAbsen,
            jam_masuk: data.jenis === 7 ? currentTimestamp : null,
            sekolah_id: sekolahId,
          },
        });
      }
    }

    return izin;
  }

  // =====================
  // QR SCAN & CONFIG
  // =====================

  async getAttendanceConfig(sekolahId: string) {
    const sekolah = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: sekolahId },
      select: { nama: true, sekolah_id: true },
    });
    if (!sekolah) throw new NotFoundException('Sekolah tidak ditemukan');

    const appKey = await this.prisma.appKey.findUnique({
      where: { sekolah_id: sekolahId },
    });

    return {
      sekolah_nama: sekolah.nama,
      sekolah_id: sekolah.sekolah_id,
      base_url: appKey?.domain || '',
    };
  }

  async findUserByQr(sekolahId: string, token: string) {
    const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    const dateOnly = new Date(wibDate.toISOString().split('T')[0]);

    // 1. Cari di Peserta Didik
    const pd = await this.prisma.pesertaDidik.findFirst({
      where: { sekolah_id: sekolahId, qr_token: token },
      select: {
        peserta_didik_id: true,
        nama: true,
        nisn: true,
        rombongan_belajar_id: true,
        rombongan_belajar: {
          select: {
            nama: true,
          }
        },
        foto: true,
      },
    });

    if (pd) {
      const activeIzinKeluar = await this.prisma.izin.findFirst({
        where: {
          sekolah_id: sekolahId,
          peserta_didik_id: pd.peserta_didik_id,
          jenis: 2,
          tanggal: dateOnly,
          jam_kembali: null,
        },
      });
      const pdMapped = {
        ...pd,
        nama_rombel: pd.rombongan_belajar?.nama || '',
      };
      return { type: 'pd', data: pdMapped, activeIzinKeluar };
    }

    // 2. Cari di GTK
    const rawGtk = await this.prisma.gtk.findFirst({
      where: { sekolah_id: sekolahId, qr_token: token },
      select: {
        ptk_id: true,
        nama: true,
        nuptk: true,
        foto: true,
        jenis_ptk: {
          select: { jenis_ptk: true }
        },
      },
    });

    if (rawGtk) {
      const { jenis_ptk, ...gtkRest } = rawGtk;
      const gtk = {
        ...gtkRest,
        jenis_ptk_id_str: jenis_ptk?.jenis_ptk || null
      };

      const activeIzinKeluar = await this.prisma.izin.findFirst({
        where: {
          sekolah_id: sekolahId,
          ptk_id: gtk.ptk_id,
          jenis: 2,
          tanggal: dateOnly,
          jam_kembali: null,
        },
      });
      return { type: 'gtk', data: gtk, activeIzinKeluar };
    }

    throw new NotFoundException('Data QR Token tidak ditemukan');
  }

  async scanQr(sekolahId: string, token: string, latitude?: number, longitude?: number) {
    const sekolah = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: sekolahId },
      select: { lintang: true, bujur: true, radius: true },
    });

    if (sekolah && sekolah.lintang && sekolah.bujur && sekolah.radius !== null && sekolah.radius > 0) {
      if (latitude === undefined || longitude === undefined || latitude === null || longitude === null) {
        throw new BadRequestException(
          'Lokasi perangkat tidak terdeteksi. Silakan aktifkan GPS/Layanan Lokasi pada browser.',
        );
      }

      const distance = this.getDistance(
        Number(latitude),
        Number(longitude),
        Number(sekolah.lintang),
        Number(sekolah.bujur),
      );

      if (distance > sekolah.radius) {
        throw new BadRequestException(
          `Presensi gagal. Anda berada di luar area scan sekolah. Jarak Anda: ${Math.round(distance)} meter, Radius maksimal: ${sekolah.radius} meter.`,
        );
      }
    }

    const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    const dateOnly = new Date(wibDate.toISOString().split('T')[0]);

    // 1. Cari di Peserta Didik
    const pd = await this.prisma.pesertaDidik.findFirst({
      where: { sekolah_id: sekolahId, qr_token: token },
      include: { rombongan_belajar: { select: { nama: true } } },
    });

    if (pd) {
      const existing = await this.prisma.presensiPesertaDidik.findUnique({
        where: {
          peserta_didik_id_tanggal: {
            peserta_didik_id: pd.peserta_didik_id,
            tanggal: dateOnly,
          },
        },
      });

      if (existing && existing.jam_masuk && existing.jam_pulang) {
        throw new BadRequestException('Anda sudah melakukan presensi masuk dan pulang hari ini.');
      }

      const tipe = existing && existing.jam_masuk ? 'pulang' : 'masuk';

      if (tipe === 'pulang') {
        const activeIzin = await this.prisma.izin.findFirst({
          where: {
            sekolah_id: sekolahId,
            peserta_didik_id: pd.peserta_didik_id,
            jenis: 2,
            tanggal: dateOnly,
          },
          orderBy: { created_at: 'desc' },
        });

        if (activeIzin) {
          const now = new Date();
          const isReturned = activeIzin.jam_kembali !== null;
          const isLate = activeIzin.jam_kembali_estimasi && (
            isReturned
              ? activeIzin.jam_kembali > activeIzin.jam_kembali_estimasi
              : now > activeIzin.jam_kembali_estimasi
          );

          if (!isReturned) {
            if (isLate) {
              if (!activeIzin.disetujui) {
                throw new BadRequestException('Anda tidak bisa presensi pulang karena terlambat kembali dari izin keluar. Harap lapor ke Guru Piket.');
              }
            } else {
              if (!activeIzin.disetujui) {
                throw new BadRequestException('Anda tidak bisa presensi pulang karena belum dicatat kembali dari izin keluar. Harap lapor ke Guru Piket.');
              }
            }
          } else {
            if (isLate && !activeIzin.disetujui) {
              throw new BadRequestException('Anda tidak bisa presensi pulang karena terlambat kembali dari izin keluar. Harap lapor ke Guru Piket.');
            }
          }
        }
      }
      const attendance = await this.presensiPesertaDidik(sekolahId, {
        peserta_didik_id: pd.peserta_didik_id,
        waktu: new Date().toISOString(),
        tipe,
      });

      return {
        ...attendance,
        peserta_didik: {
          nama: pd.nama,
          foto: pd.foto,
          nisn: pd.nisn,
          rombongan_belajar_id: pd.rombongan_belajar_id,
          nama_rombel: pd.rombongan_belajar?.nama || null,
        },
      };
    }

    // 2. Cari di GTK
    const gtk = await this.prisma.gtk.findFirst({
      where: { sekolah_id: sekolahId, qr_token: token },
      include: {
        jenis_ptk: true,
      }
    });

    if (gtk) {
      const existing = await this.prisma.presensiGtk.findUnique({
        where: {
          ptk_id_tanggal: {
            ptk_id: gtk.ptk_id,
            tanggal: dateOnly,
          },
        },
      });

      if (existing && existing.jam_masuk && existing.jam_pulang) {
        throw new BadRequestException('Anda sudah melakukan presensi masuk dan pulang hari ini.');
      }

      const tipe = existing && existing.jam_masuk ? 'pulang' : 'masuk';

      if (tipe === 'pulang') {
        const activeIzin = await this.prisma.izin.findFirst({
          where: {
            sekolah_id: sekolahId,
            ptk_id: gtk.ptk_id,
            jenis: 2,
            tanggal: dateOnly,
          },
          orderBy: { created_at: 'desc' },
        });

        if (activeIzin) {
          const now = new Date();
          const isReturned = activeIzin.jam_kembali !== null;
          const isLate = activeIzin.jam_kembali_estimasi && (
            isReturned
              ? activeIzin.jam_kembali > activeIzin.jam_kembali_estimasi
              : now > activeIzin.jam_kembali_estimasi
          );

          if (!isReturned) {
            if (isLate) {
              if (!activeIzin.disetujui) {
                throw new BadRequestException('Anda tidak bisa presensi pulang karena terlambat kembali dari izin keluar. Harap lapor ke Guru Piket.');
              }
            } else {
              if (!activeIzin.disetujui) {
                throw new BadRequestException('Anda tidak bisa presensi pulang karena belum dicatat kembali dari izin keluar. Harap lapor ke Guru Piket.');
              }
            }
          } else {
            if (isLate && !activeIzin.disetujui) {
              throw new BadRequestException('Anda tidak bisa presensi pulang karena terlambat kembali dari izin keluar. Harap lapor ke Guru Piket.');
            }
          }
        }
      }

      const attendance = await this.presensiGtk(sekolahId, {
        ptk_id: gtk.ptk_id,
        waktu: new Date().toISOString(),
        tipe,
      });

      return {
        ...attendance,
        gtk: {
          nama: gtk.nama,
          foto: gtk.foto,
          nuptk: gtk.nuptk,
          jenis_ptk_id_str: gtk.jenis_ptk?.jenis_ptk || null,
        },
      };
    }

    throw new NotFoundException('Data QR Token tidak dikenali atau tidak terdaftar di sekolah ini');
  }

  // =====================
  // GET REKAP PRESENSI
  // =====================

  async getPresensiPesertaDidik(sekolahId: string, dateStr?: string) {
    let dateOnly: Date;
    if (dateStr) {
      dateOnly = new Date(new Date(dateStr).toISOString().split('T')[0]);
    } else {
      const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
      dateOnly = new Date(wibDate.toISOString().split('T')[0]);
    }

    const students = await this.prisma.pesertaDidik.findMany({
      where: {
        sekolah_id: sekolahId,
        status: 'Aktif',
        OR: [
          {
            rombongan_belajar: {
              jenis_rombel: 1,
            }
          },
          {
            anggota_rombel: {
              some: {
                soft_delete: 0,
                rombongan_belajar: {
                  jenis_rombel: 1,
                }
              }
            }
          }
        ]
      },
      select: {
        peserta_didik_id: true,
        nama: true,
        nisn: true,
        rombongan_belajar: {
          select: {
            nama: true,
          }
        },
        anggota_rombel: {
          where: {
            soft_delete: 0,
            rombongan_belajar: {
              jenis_rombel: 1,
            }
          },
          take: 1,
          select: {
            rombongan_belajar: {
              select: {
                nama: true
              }
            }
          }
        },
        foto: true,
      },
      orderBy: {
        nama: 'asc',
      },
    });

    const attendance = await this.prisma.presensiPesertaDidik.findMany({
      where: {
        sekolah_id: sekolahId,
        tanggal: dateOnly,
      },
    });

    const izins = await this.prisma.izin.findMany({
      where: {
        sekolah_id: sekolahId,
        tanggal: dateOnly,
      },
    });

    const attendanceMap = new Map(attendance.map(a => [a.peserta_didik_id, a]));
    const izinMap = new Map(
      izins
        .filter(i => i.peserta_didik_id)
        .map(i => [i.peserta_didik_id!, i])
    );

    return students.map((student: any) => {
      const att = attendanceMap.get(student.peserta_didik_id);
      const iz = izinMap.get(student.peserta_didik_id);
      return {
        ...student,
        nama_rombel: student.rombongan_belajar?.nama || student.anggota_rombel?.[0]?.rombongan_belajar?.nama || '',
        presensi: att || null,
        izin: iz || null,
      };
    });
  }

  async getPresensiGtk(sekolahId: string, dateStr?: string) {
    let dateOnly: Date;
    if (dateStr) {
      dateOnly = new Date(new Date(dateStr).toISOString().split('T')[0]);
    } else {
      const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
      dateOnly = new Date(wibDate.toISOString().split('T')[0]);
    }

    const gtks = await this.prisma.gtk.findMany({
      where: {
        sekolah_id: sekolahId,
        status: 'Aktif',
      },
      select: {
        ptk_id: true,
        nama: true,
        nuptk: true,
        foto: true,
        jenis_ptk: {
          select: { jenis_ptk: true }
        },
      },
      orderBy: {
        nama: 'asc',
      },
    });

    const attendance = await this.prisma.presensiGtk.findMany({
      where: {
        sekolah_id: sekolahId,
        tanggal: dateOnly,
      },
    });

    const izins = await this.prisma.izin.findMany({
      where: {
        sekolah_id: sekolahId,
        tanggal: dateOnly,
      },
    });

    const attendanceMap = new Map(attendance.map(a => [a.ptk_id, a]));
    const izinMap = new Map(
      izins
        .filter(i => i.ptk_id)
        .map(i => [i.ptk_id!, i])
    );

    return gtks.map(g => {
      const att = attendanceMap.get(g.ptk_id);
      const iz = izinMap.get(g.ptk_id);
      const { jenis_ptk, ...gtkRest } = g;
      return {
        ...gtkRest,
        jenis_ptk_id_str: jenis_ptk?.jenis_ptk || null,
        presensi: att || null,
        izin: iz || null,
      };
    });
  }

  async getRekapPeriodik(sekolahId: string, rombel: string, startStr: string, endStr: string, tipe: 'pd' | 'gtk' = 'pd') {
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    // Get active schedule days configurations
    const activeSchedule = await this.prisma.jenisJadwal.findFirst({
      where: { sekolah_id: sekolahId, aktif: true },
      include: {
        pengaturan_hari: {
          where: { aktif: true },
          select: { hari: true },
        },
      },
    });

    const activeDays = activeSchedule?.pengaturan_hari.map(h => h.hari) || [1, 2, 3, 4, 5, 6]; // Default: Mon-Sat

    const holidays = await this.prisma.hariLibur.findMany({
      where: {
        sekolah_id: sekolahId,
        aktif: true,
        tanggal_mulai: { lte: endDate },
        tanggal_selesai: { gte: startDate },
      },
      select: {
        nama: true,
        tanggal_mulai: true,
        tanggal_selesai: true,
      },
    });

    let data: any[] = [];

    if (tipe === 'gtk') {
      const gtks = await this.prisma.gtk.findMany({
        where: {
          sekolah_id: sekolahId,
          status: 'Aktif',
        },
        select: {
          ptk_id: true,
          nama: true,
          nuptk: true,
        },
        orderBy: {
          nama: 'asc',
        },
      });

      const attendances = await this.prisma.presensiGtk.findMany({
        where: {
          sekolah_id: sekolahId,
          tanggal: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const izins = await this.prisma.izin.findMany({
        where: {
          sekolah_id: sekolahId,
          tanggal: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      data = gtks.map((gtk) => {
        const gtkAtts = attendances.filter(a => a.ptk_id === gtk.ptk_id);
        const gtkIzins = izins.filter(i => i.ptk_id === gtk.ptk_id);

        return {
          peserta_didik_id: gtk.ptk_id,
          nama: gtk.nama,
          nisn: gtk.nuptk || '-',
          presensi: gtkAtts,
          izin: gtkIzins,
        };
      });
    } else {
      const students = await this.prisma.pesertaDidik.findMany({
        where: {
          sekolah_id: sekolahId,
          status: 'Aktif',
          OR: [
            {
              rombongan_belajar: {
                nama: rombel,
              }
            },
            {
              anggota_rombel: {
                some: {
                  soft_delete: 0,
                  rombongan_belajar: {
                    nama: rombel,
                  }
                }
              }
            }
          ]
        },
        select: {
          peserta_didik_id: true,
          nama: true,
          nisn: true,
        },
        orderBy: {
          nama: 'asc',
        },
      });

      const attendances = await this.prisma.presensiPesertaDidik.findMany({
        where: {
          sekolah_id: sekolahId,
          tanggal: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      const izins = await this.prisma.izin.findMany({
        where: {
          sekolah_id: sekolahId,
          tanggal: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      data = students.map((student) => {
        const studentAtts = attendances.filter(a => a.peserta_didik_id === student.peserta_didik_id);
        const studentIzins = izins.filter(i => i.peserta_didik_id === student.peserta_didik_id);

        return {
          ...student,
          presensi: studentAtts,
          izin: studentIzins,
        };
      });
    }

    return {
      data,
      holidays,
      activeDays,
    };
  }

  private getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Radius bumi dalam meter
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async getIzinKeluarHariIni(sekolahId: string, dateStr?: string) {
    let dateOnly: Date;
    if (dateStr) {
      dateOnly = new Date(new Date(dateStr).toISOString().split('T')[0]);
    } else {
      const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
      dateOnly = new Date(wibDate.toISOString().split('T')[0]);
    }

    const data = await this.prisma.izin.findMany({
      where: {
        sekolah_id: sekolahId,
        jenis: 2, // Keluar
        tanggal: dateOnly,
      },
      include: {
        peserta_didik: {
          select: {
            nama: true,
            rombongan_belajar: {
              select: {
                nama: true
              }
            },
            nisn: true,
          },
        },
        gtk: {
          select: {
            nama: true,
            nuptk: true,
            jenis_ptk: {
              select: { jenis_ptk: true }
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    return data.map((item: any) => {
      const formattedItem = {
        ...item,
        peserta_didik: item.peserta_didik ? {
          nama: item.peserta_didik.nama,
          nisn: item.peserta_didik.nisn,
          nama_rombel: item.peserta_didik.rombongan_belajar?.nama || ''
        } : null
      };

      if (item.gtk) {
        const { jenis_ptk, ...gtkRest } = item.gtk;
        return {
          ...formattedItem,
          gtk: {
            ...gtkRest,
            jenis_ptk_id_str: jenis_ptk?.jenis_ptk || null
          }
        };
      }
      return formattedItem;
    });
  }

  async catatKembali(sekolahId: string, izinId: string) {
    const izin = await this.prisma.izin.findFirst({
      where: { izin_id: izinId, sekolah_id: sekolahId },
    });
    if (!izin) throw new NotFoundException('Data izin tidak ditemukan');

    return this.prisma.izin.update({
      where: { izin_id: izinId },
      data: {
        jam_kembali: new Date(),
      },
    });
  }

  async setujuiIzin(sekolahId: string, izinId: string) {
    const izin = await this.prisma.izin.findFirst({
      where: { izin_id: izinId, sekolah_id: sekolahId },
    });
    if (!izin) throw new NotFoundException('Data izin tidak ditemukan');

    return this.prisma.izin.update({
      where: { izin_id: izinId },
      data: {
        disetujui: true,
      },
    });
  }

  async deleteIzin(sekolahId: string, izinId: string) {
    const izin = await this.prisma.izin.findFirst({
      where: { izin_id: izinId, sekolah_id: sekolahId },
    });
    if (!izin) throw new NotFoundException('Data izin tidak ditemukan');

    await this.prisma.izin.delete({
      where: { izin_id: izinId },
    });
    return { success: true };
  }
}
