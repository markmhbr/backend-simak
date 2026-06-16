"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const app_key_service_1 = require("../../core/app-key/app-key.service");
let SyncService = SyncService_1 = class SyncService {
    prisma;
    appKeyService;
    logger = new common_1.Logger(SyncService_1.name);
    constructor(prisma, appKeyService) {
        this.prisma = prisma;
        this.appKeyService = appKeyService;
    }
    async validateAndRegisterDomain(key, domain) {
        const appKey = await this.prisma.appKey.findFirst({
            where: {
                OR: [{ key_api: key }, { key_webService: key }],
            },
        });
        if (!appKey) {
            throw new common_1.ForbiddenException("API Key tidak valid.");
        }
        if (!appKey.is_active) {
            throw new common_1.ForbiddenException("API Key dinonaktifkan.");
        }
        await this.appKeyService.updateSchoolDomain(appKey.sekolah_id, domain);
        return {
            nama_app: appKey.nama_app,
            sekolah_id: appKey.sekolah_id,
        };
    }
    parseDate(d) {
        if (!d || d === '1901-01-01' || d.startsWith('1900') || d.startsWith('1901'))
            return null;
        const date = new Date(d);
        return isNaN(date.getTime()) ? null : date;
    }
    parseNumber(val) {
        if (val === null || val === undefined || val === '')
            return null;
        const n = Number(val);
        return isNaN(n) ? null : n;
    }
    async syncSekolah(sekolahId, dataRows, rawApiKey) {
        let successCount = 0;
        if (sekolahId && rawApiKey) {
            const existingKey = await this.prisma.appKey.findUnique({ where: { sekolah_id: sekolahId } });
            if (!existingKey) {
                this.logger.log(`Auto-registering new AppKey for Sekolah ID: ${sekolahId}`);
                await this.prisma.appKey.create({
                    data: {
                        sekolah_id: sekolahId,
                        nama_app: 'DAPODIK_AUTO_SYNC',
                        key_api: `simak_api_${Math.random().toString(36).substring(2, 15)}`,
                        key_webService: rawApiKey,
                        is_active: true,
                    }
                });
            }
            else if (existingKey.key_webService !== rawApiKey) {
                this.logger.log(`Updating WebService Key for Sekolah ID: ${sekolahId}`);
                await this.prisma.appKey.update({
                    where: { sekolah_id: sekolahId },
                    data: { key_webService: rawApiKey }
                });
            }
        }
        for (const row of dataRows) {
            if (!row.sekolah_id && !row.id && !row.npsn)
                continue;
            const targetId = row.sekolah_id || row.id || row.npsn;
            const payload = {
                sekolah_id: targetId,
                nama: row.nama || 'Tanpa Nama',
                nss: row.nss || null,
                npsn: row.npsn || null,
                bentuk_pendidikan_id: this.parseNumber(row.bentuk_pendidikan_id),
                bentuk_pendidikan_id_str: row.bentuk_pendidikan_id_str || null,
                status_sekolah: String(row.status_sekolah || ''),
                status_sekolah_str: row.status_sekolah_str || null,
                alamat_jalan: row.alamat_jalan || null,
                rt: row.rt || null,
                rw: row.rw || null,
                kode_wilayah: row.kode_wilayah || null,
                kode_pos: row.kode_pos || null,
                nomor_telepon: row.nomor_telepon || null,
                nomor_fax: row.nomor_fax || null,
                email: row.email || null,
                website: row.website || null,
                is_sks: row.is_sks === true || row.is_sks === '1' || row.is_sks === 1 || row.is_sks === 'true',
                lintang: this.parseNumber(row.lintang),
                bujur: this.parseNumber(row.bujur),
                dusun: row.dusun || null,
                desa_kelurahan: row.desa_kelurahan || null,
                kecamatan: row.kecamatan || null,
                kabupaten_kota: row.kabupaten_kota || null,
                provinsi: row.provinsi || null,
                cadisdik_id: row.cadisdik_id || null,
                spmb: row.spmb || null,
                logo: row.logo || null,
            };
            try {
                await this.prisma.sekolah.upsert({
                    where: { sekolah_id: targetId },
                    create: payload,
                    update: { ...payload, updated_at: new Date() },
                });
                successCount++;
            }
            catch (err) {
                this.logger.error(`Error upsert Sekolah ${targetId}: ${err.message}`);
            }
        }
        return { successCount };
    }
    async syncRombel(sekolahId, dataRows) {
        let successCount = 0;
        for (const r of dataRows) {
            if (!r.rombongan_belajar_id)
                continue;
            const payload = {
                rombongan_belajar_id: r.rombongan_belajar_id,
                sekolah_id: sekolahId,
                nama: r.nama || 'Tanpa Nama',
                tingkat_pendidikan_id: String(r.tingkat_pendidikan_id || ''),
                tingkat_pendidikan_id_str: r.tingkat_pendidikan_id_str || null,
                semester_id: String(r.semester_id || ''),
                jenis_rombel: String(r.jenis_rombel || ''),
                jenis_rombel_str: r.jenis_rombel_str || null,
                kurikulum_id: this.parseNumber(r.kurikulum_id),
                kurikulum_id_str: r.kurikulum_id_str || null,
                id_ruang: r.id_ruang || null,
                id_ruang_str: r.id_ruang_str || null,
                moving_class: String(r.moving_class || ''),
                ptk_id: r.ptk_id || null,
                ptk_id_str: r.ptk_id_str || null,
                jurusan_id: String(r.jurusan_id || ''),
                jurusan_id_str: r.jurusan_id_str || null,
                id_kelas_ekskul: r.id_kelas_ekskul || null,
                id_ekskul: r.id_ekskul || null,
                nm_ekskul: r.nm_ekskul || null,
                sk_ekskul: r.sk_ekskul || null,
            };
            try {
                await this.prisma.rombonganBelajar.upsert({
                    where: { rombongan_belajar_id: r.rombongan_belajar_id },
                    create: payload,
                    update: { ...payload, updated_at: new Date() },
                });
                const anggotaRows = r.anggota_rombel || r.AnggotaRombel || r.anggota_rombels || [];
                if (Array.isArray(anggotaRows) && anggotaRows.length > 0) {
                    for (const a of anggotaRows) {
                        if (!a.anggota_rombel_id)
                            continue;
                        const aPayload = {
                            anggota_rombel_id: a.anggota_rombel_id,
                            sekolah_id: sekolahId,
                            rombongan_belajar_id: r.rombongan_belajar_id,
                            peserta_didik_id: a.peserta_didik_id,
                            jenis_pendaftaran_id: String(a.jenis_pendaftaran_id || ''),
                            jenis_pendaftaran_id_str: a.jenis_pendaftaran_id_str || null,
                        };
                        await this.prisma.anggotaRombel.upsert({
                            where: { anggota_rombel_id: a.anggota_rombel_id },
                            create: aPayload,
                            update: { ...aPayload, updated_at: new Date() },
                        });
                    }
                }
                const pembelajaranRows = r.pembelajaran || r.Pembelajaran || r.pembelajarans || [];
                if (Array.isArray(pembelajaranRows) && pembelajaranRows.length > 0) {
                    for (const p of pembelajaranRows) {
                        if (!p.pembelajaran_id)
                            continue;
                        const pPayload = {
                            pembelajaran_id: p.pembelajaran_id,
                            sekolah_id: sekolahId,
                            rombongan_belajar_id: r.rombongan_belajar_id,
                            mata_pelajaran_id: String(p.mata_pelajaran_id || ''),
                            mata_pelajaran_id_str: p.mata_pelajaran_id_str || null,
                            ptk_terdaftar_id: p.ptk_terdaftar_id || null,
                            ptk_id: p.ptk_id || null,
                            nama_mata_pelajaran: p.nama_mata_pelajaran || null,
                            induk_pembelajaran_id: p.induk_pembelajaran_id || null,
                            jam_mengajar_per_minggu: String(p.jam_mengajar_per_minggu || ''),
                            status_di_kurikulum: String(p.status_di_kurikulum || ''),
                            status_di_kurikulum_str: p.status_di_kurikulum_str || null,
                        };
                        await this.prisma.pembelajaran.upsert({
                            where: { pembelajaran_id: p.pembelajaran_id },
                            create: pPayload,
                            update: { ...pPayload, updated_at: new Date() },
                        });
                    }
                }
                successCount++;
            }
            catch (err) {
                this.logger.error(`Error upsert Rombel ${r.rombongan_belajar_id}: ${err.message}`);
            }
        }
        return { successCount };
    }
    async syncPesertaDidik(sekolahId, dataRows) {
        let successCount = 0;
        const appKey = await this.prisma.appKey.findUnique({ where: { sekolah_id: sekolahId } });
        const domain = appKey?.domain?.replace(/\/+$/, '') || '';
        for (const p of dataRows) {
            if (!p.peserta_didik_id)
                continue;
            let qr_token = p.qr_token || null;
            if (!qr_token && domain) {
                qr_token = `${domain}/${p.peserta_didik_id}`;
            }
            const payload = {
                sekolah_id: sekolahId,
                registrasi_id: p.registrasi_id || null,
                anggota_rombel_id: p.anggota_rombel_id || null,
                rombongan_belajar_id: p.rombongan_belajar_id || null,
                qr_token,
                status: p.status || 'Aktif',
                foto: p.foto || null,
                telegram_chat_id: p.telegram_chat_id || null,
                telegram_token: p.telegram_token || null,
                nama: p.nama || 'Tanpa Nama',
                jenis_kelamin: p.jenis_kelamin || null,
                nisn: p.nisn || null,
                nik: p.nik || null,
                no_kk: p.no_kk || null,
                tempat_lahir: p.tempat_lahir || null,
                tanggal_lahir: this.parseDate(p.tanggal_lahir),
                agama_id: String(p.agama_id || ''),
                agama_id_str: p.agama_id_str || null,
                kewarganegaraan: p.kewarganegaraan || 'Indonesia',
                kebutuhan_khusus_id: this.parseNumber(p.kebutuhan_khusus_id),
                kebutuhan_khusus: p.kebutuhan_khusus || null,
                alamat_jalan: p.alamat_jalan || null,
                rt: p.rt || null,
                rw: p.rw || null,
                dusun: p.dusun || null,
                nama_dusun: p.nama_dusun || null,
                desa_kelurahan: p.desa_kelurahan || null,
                kecamatan: p.kecamatan || null,
                kabupaten_kota: p.kabupaten_kota || null,
                provinsi: p.provinsi || null,
                kode_wilayah: p.kode_wilayah || null,
                kode_pos: p.kode_pos || null,
                lintang: this.parseNumber(p.lintang),
                bujur: this.parseNumber(p.bujur),
                jenis_tinggal_id: String(p.jenis_tinggal_id || ''),
                jenis_tinggal_id_str: p.jenis_tinggal_id_str || null,
                alat_transportasi_id: String(p.alat_transportasi_id || ''),
                alat_transportasi_id_str: p.alat_transportasi_id_str || null,
                jarak_rumah_ke_sekolah_km: String(p.jarak_rumah_ke_sekolah_km || ''),
                waktu_tempuh_menit: String(p.waktu_tempuh_menit || ''),
                nomor_telepon_rumah: p.nomor_telepon_rumah || null,
                nomor_telepon_seluler: p.nomor_telepon_seluler || null,
                no_wa: p.no_wa || null,
                email: p.email || null,
                tinggi_badan: String(p.tinggi_badan || ''),
                berat_badan: String(p.berat_badan || ''),
                lingkar_kepala: this.parseNumber(p.lingkar_kepala),
                anak_keberapa: String(p.anak_keberapa || ''),
                jumlah_saudara_kandung: this.parseNumber(p.jumlah_saudara_kandung),
                yatim_piatu: this.parseNumber(p.yatim_piatu),
                paud_formal: String(p.paud_formal || ''),
                paud_non_formal: String(p.paud_non_formal || ''),
                hobi: p.hobi || null,
                cita_cita: p.cita_cita || null,
                nik_ayah: p.nik_ayah || null,
                nama_ayah: p.nama_ayah || null,
                tahun_lahir_ayah: String(p.tahun_lahir_ayah || ''),
                jenjang_pendidikan_ayah: p.jenjang_pendidikan_ayah || null,
                pendidikan_ayah_id_str: p.pendidikan_ayah_id_str || null,
                pekerjaan_ayah_id: String(p.pekerjaan_ayah_id || ''),
                pekerjaan_ayah_id_str: p.pekerjaan_ayah_id_str || null,
                penghasilan_id_ayah: String(p.penghasilan_id_ayah || ''),
                penghasilan_ayah_id_str: p.penghasilan_ayah_id_str || null,
                kebutuhan_khusus_ayah: p.kebutuhan_khusus_ayah || null,
                no_wa_ayah: p.no_wa_ayah || null,
                nik_ibu: p.nik_ibu || null,
                nama_ibu: p.nama_ibu || null,
                tahun_lahir_ibu: String(p.tahun_lahir_ibu || ''),
                jenjang_pendidikan_ibu: p.jenjang_pendidikan_ibu || null,
                pendidikan_ibu_id_str: p.pendidikan_ibu_id_str || null,
                pekerjaan_ibu_id: String(p.pekerjaan_ibu_id || ''),
                pekerjaan_ibu_id_str: p.pekerjaan_ibu_id_str || null,
                penghasilan_id_ibu: String(p.penghasilan_id_ibu || ''),
                penghasilan_ibu_id_str: p.penghasilan_ibu_id_str || null,
                kebutuhan_khusus_ibu: p.kebutuhan_khusus_ibu || null,
                no_wa_ibu: p.no_wa_ibu || null,
                nik_wali: p.nik_wali || null,
                nama_wali: p.nama_wali || null,
                status_wali: p.status_wali || 'Tidak',
                tahun_lahir_wali: String(p.tahun_lahir_wali || ''),
                jenjang_pendidikan_wali: p.jenjang_pendidikan_wali || null,
                pendidikan_wali_id_str: p.pendidikan_wali_id_str || null,
                pekerjaan_wali_id: String(p.pekerjaan_wali_id || ''),
                pekerjaan_wali_id_str: p.pekerjaan_wali_id_str || null,
                penghasilan_id_wali: String(p.penghasilan_id_wali || ''),
                penghasilan_wali_id_str: p.penghasilan_wali_id_str || null,
                no_wa_wali: p.no_wa_wali || null,
                penerima_kps: p.penerima_kps || null,
                no_kps: p.no_kps || null,
                layak_pip: p.layak_pip || null,
                alasan_layak_pip: p.alasan_layak_pip || null,
                penerima_kip: p.penerima_kip || null,
                no_kip: p.no_kip || null,
                nama_di_kip: p.nama_di_kip || null,
                alasan_menolak_kip: p.alasan_menolak_kip || null,
                no_kks: p.no_kks || null,
                reg_akta_lahir: p.reg_akta_lahir || null,
                no_registrasi_akta_lahir: p.no_registrasi_akta_lahir || null,
                rekening_bank: p.rekening_bank || null,
                rekening_atas_nama: p.rekening_atas_nama || null,
                nipd: p.nipd || null,
                npsn_sekolah_asal: p.npsn_sekolah_asal || null,
                sekolah_asal: p.sekolah_asal || null,
                tanggal_masuk_sekolah: this.parseDate(p.tanggal_masuk_sekolah),
                nama_rombel: p.nama_rombel || null,
                kurikulum_id: String(p.kurikulum_id || ''),
                kurikulum_id_str: p.kurikulum_id_str || null,
                no_seri_ijazah: p.no_seri_ijazah || null,
                no_seri_skhun: p.no_seri_skhun || null,
                no_ujian_nasional: p.no_ujian_nasional || null,
                jenis_pendaftaran_id: String(p.jenis_pendaftaran_id || ''),
                jenis_pendaftaran_id_str: p.jenis_pendaftaran_id_str || null,
                nomor_induk_pd: p.nomor_induk_pd || null,
                jurusan_sp_id: p.jurusan_sp_id || null,
                semester_id: p.semester_id || null,
                tingkat_pendidikan_id: p.tingkat_pendidikan_id || null,
                jenis_keluar_id: p.jenis_keluar_id || null,
                ket_keluar: p.ket_keluar || null,
                tanggal_keluar: this.parseDate(p.tanggal_keluar),
                no_skhun: p.no_skhun || null,
                no_peserta_ujian: p.no_peserta_ujian || null,
            };
            try {
                const existing = await this.prisma.pesertaDidik.findUnique({
                    where: { peserta_didik_id: p.peserta_didik_id },
                    select: { status: true }
                });
                if (existing && existing.status === 'Aktif' && payload.status !== 'Aktif') {
                    payload.status = 'Aktif';
                }
                await this.prisma.pesertaDidik.upsert({
                    where: { peserta_didik_id: p.peserta_didik_id },
                    create: { ...payload, peserta_didik_id: p.peserta_didik_id },
                    update: { ...payload, updated_at: new Date() },
                });
                successCount++;
            }
            catch (err) {
                this.logger.error(`Error upsert PesertaDidik ${p.peserta_didik_id}: ${err.message}`);
            }
        }
        return { successCount };
    }
    async syncGtk(sekolahId, dataRows) {
        let successCount = 0;
        const appKey = await this.prisma.appKey.findUnique({ where: { sekolah_id: sekolahId } });
        const domain = appKey?.domain?.replace(/\/+$/, '') || '';
        for (const g of dataRows) {
            if (!g.ptk_id)
                continue;
            let qr_token = g.qr_token || null;
            if (!qr_token && domain) {
                qr_token = `${domain}/${g.ptk_id}`;
            }
            const payload = {
                ptk_terdaftar_id: g.ptk_terdaftar_id || null,
                tahun_ajaran_id: String(g.tahun_ajaran_id || ''),
                sekolah_id: sekolahId,
                ptk_induk: String(g.ptk_induk || ''),
                kode: g.kode || null,
                status: g.status || 'Aktif',
                sk_mengajar: g.sk_mengajar || null,
                qr_token,
                nama: g.nama || 'Tanpa Nama',
                jenis_kelamin: g.jenis_kelamin || null,
                tempat_lahir: g.tempat_lahir || null,
                tanggal_lahir: this.parseDate(g.tanggal_lahir),
                nama_ibu_kandung: g.nama_ibu_kandung || null,
                agama_id: String(g.agama_id || ''),
                agama_id_str: g.agama_id_str || null,
                nuptk: g.nuptk || null,
                nik: g.nik || null,
                no_kk: g.no_kk || null,
                npwp: g.npwp || null,
                nama_wajib_pajak: g.nama_wajib_pajak || null,
                kewarganegaraan: g.kewarganegaraan || 'ID',
                status_perkawinan: g.status_perkawinan || null,
                nama_suami_istri: g.nama_suami_istri || null,
                pekerjaan_suami_istri: g.pekerjaan_suami_istri || null,
                jenis_ptk_id: String(g.jenis_ptk_id || ''),
                jenis_ptk_id_str: g.jenis_ptk_id_str || null,
                jabatan_ptk_id: String(g.jabatan_ptk_id || ''),
                jabatan_ptk_id_str: g.jabatan_ptk_id_str || null,
                status_kepegawaian_id: String(g.status_kepegawaian_id || ''),
                status_kepegawaian_id_str: g.status_kepegawaian_id_str || null,
                nip: g.nip || null,
                niy_nigk: g.niy_nigk || null,
                nrg: g.nrg || null,
                sk_pengangkatan: g.sk_pengangkatan || null,
                tanggal_surat_tugas: this.parseDate(g.tanggal_surat_tugas),
                tmt_pengangkatan: this.parseDate(g.tmt_pengangkatan),
                lembaga_pengangkat: g.lembaga_pengangkat || null,
                sk_cpns: g.sk_cpns || null,
                tmt_cpns: this.parseDate(g.tmt_cpns),
                tmt_pns: this.parseDate(g.tmt_pns),
                sumber_gaji: g.sumber_gaji || null,
                lisensi_kepsek: g.lisensi_kepsek === true || g.lisensi_kepsek === '1' || g.lisensi_kepsek === 1,
                nuks: g.nuks || null,
                pendidikan_terakhir: g.pendidikan_terakhir || null,
                bidang_studi_terakhir: g.bidang_studi_terakhir || null,
                pangkat_golongan_terakhir: g.pangkat_golongan_terakhir || null,
                alamat_jalan: g.alamat_jalan || null,
                rt: g.rt || null,
                rw: g.rw || null,
                dusun: g.dusun || null,
                desa_kelurahan: g.desa_kelurahan || null,
                kecamatan: g.kecamatan || null,
                kode_pos: g.kode_pos || null,
                lintang: this.parseNumber(g.lintang),
                bujur: this.parseNumber(g.bujur),
                no_telepon_rumah: g.no_telepon_rumah || null,
                no_hp: g.no_hp || null,
                no_wa: g.no_wa || null,
                email: g.email || null,
                foto: g.foto || null,
                tandatangan: g.tandatangan || null,
                keahlian_laboratorium: g.keahlian_laboratorium || null,
                mampu_menangani_kebutuhan_khusus: g.mampu_menangani_kebutuhan_khusus || null,
                keahlian_braille: g.keahlian_braille === true || g.keahlian_braille === '1' || g.keahlian_braille === 1,
                keahlian_bahasa_isyarat: g.keahlian_bahasa_isyarat === true || g.keahlian_bahasa_isyarat === '1' || g.keahlian_bahasa_isyarat === 1,
            };
            try {
                await this.prisma.gtk.upsert({
                    where: { ptk_id: g.ptk_id },
                    create: { ...payload, ptk_id: g.ptk_id },
                    update: { ...payload, updated_at: new Date() },
                });
                if (g.rwy_pend_formal && Array.isArray(g.rwy_pend_formal)) {
                    for (const edu of g.rwy_pend_formal) {
                        if (!edu.riwayat_pendidikan_formal_id)
                            continue;
                        const eduPayload = {
                            ptk_id: g.ptk_id,
                            satuan_pendidikan_formal: edu.satuan_pendidikan_formal || 'Tanpa Nama',
                            fakultas: edu.fakultas || null,
                            kependidikan: String(edu.kependidikan || ''),
                            tahun_masuk: String(edu.tahun_masuk || ''),
                            tahun_lulus: String(edu.tahun_lulus || ''),
                            nim: edu.nim || null,
                            status_kuliah: String(edu.status_kuliah || ''),
                            semester: String(edu.semester || ''),
                            ipk: edu.ipk || null,
                            prodi: edu.prodi || null,
                            id_reg_pd: edu.id_reg_pd || null,
                            bidang_studi_id_str: edu.bidang_studi_id_str || null,
                            jenjang_pendidikan_id_str: edu.jenjang_pendidikan_id_str || null,
                            gelar_akademik_id_str: edu.gelar_akademik_id_str || null,
                        };
                        await this.prisma.riwayatPendidikanFormal.upsert({
                            where: { riwayat_pendidikan_formal_id: edu.riwayat_pendidikan_formal_id },
                            create: { ...eduPayload, riwayat_pendidikan_formal_id: edu.riwayat_pendidikan_formal_id },
                            update: { ...eduPayload, updated_at: new Date() },
                        });
                    }
                }
                successCount++;
            }
            catch (err) {
                this.logger.error(`Error upsert GTK ${g.ptk_id}: ${err.message}`);
            }
        }
        return { successCount };
    }
    async syncPengguna(sekolahId, dataRows) {
        let successCount = 0;
        for (const u of dataRows) {
            if (!u.pengguna_id && !u.username)
                continue;
            const targetId = u.pengguna_id || u.username;
            let targetSekolahId = sekolahId;
            if (u.peran_id_str === 'Administrator' || u.username === 'admin' || u.username.includes('admin')) {
                targetSekolahId = null;
            }
            let validatedPtkId = u.ptk_id || null;
            let validatedPesertaDidikId = u.peserta_didik_id || null;
            if (u.ptk_id) {
                const gtkExists = await this.prisma.gtk.findUnique({
                    where: { ptk_id: u.ptk_id }
                });
                if (!gtkExists) {
                    validatedPtkId = null;
                }
            }
            if (u.peserta_didik_id) {
                const pdExists = await this.prisma.pesertaDidik.findUnique({
                    where: { peserta_didik_id: u.peserta_didik_id }
                });
                if (!pdExists) {
                    validatedPesertaDidikId = null;
                }
            }
            const payload = {
                sekolah_id: targetSekolahId,
                username: u.username,
                password: u.password || '$2y$10$defaultpasswordhashplaceholder',
                nama: u.nama || 'Pengguna',
                email: u.email || u.username || null,
                peran_id_str: u.peran_id_str || 'Operator Sekolah',
                alamat: u.alamat || null,
                no_telepon: u.no_telepon || null,
                no_hp: u.no_hp || null,
                ptk_id: validatedPtkId,
                peserta_didik_id: validatedPesertaDidikId,
            };
            try {
                const existing = await this.prisma.pengguna.findUnique({ where: { username: u.username } });
                if (existing) {
                    if (existing.sekolah_id === null && targetSekolahId !== null && (existing.peran_id_str === 'Administrator' || existing.username.includes('admin'))) {
                        targetSekolahId = null;
                    }
                    await this.prisma.pengguna.update({
                        where: { username: u.username },
                        data: { ...payload, sekolah_id: targetSekolahId, updated_at: new Date() },
                    });
                }
                else {
                    await this.prisma.pengguna.create({
                        data: { ...payload, pengguna_id: u.pengguna_id || undefined },
                    });
                }
                successCount++;
            }
            catch (err) {
                this.logger.error(`Error upsert Pengguna ${u.username}: ${err.message}`);
            }
        }
        return { successCount };
    }
    async syncSarpras(sekolahId, dataRows) {
        let successCount = 0;
        for (const item of dataRows) {
            try {
                if (item._entity === 'tanah' || item.id_tanah) {
                    if (!item.id_tanah)
                        continue;
                    const payload = {
                        sekolah_id: sekolahId,
                        jenis_prasarana_id: this.parseNumber(item.jenis_prasarana_id) || 1,
                        nama: item.nama || 'Tanah Tanpa Nama',
                        panjang: this.parseNumber(item.panjang),
                        lebar: this.parseNumber(item.lebar),
                        luas: this.parseNumber(item.luas),
                        luas_lahan_tersedia: this.parseNumber(item.luas_lahan_tersedia),
                        kode_wilayah: item.kode_wilayah || '000000',
                        alamat_jalan: item.alamat_jalan || 'Alamat Belum Diisi',
                        rt: item.rt || null,
                        rw: item.rw || null,
                        nama_dusun: item.nama_dusun || null,
                        desa_kelurahan: item.desa_kelurahan || null,
                        kode_pos: item.kode_pos || null,
                        lintang: this.parseNumber(item.lintang),
                        bujur: this.parseNumber(item.bujur),
                        no_sertifikat_tanah: item.no_sertifikat_tanah || null,
                        ket_tanah: item.ket_tanah || null,
                    };
                    await this.prisma.tanah.upsert({
                        where: { id_tanah: item.id_tanah },
                        create: { ...payload, id_tanah: item.id_tanah },
                        update: { ...payload, last_update: new Date() },
                    });
                    successCount++;
                }
                else if (item._entity === 'bangunan' || item.id_bangunan) {
                    if (!item.id_bangunan)
                        continue;
                    const payload = {
                        sekolah_id: sekolahId,
                        id_tanah: item.id_tanah || '00000000-0000-0000-0000-000000000000',
                        jenis_prasarana_id: this.parseNumber(item.jenis_prasarana_id) || 2,
                        nama: item.nama || 'Bangunan Tanpa Nama',
                        panjang: this.parseNumber(item.panjang),
                        lebar: this.parseNumber(item.lebar),
                        jml_lantai: String(item.jml_lantai || '1'),
                        thn_dibangun: String(item.thn_dibangun || ''),
                        luas_tapak_bangunan: this.parseNumber(item.luas_tapak_bangunan),
                        ket_bangunan: item.ket_bangunan || null,
                        nilai_kerusakan: this.parseNumber(item.nilai_kerusakan),
                        kriteria_kerusakan: item.kriteria_kerusakan || null,
                    };
                    await this.prisma.bangunan.upsert({
                        where: { id_bangunan: item.id_bangunan },
                        create: { ...payload, id_bangunan: item.id_bangunan },
                        update: { ...payload, last_update: new Date() },
                    });
                    successCount++;
                }
                else if (item._entity === 'ruang' || item.id_ruang) {
                    if (!item.id_ruang)
                        continue;
                    const payload = {
                        sekolah_id: sekolahId,
                        id_bangunan: item.id_bangunan || '00000000-0000-0000-0000-000000000000',
                        jenis_prasarana_id: this.parseNumber(item.jenis_prasarana_id) || 3,
                        nm_ruang: item.nm_ruang || item.nama || 'Ruang Tanpa Nama',
                        kd_ruang: item.kd_ruang || null,
                        lantai: String(item.lantai || '1'),
                        panjang: this.parseNumber(item.panjang),
                        lebar: this.parseNumber(item.lebar),
                        kapasitas: String(item.kapasitas || '0'),
                        luas_ruang: this.parseNumber(item.luas_ruang),
                    };
                    await this.prisma.ruang.upsert({
                        where: { id_ruang: item.id_ruang },
                        create: { ...payload, id_ruang: item.id_ruang },
                        update: { ...payload, last_update: new Date() },
                    });
                    successCount++;
                }
            }
            catch (err) {
                this.logger.error(`Error upsert Sarpras item: ${err.message}`);
            }
        }
        return { successCount };
    }
    async syncBidangStudi(sekolahId, dataRows) {
        let successCount = 0;
        for (const b of dataRows) {
            if (b.bidang_studi_id === null || b.bidang_studi_id === undefined)
                continue;
            const id = Number(b.bidang_studi_id);
            if (isNaN(id))
                continue;
            const payload = {
                sekolah_id: sekolahId,
                kelompok_bidang_studi_id: this.parseNumber(b.kelompok_bidang_studi_id),
                kode: b.kode || null,
                bidang_studi: b.bidang_studi || 'Tanpa Nama',
                kelompok: String(b.kelompok || ''),
                jenjang_paud: String(b.jenjang_paud || ''),
                jenjang_tk: String(b.jenjang_tk || ''),
                jenjang_sd: String(b.jenjang_sd || ''),
                jenjang_smp: String(b.jenjang_smp || ''),
                jenjang_sma: String(b.jenjang_sma || ''),
                jenjang_tinggi: String(b.jenjang_tinggi || ''),
                a_sert_komp: String(b.a_sert_komp || ''),
                a_sert_profesi: String(b.a_sert_profesi || ''),
            };
            try {
                await this.prisma.bidangStudi.upsert({
                    where: { bidang_studi_id: id },
                    create: { ...payload, bidang_studi_id: id },
                    update: { ...payload, updated_at: new Date() },
                });
                successCount++;
            }
            catch (err) {
                this.logger.error(`Error upsert BidangStudi ${id}: ${err.message}`);
            }
        }
        return { successCount };
    }
    async syncLembSertifikasi(sekolahId, dataRows) {
        let successCount = 0;
        for (const l of dataRows) {
            if (!l.kode_lemb_sert)
                continue;
            const id = String(l.kode_lemb_sert);
            const payload = {
                sekolah_id: sekolahId,
                nm_lemb_sert: l.nm_lemb_sert || l.nama || 'Tanpa Nama',
                tmt_lemb_sert: this.parseDate(l.tmt_lemb_sert),
                ket_lemb_sert: l.ket_lemb_sert || null,
                alamat_jalan: l.alamat_jalan || null,
                rt: l.rt || null,
                rw: l.rw || null,
                nama_dusun: l.nama_dusun || null,
                desa_kelurahan: l.desa_kelurahan || null,
                kode_wilayah: l.kode_wilayah || null,
                kode_pos: l.kode_pos || null,
                lintang: this.parseNumber(l.lintang),
                bujur: this.parseNumber(l.bujur),
                nama: l.nama || l.nm_lemb_sert || null,
                nomor_telepon: l.nomor_telepon || null,
                nomor_fax: l.nomor_fax || null,
                email: l.email || null,
                website: l.website || null,
            };
            try {
                await this.prisma.lembSertifikasi.upsert({
                    where: { kode_lemb_sert: id },
                    create: { ...payload, kode_lemb_sert: id },
                    update: { ...payload, updated_at: new Date() },
                });
                successCount++;
            }
            catch (err) {
                this.logger.error(`Error upsert LembSertifikasi ${id}: ${err.message}`);
            }
        }
        return { successCount };
    }
    async syncRwySertifikat(sekolahId, dataRows) {
        let successCount = 0;
        for (const r of dataRows) {
            if (!r.riwayat_sertifikasi_id)
                continue;
            const payload = {
                sekolah_id: sekolahId,
                kode_lemb_sert: r.kode_lemb_sert ? String(r.kode_lemb_sert) : null,
                ptk_id: r.ptk_id || null,
                bidang_studi_id: this.parseNumber(r.bidang_studi_id),
                id_jenis_sertifikasi: String(r.id_jenis_sertifikasi || ''),
                tgl_sert: this.parseDate(r.tgl_sert || r.tgl_sertifikasi),
                tgl_exp_sert: this.parseDate(r.tgl_exp_sert),
                nomor_sertifikat: r.nomor_sertifikat || null,
                nomer_registrasi: r.nomer_registrasi || null,
                nomor_peserta: r.nomor_peserta || null,
                kualifikasi: r.kualifikasi || null,
                asal_data: String(r.asal_data || ''),
                ptk_id_str: r.ptk_id_str || null,
                bidang_studi_id_str: r.bidang_studi_id_str || null,
            };
            try {
                await this.prisma.rwySertifikasi.upsert({
                    where: { riwayat_sertifikasi_id: r.riwayat_sertifikasi_id },
                    create: { ...payload, riwayat_sertifikasi_id: r.riwayat_sertifikasi_id },
                    update: { ...payload, updated_at: new Date() },
                });
                successCount++;
            }
            catch (err) {
                this.logger.error(`Error upsert RwySertifikat ${r.riwayat_sertifikasi_id}: ${err.message}`);
            }
        }
        return { successCount };
    }
    async syncPembelajaran(sekolahId, dataRows) {
        let successCount = 0;
        for (const p of dataRows) {
            if (!p.pembelajaran_id)
                continue;
            const payload = {
                pembelajaran_id: p.pembelajaran_id,
                sekolah_id: sekolahId,
                rombongan_belajar_id: p.rombongan_belajar_id,
                mata_pelajaran_id: String(p.mata_pelajaran_id || ''),
                mata_pelajaran_id_str: p.mata_pelajaran_id_str || null,
                ptk_terdaftar_id: p.ptk_terdaftar_id || null,
                ptk_id: p.ptk_id || null,
                nama_mata_pelajaran: p.nama_mata_pelajaran || null,
                induk_pembelajaran_id: p.induk_pembelajaran_id || null,
                jam_mengajar_per_minggu: String(p.jam_mengajar_per_minggu || ''),
                status_di_kurikulum: String(p.status_di_kurikulum || ''),
                status_di_kurikulum_str: p.status_di_kurikulum_str || null,
            };
            try {
                await this.prisma.pembelajaran.upsert({
                    where: { pembelajaran_id: p.pembelajaran_id },
                    create: payload,
                    update: { ...payload, updated_at: new Date() },
                });
                successCount++;
            }
            catch (err) {
                this.logger.error(`Error upsert Pembelajaran ${p.pembelajaran_id}: ${err.message}`);
            }
        }
        return { successCount };
    }
};
exports.SyncService = SyncService;
exports.SyncService = SyncService = SyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        app_key_service_1.AppKeyService])
], SyncService);
//# sourceMappingURL=sync.service.js.map