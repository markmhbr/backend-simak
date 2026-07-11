import * as XLSX from 'xlsx';
import * as fs from 'fs';

export interface StudentRow {
  nisn: string;
  nama: string;
}

/**
 * Validates the excel file to ensure that A1 is "nisn" and B1 is "nama siswa"
 */
export function validateExcelHeader(filePathOrBuffer: string | Buffer): boolean {
  try {
    let workbook: XLSX.WorkBook;
    if (Buffer.isBuffer(filePathOrBuffer)) {
      workbook = XLSX.read(filePathOrBuffer, { type: 'buffer' });
    } else {
      if (!fs.existsSync(filePathOrBuffer)) {
        return false;
      }
      workbook = XLSX.readFile(filePathOrBuffer);
    }
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Read cells A1 and B1
    const a1 = worksheet['A1']?.v?.toString().trim().toLowerCase();
    const b1 = worksheet['B1']?.v?.toString().trim().toLowerCase();

    return a1 === 'nisn' && b1 === 'nama siswa';
  } catch (error) {
    console.error('Error validating Excel header:', error);
    return false;
  }
}

/**
 * Parses the Excel file and extracts student rows.
 */
export function parseExcelData(filePathOrBuffer: string | Buffer): StudentRow[] {
  try {
    let workbook: XLSX.WorkBook;
    if (Buffer.isBuffer(filePathOrBuffer)) {
      workbook = XLSX.read(filePathOrBuffer, { type: 'buffer' });
    } else {
      if (!fs.existsSync(filePathOrBuffer)) {
        return [];
      }
      workbook = XLSX.readFile(filePathOrBuffer);
    }
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    const students: StudentRow[] = [];
    for (const row of rawData as any[]) {
      // Find key names regardless of letter casing
      const keys = Object.keys(row);
      const nisnKey = keys.find(k => k.toLowerCase().trim() === 'nisn');
      const namaKey = keys.find(k => k.toLowerCase().trim() === 'nama siswa');

      if (nisnKey && namaKey) {
        const nisn = row[nisnKey]?.toString().trim() || '';
        const nama = row[namaKey]?.toString().trim() || '';
        if (nisn || nama) {
          students.push({ nisn, nama });
        }
      }
    }
    return students;
  } catch (error) {
    console.error('Error parsing Excel data:', error);
    return [];
  }
}

/**
 * Generates an HTML Table string from parsed student rows.
 */
export function generateHtmlTable(students: StudentRow[]): string {
  if (students.length === 0) {
    return `<div style="text-align: center; color: #888; padding: 10px; border: 1px dashed #ccc; border-radius: 4px;">Tidak ada data siswa terlampir / Excel kosong</div>`;
  }

  let rows = '';
  students.forEach((student, index) => {
    rows += `
      <tr style="border-bottom: 1px solid #e2e8f0;">
        <td style="padding: 8px; text-align: center; font-size: 14px;">${index + 1}</td>
        <td style="padding: 8px; text-align: center; font-size: 14px; font-family: monospace;">${student.nisn}</td>
        <td style="padding: 8px; text-align: left; font-size: 14px;">${student.nama}</td>
      </tr>
    `;
  });

  return `
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; margin-top: 15px; margin-bottom: 15px;">
      <thead>
        <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
          <th style="padding: 10px; font-weight: 600; text-align: center; font-size: 14px; width: 8%;">No</th>
          <th style="padding: 10px; font-weight: 600; text-align: center; font-size: 14px; width: 30%;">NISN</th>
          <th style="padding: 10px; font-weight: 600; text-align: left; font-size: 14px;">Nama Siswa</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/**
 * Generates HTML Table Rows only, allowing users to define their own table headers in the template.
 */
export function generateHtmlTableRows(students: StudentRow[]): string {
  if (students.length === 0) {
    return `<tr><td colspan="3" style="padding: 10px; text-align: center; color: #888;">Tidak ada data siswa terlampir</td></tr>`;
  }

  let rows = '';
  students.forEach((student, index) => {
    rows += `
      <tr>
        <td style="padding: 8px; text-align: center;">${index + 1}</td>
        <td style="padding: 8px; text-align: center; font-family: monospace;">${student.nisn}</td>
        <td style="padding: 8px; text-align: left;">${student.nama}</td>
      </tr>
    `;
  });
  return rows;
}

export function getTemplateHeaders(templateKonten?: string): string[] | null {
  if (!templateKonten) return null;
  const match = templateKonten.match(/data-excel-headers="([^"]+)"/);
  if (!match) return null;
  return match[1].split(',').map(h => h.trim()).filter(Boolean);
}

const AUTO_FIELDS_MAP: Record<string, string> = {
  cadisdikwilayah: "cadisdik",
  cadisdik: "cadisdik",
  provinsi: "provinsi",
  kabupatenkota: "kabupaten_kota",
  kabupaten: "kabupaten_kota",
  kota: "kabupaten_kota",
  kecamatan: "kecamatan",
  desakelurahan: "desa_kelurahan",
  desa: "desa_kelurahan",
  kelurahan: "desa_kelurahan",
  npsn: "npsn",
  npsnsekolah: "npsn",
  namasekolah: "nama",
  sekolah: "nama",
  nama: "nama",
  bentukpendidikan: "bentuk_pendidikan",
  statussekolah: "status_sekolah",
  alamatjalan: "alamat_jalan",
  alamat: "alamat_jalan",
  emailsekolah: "email",
  email: "email",
  nomortelepon: "nomor_telepon",
  telepon: "nomor_telepon",
  website: "website",
  totalsiswa: "total_siswa",
  siswa: "total_siswa",
  totalgurugtk: "total_gtk",
  gtk: "total_gtk",
  guru: "total_gtk"
};

export function isAutoField(header: string): boolean {
  const norm = header.toLowerCase().replace(/[^a-z0-9]/g, "");
  return norm in AUTO_FIELDS_MAP;
}

export function validateDynamicExcel(filePathOrBuffer: string | Buffer, expectedHeaders: string[]): { isValid: boolean; error?: string } {
  try {
    let workbook: XLSX.WorkBook;
    if (Buffer.isBuffer(filePathOrBuffer)) {
      workbook = XLSX.read(filePathOrBuffer, { type: 'buffer' });
    } else {
      if (!fs.existsSync(filePathOrBuffer)) {
        return { isValid: false, error: 'Berkas tidak ditemukan' };
      }
      workbook = XLSX.readFile(filePathOrBuffer);
    }
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    if (rawData.length === 0) {
      const firstRowKeys: string[] = [];
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c: col });
        const cellVal = worksheet[cellRef]?.v?.toString().trim();
        if (cellVal) firstRowKeys.push(cellVal.toLowerCase().replace(/[^a-z0-9]/g, ""));
      }

      const manualExpected = expectedHeaders.filter(h => !isAutoField(h)).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
      const missing = manualExpected.filter(exp => !firstRowKeys.includes(exp));
      if (missing.length > 0) {
        return {
          isValid: false,
          error: `Header kolom tidak sesuai template. Pastikan kolom manual berikut ada di baris pertama Excel Anda: ${expectedHeaders.filter(h => !isAutoField(h)).join(", ")}`
        };
      }
      return { isValid: true };
    }

    const keys = Object.keys(rawData[0]).map(k => k.toLowerCase().replace(/[^a-z0-9]/g, ""));
    const manualExpected = expectedHeaders.filter(h => !isAutoField(h)).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ""));

    const missing = manualExpected.filter(exp => !keys.includes(exp));
    if (missing.length > 0) {
      return {
        isValid: false,
        error: `Kolom wajib pengisian sekolah tidak lengkap. Kolom berikut harus ada: ${expectedHeaders.filter(h => !isAutoField(h)).join(", ")}`
      };
    }

    return { isValid: true };
  } catch (error: any) {
    return { isValid: false, error: error.message || 'Gagal membaca berkas Excel' };
  }
}

export function parseDynamicExcel(filePathOrBuffer: string | Buffer, expectedHeaders: string[], schoolData: any): any[] {
  try {
    let workbook: XLSX.WorkBook;
    if (Buffer.isBuffer(filePathOrBuffer)) {
      workbook = XLSX.read(filePathOrBuffer, { type: 'buffer' });
    } else {
      if (!fs.existsSync(filePathOrBuffer)) return [];
      workbook = XLSX.readFile(filePathOrBuffer);
    }
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rawData = XLSX.utils.sheet_to_json(worksheet);

    const rows: any[] = [];
    for (const rawRow of rawData as any[]) {
      const rowKeys = Object.keys(rawRow);

      // Check if the row has any manual data filled (ignore if all manual fields are empty)
      const hasManualData = expectedHeaders.some(header => {
        if (isAutoField(header)) return false;
        const norm = header.toLowerCase().replace(/[^a-z0-9]/g, "");
        const matchKey = rowKeys.find(rk => {
          const cleanK = rk.toLowerCase().replace(/[^a-z0-9]/g, "");
          return cleanK === norm || cleanK === 'no' || cleanK === 'nomor';
        });
        // Skip comparing the index/no column itself as manual data
        const cleanHeaderNorm = header.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (cleanHeaderNorm === 'no' || cleanHeaderNorm === 'nomor') return false;
        
        const val = matchKey ? rawRow[matchKey]?.toString().trim() : '';
        return val && val !== '' && val !== '[OTOMATIS DARI DB]';
      });

      if (!hasManualData) {
        continue;
      }

      const parsedRow: Record<string, string> = {};

      expectedHeaders.forEach(header => {
        const norm = header.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (isAutoField(header)) {
          const dbKey = AUTO_FIELDS_MAP[norm];
          let val = schoolData[dbKey] || '';
          if (dbKey === 'bentuk_pendidikan') {
            const map: Record<number, string> = {
              1: 'TK', 5: 'SD', 6: 'SMP', 13: 'SMA', 15: 'SMK', 16: 'PNF', 17: 'SLB',
              34: 'SPK SD', 35: 'SPK SMP', 36: 'SPK SMA',
            };
            val = map[schoolData.bentuk_pendidikan_id] || '';
          } else if (dbKey === 'status_sekolah') {
            val = schoolData.status_sekolah === '1' ? 'Negeri' : (schoolData.status_sekolah === '2' ? 'Swasta' : schoolData.status_sekolah);
          } else if (dbKey === 'cadisdik') {
            val = schoolData.cadisdik?.nama_instansi || '';
          }
          parsedRow[header] = val.toString();
        } else {
          const matchKey = rowKeys.find(rk => rk.toLowerCase().replace(/[^a-z0-9]/g, "") === norm);
          parsedRow[header] = matchKey ? rawRow[matchKey]?.toString().trim() || '' : '';
        }
      });

      rows.push(parsedRow);
    }

    return rows;
  } catch (error) {
    console.error('Error parsing dynamic Excel data:', error);
    return [];
  }
}

export function generateDynamicHtmlTable(headers: string[], rows: any[], title?: string): string {
  if (rows.length === 0) {
    return `<div style="text-align: center; color: #888; padding: 15px; border: 1px dashed #ccc; border-radius: 6px;">Tidak ada data isian terlampir / Excel kosong</div>`;
  }

  let headCols = `<th style="padding: 6px 8px; border: 1px solid #272727ff; font-weight: 600; text-align: center; font-size: 10px; width: 6%;">No</th>`;
  headers.forEach(h => {
    headCols += `<th style="padding: 6px 8px; border: 1px solid #272727ff; font-weight: 600; text-align: left; font-size: 10px;">${h}</th>`;
  });

  const theadHtml = `<thead><tr style="background-color: #f8fafc; border-bottom: 1px solid #272727ff;">${headCols}</tr></thead>`;

  // Split rows into chunks of ~25 rows per A4 page
  const ROWS_PER_PAGE = 25;
  const chunks: any[][] = [];
  for (let i = 0; i < rows.length; i += ROWS_PER_PAGE) {
    chunks.push(rows.slice(i, i + ROWS_PER_PAGE));
  }

  const tables = chunks.map((chunk, chunkIdx) => {
    const firstTableTitle = chunkIdx === 0 && title ? `<div style="font-family: Arial, sans-serif; font-size: 11px; font-weight: bold; margin-bottom: 8px; color: #333;">Lampiran : ${title}</div>` : '';
    let rowLines = '';
    chunk.forEach((row, index) => {
      const globalIndex = chunkIdx * ROWS_PER_PAGE + index + 1;
      let cells = `<td style="padding: 4px 6px; border: 1px solid #272727ff; text-align: center; font-size: 10px;">${globalIndex}</td>`;
      headers.forEach(h => {
        cells += `<td style="padding: 4px 6px; border: 1px solid #272727ff; text-align: left; font-size: 10px;">${row[h] || ''}</td>`;
      });
      rowLines += `<tr>${cells}</tr>`;
    });

    return `
      ${firstTableTitle}
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #272727ff; margin-top: 10px; margin-bottom: 10px;">
        ${theadHtml}
        <tbody>
          ${rowLines}
        </tbody>
      </table>
    `;
  });

  // Join tables with page-break dividers between them
  return tables.join('<div style="page-break-after: always; break-after: page;"></div>');
}
