"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrl = envContent.match(/^DATABASE_URL="?([^"\n\r]*)"?/m)?.[1];
if (!dbUrl) {
    console.error('DATABASE_URL tidak ditemukan di .env');
    process.exit(1);
}
const pool = new pg_1.Pool({ connectionString: dbUrl });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('--- Memulai migrasi QR Token ke format sekolah_id/uuid ---');
    const pdCount = await prisma.$executeRaw `
    UPDATE dapodik.peserta_didik 
    SET qr_token = sekolah_id::text || '/' || peserta_didik_id::text
    WHERE sekolah_id IS NOT NULL AND peserta_didik_id IS NOT NULL;
  `;
    const gtkCount = await prisma.$executeRaw `
    UPDATE dapodik.gtks 
    SET qr_token = sekolah_id::text || '/' || ptk_id::text
    WHERE sekolah_id IS NOT NULL AND ptk_id IS NOT NULL;
  `;
    console.log(`Berhasil update ${pdCount} Siswa dan ${gtkCount} GTK ke format [sekolah_id/uuid].`);
    console.log('--- Migrasi selesai ---');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=migrate-qr-tokens.js.map