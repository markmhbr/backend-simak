import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const connections = await prisma.mandala.findMany();
  console.log('Mandala Connections in DB:');
  console.log(JSON.stringify(connections, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
