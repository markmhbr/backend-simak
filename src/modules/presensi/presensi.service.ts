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

    // 2. Ambil Jadwal Aktif
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

    const dayConfig = await this.getActiveSchedule(sekolahId, dayOfWeek);

    const currentTimeMinutes = wibDate.getUTCHours() * 60 + wibDate.getUTCMinutes();
    const configInMinutes = dayConfig.jam_masuk.getUTCHours() * 60 + dayConfig.jam_masuk.getUTCMinutes();
    const configOutMinutes = dayConfig.jam_pulang.getUTCHours() * 60 + dayConfig.jam_pulang.getUTCMinutes();

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
    jenis: number; // 1=Terlambat, 2=Keluar, 3=Pulang Awal, 4=Tidak Masuk, 5=Sakit
    tanggal: string;
    keterangan: string;
  }) {
    const dateObj = new Date(data.tanggal);
    const dateOnly = new Date(dateObj.toISOString().split('T')[0]);
    const currentTimestamp = new Date();

    let izin: any;

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
            jam_keluar: currentTimestamp,
          },
        });
      }
    } else {
      // Buat record Izin biasa
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

    // 4. Jika jenisnya adalah Tidak Masuk (4) atau Sakit (5), tandai di presensi agar sinkron
    if (data.jenis === 4 || data.jenis === 5) {
      const statusAbsen = data.jenis === 4 ? 3 : 4; // Di PresensiPesertaDidik: 3=Izin, 4=Sakit
      
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
            sekolah_id: sekolahId,
          },
          create: {
            peserta_didik_id: data.peserta_didik_id,
            tanggal: dateOnly,
            status_masuk: statusAbsen,
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
            sekolah_id: sekolahId,
          },
          create: {
            ptk_id: data.ptk_id,
            tanggal: dateOnly,
            status_masuk: statusAbsen,
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
        nama_rombel: true,
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
      return { type: 'pd', data: pd, activeIzinKeluar };
    }

    // 2. Cari di GTK
    const gtk = await this.prisma.gtk.findFirst({
      where: { sekolah_id: sekolahId, qr_token: token },
      select: {
        ptk_id: true,
        nama: true,
        nuptk: true,
        foto: true,
        jenis_ptk_id_str: true,
      },
    });

    if (gtk) {
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

  async scanQr(sekolahId: string, token: string) {
    const wibDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    const dateOnly = new Date(wibDate.toISOString().split('T')[0]);

    // 1. Cari di Peserta Didik
    const pd = await this.prisma.pesertaDidik.findFirst({
      where: { sekolah_id: sekolahId, qr_token: token },
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
            jam_kembali: null,
          },
        });
        if (activeIzin) {
          throw new BadRequestException('Anda tidak bisa presensi pulang karena belum dicatat kembali dari izin keluar. Harap lapor ke Guru Piket.');
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
          nama_rombel: pd.nama_rombel,
        },
      };
    }

    // 2. Cari di GTK
    const gtk = await this.prisma.gtk.findFirst({
      where: { sekolah_id: sekolahId, qr_token: token },
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
            jam_kembali: null,
          },
        });
        if (activeIzin) {
          throw new BadRequestException('Anda tidak bisa presensi pulang karena belum dicatat kembali dari izin keluar. Harap lapor ke Guru Piket.');
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
          jenis_ptk_id_str: gtk.jenis_ptk_id_str,
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
      },
      select: {
        peserta_didik_id: true,
        nama: true,
        nisn: true,
        nama_rombel: true,
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

    const attendanceMap = new Map(attendance.map(a => [a.peserta_didik_id, a]));

    return students.map(student => {
      const att = attendanceMap.get(student.peserta_didik_id);
      return {
        ...student,
        presensi: att || null,
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
        jenis_ptk_id_str: true,
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

    const attendanceMap = new Map(attendance.map(a => [a.ptk_id, a]));

    return gtks.map(gtk => {
      const att = attendanceMap.get(gtk.ptk_id);
      return {
        ...gtk,
        presensi: att || null,
      };
    });
  }
}
