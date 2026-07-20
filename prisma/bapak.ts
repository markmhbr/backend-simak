import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrl = envContent.match(/DATABASE_URL="?([^"\n\r]*)"?/)?.[1];

if (!dbUrl) {
  console.error('DATABASE_URL tidak ditemukan di .env');
  process.exit(1);
}

// Tambahkan ssl rejectUnauthorized: false jika server memintanya
const pool = new Pool({ 
  connectionString: dbUrl,
  ssl: dbUrl.includes('sslmode=disable') ? false : { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const targetEmail = 'infoutep81@gmail.com';

  console.log(`--- Memulai reset authenticator_secret untuk email: ${targetEmail} ---`);

  // Menggunakan ExecuteRaw ke schema mandala secara eksplisit
  const updatedCount = await prisma.$executeRaw`
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