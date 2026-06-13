const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = "postgresql://postgres:simak@localhost:5433/simak_db?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const rombels = await prisma.rombonganBelajar.findMany({
    take: 10,
    select: {
      rombongan_belajar_id: true,
      nama: true,
      sekolah_id: true,
      jenis_rombel_str: true,
    }
  });
  console.log("Rombongan Belajar (Sample):", rombels);

  const pembelajarans = await prisma.pembelajaran.findMany({
    take: 10,
    select: {
      pembelajaran_id: true,
      rombongan_belajar_id: true,
      nama_mata_pelajaran: true,
    }
  });
  console.log("Pembelajaran (Sample):", pembelajarans);

  if (rombels.length > 0) {
    const targetRombel = rombels[0];
    console.log(`\nTesting getRombelPembelajaran for rombel ID: ${targetRombel.rombongan_belajar_id} (${targetRombel.nama})`);
    
    // 1. Cari dulu nama rombel ini
    const rombel = await prisma.rombonganBelajar.findUnique({
      where: { rombongan_belajar_id: targetRombel.rombongan_belajar_id },
      select: { nama: true, sekolah_id: true },
    });

    console.log("Found Rombel:", rombel);

    if (rombel) {
      // 2. Cari semua rombel yang namanya sama
      const relatedRombels = await prisma.rombonganBelajar.findMany({
        where: {
          nama: rombel.nama,
          sekolah_id: rombel.sekolah_id,
          jenis_rombel_str: { in: ['Kelas', 'Matapelajaran Pilihan'] },
        },
        select: { rombongan_belajar_id: true },
      });

      console.log("Related Rombels:", relatedRombels);

      const rombelIds = relatedRombels.map((r) => r.rombongan_belajar_id);

      // 3. Tarik semua pembelajaran dari rombel-rombel tersebut
      const pemb = await prisma.pembelajaran.findMany({
        where: { rombongan_belajar_id: { in: rombelIds } },
        select: {
          pembelajaran_id: true,
          nama_mata_pelajaran: true,
          jam_mengajar_per_minggu: true,
          ptk_id: true,
          ptk_id_str: true,
        },
      });

      console.log(`Pembelajaran found for related rombels (${rombelIds.join(', ')}):`, pemb);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
