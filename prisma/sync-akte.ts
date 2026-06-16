import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const fs = require('fs');
const path = require('path');

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

async function syncPesertaDidikAkte() {
  const jsonPath = '/home/markmhbr/simak/siswas_decrypted.json';
  if (!fs.existsSync(jsonPath)) {
    console.error('siswas_decrypted.json tidak ditemukan.');
    return;
  }
  const siswas = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Memproses ${siswas.length} data Peserta Didik dari JSON untuk sinkronisasi No. Register Akte Lahir (Status: Aktif)...`);

  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;

  for (const item of siswas) {
    // Filter status Aktif saja dari JSON
    if (item.status !== 'Aktif') {
      skippedCount++;
      continue;
    }

    if (!item.no_registrasi_akta_lahir && !item.reg_akta_lahir) {
      skippedCount++;
      continue;
    }

    try {
      // Periksa apakah peserta_didik_id ada di database dengan status Aktif
      const existing = await prisma.pesertaDidik.findFirst({
        where: { 
          peserta_didik_id: item.peserta_didik_id,
          status: 'Aktif'
        },
        select: { 
          peserta_didik_id: true, 
          no_registrasi_akta_lahir: true,
          reg_akta_lahir: true 
        }
      });

      if (existing) {
        await prisma.pesertaDidik.update({
          where: { peserta_didik_id: item.peserta_didik_id },
          data: { 
            no_registrasi_akta_lahir: item.no_registrasi_akta_lahir || null,
            reg_akta_lahir: item.reg_akta_lahir || null
          }
        });
        updatedCount++;
      } else {
        notFoundCount++;
      }
    } catch (err: any) {
      console.error(`Gagal update Peserta Didik peserta_didik_id ${item.peserta_didik_id}: ${err.message}`);
    }
  }

  console.log(`Peserta Didik Akte Lahir Sync Selesai: Updated=${updatedCount}, Skipped (no Akte / Non-Aktif)=${skippedCount}, Not Found / Non-Aktif in DB=${notFoundCount}`);
}

async function main() {
  console.log('=== MEMULAI SINKRONISASI KOLOM REGISTER AKTE LAHIR (STATUS: AKTIF) ===');
  await syncPesertaDidikAkte();
  console.log('=== SINKRONISASI SELESAI ===');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
