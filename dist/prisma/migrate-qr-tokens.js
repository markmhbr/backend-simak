"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const fs = require('fs');
const path = require('path');
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
    console.log('--- Memulai migrasi QR Token untuk data eksis ---');
    const appKeys = await prisma.appKey.findMany({
        where: {
            domain: { not: null },
            NOT: { domain: '' }
        }
    });
    console.log(`Ditemukan ${appKeys.length} sekolah dengan domain terkonfigurasi.`);
    for (const key of appKeys) {
        let domain = key.domain.replace(/\/+$/, '');
        if (!domain.startsWith('http://') && !domain.startsWith('https://')) {
            domain = `https://${domain}`;
        }
        const sekolahId = key.sekolah_id;
        console.log(`Memproses sekolah: ${key.nama_app} (${domain})`);
        const pdCount = await prisma.$executeRaw `
      UPDATE dapodik.peserta_didik 
      SET qr_token = ${domain} || '/' || peserta_didik_id::text
      WHERE sekolah_id = ${sekolahId}::uuid
    `;
        const gtkCount = await prisma.$executeRaw `
      UPDATE dapodik.gtks 
      SET qr_token = ${domain} || '/' || ptk_id::text
      WHERE sekolah_id = ${sekolahId}::uuid
    `;
        console.log(`   - Berhasil update ${pdCount} Siswa dan ${gtkCount} GTK.`);
    }
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