const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = "postgresql://postgres:simak@localhost:5433/simak_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const gtk = await prisma.gtk.findFirst();
  console.log('Sample GTK properties:');
  console.log(gtk);
  if (gtk) {
    console.log('rwy_pend_formal:', JSON.stringify(gtk.rwy_pend_formal, null, 2));
    console.log('rwy_kepangkatan:', JSON.stringify(gtk.rwy_kepangkatan, null, 2));
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
