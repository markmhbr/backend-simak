import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

async function checkTables() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    // Get references
    const refJenisKeluar = await prisma.jenis_keluar.findMany({
      select: { jenis_keluar_id: true, ket_keluar: true }
    });
    console.log('refJenisKeluar:', refJenisKeluar);

    // Get non-active students
    const students = await prisma.pesertaDidik.findMany({
      where: { NOT: { status: 'Aktif' } },
      take: 5,
      select: {
        peserta_didik_id: true,
        nama: true,
        jenis_keluar_id: true,
        keterangan: true
      }
    });
    
    console.log('Raw students from DB:', students);

    // Perform mapping
    const mapped = students.map((item) => {
      const jk = refJenisKeluar.find(
        (r: any) => String(r.jenis_keluar_id) === String(item.jenis_keluar_id)
      );
      return {
        nama: item.nama,
        jenis_keluar_id: item.jenis_keluar_id,
        jenis_keluar_id_str: jk?.ket_keluar || null,
        keterangan: item.keterangan
      };
    });

    console.log('Mapped students:', JSON.stringify(mapped, null, 2));
  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();

