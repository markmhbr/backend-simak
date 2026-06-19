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
  const layanans = await prisma.layanan.findMany({
    include: {
      syarat: true,
    },
  });
  console.log("=== LAYANAN MASTER ===");
  console.log(JSON.stringify(layanans, null, 2));

  const permohonans = await prisma.permohonanLayanan.findMany({
    include: {
      layanan: {
        include: {
          syarat: true,
        },
      },
      permohonan_layanan_file: true,
    },
  });
  console.log("=== PERMOHONAN LAYANAN ===");
  console.log(JSON.stringify(permohonans, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
