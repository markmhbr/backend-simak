import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MutasiPdService {
  constructor(private readonly prisma: PrismaService) {}

  async getReferenceJenisKeluar() {
    return this.prisma.jenis_keluar.findMany({
      where: {
        keluar_pd: 1, // Hanya yang berlaku untuk keluar siswa
      },
      select: {
        jenis_keluar_id: true,
        ket_keluar: true,
      },
    });
  }

  async getMutasiPdList(sekolahId: string) {
    return this.prisma.mutasiPd.findMany({
      where: { sekolah_id: sekolahId },
      include: {
        peserta_didik: {
          select: {
            nama: true,
            nisn: true,
            foto: true,
            rombongan_belajar: {
              select: {
                nama: true,
              },
            },
          },
        },
        jenis_keluar: {
          select: {
            ket_keluar: true,
          },
        },
        ptk: {
          select: {
            nama: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async createMutasiPd(
    sekolahId: string,
    data: {
      peserta_didik_id: string;
      jenis_keluar_id: string;
      alasan?: string;
    },
    ptkId: string | null,
    file?: Express.Multer.File,
  ) {
    const { saveDocument } = require('../../common/utils/upload.util');

    // 1. Validasi siswa terdaftar di sekolah yang sama
    const student = await this.prisma.pesertaDidik.findFirst({
      where: { peserta_didik_id: data.peserta_didik_id, sekolah_id: sekolahId },
    });
    if (!student) {
      throw new NotFoundException('Siswa tidak ditemukan atau tidak terdaftar di sekolah Anda.');
    }

    // 2. Validasi jenis keluar
    const jnsKeluar = await this.prisma.jenis_keluar.findUnique({
      where: { jenis_keluar_id: data.jenis_keluar_id },
    });
    if (!jnsKeluar) {
      throw new BadRequestException('Jenis keluar tidak valid.');
    }

    let fileUrl: string | null = null;

    // 3. Simpan berkas PDF jika dilampirkan
    if (file) {
      const fileExt = path.extname(file.originalname).toLowerCase();
      if (fileExt !== '.pdf') {
        throw new BadRequestException('Format dokumen bukti harus berupa PDF (.pdf).');
      }

      const destDir = path.join(process.cwd(), 'storage', sekolahId, 'siswa', data.peserta_didik_id, 'mutasi');
      const finalFileName = `bukti_mutasi_${Date.now()}.pdf`;

      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }

      const savedPath = saveDocument(file.buffer, destDir, finalFileName, 200 * 1024); // Batas 200KB
      const savedFileName = path.basename(savedPath);
      fileUrl = `/storage/${sekolahId}/siswa/${data.peserta_didik_id}/mutasi/${savedFileName}`;
    }

    // 4. Catat pengajuan mutasi dengan status 0 (Pending)
    return this.prisma.mutasiPd.create({
      data: {
        sekolah_id: sekolahId,
        peserta_didik_id: data.peserta_didik_id,
        jenis_keluar_id: data.jenis_keluar_id,
        ptk_id: ptkId,
        alasan: data.alasan || null,
        bukti: fileUrl,
        status: 0,
      },
    });
  }

  async approveMutasiPd(sekolahId: string, mutasiId: string) {
    const mutasi = await this.prisma.mutasiPd.findFirst({
      where: { mutasi_id: mutasiId, sekolah_id: sekolahId },
      include: { jenis_keluar: true },
    });
    if (!mutasi) {
      throw new NotFoundException('Pengajuan mutasi tidak ditemukan.');
    }
    if (mutasi.status !== 0) {
      throw new BadRequestException('Pengajuan mutasi sudah diproses sebelumnya.');
    }

    // Tandai pengajuan disetujui (status: 1)
    const updatedMutasi = await this.prisma.mutasiPd.update({
      where: { mutasi_id: mutasiId },
      data: { status: 1 },
    });

    return updatedMutasi;
  }

  async rejectMutasiPd(sekolahId: string, mutasiId: string, alasanTolak: string) {
    if (!alasanTolak) {
      throw new BadRequestException('Alasan penolakan wajib disertakan.');
    }

    const mutasi = await this.prisma.mutasiPd.findFirst({
      where: { mutasi_id: mutasiId, sekolah_id: sekolahId },
    });
    if (!mutasi) {
      throw new NotFoundException('Pengajuan mutasi tidak ditemukan.');
    }
    if (mutasi.status !== 0) {
      throw new BadRequestException('Pengajuan mutasi sudah diproses sebelumnya.');
    }

    // Tandai pengajuan ditolak (status: 2) dan simpan alasannya
    return this.prisma.mutasiPd.update({
      where: { mutasi_id: mutasiId },
      data: {
        status: 2,
        alasan_tolak: alasanTolak,
      },
    });
  }
}
