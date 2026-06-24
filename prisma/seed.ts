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
  // 1. Reset ref schema
  console.log('Cleaning ref schema for manual dump import...');
  await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS ref CASCADE;`);
  await prisma.$executeRawUnsafe(`CREATE SCHEMA ref;`);
  console.log('Schema ref reset successfully.');

  const rawPassword = 'simak2026';
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  // 2. Create Super Admin
  const adminIdentifier = 'admin';
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

  // 3. Create Cadisdik & Pegawai
  const nipLogin = '199501012024011001'; 
  console.log('Checking for existing Cadisdik reference...');
  let defaultCadisdik = await prisma.cadisdik.findFirst();
  
  if (!defaultCadisdik) {
    console.log('No Cadisdik found. Creating a mock Cadisdik for relation...');
    defaultCadisdik = await prisma.cadisdik.create({
      data: {
        nama_instansi: 'Wilayah Mock Kesatu',
      }
    });
  }

  const targetCadisdikId = defaultCadisdik.cadisdik_id;

  console.log('Checking for existing Pegawai account...');
  const existingPegawai = await prisma.pegawai.findUnique({
    where: { 
      nip: nipLogin
    }
  });

  if (!existingPegawai) {
    console.log('Creating default Pegawai account...');
    await prisma.pegawai.create({
      data: {
        cadisdik_id: targetCadisdikId,
        nama_lengkap: 'Budi Setiawan, S.Kom',
        nik: '3273012345670001', // 16 digit standar
        tempat_lahir: 'Bandung',
        tanggal_lahir: new Date('1995-01-01'), // Format Date untuk PostgreSQL
        alamat_lengkap: 'Jl. Diponegoro No. 22, Kota Bandung, Jawa Barat',
        nip: nipLogin,
        email: 'budi.setiawan@simak.go.id',
        password: hashedPassword,
        jabatan: 1, // SmallInt (contoh: 1 = Kepala Seksi / Staf)
        jenis_kelamin: 1, // SmallInt (contoh: 1 = Laki-laki)
        nomor_telepon: '081234567890',
        foto: null,
        aktif: true
      }
    });

    console.log('Pegawai account created successfully!');
    console.log(`Login NIP  : ${nipLogin}`);
    console.log(`Password   : ${rawPassword}`);
  } else {
    console.log(`Pegawai with NIP ${nipLogin} already exists.`);
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
