import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function check() {
  try {
    const list = await prisma.jenisJabatan.findMany();
    console.log('--- JENIS JABATAN ENTRIES ---');
    console.log(JSON.stringify(list, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

check();
