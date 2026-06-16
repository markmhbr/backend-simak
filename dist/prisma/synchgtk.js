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
async function syncGtkProfil() {
    const jsonPath = '/home/markmhbr/simak/gtks_decrypted.json';
    if (!fs.existsSync(jsonPath)) {
        console.error('gtks_decrypted.json tidak ditemukan.');
        return;
    }
    const gtks = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Memproses ${gtks.length} data GTK dari JSON untuk sinkronisasi Formulir Profil...`);
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
                    ptk_id: item.ptk_id
                },
                select: {
                    ptk_id: true
                }
            });
            if (existing) {
                let kabKota = item.kabupaten_kota || null;
                let prov = item.provinsi || null;
                if (item.kecamatan && (!kabKota || !prov)) {
                    const kecStr = item.kecamatan.toLowerCase().replace(/\s+/g, '');
                    if (kecStr === 'baleendah') {
                        if (!kabKota)
                            kabKota = 'Kabupaten Bandung';
                        if (!prov)
                            prov = 'Jawa Barat';
                    }
                    else if (['karangtengah', 'ciranjang', 'sukaluyu', 'sualuyu', 'cianjur', 'haurwangi', 'gekbrong', 'pacet', 'bojongpicung', 'cugenang', 'cikalongkulon', 'mande'].includes(kecStr)) {
                        if (!kabKota)
                            kabKota = 'Kabupaten Cianjur';
                        if (!prov)
                            prov = 'Jawa Barat';
                    }
                }
                await prisma.gtk.update({
                    where: { ptk_id: item.ptk_id },
                    data: {
                        nama: item.nama,
                        nik: item.nik || null,
                        no_kk: item.no_kk || null,
                        nuptk: item.nuptk || null,
                        nip: item.nip || null,
                        niy_nigk: item.niy_nigk || null,
                        jenis_kelamin: item.jenis_kelamin,
                        tempat_lahir: item.tempat_lahir,
                        tanggal_lahir: item.tanggal_lahir ? new Date(item.tanggal_lahir) : null,
                        nama_ibu_kandung: item.nama_ibu_kandung || null,
                        agama_id_str: item.agama_id_str || null,
                        kewarganegaraan: item.kewarganegaraan || null,
                        status_perkawinan: item.status_perkawinan || null,
                        nama_suami_istri: item.nama_suami_istri || null,
                        pekerjaan_suami_istri: item.pekerjaan_suami_istri || null,
                        nama_wajib_pajak: item.nama_wajib_pajak || null,
                        npwp: item.npwp || null,
                        alamat_jalan: item.alamat_jalan || null,
                        rt: item.rt || null,
                        rw: item.rw || null,
                        dusun: item.dusun || null,
                        desa_kelurahan: item.desa_kelurahan || null,
                        kecamatan: item.kecamatan || null,
                        kabupaten_kota: kabKota,
                        provinsi: prov,
                        kode_pos: item.kode_pos || null,
                        lintang: item.lintang ? parseFloat(item.lintang) : null,
                        bujur: item.bujur ? parseFloat(item.bujur) : null,
                        status: item.status
                    }
                });
                updatedCount++;
            }
            else {
                notFoundCount++;
            }
        }
        catch (err) {
            console.error(`Gagal update GTK ptk_id ${item.ptk_id}: ${err.message}`);
        }
    }
    console.log(`\n=== SINKRONISASI SELESAI ===`);
    console.log(`Berhasil diupdate : ${updatedCount}`);
    console.log(`Dilewati (Skipped): ${skippedCount}`);
    console.log(`Tidak ditemukan  : ${notFoundCount} (di database)`);
}
async function main() {
    console.log('=== MEMULAI SINKRONISASI FORMULIR PROFIL GTK ===');
    await syncGtkProfil();
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=synchgtk.js.map