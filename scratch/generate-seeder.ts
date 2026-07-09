import * as fs from 'fs';
import * as path from 'path';

const sqlPath = 'c:\\Users\\hexa8\\Downloads\\pegawai_kcds (1).sql';
const jsonOutputPath = 'c:\\Users\\hexa8\\Downloads\\pegawai_kcds.json';
const seederPath = 'c:\\backend-simak\\prisma\\seed-pegawai.ts';

function parseSqlFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const valuesStart = content.indexOf('VALUES');
  if (valuesStart === -1) {
    throw new Error('Could not find VALUES clause in SQL file.');
  }

  const valuesText = content.substring(valuesStart + 6).trim();

  const rows: any[] = [];
  let currentWord = '';
  let inQuotes = false;
  let quoteChar = '';
  let inRow = false;
  let currentRowValues: any[] = [];

  for (let i = 0; i < valuesText.length; i++) {
    const char = valuesText[i];
    
    if (inQuotes) {
      if (char === '\\') {
        currentWord += char + (valuesText[i + 1] || '');
        i++;
      } else if (char === quoteChar) {
        inQuotes = false;
      } else {
        currentWord += char;
      }
    } else {
      if (char === "'" || char === '"') {
        inQuotes = true;
        quoteChar = char;
      } else if (char === '(') {
        if (!inRow) {
          inRow = true;
          currentRowValues = [];
          currentWord = '';
        } else {
          currentWord += char;
        }
      } else if (char === ')') {
        if (inRow) {
          currentRowValues.push(currentWord.trim());
          rows.push(currentRowValues);
          inRow = false;
        }
      } else if (char === ',') {
        if (inRow) {
          currentRowValues.push(currentWord.trim());
          currentWord = '';
        }
      } else if (char === ';') {
        if (inRow) {
          currentRowValues.push(currentWord.trim());
          rows.push(currentRowValues);
          inRow = false;
        }
        break;
      } else {
        currentWord += char;
      }
    }
  }

  return rows;
}

function cleanValue(val: string) {
  if (!val || val === 'NULL') return null;
  return val;
}

function main() {
  const parsed = parseSqlFile(sqlPath);
  console.log(`Parsed ${parsed.length} rows from SQL.`);

  const mapped = parsed.map((row) => {
    const id = cleanValue(row[0]);
    const name = cleanValue(row[2]);
    const rawNik = cleanValue(row[3]);
    const rawTempatLahir = cleanValue(row[4]);
    const rawTanggalLahir = cleanValue(row[5]);
    const jenisKelaminStr = cleanValue(row[6]);
    let nip = cleanValue(row[7]);
    const rawEmail = cleanValue(row[11]);
    const rawAlamat = cleanValue(row[12]);
    
    // Generate unique NIP if it is NULL
    if (!nip) {
      nip = '999999' + String(id).padStart(12, '0');
    }

    const nik = rawNik || nip.substring(0, 16);
    
    const tempat_lahir = rawTempatLahir || 'Bandung';
    
    let tanggal_lahir = rawTanggalLahir;
    if (!tanggal_lahir && nip && nip.length >= 8 && !nip.startsWith('9999')) {
      const yyyy = nip.substring(0, 4);
      const mm = nip.substring(4, 6);
      const dd = nip.substring(6, 8);
      tanggal_lahir = `${yyyy}-${mm}-${dd}`;
    }
    if (!tanggal_lahir) {
      tanggal_lahir = '1985-01-01';
    }
    
    const alamat_lengkap = rawAlamat || '-';
    const email = rawEmail || `${nip}@simak.go.id`;
    
    const jenis_kelamin = jenisKelaminStr === 'P' ? 2 : 1;
    const jabatan = 5; // Updated to 5 as requested
    
    return {
      cadisdik_id: 'a7d04456-3fc8-4153-b0f3-b30a730075d8',
      nama_lengkap: name,
      nik,
      tempat_lahir,
      tanggal_lahir,
      alamat_lengkap,
      nip,
      email,
      password: 'mandala123',
      jabatan,
      jenis_kelamin
    };
  });

  // Save the JSON file
  fs.writeFileSync(jsonOutputPath, JSON.stringify(mapped, null, 2), 'utf-8');
  console.log(`Saved JSON with ${mapped.length} records to ${jsonOutputPath}`);

  // Generate the seeder TypeScript file
  const code = `import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PEGAWAIS = ${JSON.stringify(mapped, null, 2)};

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
