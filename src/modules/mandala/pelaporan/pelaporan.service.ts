import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { CreatePelaporanDto } from './dto/create-pelaporan.dto';
import * as path from 'path';
import * as fs from 'fs';
import { validateExcelHeader, parseExcelData, generateHtmlTable, generateHtmlTableRows, validateDynamicExcel, parseDynamicExcel, generateDynamicHtmlTable, getTemplateHeaders, isAutoField } from '../../../common/utils/excel-html-generator.helper';

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
          template_konten: dto.template_konten,
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
      template_konten: pelaporan.template_konten,
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
      template_konten: pelaporanSekolah.pelaporan.template_konten,
      tanggal_mulai: pelaporanSekolah.pelaporan.tanggal_mulai,
      tanggal_selesai: pelaporanSekolah.pelaporan.tanggal_selesai,
      dokumen: pelaporanSekolah.pelaporan_dokumen,
    };
  }

  async uploadDokumenSimak(sekolahId: string, pelaporanId: string, files: Express.Multer.File[]) {
    const pelaporanSekolah = await this.prisma.pelaporanSekolah.findFirst({
      where: { sekolah_id: sekolahId, pelaporan_id: pelaporanId },
      include: { pelaporan: true }
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

      if (ext === '.xlsx' || ext === '.xls') {
        const expectedHeaders = getTemplateHeaders(pelaporanSekolah.pelaporan.template_konten || '');
        if (expectedHeaders && expectedHeaders.length > 0) {
          const res = validateDynamicExcel(file.buffer, expectedHeaders);
          if (!res.isValid) {
            throw new Error(res.error || `Struktur kolom Excel tidak valid.`);
          }
        } else {
          const isValid = validateExcelHeader(file.buffer);
          if (!isValid) {
            throw new Error(`Struktur kolom Excel tidak valid. Baris pertama (A1) harus 'nisn' dan (B1) harus 'nama siswa'.`);
          }
        }
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

  private async resolveWilayahHierarchy(kodeWilayah: string | null) {
    const result = {
      desa: null as string | null,
      kecamatan: null as string | null,
      kabupaten_kota: null as string | null,
      provinsi: null as string | null,
    };

    if (!kodeWilayah) return result;
    try {
      let currentKode: string | null = kodeWilayah.trim();
      let maxDepth = 6;

      while (currentKode && maxDepth > 0) {
        const wil = await this.prisma.mst_wilayah.findUnique({
          where: { kode_wilayah: currentKode },
          select: { nama: true, id_level_wilayah: true, mst_kode_wilayah: true },
        });

        if (!wil) break;

        switch (wil.id_level_wilayah) {
          case 4: result.desa = wil.nama; break;
          case 3: result.kecamatan = wil.nama; break;
          case 2: result.kabupaten_kota = wil.nama; break;
          case 1: result.provinsi = wil.nama; break;
        }

        currentKode = wil.mst_kode_wilayah?.trim() || null;
        maxDepth--;
      }
    } catch (e) {
      console.error("Gagal resolve wilayah:", e);
    }
    return result;
  }

  async renderPelaporanHtml(cadisdikId: string, pelaporanId: string, sekolahId: string): Promise<string> {
    const pelaporan = await this.prisma.pelaporan.findFirst({
      where: { pelaporan_id: pelaporanId, cadisdik_id: cadisdikId }
    });

    if (!pelaporan) {
      throw new NotFoundException('Pelaporan tidak ditemukan');
    }

    const [sekolah, totalSiswa, totalGtk] = await Promise.all([
      this.prisma.sekolah.findUnique({
        where: { sekolah_id: sekolahId },
        include: { cadisdik: true }
      }),
      this.prisma.pesertaDidik.count({ where: { sekolah_id: sekolahId } }),
      this.prisma.gtk.count({ where: { sekolah_id: sekolahId } })
    ]);

    if (!sekolah) {
      throw new NotFoundException('Sekolah tidak ditemukan');
    }

    const wilayah = await this.resolveWilayahHierarchy(sekolah.kode_wilayah);

    const schoolData = {
      ...sekolah,
      total_siswa: totalSiswa,
      total_gtk: totalGtk,
      provinsi: wilayah.provinsi || '',
      kabupaten_kota: wilayah.kabupaten_kota || '',
      kecamatan: wilayah.kecamatan || '',
      desa_kelurahan: wilayah.desa || sekolah.desa_kelurahan || ''
    };

    const pelaporanSekolah = await this.prisma.pelaporanSekolah.findFirst({
      where: { pelaporan_id: pelaporanId, sekolah_id: sekolahId },
      include: {
        pelaporan_dokumen: {
          orderBy: { created_at: 'desc' }
        }
      }
    });

    let template = pelaporan.template_konten;
    if (!template) {
      // Default fallback template if none has been designed by Cadisdik
      template = `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5; color: #333;">
          <h2 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">LAPORAN DATA DOKUMEN</h2>
          <table style="width: 100%; margin-bottom: 20px;">
            <tr>
              <td style="width: 20%; font-weight: bold;">Judul Laporan</td>
              <td style="width: 2%;">:</td>
              <td>{judul}</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Sekolah</td>
              <td>:</td>
              <td>{nama_sekolah} ({npsn})</td>
            </tr>
            <tr>
              <td style="font-weight: bold;">Tanggal Cetak</td>
              <td>:</td>
              <td>{tanggal_cetak}</td>
            </tr>
          </table>
          <p>{deskripsi}</p>
          <div style="margin-top: 20px;">
            {tabel_siswa}
          </div>
        </div>
      `;
    }

    let tableHtml = '';
    let tableRowsHtml = '';

    if (pelaporanSekolah && pelaporanSekolah.pelaporan_dokumen.length > 0) {
       // Look for Excel file (.xlsx or .xls) first
      const excelDoc = pelaporanSekolah.pelaporan_dokumen.find(doc => 
        doc.nama_file.toLowerCase().endsWith('.xlsx') || 
        doc.nama_file.toLowerCase().endsWith('.xls')
      );
      
      if (excelDoc) {
        // Resolve absolute path to file on disk
        const filePath = path.join(process.cwd(), excelDoc.file_url);
        if (fs.existsSync(filePath)) {
          const expectedHeaders = getTemplateHeaders(pelaporan.template_konten || '');
          if (expectedHeaders && expectedHeaders.length > 0) {
            const rows = parseDynamicExcel(filePath, expectedHeaders, schoolData);
            tableHtml = generateDynamicHtmlTable(expectedHeaders, rows, pelaporan.judul);
            tableRowsHtml = rows.map((r, idx) => {
              let tds = `<td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${idx + 1}</td>`;
              expectedHeaders.forEach(h => {
                tds += `<td style="padding: 8px; border: 1px solid #cbd5e1; text-align: left;">${r[h] || ''}</td>`;
              });
              return `<tr>${tds}</tr>`;
            }).join('');
          } else {
            const students = parseExcelData(filePath);
            tableHtml = generateHtmlTable(students);
            tableRowsHtml = generateHtmlTableRows(students);
          }
        } else {
          tableHtml = `<div style="text-align: center; color: #d9534f; padding: 10px; border: 1px dashed #d9534f;">Berkas Excel tidak ditemukan pada server</div>`;
          tableRowsHtml = `<tr><td colspan="3" style="text-align: center; color: #d9534f;">Berkas Excel tidak ditemukan pada server</td></tr>`;
        }
      } else {
        // School uploaded other non-excel documents
        const fileNames = pelaporanSekolah.pelaporan_dokumen.map(doc => doc.nama_file).join(', ');
        tableHtml = `
          <div style="padding: 15px; border: 1px dashed #3b82f6; background-color: #eff6ff; border-radius: 6px; text-align: center; color: #1e3a8a;">
            <p style="margin: 0; font-weight: 600;">Sekolah Mengunggah Dokumen Lampiran (Non-Excel):</p>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-family: monospace;">${fileNames}</p>
          </div>
        `;
        tableRowsHtml = `<tr><td colspan="3" style="text-align: center; color: #1e3a8a;">Dokumen Lampiran: ${fileNames}</td></tr>`;
      }
    } else {
      // No documents uploaded
      tableHtml = `
        <div style="padding: 15px; border: 1px dashed #ef4444; background-color: #fef2f2; border-radius: 6px; text-align: center; color: #991b1b;">
          Belum ada dokumen/Excel yang diunggah oleh sekolah untuk pelaporan ini.
        </div>
      `;
      tableRowsHtml = `<tr><td colspan="3" style="text-align: center; color: #991b1b;">Belum ada dokumen yang diunggah</td></tr>`;
    }

    // Replace placeholders
    let rendered = template;
    const excelWrapperIndex = rendered.indexOf('<div class="excel-template-wrapper"');
    if (excelWrapperIndex !== -1) {
      const lastCloseDivIndex = rendered.lastIndexOf('</div>');
      if (lastCloseDivIndex > excelWrapperIndex) {
        rendered = rendered.substring(0, excelWrapperIndex) + '<div style="page-break-after: always; break-after: page;"></div>' + tableHtml + rendered.substring(lastCloseDivIndex + 6);
      }
    } else {
      rendered = rendered.replaceAll("{tabel_siswa}", tableHtml);
    }

    rendered = rendered
      .replaceAll("{judul}", pelaporan.judul || '')
      .replaceAll("{deskripsi}", pelaporan.deskripsi || '')
      .replaceAll("{nama_sekolah}", sekolah?.nama || '')
      .replaceAll("{npsn}", sekolah?.npsn || '')
      .replaceAll("{tanggal_cetak}", new Date().toLocaleDateString("id-ID"))
      .replaceAll("{tabel_siswa_rows}", tableRowsHtml);

    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @media screen {
              body {
                background-color: #f3f4f6;
                margin: 0;
                padding: 40px 20px;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                font-family: Arial, sans-serif;
              }
              .document-page {
                background-color: #ffffff;
                width: 210mm;
                min-height: 297mm;
                padding: 20mm;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                box-sizing: border-box;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
              }
            }
            @media print {
              body {
                background-color: #ffffff;
                margin: 0;
                padding: 0;
              }
              .document-page {
                width: 100%;
                padding: 0;
                box-shadow: none;
                border: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="document-page">
            ${rendered}
          </div>
        </body>
      </html>
    `;

    return styledHtml;
  }

  async deleteDokumenSimak(sekolahId: string, dokumenId: string) {
    const doc = await this.prisma.pelaporanDokumen.findFirst({
      where: {
        pelaporan_dokumen_id: dokumenId,
        pelaporan_sekolah: { sekolah_id: sekolahId }
      }
    });

    if (!doc) {
      throw new NotFoundException('Dokumen tidak ditemukan');
    }

    const filePath = path.join(process.cwd(), doc.file_url);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('Gagal menghapus file fisik:', err);
      }
    }

    await this.prisma.pelaporanDokumen.delete({
      where: { pelaporan_dokumen_id: dokumenId }
    });
  }

  async deletePelaporan(cadisdikId: string, id: string) {
    const pelaporan = await this.prisma.pelaporan.findFirst({
      where: { pelaporan_id: id, cadisdik_id: cadisdikId },
      include: {
        pelaporan_sekolah: {
          include: {
            pelaporan_dokumen: true
          }
        }
      }
    });

    if (!pelaporan) {
      throw new NotFoundException('Pelaporan tidak ditemukan');
    }

    // Delete physical files
    for (const ps of pelaporan.pelaporan_sekolah) {
      for (const doc of ps.pelaporan_dokumen) {
        const filePath = path.join(process.cwd(), doc.file_url);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (err) {
            console.error('Gagal menghapus file fisik:', err);
          }
        }
      }
    }

    // Delete database records using transaction
    await this.prisma.$transaction(async (tx) => {
      // 1. Delete documents
      for (const ps of pelaporan.pelaporan_sekolah) {
        await tx.pelaporanDokumen.deleteMany({
          where: { pelaporan_sekolah_id: ps.pelaporan_sekolah_id }
        });
      }
      
      // 2. Delete pelaporan sekolah links
      await tx.pelaporanSekolah.deleteMany({
        where: { pelaporan_id: id }
      });

      // 3. Delete pelaporan itself
      await tx.pelaporan.delete({
        where: { pelaporan_id: id }
      });
    });
  }

  async renderAllSekolahPelaporanHtml(cadisdikId: string, pelaporanId: string): Promise<string> {
    const pelaporan = await this.prisma.pelaporan.findFirst({
      where: { pelaporan_id: pelaporanId, cadisdik_id: cadisdikId },
      include: {
        pelaporan_sekolah: {
          include: {
            pelaporan_dokumen: {
              orderBy: { created_at: 'desc' }
            }
          }
        }
      }
    });

    if (!pelaporan) {
      throw new NotFoundException('Pelaporan tidak ditemukan');
    }

    const expectedHeaders = getTemplateHeaders(pelaporan.template_konten || '');
    if (!expectedHeaders || expectedHeaders.length === 0) {
      throw new BadRequestException('Template pelaporan ini tidak memiliki format kolom Excel.');
    }

    const sekolahIds = pelaporan.pelaporan_sekolah.map(ps => ps.sekolah_id);
    const sekolahData = await this.prisma.sekolah.findMany({
      where: { sekolah_id: { in: sekolahIds } },
      include: { cadisdik: true }
    });

    const totalSiswaCounts = await this.prisma.pesertaDidik.groupBy({
      by: ['sekolah_id'],
      _count: true
    });
    const totalGtkCounts = await this.prisma.gtk.groupBy({
      by: ['sekolah_id'],
      _count: true
    });

    const totalSiswaMap = new Map(totalSiswaCounts.map(c => [c.sekolah_id, c._count]));
    const totalGtkMap = new Map(totalGtkCounts.map(c => [c.sekolah_id, c._count]));
    const sekolahMap = new Map(sekolahData.map(s => [s.sekolah_id, s]));

    const allRows: any[] = [];

    for (const ps of pelaporan.pelaporan_sekolah) {
      const excelDoc = ps.pelaporan_dokumen.find(doc => 
        doc.nama_file.toLowerCase().endsWith('.xlsx') || 
        doc.nama_file.toLowerCase().endsWith('.xls')
      );

      if (!excelDoc) continue;

      const filePath = path.join(process.cwd(), excelDoc.file_url);
      if (!fs.existsSync(filePath)) continue;

      const sData = sekolahMap.get(ps.sekolah_id);
      if (!sData) continue;

      const totalSiswa = totalSiswaMap.get(ps.sekolah_id) || 0;
      const totalGtk = totalGtkMap.get(ps.sekolah_id) || 0;
      const wilayah = await this.resolveWilayahHierarchy(sData.kode_wilayah);

      const schoolDataResolved = {
        ...sData,
        total_siswa: totalSiswa,
        total_gtk: totalGtk,
        provinsi: wilayah.provinsi || '',
        kabupaten_kota: wilayah.kabupaten_kota || '',
        kecamatan: wilayah.kecamatan || '',
        desa_kelurahan: wilayah.desa || sData.desa_kelurahan || ''
      };

      try {
        const rows = parseDynamicExcel(filePath, expectedHeaders, schoolDataResolved);
        rows.forEach(r => {
          allRows.push(r);
        });
      } catch (err) {
        console.error(`Gagal parsing Excel sekolah ${sData.nama}:`, err);
      }
    }

    const tableHtml = generateDynamicHtmlTable(expectedHeaders, allRows, pelaporan.judul);

    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @media screen {
              body {
                background-color: #f3f4f6;
                margin: 0;
                padding: 40px 20px;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                font-family: Arial, sans-serif;
              }
              .document-page {
                background-color: #ffffff;
                width: 210mm;
                min-height: 297mm;
                padding: 20mm;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                box-sizing: border-box;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
              }
            }
            @media print {
              body {
                background-color: #ffffff;
                margin: 0;
                padding: 0;
              }
              .document-page {
                width: 100%;
                padding: 0;
                box-shadow: none;
                border: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="document-page">
            ${tableHtml}
          </div>
        </body>
      </html>
    `;

    return styledHtml;
  }

  async exportAllSekolahExcel(cadisdikId: string, pelaporanId: string): Promise<Buffer> {
    const pelaporan = await this.prisma.pelaporan.findFirst({
      where: { pelaporan_id: pelaporanId, cadisdik_id: cadisdikId },
      include: {
        pelaporan_sekolah: {
          include: {
            pelaporan_dokumen: {
              orderBy: { created_at: 'desc' }
            }
          }
        }
      }
    });

    if (!pelaporan) {
      throw new NotFoundException('Pelaporan tidak ditemukan');
    }

    const expectedHeaders = getTemplateHeaders(pelaporan.template_konten || '');
    if (!expectedHeaders || expectedHeaders.length === 0) {
      throw new BadRequestException('Template pelaporan ini tidak memiliki format kolom Excel.');
    }

    // Fetch all sekolah details at once
    const sekolahIds = pelaporan.pelaporan_sekolah.map(ps => ps.sekolah_id);
    const sekolahData = await this.prisma.sekolah.findMany({
      where: { sekolah_id: { in: sekolahIds } },
      include: { cadisdik: true }
    });

    const totalSiswaCounts = await this.prisma.pesertaDidik.groupBy({
      by: ['sekolah_id'],
      _count: true
    });
    const totalGtkCounts = await this.prisma.gtk.groupBy({
      by: ['sekolah_id'],
      _count: true
    });

    const totalSiswaMap = new Map(totalSiswaCounts.map(c => [c.sekolah_id, c._count]));
    const totalGtkMap = new Map(totalGtkCounts.map(c => [c.sekolah_id, c._count]));
    const sekolahMap = new Map(sekolahData.map(s => [s.sekolah_id, s]));

    const allRows: any[] = [];

    // Parse each school's upload
    for (const ps of pelaporan.pelaporan_sekolah) {
      const excelDoc = ps.pelaporan_dokumen.find(doc => 
        doc.nama_file.toLowerCase().endsWith('.xlsx') || 
        doc.nama_file.toLowerCase().endsWith('.xls')
      );

      if (!excelDoc) continue;

      const filePath = path.join(process.cwd(), excelDoc.file_url);
      if (!fs.existsSync(filePath)) continue;

      const sData = sekolahMap.get(ps.sekolah_id);
      if (!sData) continue;

      const totalSiswa = totalSiswaMap.get(ps.sekolah_id) || 0;
      const totalGtk = totalGtkMap.get(ps.sekolah_id) || 0;
      const wilayah = await this.resolveWilayahHierarchy(sData.kode_wilayah);

      const schoolDataResolved = {
        ...sData,
        total_siswa: totalSiswa,
        total_gtk: totalGtk,
        provinsi: wilayah.provinsi || '',
        kabupaten_kota: wilayah.kabupaten_kota || '',
        kecamatan: wilayah.kecamatan || '',
        desa_kelurahan: wilayah.desa || sData.desa_kelurahan || ''
      };

      try {
        const rows = parseDynamicExcel(filePath, expectedHeaders, schoolDataResolved);
        rows.forEach(r => {
          allRows.push(r);
        });
      } catch (err) {
        console.error(`Gagal parsing Excel sekolah ${sData.nama}:`, err);
      }
    }

    // Generate Combined XLSX
    const XLSX = require('xlsx');
    const wb = XLSX.utils.book_new();

    // Map rows to match columns and ensure Text formatting
    const formattedData = allRows.map((r, index) => {
      const rowObj: any = { 'No': String(index + 1) };
      expectedHeaders.forEach(h => {
        rowObj[h] = r[h] !== undefined && r[h] !== null ? String(r[h]).trim() : '';
      });
      return rowObj;
    });

    const ws = XLSX.utils.json_to_sheet(formattedData, {
      header: ['No', ...expectedHeaders]
    });

    // Ensure all cells are treated as Text format (@) to preserve leading zeros
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:A1');
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (ws[cellRef]) {
          ws[cellRef].t = 's'; // force text type
          ws[cellRef].z = '@'; // force text number format
        }
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Rekapitulasi');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
  }

  async updatePelaporan(cadisdikId: string, pelaporanId: string, dto: CreatePelaporanDto) {
    // 1. Check if any school has already uploaded documents
    const uploadedDocsCount = await this.prisma.pelaporanDokumen.count({
      where: {
        pelaporan_sekolah: {
          pelaporan_id: pelaporanId
        }
      }
    });

    if (uploadedDocsCount > 0) {
      throw new BadRequestException('Tidak dapat mengubah data pelaporan karena sudah ada sekolah yang mengunggah dokumen.');
    }

    return await this.prisma.$transaction(async (tx) => {
      // Update pelaporan fields
      const pelaporan = await tx.pelaporan.update({
        where: { pelaporan_id: pelaporanId, cadisdik_id: cadisdikId },
        data: {
          judul: dto.judul,
          deskripsi: dto.deskripsi,
          template_konten: dto.template_konten,
          tanggal_mulai: dto.tanggal_mulai ? new Date(dto.tanggal_mulai) : null,
          tanggal_selesai: dto.tanggal_selesai ? new Date(dto.tanggal_selesai) : null,
        },
      });

      // Update target schools
      // First, delete existing pelaporanSekolah associations
      await tx.pelaporanSekolah.deleteMany({
        where: { pelaporan_id: pelaporanId }
      });

      // Then create the new ones
      const pelaporanSekolahData = dto.sekolah_ids.map((sekolah_id) => ({
        pelaporan_id: pelaporanId,
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
}
