import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

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

async function main() {
  try {
    console.log("=== DB QUERY TEST ===");
    const client = await pool.connect();
    try {
      const fkQuery = `
        SELECT
          tc.table_schema AS schema_name,
          tc.table_name,
          kcu.column_name,
          ccu.table_schema AS foreign_schema_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
          AND (
            (tc.table_schema = 'dapodik' AND ccu.table_schema = 'ref')
            OR (tc.table_schema = 'ref' AND ccu.table_schema = 'dapodik')
          )
        ORDER BY tc.table_schema, tc.table_name;
      `;
      const fkRes = await client.query(fkQuery);
      console.log('Cross-Schema Foreign Keys between dapodik and ref:', fkRes.rows);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("DB query failed:", err);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

