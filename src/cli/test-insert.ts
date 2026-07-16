import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Searching for Budi Setiawan...');
  const budi = await prisma.pegawai.findFirst({
    where: {
      nama_lengkap: {
        contains: 'Budi Setiawan',
        mode: 'insensitive',
      },
    },
  });

  if (!budi) {
    console.log('Budi Setiawan not found in pegawai table.');
    return;
  }

  console.log('Found Budi:', budi);

  console.log('Searching for a school...');
  const sekolah = await prisma.sekolah.findFirst();
  if (!sekolah) {
    console.log('No schools found.');
    return;
  }
  console.log('Found Sekolah:', sekolah);

  console.log('Trying to insert JadwalMonitoring...');
  try {
    const created = await prisma.jadwalMonitoring.create({
      data: {
        cadisdik_id: budi.cadisdik_id || '',
        pegawai_id: budi.pegawai_id,
        sekolah_id: sekolah.sekolah_id,
        tanggal_mulai: new Date(),
        tanggal_selesai: new Date(),
        agenda: 'Test Agenda',
        keterangan: 'Test Keterangan',
        status: 'scheduled',
      },
    });
    console.log('Successfully created:', created);
  } catch (err) {
    console.error('Error inserting JadwalMonitoring:', err);
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
