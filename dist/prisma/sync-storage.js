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
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const dotenvContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8');
const dbUrlLine = dotenvContent.split('\n').find((l) => l.startsWith('DATABASE_URL='));
const dbUrlValue = dbUrlLine ? dbUrlLine.split('=')[1].replace(/"/g, '').trim() : '';
const pool = new pg_1.Pool({ connectionString: dbUrlValue });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const STORAGE_ROOT = path.join(__dirname, '../storage');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function syncStorageToDatabase() {
    console.log('🔄 Memulai sinkronisasi path storage ke database...');
    if (!fs.existsSync(STORAGE_ROOT)) {
        console.error(`❌ Folder storage tidak ditemukan di: ${STORAGE_ROOT}`);
        return;
    }
    const sekolahDirs = fs.readdirSync(STORAGE_ROOT);
    for (const sekolahId of sekolahDirs) {
        if (!uuidRegex.test(sekolahId))
            continue;
        const sekolahPath = path.join(STORAGE_ROOT, sekolahId);
        if (!fs.statSync(sekolahPath).isDirectory())
            continue;
        console.log(`\n🏫 Memproses sekolah: ${sekolahId}`);
        const categoryDirs = fs.readdirSync(sekolahPath);
        for (const category of categoryDirs) {
            const categoryPath = path.join(sekolahPath, category);
            if (!fs.statSync(categoryPath).isDirectory())
                continue;
            if (category === 'gtk') {
                await syncGtk(sekolahId, categoryPath);
            }
            else if (category === 'peserta_didik' || category === 'siswa') {
                await syncPesertaDidik(sekolahId, categoryPath, category);
            }
        }
    }
    console.log('\n✅ Sinkronisasi selesai!');
}
async function syncGtk(sekolahId, gtkFolderPath) {
    const ptkDirs = fs.readdirSync(gtkFolderPath);
    for (const ptkId of ptkDirs) {
        if (!uuidRegex.test(ptkId))
            continue;
        const ptkPath = path.join(gtkFolderPath, ptkId);
        if (!fs.statSync(ptkPath).isDirectory())
            continue;
        const files = fs.readdirSync(ptkPath);
        const imageFile = files.find(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        if (imageFile) {
            const relativePath = `/storage/${sekolahId}/gtk/${ptkId}/${imageFile}`;
            try {
                const exist = await prisma.gtk.findUnique({
                    where: { ptk_id: ptkId }
                });
                if (exist) {
                    await prisma.gtk.update({
                        where: { ptk_id: ptkId },
                        data: { foto: relativePath }
                    });
                    console.log(`  🟢 GTK [${ptkId}]: Berhasil update foto ke -> ${relativePath}`);
                }
                else {
                    console.log(`  🟡 GTK [${ptkId}]: Tidak ditemukan di database (skip)`);
                }
            }
            catch (err) {
                console.error(`  🔴 GTK [${ptkId}]: Gagal update database:`, err.message);
            }
        }
    }
}
async function syncPesertaDidik(sekolahId, pdFolderPath, folderName) {
    const pdDirs = fs.readdirSync(pdFolderPath);
    for (const pdId of pdDirs) {
        if (!uuidRegex.test(pdId))
            continue;
        const pdPath = path.join(pdFolderPath, pdId);
        if (!fs.statSync(pdPath).isDirectory())
            continue;
        const files = fs.readdirSync(pdPath);
        const imageFile = files.find(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
        if (imageFile) {
            const relativePath = `/storage/${sekolahId}/${folderName}/${pdId}/${imageFile}`;
            try {
                const exist = await prisma.pesertaDidik.findUnique({
                    where: { peserta_didik_id: pdId }
                });
                if (exist) {
                    await prisma.pesertaDidik.update({
                        where: { peserta_didik_id: pdId },
                        data: { foto: relativePath }
                    });
                    console.log(`  🟢 PD [${pdId}]: Berhasil update foto ke -> ${relativePath}`);
                }
                else {
                    console.log(`  🟡 PD [${pdId}]: Tidak ditemukan di database (skip)`);
                }
            }
            catch (err) {
                console.error(`  🔴 PD [${pdId}]: Gagal update database:`, err.message);
            }
        }
    }
}
syncStorageToDatabase()
    .catch(err => {
    console.error('❌ Error fatal saat menjalankan sync:', err);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=sync-storage.js.map