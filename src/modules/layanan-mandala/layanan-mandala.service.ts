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

  async createLayanan(dto: CreateLayananDto, defaultCadisdikId?: string) {
    const cadisdikId = dto.cadisdik_id || defaultCadisdikId;
    if (!cadisdikId) {
      throw new BadRequestException('cadisdik_id is required');
    }
    return await this.prisma.layanan.create({
      data: {
        cadisdik_id: cadisdikId,
        nama_layanan: dto.nama_layanan,
        kategori: dto.kategori,
        aktif: dto.aktif ?? true,
      },
    });
  }

  async getLayanan(cadisdikId: string, kategori?: number) {
    const where: any = { cadisdik_id: cadisdikId };
    if (kategori !== undefined) where.kategori = kategori;
    
    return await this.prisma.layanan.findMany({
      where,
      include: { syarat: { orderBy: { urutan: 'asc' } } },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateLayanan(id: string, dto: Partial<CreateLayananDto>) {
    return await this.prisma.layanan.update({
      where: { layanan_id: id },
      data: dto,
    });
  }

  async deleteLayanan(id: string) {
    return await this.prisma.layanan.delete({
      where: { layanan_id: id },
    });
  }

  // --- Master Syarat ---

  async createSyarat(layananId: string, dto: CreateLayananSyaratDto) {
    return await this.prisma.layananSyarat.create({
      data: {
        layanan_id: layananId,
        nama_syarat: dto.nama_syarat,
        wajib: dto.wajib ?? true,
        urutan: dto.urutan,
        aktif: dto.aktif ?? true,
      },
    });
  }

  async updateSyarat(id: string, dto: Partial<CreateLayananSyaratDto>) {
    return await this.prisma.layananSyarat.update({
      where: { layanan_syarat_id: id },
      data: dto,
    });
  }

  async deleteSyarat(id: string) {
    return await this.prisma.layananSyarat.delete({
      where: { layanan_syarat_id: id },
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
    // Validasi kategori & IDs
    if (dto.kategori === 0) { // GTK
      if (!dto.ptk_id) throw new BadRequestException('ptk_id wajib diisi untuk kategori GTK');
      dto.peserta_didik_id = null;
    } else if (dto.kategori === 1) { // Peserta Didik
      if (!dto.peserta_didik_id) throw new BadRequestException('peserta_didik_id wajib diisi untuk kategori Peserta Didik');
      dto.ptk_id = null;
    } else if (dto.kategori === 2) { // Sekolah
      dto.ptk_id = null;
      dto.peserta_didik_id = null;
    }

    // Resolve cadisdik_id from sekolah
    const sekolah = await this.prisma.sekolah.findUnique({
      where: { sekolah_id: dto.sekolah_id },
      select: { cadisdik_id: true },
    });
    if (!sekolah?.cadisdik_id) {
      throw new BadRequestException('Sekolah tidak terasosiasi dengan Cabang Dinas (Cadisdik)');
    }

    const nomorPermohonan = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    return await this.prisma.permohonanLayanan.create({
      data: {
        cadisdik_id: sekolah.cadisdik_id,
        sekolah_id: dto.sekolah_id,
        layanan_id: dto.layanan_id,
        kategori: dto.kategori,
        ptk_id: dto.ptk_id,
        peserta_didik_id: dto.peserta_didik_id,
        nomor_permohonan: nomorPermohonan,
        keterangan: dto.keterangan,
        status: 1, // Diajukan
        tanggal_pengajuan: new Date(),
      },
    });
  }

  async getPermohonan(filters: { cadisdik_id?: string; sekolah_id?: string; status?: number; kategori?: number }) {
    const where: any = {};
    if (filters.cadisdik_id) where.cadisdik_id = filters.cadisdik_id;
    if (filters.sekolah_id) where.sekolah_id = filters.sekolah_id;
    if (filters.status !== undefined) where.status = filters.status;
    if (filters.kategori !== undefined) where.kategori = filters.kategori;

    return await this.prisma.permohonanLayanan.findMany({
      where,
      include: {
        layanan: true,
        permohonan_layanan_file: {
          include: { layanan_syarat: true }
        },
        permohonan_layanan_log: {
          orderBy: { created_at: 'desc' },
          include: { pegawai: { select: { nama_lengkap: true } } }
        }
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getPermohonanById(id: string) {
    const permohonan = await this.prisma.permohonanLayanan.findUnique({
      where: { permohonan_layanan_id: id },
      include: {
        layanan: { include: { syarat: true } },
        permohonan_layanan_file: { include: { layanan_syarat: true } },
        permohonan_layanan_log: {
          orderBy: { created_at: 'desc' },
          include: { pegawai: { select: { nama_lengkap: true } } }
        }
      },
    });

    if (!permohonan) throw new NotFoundException('Permohonan tidak ditemukan');

    // Fetch details school/ptk/pd from other schemas manually if needed
    // In this generic implementation, we'll return as is.
    
    return permohonan;
  }

  async updatePermohonanStatus(id: string, dto: UpdatePermohonanStatusDto) {
    return await this.prisma.$transaction(async (tx) => {
      const permohonan = await tx.permohonanLayanan.update({
        where: { permohonan_layanan_id: id },
        data: { 
          status: dto.status,
          updated_at: new Date()
        },
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

  async uploadFile(id: string, dto: CreatePermohonanLayananFileDto) {
    return await this.prisma.permohonanLayananFile.create({
      data: {
        permohonan_layanan_id: id,
        layanan_syarat_id: dto.layanan_syarat_id,
        jenis_file: dto.jenis_file,
        nama_file: dto.nama_file,
        file_url: dto.file_url,
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
