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

    if (payload.tipe === 'SISWA' && !payload.peserta_didik_id) {
      throw new BadRequestException('peserta_didik_id harus diisi untuk tipe pengajuan SISWA.');
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

    // Langsung hapus log pengajuan setelah di-approve
    await this.prisma.pengajuanPerbaikan.delete({
      where: { id },
    });

    return { status: 'success', message: 'Pengajuan disetujui, data diperbarui, dan log pengajuan dihapus.' };
  }

  async tolakPengajuan(sekolahId: string, id: string) {
    const pengajuan = await this.prisma.pengajuanPerbaikan.findFirst({
      where: { id, sekolah_id: sekolahId },
    });

    if (!pengajuan) {
      throw new NotFoundException('Data pengajuan tidak ditemukan.');
    }

    await this.prisma.pengajuanPerbaikan.delete({
      where: { id },
    });

    return { status: 'success', message: 'Pengajuan ditolak dan log pengajuan dihapus.' };
  }
}
