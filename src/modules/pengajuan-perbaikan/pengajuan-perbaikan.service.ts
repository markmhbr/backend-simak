import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class PengajuanPerbaikanService {
  constructor(private readonly prisma: PrismaService) {}

  async buatPengajuan(sekolahId: string, payload: {
    ptk_id?: string;
    peserta_didik_id?: string;
    tipe: 'GTK' | 'SISWA';
    perubahan: any;
  }) {
    if (!payload.tipe || !['GTK', 'SISWA'].includes(payload.tipe)) {
      throw new BadRequestException('Tipe pengajuan tidak valid. Harus GTK atau SISWA.');
    }

    if (payload.tipe === 'GTK' && !payload.ptk_id) {
      throw new BadRequestException('ptk_id harus diisi untuk tipe pengajuan GTK.');
    }

    // Check if school has defined submission date limits
    const settings = await this.prisma.pengaturanUmum.findUnique({
      where: { sekolah_id: sekolahId },
    });

    if (!settings || !settings.waktu_mulai_pengajuan || !settings.waktu_sampai_pengajuan) {
      throw new BadRequestException(
        'Pengajuan perbaikan belum dibuka oleh sekolah (waktu pengajuan belum diatur).',
      );
    }

    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const currentDateStr = formatter.format(now); // "YYYY-MM-DD"

    const start = settings.waktu_mulai_pengajuan;
    const end = settings.waktu_sampai_pengajuan;

    if (currentDateStr < start || currentDateStr > end) {
      throw new BadRequestException(
        `Pengajuan perbaikan ditutup. Pengajuan hanya diperbolehkan dari tanggal ${start} s.d ${end}. Saat ini tanggal ${currentDateStr}.`,
      );
    }

    return this.prisma.pengajuanPerbaikan.create({
      data: {
        sekolah_id: sekolahId,
        ptk_id: payload.ptk_id || null,
        peserta_didik_id: payload.peserta_didik_id || null,
        tipe: payload.tipe,
        perubahan: payload.perubahan,
        status: 'PENDING',
      },
    });
  }

  async dapatkanDaftar(sekolahId: string) {
    const list = await this.prisma.pengajuanPerbaikan.findMany({
      where: {
        sekolah_id: sekolahId,
        status: 'PENDING',
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const enrichedList = await Promise.all(list.map(async (item) => {
      let nama = 'Unknown';
      if (item.tipe === 'GTK' && item.ptk_id) {
        const ptk = await this.prisma.gtk.findUnique({
          where: { ptk_id: item.ptk_id },
          select: { nama: true }
        });
        if (ptk) nama = ptk.nama;
      } else if (item.tipe === 'SISWA' && item.peserta_didik_id) {
        const pd = await this.prisma.pesertaDidik.findUnique({
          where: { peserta_didik_id: item.peserta_didik_id },
          select: { nama: true }
        });
        if (pd) nama = pd.nama;
      }
      return {
        ...item,
        nama,
      };
    }));

    return enrichedList;
  }

  async setujuiPengajuan(sekolahId: string, id: string) {
    const pengajuan = await this.prisma.pengajuanPerbaikan.findFirst({
      where: { id, sekolah_id: sekolahId },
    });

    if (!pengajuan) {
      throw new NotFoundException('Data pengajuan tidak ditemukan.');
    }

    const perubahan = pengajuan.perubahan as any;
    const updateData: any = {};

    // Ambil nilai yang diajukan
    for (const key in perubahan) {
      if (perubahan[key] && perubahan[key].diajukan !== undefined) {
        updateData[key] = perubahan[key].diajukan;
      }
    }

    if (pengajuan.tipe === 'GTK') {
      await this.prisma.gtk.update({
        where: { ptk_id: pengajuan.ptk_id },
        data: updateData,
      });
    } else if (pengajuan.tipe === 'SISWA') {
      await this.prisma.pesertaDidik.update({
        where: { peserta_didik_id: pengajuan.peserta_didik_id },
        data: updateData,
      });
    }

    // Ubah status pengajuan menjadi 'APPROVED' alih-alih menghapusnya
    await this.prisma.pengajuanPerbaikan.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    return { status: 'success', message: 'Pengajuan disetujui, data diperbarui, dan status diubah menjadi APPROVED.' };
  }

  async tolakPengajuan(sekolahId: string, id: string) {
    const pengajuan = await this.prisma.pengajuanPerbaikan.findFirst({
      where: { id, sekolah_id: sekolahId },
    });

    if (!pengajuan) {
      throw new NotFoundException('Data pengajuan tidak ditemukan.');
    }

    await this.prisma.pengajuanPerbaikan.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    return { status: 'success', message: 'Pengajuan ditolak dan status diubah menjadi REJECTED.' };
  }

  async dapatkanPerbaikanDisetujui(sekolahId: string) {
    const list = await this.prisma.pengajuanPerbaikan.findMany({
      where: {
        sekolah_id: sekolahId,
        status: 'APPROVED',
      },
      orderBy: {
        updated_at: 'asc',
      },
    });

    return list.map((item) => {
      const perubahan = item.perubahan as any;
      const updates: any = {};
      
      for (const key in perubahan) {
        if (perubahan[key] && perubahan[key].diajukan !== undefined) {
          updates[key] = perubahan[key].diajukan;
        }
      }

      if (item.tipe === 'GTK') {
        return {
          id: item.id,
          sekolah_id: item.sekolah_id,
          tipe: item.tipe,
          ptk_id: item.ptk_id,
          updates,
          updated_at: item.updated_at,
        };
      } else {
        return {
          id: item.id,
          sekolah_id: item.sekolah_id,
          tipe: item.tipe,
          peserta_didik_id: item.peserta_didik_id,
          updates,
          updated_at: item.updated_at,
        };
      }
    });
  }

  async clearPerbaikanDisetujui(sekolahId: string, ids?: string[]) {
    if (ids && ids.length > 0) {
      await this.prisma.pengajuanPerbaikan.deleteMany({
        where: {
          sekolah_id: sekolahId,
          status: 'APPROVED',
          id: { in: ids },
        },
      });
    } else {
      await this.prisma.pengajuanPerbaikan.deleteMany({
        where: {
          sekolah_id: sekolahId,
          status: 'APPROVED',
        },
      });
    }
    return { status: 'success', message: 'Log perbaikan disetujui berhasil dibersihkan.' };
  }
}
