import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== SEARCHING FOR MUHAMAD RIZKI MAULANA IN GTK TABLE ===');

  const operatorUser = await prisma.pengguna.findFirst({
    where: {
      OR: [
        { email: { contains: 'mitrapasundan', mode: 'insensitive' } },
        { nama: { contains: 'Rizki', mode: 'insensitive' } }
      ]
    }
  });

  console.log('Operator User found:', operatorUser);

  if (operatorUser) {
    const allGtksInSchool = await prisma.gtk.findMany({
      where: {
        sekolah_id: operatorUser.sekolah_id || undefined
      },
      select: {
        ptk_id: true,
        nama: true,
        email: true,
        nik: true,
        nuptk: true
      }
    });
    console.log(`GTKs in school ${operatorUser.sekolah_id}:`, allGtksInSchool);
  } else {
    const allGtksMatchingName = await prisma.gtk.findMany({
      where: {
        OR: [
          { nama: { contains: 'Rizki', mode: 'insensitive' } },
          { nama: { contains: 'Maulana', mode: 'insensitive' } },
          { email: { contains: 'mitrapasundan', mode: 'insensitive' } }
        ]
      }
    });
    console.log('GTKs matching name across all schools:', allGtksMatchingName);
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
