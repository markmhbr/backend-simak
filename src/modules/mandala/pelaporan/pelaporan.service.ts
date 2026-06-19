import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { CreatePelaporanDto } from './dto/create-pelaporan.dto';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class PelaporanService {
  constructor(private prisma: PrismaService) {}

  // --- MANDALA (CADISDIK) METHODS ---

  async createPelaporan(cadisdikId: string, dto: CreatePelaporanDto) {
    return await this.prisma.$transaction(async (tx) => {
      const pelaporan = await tx.pelaporan.create({
        data: {
          cadisdik_id: cadisdikId,
          judul: dto.judul,
          deskripsi: dto.deskripsi,
          tanggal_mulai: dto.tanggal_mulai ? new Date(dto.tanggal_mulai) : null,
          tanggal_selesai: dto.tanggal_selesai ? new Date(dto.tanggal_selesai) : null,
        },
      });

      const pelaporanSekolahData = dto.sekolah_ids.map((sekolah_id) => ({
        pelaporan_id: pelaporan.pelaporan_id,
        sekolah_id,
      }));

      if (pelaporanSekolahData.length > 0) {
        await tx.pelaporanSekolah.createMany({
          data: pelaporanSekolahData,
          skipDuplicates: true,
        });
      }

      return pelaporan;
    });
  }

  async getListPelaporan(cadisdikId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    
    const [total, data] = await Promise.all([
      this.prisma.pelaporan.count({ where: { cadisdik_id: cadisdikId } }),
      this.prisma.pelaporan.findMany({
        where: { cadisdik_id: cadisdikId },
        include: {
          _count: {
            select: { pelaporan_sekolah: true }
          },
          pelaporan_sekolah: {
            include: {
              _count: {
                select: { pelaporan_dokumen: true }
              }
            }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      })
    ]);

    const formattedData = data.map(p => {
      const totalDokumen = p.pelaporan_sekolah.reduce((acc, curr) => acc + curr._count.pelaporan_dokumen, 0);
      return {
        pelaporan_id: p.pelaporan_id,
        judul: p.judul,
        tanggal_mulai: p.tanggal_mulai,
        tanggal_selesai: p.tanggal_selesai,
        jumlah_sekolah: p._count.pelaporan_sekolah,
        jumlah_dokumen: totalDokumen,
        aktif: p.aktif,
        created_at: p.created_at,
      };
    });

    return { total, data: formattedData };
  }

  async getDetailPelaporan(cadisdikId: string, pelaporanId: string) {
    const pelaporan = await this.prisma.pelaporan.findFirst({
      where: { pelaporan_id: pelaporanId, cadisdik_id: cadisdikId },
      include: {
        pelaporan_sekolah: {
          include: {
            _count: {
              select: { pelaporan_dokumen: true }
            }
          }
        }
      }
    });

    if (!pelaporan) throw new NotFoundException('Pelaporan tidak ditemukan');

    // N+1 mitigation: Fetch all sekolah details at once
    const sekolahIds = pelaporan.pelaporan_sekolah.map(ps => ps.sekolah_id);
    const sekolahData = await this.prisma.sekolah.findMany({
      where: { sekolah_id: { in: sekolahIds } },
      select: { sekolah_id: true, nama: true }
    });

    const sekolahMap = new Map(sekolahData.map(s => [s.sekolah_id, s.nama]));

    const daftarSekolah = pelaporan.pelaporan_sekolah.map(ps => ({
      pelaporan_sekolah_id: ps.pelaporan_sekolah_id,
      sekolah_id: ps.sekolah_id,
      nama_sekolah: sekolahMap.get(ps.sekolah_id) || 'Unknown',
      jumlah_dokumen: ps._count.pelaporan_dokumen,
    }));

    return {
      pelaporan_id: pelaporan.pelaporan_id,
      judul: pelaporan.judul,
      deskripsi: pelaporan.deskripsi,
      tanggal_mulai: pelaporan.tanggal_mulai,
      tanggal_selesai: pelaporan.tanggal_selesai,
      aktif: pelaporan.aktif,
      daftar_sekolah: daftarSekolah,
    };
  }

  async getDokumenSekolah(cadisdikId: string, pelaporanId: string, sekolahId: string) {
    const pelaporanSekolah = await this.prisma.pelaporanSekolah.findFirst({
      where: { 
        pelaporan_id: pelaporanId, 
        sekolah_id: sekolahId,
        pelaporan: { cadisdik_id: cadisdikId }
      },
      include: {
        pelaporan_dokumen: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!pelaporanSekolah) throw new NotFoundException('Data tidak ditemukan');

    const sekolah = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: sekolahId },
      select: { nama: true }
    });

    return {
      pelaporan_sekolah_id: pelaporanSekolah.pelaporan_sekolah_id,
      sekolah_id: sekolahId,
      nama_sekolah: sekolah?.nama || 'Unknown',
      dokumen: pelaporanSekolah.pelaporan_dokumen,
    };
  }

  // --- SIMAK (SEKOLAH) METHODS ---

  async getSimakListPelaporan(sekolahId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [total, pelaporanSekolahList] = await Promise.all([
      this.prisma.pelaporanSekolah.count({ where: { sekolah_id: sekolahId } }),
      this.prisma.pelaporanSekolah.findMany({
        where: { sekolah_id: sekolahId },
        include: {
          pelaporan: true,
          _count: {
            select: { pelaporan_dokumen: true }
          }
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      })
    ]);

    const formattedData = pelaporanSekolahList.map(ps => ({
      pelaporan_id: ps.pelaporan.pelaporan_id,
      judul: ps.pelaporan.judul,
      deskripsi: ps.pelaporan.deskripsi,
      tanggal_mulai: ps.pelaporan.tanggal_mulai,
      tanggal_selesai: ps.pelaporan.tanggal_selesai,
      aktif: ps.pelaporan.aktif,
      jumlah_dokumen: ps._count.pelaporan_dokumen,
    }));

    return { total, data: formattedData };
  }

  async getSimakDetailPelaporan(sekolahId: string, pelaporanId: string) {
    const pelaporanSekolah = await this.prisma.pelaporanSekolah.findFirst({
      where: { sekolah_id: sekolahId, pelaporan_id: pelaporanId },
      include: {
        pelaporan: true,
        pelaporan_dokumen: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    if (!pelaporanSekolah) throw new NotFoundException('Pelaporan tidak ditemukan');

    return {
      pelaporan_id: pelaporanSekolah.pelaporan.pelaporan_id,
      pelaporan_sekolah_id: pelaporanSekolah.pelaporan_sekolah_id,
      judul: pelaporanSekolah.pelaporan.judul,
      deskripsi: pelaporanSekolah.pelaporan.deskripsi,
      tanggal_mulai: pelaporanSekolah.pelaporan.tanggal_mulai,
      tanggal_selesai: pelaporanSekolah.pelaporan.tanggal_selesai,
      dokumen: pelaporanSekolah.pelaporan_dokumen,
    };
  }

  async uploadDokumenSimak(sekolahId: string, pelaporanId: string, files: Express.Multer.File[]) {
    const pelaporanSekolah = await this.prisma.pelaporanSekolah.findFirst({
      where: { sekolah_id: sekolahId, pelaporan_id: pelaporanId },
    });

    if (!pelaporanSekolah) throw new NotFoundException('Pelaporan tidak valid untuk sekolah ini');

    const uploadedDocs = [];
    const uploadDir = path.join(process.cwd(), 'storage', sekolahId, 'pelaporan', pelaporanId);
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      const allowedExts = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.zip', '.rar'];
      
      if (!allowedExts.includes(ext)) {
        throw new Error(`Format file ${file.originalname} tidak didukung`);
      }

      // Max size logic usually handled by multer, but we can double check
      if (file.size > 10 * 1024 * 1024) { // 10MB limit hardcoded as safeguard
        throw new Error(`File ${file.originalname} terlalu besar (Max 10MB)`);
      }

      const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(uploadDir, fileName);
      const relativeUrl = `/storage/${sekolahId}/pelaporan/${pelaporanId}/${fileName}`;

      fs.writeFileSync(filePath, file.buffer);

      const doc = await this.prisma.pelaporanDokumen.create({
        data: {
          pelaporan_sekolah_id: pelaporanSekolah.pelaporan_sekolah_id,
          nama_file: file.originalname,
          file_url: relativeUrl,
          ukuran_file: file.size,
        }
      });
      uploadedDocs.push(doc);
    }

    return uploadedDocs;
  }
}
