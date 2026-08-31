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
  console.log('🔄 Memulai migrasi format qr_token ke: ${sekolah_id}/${id}...');

  // 1. Migrasi Peserta Didik
  const students = await prisma.pesertaDidik.findMany({
    select: { peserta_didik_id: true, sekolah_id: true, qr_token: true },
  });

  let pdUpdated = 0;
  for (const s of students) {
    if (!s.sekolah_id) continue;
    const expectedToken = `${s.sekolah_id}/${s.peserta_didik_id}`;
    if (s.qr_token !== expectedToken) {
      await prisma.pesertaDidik.update({
        where: { peserta_didik_id: s.peserta_didik_id },
        data: { qr_token: expectedToken },
      });
      pdUpdated++;
    }
  }
  console.log(`✅ Peserta Didik dimigrasi: ${pdUpdated} dari total ${students.length}`);

  // 2. Migrasi GTK
  const gtks = await prisma.gtk.findMany({
    select: { ptk_id: true, sekolah_id: true, qr_token: true },
  });

  let gtkUpdated = 0;
  for (const g of gtks) {
    if (!g.sekolah_id) continue;
    const expectedToken = `${g.sekolah_id}/${g.ptk_id}`;
    if (g.qr_token !== expectedToken) {
      await prisma.gtk.update({
        where: { ptk_id: g.ptk_id },
        data: { qr_token: expectedToken },
      });
      gtkUpdated++;
    }
  }
  console.log(`✅ GTK dimigrasi: ${gtkUpdated} dari total ${gtks.length}`);
  console.log('🎉 Migrasi qr_token selesai dengan sukses!');
}

main()
  .catch((e) => {
    console.error('❌ Error migrasi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
