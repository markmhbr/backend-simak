import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

async function applyMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('DATABASE_URL not found in .env');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const client = await pool.connect();

  try {
    const sqlPath = path.join(__dirname, 'migrations', '20260827_add_perpustakaan', 'migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying safe SQL migration for perpustakaan tables...');
    await client.query(sql);
    console.log('Migration applied successfully! 6 perpustakaan tables are ready in schema "simak".');
  } catch (err) {
    console.error('Error applying migration:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

applyMigration();
