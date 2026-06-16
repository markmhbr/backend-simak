"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrl = envContent.match(/DATABASE_URL="?([^"\n\r]*)"?/)?.[1];
if (!dbUrl) {
    console.error('DATABASE_URL tidak ditemukan di .env');
    process.exit(1);
}
const pool = new pg_1.Pool({ connectionString: dbUrl });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
function parseDecimal(val) {
    if (val === null || val === undefined || val === '')
        return null;
    try {
        const num = Number(val);
        if (isNaN(num))
            return null;
        return new client_1.Prisma.Decimal(val);
    }
    catch {
        return null;
    }
}
async function syncGtkAlamat() {
    const jsonPath = '/home/markmhbr/simak/gtks_decrypted.json';
    if (!fs.existsSync(jsonPath)) {
        console.error('gtks_decrypted.json tidak ditemukan.');
        return;
    }
    const gtks = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Memproses ${gtks.length} data GTK dari JSON untuk sinkronisasi Alamat (Status: Aktif)...`);
    let updatedCount = 0;
    let skippedCount = 0;
    let notFoundCount = 0;
    for (const item of gtks) {
        if (item.status !== 'Aktif') {
            skippedCount++;
            continue;
        }
        try {
            const existing = await prisma.gtk.findFirst({
                where: {
                    ptk_id: item.ptk_id,
                    status: 'Aktif'
                },
                select: { ptk_id: true }
            });
            if (existing) {
                await prisma.gtk.update({
                    where: { ptk_id: item.ptk_id },
                    data: {
                        alamat_jalan: item.alamat_jalan || null,
                        rt: item.rt || null,
                        rw: item.rw || null,
                        dusun: item.dusun || null,
                        desa_kelurahan: item.desa_kelurahan || null,
                        kecamatan: item.kecamatan || null,
                        kabupaten_kota: item.kabupaten_kota || null,
                        provinsi: item.provinsi || null,
                        kode_pos: item.kode_pos || null,
                        lintang: parseDecimal(item.lintang),
                        bujur: parseDecimal(item.bujur)
                    }
                });
                updatedCount++;
            }
            else {
                notFoundCount++;
            }
        }
        catch (err) {
            console.error(`Gagal update Alamat GTK ptk_id ${item.ptk_id}: ${err.message}`);
        }
    }
    console.log(`GTK Alamat Sync Selesai: Updated=${updatedCount}, Skipped (Non-Aktif)=${skippedCount}, Not Found / Non-Aktif in DB=${notFoundCount}`);
}
async function syncPesertaDidikAlamat() {
    const jsonPath = '/home/markmhbr/simak/siswas_decrypted.json';
    if (!fs.existsSync(jsonPath)) {
        console.error('siswas_decrypted.json tidak ditemukan.');
        return;
    }
    const siswas = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Memproses ${siswas.length} data Peserta Didik dari JSON untuk sinkronisasi Alamat (Status: Aktif)...`);
    let updatedCount = 0;
    let skippedCount = 0;
    let notFoundCount = 0;
    for (const item of siswas) {
        if (item.status !== 'Aktif') {
            skippedCount++;
            continue;
        }
        try {
            const existing = await prisma.pesertaDidik.findFirst({
                where: {
                    peserta_didik_id: item.peserta_didik_id,
                    status: 'Aktif'
                },
                select: { peserta_didik_id: true }
            });
            if (existing) {
                await prisma.pesertaDidik.update({
                    where: { peserta_didik_id: item.peserta_didik_id },
                    data: {
                        alamat_jalan: item.alamat_jalan || null,
                        rt: item.rt || null,
                        rw: item.rw || null,
                        dusun: item.dusun || null,
                        desa_kelurahan: item.desa_kelurahan || null,
                        kecamatan: item.kecamatan || null,
                        kabupaten_kota: item.kabupaten_kota || null,
                        provinsi: item.provinsi || null,
                        kode_pos: item.kode_pos || null,
                        jenis_tinggal_id_str: item.jenis_tinggal_id_str || null,
                        alat_transportasi_id_str: item.alat_transportasi_id_str || null,
                        lintang: parseDecimal(item.lintang),
                        bujur: parseDecimal(item.bujur)
                    }
                });
                updatedCount++;
            }
            else {
                notFoundCount++;
            }
        }
        catch (err) {
            console.error(`Gagal update Alamat Peserta Didik peserta_didik_id ${item.peserta_didik_id}: ${err.message}`);
        }
    }
    console.log(`Peserta Didik Alamat Sync Selesai: Updated=${updatedCount}, Skipped (Non-Aktif)=${skippedCount}, Not Found / Non-Aktif in DB=${notFoundCount}`);
}
async function main() {
    console.log('=== MEMULAI SINKRONISASI KOLOM ALAMAT DAN TEMPAT TINGGAL (STATUS: AKTIF) ===');
    await syncGtkAlamat();
    await syncPesertaDidikAlamat();
    console.log('=== SINKRONISASI SELESAI ===');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=sync-alamat.js.map