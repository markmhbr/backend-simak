const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://postgres:@127.0.0.1:5432/simakk?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const pd = await prisma.pesertaDidik.findFirst({
    where: { nama: { contains: 'M Abdul Azis', mode: 'insensitive' } }
  });

  if (pd && pd.foto) {
    let cleanPath = pd.foto;
    if (cleanPath.startsWith('/storage/')) {
      cleanPath = cleanPath.substring(9);
    }
    const fullPath = path.join(process.cwd(), 'storage', cleanPath);
    console.log('Normalized Clean Path:', cleanPath);
    console.log('Full absolute path:', fullPath);
    console.log('File exists on disk?:', fs.existsSync(fullPath));
  } else {
    console.log('No student or no photo path in DB');
  }
}

main().catch(console.error).finally(() => pool.end());
