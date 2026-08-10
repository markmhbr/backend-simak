import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== CHECKING USER & GTK DATA ===');

  const users = await prisma.pengguna.findMany({
    where: {
      OR: [
        { nama: { contains: 'Rizki', mode: 'insensitive' } },
        { email: { contains: 'mitrapasundan', mode: 'insensitive' } },
        { username: { contains: 'mitrapasundan', mode: 'insensitive' } },
        { peran_nama: { contains: 'Operator', mode: 'insensitive' } }
      ]
    },
    select: {
      pengguna_id: true,
      sekolah_id: true,
      username: true,
      email: true,
      nama: true,
      peran_nama: true,
      ptk_id: true
    }
  });

  console.log('Pengguna matching query:', users);

  const gtks = await prisma.gtk.findMany({
    select: {
      ptk_id: true,
      sekolah_id: true,
      nama: true,
      email: true,
      nik: true,
      nuptk: true
    }
  });

  console.log('Total GTKs count:', gtks.length);
  console.log('Sample GTKs:', gtks.slice(0, 10));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
