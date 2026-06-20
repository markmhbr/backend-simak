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
    const student = await prisma.pesertaDidik.findFirst({
      where: {
        AND: [
          { peserta_didik_id: '53586a6a-2227-11e4-8102-4f35510c698d' },
          { sekolah_id: '8f7c90fd-3517-46f7-98a7-56df1b5bf2c3' }
        ]
      },
      include: {
        penggunas: {
          select: { email: true }
        }
      }
    });
    console.log("=== DB QUERY TEST ===");
    console.log(student);
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
