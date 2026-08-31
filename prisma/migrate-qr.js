const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL tidak ditemukan di file .env');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function run() {
  console.log('🔄 Menghubungkan ke database hosting...');
  const client = await pool.connect();

  try {
    console.log('🔄 Memulai update qr_token ke format universal: sekolah_id/id...');

    // 1. Update Peserta Didik di schema dapodik
    const resPd = await client.query(`
      UPDATE "dapodik"."peserta_didik"
      SET qr_token = CONCAT(sekolah_id, '/', peserta_didik_id)
      WHERE sekolah_id IS NOT NULL;
    `);
    console.log(`✅ Peserta Didik berhasil diupdate: ${resPd.rowCount} baris`);

    // 2. Update GTK di schema dapodik
    const resGtk = await client.query(`
      UPDATE "dapodik"."gtks"
      SET qr_token = CONCAT(sekolah_id, '/', ptk_id)
      WHERE sekolah_id IS NOT NULL;
    `);
    console.log(`✅ GTK berhasil diupdate: ${resGtk.rowCount} baris`);

    console.log('🎉 Selesai! Seluruh data di hosting sudah terupdate ke format universal!');
  } catch (err) {
    console.error('❌ Error saat menjalankan update:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
