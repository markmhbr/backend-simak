import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== SIMAK MENU ROLES MIGRATION & CLEANUP SCRIPT ===\n');

  // 1. Ensure sekolah_id column exists in simak.menu_roles table
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

  // 2. Count unlinked menu_roles (where sekolah_id IS NULL)
  const unlinkedCount = await prisma.menuRole.count({
    where: { sekolah_id: null },
  });
  console.log(`\n2. Ditemukan ${unlinkedCount} data menu_roles tanpa sekolah_id (sekolah_id IS NULL).`);

  if (unlinkedCount > 0) {
    console.log('   Membersihkan data menu_roles lama yang tidak terikat ke sekolah...');
    const deleted = await prisma.menuRole.deleteMany({
      where: { sekolah_id: null },
    });
    console.log(`   ✓ Berhasil menghapus ${deleted.count} data menu_roles lama.`);
  } else {
    console.log('   ✓ Tidak ada data menu_roles lama yang perlu dibersihkan.');
  }

  // 3. Count total active menu_roles per sekolah
  const grouped = await prisma.menuRole.groupBy({
    by: ['sekolah_id'],
    _count: { menu_role_id: true },
  });

  console.log('\n3. Ringkasan data menu_roles per sekolah:');
  if (grouped.length === 0) {
    console.log('   (Belum ada data menu_roles per sekolah. Silakan atur melalui menu Pengaturan Hak Akses Menu di frontend)');
  } else {
    for (const item of grouped) {
      console.log(`   - Sekolah ID [${item.sekolah_id}]: ${item._count.menu_role_id} item menu`);
    }
  }

  console.log('\n=== SELESAI ===');
}

main()
  .catch((e) => {
    console.error('Error saat menjalankan script cleanup:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
