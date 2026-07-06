import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Parse DATABASE_URL dari .env secara manual
const dotenvContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8');
const dbUrlLine = dotenvContent.split('\n').find((l: string) => l.startsWith('DATABASE_URL='));
const dbUrlValue = dbUrlLine ? dbUrlLine.split('=')[1].replace(/"/g, '').trim() : '';

const pool = new Pool({ connectionString: dbUrlValue });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const STORAGE_ROOT = path.join(__dirname, '../storage');

// Helper regex untuk memvalidasi UUID v4
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function syncStorageToDatabase() {
  console.log('🔄 Memulai sinkronisasi path storage ke database...');

  if (!fs.existsSync(STORAGE_ROOT)) {
    console.error(`❌ Folder storage tidak ditemukan di: ${STORAGE_ROOT}`);
    return;
  }

  // 1. Baca folder sekolah (Level 1)
  const sekolahDirs = fs.readdirSync(STORAGE_ROOT);

  for (const sekolahId of sekolahDirs) {
    if (!uuidRegex.test(sekolahId)) continue; // skip jika bukan folder UUID sekolah

    const sekolahPath = path.join(STORAGE_ROOT, sekolahId);
    if (!fs.statSync(sekolahPath).isDirectory()) continue;

    console.log(`\n🏫 Memproses sekolah: ${sekolahId}`);

    // Baca subfolder (Level 2: gtk, peserta_didik, dll.)
    const categoryDirs = fs.readdirSync(sekolahPath);

    for (const category of categoryDirs) {
      const categoryPath = path.join(sekolahPath, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      if (category === 'gtk') {
        await syncGtk(sekolahId, categoryPath);
      } else if (category === 'peserta_didik' || category === 'siswa') {
        await syncPesertaDidik(sekolahId, categoryPath, category);
      }
    }
  }

  console.log('\n✅ Sinkronisasi selesai!');
}

async function syncGtk(sekolahId: string, gtkFolderPath: string) {
  const ptkDirs = fs.readdirSync(gtkFolderPath);

  for (const ptkId of ptkDirs) {
    if (!uuidRegex.test(ptkId)) continue;

    const ptkPath = path.join(gtkFolderPath, ptkId);
    if (!fs.statSync(ptkPath).isDirectory()) continue;

    // Cari file foto di dalam folder ptk
    const files = fs.readdirSync(ptkPath);
    // Kita ambil file pertama yang biasanya berupa gambar (png, jpg, jpeg)
    const imageFile = files.find(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

    if (imageFile) {
      // Path relatif yang akan disimpan di database, contoh: "/storage/sekolah_uuid/gtk/ptk_uuid/foto.png"
      const relativePath = `/storage/${sekolahId}/gtk/${ptkId}/${imageFile}`;

      try {
        // Cek dulu apakah data GTK ada di DB
        const exist = await prisma.gtk.findUnique({
          where: { ptk_id: ptkId }
        });

        if (exist) {
          await prisma.gtk.update({
            where: { ptk_id: ptkId },
            data: { foto: relativePath }
          });
          console.log(`  🟢 GTK [${ptkId}]: Berhasil update foto ke -> ${relativePath}`);
        } else {
          console.log(`  🟡 GTK [${ptkId}]: Tidak ditemukan di database (skip)`);
        }
      } catch (err: any) {
        console.error(`  🔴 GTK [${ptkId}]: Gagal update database:`, err.message);
      }
    }
  }
}

async function syncPesertaDidik(sekolahId: string, pdFolderPath: string, folderName: string) {
  const pdDirs = fs.readdirSync(pdFolderPath);

  for (const pdId of pdDirs) {
    if (!uuidRegex.test(pdId)) continue;

    const pdPath = path.join(pdFolderPath, pdId);
    if (!fs.statSync(pdPath).isDirectory()) continue;

    // Cari file foto di dalam folder peserta didik
    const files = fs.readdirSync(pdPath);
    const imageFile = files.find(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

    if (imageFile) {
      const relativePath = `/storage/${sekolahId}/${folderName}/${pdId}/${imageFile}`;

      try {
        // Cek dulu apakah data Peserta Didik ada di DB
        const exist = await prisma.pesertaDidik.findUnique({
          where: { peserta_didik_id: pdId }
        });

        if (exist) {
          await prisma.pesertaDidik.update({
            where: { peserta_didik_id: pdId },
            data: { foto: relativePath }
          });
          console.log(`  🟢 PD [${pdId}]: Berhasil update foto ke -> ${relativePath}`);
        } else {
          console.log(`  🟡 PD [${pdId}]: Tidak ditemukan di database (skip)`);
        }
      } catch (err: any) {
        console.error(`  🔴 PD [${pdId}]: Gagal update database:`, err.message);
      }
    }
  }
}

syncStorageToDatabase()
  .catch(err => {
    console.error('❌ Error fatal saat menjalankan sync:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
