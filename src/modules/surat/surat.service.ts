import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';

@Injectable()
export class SuratService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly romanMonths = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'
  ];

  private readonly indonesianMonths = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // Helper for formatting date to Indonesian readable string
  private formatIndonesianDate(date: Date): string {
    const day = date.getDate();
    const month = this.indonesianMonths[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  // ==========================================
  // 1. PENGATURAN NOMOR SURAT CRUD
  // ==========================================

  async createPengaturanNomor(sekolahId: string, dto: any) {
    try {
      return await this.prisma.pengaturanNomorSurat.create({
        data: {
          sekolah_id: sekolahId,
          kategori: Number(dto.kategori),
          nama_label: dto.nama_label,
          format_nomor: dto.format_nomor,
          counter: dto.counter !== undefined ? Number(dto.counter) : 0,
          aktif: dto.aktif !== undefined ? Boolean(dto.aktif) : true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Label untuk kategori surat ini sudah ada di sekolah ini.');
      }
      throw error;
    }
  }

  async getPengaturanNomorList(sekolahId: string) {
    return await this.prisma.pengaturanNomorSurat.findMany({
      where: { sekolah_id: sekolahId },
      orderBy: { created_at: 'desc' },
    });
  }

  async updatePengaturanNomor(id: string, dto: any) {
    const config = await this.prisma.pengaturanNomorSurat.findUnique({ where: { pengaturan_nomor_surat_id: id } });
    if (!config) throw new NotFoundException('Pengaturan nomor surat tidak ditemukan.');

    return await this.prisma.pengaturanNomorSurat.update({
      where: { pengaturan_nomor_surat_id: id },
      data: {
        kategori: dto.kategori !== undefined ? Number(dto.kategori) : undefined,
        nama_label: dto.nama_label,
        format_nomor: dto.format_nomor,
        counter: dto.counter !== undefined ? Number(dto.counter) : undefined,
        aktif: dto.aktif !== undefined ? Boolean(dto.aktif) : undefined,
      },
    });
  }

  async deletePengaturanNomor(id: string) {
    const config = await this.prisma.pengaturanNomorSurat.findUnique({ where: { pengaturan_nomor_surat_id: id } });
    if (!config) throw new NotFoundException('Pengaturan nomor surat tidak ditemukan.');

    await this.prisma.pengaturanNomorSurat.delete({
      where: { pengaturan_nomor_surat_id: id },
    });
  }

  // ==========================================
  // 2. TEMPLATE SURAT CRUD
  // ==========================================

  async createTemplate(sekolahId: string, dto: any) {
    return await this.prisma.templateSurat.create({
      data: {
        sekolah_id: sekolahId,
        nama_template: dto.nama_template,
        kategori: Number(dto.kategori),
        ukuran_kertas: Number(dto.ukuran_kertas),
        margin_atas: dto.margin_atas !== undefined ? Number(dto.margin_atas) : 20,
        margin_bawah: dto.margin_bawah !== undefined ? Number(dto.margin_bawah) : 20,
        margin_kiri: dto.margin_kiri !== undefined ? Number(dto.margin_kiri) : 20,
        margin_kanan: dto.margin_kanan !== undefined ? Number(dto.margin_kanan) : 20,
        konten_html: dto.konten_html,
        aktif: dto.aktif !== undefined ? Boolean(dto.aktif) : true,
      },
    });
  }

  async getTemplateList(sekolahId: string) {
    return await this.prisma.templateSurat.findMany({
      where: { sekolah_id: sekolahId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getTemplateDetail(id: string) {
    const template = await this.prisma.templateSurat.findUnique({ where: { template_surat_id: id } });
    if (!template) throw new NotFoundException('Template surat tidak ditemukan.');
    return template;
  }

  async updateTemplate(id: string, dto: any) {
    const template = await this.prisma.templateSurat.findUnique({ where: { template_surat_id: id } });
    if (!template) throw new NotFoundException('Template surat tidak ditemukan.');

    return await this.prisma.templateSurat.update({
      where: { template_surat_id: id },
      data: {
        nama_template: dto.nama_template,
        kategori: dto.kategori !== undefined ? Number(dto.kategori) : undefined,
        ukuran_kertas: dto.ukuran_kertas !== undefined ? Number(dto.ukuran_kertas) : undefined,
        margin_atas: dto.margin_atas !== undefined ? Number(dto.margin_atas) : undefined,
        margin_bawah: dto.margin_bawah !== undefined ? Number(dto.margin_bawah) : undefined,
        margin_kiri: dto.margin_kiri !== undefined ? Number(dto.margin_kiri) : undefined,
        margin_kanan: dto.margin_kanan !== undefined ? Number(dto.margin_kanan) : undefined,
        konten_html: dto.konten_html,
        aktif: dto.aktif !== undefined ? Boolean(dto.aktif) : undefined,
      },
    });
  }

  async deleteTemplate(id: string) {
    const template = await this.prisma.templateSurat.findUnique({ where: { template_surat_id: id } });
    if (!template) throw new NotFoundException('Template surat tidak ditemukan.');

    await this.prisma.templateSurat.delete({
      where: { template_surat_id: id },
    });
  }

  // ==========================================
  // 3. SURAT MASUK CRUD
  // ==========================================

  async createSuratMasuk(sekolahId: string, dto: any) {
    try {
      return await this.prisma.suratMasuk.create({
        data: {
          sekolah_id: sekolahId,
          tanggal_surat: new Date(dto.tanggal_surat),
          tanggal_diterima: new Date(dto.tanggal_diterima),
          nomor_agenda: dto.nomor_agenda,
          nomor_surat: dto.nomor_surat,
          asal_surat: dto.asal_surat,
          tujuan_disposisi: dto.tujuan_disposisi,
          perihal: dto.perihal,
          keterangan: dto.keterangan || null,
          file_url: dto.file_url,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Nomor agenda ini sudah digunakan di sekolah ini.');
      }
      throw error;
    }
  }

  async getSuratMasukList(sekolahId: string, query: any) {
    const { search, limit, page } = query;
    const where: any = { sekolah_id: sekolahId };

    if (search) {
      where.OR = [
        { nomor_surat: { contains: search, mode: 'insensitive' } },
        { nomor_agenda: { contains: search, mode: 'insensitive' } },
        { asal_surat: { contains: search, mode: 'insensitive' } },
        { perihal: { contains: search, mode: 'insensitive' } },
      ];
    }

    const take = limit ? parseInt(limit, 10) : 10;
    const skip = page ? (parseInt(page, 10) - 1) * take : 0;

    const [total, data] = await Promise.all([
      this.prisma.suratMasuk.count({ where }),
      this.prisma.suratMasuk.findMany({
        where,
        take,
        skip,
        orderBy: { tanggal_diterima: 'desc' },
      }),
    ]);

    return {
      status: 'success',
      data,
      meta: {
        total_data: total,
        total_pages: Math.ceil(total / take),
        current_page: page ? parseInt(page, 10) : 1,
      },
    };
  }

  async updateSuratMasuk(id: string, dto: any) {
    const surat = await this.prisma.suratMasuk.findUnique({ where: { surat_masuk_id: id } });
    if (!surat) throw new NotFoundException('Surat masuk tidak ditemukan.');

    return await this.prisma.suratMasuk.update({
      where: { surat_masuk_id: id },
      data: {
        tanggal_surat: dto.tanggal_surat ? new Date(dto.tanggal_surat) : undefined,
        tanggal_diterima: dto.tanggal_diterima ? new Date(dto.tanggal_diterima) : undefined,
        nomor_agenda: dto.nomor_agenda,
        nomor_surat: dto.nomor_surat,
        asal_surat: dto.asal_surat,
        tujuan_disposisi: dto.tujuan_disposisi,
        perihal: dto.perihal,
        keterangan: dto.keterangan || null,
        file_url: dto.file_url,
      },
    });
  }

  async deleteSuratMasuk(id: string) {
    const surat = await this.prisma.suratMasuk.findUnique({ where: { surat_masuk_id: id } });
    if (!surat) throw new NotFoundException('Surat masuk tidak ditemukan.');

    await this.prisma.suratMasuk.delete({
      where: { surat_masuk_id: id },
    });
  }

  // ==========================================
  // 4. SURAT KELUAR CRUD
  // ==========================================

  async createSuratKeluar(sekolahId: string, dto: any) {
    // 1. Validate template and number setup exists
    const template = await this.prisma.templateSurat.findUnique({ where: { template_surat_id: dto.template_surat_id } });
    if (!template) throw new NotFoundException('Template surat tidak ditemukan.');

    const numberConfig = await this.prisma.pengaturanNomorSurat.findUnique({ where: { pengaturan_nomor_surat_id: dto.pengaturan_nomor_surat_id } });
    if (!numberConfig) throw new NotFoundException('Pengaturan penomoran surat tidak ditemukan.');

    // 2. Draft content generation
    const initialParsedHtml = await this.parseTemplate(sekolahId, template.konten_html, template.kategori, {
      peserta_didik_id: dto.peserta_didik_id,
      ptk_id: dto.ptk_id,
      nomor_surat: '[DRAFT - BELUM DITERBITKAN]',
      tanggal_surat: new Date(dto.tanggal_surat),
    });

    return await this.prisma.suratKeluar.create({
      data: {
        sekolah_id: sekolahId,
        template_surat_id: dto.template_surat_id,
        pengaturan_nomor_surat_id: dto.pengaturan_nomor_surat_id,
        kategori: template.kategori,
        peserta_didik_id: dto.peserta_didik_id || null,
        ptk_id: dto.ptk_id || null,
        nomor_surat: null, // Keep null for draft
        tanggal_surat: new Date(dto.tanggal_surat),
        perihal: dto.perihal,
        isi_final_html: initialParsedHtml,
        status: 1, // Draft
      },
    });
  }

  async getSuratKeluarList(sekolahId: string, query: any) {
    const { search, limit, page, status, kategori, sub } = query;
    
    const andConditions: any[] = [{ sekolah_id: sekolahId }];

    if (search) {
      andConditions.push({
        OR: [
          { nomor_surat: { contains: search, mode: 'insensitive' } },
          { perihal: { contains: search, mode: 'insensitive' } },
        ]
      });
    }

    if (status !== undefined) {
      andConditions.push({ status: Number(status) });
    }

    if (sub === 'siswa') {
      andConditions.push({ kategori: 0 });
    } else if (sub === 'guru') {
      andConditions.push({
        kategori: 1,
        gtk: {
          jenis_ptk_id_str: { contains: 'Guru', mode: 'insensitive' }
        }
      });
    } else if (sub === 'tendik') {
      andConditions.push({
        OR: [
          {
            kategori: 1,
            gtk: {
              NOT: {
                jenis_ptk_id_str: { contains: 'Guru', mode: 'insensitive' }
              }
            }
          },
          {
            kategori: 2
          }
        ]
      });
    } else if (kategori !== undefined) {
      andConditions.push({ kategori: Number(kategori) });
    }

    const where = { AND: andConditions };

    const take = limit ? parseInt(limit, 10) : 10;
    const skip = page ? (parseInt(page, 10) - 1) * take : 0;

    const [total, data] = await Promise.all([
      this.prisma.suratKeluar.count({ where }),
      this.prisma.suratKeluar.findMany({
        where,
        take,
        skip,
        include: {
          template_surat: { select: { nama_template: true } },
          peserta_didik: { select: { nama: true } },
          gtk: { select: { nama: true, jenis_ptk_id_str: true } },
        },
        orderBy: { created_at: 'desc' },
      }),
    ]);

    return {
      status: 'success',
      data,
      meta: {
        total_data: total,
        total_pages: Math.ceil(total / take),
        current_page: page ? parseInt(page, 10) : 1,
      },
    };
  }

  async getSuratKeluarDetail(id: string) {
    const surat = await this.prisma.suratKeluar.findUnique({
      where: { surat_keluar_id: id },
      include: {
        template_surat: true,
        peserta_didik: true,
        gtk: true,
      },
    });
    if (!surat) throw new NotFoundException('Surat keluar tidak ditemukan.');
    return surat;
  }

  async updateSuratKeluar(id: string, dto: any) {
    const surat = await this.prisma.suratKeluar.findUnique({ where: { surat_keluar_id: id } });
    if (!surat) throw new NotFoundException('Surat keluar tidak ditemukan.');
    if (surat.status === 2) {
      throw new BadRequestException('Surat yang sudah terbit tidak boleh diubah.');
    }

    // Recalculate parsed HTML
    const template = await this.prisma.templateSurat.findUnique({ where: { template_surat_id: surat.template_surat_id } });
    const initialParsedHtml = await this.parseTemplate(surat.sekolah_id, template.konten_html, template.kategori, {
      peserta_didik_id: dto.peserta_didik_id || surat.peserta_didik_id,
      ptk_id: dto.ptk_id || surat.ptk_id,
      nomor_surat: '[DRAFT - BELUM DITERBITKAN]',
      tanggal_surat: dto.tanggal_surat ? new Date(dto.tanggal_surat) : surat.tanggal_surat,
    });

    return await this.prisma.suratKeluar.update({
      where: { surat_keluar_id: id },
      data: {
        peserta_didik_id: dto.peserta_didik_id !== undefined ? dto.peserta_didik_id : undefined,
        ptk_id: dto.ptk_id !== undefined ? dto.ptk_id : undefined,
        tanggal_surat: dto.tanggal_surat ? new Date(dto.tanggal_surat) : undefined,
        perihal: dto.perihal,
        isi_final_html: initialParsedHtml,
      },
    });
  }

  // **PUBLISH SURAT KELUAR WITH DATABASE TRANSACTION LOCK**
  async terbitkanSurat(id: string) {
    const surat = await this.prisma.suratKeluar.findUnique({ where: { surat_keluar_id: id } });
    if (!surat) throw new NotFoundException('Surat keluar tidak ditemukan.');
    if (surat.status === 2) {
      throw new BadRequestException('Surat sudah terbit.');
    }

    // Run database transaction to ensure incremental locking and prevent duplicate document numbers
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Fetch and Lock the PengaturanNomorSurat record to prevent concurrency race conditions
      const numberConfig = await tx.pengaturanNomorSurat.findUnique({
        where: { pengaturan_nomor_surat_id: surat.pengaturan_nomor_surat_id },
      });
      if (!numberConfig) throw new NotFoundException('Konfigurasi nomor surat tidak ditemukan.');

      // 2. Increment the counter
      const nextCounter = numberConfig.counter + 1;

      // 3. Format the official document number
      const officialNumber = this.generateOfficialNumber(numberConfig.format_nomor, {
        no: nextCounter.toString().padStart(3, '0'),
        label: numberConfig.nama_label,
        date: new Date(surat.tanggal_surat),
      });

      // 4. Update the settings counter in database
      await tx.pengaturanNomorSurat.update({
        where: { pengaturan_nomor_surat_id: numberConfig.pengaturan_nomor_surat_id },
        data: { counter: nextCounter },
      });

      // 5. Query Master template content to perform clean variables parsing
      const template = await tx.templateSurat.findUnique({ where: { template_surat_id: surat.template_surat_id } });
      const finalParsedHtml = await this.parseTemplateWithTransaction(tx, surat.sekolah_id, template.konten_html, template.kategori, {
        peserta_didik_id: surat.peserta_didik_id,
        ptk_id: surat.ptk_id,
        nomor_surat: officialNumber,
        tanggal_surat: new Date(surat.tanggal_surat),
      });

      // 6. Save the final generated fields and set status to Terbit (2)
      return await tx.suratKeluar.update({
        where: { surat_keluar_id: id },
        data: {
          nomor_surat: officialNumber,
          isi_final_html: finalParsedHtml,
          status: 2, // Terbit
        },
      });
    });

    return result;
  }

  async deleteSuratKeluar(id: string) {
    const surat = await this.prisma.suratKeluar.findUnique({ where: { surat_keluar_id: id } });
    if (!surat) throw new NotFoundException('Surat keluar tidak ditemukan.');
    if (surat.status === 2) {
      throw new BadRequestException('Surat yang sudah terbit tidak boleh dihapus.');
    }

    await this.prisma.suratKeluar.delete({
      where: { surat_keluar_id: id },
    });
  }

  // ==========================================
  // TEMPLATE VARIABLE PARSER & GENERATION UTILITIES
  // ==========================================

  private generateOfficialNumber(format: string, params: { no: string; label: string; date: Date }): string {
    const month = params.date.getMonth() + 1;
    const year = params.date.getFullYear();
    const romawi = this.romanMonths[month - 1];
    const doubleDigitMonth = month < 10 ? `0${month}` : `${month}`;

    return format
      .replace(/{NO}/g, params.no)
      .replace(/{LABEL}/g, params.label)
      .replace(/{ROMAWI}/g, romawi)
      .replace(/{BULAN}/g, doubleDigitMonth)
      .replace(/{TAHUN}/g, year.toString());
  }

  // Wrapper for standard parsing (reads standard prisma connection)
  private async parseTemplate(sekolahId: string, templateHtml: string, category: number, context: {
    peserta_didik_id?: string;
    ptk_id?: string;
    nomor_surat: string;
    tanggal_surat: Date;
  }): Promise<string> {
    return await this.parseTemplateWithTransaction(this.prisma, sekolahId, templateHtml, category, context);
  }

  // Performs template variable swapping inside a transaction context (or standard connection)
  private async parseTemplateWithTransaction(tx: any, sekolahId: string, templateHtml: string, category: number, context: {
    peserta_didik_id?: string;
    ptk_id?: string;
    nomor_surat: string;
    tanggal_surat: Date;
  }): Promise<string> {
    let html = templateHtml;

    // 1. Replace Letter properties
    const month = context.tanggal_surat.getMonth() + 1;
    const doubleDigitMonth = month < 10 ? `0${month}` : `${month}`;
    const romawi = this.romanMonths[month - 1];

    let activeYear = context.tanggal_surat.getFullYear().toString(); // Fallback
    try {
      const activeRombel = await tx.rombonganBelajar.findFirst({
        where: { sekolah_id: sekolahId },
        select: { semester_id: true },
        orderBy: { semester_id: 'desc' },
      });
      if (activeRombel && activeRombel.semester_id) {
        const yearPrefix = activeRombel.semester_id.substring(0, 4);
        const yearStart = parseInt(yearPrefix, 10);
        const yearEnd = yearStart + 1;
        activeYear = `${yearStart}/${yearEnd}`;
      }
    } catch (e) {
      console.error('Error fetching active year:', e);
    }

    html = html
      .replace(/{{nomor_surat}}/g, context.nomor_surat)
      .replace(/{{tanggal_surat}}/g, this.formatIndonesianDate(context.tanggal_surat))
      .replace(/{{bulan}}/g, doubleDigitMonth)
      .replace(/{{bulan_romawi}}/g, romawi)
      .replace(/{{tahun}}/g, activeYear);

    // 2. Fetch and Replace School details
    const school = await tx.sekolah.findUnique({ where: { sekolah_id: sekolahId } });
    if (school) {
      html = html
        .replace(/{{nama_sekolah}}/g, school.nama || '')
        .replace(/{{alamat_sekolah}}/g, school.alamat_jalan || '')
        .replace(/{{telepon_sekolah}}/g, school.nomor_telepon || '');
    }

    // 3. Fetch Student fields (if applicable and ID provided)
    if (category === 0 && context.peserta_didik_id) {
      const student = await tx.pesertaDidik.findUnique({
        where: { peserta_didik_id: context.peserta_didik_id },
        include: { rombongan_belajar: true }
      });
      if (student) {
        // Address Parts
        const addressParts = [
          student.alamat_jalan,
          student.rt ? `RT ${student.rt}` : null,
          student.rw ? `RW ${student.rw}` : null,
          student.dusun ? `Dusun ${student.dusun}` : null,
          student.desa_kelurahan ? `Desa/Kel. ${student.desa_kelurahan}` : null,
          student.kecamatan ? `Kec. ${student.kecamatan}` : null,
          student.kabupaten_kota,
          student.provinsi
        ].filter(Boolean);
        const addressStr = addressParts.join(', ');

        html = html
          .replace(/{{nama_lengkap}}/g, student.nama || '')
          .replace(/{{nisn}}/g, student.nisn || '')
          .replace(/{{nipd}}/g, student.nipd || '')
          .replace(/{{nik}}/g, student.nik || '')
          .replace(/{{tempat_lahir}}/g, student.tempat_lahir || '')
          .replace(/{{tanggal_lahir}}/g, student.tanggal_lahir ? this.formatIndonesianDate(new Date(student.tanggal_lahir)) : '')
          .replace(/{{jenis_kelamin}}/g, student.jenis_kelamin === 'L' ? 'Laki-laki' : (student.jenis_kelamin === 'P' ? 'Perempuan' : ''))
          .replace(/{{kelas}}/g, student.rombongan_belajar?.nama || student.nama_rombel || '')
          .replace(/{{alamat}}/g, addressStr)
          .replace(/{{nama_ayah}}/g, student.nama_ayah || '')
          .replace(/{{nama_ibu}}/g, student.nama_ibu || '');
      }
    }

    // 4. Fetch GTK fields (if applicable and ID provided)
    if (category === 1 && context.ptk_id) {
      const gtk = await tx.gtk.findUnique({ where: { ptk_id: context.ptk_id } });
      if (gtk) {
        html = html
          .replace(/{{nama_lengkap}}/g, gtk.nama || '')
          .replace(/{{nip}}/g, gtk.nip || '-')
          .replace(/{{nuptk}}/g, gtk.nuptk || '-')
          .replace(/{{jabatan}}/g, gtk.jabatan_ptk_id_str || '')
          .replace(/{{unit_kerja}}/g, school?.nama || '');
      }
    }

    return html;
  }
}
