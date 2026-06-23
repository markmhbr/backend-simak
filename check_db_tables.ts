import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

async function checkTables() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    const schoolCount = await prisma.sekolah.count();
    console.log('Total schools in Sekolah table:', schoolCount);
    
    const schools = await prisma.sekolah.findMany();
    console.log('Schools detail:', JSON.stringify(schools, null, 2));
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();

