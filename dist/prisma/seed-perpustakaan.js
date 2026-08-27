"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
require("dotenv/config");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function seedPerpustakaan() {
    console.log('Seeding data Perpustakaan...');
    const sekolah = await prisma.sekolah.findFirst();
    if (!sekolah) {
        console.log('Tidak ada data sekolah ditemukan. Silakan buat sekolah terlebih dahulu.');
        return;
    }
    const sekolahId = sekolah.sekolah_id;
    console.log(`Menggunakan sekolah_id: ${sekolahId} (${sekolah.nama})`);
    const kategoriList = [
        { nama: 'Pelajaran', deskripsi: 'Buku teks utama dan penunjang kurikulum pelajaran sekolah' },
        { nama: 'Novel', deskripsi: 'Koleksi karya fiksi, sastra, dan cerita inspiratif' },
        { nama: 'Referensi', deskripsi: 'Ensiklopedia, kamus, buku panduan, dan pedoman umum' },
        { nama: 'Teknologi', deskripsi: 'Buku pemrograman, komputer, sains terapan, dan inovasi IT' },
        { nama: 'Agama', deskripsi: 'Buku kajian keagamaan, akhlak, dan sejarah peradaban' },
        { nama: 'Sejarah', deskripsi: 'Buku sejarah nasional, dunia, biografi tokoh perjuangan' },
    ];
    const kategoriMap = {};
    for (const kat of kategoriList) {
        const existing = await prisma.kategoriBuku.findUnique({
            where: {
                sekolah_id_nama: {
                    sekolah_id: sekolahId,
                    nama: kat.nama,
                },
            },
        });
        if (!existing) {
            const created = await prisma.kategoriBuku.create({
                data: {
                    sekolah_id: sekolahId,
                    nama: kat.nama,
                    deskripsi: kat.deskripsi,
                },
            });
            kategoriMap[kat.nama] = created.kategori_buku_id;
            console.log(`Kategori '${kat.nama}' dibuat.`);
        }
        else {
            kategoriMap[kat.nama] = existing.kategori_buku_id;
            console.log(`Kategori '${kat.nama}' sudah ada.`);
        }
    }
    const sampleBooks = [
        {
            kode: 'BK-PEL-001',
            isbn: '978-602-244-325-4',
            judul: 'Matematika Tingkat Lanjut SMA/MA Kelas XI',
            penulis: 'Al Azhary Masta, dkk.',
            penerbit: 'Pusat Perbukuan Kemendikbudristek',
            tahun_terbit: 2023,
            kategori_buku_id: kategoriMap['Pelajaran'],
            jumlah: 30,
            tersedia: 30,
            kondisi: 1,
            lokasi_rak: 'Rak A1 - Pelajaran',
            deskripsi: 'Buku teks kurikulum merdeka untuk mata pelajaran Matematika Tingkat Lanjut Kelas XI.',
            status: 1,
        },
        {
            kode: 'BK-PEL-002',
            isbn: '978-602-244-367-4',
            judul: 'Bahasa Indonesia: Tingkat Lanjut SMA/MA Kelas XI',
            penulis: 'Rahmah Purwahida, dkk.',
            penerbit: 'Pusat Perbukuan Kemendikbudristek',
            tahun_terbit: 2023,
            kategori_buku_id: kategoriMap['Pelajaran'],
            jumlah: 25,
            tersedia: 25,
            kondisi: 1,
            lokasi_rak: 'Rak A2 - Pelajaran',
            deskripsi: 'Buku teks kurikulum merdeka untuk Bahasa Indonesia Kelas XI.',
            status: 1,
        },
        {
            kode: 'BK-NOV-001',
            isbn: '978-979-3062-79-2',
            judul: 'Laskar Pelangi',
            penulis: 'Andrea Hirata',
            penerbit: 'Bentang Pustaka',
            tahun_terbit: 2005,
            kategori_buku_id: kategoriMap['Novel'],
            jumlah: 10,
            tersedia: 10,
            kondisi: 1,
            lokasi_rak: 'Rak B1 - Sastra',
            deskripsi: 'Kisah perjuangan sepuluh anak di Belitung dalam menuntut ilmu.',
            status: 1,
        },
        {
            kode: 'BK-TEK-001',
            isbn: '978-623-00-1234-5',
            judul: 'Dasar Pemrograman Web Modern dengan TypeScript',
            penulis: 'Tim Pengembang IT',
            penerbit: 'Informatika Pratama',
            tahun_terbit: 2024,
            kategori_buku_id: kategoriMap['Teknologi'],
            jumlah: 15,
            tersedia: 15,
            kondisi: 1,
            lokasi_rak: 'Rak C1 - Komputer',
            deskripsi: 'Panduan lengkap belajar TypeScript dan backend development.',
            status: 1,
        },
        {
            kode: 'BK-REF-001',
            isbn: '978-979-081-123-0',
            judul: 'Kamus Besar Bahasa Indonesia Edisi V',
            penulis: 'Badan Pengembangan dan Pembinaan Bahasa',
            penerbit: 'Balai Pustaka',
            tahun_terbit: 2020,
            kategori_buku_id: kategoriMap['Referensi'],
            jumlah: 5,
            tersedia: 5,
            kondisi: 1,
            lokasi_rak: 'Rak R1 - Kamus',
            deskripsi: 'Kamus rujukan bahasa Indonesia terlengkap dan baku.',
            status: 1,
        },
    ];
    for (const book of sampleBooks) {
        if (!book.kategori_buku_id)
            continue;
        const existingBook = await prisma.buku.findUnique({
            where: {
                sekolah_id_kode: {
                    sekolah_id: sekolahId,
                    kode: book.kode,
                },
            },
        });
        if (!existingBook) {
            await prisma.buku.create({
                data: {
                    sekolah_id: sekolahId,
                    ...book,
                },
            });
            console.log(`Buku '${book.judul}' (${book.kode}) berhasil dibuat.`);
        }
        else {
            console.log(`Buku '${book.judul}' (${book.kode}) sudah ada.`);
        }
    }
    console.log('Seed perpustakaan selesai!');
}
seedPerpustakaan()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-perpustakaan.js.map