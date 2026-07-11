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
