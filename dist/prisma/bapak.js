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
    const targetEmail = 'infoutep81@gmail.com';
    console.log(`--- Memulai reset authenticator_secret untuk email: ${targetEmail} ---`);
    const result = await prisma.pegawai.updateMany({
        where: {
            email: targetEmail,
        },
        data: {
            authenticator_secret: null,
        },
    });
    if (result.count > 0) {
        console.log(`Berhasil menghapus authenticator_secret untuk ${result.count} data pegawai.`);
    }
    else {
        console.log(`Tidak ditemukan pegawai dengan email: ${targetEmail}`);
    }
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