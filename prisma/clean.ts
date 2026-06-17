import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClien
async function clean() {
  // Hapus tabel relasi dulu
  await prisma.mappingPengawas.deleteMany({});
  // Hapus data pegawai
  await prisma.pegawai.deleteMany({});
  console.log('Bersih!');
   
   clean();