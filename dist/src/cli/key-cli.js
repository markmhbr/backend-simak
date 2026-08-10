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
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const app_key_service_1 = require("../core/app-key/app-key.service");
const mandala_service_1 = require("../modules/mandala/mandala.service");
const readline = __importStar(require("readline"));
const crypto = __importStar(require("crypto"));
async function bootstrap() {
    console.log('🔄 Menginisialisasi Sistem Manajemen Key SIMAK...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule, { logger: false });
    const appKeyService = app.get(app_key_service_1.AppKeyService);
    const mandalaService = app.get(mandala_service_1.MandalaService);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    const question = (query) => {
        return new Promise((resolve) => rl.question(query, resolve));
    };
    const showMenu = async () => {
        console.log('\n=====================================================');
        console.log('     🔑 SISTEM MANAJEMEN KEY SIMAK BACKEND 🔑       ');
        console.log('=====================================================');
        console.log('1. Tampilkan / Cari Key Terdaftar');
        console.log('2. Buat Key Baru (Generate Secure Key)');
        console.log('3. Regenerate / Ganti Key yang Sudah Ada');
        console.log('4. Ubah Status Aktif / Nonaktif Key');
        console.log('5. Tampilkan Koneksi Mandala');
        console.log('6. Setup / Generate Key Mandala Baru');
        console.log('0. Keluar');
        console.log('=====================================================');
        const answer = await question('Pilih menu (0-6): ');
        await handleMenu(answer.trim());
    };
    const handleMenu = async (choice) => {
        try {
            switch (choice) {
                case '1':
                    await listKeys(appKeyService, question, true);
                    break;
                case '2':
                    await createNewKey(appKeyService, question);
                    break;
                case '3':
                    await regenerateKey(appKeyService, question);
                    break;
                case '4':
                    await toggleKey(appKeyService, question);
                    break;
                case '5':
                    await showMandalaConnection(mandalaService);
                    break;
                case '6':
                    await setupMandalaConnection(mandalaService, question);
                    break;
                case '0':
                    console.log('👋 Keluar dari sistem manajemen key.');
                    rl.close();
                    await app.close();
                    process.exit(0);
                    return;
                default:
                    console.log('❌ Pilihan tidak valid. Silakan coba lagi.');
                    break;
            }
        }
        catch (error) {
            console.error('❌ Terjadi kesalahan:', error.message || error);
        }
        await question('\nTekan ENTER untuk kembali ke menu utama...');
        showMenu();
    };
    showMenu();
}
async function listKeys(service, question, promptSearch = false) {
    let searchKeyword = '';
    if (promptSearch && question) {
        const input = await question('\n🔍 Cari Nama Sekolah / Klien / ID (Kosongkan / tekan ENTER untuk tampilkan semua): ');
        searchKeyword = input.trim();
    }
    const keys = await service.getAllKeys(searchKeyword);
    if (searchKeyword) {
        console.log(`\n📋 HASIL PENCARIAN KEY UNTUK "${searchKeyword}" (${keys.length} ditemukan):`);
    }
    else {
        console.log(`\n📋 DAFTAR SEMUA KEY TERDAFTAR (${keys.length} Key):`);
    }
    if (keys.length === 0) {
        console.log(searchKeyword ? '⚠️ Tidak ada key yang cocok dengan kata kunci tersebut.' : '⚠️ Belum ada key yang terdaftar di sistem.');
        return;
    }
    keys.forEach((k, index) => {
        console.log(`\n[${index + 1}] ID: ${k.id}`);
        console.log(`    Nama Klien  : ${k.nama_app}`);
        console.log(`    Sekolah ID  : ${k.sekolah_id || 'Global (Sistem)'}`);
        console.log(`    Nama Sekolah: ${k.nama_sekolah || '-'}${k.npsn ? ` (NPSN: ${k.npsn})` : ''}`);
        console.log(`    Domain      : ${k.domain || '[Belum Terhubung / Terdaftar]'}`);
        console.log(`    Key API     : ${k.key_api}`);
        console.log(`    Key WebSvc  : ${k.key_webService || 'null'}`);
        console.log(`    Key AdmPanel: ${k.key_adminPanel || 'null'}`);
        console.log(`    Status      : ${k.is_active ? '🟢 AKTIF' : '🔴 NONAKTIF'}`);
        console.log(`    Dibuat      : ${new Date(k.created_at).toLocaleString('id-ID')}`);
    });
}
async function createNewKey(service, question) {
    console.log('\n➕ MEMBUAT KEY BARU');
    const namaApp = await question('Masukkan Nama Klien / Aplikasi (wajib): ');
    if (!namaApp.trim()) {
        console.log('❌ Nama klien tidak boleh kosong!');
        return;
    }
    const sekolahId = await question('Masukkan Sekolah ID UUID (wajib): ');
    if (!sekolahId.trim()) {
        console.log('❌ Sekolah ID tidak boleh kosong dan wajib diisi!');
        return;
    }
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sekolahId.trim())) {
        console.log('❌ Format Sekolah ID harus berupa UUID yang valid!');
        return;
    }
    console.log('⏳ Sedang men-generate secure keys...');
    const result = await service.createKey(namaApp.trim(), sekolahId.trim());
    console.log('\n✅ BERHASIL DIBUAT!');
    console.log(`ID          : ${result.id}`);
    console.log(`Nama Klien  : ${result.nama_app}`);
    console.log(`Sekolah ID  : ${result.sekolah_id}`);
    console.log(`Domain      : ${result.domain || '[Belum Terhubung / Terdaftar]'}`);
    console.log(`Key API     : ${result.key_api}`);
    console.log(`Key WebSvc  : ${result.key_webService || '[NULL - Menunggu koneksi/POST dari Web Service]'}`);
    console.log(`Key AdmPanel: ${result.key_adminPanel || '[NULL - Menunggu pengaturan Admin Panel]'}`);
}
async function regenerateKey(service, question) {
    console.log('\n🔄 REGENERATE / GANTI KEY');
    await listKeys(service);
    const idInput = await question('\nMasukkan ID Key yang ingin di-regenerate: ');
    if (!idInput.trim())
        return;
    const konfirm = await question('⚠️ Peringatan: Key lama akan hangus dan tidak bisa digunakan lagi. Lanjutkan? (y/n): ');
    if (konfirm.toLowerCase() !== 'y') {
        console.log('Membatalkan operasi.');
        return;
    }
    console.log('⏳ Sedang me-reset key...');
    const updated = await service.regenerateKeys(idInput.trim());
    console.log('\n✅ KEY API BERHASIL DI-REGENERATE!');
    console.log(`Key API Baru     : ${updated.key_api}`);
    console.log(`Key WebSvc       : (Tidak Berubah)`);
    console.log(`Key AdmPanel     : (Tidak Berubah)`);
}
async function toggleKey(service, question) {
    console.log('\n⚡ UBAH STATUS AKTIF / NONAKTIF');
    await listKeys(service);
    const idInput = await question('\nMasukkan ID Key yang ingin diubah statusnya: ');
    if (!idInput.trim())
        return;
    const updated = await service.toggleActive(idInput.trim());
    console.log(`\n✅ Status berhasil diubah menjadi: ${updated.is_active ? '🟢 AKTIF' : '🔴 NONAKTIF'}`);
}
async function showMandalaConnection(service) {
    console.log('\n📋 DETAIL KONEKSI MANDALA:');
    const config = await service.getConnection();
    if (!config) {
        console.log('⚠️ Belum ada koneksi Mandala yang dikonfigurasi.');
        return;
    }
    console.log(`ID          : ${config.id}`);
    console.log(`URL Mandala : ${config.url_mandala}`);
    console.log(`Key Mandala : ${config.key}`);
    console.log(`Dibuat      : ${new Date(config.created_at).toLocaleString()}`);
}
async function setupMandalaConnection(service, question) {
    console.log('\n➕ SETUP / GENERATE KEY MANDALA BARU');
    const urlMandala = await question('Masukkan URL Mandala (contoh: http://localhost:3001): ');
    if (!urlMandala.trim()) {
        console.log('❌ URL Mandala tidak boleh kosong!');
        return;
    }
    console.log('⏳ Sedang men-generate secure key untuk Mandala...');
    const secureKey = `simak_mandala_${crypto.randomBytes(24).toString('hex')}`;
    const result = await service.saveOrUpdateConnection(secureKey, urlMandala.trim());
    console.log('\n✅ KONEKSI MANDALA BERHASIL DIKONFIGURASI!');
    console.log(`ID          : ${result.id}`);
    console.log(`URL Mandala : ${result.url_mandala}`);
    console.log(`Key Mandala : ${result.key}`);
    console.log(`\n👉 Silakan gunakan Key di atas pada konfigurasi klien Mandala.`);
}
bootstrap();
//# sourceMappingURL=key-cli.js.map