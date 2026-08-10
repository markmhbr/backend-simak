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
require("dotenv/config");
let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    try {
        const envPath = path.join(__dirname, '../.env');
        if (fs.existsSync(envPath)) {
            const dotenvContent = fs.readFileSync(envPath, 'utf-8');
            const dbUrlLine = dotenvContent.split('\n').find((l) => l.startsWith('DATABASE_URL='));
            if (dbUrlLine) {
                connectionString = dbUrlLine.split('=').slice(1).join('=').replace(/"/g, '').replace(/'/g, '').trim();
            }
        }
    }
    catch (err) {
        console.warn('Gagal membaca file .env secara manual:', err);
    }
}
let prisma;
let pool = null;
if (connectionString) {
    pool = new pg_1.Pool({ connectionString });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    prisma = new client_1.PrismaClient({ adapter });
}
else {
    prisma = new client_1.PrismaClient();
}
async function main() {
    console.log('=== SIMAK DATA CLEANUP & RESET SCRIPT ===\n');
    console.log('1. Memeriksa & memperbarui struktur tabel simak.menu_roles...');
    await prisma.$executeRawUnsafe(`
    ALTER TABLE simak.menu_roles 
    ADD COLUMN IF NOT EXISTS sekolah_id UUID NULL;
  `);
    await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS menu_roles_sekolah_id_idx 
    ON simak.menu_roles(sekolah_id);
  `);
    console.log('   ✓ Struktur tabel simak.menu_roles siap.');
    const unlinkedMenuRoles = await prisma.menuRole.count({
        where: { sekolah_id: null },
    });
    console.log(`   Ditemukan ${unlinkedMenuRoles} data menu_roles tanpa sekolah_id.`);
    if (unlinkedMenuRoles > 0) {
        const deletedMenuRoles = await prisma.menuRole.deleteMany({
            where: { sekolah_id: null },
        });
        console.log(`   ✓ Berhasil menghapus ${deletedMenuRoles.count} data menu_roles lama.`);
    }
    else {
        console.log('   ✓ Tidak ada data menu_roles lama tanpa sekolah_id.');
    }
    console.log('\n2. Menghapus SEMUA data Tugas Tambahan / Peran Tambahan...');
    const totalTugasCount = await prisma.tugasTambahan.count();
    console.log(`   Total data tugas tambahan saat ini: ${totalTugasCount}`);
    if (totalTugasCount > 0) {
        const deletedAllTugas = await prisma.tugasTambahan.deleteMany({});
        console.log(`   ✓ Berhasil menghapus total ${deletedAllTugas.count} data tugas tambahan dari database.`);
    }
    else {
        console.log('   ✓ Tabel tugas tambahan sudah bersih/kosong.');
    }
    console.log('\n3. Ringkasan data aktif per sekolah setelah reset:');
    const groupedMenuRoles = await prisma.menuRole.groupBy({
        by: ['sekolah_id'],
        _count: { menu_role_id: true },
    });
    const remainingTugasCount = await prisma.tugasTambahan.count();
    console.log('   a) Menu Roles:');
    if (groupedMenuRoles.length === 0) {
        console.log('      - Belum ada menu roles per sekolah.');
    }
    else {
        for (const item of groupedMenuRoles) {
            console.log(`      - Sekolah ID [${item.sekolah_id}]: ${item._count.menu_role_id} item menu`);
        }
    }
    console.log(`   b) Total Tugas/Peran Tambahan tersisa: ${remainingTugasCount}`);
    console.log('\n=== RESET SELESAI ===');
}
main()
    .catch((e) => {
    console.error('Error saat menjalankan script cleanup:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    if (pool) {
        await pool.end();
    }
});
//# sourceMappingURL=clean-menu-roles.js.map