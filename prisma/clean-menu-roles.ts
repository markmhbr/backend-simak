import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// Resolution DATABASE_URL yang tahan di segala environment (Local/Hosting/VPS)
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  try {
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
      const dotenvContent = fs.readFileSync(envPath, 'utf-8');
      const dbUrlLine = dotenvContent.split('\n').find((l: string) => l.startsWith('DATABASE_URL='));
      if (dbUrlLine) {
        connectionString = dbUrlLine.split('=').slice(1).join('=').replace(/"/g, '').replace(/'/g, '').trim();
      }
    }
  } catch (err) {
    console.warn('Gagal membaca file .env secara manual:', err);
  }
}

let prisma: PrismaClient;
let pool: Pool | null = null;

if (connectionString) {
  pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  prisma = new PrismaClient({ adapter });
} else {
  prisma = new PrismaClient();
}

async function main() {
  console.log('=== SIMAK DATA CLEANUP & RESET SCRIPT ===\n');

  // ==========================================
  // 1. MIGRATION & CLEANUP SIMAK.MENU_ROLES
  // ==========================================
  console.log('1. Memeriksa & memperbarui struktur tabel simak.menu_roles...');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE simak.menu_roles 
    ADD COLUMN IF NOT EXISTS sekolah_id UUID NULL;
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS menu_roles_sekolah_id_idx 
    ON simak.menu_roles(sekolah_id);
  `);
  console.log('   ✓ Struktur tabel simak.menu_roles siap.');

  const unlinkedMenuRoles = await prisma.menuRole.count({
    where: { sekolah_id: null },
  });
  console.log(`   Ditemukan ${unlinkedMenuRoles} data menu_roles tanpa sekolah_id.`);

  if (unlinkedMenuRoles > 0) {
    const deletedMenuRoles = await prisma.menuRole.deleteMany({
      where: { sekolah_id: null },
    });
    console.log(`   ✓ Berhasil menghapus ${deletedMenuRoles.count} data menu_roles lama.`);
  } else {
    console.log('   ✓ Tidak ada data menu_roles lama tanpa sekolah_id.');
  }

  // ==========================================
  // 2. HAPUS SEMUA PERAN TAMBAHAN (TUGAS TAMBAHAN)
  // ==========================================
  console.log('\n2. Menghapus SEMUA data Tugas Tambahan / Peran Tambahan...');

  const totalTugasCount = await prisma.tugasTambahan.count();
  console.log(`   Total data tugas tambahan saat ini: ${totalTugasCount}`);

  if (totalTugasCount > 0) {
    const deletedAllTugas = await prisma.tugasTambahan.deleteMany({});
    console.log(`   ✓ Berhasil menghapus total ${deletedAllTugas.count} data tugas tambahan dari database.`);
  } else {
    console.log('   ✓ Tabel tugas tambahan sudah bersih/kosong.');
  }

  // ==========================================
  // 3. RINGKASAN DATA HAK AKSES & PERAN
  // ==========================================
  console.log('\n3. Ringkasan data aktif per sekolah setelah reset:');
  const groupedMenuRoles = await prisma.menuRole.groupBy({
    by: ['sekolah_id'],
    _count: { menu_role_id: true },
  });

  const remainingTugasCount = await prisma.tugasTambahan.count();

  console.log('   a) Menu Roles:');
  if (groupedMenuRoles.length === 0) {
    console.log('      - Belum ada menu roles per sekolah.');
  } else {
    for (const item of groupedMenuRoles) {
      console.log(`      - Sekolah ID [${item.sekolah_id}]: ${item._count.menu_role_id} item menu`);
    }
  }

  console.log(`   b) Total Tugas/Peran Tambahan tersisa: ${remainingTugasCount}`);

  console.log('\n=== RESET SELESAI ===');
}

main()
  .catch((e) => {
    console.error('Error saat menjalankan script cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    if (pool) {
      await pool.end();
    }
  });
