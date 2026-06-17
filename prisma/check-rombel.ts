
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const stats = await prisma.rombonganBelajar.groupBy({
    by: ['jenis_rombel_str', 'tingkat_pendidikan_id'],
    _count: true,
  });
  console.log(JSON.stringify(stats, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
