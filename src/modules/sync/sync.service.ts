import { Injectable, Logger, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { AppKeyService } from '../../core/app-key/app-key.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly appKeyService: AppKeyService,
  ) {}

  async validateAndRegisterDomain(key: string, domain: string) {
    const appKey = await this.prisma.appKey.findFirst({
      where: {
        OR: [{ key_api: key }, { key_webService: key }],
      },
    });

    if (!appKey) {
      throw new ForbiddenException("API Key tidak valid.");
    }

    if (!appKey.is_active) {
      throw new ForbiddenException("API Key dinonaktifkan.");
    }

    // Update domain dan generate QR Token massal secara otomatis
    await this.appKeyService.updateSchoolDomain(appKey.sekolah_id, domain);

    return {
      nama_app: appKey.nama_app,
      sekolah_id: appKey.sekolah_id,
    };
  }

  private parseDate(d?: string | null): Date | null {
    if (!d || d === '1901-01-01' || d.startsWith('1900') || d.startsWith('1901')) return null;
    const date = new Date(d);
    return isNaN(date.getTime()) ? null : date;
  }

  private parseNumber(val?: any): number | null {
    if (val === null || val === undefined || val === '') return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  }

  async syncSekolah(sekolahId: string, dataRows: any[], rawApiKey?: string) {
    let successCount = 0;
    
    // Auto-Register AppKey jika belum ada
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
      } else if (existingKey.key_webService !== rawApiKey) {
        this.logger.log(`Updating WebService Key for Sekolah ID: ${sekolahId}`);
        await this.prisma.appKey.update({
          where: { sekolah_id: sekolahId },
          data: { key_webService: rawApiKey }
        });
      }
    }

    for (const row of dataRows) {
      if (!row.sekolah_id && !row.id && !row.npsn) continue;
      const targetId = row.sekolah_id || row.id || row.npsn;
      
      const bentuk_pendidikan_id = this.parseNumber(row.bentuk_pendidikan_id);
      const kebutuhan_khusus_id = this.parseNumber(row.kebutuhan_khusus_id);

      const payload = {
        sekolah_id: targetId,
        nama: row.nama || 'Tanpa Nama',
        nama_nomenklatur: row.nama_nomenklatur || null,
        nss: row.nss || null,
        npsn: row.npsn || null,
        bentuk_pendidikan_id,
        alamat_jalan: row.alamat_jalan || null,
        rt: row.rt || null,
        rw: row.rw || null,
        nama_dusun: row.nama_dusun || null,
        desa_kelurahan: row.desa_kelurahan || null,
        kode_wilayah: row.kode_wilayah || null,
        kode_pos: row.kode_pos || null,
        lintang: this.parseNumber(row.lintang),
        bujur: this.parseNumber(row.bujur),
        nomor_telepon: row.nomor_telepon || null,
        nomor_fax: row.nomor_fax || null,
        email: row.email || null,
        website: row.website || null,
        kebutuhan_khusus_id,
        status_sekolah: row.status_sekolah !== null && row.status_sekolah !== undefined ? String(row.status_sekolah) : null,
        sk_pendirian_sekolah: row.sk_pendirian_sekolah || null,
        tanggal_sk_pendirian: row.tanggal_sk_pendirian || null,
        status_kepemilikan_id: row.status_kepemilikan_id !== null && row.status_kepemilikan_id !== undefined ? String(row.status_kepemilikan_id) : null,
        yayasan_id: row.yayasan_id || null,
        sk_izin_operasional: row.sk_izin_operasional || null,
        tanggal_sk_izin_operasional: row.tanggal_sk_izin_operasional || null,
        no_rekening: row.no_rekening || null,
        nama_bank: row.nama_bank || null,
        cabang_kcp_unit: row.cabang_kcp_unit || null,
        rekening_atas_nama: row.rekening_atas_nama || null,
        mbs: row.mbs || null,
        luas_tanah_milik: row.luas_tanah_milik || null,
        luas_tanah_bukan_milik: row.luas_tanah_bukan_milik || null,
        kode_registrasi: row.kode_registrasi || null,
        npwp: row.npwp || null,
        nm_wp: row.nm_wp || null,
        keaktifan: row.keaktifan || null,
        flag: row.flag || null,
        soft_delete: row.soft_delete || null,
        last_sync: this.parseDate(row.last_sync),
        updater_id: row.updater_id || null,
        logo: row.logo || null,
        cadisdik_id: row.cadisdik_id || null,
        social_media: row.social_media || null,
        radius: this.parseNumber(row.radius) || 100,
      };

      try {
        await this.prisma.sekolah.upsert({
          where: { sekolah_id: targetId },
          create: payload,
          update: payload,
        });
        successCount++;
      } catch (err) {
        this.logger.error(`Error upsert Sekolah ${targetId}: ${err.message}`);
      }
    }
    return { successCount };
  }

  async syncRombel(sekolahId: string, dataRows: any[]) {
    let successCount = 0;
    for (const r of dataRows) {
      if (!r.rombongan_belajar_id) continue;

      const payload = {
        rombongan_belajar_id: r.rombongan_belajar_id,
        sekolah_id: sekolahId,
        semester_id: r.semester_id ? String(r.semester_id).trim() : null,
        id_ruang: r.id_ruang || null,
        tingkat_pendidikan_id: this.parseNumber(r.tingkat_pendidikan_id),
        jurusan_sp_id: r.jurusan_sp_id || null,
        kurikulum_id: this.parseNumber(r.kurikulum_id),
        nama: r.nama || 'Tanpa Nama',
        ptk_id: r.ptk_id || null,
        moving_class: this.parseNumber(r.moving_class),
        jenis_rombel: this.parseNumber(r.jenis_rombel),
        sks: this.parseNumber(r.sks),
        tanggal_mulai: this.parseDate(r.tanggal_mulai),
        tanggal_selesai: this.parseDate(r.tanggal_selesai),
        kebutuhan_khusus_id: this.parseNumber(r.kebutuhan_khusus_id),
        soft_delete: this.parseNumber(r.soft_delete),
        last_sync: this.parseDate(r.last_sync),
        updater_id: r.updater_id || null,
      };

      try {
        await this.prisma.rombonganBelajar.upsert({
          where: { rombongan_belajar_id: r.rombongan_belajar_id },
          create: payload,
          update: payload,
        });

        // Sync nested anggota_rombel
        const anggotaRows = r.anggota_rombel || r.AnggotaRombel || r.anggota_rombels || [];
        if (Array.isArray(anggotaRows) && anggotaRows.length > 0) {
          for (const a of anggotaRows) {
            if (!a.anggota_rombel_id) continue;
            const aPayload = {
              anggota_rombel_id: a.anggota_rombel_id,
              rombongan_belajar_id: r.rombongan_belajar_id,
              peserta_didik_id: a.peserta_didik_id,
              jenis_pendaftaran_id: this.parseNumber(a.jenis_pendaftaran_id),
              sekolah_id: sekolahId,
              soft_delete: this.parseNumber(a.soft_delete),
              last_sync: this.parseDate(a.last_sync),
              updater_id: a.updater_id || null,
            };
            await this.prisma.anggotaRombel.upsert({
              where: { anggota_rombel_id: a.anggota_rombel_id },
              create: aPayload,
              update: aPayload,
            });
          }
        }

        // Sync nested pembelajaran
        const pembelajaranRows = r.pembelajaran || r.Pembelajaran || r.pembelajarans || [];
        if (Array.isArray(pembelajaranRows) && pembelajaranRows.length > 0) {
          for (const p of pembelajaranRows) {
            if (!p.pembelajaran_id) continue;
            const pPayload = {
              pembelajaran_id: p.pembelajaran_id,
              rombongan_belajar_id: r.rombongan_belajar_id,
              semester_id: p.semester_id ? String(p.semester_id).trim() : null,
              mata_pelajaran_id: this.parseNumber(p.mata_pelajaran_id),
              ptk_terdaftar_id: p.ptk_terdaftar_id || null,
              ptk_id: p.ptk_id || null,
              sk_mengajar: p.sk_mengajar || null,
              tanggal_sk_mengajar: this.parseDate(p.tanggal_sk_mengajar),
              jam_mengajar_per_minggu: this.parseNumber(p.jam_mengajar_per_minggu),
              status_di_kurikulum: this.parseNumber(p.status_di_kurikulum),
              nama_mata_pelajaran: p.nama_mata_pelajaran || null,
              induk_pembelajaran_id: p.induk_pembelajaran_id || null,
              sekolah_id: sekolahId,
              soft_delete: this.parseNumber(p.soft_delete),
              last_sync: this.parseDate(p.last_sync),
              updater_id: p.updater_id || null,
            };
            await this.prisma.pembelajaran.upsert({
              where: { pembelajaran_id: p.pembelajaran_id },
              create: pPayload,
              update: pPayload,
            });
          }
        }

        successCount++;
      } catch (err) {
        this.logger.error(`Error upsert Rombel ${r.rombongan_belajar_id}: ${err.message}`);
      }
    }
    return { successCount };
  }

  async syncPesertaDidik(sekolahId: string, dataRows: any[]) {
    let successCount = 0;
    
    // Ambil domain sekolah untuk auto-generate qr_token
    const appKey = await this.prisma.appKey.findUnique({ where: { sekolah_id: sekolahId } });
    const domain = appKey?.domain?.replace(/\/+$/, '') || '';

    // Pre-fetch valid agama IDs to avoid FK constraint violations
    const validAgamaRows = await this.prisma.agama.findMany({ select: { agama_id: true } });
    const validAgamaIds = new Set(validAgamaRows.map(a => a.agama_id));

    for (const p of dataRows) {
      if (!p.peserta_didik_id) continue;

      let qr_token = p.qr_token || null;
      if (!qr_token && domain) {
        qr_token = `${domain}/${p.peserta_didik_id}`;
      }

      const rpd = p.registrasi_peserta_didik || {};

      // Validate agama_id against ref table
      const rawAgamaId = p.agama_id ? Number(p.agama_id) : null;
      const validatedAgamaId = rawAgamaId && validAgamaIds.has(rawAgamaId) ? rawAgamaId : null;

      const payload = {
        // --- Kolom dari peserta_didik ---
        nama: p.nama || 'Tanpa Nama',
        jenis_kelamin: p.jenis_kelamin || null,
        nisn: p.nisn || null,
        nik: p.nik || null,
        no_kk: p.no_kk || null,
        tempat_lahir: p.tempat_lahir || null,
        tanggal_lahir: this.parseDate(p.tanggal_lahir),
        agama_id: validatedAgamaId,
        kebutuhan_khusus_id: this.parseNumber(p.kebutuhan_khusus_id),
        alamat_jalan: p.alamat_jalan || null,
        rt: this.parseNumber(p.rt),
        rw: this.parseNumber(p.rw),
        nama_dusun: p.nama_dusun || null,
        desa_kelurahan: p.desa_kelurahan || null,
        kode_wilayah: p.kode_wilayah || null,
        kode_pos: p.kode_pos || null,
        lintang: this.parseNumber(p.lintang),
        bujur: this.parseNumber(p.bujur),
        jenis_tinggal_id: this.parseNumber(p.jenis_tinggal_id),
        alat_transportasi_id: this.parseNumber(p.alat_transportasi_id),
        nik_ayah: p.nik_ayah || null,
        nik_ibu: p.nik_ibu || null,
        anak_keberapa: this.parseNumber(p.anak_keberapa),
        nik_wali: p.nik_wali || null,
        nomor_telepon_rumah: p.nomor_telepon_rumah || null,
        nomor_telepon_seluler: p.nomor_telepon_seluler || null,
        email: p.email || null,
        penerima_kps: this.parseNumber(p.penerima_kps),
        no_kps: p.no_kps || null,
        layak_pip: this.parseNumber(p.layak_pip),
        penerima_kip: this.parseNumber(p.penerima_kip),
        no_kip: p.no_kip || null,
        nm_kip: p.nm_kip || null,
        no_kks: p.no_kks || null,
        reg_akta_lahir: p.reg_akta_lahir || null,
        id_layak_pip: this.parseNumber(p.id_layak_pip),
        id_bank: p.id_bank || null,
        rekening_bank: p.rekening_bank || null,
        nama_kcp: p.nama_kcp || null,
        rekening_atas_nama: p.rekening_atas_nama || null,
        status_data: p.status_data ? Number(p.status_data) : null,
        nama_ayah: p.nama_ayah || null,
        tahun_lahir_ayah: this.parseNumber(p.tahun_lahir_ayah),
        jenjang_pendidikan_ayah: this.parseNumber(p.jenjang_pendidikan_ayah),
        pekerjaan_id_ayah: p.pekerjaan_id_ayah ? Number(p.pekerjaan_id_ayah) : null,
        penghasilan_id_ayah: p.penghasilan_id_ayah ? Number(p.penghasilan_id_ayah) : null,
        kebutuhan_khusus_id_ayah: p.kebutuhan_khusus_id_ayah ? Number(p.kebutuhan_khusus_id_ayah) : null,
        nama_ibu_kandung: p.nama_ibu_kandung || null,
        tahun_lahir_ibu: this.parseNumber(p.tahun_lahir_ibu),
        jenjang_pendidikan_ibu: this.parseNumber(p.jenjang_pendidikan_ibu),
        penghasilan_id_ibu: p.penghasilan_id_ibu ? Number(p.penghasilan_id_ibu) : null,
        pekerjaan_id_ibu: p.pekerjaan_id_ibu ? Number(p.pekerjaan_id_ibu) : null,
        kebutuhan_khusus_id_ibu: p.kebutuhan_khusus_id_ibu ? Number(p.kebutuhan_khusus_id_ibu) : null,
        nama_wali: p.nama_wali || null,
        tahun_lahir_wali: this.parseNumber(p.tahun_lahir_wali),
        jenjang_pendidikan_wali: this.parseNumber(p.jenjang_pendidikan_wali),
        pekerjaan_id_wali: p.pekerjaan_id_wali ? Number(p.pekerjaan_id_wali) : null,
        penghasilan_id_wali: p.penghasilan_id_wali ? Number(p.penghasilan_id_wali) : null,
        kewarganegaraan: p.kewarganegaraan || 'Indonesia',
        pekerjaan_id: p.pekerjaan_id ? Number(p.pekerjaan_id) : null,
        soft_delete: this.parseNumber(p.soft_delete),

        // --- Kolom dari registrasi_peserta_didik ---
        registrasi_id: rpd.registrasi_id || null,
        jurusan_sp_id: rpd.jurusan_sp_id || null,
        sekolah_id: rpd.sekolah_id || sekolahId,
        jenis_pendaftaran_id: this.parseNumber(rpd.jenis_pendaftaran_id),
        nipd: rpd.nipd || null,
        tanggal_masuk_sekolah: this.parseDate(rpd.tanggal_masuk_sekolah),
        jenis_keluar_id: rpd.jenis_keluar_id || null,
        tanggal_keluar: this.parseDate(rpd.tanggal_keluar),
        keterangan: rpd.keterangan || null,
        no_skhun: rpd.no_skhun || null,
        no_peserta_ujian: rpd.no_peserta_ujian || null,
        no_seri_ijazah: rpd.no_seri_ijazah || null,
        a_pernah_paud: this.parseNumber(rpd.a_pernah_paud),
        a_pernah_tk: this.parseNumber(rpd.a_pernah_tk),
        sekolah_asal: rpd.sekolah_asal || null,
        id_hobby: this.parseNumber(rpd.id_hobby),
        id_cita: this.parseNumber(rpd.id_cita),

        // --- Kolom dari peserta_didik_longitudinal ---
        berat_badan: this.parseNumber(p.berat_badan),
        tinggi_badan: this.parseNumber(p.tinggi_badan),
        lingkar_kepala: this.parseNumber(p.lingkar_kepala),
        jarak_rumah_ke_sekolah: this.parseNumber(p.jarak_rumah_ke_sekolah),
        jarak_rumah_ke_sekolah_km: this.parseNumber(p.jarak_rumah_ke_sekolah_km),
        waktu_tempuh_ke_sekolah: this.parseNumber(p.waktu_tempuh_ke_sekolah),
        menit_tempuh_ke_sekolah: this.parseNumber(p.menit_tempuh_ke_sekolah),
        jumlah_saudara_kandung: this.parseNumber(p.jumlah_saudara_kandung),

        // --- SIMAK fields ---
        qr_token,
        foto: p.foto || null,
        status: rpd.jenis_keluar_id ? (rpd.ket_keluar || 'Non-Aktif') : (p.status || 'Aktif'),
        telegram_chat_id: p.telegram_chat_id || null,
        telegram_token: p.telegram_token || null,
        rombongan_belajar_id: p.rombongan_belajar_id || null,
      };

      try {
        // Langsung update dengan data dari payload, membiarkan status tertimpa
        await this.prisma.pesertaDidik.upsert({
          where: { peserta_didik_id: p.peserta_didik_id },
          create: { ...payload, peserta_didik_id: p.peserta_didik_id },
          update: { ...payload, updated_at: new Date() },
        });
        successCount++;
      } catch (err) {
        this.logger.error(`Error upsert PesertaDidik ${p.peserta_didik_id}: ${err.message}`);
      }
    }
    return { successCount };
  }

  async syncGtk(sekolahId: string, dataRows: any[]) {
    let successCount = 0;

    // Ambil domain sekolah untuk auto-generate qr_token
    const appKey = await this.prisma.appKey.findUnique({ where: { sekolah_id: sekolahId } });
    const domain = appKey?.domain?.replace(/\/+$/, '') || '';

    // Pre-fetch valid FK IDs to avoid FK constraint violations (sama seperti pola syncPesertaDidik)
    const [validAgamaRows, validJenisPtkRows, validJabatanPtkRows, validStatusKepegawaianRows, validSumberGajiRows] = await Promise.all([
      this.prisma.agama.findMany({ select: { agama_id: true } }),
      this.prisma.jenis_ptk.findMany({ select: { jenis_ptk_id: true } }),
      this.prisma.jabatan_ptk.findMany({ select: { jabatan_ptk_id: true } }),
      this.prisma.status_kepegawaian.findMany({ select: { status_kepegawaian_id: true } }),
      this.prisma.sumber_gaji.findMany({ select: { sumber_gaji_id: true } }),
    ]);
    const validAgamaIds = new Set(validAgamaRows.map(a => a.agama_id));
    const validJenisPtkIds = new Set(validJenisPtkRows.map(j => j.jenis_ptk_id.toNumber()));
    const validJabatanPtkIds = new Set(validJabatanPtkRows.map(j => j.jabatan_ptk_id.toNumber()));
    const validStatusKepegawaianIds = new Set(validStatusKepegawaianRows.map(s => s.status_kepegawaian_id));
    const validSumberGajiIds = new Set(validSumberGajiRows.map(s => s.sumber_gaji_id.toNumber()));

    this.logger.log(`syncGtk: Validating ${dataRows.length} GTK records for sekolah ${sekolahId}. Valid ref counts: agama=${validAgamaIds.size}, jenis_ptk=${validJenisPtkIds.size}, jabatan_ptk=${validJabatanPtkIds.size}, status_kepegawaian=${validStatusKepegawaianIds.size}, sumber_gaji=${validSumberGajiIds.size}`);

    for (const g of dataRows) {
      if (!g.ptk_id) continue;

      // Preserve existing qr_token or generate from domain
      let qr_token = g.qr_token || null;
      if (!qr_token && domain) {
        qr_token = `${domain}/${g.ptk_id}`;
      }

      // ptk_terdaftar data (nested dari main.js)
      const pt = g.ptk_terdaftar || {};

      // Validate FK references — null-kan jika tidak ada di tabel ref backend
      const rawAgamaId = this.parseNumber(g.agama_id);
      const validatedAgamaId = rawAgamaId && validAgamaIds.has(rawAgamaId) ? rawAgamaId : null;

      const rawJenisPtkId = this.parseNumber(pt.jenis_ptk_id);
      const validatedJenisPtkId = rawJenisPtkId && validJenisPtkIds.has(rawJenisPtkId) ? rawJenisPtkId : null;

      const rawJabatanPtkId = this.parseNumber(pt.jabatan_ptk_id);
      const validatedJabatanPtkId = rawJabatanPtkId && validJabatanPtkIds.has(rawJabatanPtkId) ? rawJabatanPtkId : null;

      const rawStatusKepegawaianId = this.parseNumber(g.status_kepegawaian_id);
      const validatedStatusKepegawaianId = rawStatusKepegawaianId && validStatusKepegawaianIds.has(rawStatusKepegawaianId) ? rawStatusKepegawaianId : null;

      const rawSumberGajiId = this.parseNumber(g.sumber_gaji_id);
      const validatedSumberGajiId = rawSumberGajiId && validSumberGajiIds.has(rawSumberGajiId) ? rawSumberGajiId : null;

      const payload = {
        // --- Kolom dari ptk ---
        nama: g.nama || 'Tanpa Nama',
        nip: g.nip || null,
        jenis_kelamin: g.jenis_kelamin || null,
        tempat_lahir: g.tempat_lahir || null,
        tanggal_lahir: this.parseDate(g.tanggal_lahir),
        nik: g.nik || null,
        no_kk: g.no_kk || null,
        niy_nigk: g.niy_nigk || null,
        nuptk: g.nuptk || null,
        nrg: g.nrg || null,
        nuks: g.nuks || null,
        status_kepegawaian_id: validatedStatusKepegawaianId,
        pengawas_bidang_studi_id: this.parseNumber(g.pengawas_bidang_studi_id),
        agama_id: validatedAgamaId,
        alamat_jalan: g.alamat_jalan || null,
        rt: this.parseNumber(g.rt),
        rw: this.parseNumber(g.rw),
        nama_dusun: g.nama_dusun || null,
        desa_kelurahan: g.desa_kelurahan || null,
        kode_wilayah: g.kode_wilayah || null,
        kode_pos: g.kode_pos || null,
        lintang: this.parseNumber(g.lintang),
        bujur: this.parseNumber(g.bujur),
        no_telepon_rumah: g.no_telepon_rumah || null,
        no_hp: g.no_hp || null,
        email: g.email || null,
        status_keaktifan_id: this.parseNumber(g.status_keaktifan_id),
        sk_cpns: g.sk_cpns || null,
        tgl_cpns: this.parseDate(g.tgl_cpns),
        sk_pengangkatan: g.sk_pengangkatan || null,
        tmt_pengangkatan: this.parseDate(g.tmt_pengangkatan),
        lembaga_pengangkat_id: this.parseNumber(g.lembaga_pengangkat_id),
        pangkat_golongan_id: this.parseNumber(g.pangkat_golongan_id),
        keahlian_laboratorium_id: this.parseNumber(g.keahlian_laboratorium_id),
        sumber_gaji_id: validatedSumberGajiId,
        nama_ibu_kandung: g.nama_ibu_kandung || null,
        status_perkawinan: this.parseNumber(g.status_perkawinan),
        nama_suami_istri: g.nama_suami_istri || null,
        nip_suami_istri: g.nip_suami_istri || null,
        pekerjaan_suami_istri: this.parseNumber(g.pekerjaan_suami_istri),
        tmt_pns: this.parseDate(g.tmt_pns),
        sudah_lisensi_kepala_sekolah: this.parseNumber(g.sudah_lisensi_kepala_sekolah),
        jumlah_sekolah_binaan: this.parseNumber(g.jumlah_sekolah_binaan),
        pernah_diklat_kepengawasan: this.parseNumber(g.pernah_diklat_kepengawasan),
        nm_wp: g.nm_wp || null,
        status_data: this.parseNumber(g.status_data),
        karpeg: g.karpeg || null,
        karpas: g.karpas || null,
        mampu_handle_kk: this.parseNumber(g.mampu_handle_kk),
        keahlian_braille: this.parseNumber(g.keahlian_braille),
        keahlian_bhs_isyarat: this.parseNumber(g.keahlian_bhs_isyarat),
        kebutuhan_khusus_id: this.parseNumber(g.kebutuhan_khusus_id),
        npwp: g.npwp || null,
        kewarganegaraan: g.kewarganegaraan || null,
        id_bank: g.id_bank || null,
        rekening_bank: g.rekening_bank || null,
        rekening_atas_nama: g.rekening_atas_nama || null,
        blob_id: g.blob_id || null,
        soft_delete: this.parseNumber(g.soft_delete),
        last_sync: this.parseDate(g.last_sync),
        updater_id: g.updater_id || null,

        // --- Kolom dari ptk_terdaftar ---
        ptk_terdaftar_id: pt.ptk_terdaftar_id || null,
        sekolah_id: sekolahId,
        jenis_keluar_id: pt.jenis_keluar_id || null,
        jabatan_ptk_id: validatedJabatanPtkId,
        tahun_ajaran_id: this.parseNumber(pt.tahun_ajaran_id),
        jenis_ptk_id: validatedJenisPtkId,
        nomor_surat_tugas: pt.nomor_surat_tugas || null,
        tanggal_surat_tugas: this.parseDate(pt.tanggal_surat_tugas),
        ptk_induk: this.parseNumber(pt.ptk_induk),
        tmt_tugas: this.parseDate(pt.tmt_tugas),
        tgl_ptk_keluar: this.parseDate(pt.tgl_ptk_keluar),

        // --- SIMAK ---
        qr_token,
        status: g.status || 'Aktif',
      };

      try {
        await this.prisma.gtk.upsert({
          where: { ptk_id: g.ptk_id },
          create: { ...payload, ptk_id: g.ptk_id },
          update: { ...payload, status: g.status || 'Aktif' },
        });

        // Sync formal education history
        if (g.rwy_pend_formal && Array.isArray(g.rwy_pend_formal)) {
          for (const edu of g.rwy_pend_formal) {
            if (!edu.riwayat_pendidikan_formal_id) continue;
            
            const eduPayload = {
              ptk_id: g.ptk_id,
              satuan_pendidikan_formal: edu.satuan_pendidikan_formal || 'Tanpa Nama',
              fakultas: edu.fakultas || null,
              kependidikan: this.parseNumber(edu.kependidikan),
              tahun_masuk: this.parseNumber(edu.tahun_masuk),
              tahun_lulus: this.parseNumber(edu.tahun_lulus),
              nim: edu.nim || null,
              status_kuliah: this.parseNumber(edu.status_kuliah),
              semester: this.parseNumber(edu.semester),
              ipk: this.parseNumber(edu.ipk),
              prodi: edu.prodi || null,
              id_reg_pd: edu.id_reg_pd || null,
              bidang_studi_id: this.parseNumber(edu.bidang_studi_id),
              jenjang_pendidikan_id: this.parseNumber(edu.jenjang_pendidikan_id),
              gelar_akademik_id: this.parseNumber(edu.gelar_akademik_id),
            };

            await this.prisma.riwayatPendidikanFormal.upsert({
              where: { riwayat_pendidikan_formal_id: edu.riwayat_pendidikan_formal_id },
              create: { ...eduPayload, riwayat_pendidikan_formal_id: edu.riwayat_pendidikan_formal_id } as any,
              update: { ...eduPayload, updated_at: new Date() } as any,
            });
          }
        }

        successCount++;
      } catch (err) {
        this.logger.error(`Error upsert GTK ${g.ptk_id}: ${err.message}`);
      }
    }
    return { successCount };
  }

  async syncPengguna(sekolahId: string, dataRows: any[]) {
    let successCount = 0;
    for (const u of dataRows) {
      if (!u.pengguna_id && !u.username) continue;
      const targetId = u.pengguna_id || u.username;

      // Proteksi Administrator agar tidak ketimpa sekolah_id-nya
      let targetSekolahId: string | null = sekolahId;
      if (u.peran_nama === 'Administrator' || u.username === 'admin' || u.username.includes('admin')) {
        targetSekolahId = null;
      }

      let validatedPtkId = u.ptk_id || null;
      let validatedPesertaDidikId = u.peserta_didik_id || null;

      // Cek apakah ptk_id benar-benar ada di database untuk mencegah foreign key violation
      if (u.ptk_id) {
        const gtkExists = await this.prisma.gtk.findUnique({
          where: { ptk_id: u.ptk_id }
        });
        if (!gtkExists) {
          validatedPtkId = null;
        }
      }

      // Cek apakah peserta_didik_id benar-benar ada di database untuk mencegah foreign key violation
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
        peran_nama: u.peran_nama || 'Operator Sekolah',
        peran_id: u.peran_id ? Number(u.peran_id) : null,
        alamat: u.alamat || null,
        no_telepon: u.no_telepon || null,
        no_hp: u.no_hp || null,
        ptk_id: validatedPtkId,
        peserta_didik_id: validatedPesertaDidikId,
      };

      try {
        // Cek jika sudah ada berdasarkan username
        const existing = await this.prisma.pengguna.findUnique({ where: { username: u.username } });
        if (existing) {
          // Jika existing adalah admin dan targetSekolahId null, jaga agar tetap null
          if (existing.sekolah_id === null && targetSekolahId !== null && (existing.peran_nama === 'Administrator' || existing.username.includes('admin'))) {
            targetSekolahId = null;
          }
          await this.prisma.pengguna.update({
            where: { username: u.username },
            data: { ...payload, sekolah_id: targetSekolahId, updated_at: new Date() },
          });
        } else {
          await this.prisma.pengguna.create({
            data: { ...payload, pengguna_id: u.pengguna_id || undefined },
          });
        }
        successCount++;
      } catch (err) {
        this.logger.error(`Error upsert Pengguna ${u.username}: ${err.message}`);
      }
    }
    return { successCount };
  }

  async syncSarpras(sekolahId: string, dataRows: any[]) {
    let successCount = 0;
    for (const item of dataRows) {
      try {
        // Deteksi Entitas dengan prioritas _entity flag atau ID yang paling spesifik
        if (item._entity === 'ruang' || item.id_ruang) {
          if (!item.id_ruang) continue;
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
            jenis_prasarana_id_str: item.jenis_prasarana_id_str || null,
          };
          await this.prisma.ruang.upsert({
            where: { id_ruang: item.id_ruang },
            create: { ...payload, id_ruang: item.id_ruang },
            update: { ...payload, last_update: new Date() },
          });
          successCount++;
        } else if (item._entity === 'bangunan' || item.id_bangunan) {
          if (!item.id_bangunan) continue;
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
            nilai_perolehan_aset: this.parseNumber(item.nilai_perolehan_aset),
            kepemilikan_sarpras_id: item.kepemilikan_sarpras_id || null,
            jenis_prasarana_id_str: item.jenis_prasarana_id_str || null,
          };
          await this.prisma.bangunan.upsert({
            where: { id_bangunan: item.id_bangunan },
            create: { ...payload, id_bangunan: item.id_bangunan },
            update: { ...payload, last_update: new Date() },
          });
          successCount++;
        } else if (item._entity === 'tanah' || item.id_tanah) {
          if (!item.id_tanah) continue;
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
            kepemilikan_sarpras_id: item.kepemilikan_sarpras_id || null,
            nilai_perolehan_aset: this.parseNumber(item.nilai_perolehan_aset),
            jenis_prasarana_id_str: item.jenis_prasarana_id_str || null,
          };
          await this.prisma.tanah.upsert({
            where: { id_tanah: item.id_tanah },
            create: { ...payload, id_tanah: item.id_tanah },
            update: { ...payload, last_update: new Date() },
          });
          successCount++;
        }
      } catch (err) {
        this.logger.error(`Error upsert Sarpras item: ${err.message}`);
      }
    }
    return { successCount };
  }

  async syncDudi(sekolahId: string, dataRows: any[]) {
    let successCount = 0;
    for (const d of dataRows) {
      if (!d.dudi_id) continue;

      const dudiPayload = {
        sekolah_id: sekolahId,
        nama: d.nama || 'Tanpa Nama',
        bidang_usaha_id: d.bidang_usaha_id || null,
        nama_bidang_usaha: d.nama_bidang_usaha || null,
        alamat_jalan: d.alamat_jalan || null,
        rt: d.rt ? String(d.rt) : null,
        rw: d.rw ? String(d.rw) : null,
        nama_dusun: d.nama_dusun || null,
        desa_kelurahan: d.desa_kelurahan || null,
        kode_wilayah: d.kode_wilayah || null,
        kode_pos: d.kode_pos || null,
        lintang: this.parseNumber(d.lintang),
        bujur: this.parseNumber(d.bujur),
        nomor_telepon: d.nomor_telepon || null,
        nomor_fax: d.nomor_fax || null,
        email: d.email || null,
        website: d.website || null,
        npwp: d.npwp || null,
        nama_cp: d.nama_cp || null,
        no_hp_cp: d.no_hp_cp || null,
        soft_delete: this.parseNumber(d.soft_delete),
      };

      try {
        await this.prisma.dudi.upsert({
          where: { dudi_id: d.dudi_id },
          create: { ...dudiPayload, dudi_id: d.dudi_id },
          update: { ...dudiPayload, updated_at: new Date() },
        });
        successCount++;

        // Sync MOU yang terkait
        if (Array.isArray(d.mou)) {
          for (const m of d.mou) {
            if (!m.mou_id) continue;
            const mouPayload = {
              dudi_id: d.dudi_id,
              sekolah_id: sekolahId,
              nomor_mou: m.nomor_mou || null,
              judul_mou: m.judul_mou || null,
              tanggal_mulai: this.parseDate(m.tanggal_mulai),
              tanggal_selesai: this.parseDate(m.tanggal_selesai),
              keterangan: m.keterangan || null,
              soft_delete: this.parseNumber(m.soft_delete),
            };
            await this.prisma.mou.upsert({
              where: { mou_id: m.mou_id },
              create: { ...mouPayload, mou_id: m.mou_id },
              update: { ...mouPayload, updated_at: new Date() },
            });

            // Sync AktPd
            if (Array.isArray(m.akt_pd)) {
              for (const a of m.akt_pd) {
                if (!a.id_akt_pd) continue;
                const aktPayload = {
                  mou_id: m.mou_id,
                  jenis_akt_pd: a.jenis_akt_pd ? String(a.jenis_akt_pd) : null,
                  judul_akt_pd: a.judul_akt_pd || null,
                  sk_tugas: a.sk_tugas || null,
                  tanggal_sk_tugas: this.parseDate(a.tanggal_sk_tugas),
                  tanggal_mulai: this.parseDate(a.tanggal_mulai),
                  tanggal_selesai: this.parseDate(a.tanggal_selesai),
                  lokasi: a.lokasi || null,
                  soft_delete: this.parseNumber(a.soft_delete),
                };
                await this.prisma.aktPd.upsert({
                  where: { id_akt_pd: a.id_akt_pd },
                  create: { ...aktPayload, id_akt_pd: a.id_akt_pd },
                  update: { ...aktPayload, updated_at: new Date() },
                });

                // Sync AnggotaAktPd
                if (Array.isArray(a.anggota_akt_pd)) {
                  for (const ang of a.anggota_akt_pd) {
                    if (!ang.anggota_akt_pd_id) continue;
                    const pdId = ang.registrasi_peserta_didik?.peserta_didik_id || ang.peserta_didik_id || null;
                    await this.prisma.anggotaAktPd.upsert({
                      where: { anggota_akt_pd_id: ang.anggota_akt_pd_id },
                      create: {
                        anggota_akt_pd_id: ang.anggota_akt_pd_id,
                        id_akt_pd: a.id_akt_pd,
                        registrasi_id: ang.registrasi_id || null,
                        peserta_didik_id: pdId,
                        soft_delete: this.parseNumber(ang.soft_delete),
                      },
                      update: {
                        registrasi_id: ang.registrasi_id || null,
                        peserta_didik_id: pdId,
                        soft_delete: this.parseNumber(ang.soft_delete),
                        updated_at: new Date(),
                      },
                    });
                  }
                }

                // Sync BimbingPd
                if (Array.isArray(a.bimbing_pd)) {
                  for (const b of a.bimbing_pd) {
                    if (!b.bimbing_pd_id) continue;
                    await this.prisma.bimbingPd.upsert({
                      where: { bimbing_pd_id: b.bimbing_pd_id },
                      create: {
                        bimbing_pd_id: b.bimbing_pd_id,
                        id_akt_pd: a.id_akt_pd,
                        ptk_id: b.ptk_id || null,
                        urutan_pembimbing: this.parseNumber(b.urutan_pembimbing),
                        soft_delete: this.parseNumber(b.soft_delete),
                      },
                      update: {
                        ptk_id: b.ptk_id || null,
                        urutan_pembimbing: this.parseNumber(b.urutan_pembimbing),
                        soft_delete: this.parseNumber(b.soft_delete),
                        updated_at: new Date(),
                      },
                    });
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        this.logger.error(`Error upsert Dudi ${d.dudi_id}: ${err.message}`);
      }
    }
    return { successCount };
  }

  async syncRwySertifikat(sekolahId: string, dataRows: any[]) {
    let successCount = 0;
    for (const r of dataRows) {
      if (!r.riwayat_sertifikasi_id) continue;

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
      } catch (err) {
        this.logger.error(`Error upsert RwySertifikat ${r.riwayat_sertifikasi_id}: ${err.message}`);
      }
    }
    return { successCount };
  }

  async syncRwyKepangkatan(sekolahId: string, dataRows: any[]) {
    let successCount = 0;
    for (const r of dataRows) {
      if (!r.riwayat_kepangkatan_id) continue;

      const payload = {
        sekolah_id: sekolahId,
        ptk_id: r.ptk_id || null,
        pangkat_golongan_id: this.parseNumber(r.pangkat_golongan_id),
        nomor_sk: r.nomor_sk || null,
        tanggal_sk: this.parseDate(r.tanggal_sk),
        tmt_pangkat: this.parseDate(r.tmt_pangkat),
        masa_kerja_gol_tahun: this.parseNumber(r.masa_kerja_gol_tahun),
        masa_kerja_gol_bulan: this.parseNumber(r.masa_kerja_gol_bulan),
        asal_data: r.asal_data ? String(r.asal_data) : null,
        create_date: this.parseDate(r.create_date),
        last_update: this.parseDate(r.last_update || r.last_sync),
        soft_delete: this.parseNumber(r.soft_delete),
        last_sync: this.parseDate(r.last_sync),
        updater_id: r.updater_id || null,
      };

      try {
        await this.prisma.rwyKepangkatan.upsert({
          where: { riwayat_kepangkatan_id: r.riwayat_kepangkatan_id },
          create: { ...payload, riwayat_kepangkatan_id: r.riwayat_kepangkatan_id },
          update: { ...payload, updated_at: new Date() },
        });
        successCount++;
      } catch (err) {
        this.logger.error(`Error upsert RwyKepangkatan ${r.riwayat_kepangkatan_id}: ${err.message}`);
      }
    }
    return { successCount };
  }

  async syncPembelajaran(sekolahId: string, dataRows: any[]) {
    let successCount = 0;
    for (const p of dataRows) {
      if (!p.pembelajaran_id) continue;

      const payload = {
        pembelajaran_id: p.pembelajaran_id,
        rombongan_belajar_id: p.rombongan_belajar_id,
        semester_id: p.semester_id ? String(p.semester_id).trim() : null,
        mata_pelajaran_id: this.parseNumber(p.mata_pelajaran_id),
        ptk_terdaftar_id: p.ptk_terdaftar_id || null,
        ptk_id: p.ptk_id || null,
        sk_mengajar: p.sk_mengajar || null,
        tanggal_sk_mengajar: this.parseDate(p.tanggal_sk_mengajar),
        jam_mengajar_per_minggu: this.parseNumber(p.jam_mengajar_per_minggu),
        status_di_kurikulum: this.parseNumber(p.status_di_kurikulum),
        nama_mata_pelajaran: p.nama_mata_pelajaran || null,
        induk_pembelajaran_id: p.induk_pembelajaran_id || null,
        sekolah_id: sekolahId,
        soft_delete: this.parseNumber(p.soft_delete),
        last_sync: this.parseDate(p.last_sync),
        updater_id: p.updater_id || null,
      };

      try {
        await this.prisma.pembelajaran.upsert({
          where: { pembelajaran_id: p.pembelajaran_id },
          create: payload,
          update: payload,
        });
        successCount++;
      } catch (err) {
        this.logger.error(`Error upsert Pembelajaran ${p.pembelajaran_id}: ${err.message}`);
      }
    }
    return { successCount };
  }
}
