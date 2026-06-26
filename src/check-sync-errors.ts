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
  console.log('Checking parent tables count:');
  try {
    const gtkCount = await prisma.gtk.count();
    const dudiCount = await prisma.dudi.count();
    
    console.log('- GTK count:', gtkCount);
    console.log('- Dudi count:', dudiCount);
    
    // Check if we can find any errors or sync data
    const gtks = await prisma.gtk.findMany({ take: 5, select: { ptk_id: true, nama: true } });
    console.log('GTKs samples:', gtks);
    
    const dudis = await prisma.dudi.findMany({ take: 5, select: { dudi_id: true, nama: true } });
    console.log('Dudi samples:', dudis);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
