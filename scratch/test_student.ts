import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const student = await prisma.pesertaDidik.findFirst({
    where: { nama: { contains: 'Ramdani', mode: 'insensitive' } },
    select: {
      peserta_didik_id: true,
      nama: true,
      kode_wilayah: true,
      desa_kelurahan: true,
      alamat_jalan: true
    }
  });

  console.log('STUDENT ROW:', student);

  if (student && student.kode_wilayah) {
    const result = {
      desa: null as string | null,
      kecamatan: null as string | null,
      kabupaten: null as string | null,
      provinsi: null as string | null,
      negara: null as string | null,
    };

    let currentKode: string | null = student.kode_wilayah.trim();
    let maxDepth = 6;

    while (currentKode && maxDepth > 0) {
      const wil = await prisma.mst_wilayah.findUnique({
        where: { kode_wilayah: currentKode },
        select: { nama: true, id_level_wilayah: true, mst_kode_wilayah: true },
      });

      console.log(`Querying ${currentKode} ->`, wil);

      if (!wil) break;

      switch (wil.id_level_wilayah) {
        case 4: result.desa = wil.nama; break;
        case 3: result.kecamatan = wil.nama; break;
        case 2: result.kabupaten = wil.nama; break;
        case 1: result.provinsi = wil.nama; break;
        case 0: result.negara = wil.nama; break;
      }

      currentKode = wil.mst_kode_wilayah?.trim() || null;
      maxDepth--;
    }

    console.log('RESOLVE RESULT:', result);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
