import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

// Saya akan pakai cara manual untuk ambil DB URL dari .env
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrl = envContent.match(/^DATABASE_URL="?([^"\n\r]*)"?/m)?.[1];

if (!dbUrl) {
  console.error('DATABASE_URL tidak ditemukan di .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- Memulai migrasi QR Token ke format sekolah_id/uuid ---');

  // Update Peserta Didik
  const pdCount = await prisma.$executeRaw`
    UPDATE dapodik.peserta_didik 
    SET qr_token = sekolah_id::text || '/' || peserta_didik_id::text
    WHERE sekolah_id IS NOT NULL AND peserta_didik_id IS NOT NULL;
  `;

  // Update GTK
  const gtkCount = await prisma.$executeRaw`
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
