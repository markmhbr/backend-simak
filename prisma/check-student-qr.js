const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL tidak ditemukan di file .env');
  process.exit(1);
}

const pool = new Pool({ connectionString });

async function main() {
  const targetId = 'f9db3138-3deb-456a-85a7-df5f7b55edfd';
  console.log(`🔍 Memeriksa data peserta didik dengan ID: ${targetId}...\n`);

  const client = await pool.connect();

  try {
    const res = await client.query(
      `SELECT peserta_didik_id, sekolah_id, nama, nisn, nipd, qr_token 
       FROM "dapodik"."peserta_didik" 
       WHERE peserta_didik_id = $1`,
      [targetId]
    );

    if (res.rows.length === 0) {
      console.log(`❌ Siswa dengan ID "${targetId}" TIDAK DITEMUKAN di database.`);
    } else {
      const student = res.rows[0];
      console.log('====================================================');
      console.log('✅ DATA SISWA DITEMUKAN:');
      console.log('====================================================');
      console.log(`Nama        : ${student.nama}`);
      console.log(`NISN        : ${student.nisn || '-'}`);
      console.log(`NIPD        : ${student.nipd || '-'}`);
      console.log(`Sekolah ID  : ${student.sekolah_id}`);
      console.log(`ID Siswa    : ${student.peserta_didik_id}`);
      console.log(`QR Token DB : ${student.qr_token || '(KOSONG)'}`);
      console.log('----------------------------------------------------');
      const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
      const fullQrUrl = student.qr_token
        ? (student.qr_token.startsWith('http') ? student.qr_token : `${appUrl}/p/${student.qr_token}`)
        : `${appUrl}/p/${student.sekolah_id}/${student.peserta_didik_id}`;
      console.log(`Full QR URL : ${fullQrUrl}`);
      console.log('====================================================');
    }
  } catch (err) {
    console.error('❌ Error saat query:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
