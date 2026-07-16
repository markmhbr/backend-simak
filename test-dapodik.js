const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = "postgresql://postgres:@127.0.0.1:5432/backend?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const ids = [100011070, 200010300, 300110000, 300210000, 300311900, 401000000, 600070200, 800000213];
  
  // Find rombel info to get kurikulum_id
  const rombel = await prisma.rombonganBelajar.findUnique({
    where: { rombongan_belajar_id: 'f0b4da74-5edf-4b1b-bdf0-84bafc989b63' }
  });
  console.log('Rombel kurikulum_id:', rombel.kurikulum_id);

  // Find mata_pelajaran_kurikulum
  const matpelKuris = await prisma.mata_pelajaran_kurikulum.findMany({
    where: {
      mata_pelajaran_id: { in: ids },
      kurikulum_id: rombel.kurikulum_id
    },
    include: {
      group_matpel: true
    }
  });

  console.log('Mata Pelajaran Kurikulum records:');
  console.log(JSON.stringify(matpelKuris, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect().then(() => pool.end()));
