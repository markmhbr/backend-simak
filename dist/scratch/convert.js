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
const fs = __importStar(require("fs"));
const sqlPath = 'c:\\Users\\hexa8\\Downloads\\pegawai_kcds.sql';
const jsonOutputPath = 'c:\\Users\\hexa8\\Downloads\\pegawai_kcds.json';
const EXCLUDE_NAMES = [
    'Dr. EDEN ROMANSYAH, S.Pd, M.M',
    'AGUS SUHERI, S.Pt., M.P.',
    'Drs. Marsudi, M.Pd'
];
function parseSqlFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const valuesStart = content.indexOf('VALUES');
    if (valuesStart === -1) {
        throw new Error('Could not find VALUES clause in SQL file.');
    }
    const valuesText = content.substring(valuesStart + 6).trim();
    const rows = [];
    let currentWord = '';
    let inQuotes = false;
    let quoteChar = '';
    let inRow = false;
    let currentRowValues = [];
    for (let i = 0; i < valuesText.length; i++) {
        const char = valuesText[i];
        if (inQuotes) {
            if (char === '\\') {
                currentWord += char + (valuesText[i + 1] || '');
                i++;
            }
            else if (char === quoteChar) {
                inQuotes = false;
            }
            else {
                currentWord += char;
            }
        }
        else {
            if (char === "'" || char === '"') {
                inQuotes = true;
                quoteChar = char;
            }
            else if (char === '(') {
                if (!inRow) {
                    inRow = true;
                    currentRowValues = [];
                    currentWord = '';
                }
                else {
                    currentWord += char;
                }
            }
            else if (char === ')') {
                if (inRow) {
                    currentRowValues.push(currentWord.trim());
                    rows.push(currentRowValues);
                    inRow = false;
                }
            }
            else if (char === ',') {
                if (inRow) {
                    currentRowValues.push(currentWord.trim());
                    currentWord = '';
                }
            }
            else if (char === ';') {
                if (inRow) {
                    currentRowValues.push(currentWord.trim());
                    rows.push(currentRowValues);
                    inRow = false;
                }
                break;
            }
            else {
                currentWord += char;
            }
        }
    }
    return rows;
}
function cleanValue(val) {
    if (!val || val === 'NULL')
        return null;
    return val;
}
async function main() {
    const parsed = parseSqlFile(sqlPath);
    const mapped = parsed
        .map((row) => {
        const rawNik = cleanValue(row[3]);
        const rawTempatLahir = cleanValue(row[4]);
        const rawTanggalLahir = cleanValue(row[5]);
        const jenisKelaminStr = cleanValue(row[6]);
        const nip = cleanValue(row[7]);
        const rawEmail = cleanValue(row[11]);
        const rawAlamat = cleanValue(row[12]);
        const nik = rawNik || (nip ? nip.substring(0, 16) : '3273' + Math.random().toString().substring(2, 14));
        const tempat_lahir = rawTempatLahir || 'Bandung';
        let tanggal_lahir = rawTanggalLahir;
        if (!tanggal_lahir && nip && nip.length >= 8) {
            const yyyy = nip.substring(0, 4);
            const mm = nip.substring(4, 6);
            const dd = nip.substring(6, 8);
            tanggal_lahir = `${yyyy}-${mm}-${dd}`;
        }
        if (!tanggal_lahir) {
            tanggal_lahir = '1980-01-01';
        }
        const alamat_lengkap = rawAlamat || '-';
        const email = rawEmail || `${nip}@simak.go.id`;
        const jenis_kelamin = jenisKelaminStr === 'P' ? 2 : 1;
        const jabatan = 6;
        return {
            cadisdik_id: 'a7d04456-3fc8-4153-b0f3-b30a730075d8',
            nama_lengkap: row[2],
            nik,
            tempat_lahir,
            tanggal_lahir,
            alamat_lengkap,
            nip,
            email,
            password: 'mandala123',
            jabatan,
            jenis_kelamin
        };
    })
        .filter((item) => {
        return !EXCLUDE_NAMES.includes(item.nama_lengkap);
    });
    fs.writeFileSync(jsonOutputPath, JSON.stringify(mapped, null, 2), 'utf-8');
    console.log(`Successfully generated JSON with ${mapped.length} records (excluded ${EXCLUDE_NAMES.length} existing records).`);
    console.log(`Saved to: ${jsonOutputPath}`);
}
main().catch(console.error);
//# sourceMappingURL=convert.js.map