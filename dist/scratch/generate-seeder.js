"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
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
//# sourceMappingURL=generate-seeder.js.map