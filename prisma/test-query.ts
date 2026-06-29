import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const schema = fs.readFileSync('prisma/schema.prisma', 'utf8');
  const lines = schema.split('\n');
  const models = lines.filter(line => line.trim().startsWith('model '));
  console.log('All models in schema.prisma:', models);

  const keys = Object.keys(prisma);
  console.log('Generated Prisma models:', keys.filter(k => !k.startsWith('$') && !k.startsWith('_')));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
