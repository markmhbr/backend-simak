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
async function syncGtkProfil() {
  const jsonPath = '/home/markmhbr/simak/gtks_decrypted.json';
  if (!fs.existsSync(jsonPath)) {
    console.error('gtks_decrypted.json tidak ditemukan.');
    return;
  }
  const gtks = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`Memproses ${gtks.length} data GTK dari JSON untuk sinkronisasi Formulir Profil...`);
  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;
  for (const item of gtks) {
    // PENTING: Jika Anda tetap ingin mengizinkan status Mutasi/Pindah Tugas masuk ke DB, 
    // hapus atau sesuaikan kondisi filter status di bawah ini.
    // Jika Anda HANYA ingin memproses yang Aktif, biarkan baris di bawah ini aktif.
    if (item.status !== 'Aktif' && item.status !== 'Mutasi/Pindah Tugas') {
      skippedCount++;
      continue;
    }
    try {
      // Mencari data berdasarkan ptk_id di database
      // Sesuaikan nama model 'ptk' dengan schema.prisma Anda (misal: 'gtk' atau 'ptk')
      const existing = await prisma.gtk.findFirst({
        where: { 
          ptk_id: item.ptk_id
        },
        select: { 
          ptk_id: true
        }
      });
      if (existing) {
        await prisma.gtk.update({
          where: { ptk_id: item.ptk_id },
          data: { 
            nama: item.nama,
            nik: item.nik || null,
            no_kk: item.no_kk || null,
            nuptk: item.nuptk || null,
            nip: item.nip || null,
            niy_nigk: item.niy_nigk || null, // Menghubungkan ke kolom NIP/NIY/NIGB
            jenis_kelamin: item.jenis_kelamin,
            tempat_lahir: item.tempat_lahir,
            // Jika tipe data di Prisma berupa DateTime, gunakan konstruktor new Date()
            tanggal_lahir: item.tanggal_lahir ? new Date(item.tanggal_lahir) : null,
            nama_ibu_kandung: item.nama_ibu_kandung || null,
            agama_id_str: item.agama_id_str || null, // Mengambil string 'Islam'
            kewarganegaraan: item.kewarganegaraan || null,
            status_perkawinan: item.status_perkawinan || null,
            nama_suami_istri: item.nama_suami_istri || null, // Nama Pasangan
            pekerjaan_suami_istri: item.pekerjaan_suami_istri || null, // Pekerjaan Pasangan
            nama_wajib_pajak: item.nama_wajib_pajak || null,
            npwp: item.npwp || null,
            status: item.status // Menyimpan status terbaru dari JSON (misal: Mutasi/Pindah Tugas)
          }
        });
        updatedCount++;
      } else {
        notFoundCount++;
      }
    } catch (err: any) {
      console.error(`Gagal update GTK ptk_id ${item.ptk_id}: ${err.message}`);
    }
  }
  console.log(`\n=== SINKRONISASI SELESAI ===`);
  console.log(`Berhasil diupdate : ${updatedCount}`);
  console.log(`Dilewati (Skipped): ${skippedCount}`);
  console.log(`Tidak ditemukan  : ${notFoundCount} (di database)`);
}
async function main() {
  console.log('=== MEMULAI SINKRONISASI FORMULIR PROFIL GTK ===');
  await syncGtkProfil();
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });