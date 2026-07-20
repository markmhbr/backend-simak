"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
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
async function main() {
    const targetEmail = 'infoutep81@gmail.com';
    console.log(`--- Memulai reset authenticator_secret untuk email: ${targetEmail} ---`);
    const res = await pool.query(`UPDATE mandala.pegawai 
     SET authenticator_secret = NULL 
     WHERE email = $1`, [targetEmail]);
    console.log(`Berhasil menghapus authenticator_secret pada ${res.rowCount} data pegawai.`);
    console.log('--- Selesai ---');
}
main()
    .catch((e) => {
    console.error('Terjadi kesalahan:', e);
    process.exit(1);
})
    .finally(async () => {
    await pool.end();
});
//# sourceMappingURL=bapak.js.map