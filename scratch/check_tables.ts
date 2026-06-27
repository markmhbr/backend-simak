import { Pool } from 'pg';

async function run() {
  const pool = new Pool({
    host: 'localhost',
    port: 54532,
    database: 'pendataan',
    user: 'postgres',
    password: '',
  });

  try {
    const resProv = await pool.query("SELECT kode_wilayah, nama, id_level_wilayah, mst_kode_wilayah FROM ref.mst_wilayah WHERE id_level_wilayah = 1 LIMIT 5");
    console.log("Provinces (Level 1) sample:", resProv.rows);

    const sampleProv = resProv.rows[0];
    if (sampleProv) {
      const resKab = await pool.query("SELECT kode_wilayah, nama, id_level_wilayah, mst_kode_wilayah FROM ref.mst_wilayah WHERE id_level_wilayah = 2 AND mst_kode_wilayah = $1 LIMIT 5", [sampleProv.kode_wilayah]);
      console.log(`Regencies (Level 2) under province ${sampleProv.nama}:`, resKab.rows);
    }
  } catch (e) {
    console.error("Query failed:", e.message);
  } finally {
    await pool.end();
  }
}
run();
