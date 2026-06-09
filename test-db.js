const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.pesertaDidik.count();
  console.log("Total Peserta Didik:", count);
  const rekap = await prisma.pesertaDidik.groupBy({
    by: ['tingkat_pendidikan_id'],
    _count: true
  });
  console.log("Rekap tingkat:", rekap);
}
main().catch(console.error).finally(() => prisma.$disconnect());
