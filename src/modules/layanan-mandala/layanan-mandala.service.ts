import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { 
  CreateLayananDto, 
  CreateLayananSyaratDto, 
  CreatePermohonanLayananDto, 
  CreatePermohonanLayananFileDto,
  UpdatePermohonanStatusDto
} from './dto/layanan-mandala.dto';

@Injectable()
export class LayananMandalaService {
  constructor(private readonly prisma: PrismaService) {}

  // --- Master Layanan ---

  async createLayanan(dto: CreateLayananDto) {
    return await this.prisma.layanan.create({
      data: dto,
    });
  }

  async getLayanan(kategori?: number) {
    return await this.prisma.layanan.findMany({
      where: kategori !== undefined ? { kategori, aktif: true } : { aktif: true },
      include: { syarat: true },
      orderBy: { nama_layanan: 'asc' },
    });
  }

  async updateLayanan(id: string, dto: Partial<CreateLayananDto>) {
    return await this.prisma.layanan.update({
      where: { layanan_id: id },
      data: dto,
    });
  }

  // --- Master Syarat ---

  async createSyarat(layananId: string, dto: CreateLayananSyaratDto) {
    return await this.prisma.layananSyarat.create({
      data: {
        ...dto,
        layanan_id: layananId,
      },
    });
  }

  async getSyaratByLayanan(layananId: string) {
    return await this.prisma.layananSyarat.findMany({
      where: { layanan_id: layananId, aktif: true },
      orderBy: { urutan: 'asc' },
    });
  }

  // --- Permohonan Layanan ---

  async createPermohonan(dto: CreatePermohonanLayananDto) {
    // Validasi Backend
    if (dto.kategori === 0) { // GTK
      if (!dto.ptk_id) throw new BadRequestException('ptk_id wajib terisi untuk kategori GTK');
      if (dto.peserta_didik_id) throw new BadRequestException('peserta_didik_id harus NULL untuk kategori GTK');
    } else if (dto.kategori === 1) { // Peserta Didik
      if (!dto.peserta_didik_id) throw new BadRequestException('peserta_didik_id wajib terisi untuk kategori Peserta Didik');
      if (dto.ptk_id) throw new BadRequestException('ptk_id harus NULL untuk kategori Peserta Didik');
    } else if (dto.kategori === 2) { // Sekolah
      if (dto.ptk_id || dto.peserta_didik_id) throw new BadRequestException('ptk_id dan peserta_didik_id harus NULL for kategori Sekolah');
    } else {
      throw new BadRequestException('Kategori tidak valid');
    }

    return await this.prisma.permohonanLayanan.create({
      data: {
        ...dto,
        status: 1, // Diajukan
        tanggal_pengajuan: new Date(),
      },
    });
  }

  async getPermohonan(filters: { sekolah_id?: string; status?: number; kategori?: number }) {
    return await this.prisma.permohonanLayanan.findMany({
      where: filters,
      include: {
        layanan: true,
        permohonan_layanan_file: true,
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getPermohonanById(id: string) {
    const permohonan = await this.prisma.permohonanLayanan.findUnique({
      where: { permohonan_layanan_id: id },
      include: {
        layanan: {
          include: { syarat: true }
        },
        permohonan_layanan_file: true,
        permohonan_layanan_log: {
          include: { pegawai: true },
          orderBy: { created_at: 'desc' }
        }
      },
    });

    if (!permohonan) throw new NotFoundException('Permohonan tidak ditemukan');
    return permohonan;
  }

  async updatePermohonanStatus(id: string, dto: UpdatePermohonanStatusDto) {
    return await this.prisma.$transaction(async (tx) => {
      const permohonan = await tx.permohonanLayanan.update({
        where: { permohonan_layanan_id: id },
        data: { status: dto.status },
      });

      await tx.permohonanLayananLog.create({
        data: {
          permohonan_layanan_id: id,
          pegawai_id: dto.pegawai_id,
          status: dto.status,
          catatan: dto.catatan,
        },
      });

      return permohonan;
    });
  }

  // --- Permohonan File ---

  async uploadFile(permohonanId: string, dto: CreatePermohonanLayananFileDto) {
    return await this.prisma.permohonanLayananFile.create({
      data: {
        ...dto,
        permohonan_layanan_id: permohonanId,
        status: 0, // Menunggu Verifikasi
      },
    });
  }

  async updateFileStatus(fileId: string, status: number, catatan?: string) {
    return await this.prisma.permohonanLayananFile.update({
      where: { permohonan_layanan_file_id: fileId },
      data: { status, catatan },
    });
  }
}
