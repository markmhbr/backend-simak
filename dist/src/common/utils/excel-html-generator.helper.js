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
//# sourceMappingURL=excel-html-generator.helper.js.map