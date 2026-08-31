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
  const targetId = 'f9db3138-3deb-456a-85a7-df5f7b55edfd';
  console.log(`🔍 Memeriksa data peserta didik dengan ID: ${targetId}...\n`);

  const student = await prisma.pesertaDidik.findUnique({
    where: { peserta_didik_id: targetId },
    select: {
      peserta_didik_id: true,
      sekolah_id: true,
      nama: true,
      nisn: true,
      nipd: true,
      qr_token: true,
    },
  });

  if (!student) {
    console.log(`❌ Siswa dengan ID "${targetId}" TIDAK DITEMUKAN di database.`);
  } else {
    console.log('====================================================');
    console.log('✅ DATA SISWA DITEMUKAN:');
    console.log('====================================================');
    console.log(`Nama        : ${student.nama}`);
    console.log(`NISN        : ${student.nisn || '-'}`);
    console.log(`NIPD        : ${student.nipd || '-'}`);
    console.log(`Sekolah ID  : ${student.sekolah_id}`);
    console.log(`ID Siswa    : ${student.peserta_didik_id}`);
    console.log(`QR Token DB : ${student.qr_token || '(KOSONG)'}`);
    console.log('----------------------------------------------------');
    const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const fullQrUrl = student.qr_token
      ? (student.qr_token.startsWith('http') ? student.qr_token : `${appUrl}/p/${student.qr_token}`)
      : `${appUrl}/p/${student.sekolah_id}/${student.peserta_didik_id}`;
    console.log(`Full QR URL : ${fullQrUrl}`);
    console.log('====================================================');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error saat query:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
