"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateExcelHeader = validateExcelHeader;
exports.parseExcelData = parseExcelData;
exports.generateHtmlTable = generateHtmlTable;
exports.generateHtmlTableRows = generateHtmlTableRows;
exports.getTemplateHeaders = getTemplateHeaders;
exports.isAutoField = isAutoField;
exports.validateDynamicExcel = validateDynamicExcel;
exports.parseDynamicExcel = parseDynamicExcel;
exports.generateDynamicHtmlTable = generateDynamicHtmlTable;
const XLSX = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
function validateExcelHeader(filePathOrBuffer) {
    try {
        let workbook;
        if (Buffer.isBuffer(filePathOrBuffer)) {
            workbook = XLSX.read(filePathOrBuffer, { type: 'buffer' });
        }
        else {
            if (!fs.existsSync(filePathOrBuffer)) {
                return false;
            }
            workbook = XLSX.readFile(filePathOrBuffer);
        }
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const a1 = worksheet['A1']?.v?.toString().trim().toLowerCase();
        const b1 = worksheet['B1']?.v?.toString().trim().toLowerCase();
        return a1 === 'nisn' && b1 === 'nama siswa';
    }
    catch (error) {
        console.error('Error validating Excel header:', error);
        return false;
    }
}
function parseExcelData(filePathOrBuffer) {
    try {
        let workbook;
        if (Buffer.isBuffer(filePathOrBuffer)) {
            workbook = XLSX.read(filePathOrBuffer, { type: 'buffer' });
        }
        else {
            if (!fs.existsSync(filePathOrBuffer)) {
                return [];
            }
            workbook = XLSX.readFile(filePathOrBuffer);
        }
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet);
        const students = [];
        for (const row of rawData) {
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
    }
    catch (error) {
        console.error('Error parsing Excel data:', error);
        return [];
    }
}
function generateHtmlTable(students) {
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
function generateHtmlTableRows(students) {
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
function getTemplateHeaders(templateKonten) {
    if (!templateKonten)
        return null;
    const match = templateKonten.match(/data-excel-headers="([^"]+)"/);
    if (!match)
        return null;
    return match[1].split(',').map(h => h.trim()).filter(Boolean);
}
const AUTO_FIELDS_MAP = {
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
function isAutoField(header) {
    const norm = header.toLowerCase().replace(/[^a-z0-9]/g, "");
    return norm in AUTO_FIELDS_MAP;
}
function validateDynamicExcel(filePathOrBuffer, expectedHeaders) {
    try {
        let workbook;
        if (Buffer.isBuffer(filePathOrBuffer)) {
            workbook = XLSX.read(filePathOrBuffer, { type: 'buffer' });
        }
        else {
            if (!fs.existsSync(filePathOrBuffer)) {
                return { isValid: false, error: 'Berkas tidak ditemukan' };
            }
            workbook = XLSX.readFile(filePathOrBuffer);
        }
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet);
        if (rawData.length === 0) {
            const firstRowKeys = [];
            const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c: col });
                const cellVal = worksheet[cellRef]?.v?.toString().trim();
                if (cellVal)
                    firstRowKeys.push(cellVal.toLowerCase().replace(/[^a-z0-9]/g, ""));
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
    }
    catch (error) {
        return { isValid: false, error: error.message || 'Gagal membaca berkas Excel' };
    }
}
function parseDynamicExcel(filePathOrBuffer, expectedHeaders, schoolData) {
    try {
        let workbook;
        if (Buffer.isBuffer(filePathOrBuffer)) {
            workbook = XLSX.read(filePathOrBuffer, { type: 'buffer' });
        }
        else {
            if (!fs.existsSync(filePathOrBuffer))
                return [];
            workbook = XLSX.readFile(filePathOrBuffer);
        }
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet);
        const rows = [];
        for (const rawRow of rawData) {
            const parsedRow = {};
            const rowKeys = Object.keys(rawRow);
            expectedHeaders.forEach(header => {
                const norm = header.toLowerCase().replace(/[^a-z0-9]/g, "");
                if (isAutoField(header)) {
                    const dbKey = AUTO_FIELDS_MAP[norm];
                    let val = schoolData[dbKey] || '';
                    if (dbKey === 'bentuk_pendidikan') {
                        const map = {
                            1: 'TK', 5: 'SD', 6: 'SMP', 13: 'SMA', 15: 'SMK', 16: 'PNF', 17: 'SLB',
                            34: 'SPK SD', 35: 'SPK SMP', 36: 'SPK SMA',
                        };
                        val = map[schoolData.bentuk_pendidikan_id] || '';
                    }
                    else if (dbKey === 'status_sekolah') {
                        val = schoolData.status_sekolah === '1' ? 'Negeri' : (schoolData.status_sekolah === '2' ? 'Swasta' : schoolData.status_sekolah);
                    }
                    else if (dbKey === 'cadisdik') {
                        val = schoolData.cadisdik?.nama_instansi || '';
                    }
                    parsedRow[header] = val.toString();
                }
                else {
                    const matchKey = rowKeys.find(rk => rk.toLowerCase().replace(/[^a-z0-9]/g, "") === norm);
                    parsedRow[header] = matchKey ? rawRow[matchKey]?.toString().trim() || '' : '';
                }
            });
            rows.push(parsedRow);
        }
        return rows;
    }
    catch (error) {
        console.error('Error parsing dynamic Excel data:', error);
        return [];
    }
}
function generateDynamicHtmlTable(headers, rows) {
    if (rows.length === 0) {
        return `<div style="text-align: center; color: #888; padding: 15px; border: 1px dashed #ccc; border-radius: 6px;">Tidak ada data isian terlampir / Excel kosong</div>`;
    }
    let headCols = `<th style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600; text-align: center; font-size: 14px; width: 8%;">No</th>`;
    headers.forEach(h => {
        headCols += `<th style="padding: 10px; border: 1px solid #cbd5e1; font-weight: 600; text-align: left; font-size: 14px;">${h}</th>`;
    });
    let rowLines = '';
    rows.forEach((row, index) => {
        let cells = `<td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-size: 14px;">${index + 1}</td>`;
        headers.forEach(h => {
            cells += `<td style="padding: 8px; border: 1px solid #cbd5e1; text-align: left; font-size: 14px;">${row[h] || ''}</td>`;
        });
        rowLines += `<tr style="border-bottom: 1px solid #e2e8f0;">${cells}</tr>`;
    });
    return `
    <table style="width: 100%; border-collapse: collapse; border: 1px solid #cbd5e1; margin-top: 15px; margin-bottom: 15px;">
      <thead>
        <tr style="background-color: #f8fafc; border-bottom: 2px solid #cbd5e1;">
          ${headCols}
        </tr>
      </thead>
      <tbody>
        ${rowLines}
      </tbody>
    </table>
  `;
}
//# sourceMappingURL=excel-html-generator.helper.js.map