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

    // Sync Logo Sekolah
    await syncSchoolLogo(sekolahId, sekolahPath);

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

  // 2. Baca folder settings (Level 1)
  const settingsRoot = path.join(STORAGE_ROOT, 'settings');
  if (fs.existsSync(settingsRoot)) {
    const cadisdikDirs = fs.readdirSync(settingsRoot);
    for (const cadisdikId of cadisdikDirs) {
      if (!uuidRegex.test(cadisdikId)) continue;

      const cadisdikPath = path.join(settingsRoot, cadisdikId);
      if (!fs.statSync(cadisdikPath).isDirectory()) continue;

      console.log(`\n⚙️ Memproses settings cadisdik: ${cadisdikId}`);
      await syncSystemSettings(cadisdikId, cadisdikPath);
    }
  }

  console.log('\n✅ Sinkronisasi selesai!');
}

async function syncSchoolLogo(sekolahId: string, sekolahFolderPath: string) {
  const files = fs.readdirSync(sekolahFolderPath);
  const logoFile = files.find(f => /^logo\.(jpg|jpeg|png|webp)$/i.test(f));

  if (logoFile) {
    const relativePath = `/storage/${sekolahId}/${logoFile}`;

    try {
      // Cek dulu apakah data Sekolah ada di DB
      const exist = await prisma.sekolah.findUnique({
        where: { sekolah_id: sekolahId }
      });

      if (exist) {
        await prisma.sekolah.update({
          where: { sekolah_id: sekolahId },
          data: { logo: relativePath }
        });
        console.log(`  🟢 Sekolah [${sekolahId}]: Berhasil update logo ke -> ${relativePath}`);
      } else {
        console.log(`  🟡 Sekolah [${sekolahId}]: Tidak ditemukan di database (skip)`);
      }
    } catch (err: any) {
      console.error(`  🔴 Sekolah [${sekolahId}]: Gagal update database:`, err.message);
    }
  }
}

async function syncSystemSettings(cadisdikId: string, settingsPath: string) {
  const files = fs.readdirSync(settingsPath);
  
  const updateData: any = {};
  
  const logoFile = files.find(f => /^logo\.(jpg|jpeg|png|webp)$/i.test(f));
  if (logoFile) {
    updateData.appLogo = `/storage/settings/${cadisdikId}/${logoFile}`;
  }

  const logoDarkFile = files.find(f => /^logo_dark\.(jpg|jpeg|png|webp)$/i.test(f));
  if (logoDarkFile) {
    updateData.appLogoDark = `/storage/settings/${cadisdikId}/${logoDarkFile}`;
  }

  const faviconFile = files.find(f => /^favicon\.(jpg|jpeg|png|webp)$/i.test(f));
  if (faviconFile) {
    updateData.appFavicon = `/storage/settings/${cadisdikId}/${faviconFile}`;
  }

  if (Object.keys(updateData).length > 0) {
    try {
      const exist = await prisma.systemSetting.findUnique({
        where: { cadisdik_id: cadisdikId }
      });

      if (exist) {
        await prisma.systemSetting.update({
          where: { cadisdik_id: cadisdikId },
          data: updateData
        });
        console.log(`  🟢 SystemSetting [${cadisdikId}]: Berhasil update settings ->`, updateData);
      } else {
        await prisma.systemSetting.create({
          data: {
            cadisdik_id: cadisdikId,
            appName: 'SIMAK',
            appShortName: 'Mandala',
            copyrightText: '© 2026 SIMAK. All Rights Reserved.',
            maintenanceMode: false,
            ...updateData
          }
        });
        console.log(`  🟢 SystemSetting [${cadisdikId}]: Berhasil membuat settings baru ->`, updateData);
      }
    } catch (err: any) {
      console.error(`  🔴 SystemSetting [${cadisdikId}]: Gagal update/create database:`, err.message);
    }
  }
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
