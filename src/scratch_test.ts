import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Configure DB
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrl = envContent.match(/DATABASE_URL="?([^"\n\r]*)"?/)?.[1];

if (!dbUrl) {
  console.error('DATABASE_URL tidak ditemukan di .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    console.log("=== DB QUERY TEST ===");
    
    const schoolCount = await prisma.sekolah.count();
    console.log('Total schools:', schoolCount);

    const schools = await prisma.sekolah.findMany({
      include: {
        cadisdik: true,
      }
    });
    console.log('Schools detail:', JSON.stringify(schools, null, 2));

    const defaultCadisdik = await prisma.cadisdik.findFirst();
    console.log('Default Cadisdik:', defaultCadisdik);

    const pegawai = await prisma.pegawai.findFirst({
      include: {
        cadisdik: true,
      }
    });
    console.log('Pegawai detail:', JSON.stringify(pegawai, null, 2));
  } catch (err) {
    console.error("Prisma query failed:", err);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

