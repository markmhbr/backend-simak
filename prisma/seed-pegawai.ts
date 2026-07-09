import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PEGAWAIS = [
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ANGGA PRAKASA",
    "nik": "1995052520252110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1995-05-25",
    "alamat_lengkap": "-",
    "nip": "199505252025211073",
    "email": "199505252025211073@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ANGGI PEBRIANI TASWIN",
    "nik": "1985022820252120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1985-02-28",
    "alamat_lengkap": "-",
    "nip": "198502282025212041",
    "email": "198502282025212041@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ANIK RATINAH",
    "nik": "1992010820252120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1992-01-08",
    "alamat_lengkap": "-",
    "nip": "199201082025212072",
    "email": "199201082025212072@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ARADHEA KURNIA RAMADHAN",
    "nik": "1994031320252110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1994-03-13",
    "alamat_lengkap": "-",
    "nip": "199403132025211061",
    "email": "199403132025211061@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "HARI BAGJA",
    "nik": "9999990000000000",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1985-01-01",
    "alamat_lengkap": "-",
    "nip": "999999000000000015",
    "email": "999999000000000015@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "HENRY ISKANDAR",
    "nik": "1973110720252110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1973-11-07",
    "alamat_lengkap": "-",
    "nip": "197311072025211013",
    "email": "197311072025211013@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "KARTIKA",
    "nik": "1979060220252120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1979-06-02",
    "alamat_lengkap": "-",
    "nip": "197906022025212024",
    "email": "197906022025212024@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "LUTHFI LAZUARDI MAHARDHIKA",
    "nik": "1995081320252111",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1995-08-13",
    "alamat_lengkap": "-",
    "nip": "199508132025211107",
    "email": "199508132025211107@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "NINA MUNAJAH",
    "nik": "1989051420252120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1989-05-14",
    "alamat_lengkap": "-",
    "nip": "198905142025212071",
    "email": "198905142025212071@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "NISA NUR JAYANTIKA",
    "nik": "9999990000000000",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1985-01-01",
    "alamat_lengkap": "-",
    "nip": "999999000000000020",
    "email": "999999000000000020@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "NOVIANTI ADITYA DEWI",
    "nik": "9999990000000000",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1985-01-01",
    "alamat_lengkap": "-",
    "nip": "999999000000000021",
    "email": "999999000000000021@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "RENDY MARYANDI",
    "nik": "9999990000000000",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1985-01-01",
    "alamat_lengkap": "-",
    "nip": "999999000000000022",
    "email": "999999000000000022@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "RIZKI AHMAD NURFAHMI",
    "nik": "9999990000000000",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1985-01-01",
    "alamat_lengkap": "-",
    "nip": "999999000000000023",
    "email": "999999000000000023@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "SELVIA RIZKI NUGRAHA",
    "nik": "1997061520252120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1997-06-15",
    "alamat_lengkap": "-",
    "nip": "199706152025212056",
    "email": "199706152025212056@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "WAWAN SETIAWAN",
    "nik": "9999990000000000",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1985-01-01",
    "alamat_lengkap": "-",
    "nip": "999999000000000025",
    "email": "999999000000000025@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "YAYAT SUPRIATNA",
    "nik": "1984040320252110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1984-04-03",
    "alamat_lengkap": "-",
    "nip": "198404032025211080",
    "email": "198404032025211080@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ANDYAN PUTRI SYAKIRA",
    "nik": "2002122320252120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "2002-12-23",
    "alamat_lengkap": "-",
    "nip": "200212232025212004",
    "email": "200212232025212004@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "PANJI UTAMA CHAKTI",
    "nik": "1989111320252110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1989-11-13",
    "alamat_lengkap": "-",
    "nip": "198911132025211066",
    "email": "198911132025211066@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "FEBIANNE ANASKA",
    "nik": "1996021020252121",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1996-02-10",
    "alamat_lengkap": "-",
    "nip": "199602102025212155",
    "email": "199602102025212155@simak.go.id",
    "password": "mandala123",
    "jabatan": 5,
    "jenis_kelamin": 2
  }
];

async function main() {
  const targetCadisdikId = 'a7d04456-3fc8-4153-b0f3-b30a730075d8';
  
  console.log('Checking/creating target Cadisdik...');
  let cadisdik = await prisma.cadisdik.findUnique({
    where: { cadisdik_id: targetCadisdikId }
  });
  
  if (!cadisdik) {
    console.log(`Creating Cadisdik with ID ${targetCadisdikId}...`);
    cadisdik = await prisma.cadisdik.create({
      data: {
        cadisdik_id: targetCadisdikId,
        nama_instansi: 'KCD Wilayah S',
        aktif: true
      }
    });
  }

  console.log(`Starting import of ${PEGAWAIS.length} Pegawai records...`);
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
      console.log(`Skipping existing Pegawai: ${p.nama_lengkap} (NIP: ${p.nip})`);
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

    console.log(`Imported Pegawai: ${p.nama_lengkap}`);
    successCount++;
  }

  console.log(`Import completed. Mapped: ${successCount} successful, ${skippedCount} skipped.`);
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
