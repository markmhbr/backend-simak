import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = 'superadmin';
  const rawPassword = 'Password123!';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const existing = await prisma.pengguna.findFirst({
    where: { username }
  });

  if (existing) {
    await prisma.pengguna.update({
      where: { pengguna_id: existing.pengguna_id },
      data: {
        password: hashedPassword,
        peran_nama: 'Super Admin',
        sekolah_id: null,
      }
    });
    console.log(`Updated existing user '${username}' to Super Admin.`);
  } else {
    await prisma.pengguna.create({
      data: {
        username,
        email: 'superadmin@simak.id',
        password: hashedPassword,
        nama: 'Super Administrator Pusat',
        peran_nama: 'Super Admin',
        sekolah_id: null,
      }
    });
    console.log(`Created new Super Admin account '${username}'.`);
  }

  console.log('=== KREDENSIAL SUPER ADMIN ===');
  console.log(`Username : ${username}`);
  console.log(`Password : ${rawPassword}`);
}

main().finally(() => prisma.$disconnect());
