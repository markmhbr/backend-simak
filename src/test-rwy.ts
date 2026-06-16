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
  console.log('Testing RwySertifikasi query...');
  try {
    const count = await prisma.rwySertifikasi.count();
    console.log('Current count:', count);
    
    // Try to find a GTK to use
    const gtk = await prisma.gtk.findFirst({ select: { ptk_id: true } });
    console.log('Found GTK:', gtk);
    
    if (gtk) {
      console.log('Attempting dummy insert...');
      const dummy = await prisma.rwySertifikasi.create({
        data: {
          riwayat_sertifikasi_id: '11111111-1111-1111-1111-111111111111',
          ptk_id: gtk.ptk_id,
          id_jenis_sertifikasi: '1',
          nomor_sertifikat: 'test-nomor',
        }
      });
      console.log('Insert success:', dummy);
      
      // Delete dummy
      await prisma.rwySertifikasi.delete({
        where: { riwayat_sertifikasi_id: dummy.riwayat_sertifikasi_id }
      });
      console.log('Delete success');
    }
  } catch (error) {
    console.error('Error encountered:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
