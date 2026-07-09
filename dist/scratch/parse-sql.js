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
                else {
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
const parsed = parseSqlFile(sqlPath);
console.log('Parsed rows count:', parsed.length);
console.log('Sample parsed row 0:', parsed[0]);
console.log('Sample parsed row 1:', parsed[1]);
//# sourceMappingURL=parse-sql.js.map