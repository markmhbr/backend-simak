const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Read DATABASE_URL from .env
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const match = envContent.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
if (!match) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}
const connectionString = match[1];

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const sekolahCount = await prisma.sekolah.count();
  const rombelCount = await prisma.rombonganBelajar.count();
  const siswaCount = await prisma.pesertaDidik.count();
  const gtkCount = await prisma.gtk.count();
  const penggunaCount = await prisma.pengguna.count();
  
  console.log('Sekolah count:', sekolahCount);
  console.log('Rombel count:', rombelCount);
  console.log('Siswa count:', siswaCount);
  console.log('GTK count:', gtkCount);
  console.log('Pengguna count:', penggunaCount);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
