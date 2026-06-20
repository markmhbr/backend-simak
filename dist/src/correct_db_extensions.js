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
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrl = envContent.match(/DATABASE_URL="?([^"\n\r]*)"?/)?.[1];
if (!dbUrl) {
    console.error('DATABASE_URL tidak ditemukan di .env');
    process.exit(1);
}
const pool = new pg_1.Pool({ connectionString: dbUrl });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log("=== MEMULAI KOREKSI EKSTENSI FILE DATABASE ===");
    const files = await prisma.permohonanLayananFile.findMany();
    console.log(`Menemukan ${files.length} record permohonan file.`);
    let updatedFilesCount = 0;
    for (const f of files) {
        if (!f.file_url)
            continue;
        const fileExt = path.extname(f.file_url).toLowerCase();
        if (fileExt !== '.jpg' && fileExt !== '.pdf') {
            const fullPath = path.join(process.cwd(), f.file_url.replace(/^\//, ''));
            if (!fs.existsSync(fullPath)) {
                const baseName = path.parse(fullPath).name;
                const dirName = path.dirname(fullPath);
                const jpgFullPath = path.join(dirName, `${baseName}.jpg`);
                if (fs.existsSync(jpgFullPath)) {
                    const newUrl = f.file_url.replace(new RegExp(`\\${fileExt}$`, 'i'), '.jpg');
                    const newName = f.nama_file.replace(new RegExp(`\\${fileExt}$`, 'i'), '.jpg');
                    console.log(`Mengoreksi permohonan file id: ${f.permohonan_layanan_file_id}`);
                    console.log(`  Dari: ${f.file_url}`);
                    console.log(`  Ke  : ${newUrl}`);
                    await prisma.permohonanLayananFile.update({
                        where: { permohonan_layanan_file_id: f.permohonan_layanan_file_id },
                        data: {
                            nama_file: newName,
                            file_url: newUrl,
                        }
                    });
                    updatedFilesCount++;
                }
            }
        }
    }
    console.log(`Selesai memproses permohonan file. Terkoreksi: ${updatedFilesCount} file.`);
    console.log("=== KOREKSI SELESAI ===");
}
main()
    .catch((e) => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=correct_db_extensions.js.map