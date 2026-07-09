import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';

const connectionString = "postgresql://postgres:@127.0.0.1:5432/backend?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const jsonPath = 'c:\\Users\\hexa8\\Downloads\\pegawai_kcds.json';
  if (!fs.existsSync(jsonPath)) {
    console.error('JSON file does not exist at:', jsonPath);
    return;
  }

  const targetCadisdikId = 'a7d04456-3fc8-4153-b0f3-b30a730075d8';
  
  // Ensure the target Cadisdik exists
  let cadisdik = await prisma.cadisdik.findUnique({
    where: { cadisdik_id: targetCadisdikId }
  });
  
  if (!cadisdik) {
    console.log(`Creating Cadisdik with ID ${targetCadisdikId}...`);
    cadisdik = await prisma.cadisdik.create({
      data: {
        cadisdik_id: targetCadisdikId,
        nama_instansi: 'KCD Wilayah S',
        aktif: true
      }
    });
  }

  const pegawais = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Loaded ${pegawais.length} records to import.`);

  let successCount = 0;
  let skippedCount = 0;

  for (const p of pegawais) {
    const existing = await prisma.pegawai.findFirst({
      where: {
        OR: [
          { nip: p.nip },
          { email: p.email },
          { nik: p.nik },
        ],
      },
    });

    if (existing) {
      console.log(`Skipping existing Pegawai: ${p.nama_lengkap} (NIP: ${p.nip})`);
      skippedCount++;
      continue;
    }

    const hashedPassword = await bcrypt.hash(p.password, 10);

    await prisma.pegawai.create({
      data: {
        cadisdik_id: p.cadisdik_id,
        nama_lengkap: p.nama_lengkap,
        nik: p.nik,
        tempat_lahir: p.tempat_lahir,
        tanggal_lahir: new Date(p.tanggal_lahir),
        alamat_lengkap: p.alamat_lengkap,
        nip: p.nip,
        email: p.email,
        password: hashedPassword,
        jabatan: p.jabatan,
        jenis_kelamin: p.jenis_kelamin,
        aktif: true
      },
    });

    console.log(`Imported Pegawai: ${p.nama_lengkap}`);
    successCount++;
  }

  console.log(`Import summary: ${successCount} successful, ${skippedCount} skipped.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
