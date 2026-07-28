import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Creating table simak.pengaturan_va directly in PostgreSQL...');
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS simak.pengaturan_va (
      pengaturan_va_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sekolah_id UUID UNIQUE NOT NULL REFERENCES dapodik.sekolah(sekolah_id) ON DELETE CASCADE,
      is_active BOOLEAN NOT NULL DEFAULT FALSE,
      client_id VARCHAR(255),
      secret_key VARCHAR(255),
      private_key TEXT,
      bjb_public_key TEXT,
      api_url VARCHAR(500),
      mode VARCHAR(20) NOT NULL DEFAULT 'sandbox',
      created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('Table created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
