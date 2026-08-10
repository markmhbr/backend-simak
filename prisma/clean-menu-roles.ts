import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('=== SIMAK DATA CLEANUP & MIGRATION SCRIPT ===\n');

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
  console.log(`   Ditemukan ${unlinkedMenuRoles} data menu_roles tanpa sekolah_id (sekolah_id IS NULL).`);

  if (unlinkedMenuRoles > 0) {
    const deletedMenuRoles = await prisma.menuRole.deleteMany({
      where: { sekolah_id: null },
    });
    console.log(`   ✓ Berhasil menghapus ${deletedMenuRoles.count} data menu_roles lama.`);
  } else {
    console.log('   ✓ Tidak ada data menu_roles lama yang perlu dibersihkan.');
  }

  // ==========================================
  // 2. CLEANUP PERAN TAMBAHAN (TUGAS TAMBAHAN)
  // ==========================================
  console.log('\n2. Memeriksa & membersihkan data Tugas Tambahan / Peran Tambahan...');

  // 2a. Hapus tugas tambahan yang statusnya soft_delete (> 0)
  const softDeletedCount = await prisma.tugasTambahan.count({
    where: {
      soft_delete: { gt: 0 },
    },
  });
  if (softDeletedCount > 0) {
    const deletedSoft = await prisma.tugasTambahan.deleteMany({
      where: { soft_delete: { gt: 0 } },
    });
    console.log(`   ✓ Berhasil menghapus ${deletedSoft.count} data tugas tambahan bersatus soft_delete.`);
  } else {
    console.log('   ✓ Tidak ada data tugas tambahan bersatus soft_delete.');
  }

  // 2b. Hapus tugas tambahan yatim (tanpa ptk_id dan tanpa peserta_didik_id)
  const orphanCount = await prisma.tugasTambahan.count({
    where: {
      ptk_id: null,
      peserta_didik_id: null,
    },
  });
  if (orphanCount > 0) {
    const deletedOrphans = await prisma.tugasTambahan.deleteMany({
      where: {
        ptk_id: null,
        peserta_didik_id: null,
      },
    });
    console.log(`   ✓ Berhasil menghapus ${deletedOrphans.count} data tugas tambahan yatim (tanpa PTK/PD).`);
  } else {
    console.log('   ✓ Tidak ada data tugas tambahan yatim.');
  }

  // 2c. Sinkronisasi sekolah_id pada tugas_tambahan dari data GTK atau Peserta Didik terkait jika NULL
  const nullSekolahTasks = await prisma.tugasTambahan.findMany({
    where: { sekolah_id: null },
    select: {
      ptk_tugas_tambahan_id: true,
      ptk_id: true,
      peserta_didik_id: true,
    },
  });

  if (nullSekolahTasks.length > 0) {
    console.log(`   Menyinkronkan sekolah_id untuk ${nullSekolahTasks.length} data tugas tambahan...`);
    let updatedCount = 0;

    for (const task of nullSekolahTasks) {
      let targetSekolahId: string | null = null;

      if (task.ptk_id) {
        const gtk = await prisma.gtk.findUnique({
          where: { ptk_id: task.ptk_id },
          select: { sekolah_id: true },
        });
        if (gtk?.sekolah_id) targetSekolahId = gtk.sekolah_id;
      }

      if (!targetSekolahId && task.peserta_didik_id) {
        const pd = await prisma.pesertaDidik.findUnique({
          where: { peserta_didik_id: task.peserta_didik_id },
          select: { sekolah_id: true },
        });
        if (pd?.sekolah_id) targetSekolahId = pd.sekolah_id;
      }

      if (targetSekolahId) {
        await prisma.tugasTambahan.update({
          where: { ptk_tugas_tambahan_id: task.ptk_tugas_tambahan_id },
          data: { sekolah_id: targetSekolahId },
        });
        updatedCount++;
      }
    }
    console.log(`   ✓ Berhasil menyinkronkan sekolah_id pada ${updatedCount} data tugas tambahan.`);
  } else {
    console.log('   ✓ Semua data tugas tambahan sudah memiliki sekolah_id.');
  }

  // ==========================================
  // 3. RINGKASAN DATA HAK AKSES & PERAN
  // ==========================================
  console.log('\n3. Ringkasan data aktif per sekolah:');
  const groupedMenuRoles = await prisma.menuRole.groupBy({
    by: ['sekolah_id'],
    _count: { menu_role_id: true },
  });

  const groupedTugas = await prisma.tugasTambahan.groupBy({
    by: ['sekolah_id'],
    _count: { ptk_tugas_tambahan_id: true },
  });

  console.log('   a) Menu Roles:');
  if (groupedMenuRoles.length === 0) {
    console.log('      - Belum ada menu roles per sekolah.');
  } else {
    for (const item of groupedMenuRoles) {
      console.log(`      - Sekolah ID [${item.sekolah_id}]: ${item._count.menu_role_id} item menu`);
    }
  }

  console.log('   b) Tugas/Peran Tambahan:');
  if (groupedTugas.length === 0) {
    console.log('      - Belum ada tugas tambahan.');
  } else {
    for (const item of groupedTugas) {
      console.log(`      - Sekolah ID [${item.sekolah_id}]: ${item._count.ptk_tugas_tambahan_id} tugas tambahan`);
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
