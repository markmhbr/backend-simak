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
    const bidangStudiCount = await prisma.bidangStudi.count();
    const lembSertifikasiCount = await prisma.lembSertifikasi.count();
    
    console.log('- GTK count:', gtkCount);
    console.log('- BidangStudi count:', bidangStudiCount);
    console.log('- LembSertifikasi count:', lembSertifikasiCount);
    
    // Check if we can find any errors or sync data
    // Let's print first 5 GTKs and first 5 LembSertifikasi
    const gtks = await prisma.gtk.findMany({ take: 5, select: { ptk_id: true, nama: true } });
    console.log('GTKs samples:', gtks);
    
    const lembs = await prisma.lembSertifikasi.findMany({ take: 5, select: { kode_lemb_sert: true, nm_lemb_sert: true } });
    console.log('LembSertifikasi samples:', lembs);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
