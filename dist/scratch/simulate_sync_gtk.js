"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrlLine = envContent.split('\n').find((l) => l.trim().startsWith('DATABASE_URL='));
const dbUrl = dbUrlLine ? dbUrlLine.split('DATABASE_URL=')[1].trim().replace(/^"|"$/g, '') : null;
if (!dbUrl) {
    console.error('DATABASE_URL tidak ditemukan di .env');
    process.exit(1);
}
const pool = new pg_1.Pool({ connectionString: dbUrl });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
const localPool = new pg_1.Pool({
    host: 'localhost',
    port: 54532,
    database: 'pendataan',
    user: 'postgres',
    password: '',
});
async function main() {
    try {
        console.log("1. Fetching Bambang Muhamad data from local Dapodik...");
        const ptkRes = await localPool.query(`
      SELECT p.*
      FROM ptk p
      WHERE p.nama = 'Bambang Muhamad' AND p.soft_delete = 0
      LIMIT 1
    `);
        if (ptkRes.rows.length === 0) {
            console.error("GTK Bambang Muhamad tidak ditemukan di DB Lokal.");
            return;
        }
        const ptk = ptkRes.rows[0];
        const ptkTerdaftarRes = await localPool.query(`
      SELECT pt.*, jk.ket_keluar 
      FROM ptk_terdaftar pt
      LEFT JOIN ref.jenis_keluar jk ON pt.jenis_keluar_id = jk.jenis_keluar_id
      WHERE pt.ptk_id = $1 AND pt.soft_delete = 0
      LIMIT 1
    `, [ptk.ptk_id]);
        ptk.ptk_terdaftar = ptkTerdaftarRes.rows[0] || null;
        ptk.status = ptk.ptk_terdaftar?.ket_keluar || 'Aktif';
        const tugasRes = await localPool.query(`
      SELECT * FROM tugas_tambahan 
      WHERE ptk_id = $1 AND soft_delete = 0 AND tst_tambahan IS NULL
    `, [ptk.ptk_id]);
        ptk.tugas_tambahan = tugasRes.rows;
        const rwyRes = await localPool.query(`
      SELECT * FROM rwy_pend_formal 
      WHERE ptk_id = $1 AND soft_delete = 0
    `, [ptk.ptk_id]);
        ptk.rwy_pend_formal = rwyRes.rows;
        console.log(`- Retrieved ${ptk.tugas_tambahan.length} active tugas_tambahan records.`);
        console.log("2. Simulating backend syncGtk logic in SIMAK DB...");
        const sekolahId = ptk.ptk_terdaftar.sekolah_id;
        const pt = ptk.ptk_terdaftar || {};
        const payload = {
            nama: ptk.nama || 'Tanpa Nama',
            nip: ptk.nip || null,
            jenis_kelamin: ptk.jenis_kelamin || null,
            tempat_lahir: ptk.tempat_lahir || null,
            tanggal_lahir: ptk.tanggal_lahir ? new Date(ptk.tanggal_lahir) : null,
            nik: ptk.nik || null,
            no_kk: ptk.no_kk || null,
            niy_nigk: ptk.niy_nigk || null,
            nuptk: ptk.nuptk || null,
            nrg: ptk.nrg || null,
            nuks: ptk.nuks || null,
            status_kepegawaian_id: ptk.status_kepegawaian_id ? Number(ptk.status_kepegawaian_id) : null,
            pengawas_bidang_studi_id: ptk.pengawas_bidang_studi_id ? Number(ptk.pengawas_bidang_studi_id) : null,
            agama_id: ptk.agama_id ? Number(ptk.agama_id) : null,
            alamat_jalan: ptk.alamat_jalan || null,
            rt: ptk.rt ? Number(ptk.rt) : null,
            rw: ptk.rw ? Number(ptk.rw) : null,
            nama_dusun: ptk.nama_dusun || null,
            desa_kelurahan: ptk.desa_kelurahan || null,
            kode_wilayah: ptk.kode_wilayah || null,
            kode_pos: ptk.kode_pos || null,
            lintang: ptk.lintang ? Number(ptk.lintang) : null,
            bujur: ptk.bujur ? Number(ptk.bujur) : null,
            no_telepon_rumah: ptk.no_telepon_rumah || null,
            no_hp: ptk.no_hp || null,
            email: ptk.email || null,
            status_keaktifan_id: ptk.status_keaktifan_id ? Number(ptk.status_keaktifan_id) : null,
            sk_cpns: ptk.sk_cpns || null,
            tgl_cpns: ptk.tgl_cpns ? new Date(ptk.tgl_cpns) : null,
            sk_pengangkatan: ptk.sk_pengangkatan || null,
            tmt_pengangkatan: ptk.tmt_pengangkatan ? new Date(ptk.tmt_pengangkatan) : null,
            lembaga_pengangkat_id: ptk.lembaga_pengangkat_id ? Number(ptk.lembaga_pengangkat_id) : null,
            pangkat_golongan_id: ptk.pangkat_golongan_id ? Number(ptk.pangkat_golongan_id) : null,
            keahlian_laboratorium_id: ptk.keahlian_laboratorium_id ? Number(ptk.keahlian_laboratorium_id) : null,
            sumber_gaji_id: ptk.sumber_gaji_id ? Number(ptk.sumber_gaji_id) : null,
            nama_ibu_kandung: ptk.nama_ibu_kandung || null,
            status_perkawinan: ptk.status_perkawinan ? Number(ptk.status_perkawinan) : null,
            nama_suami_istri: ptk.nama_suami_istri || null,
            nip_suami_istri: ptk.nip_suami_istri || null,
            pekerjaan_suami_istri: ptk.pekerjaan_suami_istri ? Number(ptk.pekerjaan_suami_istri) : null,
            tmt_pns: ptk.tmt_pns ? new Date(ptk.tmt_pns) : null,
            sudah_lisensi_kepala_sekolah: ptk.sudah_lisensi_kepala_sekolah ? Number(ptk.sudah_lisensi_kepala_sekolah) : null,
            jumlah_sekolah_binaan: ptk.jumlah_sekolah_binaan ? Number(ptk.jumlah_sekolah_binaan) : null,
            pernah_diklat_kepengawasan: ptk.pernah_diklat_kepengawasan ? Number(ptk.pernah_diklat_kepengawasan) : null,
            nm_wp: ptk.nm_wp || null,
            status_data: ptk.status_data ? Number(ptk.status_data) : null,
            karpeg: ptk.karpeg || null,
            karpas: ptk.karpas || null,
            mampu_handle_kk: ptk.mampu_handle_kk ? Number(ptk.mampu_handle_kk) : null,
            keahlian_braille: ptk.keahlian_braille ? Number(ptk.keahlian_braille) : null,
            keahlian_bhs_isyarat: ptk.keahlian_bhs_isyarat ? Number(ptk.keahlian_bhs_isyarat) : null,
            kebutuhan_khusus_id: ptk.kebutuhan_khusus_id ? Number(ptk.kebutuhan_khusus_id) : null,
            npwp: ptk.npwp || null,
            kewarganegaraan: ptk.kewarganegaraan || null,
            id_bank: ptk.id_bank || null,
            rekening_bank: ptk.rekening_bank || null,
            rekening_atas_nama: ptk.rekening_atas_nama || null,
            blob_id: ptk.blob_id || null,
            soft_delete: ptk.soft_delete ? Number(ptk.soft_delete) : 0,
            last_sync: ptk.last_sync ? new Date(ptk.last_sync) : null,
            updater_id: ptk.updater_id || null,
            ptk_terdaftar_id: pt.ptk_terdaftar_id || null,
            sekolah_id: sekolahId,
            jenis_keluar_id: pt.jenis_keluar_id || null,
            jabatan_ptk_id: pt.jabatan_ptk_id ? Number(pt.jabatan_ptk_id) : null,
            tahun_ajaran_id: pt.tahun_ajaran_id ? Number(pt.tahun_ajaran_id) : null,
            jenis_ptk_id: pt.jenis_ptk_id ? Number(pt.jenis_ptk_id) : null,
            nomor_surat_tugas: pt.nomor_surat_tugas || null,
            tanggal_surat_tugas: pt.tanggal_surat_tugas ? new Date(pt.tanggal_surat_tugas) : null,
            ptk_induk: pt.ptk_induk ? Number(pt.ptk_induk) : null,
            tmt_tugas: pt.tmt_tugas ? new Date(pt.tmt_tugas) : null,
            tgl_ptk_keluar: pt.tgl_ptk_keluar ? new Date(pt.tgl_ptk_keluar) : null,
            status: ptk.status || 'Aktif',
        };
        await prisma.gtk.upsert({
            where: { ptk_id: ptk.ptk_id },
            create: { ...payload, ptk_id: ptk.ptk_id },
            update: payload,
        });
        const ttRaw = ptk.tugas_tambahan;
        if (ttRaw && Array.isArray(ttRaw)) {
            for (const tt of ttRaw) {
                if (!tt.ptk_tugas_tambahan_id)
                    continue;
                const ttPayload = {
                    ptk_id: ptk.ptk_id,
                    sekolah_id: sekolahId,
                    jabatan_ptk_id: tt.jabatan_ptk_id ? Number(tt.jabatan_ptk_id) : null,
                    jumlah_jam: tt.jumlah_jam ? Number(tt.jumlah_jam) : null,
                    nomor_sk: tt.nomor_sk || null,
                    tmt_tambahan: tt.tmt_tambahan ? new Date(tt.tmt_tambahan) : null,
                    tst_tambahan: tt.tst_tambahan ? new Date(tt.tst_tambahan) : null,
                    soft_delete: tt.soft_delete ? Number(tt.soft_delete) : 0,
                    last_sync: tt.last_sync ? new Date(tt.last_sync) : null,
                    updater_id: tt.updater_id || null,
                };
                await prisma.tugasTambahan.upsert({
                    where: { ptk_tugas_tambahan_id: tt.ptk_tugas_tambahan_id },
                    create: { ...ttPayload, ptk_tugas_tambahan_id: tt.ptk_tugas_tambahan_id },
                    update: ttPayload,
                });
            }
        }
        console.log("3. Sync simulation complete. Verifying SIMAK DB...");
        const countRes = await prisma.tugasTambahan.count({
            where: { ptk_id: ptk.ptk_id },
        });
        console.log(`Total tugas_tambahan in SIMAK DB for Bambang Muhamad: ${countRes}`);
        const activeTasks = await prisma.tugasTambahan.findMany({
            where: { ptk_id: ptk.ptk_id },
        });
        console.log("Active Tugas Tambahan list in SIMAK DB:");
        console.table(activeTasks.map(t => ({
            id: t.ptk_tugas_tambahan_id,
            jabatan: t.jabatan_ptk_id?.toString(),
            sk: t.nomor_sk,
            soft_delete: t.soft_delete?.toString(),
        })));
    }
    catch (err) {
        console.error("Simulation Error:", err);
    }
    finally {
        await localPool.end();
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=simulate_sync_gtk.js.map