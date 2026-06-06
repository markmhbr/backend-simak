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
  const adminIdentifier = 'admin';
  const rawPassword = 'simak2026';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  console.log('Checking for existing Super Admin...');

  const existingAdmin = await prisma.pengguna.findFirst({
    where: { 
      email: adminIdentifier
    }
  });

  if (!existingAdmin) {
    console.log('Creating Super Admin account...');
    await prisma.pengguna.create({
      data: {
        username: adminIdentifier,
        email: adminIdentifier, // Username disimpan di kolom email
        password: hashedPassword,
        nama: 'Super Administrator',
        peran_id_str: 'Super Admin',
        sekolah_id: null,
      }
    });
    console.log('Super Admin created successfully!');
    console.log(`Identifier (Email/Username): ${adminIdentifier}`);
    console.log(`Password: ${rawPassword}`);
  } else {
    console.log('Super Admin already exists.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
