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
const pool = new pg_1.Pool({
    connectionString: dbUrl,
    ssl: dbUrl.includes('sslmode=disable') ? false : { rejectUnauthorized: false }
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const targetEmail = 'infoutep81@gmail.com';
    console.log(`--- Memulai reset authenticator_secret untuk email: ${targetEmail} ---`);
    const updatedCount = await prisma.$executeRaw `
    UPDATE mandala.pegawai 
    SET authenticator_secret = NULL 
    WHERE email = ${targetEmail}
  `;
    console.log(`Berhasil menghapus authenticator_secret pada ${updatedCount} data pegawai.`);
    console.log('--- Selesai ---');
}
main()
    .catch((e) => {
    console.error('Terjadi kesalahan:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=bapak.js.map