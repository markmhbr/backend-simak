const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const fs = require('fs');
const path = require('path');
const dotenvContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf-8');
const dbUrlLine = dotenvContent.split('\n').find((l) => l.startsWith('DATABASE_URL='));
const dbUrlValue = dbUrlLine ? dbUrlLine.split('=').slice(1).join('=').replace(/"/g, '').trim() : '';

const pool = new Pool({ connectionString: dbUrlValue });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const desa = await prisma.mst_wilayah.findUnique({
    where: { kode_wilayah: '020715AG' },
  });
  console.log('=== DESA (020715AG) ===');
  console.log('nama:', desa?.nama);
  console.log('id_level_wilayah:', desa?.id_level_wilayah);
  console.log('mst_kode_wilayah (parent):', desa?.mst_kode_wilayah);
  console.log('id_kec:', desa?.id_kec);
  console.log('id_kabkota:', desa?.id_kabkota);
  console.log('id_prov:', desa?.id_prov);
  console.log('negara_id:', desa?.negara_id);

  // Walk up using mst_kode_wilayah
  let current = desa;
  let level = 1;
  while (current?.mst_kode_wilayah) {
    const parent = await prisma.mst_wilayah.findUnique({
      where: { kode_wilayah: current.mst_kode_wilayah },
    });
    console.log(`\n=== PARENT ${level} ===`);
    console.log('kode_wilayah:', parent?.kode_wilayah);
    console.log('nama:', parent?.nama);
    console.log('id_level_wilayah:', parent?.id_level_wilayah);
    console.log('mst_kode_wilayah (parent):', parent?.mst_kode_wilayah);
    current = parent;
    level++;
    if (level > 5) break;
  }
}

main().catch(console.error).finally(() => {
  prisma.$disconnect();
  pool.end();
});
