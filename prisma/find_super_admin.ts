import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.pengguna.findMany({
    where: {
      OR: [
        { peran_nama: 'Super Admin' },
        { sekolah_id: null }
      ]
    },
    select: {
      pengguna_id: true,
      username: true,
      email: true,
      nama: true,
      peran_nama: true,
      sekolah_id: true,
      google2fa_secret: true
    }
  });
  console.log('--- USER DATA ---');
  console.log(JSON.stringify(users, null, 2));
}

main().finally(() => prisma.$disconnect());
