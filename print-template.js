const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const dotenv = require('dotenv');

const envConfig = dotenv.parse(fs.readFileSync('.env'));
const connectionString = envConfig.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const detail = await prisma.templateSurat.findUnique({
    where: { template_surat_id: '39f9fbb3-ccc2-45d9-a506-b2f9794e43af' }
  });
  if (detail) {
    console.log('--- TEMPLATE KONTEN HTML ---');
    console.log(detail.konten_html);
  } else {
    console.log('Template not found');
  }

  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
