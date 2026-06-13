const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = "postgresql://postgres:simak@localhost:5433/simak_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const models = [
    'sekolah', 'rombonganBelajar', 'anggotaRombel', 'pembelajaran', 'pesertaDidik', 'gtk',
    'pengguna', 'tanah', 'bangunan', 'ruang', 'appKey', 'bidangStudi', 'lembSertifikasi',
    'rwySertifikasi', 'jenisJadwal', 'pengaturanJadwalHari', 'pengaturanJadwal', 'jadwalPelajaran'
  ];

  for (const model of models) {
    try {
      const count = await prisma[model].count();
      console.log(`${model}: ${count}`);
    } catch (err) {
      console.log(`${model}: Error - ${err.message}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
