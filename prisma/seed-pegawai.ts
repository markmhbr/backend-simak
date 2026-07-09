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
    "nama_lengkap": "ADE SOFYAN, S.P., M.P",
    "nik": "1966071219890210",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1966-07-12",
    "alamat_lengkap": "-",
    "nip": "196607121989021003",
    "email": "196607121989021003@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "SUTINI, S.Pd., M.Par",
    "nik": "1972060519970320",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1972-06-05",
    "alamat_lengkap": "-",
    "nip": "197206051997032011",
    "email": "197206051997032011@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "TINA SUNDARI, S.Pd., M.Pd",
    "nik": "1973011720050120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1973-01-17",
    "alamat_lengkap": "-",
    "nip": "197301172005012005",
    "email": "197301172005012005@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "SRI EKO BAMBANG SETYANTORO, S.P., M.P",
    "nik": "1969062619990310",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1969-06-26",
    "alamat_lengkap": "-",
    "nip": "196906261999031009",
    "email": "196906261999031009@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "SURYANA, S.Pd., M.Pd",
    "nik": "1973031920000310",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1973-03-19",
    "alamat_lengkap": "-",
    "nip": "197303192000031002",
    "email": "197303192000031002@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "HASANUDIN, S.Pd., M.M.Pd",
    "nik": "1968070520060410",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1968-07-05",
    "alamat_lengkap": "-",
    "nip": "196807052006041018",
    "email": "196807052006041018@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ECEP JAJA MIHARJA, M.Pd.",
    "nik": "1969110720080110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1969-11-07",
    "alamat_lengkap": "-",
    "nip": "196911072008011006",
    "email": "196911072008011006@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ERNI WARDHANI, M.Pd",
    "nik": "1974051220080120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1974-05-12",
    "alamat_lengkap": "-",
    "nip": "197405122008012003",
    "email": "197405122008012003@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "Dr. DERI YUSTIN WULANDARI, M.Pd",
    "nik": "1973031120050120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1973-03-11",
    "alamat_lengkap": "-",
    "nip": "197303112005012007",
    "email": "197303112005012007@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ASEP KURNIA, M.Ag.",
    "nik": "1977041920090110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1977-04-19",
    "alamat_lengkap": "-",
    "nip": "197704192009011008",
    "email": "197704192009011008@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ARIES FRIANSYAH, S.Pd., M.T",
    "nik": "1980010220090110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1980-01-02",
    "alamat_lengkap": "-",
    "nip": "198001022009011010",
    "email": "198001022009011010@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "TUTI ADAWIYAH, M.Pd.",
    "nik": "1984021320090220",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1984-02-13",
    "alamat_lengkap": "-",
    "nip": "198402132009022007",
    "email": "198402132009022007@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ERIK PRATAMA, S.Pd., M.T.",
    "nik": "1985011520090110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1985-01-15",
    "alamat_lengkap": "-",
    "nip": "198501152009011007",
    "email": "198501152009011007@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ERLYNDHIA TIRANA H, S.Ag., M.Pd.I",
    "nik": "1973072520070120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1973-07-25",
    "alamat_lengkap": "-",
    "nip": "197307252007012008",
    "email": "197307252007012008@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "Drs. Agus Hamdan Satiagraha, M,M",
    "nik": "1967100819950110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1967-10-08",
    "alamat_lengkap": "-",
    "nip": "196710081995011001",
    "email": "196710081995011001@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "Dr. Hj. Sri Rahayu Ningsih, M.Pd",
    "nik": "1967051620070120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1967-05-16",
    "alamat_lengkap": "-",
    "nip": "196705162007012008",
    "email": "196705162007012008@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "Lilis Warliah, S.Pd., M.T",
    "nik": "1975080219990320",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1975-08-02",
    "alamat_lengkap": "-",
    "nip": "197508021999032005",
    "email": "197508021999032005@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "Badriah, M.Pd",
    "nik": "1968040619951220",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1968-04-06",
    "alamat_lengkap": "-",
    "nip": "196804061995122002",
    "email": "196804061995122002@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "Cece Sutia, M.Pd",
    "nik": "1984100220090110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1984-10-02",
    "alamat_lengkap": "-",
    "nip": "198410022009011001",
    "email": "198410022009011001@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "Dr. Yunina Surtiana, M.Pd",
    "nik": "1976011620000320",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1976-01-16",
    "alamat_lengkap": "-",
    "nip": "197601162000032002",
    "email": "197601162000032002@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "INDAH BUDIATI, S.Pd., M.I.L",
    "nik": "1980122520090120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1980-12-25",
    "alamat_lengkap": "-",
    "nip": "198012252009012011",
    "email": "198012252009012011@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ITANG SUPRIATNA, S.Pd., M.Si",
    "nik": "1969091319910910",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1969-09-13",
    "alamat_lengkap": "-",
    "nip": "196909131991091001",
    "email": "196909131991091001@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "NINING YUSTIANA, S.Pd., M.M",
    "nik": "1978110320081201",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1978-11-03",
    "alamat_lengkap": "-",
    "nip": "19781103200812010",
    "email": "19781103200812010@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "AI MULYATI, S.Pd., M.Pd",
    "nik": "1981092020100120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1981-09-20",
    "alamat_lengkap": "-",
    "nip": "198109202010012004",
    "email": "198109202010012004@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "IRVAN NOORTSANI, M.Pd",
    "nik": "1985122920090210",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1985-12-29",
    "alamat_lengkap": "-",
    "nip": "198512292009021003",
    "email": "198512292009021003@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "ROSMALA, S.Pd., M.Pd",
    "nik": "1976011320070120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1976-01-13",
    "alamat_lengkap": "-",
    "nip": "197601132007012006",
    "email": "197601132007012006@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "AI MUFLIHAH, S.Pd., M.Pd",
    "nik": "1976022720060420",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1976-02-27",
    "alamat_lengkap": "-",
    "nip": "197602272006042017",
    "email": "197602272006042017@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 2
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "MUCHAMAD RUSLAN MUNAWAR, S.Pd., M.M",
    "nik": "1975012920050110",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1975-01-29",
    "alamat_lengkap": "-",
    "nip": "197501292005011001",
    "email": "197501292005011001@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
  },
  {
    "cadisdik_id": "a7d04456-3fc8-4153-b0f3-b30a730075d8",
    "nama_lengkap": "SINTHESA NOOR, S.Pd, M.M.Pd",
    "nik": "1974020120080120",
    "tempat_lahir": "Bandung",
    "tanggal_lahir": "1974-02-01",
    "alamat_lengkap": "-",
    "nip": "197402012008012004",
    "email": "197402012008012004@simak.go.id",
    "password": "mandala123",
    "jabatan": 6,
    "jenis_kelamin": 1
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
