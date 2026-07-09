import * as fs from 'fs';
import * as path from 'path';

const jsonPath = 'c:\\Users\\hexa8\\Downloads\\pegawai_kcds.json';
const seederPath = 'c:\\backend-simak\\prisma\\seed-pegawai.ts';

function main() {
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`JSON file not found at: ${jsonPath}`);
  }

  const pegawais = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`Loaded ${pegawais.length} records.`);

  const code = `import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PEGAWAIS = ${JSON.stringify(pegawais, null, 2)};

async function main() {
  const targetCadisdikId = 'a7d04456-3fc8-4153-b0f3-b30a730075d8';
  
  console.log('Checking/creating target Cadisdik...');
  let cadisdik = await prisma.cadisdik.findUnique({
    where: { cadisdik_id: targetCadisdikId }
  });
  
  if (!cadisdik) {
    console.log(\`Creating Cadisdik with ID \${targetCadisdikId}...\`);
    cadisdik = await prisma.cadisdik.create({
      data: {
        cadisdik_id: targetCadisdikId,
        nama_instansi: 'KCD Wilayah S',
        aktif: true
      }
    });
  }

  console.log(\`Starting import of \${PEGAWAIS.length} Pegawai records...\`);
  let successCount = 0;
  let skippedCount = 0;

  for (const p of PEGAWAIS) {
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
      console.log(\`Skipping existing Pegawai: \${p.nama_lengkap} (NIP: \${p.nip})\`);
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

    console.log(\`Imported Pegawai: \${p.nama_lengkap}\`);
    successCount++;
  }

  console.log(\`Import completed. Mapped: \${successCount} successful, \${skippedCount} skipped.\`);
}

main()
  .catch((e) => {
    console.error('Import failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
`;

  fs.writeFileSync(seederPath, code, 'utf-8');
  console.log(`Successfully generated seeder at: ${seederPath}`);
}

main();
