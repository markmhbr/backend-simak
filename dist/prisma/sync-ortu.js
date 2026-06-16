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
function orNull(val) {
    if (val === null || val === undefined || val === '' || val === '-')
        return null;
    return String(val);
}
function intOrNull(val) {
    if (val === null || val === undefined || val === '')
        return null;
    const num = parseInt(val, 10);
    return isNaN(num) ? null : num;
}
async function syncPesertaDidikOrtu() {
    const jsonPath = '/home/markmhbr/simak/siswas_decrypted.json';
    if (!fs.existsSync(jsonPath)) {
        console.error('siswas_decrypted.json tidak ditemukan.');
        return;
    }
    const siswas = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Memproses ${siswas.length} data Peserta Didik dari JSON untuk sinkronisasi Data Ayah/Ibu/Wali (Status: Aktif)...`);
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
                        nama_ayah: orNull(item.nama_ayah),
                        nik_ayah: orNull(item.nik_ayah),
                        tahun_lahir_ayah: orNull(item.tahun_lahir_ayah),
                        pekerjaan_ayah_id_str: orNull(item.pekerjaan_ayah_id_str),
                        pendidikan_ayah_id_str: orNull(item.pendidikan_ayah_id_str),
                        penghasilan_ayah_id_str: orNull(item.penghasilan_ayah_id_str),
                        no_wa_ayah: orNull(item.no_wa_ayah),
                        nama_ibu: orNull(item.nama_ibu),
                        nama_ibu_kandung: orNull(item.nama_ibu_kandung),
                        nik_ibu: orNull(item.nik_ibu),
                        tahun_lahir_ibu: orNull(item.tahun_lahir_ibu),
                        pekerjaan_ibu_id_str: orNull(item.pekerjaan_ibu_id_str),
                        pendidikan_ibu_id_str: orNull(item.pendidikan_ibu_id_str),
                        penghasilan_ibu_id_str: orNull(item.penghasilan_ibu_id_str),
                        no_wa_ibu: orNull(item.no_wa_ibu),
                        ...(item.status_wali && item.status_wali !== 'Tidak' ? {
                            nama_wali: orNull(item.nama_wali),
                            nik_wali: orNull(item.nik_wali),
                            tahun_lahir_wali: orNull(item.tahun_lahir_wali),
                            pekerjaan_wali_id_str: orNull(item.pekerjaan_wali_id_str),
                            pendidikan_wali_id_str: orNull(item.pendidikan_wali_id_str),
                            penghasilan_wali_id_str: orNull(item.penghasilan_wali_id_str),
                            no_wa_wali: orNull(item.no_wa_wali),
                            status_wali: item.status_wali,
                        } : {
                            status_wali: item.status_wali || 'Tidak',
                        }),
                    }
                });
                updatedCount++;
            }
            else {
                notFoundCount++;
            }
        }
        catch (err) {
            console.error(`Gagal update Ortu Peserta Didik peserta_didik_id ${item.peserta_didik_id}: ${err.message}`);
        }
    }
    console.log(`Peserta Didik Ortu Sync Selesai: Updated=${updatedCount}, Skipped (Non-Aktif)=${skippedCount}, Not Found / Non-Aktif in DB=${notFoundCount}`);
}
async function main() {
    console.log('=== MEMULAI SINKRONISASI DATA AYAH / IBU / WALI (STATUS: AKTIF) ===');
    await syncPesertaDidikOrtu();
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
//# sourceMappingURL=sync-ortu.js.map