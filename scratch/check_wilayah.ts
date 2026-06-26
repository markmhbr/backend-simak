const { PrismaClient } = require('../node_modules/.prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Cek data wilayah untuk kode_wilayah Selajambe
  const desa = await prisma.mst_wilayah.findUnique({
    where: { kode_wilayah: '020715AG' },
  });
  console.log('=== DESA (020715AG) ===');
  console.log(JSON.stringify(desa, null, 2));

  // Cek parent chain
  if (desa?.mst_kode_wilayah) {
    const parent1 = await prisma.mst_wilayah.findUnique({
      where: { kode_wilayah: desa.mst_kode_wilayah },
    });
    console.log('\n=== PARENT 1 (kecamatan?) ===');
    console.log('kode:', desa.mst_kode_wilayah);
    console.log('nama:', parent1?.nama);
    console.log('id_level_wilayah:', parent1?.id_level_wilayah);
    console.log('mst_kode_wilayah:', parent1?.mst_kode_wilayah);

    if (parent1?.mst_kode_wilayah) {
      const parent2 = await prisma.mst_wilayah.findUnique({
        where: { kode_wilayah: parent1.mst_kode_wilayah },
      });
      console.log('\n=== PARENT 2 (kabupaten?) ===');
      console.log('kode:', parent1.mst_kode_wilayah);
      console.log('nama:', parent2?.nama);
      console.log('id_level_wilayah:', parent2?.id_level_wilayah);
      console.log('mst_kode_wilayah:', parent2?.mst_kode_wilayah);

      if (parent2?.mst_kode_wilayah) {
        const parent3 = await prisma.mst_wilayah.findUnique({
          where: { kode_wilayah: parent2.mst_kode_wilayah },
        });
        console.log('\n=== PARENT 3 (provinsi?) ===');
        console.log('kode:', parent2.mst_kode_wilayah);
        console.log('nama:', parent3?.nama);
        console.log('id_level_wilayah:', parent3?.id_level_wilayah);
        console.log('mst_kode_wilayah:', parent3?.mst_kode_wilayah);

        if (parent3?.mst_kode_wilayah) {
          const parent4 = await prisma.mst_wilayah.findUnique({
            where: { kode_wilayah: parent3.mst_kode_wilayah },
          });
          console.log('\n=== PARENT 4 (negara?) ===');
          console.log('kode:', parent3.mst_kode_wilayah);
          console.log('nama:', parent4?.nama);
          console.log('id_level_wilayah:', parent4?.id_level_wilayah);
        }
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
