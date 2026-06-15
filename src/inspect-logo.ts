import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Parse DATABASE_URL from .env manually to be safe
const fs = require('fs');
const path = require('path');
const dotenvContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8');
const dbUrlLine = dotenvContent.split('\n').find((l: string) => l.startsWith('DATABASE_URL='));
const dbUrlValue = dbUrlLine ? dbUrlLine.split('=')[1].replace(/"/g, '').trim() : '';

const pool = new Pool({ connectionString: dbUrlValue });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const sekolah = await prisma.sekolah.findFirst();
  console.log('====================================');
  console.log('Sekolah logo from DB:', sekolah?.logo);
  console.log('====================================');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
