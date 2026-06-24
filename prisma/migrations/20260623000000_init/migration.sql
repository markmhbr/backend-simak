-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "dapodik";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "mandala";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "ref";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "simak";

-- CreateTable
CREATE TABLE "dapodik"."sekolah" (
    "sekolah_id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "nama_nomenklatur" TEXT,
    "nss" TEXT,
    "npsn" TEXT,
    "bentuk_pendidikan_id" INTEGER,
    "alamat_jalan" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "nama_dusun" TEXT,
    "desa_kelurahan" TEXT,
    "kode_wilayah" TEXT,
    "kode_pos" TEXT,
    "lintang" DECIMAL(65,30),
    "bujur" DECIMAL(65,30),
    "nomor_telepon" TEXT,
    "nomor_fax" TEXT,
    "email" TEXT,
    "website" TEXT,
    "kebutuhan_khusus_id" INTEGER,
    "status_sekolah" TEXT,
    "sk_pendirian_sekolah" TEXT,
    "tanggal_sk_pendirian" TEXT,
    "status_kepemilikan_id" TEXT,
    "yayasan_id" UUID,
    "sk_izin_operasional" TEXT,
    "tanggal_sk_izin_operasional" TEXT,
    "no_rekening" TEXT,
    "nama_bank" TEXT,
    "cabang_kcp_unit" TEXT,
    "rekening_atas_nama" TEXT,
    "mbs" TEXT,
    "luas_tanah_milik" TEXT,
    "luas_tanah_bukan_milik" TEXT,
    "kode_registrasi" TEXT,
    "npwp" TEXT,
    "nm_wp" TEXT,
    "keaktifan" TEXT,
    "flag" TEXT,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,
    "soft_delete" TEXT,
    "last_sync" TIMESTAMP(3),
    "updater_id" UUID,
    "bentuk_pendidikan_id_str" TEXT,
    "kode_wilayah_str" TEXT,
    "kebutuhan_khusus_id_str" TEXT,
    "yayasan_id_str" TEXT,
    "vld_count" INTEGER,
    "logo" TEXT,
    "cadisdik_id" UUID,
    "social_media" JSONB,
    "radius" INTEGER DEFAULT 100,

    CONSTRAINT "sekolah_pkey" PRIMARY KEY ("sekolah_id")
);

-- CreateTable
CREATE TABLE "dapodik"."rombongan_belajar" (
    "rombongan_belajar_id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "tingkat_pendidikan_id" TEXT,
    "tingkat_pendidikan_id_str" TEXT,
    "semester_id" TEXT,
    "jenis_rombel" TEXT,
    "jenis_rombel_str" TEXT,
    "kurikulum_id" INTEGER,
    "kurikulum_id_str" TEXT,
    "id_ruang" UUID,
    "id_ruang_str" TEXT,
    "moving_class" TEXT,
    "ptk_id" UUID,
    "ptk_id_str" TEXT,
    "jurusan_id" TEXT,
    "jurusan_id_str" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sekolah_id" UUID,
    "id_ekskul" TEXT,
    "id_kelas_ekskul" TEXT,
    "nm_ekskul" TEXT,
    "sk_ekskul" TEXT,

    CONSTRAINT "rombongan_belajar_pkey" PRIMARY KEY ("rombongan_belajar_id")
);

-- CreateTable
CREATE TABLE "dapodik"."anggota_rombel" (
    "anggota_rombel_id" UUID NOT NULL,
    "rombongan_belajar_id" UUID NOT NULL,
    "peserta_didik_id" UUID NOT NULL,
    "jenis_pendaftaran_id" TEXT,
    "jenis_pendaftaran_id_str" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sekolah_id" UUID,

    CONSTRAINT "anggota_rombel_pkey" PRIMARY KEY ("anggota_rombel_id")
);

-- CreateTable
CREATE TABLE "dapodik"."pembelajaran" (
    "pembelajaran_id" UUID NOT NULL,
    "rombongan_belajar_id" UUID NOT NULL,
    "mata_pelajaran_id" TEXT,
    "mata_pelajaran_id_str" TEXT,
    "ptk_terdaftar_id" UUID,
    "ptk_id" UUID,
    "nama_mata_pelajaran" TEXT,
    "induk_pembelajaran_id" UUID,
    "jam_mengajar_per_minggu" TEXT,
    "status_di_kurikulum" TEXT,
    "status_di_kurikulum_str" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sekolah_id" UUID,
    "ptk_id_str" TEXT,

    CONSTRAINT "pembelajaran_pkey" PRIMARY KEY ("pembelajaran_id")
);

-- CreateTable
CREATE TABLE "dapodik"."peserta_didik" (
    "peserta_didik_id" UUID NOT NULL,
    "sekolah_id" UUID,
    "registrasi_id" UUID,
    "anggota_rombel_id" UUID,
    "rombongan_belajar_id" UUID,
    "nama" TEXT NOT NULL,
    "jenis_kelamin" TEXT,
    "nisn" TEXT,
    "nik" TEXT,
    "no_kk" TEXT,
    "tempat_lahir" TEXT,
    "tanggal_lahir" DATE,
    "agama_id" TEXT,
    "agama_id_str" TEXT,
    "kewarganegaraan" TEXT DEFAULT 'Indonesia',
    "kebutuhan_khusus_id" INTEGER,
    "kebutuhan_khusus" TEXT,
    "alamat_jalan" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "nama_dusun" TEXT,
    "desa_kelurahan" TEXT,
    "kode_wilayah" TEXT,
    "kode_pos" TEXT,
    "lintang" DECIMAL(65,30),
    "bujur" DECIMAL(65,30),
    "jenis_tinggal_id" TEXT,
    "alat_transportasi_id" TEXT,
    "nomor_telepon_rumah" TEXT,
    "nomor_telepon_seluler" TEXT,
    "email" TEXT,
    "tinggi_badan" TEXT,
    "berat_badan" TEXT,
    "anak_keberapa" TEXT,
    "yatim_piatu" INTEGER,
    "nik_ayah" TEXT,
    "nama_ayah" TEXT,
    "tahun_lahir_ayah" TEXT,
    "jenjang_pendidikan_ayah" TEXT,
    "pekerjaan_id_ayah" INTEGER,
    "pekerjaan_ayah_id" TEXT,
    "pekerjaan_ayah_id_str" TEXT,
    "penghasilan_id_ayah" TEXT,
    "kebutuhan_khusus_id_ayah" INTEGER,
    "nik_ibu" TEXT,
    "nama_ibu" TEXT,
    "tahun_lahir_ibu" TEXT,
    "jenjang_pendidikan_ibu" TEXT,
    "pekerjaan_id_ibu" INTEGER,
    "pekerjaan_ibu_id" TEXT,
    "pekerjaan_ibu_id_str" TEXT,
    "penghasilan_id_ibu" TEXT,
    "kebutuhan_khusus_id_ibu" INTEGER,
    "nik_wali" TEXT,
    "nama_wali" TEXT,
    "tahun_lahir_wali" TEXT,
    "jenjang_pendidikan_wali" TEXT,
    "pekerjaan_id_wali" INTEGER,
    "pekerjaan_wali_id" TEXT,
    "pekerjaan_wali_id_str" TEXT,
    "penghasilan_id_wali" TEXT,
    "penerima_kps" TEXT,
    "no_kps" TEXT,
    "layak_pip" TEXT,
    "id_layak_pip" TEXT,
    "penerima_kip" TEXT,
    "no_kip" TEXT,
    "nm_kip" TEXT,
    "no_kks" TEXT,
    "reg_akta_lahir" TEXT,
    "id_bank" TEXT,
    "rekening_bank" TEXT,
    "nama_kcp" TEXT,
    "rekening_atas_nama" TEXT,
    "nipd" TEXT,
    "nomor_induk_pd" TEXT,
    "jenis_pendaftaran_id" TEXT,
    "jenis_pendaftaran_id_str" TEXT,
    "tanggal_masuk_sekolah" DATE,
    "sekolah_asal" TEXT,
    "jurusan_sp_id" TEXT,
    "semester_id" TEXT,
    "tingkat_pendidikan_id" TEXT,
    "nama_rombel" TEXT,
    "kurikulum_id" TEXT,
    "kurikulum_id_str" TEXT,
    "jenis_keluar_id" TEXT,
    "ket_keluar" TEXT,
    "tanggal_keluar" DATE,
    "keterangan" TEXT,
    "no_skhun" TEXT,
    "no_peserta_ujian" TEXT,
    "no_seri_ijazah" TEXT,
    "a_pernah_paud" TEXT,
    "a_pernah_tk" TEXT,
    "id_hobby" TEXT,
    "id_cita" TEXT,
    "pekerjaan_id" INTEGER,
    "status_data" INTEGER,
    "konfirmasi_mutasi" INTEGER,
    "vld_count" INTEGER NOT NULL DEFAULT 0,
    "asal_data" TEXT,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,
    "soft_delete" TEXT,
    "last_sync" TIMESTAMP(3),
    "updater_id" UUID,
    "alasan_layak_pip" TEXT,
    "alasan_menolak_kip" TEXT,
    "alat_transportasi_id_str" TEXT,
    "cita_cita" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dusun" TEXT,
    "foto" TEXT,
    "hobi" TEXT,
    "jarak_rumah_ke_sekolah_km" TEXT,
    "jenis_tinggal_id_str" TEXT,
    "jumlah_saudara_kandung" INTEGER,
    "kabupaten_kota" TEXT,
    "kebutuhan_khusus_ayah" TEXT,
    "kebutuhan_khusus_ibu" TEXT,
    "kecamatan" TEXT,
    "lingkar_kepala" INTEGER,
    "nama_di_kip" TEXT,
    "no_registrasi_akta_lahir" TEXT,
    "no_seri_skhun" TEXT,
    "no_ujian_nasional" TEXT,
    "no_wa" TEXT,
    "no_wa_ayah" TEXT,
    "no_wa_ibu" TEXT,
    "no_wa_wali" TEXT,
    "npsn_sekolah_asal" TEXT,
    "paud_formal" TEXT,
    "paud_non_formal" TEXT,
    "pendidikan_ayah_id_str" TEXT,
    "pendidikan_ibu_id_str" TEXT,
    "pendidikan_wali_id_str" TEXT,
    "penghasilan_ayah_id_str" TEXT,
    "penghasilan_ibu_id_str" TEXT,
    "penghasilan_wali_id_str" TEXT,
    "provinsi" TEXT,
    "qr_token" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "status_wali" TEXT NOT NULL DEFAULT 'Tidak',
    "telegram_chat_id" TEXT,
    "telegram_token" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "waktu_tempuh_menit" TEXT,

    CONSTRAINT "peserta_didik_pkey" PRIMARY KEY ("peserta_didik_id")
);

-- CreateTable
CREATE TABLE "dapodik"."gtks" (
    "ptk_id" UUID NOT NULL,
    "ptk_terdaftar_id" UUID,
    "tahun_ajaran_id" TEXT,
    "sekolah_id" UUID,
    "ptk_induk" TEXT,
    "kode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Aktif',
    "sk_mengajar" TEXT,
    "qr_token" TEXT,
    "nama" TEXT NOT NULL,
    "jenis_kelamin" TEXT,
    "tempat_lahir" TEXT,
    "tanggal_lahir" DATE,
    "nama_ibu_kandung" TEXT,
    "agama_id" TEXT,
    "agama_id_str" TEXT,
    "nuptk" TEXT,
    "nik" TEXT,
    "no_kk" TEXT,
    "npwp" TEXT,
    "nama_wajib_pajak" TEXT,
    "kewarganegaraan" TEXT DEFAULT 'ID',
    "status_perkawinan" TEXT,
    "nama_suami_istri" TEXT,
    "pekerjaan_suami_istri" TEXT,
    "jenis_ptk_id" TEXT,
    "jenis_ptk_id_str" TEXT,
    "jabatan_ptk_id" TEXT,
    "jabatan_ptk_id_str" TEXT,
    "status_kepegawaian_id" TEXT,
    "status_kepegawaian_id_str" TEXT,
    "nip" TEXT,
    "niy_nigk" TEXT,
    "nrg" TEXT,
    "sk_pengangkatan" TEXT,
    "tanggal_surat_tugas" DATE,
    "tmt_pengangkatan" DATE,
    "lembaga_pengangkat" TEXT,
    "sk_cpns" TEXT,
    "tmt_cpns" DATE,
    "tmt_pns" DATE,
    "sumber_gaji" TEXT,
    "lisensi_kepsek" BOOLEAN NOT NULL DEFAULT false,
    "nuks" TEXT,
    "keahlian_laboratorium" TEXT,
    "mampu_menangani_kebutuhan_khusus" TEXT,
    "keahlian_braille" BOOLEAN NOT NULL DEFAULT false,
    "keahlian_bahasa_isyarat" BOOLEAN NOT NULL DEFAULT false,
    "pendidikan_terakhir" TEXT,
    "bidang_studi_terakhir" TEXT,
    "pangkat_golongan_terakhir" TEXT,
    "rwy_kepangkatan" JSONB,
    "alamat_jalan" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "dusun" TEXT,
    "desa_kelurahan" TEXT,
    "kecamatan" TEXT,
    "kode_pos" TEXT,
    "lintang" DECIMAL(65,30),
    "bujur" DECIMAL(65,30),
    "no_telepon_rumah" TEXT,
    "no_hp" TEXT,
    "no_wa" TEXT,
    "email" TEXT,
    "foto" TEXT,
    "tandatangan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "kabupaten_kota" TEXT,
    "provinsi" TEXT,
    "id_bank" TEXT,
    "nama_kcp" TEXT,
    "rekening_atas_nama" TEXT,
    "rekening_bank" TEXT,

    CONSTRAINT "gtks_pkey" PRIMARY KEY ("ptk_id")
);

-- CreateTable
CREATE TABLE "dapodik"."pengguna" (
    "pengguna_id" UUID NOT NULL,
    "sekolah_id" UUID,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT,
    "peran_id_str" TEXT,
    "alamat" TEXT,
    "no_telepon" TEXT,
    "no_hp" TEXT,
    "ptk_id" UUID,
    "peserta_didik_id" UUID,
    "google2fa_secret" TEXT,
    "remember_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("pengguna_id")
);

-- CreateTable
CREATE TABLE "dapodik"."tanah" (
    "id_tanah" UUID NOT NULL,
    "jenis_prasarana_id" INTEGER NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "id_hapus_buku" TEXT,
    "kepemilikan_sarpras_id" TEXT,
    "kd_kl" TEXT,
    "kd_satker" TEXT,
    "kd_brg" TEXT,
    "nup" TEXT,
    "kode_eselon1" TEXT,
    "nama_eselon1" TEXT,
    "kode_sub_satker" TEXT,
    "nama_sub_satker" TEXT,
    "nama" TEXT NOT NULL,
    "panjang" DOUBLE PRECISION,
    "lebar" DOUBLE PRECISION,
    "nilai_perolehan_aset" DECIMAL(65,30),
    "kode_wilayah" TEXT NOT NULL,
    "alamat_jalan" TEXT NOT NULL,
    "rt" TEXT,
    "rw" TEXT,
    "nama_dusun" TEXT,
    "desa_kelurahan" TEXT,
    "kode_pos" TEXT,
    "lintang" DECIMAL(65,30),
    "bujur" DECIMAL(65,30),
    "tgl_mutasi_keluar" TIMESTAMP(3),
    "batas" TEXT,
    "ket_tanah" TEXT,
    "luas" DECIMAL(65,30),
    "luas_lahan_tersedia" DECIMAL(65,30),
    "no_sertifikat_tanah" TEXT,
    "asal_data" TEXT,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,
    "soft_delete" TEXT,
    "last_sync" TIMESTAMP(3),
    "updater_id" UUID,
    "jenis_prasarana_id_str" TEXT,
    "kode_wilayah_str" TEXT,
    "sekolah_id_str" TEXT,
    "vld_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tanah_pkey" PRIMARY KEY ("id_tanah")
);

-- CreateTable
CREATE TABLE "dapodik"."bangunan" (
    "id_bangunan" UUID NOT NULL,
    "jenis_prasarana_id" INTEGER NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "id_tanah" UUID NOT NULL,
    "ptk_id" UUID,
    "id_hapus_buku" TEXT,
    "kepemilikan_sarpras_id" TEXT,
    "kd_kl" TEXT,
    "kd_satker" TEXT,
    "kd_brg" TEXT,
    "nup" INTEGER,
    "kode_eselon1" TEXT,
    "nama_eselon1" TEXT,
    "kode_sub_satker" TEXT,
    "nama_sub_satker" TEXT,
    "nama" TEXT NOT NULL,
    "panjang" DOUBLE PRECISION,
    "lebar" DOUBLE PRECISION,
    "nilai_perolehan_aset" DECIMAL(65,30),
    "jml_lantai" TEXT,
    "thn_dibangun" TEXT,
    "luas_tapak_bangunan" DECIMAL(65,30),
    "vol_pondasi_m3" DECIMAL(65,30),
    "vol_sloop_kolom_balok_m3" DECIMAL(65,30),
    "panj_kudakuda_m" DECIMAL(65,30),
    "vol_kudakuda_m3" DECIMAL(65,30),
    "panj_kaso_m" DECIMAL(65,30),
    "panj_reng_m" DECIMAL(65,30),
    "luas_tutup_atap_m2" DECIMAL(65,30),
    "kd_satker_tanah" TEXT,
    "nm_satker_tanah" TEXT,
    "kd_brg_tanah" TEXT,
    "nm_brg_tanah" TEXT,
    "nup_brg_tanah" TEXT,
    "tgl_sk_pemakai" DATE,
    "tgl_hapus_buku" DATE,
    "ket_bangunan" TEXT,
    "asal_data" TEXT,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,
    "soft_delete" TEXT,
    "last_sync" TIMESTAMP(3),
    "updater_id" UUID,
    "jenis_prasarana_id_str" TEXT,
    "id_tanah_str" TEXT,
    "sekolah_id_str" TEXT,
    "vld_count" INTEGER NOT NULL DEFAULT 0,
    "nilai_kerusakan" DECIMAL(65,30),
    "kriteria_kerusakan" TEXT,

    CONSTRAINT "bangunan_pkey" PRIMARY KEY ("id_bangunan")
);

-- CreateTable
CREATE TABLE "dapodik"."ruang" (
    "id_ruang" UUID NOT NULL,
    "jenis_prasarana_id" INTEGER NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "parent_id_ruang" UUID,
    "id_bangunan" UUID NOT NULL,
    "asal_data" TEXT,
    "kd_ruang" TEXT,
    "nm_ruang" TEXT NOT NULL,
    "lantai" TEXT,
    "panjang" DOUBLE PRECISION,
    "lebar" DOUBLE PRECISION,
    "reg_pras" TEXT,
    "kapasitas" TEXT,
    "luas_ruang" DOUBLE PRECISION,
    "luas_plester_m2" DECIMAL(65,30),
    "luas_plafon_m2" DECIMAL(65,30),
    "luas_dinding_m2" DECIMAL(65,30),
    "luas_daun_jendela_m2" DECIMAL(65,30),
    "luas_daun_pintu_m2" DECIMAL(65,30),
    "panj_kusen_m" DECIMAL(65,30),
    "luas_tutup_lantai_m2" DECIMAL(65,30),
    "panj_inst_listrik_m" DECIMAL(65,30),
    "jml_inst_listrik" TEXT,
    "panj_inst_air_m" DECIMAL(65,30),
    "jml_inst_air" TEXT,
    "panj_drainase_m" DECIMAL(65,30),
    "luas_finish_struktur_m2" DECIMAL(65,30),
    "luas_finish_plafon_m2" DECIMAL(65,30),
    "luas_finish_dinding_m2" DECIMAL(65,30),
    "luas_finish_kpj_m2" DECIMAL(65,30),
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,
    "soft_delete" TEXT,
    "last_sync" TIMESTAMP(3),
    "updater_id" UUID,
    "jenis_prasarana_id_str" TEXT,
    "id_bangunan_str" TEXT,
    "sekolah_id_str" TEXT,

    CONSTRAINT "ruang_pkey" PRIMARY KEY ("id_ruang")
);

-- CreateTable
CREATE TABLE "simak"."app_keys" (
    "id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "nama_app" TEXT NOT NULL,
    "key_api" TEXT NOT NULL,
    "key_webService" TEXT,
    "key_adminPanel" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "domain" TEXT,

    CONSTRAINT "app_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dapodik"."bidang_studi" (
    "bidang_studi_id" INTEGER NOT NULL,
    "sekolah_id" UUID,
    "kelompok_bidang_studi_id" INTEGER,
    "kode" TEXT,
    "bidang_studi" TEXT NOT NULL,
    "kelompok" TEXT,
    "jenjang_paud" TEXT,
    "jenjang_tk" TEXT,
    "jenjang_sd" TEXT,
    "jenjang_smp" TEXT,
    "jenjang_sma" TEXT,
    "jenjang_tinggi" TEXT,
    "a_sert_komp" TEXT,
    "a_sert_profesi" TEXT,
    "create_date" TIMESTAMP(3),
    "last_update" TIMESTAMP(3),
    "expired_date" TIMESTAMP(3),
    "last_sync" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bidang_studi_pkey" PRIMARY KEY ("bidang_studi_id")
);

-- CreateTable
CREATE TABLE "dapodik"."lemb_sertifikasi" (
    "kode_lemb_sert" TEXT NOT NULL,
    "sekolah_id" UUID,
    "nm_lemb_sert" TEXT NOT NULL,
    "tmt_lemb_sert" DATE,
    "ket_lemb_sert" TEXT,
    "alamat_jalan" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "nama_dusun" TEXT,
    "desa_kelurahan" TEXT,
    "kode_wilayah" TEXT,
    "kode_pos" TEXT,
    "lintang" DECIMAL(65,30),
    "bujur" DECIMAL(65,30),
    "nama" TEXT,
    "nomor_telepon" TEXT,
    "nomor_fax" TEXT,
    "email" TEXT,
    "website" TEXT,
    "create_date" TIMESTAMP(3),
    "last_update" TIMESTAMP(3),
    "expired_date" TIMESTAMP(3),
    "last_sync" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lemb_sertifikasi_pkey" PRIMARY KEY ("kode_lemb_sert")
);

-- CreateTable
CREATE TABLE "dapodik"."rwy_sertifikasi" (
    "riwayat_sertifikasi_id" UUID NOT NULL,
    "sekolah_id" UUID,
    "kode_lemb_sert" TEXT,
    "ptk_id" UUID,
    "bidang_studi_id" INTEGER,
    "id_jenis_sertifikasi" TEXT,
    "tgl_sert" DATE,
    "tgl_exp_sert" DATE,
    "nomor_sertifikat" TEXT,
    "nomer_registrasi" TEXT,
    "nomor_peserta" TEXT,
    "kualifikasi" TEXT,
    "asal_data" TEXT,
    "create_date" TIMESTAMP(3),
    "last_update" TIMESTAMP(3),
    "soft_delete" TEXT,
    "last_sync" TIMESTAMP(3),
    "updater_id" UUID,
    "ptk_id_str" TEXT,
    "bidang_studi_id_str" TEXT,
    "vld_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rwy_sertifikasi_pkey" PRIMARY KEY ("riwayat_sertifikasi_id")
);

-- CreateTable
CREATE TABLE "simak"."jenis_jadwal" (
    "jenis_jadwal_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "custom_mapel" BOOLEAN NOT NULL DEFAULT false,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jenis_jadwal_pkey" PRIMARY KEY ("jenis_jadwal_id")
);

-- CreateTable
CREATE TABLE "simak"."pengaturan_jadwal_hari" (
    "pengaturan_hari_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "jenis_jadwal_id" UUID NOT NULL,
    "hari" SMALLINT NOT NULL,
    "jam_masuk" TIME(6) NOT NULL,
    "jam_pulang" TIME(6) NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengaturan_jadwal_hari_pkey" PRIMARY KEY ("pengaturan_hari_id")
);

-- CreateTable
CREATE TABLE "simak"."pengaturan_jadwal" (
    "pengaturan_jadwal_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "jenis_jadwal_id" UUID NOT NULL,
    "hari" SMALLINT NOT NULL DEFAULT 1,
    "tipe" SMALLINT NOT NULL,
    "urutan" SMALLINT NOT NULL,
    "durasi_menit" SMALLINT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengaturan_jadwal_pkey" PRIMARY KEY ("pengaturan_jadwal_id")
);

-- CreateTable
CREATE TABLE "simak"."jadwal_pelajaran" (
    "jadwal_pelajaran_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "rombongan_belajar_id" UUID NOT NULL,
    "pembelajaran_id" UUID NOT NULL,
    "hari" SMALLINT NOT NULL,
    "urutan" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "jenis_jadwal_id" UUID NOT NULL,

    CONSTRAINT "jadwal_pelajaran_pkey" PRIMARY KEY ("jadwal_pelajaran_id")
);

-- CreateTable
CREATE TABLE "simak"."hari_libur" (
    "hari_libur_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "keterangan" TEXT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hari_libur_pkey" PRIMARY KEY ("hari_libur_id")
);

-- CreateTable
CREATE TABLE "simak"."izin" (
    "izin_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "peserta_didik_id" UUID,
    "ptk_id" UUID,
    "jenis" SMALLINT NOT NULL,
    "tanggal" DATE NOT NULL,
    "keterangan" VARCHAR(255) NOT NULL,
    "disetujui" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jam_keluar" TIMESTAMPTZ(6),
    "jam_kembali" TIMESTAMPTZ(6),
    "jam_kembali_estimasi" TIMESTAMPTZ(6),

    CONSTRAINT "izin_pkey" PRIMARY KEY ("izin_id")
);

-- CreateTable
CREATE TABLE "simak"."presensi_peserta_didik" (
    "peserta_didik_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "jam_masuk" TIMESTAMPTZ(6),
    "jam_pulang" TIMESTAMPTZ(6),
    "status_masuk" SMALLINT,
    "status_pulang" SMALLINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presensi_peserta_didik_pkey" PRIMARY KEY ("peserta_didik_id","tanggal")
);

-- CreateTable
CREATE TABLE "simak"."presensi_gtk" (
    "ptk_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "jam_masuk" TIMESTAMPTZ(6),
    "jam_pulang" TIMESTAMPTZ(6),
    "status_masuk" SMALLINT,
    "status_pulang" SMALLINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presensi_gtk_pkey" PRIMARY KEY ("ptk_id","tanggal")
);

-- CreateTable
CREATE TABLE "simak"."presensi_mapel" (
    "jadwal_pelajaran_id" UUID NOT NULL,
    "peserta_didik_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "status" SMALLINT NOT NULL,
    "waktu_absen" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "presensi_mapel_pkey" PRIMARY KEY ("jadwal_pelajaran_id","peserta_didik_id","tanggal")
);

-- CreateTable
CREATE TABLE "mandala"."mandala" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "url_mandala" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mandala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mandala"."cadisdik" (
    "cadisdik_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama_instansi" VARCHAR(255) NOT NULL,
    "alamat" TEXT,
    "email" VARCHAR(255),
    "nomor_telepon" VARCHAR(50),
    "website" VARCHAR(255),
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cadisdik_pkey" PRIMARY KEY ("cadisdik_id")
);

-- CreateTable
CREATE TABLE "mandala"."pelaporan" (
    "pelaporan_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "judul" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT,
    "tanggal_mulai" TIMESTAMPTZ(6),
    "tanggal_selesai" TIMESTAMPTZ(6),
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pelaporan_pkey" PRIMARY KEY ("pelaporan_id")
);

-- CreateTable
CREATE TABLE "mandala"."pelaporan_sekolah" (
    "pelaporan_sekolah_id" UUID NOT NULL,
    "pelaporan_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pelaporan_sekolah_pkey" PRIMARY KEY ("pelaporan_sekolah_id")
);

-- CreateTable
CREATE TABLE "mandala"."pelaporan_dokumen" (
    "pelaporan_dokumen_id" UUID NOT NULL,
    "pelaporan_sekolah_id" UUID NOT NULL,
    "nama_file" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "ukuran_file" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pelaporan_dokumen_pkey" PRIMARY KEY ("pelaporan_dokumen_id")
);

-- CreateTable
CREATE TABLE "mandala"."kategori_keperluan" (
    "kategori_keperluan_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "kategori_keperluan_pkey" PRIMARY KEY ("kategori_keperluan_id")
);

-- CreateTable
CREATE TABLE "mandala"."antrian" (
    "antrian_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "kategori_keperluan_id" UUID NOT NULL,
    "nomor_antrian" INTEGER NOT NULL,
    "nama_lengkap" VARCHAR(255) NOT NULL,
    "jabatan" VARCHAR(100),
    "unit_instansi" VARCHAR(255),
    "nomor_hp" VARCHAR(30),
    "keperluan" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "tanggal" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "antrian_pkey" PRIMARY KEY ("antrian_id")
);

-- CreateTable
CREATE TABLE "mandala"."pegawai" (
    "pegawai_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cadisdik_id" UUID NOT NULL,
    "nama_lengkap" VARCHAR(255) NOT NULL,
    "nip" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "authenticator_secret" VARCHAR(255),
    "jabatan" SMALLINT NOT NULL,
    "jenis_kelamin" SMALLINT NOT NULL,
    "nomor_telepon" VARCHAR(30),
    "foto" VARCHAR(500),
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alamat_lengkap" TEXT,
    "nik" VARCHAR(16),
    "tanggal_lahir" DATE,
    "tempat_lahir" VARCHAR(100),

    CONSTRAINT "pegawai_pkey" PRIMARY KEY ("pegawai_id")
);

-- CreateTable
CREATE TABLE "mandala"."mapping_pengawas" (
    "mapping_pengawas_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pegawai_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mapping_pengawas_pkey" PRIMARY KEY ("mapping_pengawas_id")
);

-- CreateTable
CREATE TABLE "simak"."jenis_pelanggaran" (
    "jenis_pelanggaran_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "target" SMALLINT NOT NULL,
    "poin" SMALLINT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "jenis_pelanggaran_pkey" PRIMARY KEY ("jenis_pelanggaran_id")
);

-- CreateTable
CREATE TABLE "simak"."jenis_tindak_lanjut" (
    "jenis_tindak_lanjut_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "target" SMALLINT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "jenis_tindak_lanjut_pkey" PRIMARY KEY ("jenis_tindak_lanjut_id")
);

-- CreateTable
CREATE TABLE "simak"."pelanggaran" (
    "pelanggaran_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "peserta_didik_id" UUID,
    "ptk_id" UUID,
    "jenis_pelanggaran_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "waktu" TIMESTAMPTZ(6) NOT NULL,
    "keterangan" TEXT,
    "poin" SMALLINT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "pelapor_ptk_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pelanggaran_pkey" PRIMARY KEY ("pelanggaran_id")
);

-- CreateTable
CREATE TABLE "simak"."tindak_lanjut" (
    "tindak_lanjut_id" UUID NOT NULL,
    "pelanggaran_id" UUID NOT NULL,
    "jenis_tindak_lanjut_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "keterangan" TEXT,
    "petugas_ptk_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tindak_lanjut_pkey" PRIMARY KEY ("tindak_lanjut_id")
);

-- CreateTable
CREATE TABLE "simak"."pengaturan_tagihan" (
    "pengaturan_tagihan_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "nama_tagihan" VARCHAR(150) NOT NULL,
    "nominal" BIGINT NOT NULL,
    "tipe" SMALLINT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pengaturan_tagihan_pkey" PRIMARY KEY ("pengaturan_tagihan_id")
);

-- CreateTable
CREATE TABLE "simak"."pengaturan_tagihan_rombel" (
    "pengaturan_tagihan_rombel_id" UUID NOT NULL,
    "pengaturan_tagihan_id" UUID NOT NULL,
    "rombongan_belajar_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengaturan_tagihan_rombel_pkey" PRIMARY KEY ("pengaturan_tagihan_rombel_id")
);

-- CreateTable
CREATE TABLE "simak"."spp" (
    "spp_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "peserta_didik_id" UUID NOT NULL,
    "pengaturan_tagihan_id" UUID NOT NULL,
    "nominal_tagihan" BIGINT NOT NULL,
    "nominal_terbayar" BIGINT NOT NULL DEFAULT 0,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "jatuh_tempo" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "spp_pkey" PRIMARY KEY ("spp_id")
);

-- CreateTable
CREATE TABLE "simak"."riwayat_transaksi_spp" (
    "riwayat_transaksi_spp_id" UUID NOT NULL,
    "spp_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "peserta_didik_id" UUID NOT NULL,
    "jenis_transaksi" SMALLINT NOT NULL,
    "nominal" BIGINT NOT NULL,
    "tanggal_transaksi" TIMESTAMPTZ(6) NOT NULL,
    "metode_pembayaran" SMALLINT,
    "keterangan" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riwayat_transaksi_spp_pkey" PRIMARY KEY ("riwayat_transaksi_spp_id")
);

-- CreateTable
CREATE TABLE "simak"."pengaturan_nomor_surat" (
    "pengaturan_nomor_surat_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "nama_label" VARCHAR(100) NOT NULL,
    "format_nomor" VARCHAR(255) NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pengaturan_nomor_surat_pkey" PRIMARY KEY ("pengaturan_nomor_surat_id")
);

-- CreateTable
CREATE TABLE "simak"."template_surat" (
    "template_surat_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "nama_template" VARCHAR(150) NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "ukuran_kertas" SMALLINT NOT NULL,
    "margin_atas" SMALLINT NOT NULL DEFAULT 20,
    "margin_bawah" SMALLINT NOT NULL DEFAULT 20,
    "margin_kiri" SMALLINT NOT NULL DEFAULT 20,
    "margin_kanan" SMALLINT NOT NULL DEFAULT 20,
    "konten_html" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "template_surat_pkey" PRIMARY KEY ("template_surat_id")
);

-- CreateTable
CREATE TABLE "simak"."surat_masuk" (
    "surat_masuk_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "tanggal_surat" DATE NOT NULL,
    "tanggal_diterima" DATE NOT NULL,
    "nomor_agenda" VARCHAR(50) NOT NULL,
    "nomor_surat" VARCHAR(100) NOT NULL,
    "asal_surat" VARCHAR(255) NOT NULL,
    "tujuan_disposisi" VARCHAR(255) NOT NULL,
    "perihal" VARCHAR(255) NOT NULL,
    "keterangan" TEXT,
    "file_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "surat_masuk_pkey" PRIMARY KEY ("surat_masuk_id")
);

-- CreateTable
CREATE TABLE "simak"."surat_keluar" (
    "surat_keluar_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "template_surat_id" UUID NOT NULL,
    "pengaturan_nomor_surat_id" UUID NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "peserta_didik_id" UUID,
    "ptk_id" UUID,
    "nomor_surat" VARCHAR(255),
    "tanggal_surat" DATE NOT NULL,
    "perihal" VARCHAR(255) NOT NULL,
    "isi_final_html" TEXT NOT NULL,
    "file_pdf" VARCHAR(500),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "surat_keluar_pkey" PRIMARY KEY ("surat_keluar_id")
);

-- CreateTable
CREATE TABLE "dapodik"."riwayat_pendidikan_formal" (
    "riwayat_pendidikan_formal_id" UUID NOT NULL,
    "ptk_id" UUID NOT NULL,
    "satuan_pendidikan_formal" TEXT NOT NULL,
    "fakultas" TEXT,
    "kependidikan" TEXT,
    "tahun_masuk" TEXT,
    "tahun_lulus" TEXT,
    "nim" TEXT,
    "status_kuliah" TEXT,
    "semester" TEXT,
    "ipk" TEXT,
    "prodi" TEXT,
    "id_reg_pd" TEXT,
    "bidang_studi_id_str" TEXT,
    "jenjang_pendidikan_id_str" TEXT,
    "gelar_akademik_id_str" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riwayat_pendidikan_formal_pkey" PRIMARY KEY ("riwayat_pendidikan_formal_id")
);

-- CreateTable
CREATE TABLE "mandala"."layanan" (
    "layanan_id" UUID NOT NULL,
    "nama_layanan" VARCHAR(150) NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cadisdik_id" UUID,

    CONSTRAINT "layanan_pkey" PRIMARY KEY ("layanan_id")
);

-- CreateTable
CREATE TABLE "mandala"."layanan_syarat" (
    "layanan_syarat_id" UUID NOT NULL,
    "layanan_id" UUID NOT NULL,
    "nama_syarat" VARCHAR(150) NOT NULL,
    "wajib" BOOLEAN NOT NULL DEFAULT true,
    "urutan" SMALLINT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "layanan_syarat_pkey" PRIMARY KEY ("layanan_syarat_id")
);

-- CreateTable
CREATE TABLE "mandala"."permohonan_layanan" (
    "permohonan_layanan_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "layanan_id" UUID NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "ptk_id" UUID,
    "peserta_didik_id" UUID,
    "nomor_permohonan" VARCHAR(50),
    "keterangan" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "tanggal_pengajuan" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cadisdik_id" UUID,

    CONSTRAINT "permohonan_layanan_pkey" PRIMARY KEY ("permohonan_layanan_id")
);

-- CreateTable
CREATE TABLE "mandala"."permohonan_layanan_file" (
    "permohonan_layanan_file_id" UUID NOT NULL,
    "permohonan_layanan_id" UUID NOT NULL,
    "layanan_syarat_id" UUID,
    "jenis_file" SMALLINT NOT NULL,
    "nama_file" VARCHAR(255),
    "file_url" VARCHAR(500),
    "catatan" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permohonan_layanan_file_pkey" PRIMARY KEY ("permohonan_layanan_file_id")
);

-- CreateTable
CREATE TABLE "mandala"."permohonan_layanan_log" (
    "permohonan_layanan_log_id" UUID NOT NULL,
    "permohonan_layanan_id" UUID NOT NULL,
    "pegawai_id" UUID NOT NULL,
    "status" SMALLINT NOT NULL,
    "catatan" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permohonan_layanan_log_pkey" PRIMARY KEY ("permohonan_layanan_log_id")
);

-- CreateTable
CREATE TABLE "ref"."agama" (
    "agama_id" SMALLINT NOT NULL,
    "nama" VARCHAR(25) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:54.336888'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:54.336888'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_agama" PRIMARY KEY ("agama_id")
);

-- CreateTable
CREATE TABLE "ref"."akreditasi" (
    "akreditasi_id" DECIMAL(1,0) NOT NULL,
    "nama" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:54.38847'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:54.38847'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_akreditasi" PRIMARY KEY ("akreditasi_id")
);

-- CreateTable
CREATE TABLE "ref"."akses_internet" (
    "akses_internet_id" SMALLINT NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "media" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:54.451329'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:54.451329'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_akses_internet" PRIMARY KEY ("akses_internet_id")
);

-- CreateTable
CREATE TABLE "ref"."alasan_layak_pip" (
    "id_layak_pip" DECIMAL(2,0) NOT NULL,
    "alasan_layak_pip" VARCHAR(100) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:54.544241'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:54.544241'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_alasan_layak_pip" PRIMARY KEY ("id_layak_pip")
);

-- CreateTable
CREATE TABLE "ref"."alat_transportasi" (
    "alat_transportasi_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(40) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:54.662591'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:54.662591'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_alat_transportasi" PRIMARY KEY ("alat_transportasi_id")
);

-- CreateTable
CREATE TABLE "ref"."bank" (
    "id_bank" CHAR(3) NOT NULL,
    "nm_bank" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.050256'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.050256'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_bank" PRIMARY KEY ("id_bank")
);

-- CreateTable
CREATE TABLE "ref"."batas_waktu_rapor" (
    "semester_id" CHAR(5) NOT NULL,
    "tgl_rapor_mulai" DATE NOT NULL,
    "tgl_rapor_selesai" DATE NOT NULL,
    "tgl_usm_mulai" DATE,
    "tgl_usm_selesai" DATE,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.089602'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.089602'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_batas_waktu_rapor" PRIMARY KEY ("semester_id")
);

-- CreateTable
CREATE TABLE "ref"."bentuk_lembaga" (
    "bentuk_lembaga_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_bentuk_lembaga" PRIMARY KEY ("bentuk_lembaga_id")
);

-- CreateTable
CREATE TABLE "ref"."bentuk_pendidikan" (
    "bentuk_pendidikan_id" SMALLINT NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "jenjang_paud" DECIMAL(1,0) NOT NULL,
    "jenjang_tk" DECIMAL(1,0) NOT NULL,
    "jenjang_sd" DECIMAL(1,0) NOT NULL,
    "jenjang_smp" DECIMAL(1,0) NOT NULL,
    "jenjang_sma" DECIMAL(1,0) NOT NULL,
    "jenjang_tinggi" DECIMAL(1,0) NOT NULL,
    "direktorat_pembinaan" VARCHAR(40),
    "aktif" DECIMAL(1,0) NOT NULL,
    "formalitas_pendidikan" CHAR(1) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_bentuk_pendidikan" PRIMARY KEY ("bentuk_pendidikan_id")
);

-- CreateTable
CREATE TABLE "ref"."bidang_studi" (
    "bidang_studi_id" INTEGER NOT NULL,
    "kelompok_bidang_studi_id" INTEGER,
    "kode" VARCHAR(30),
    "bidang_studi" VARCHAR(40) NOT NULL,
    "kelompok" DECIMAL(1,0) NOT NULL,
    "jenjang_paud" DECIMAL(1,0) NOT NULL,
    "jenjang_tk" DECIMAL(1,0) NOT NULL,
    "jenjang_sd" DECIMAL(1,0) NOT NULL,
    "jenjang_smp" DECIMAL(1,0) NOT NULL,
    "jenjang_sma" DECIMAL(1,0) NOT NULL,
    "jenjang_tinggi" DECIMAL(1,0) NOT NULL,
    "a_sert_komp" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "a_sert_profesi" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.273003'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.273003'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_bidang_studi" PRIMARY KEY ("bidang_studi_id")
);

-- CreateTable
CREATE TABLE "ref"."bidang_usaha" (
    "bidang_usaha_id" CHAR(10) NOT NULL,
    "nama_bidang_usaha" VARCHAR(40) NOT NULL,
    "level_bidang_usaha" VARCHAR(20),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2021-06-07 12:49:42.393489'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2021-06-07 12:49:42.393489'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_bidang_usaha" PRIMARY KEY ("bidang_usaha_id")
);

-- CreateTable
CREATE TABLE "ref"."ekstra_kurikuler" (
    "id_ekskul" INTEGER NOT NULL,
    "nm_ekskul" VARCHAR(80) NOT NULL,
    "u_sd" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "u_smp" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "u_sma" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "u_smk" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.5923'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.5923'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_ekstra_kurikuler" PRIMARY KEY ("id_ekskul")
);

-- CreateTable
CREATE TABLE "ref"."errortype" (
    "idtype" INTEGER NOT NULL,
    "kategori_error" INTEGER,
    "keterangan" VARCHAR(255),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.609506'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.609506'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_errortype" PRIMARY KEY ("idtype")
);

-- CreateTable
CREATE TABLE "ref"."fasilitas_layanan" (
    "fasilitas_layanan_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(100),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_fasilitas_layanan" PRIMARY KEY ("fasilitas_layanan_id")
);

-- CreateTable
CREATE TABLE "ref"."gelar_akademik" (
    "gelar_akademik_id" INTEGER NOT NULL,
    "kode" VARCHAR(10) NOT NULL,
    "nama" VARCHAR(40) NOT NULL,
    "posisi_gelar" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.639014'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.639014'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_gelar_akademik" PRIMARY KEY ("gelar_akademik_id")
);

-- CreateTable
CREATE TABLE "ref"."group_matpel" (
    "gmp_id" UUID NOT NULL,
    "nama_group" VARCHAR(80) NOT NULL,
    "jumlah_jam_maksimum" DECIMAL(2,0) NOT NULL,
    "jumlah_sks_maksimum" DECIMAL(2,0) NOT NULL DEFAULT 0,
    "kurikulum_id" SMALLINT NOT NULL,
    "tingkat_pendidikan_id" DECIMAL(2,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.667262'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.667262'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_group_matpel" PRIMARY KEY ("gmp_id")
);

-- CreateTable
CREATE TABLE "ref"."jabatan_fungsional" (
    "jabatan_fungsional_id" DECIMAL(5,0) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.8868'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.8868'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jabatan_fungsional" PRIMARY KEY ("jabatan_fungsional_id")
);

-- CreateTable
CREATE TABLE "ref"."jabatan_ptk" (
    "jabatan_ptk_id" DECIMAL(5,0) NOT NULL,
    "jenis_ptk_id" DECIMAL(2,0) NOT NULL,
    "jabatan_ptk" VARCHAR(100) NOT NULL,
    "jabatan_kode" VARCHAR(20),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2024-07-09 17:57:03.979'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2024-07-09 17:57:03.979'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jabatan_ptk" PRIMARY KEY ("jabatan_ptk_id")
);

-- CreateTable
CREATE TABLE "ref"."jabatan_tugas_ptk" (
    "jabatan_ptk_id" DECIMAL(5,0) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "jabatan_utama" DECIMAL(1,0) NOT NULL,
    "tugas_tambahan_guru" DECIMAL(1,0) NOT NULL,
    "jumlah_jam_diakui" DECIMAL(2,0),
    "harus_refer_unit_org" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.919829'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:55.919829'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jabatan_tugas_ptk" PRIMARY KEY ("jabatan_ptk_id")
);

-- CreateTable
CREATE TABLE "ref"."jadwal_paud" (
    "jadwal_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "kesehatan" DECIMAL(1,0) NOT NULL,
    "pamts" DECIMAL(1,0) NOT NULL,
    "ddtk" DECIMAL(1,0) NOT NULL,
    "freq_parenting" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jadwal_paud" PRIMARY KEY ("jadwal_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_akt_pd" (
    "id_jns_akt_pd" DECIMAL(3,0) NOT NULL,
    "nm_jns_akt_pd" VARCHAR(40) NOT NULL,
    "ket_jns_akt_pd" VARCHAR(100),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.093968'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.093968'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_akt_pd" PRIMARY KEY ("id_jns_akt_pd")
);

-- CreateTable
CREATE TABLE "ref"."jenis_aktivitas_kepanitiaan" (
    "id_jns_akt_pan" DECIMAL(4,0) NOT NULL,
    "nm_jns_akt_pan" VARCHAR(100) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.111447'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.111447'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_aktivitas_kepanitiaan" PRIMARY KEY ("id_jns_akt_pan")
);

-- CreateTable
CREATE TABLE "ref"."jenis_bantuan" (
    "jenis_bantuan_id" INTEGER NOT NULL,
    "nama" VARCHAR(50),
    "untuk_sekolah" DECIMAL(1,0) NOT NULL,
    "untuk_pd" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.126178'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.126178'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_bantuan" PRIMARY KEY ("jenis_bantuan_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_beasiswa" (
    "jenis_beasiswa_id" INTEGER NOT NULL,
    "sumber_dana_id" DECIMAL(3,0) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "untuk_pd" DECIMAL(1,0) NOT NULL,
    "untuk_ptk" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.141302'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.141302'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_beasiswa" PRIMARY KEY ("jenis_beasiswa_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_cita" (
    "id_cita" DECIMAL(5,0) NOT NULL,
    "nm_cita" VARCHAR(150) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.161066'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.161066'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_cita" PRIMARY KEY ("id_cita")
);

-- CreateTable
CREATE TABLE "ref"."jenis_diklat" (
    "jenis_diklat_id" INTEGER NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.179474'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.179474'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_diklat" PRIMARY KEY ("jenis_diklat_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_gugus" (
    "jenis_gugus_id" DECIMAL(3,0) NOT NULL,
    "jenis_gugus" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.196371'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.196371'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_gugus" PRIMARY KEY ("jenis_gugus_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_hapus_buku" (
    "id_hapus_buku" CHAR(1) NOT NULL,
    "ket_hapus_buku" VARCHAR(80) NOT NULL,
    "u_prasarana" DECIMAL(1,0) NOT NULL,
    "u_sarana" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.21023'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.21023'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_hapus_buku" PRIMARY KEY ("id_hapus_buku")
);

-- CreateTable
CREATE TABLE "ref"."jenis_hobby" (
    "id_hobby" DECIMAL(5,0) NOT NULL,
    "nm_hobby" VARCHAR(100) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.225744'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.225744'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_hobby" PRIMARY KEY ("id_hobby")
);

-- CreateTable
CREATE TABLE "ref"."jenis_ijazah" (
    "jenis_ijazah_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2024-06-14 20:05:29.730438'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2024-06-14 20:05:29.730438'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_ijazah" PRIMARY KEY ("jenis_ijazah_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_keluar" (
    "jenis_keluar_id" CHAR(1) NOT NULL,
    "ket_keluar" VARCHAR(40) NOT NULL,
    "keluar_pd" DECIMAL(1,0) NOT NULL,
    "keluar_ptk" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.240319'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.240319'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_keluar" PRIMARY KEY ("jenis_keluar_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_kepanitiaan" (
    "id_jns_panitia" INTEGER NOT NULL,
    "nm_jns_panitia" VARCHAR(100) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.258699'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.258699'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_kepanitiaan" PRIMARY KEY ("id_jns_panitia")
);

-- CreateTable
CREATE TABLE "ref"."jenis_kerusakan" (
    "kerusakan_id" DECIMAL(2,0) NOT NULL,
    "klasifikasi" VARCHAR(30) NOT NULL,
    "u_bangunan" DECIMAL(1,0) NOT NULL,
    "u_ruang" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2022-06-28 18:43:46.097'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2022-06-28 18:43:46.097'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_kerusakan" PRIMARY KEY ("kerusakan_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_kesejahteraan" (
    "jenis_kesejahteraan_id" INTEGER NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "penyelenggara" VARCHAR(100) NOT NULL,
    "u_ptk" DECIMAL(1,0) NOT NULL DEFAULT 1,
    "u_pd" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.27441'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.27441'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_kesejahteraan" PRIMARY KEY ("jenis_kesejahteraan_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_koneksi" (
    "jenis_koneksi_id" DECIMAL(2,0) NOT NULL,
    "jenis_koneksi" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2025-12-19 10:10:33.28'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2025-12-19 10:10:33.28'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_koneksi" PRIMARY KEY ("jenis_koneksi_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_ks" (
    "id_jns_ks" DECIMAL(6,0) NOT NULL,
    "nm_jns_ks" VARCHAR(100) NOT NULL,
    "ket_jns_ks" VARCHAR(250),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.295365'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.295365'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_ks" PRIMARY KEY ("id_jns_ks")
);

-- CreateTable
CREATE TABLE "ref"."jenis_layanan_internet" (
    "jenis_layanan_internet_id" DECIMAL(2,0) NOT NULL,
    "jenis_layanan" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2025-12-19 10:10:33.296'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2025-12-19 10:10:33.296'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_layanan_internet" PRIMARY KEY ("jenis_layanan_internet_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_lembaga" (
    "jenis_lembaga_id" DECIMAL(5,0) NOT NULL,
    "nama" VARCHAR(80) NOT NULL,
    "tempat_pengawas" DECIMAL(1,0) NOT NULL,
    "simpul_pendataan" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.310318'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.310318'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_lembaga" PRIMARY KEY ("jenis_lembaga_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_lk" (
    "id_jenis_lk" CHAR(6) NOT NULL,
    "nm_jenis_lk" VARCHAR(160) NOT NULL,
    "ket_jenis_lk" VARCHAR(200),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.326095'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.326095'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_lk" PRIMARY KEY ("id_jenis_lk")
);

-- CreateTable
CREATE TABLE "ref"."jenis_pendaftaran" (
    "jenis_pendaftaran_id" DECIMAL(1,0) NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "daftar_sekolah" DECIMAL(1,0) NOT NULL,
    "daftar_rombel" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.341717'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.341717'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_pendaftaran" PRIMARY KEY ("jenis_pendaftaran_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_penghargaan" (
    "jenis_penghargaan_id" INTEGER NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.354432'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.354432'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_penghargaan" PRIMARY KEY ("jenis_penghargaan_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_pesan" (
    "jenis_pesan_id" SMALLINT NOT NULL,
    "kelompok" VARCHAR(25) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_date" TIMESTAMP(6),

    CONSTRAINT "pk_jenis_pesan" PRIMARY KEY ("jenis_pesan_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_prasarana" (
    "jenis_prasarana_id" INTEGER NOT NULL,
    "nama" VARCHAR(60) NOT NULL,
    "a_unit_organisasi" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "a_tanah" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "a_bangunan" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "a_ruang" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "a_sub" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2021-06-07 12:49:42.393489'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2021-06-07 12:49:42.393489'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_prasarana" PRIMARY KEY ("jenis_prasarana_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_prestasi" (
    "jenis_prestasi_id" INTEGER NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.387147'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.387147'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_prestasi" PRIMARY KEY ("jenis_prestasi_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_ptk" (
    "jenis_ptk_id" DECIMAL(2,0) NOT NULL,
    "jenis_ptk" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2024-06-14 20:05:29.730438'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2024-06-14 20:05:29.730438'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_ptk" PRIMARY KEY ("jenis_ptk_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_rombel" (
    "jenis_rombel" DECIMAL(2,0) NOT NULL,
    "nm_jenis_rombel" VARCHAR(80) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.423206'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.423206'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_rombel" PRIMARY KEY ("jenis_rombel")
);

-- CreateTable
CREATE TABLE "ref"."jenis_sarana" (
    "jenis_sarana_id" INTEGER NOT NULL,
    "nama" VARCHAR(60) NOT NULL,
    "kelompok" VARCHAR(50),
    "perlu_penempatan" DECIMAL(1,0) NOT NULL,
    "keterangan" VARCHAR(128),
    "a_alat" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "a_angkutan" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "spm_qty_min_per_siswa" DECIMAL(3,1) NOT NULL DEFAULT -1,
    "spm_qty_min_per_sekolah" DECIMAL(4,0) NOT NULL DEFAULT -1,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.437048'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.437048'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_sarana" PRIMARY KEY ("jenis_sarana_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_sertifikasi" (
    "id_jenis_sertifikasi" DECIMAL(3,0) NOT NULL,
    "jenis_sertifikasi" VARCHAR(30) NOT NULL,
    "prof_guru" DECIMAL(1,0) NOT NULL,
    "kepala_sekolah" DECIMAL(1,0) NOT NULL,
    "laboran" DECIMAL(1,0) NOT NULL,
    "a_pd" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "kebutuhan_khusus_id" INTEGER NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.450311'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.450311'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_sertifikasi" PRIMARY KEY ("id_jenis_sertifikasi")
);

-- CreateTable
CREATE TABLE "ref"."jenis_test" (
    "jenis_test_id" DECIMAL(3,0) NOT NULL,
    "jenis_test" VARCHAR(30) NOT NULL,
    "keterangan" VARCHAR(80),
    "nilai_maks" DECIMAL(6,2) NOT NULL,
    "ket_skor1" VARCHAR(80),
    "ket_skor2" VARCHAR(80),
    "ket_skor3" VARCHAR(80),
    "ket_skor4" VARCHAR(80),
    "ket_skor5" VARCHAR(80),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.474751'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.474751'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_test" PRIMARY KEY ("jenis_test_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_tinggal" (
    "jenis_tinggal_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.492113'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.492113'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_tinggal" PRIMARY KEY ("jenis_tinggal_id")
);

-- CreateTable
CREATE TABLE "ref"."jenis_tunjangan" (
    "jenis_tunjangan_id" INTEGER NOT NULL,
    "nama" VARCHAR(50),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.508239'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.508239'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenis_tunjangan" PRIMARY KEY ("jenis_tunjangan_id")
);

-- CreateTable
CREATE TABLE "ref"."jenjang_kepengawasan" (
    "jenjang_kepengawasan_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "jenjang_kepengawasan_tk" DECIMAL(1,0) NOT NULL,
    "jenjang_kepengawasan_sd" DECIMAL(1,0) NOT NULL,
    "jenjang_kepengawasan_smp" DECIMAL(1,0) NOT NULL,
    "jenjang_kepengawasan_sma" DECIMAL(1,0) NOT NULL,
    "jenjang_kepengawasan_smk" DECIMAL(1,0) NOT NULL,
    "jenjang_kepengawasan_slb" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.524043'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.524043'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenjang_kepengawasan" PRIMARY KEY ("jenjang_kepengawasan_id")
);

-- CreateTable
CREATE TABLE "ref"."jenjang_pendidikan" (
    "jenjang_pendidikan_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(25) NOT NULL,
    "jenjang_lembaga" DECIMAL(1,0) NOT NULL,
    "jenjang_orang" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.540627'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.540627'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jenjang_pendidikan" PRIMARY KEY ("jenjang_pendidikan_id")
);

-- CreateTable
CREATE TABLE "ref"."jurusan" (
    "jurusan_id" VARCHAR(25) NOT NULL,
    "nama_jurusan" VARCHAR(100) NOT NULL,
    "untuk_sma" DECIMAL(1,0) NOT NULL,
    "untuk_smk" DECIMAL(1,0) NOT NULL,
    "untuk_pt" DECIMAL(1,0) NOT NULL,
    "untuk_slb" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "untuk_smklb" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "jenjang_pendidikan_id" DECIMAL(2,0),
    "jurusan_induk" VARCHAR(25),
    "level_bidang_id" VARCHAR(5) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.576787'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.576787'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_jurusan" PRIMARY KEY ("jurusan_id")
);

-- CreateTable
CREATE TABLE "ref"."kategori_desa" (
    "kategori_desa_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL,
    "last_update" TIMESTAMP(6) NOT NULL,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "kategori_desa_pkey" PRIMARY KEY ("kategori_desa_id")
);

-- CreateTable
CREATE TABLE "ref"."kategori_tk" (
    "kategori_tk_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_kategori_tk" PRIMARY KEY ("kategori_tk_id")
);

-- CreateTable
CREATE TABLE "ref"."keahlian_laboratorium" (
    "keahlian_laboratorium_id" SMALLINT NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.699905'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.699905'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_keahlian_laboratorium" PRIMARY KEY ("keahlian_laboratorium_id")
);

-- CreateTable
CREATE TABLE "ref"."kebutuhan_khusus" (
    "kebutuhan_khusus_id" INTEGER NOT NULL,
    "kebutuhan_khusus" VARCHAR(40) NOT NULL,
    "kk_a" DECIMAL(1,0) NOT NULL,
    "kk_b" DECIMAL(1,0) NOT NULL,
    "kk_c" DECIMAL(1,0) NOT NULL,
    "kk_c1" DECIMAL(1,0) NOT NULL,
    "kk_d" DECIMAL(1,0) NOT NULL,
    "kk_d1" DECIMAL(1,0) NOT NULL,
    "kk_e" DECIMAL(1,0) NOT NULL,
    "kk_f" DECIMAL(1,0) NOT NULL,
    "kk_h" DECIMAL(1,0) NOT NULL,
    "kk_i" DECIMAL(1,0) NOT NULL,
    "kk_j" DECIMAL(1,0) NOT NULL,
    "kk_k" DECIMAL(1,0) NOT NULL,
    "kk_n" DECIMAL(1,0) NOT NULL,
    "kk_o" DECIMAL(1,0) NOT NULL,
    "kk_p" DECIMAL(1,0) NOT NULL,
    "kk_q" DECIMAL(1,0) NOT NULL,
    "untuk_lembaga" DECIMAL(1,0) NOT NULL DEFAULT 1,
    "untuk_ptk" DECIMAL(1,0) NOT NULL DEFAULT 1,
    "untuk_pd" DECIMAL(1,0) NOT NULL DEFAULT 1,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.714414'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.714414'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_kebutuhan_khusus" PRIMARY KEY ("kebutuhan_khusus_id")
);

-- CreateTable
CREATE TABLE "ref"."kelompok_bidang" (
    "level_bidang_id" VARCHAR(5) NOT NULL,
    "nama_level_bidang" VARCHAR(100) NOT NULL,
    "untuk_sma" DECIMAL(1,0) NOT NULL,
    "untuk_smk" DECIMAL(1,0) NOT NULL,
    "untuk_pt" DECIMAL(1,0) NOT NULL,
    "untuk_slb" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "untuk_smklb" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "level_bidang_induk" VARCHAR(5),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.763199'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.763199'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_kelompok_bidang" PRIMARY KEY ("level_bidang_id")
);

-- CreateTable
CREATE TABLE "ref"."kelompok_usaha" (
    "kelompok_usaha_id" CHAR(8) NOT NULL,
    "nama_kelompok_usaha" VARCHAR(60) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.783705'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.783705'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_kelompok_usaha" PRIMARY KEY ("kelompok_usaha_id")
);

-- CreateTable
CREATE TABLE "ref"."klasifikasi_lembaga" (
    "klasifikasi_lembaga_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_klasifikasi_lembaga" PRIMARY KEY ("klasifikasi_lembaga_id")
);

-- CreateTable
CREATE TABLE "ref"."kompetensi" (
    "id_komp" UUID NOT NULL,
    "desk" TEXT NOT NULL,
    "nmr" VARCHAR(5) NOT NULL,
    "kelompok" CHAR(1) NOT NULL,
    "versi" INTEGER NOT NULL,
    "id_inti_dasar" UUID,
    "level_komp" DECIMAL(3,0),
    "tingkat_pendidikan_id" DECIMAL(2,0) NOT NULL,
    "kurikulum_id" SMALLINT NOT NULL,
    "mata_pelajaran_id" INTEGER NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.909326'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.909326'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_kompetensi" PRIMARY KEY ("id_komp")
);

-- CreateTable
CREATE TABLE "ref"."kurikulum" (
    "kurikulum_id" SMALLINT NOT NULL,
    "nama_kurikulum" VARCHAR(120) NOT NULL,
    "mulai_berlaku" DATE NOT NULL,
    "sistem_sks" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "total_sks" DECIMAL(3,0) NOT NULL DEFAULT 0,
    "jenjang_pendidikan_id" DECIMAL(2,0) NOT NULL,
    "jurusan_id" VARCHAR(25),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.948018'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:56.948018'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_kurikulum" PRIMARY KEY ("kurikulum_id")
);

-- CreateTable
CREATE TABLE "ref"."lemb_sertifikasi" (
    "kode_lemb_sert" DECIMAL(5,0) NOT NULL,
    "nm_lemb_sert" VARCHAR(120) NOT NULL,
    "tmt_lemb_sert" DATE NOT NULL,
    "ket_lemb_sert" VARCHAR(250),
    "alamat_jalan" VARCHAR(80) NOT NULL,
    "rt" DECIMAL(2,0),
    "rw" DECIMAL(2,0),
    "nama_dusun" VARCHAR(60),
    "desa_kelurahan" VARCHAR(60) NOT NULL,
    "kode_wilayah" CHAR(8) NOT NULL,
    "kode_pos" CHAR(5),
    "lintang" DECIMAL(18,12),
    "bujur" DECIMAL(18,12),
    "nama" VARCHAR(100) NOT NULL,
    "nomor_telepon" VARCHAR(20),
    "nomor_fax" VARCHAR(20),
    "email" VARCHAR(60),
    "website" VARCHAR(100),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_lemb_sertifikasi" PRIMARY KEY ("kode_lemb_sert")
);

-- CreateTable
CREATE TABLE "ref"."lembaga_akreditasi" (
    "la_id" CHAR(5) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "la_tgl_mulai" DATE NOT NULL,
    "la_ket" VARCHAR(250),
    "alamat_jalan" VARCHAR(80) NOT NULL,
    "rt" DECIMAL(2,0),
    "rw" DECIMAL(2,0),
    "nama_dusun" VARCHAR(60),
    "desa_kelurahan" VARCHAR(60) NOT NULL,
    "kode_wilayah" CHAR(8) NOT NULL,
    "kode_pos" CHAR(5),
    "lintang" DECIMAL(18,12),
    "bujur" DECIMAL(18,12),
    "nomor_telepon" VARCHAR(20),
    "nomor_fax" VARCHAR(20),
    "email" VARCHAR(60),
    "website" VARCHAR(100),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_lembaga_akreditasi" PRIMARY KEY ("la_id")
);

-- CreateTable
CREATE TABLE "ref"."lembaga_pengangkat" (
    "lembaga_pengangkat_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.154059'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.154059'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_lembaga_pengangkat" PRIMARY KEY ("lembaga_pengangkat_id")
);

-- CreateTable
CREATE TABLE "ref"."level_wilayah" (
    "id_level_wilayah" SMALLINT NOT NULL,
    "level_wilayah" VARCHAR(15),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.177404'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.177404'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_level_wilayah" PRIMARY KEY ("id_level_wilayah")
);

-- CreateTable
CREATE TABLE "ref"."map_bidang_mata_pelajaran" (
    "mata_pelajaran_id" INTEGER NOT NULL,
    "bidang_studi_id" INTEGER NOT NULL,
    "sesuai" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.245824'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.245824'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_map_bidang_mata_pelajaran" PRIMARY KEY ("mata_pelajaran_id","bidang_studi_id")
);

-- CreateTable
CREATE TABLE "ref"."mata_pelajaran" (
    "mata_pelajaran_id" INTEGER NOT NULL,
    "nama" VARCHAR(80) NOT NULL,
    "pilihan_sekolah" DECIMAL(1,0) NOT NULL,
    "pilihan_buku" DECIMAL(1,0) NOT NULL,
    "pilihan_kepengawasan" DECIMAL(1,0) NOT NULL,
    "pilihan_evaluasi" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "jurusan_id" VARCHAR(25),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.296154'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.296154'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_mata_pelajaran" PRIMARY KEY ("mata_pelajaran_id")
);

-- CreateTable
CREATE TABLE "ref"."mata_pelajaran_kurikulum" (
    "kurikulum_id" SMALLINT NOT NULL,
    "mata_pelajaran_id" INTEGER NOT NULL,
    "tingkat_pendidikan_id" DECIMAL(2,0) NOT NULL,
    "jumlah_jam" DECIMAL(2,0) NOT NULL,
    "jumlah_jam_maksimum" DECIMAL(2,0) NOT NULL,
    "status_di_kurikulum" DECIMAL(2,0) NOT NULL,
    "wajib" DECIMAL(1,0) NOT NULL,
    "sks" DECIMAL(2,0) NOT NULL DEFAULT 0,
    "a_peminatan" DECIMAL(1,0) NOT NULL,
    "area_kompetensi" CHAR(1) NOT NULL DEFAULT '*',
    "gmp_id" UUID,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2022-06-28 18:45:38.08'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2022-06-28 18:45:38.08'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_mata_pelajaran_kurikulum" PRIMARY KEY ("kurikulum_id","mata_pelajaran_id","tingkat_pendidikan_id")
);

-- CreateTable
CREATE TABLE "ref"."mst_wilayah" (
    "kode_wilayah" CHAR(8) NOT NULL,
    "nama" VARCHAR(60) NOT NULL,
    "id_level_wilayah" SMALLINT NOT NULL,
    "mst_kode_wilayah" CHAR(8),
    "negara_id" CHAR(2) NOT NULL,
    "asal_wilayah" CHAR(8),
    "kode_bps" CHAR(7),
    "kode_dagri" CHAR(10),
    "kode_keu" CHAR(10),
    "id_prov" CHAR(8),
    "id_kabkota" CHAR(8),
    "id_kec" CHAR(8),
    "a_desa" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "a_kelurahan" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "a_35" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "a_urban" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "kategori_desa_id" DECIMAL(2,0),
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_mst_wilayah" PRIMARY KEY ("kode_wilayah")
);

-- CreateTable
CREATE TABLE "ref"."mulok" (
    "kode_wilayah" CHAR(8) NOT NULL,
    "mata_pelajaran_id" INTEGER NOT NULL,
    "sk_mulok" VARCHAR(80) NOT NULL,
    "tgl_sk_mulok" DATE NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.517159'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.517159'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_mulok" PRIMARY KEY ("kode_wilayah","mata_pelajaran_id")
);

-- CreateTable
CREATE TABLE "ref"."negara" (
    "negara_id" CHAR(2) NOT NULL,
    "nama" VARCHAR(45) NOT NULL,
    "luar_negeri" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.541192'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.541192'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_negara" PRIMARY KEY ("negara_id")
);

-- CreateTable
CREATE TABLE "ref"."pangkat_golongan" (
    "pangkat_golongan_id" DECIMAL(2,0) NOT NULL,
    "kode" VARCHAR(5) NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.659433'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.659433'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_pangkat_golongan" PRIMARY KEY ("pangkat_golongan_id")
);

-- CreateTable
CREATE TABLE "ref"."pekerjaan" (
    "pekerjaan_id" INTEGER NOT NULL,
    "nama" VARCHAR(25),
    "a_wirausaha" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "a_pejabat_publik" DECIMAL(1,0) NOT NULL DEFAULT 0,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.719291'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.719291'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_pekerjaan" PRIMARY KEY ("pekerjaan_id")
);

-- CreateTable
CREATE TABLE "ref"."pemakai_prasarana" (
    "jenis_prasarana_id" INTEGER NOT NULL,
    "jurusan_id" VARCHAR(25) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.737537'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.737537'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,
    "jml_std_min" DECIMAL(5,0) NOT NULL DEFAULT 0,

    CONSTRAINT "pk_pemakai_prasarana" PRIMARY KEY ("jenis_prasarana_id","jurusan_id")
);

-- CreateTable
CREATE TABLE "ref"."pemakai_sarana" (
    "jenis_sarana_id" INTEGER NOT NULL,
    "jurusan_id" VARCHAR(25) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.7689'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:57.7689'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_pemakai_sarana" PRIMARY KEY ("jenis_sarana_id","jurusan_id")
);

-- CreateTable
CREATE TABLE "ref"."penghasilan" (
    "penghasilan_id" INTEGER NOT NULL,
    "nama" VARCHAR(40) NOT NULL,
    "batas_bawah" INTEGER NOT NULL,
    "batas_atas" INTEGER NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:58.035529'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:58.035529'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_penghasilan" PRIMARY KEY ("penghasilan_id")
);

-- CreateTable
CREATE TABLE "ref"."sasaran_blockgrant" (
    "sasaran_blockgrant_id" INTEGER NOT NULL,
    "tahun_ajaran_id" DECIMAL(4,0) NOT NULL,
    "jenis_sarana_id" INTEGER,
    "jenis_prasarana_id" INTEGER,
    "jenis_bantuan_id" INTEGER NOT NULL,
    "sumber_dana_id" DECIMAL(3,0) NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2025-07-08 14:22:35.382'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2025-07-08 14:22:35.382'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_sasaran_blockgrant" PRIMARY KEY ("sasaran_blockgrant_id")
);

-- CreateTable
CREATE TABLE "ref"."semester" (
    "semester_id" CHAR(5) NOT NULL,
    "tahun_ajaran_id" DECIMAL(4,0) NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "semester" DECIMAL(1,0) NOT NULL,
    "periode_aktif" DECIMAL(1,0) NOT NULL,
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.238151'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.238151'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_semester" PRIMARY KEY ("semester_id")
);

-- CreateTable
CREATE TABLE "ref"."sertifikasi_iso" (
    "sertifikasi_iso_id" SMALLINT NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.265833'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.265833'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_sertifikasi_iso" PRIMARY KEY ("sertifikasi_iso_id")
);

-- CreateTable
CREATE TABLE "ref"."standar_sarana" (
    "id_std_sarana" UUID NOT NULL,
    "jenis_prasarana_id" INTEGER NOT NULL,
    "jenis_sarana_id" INTEGER NOT NULL,
    "jurusan_id" VARCHAR(25),
    "bentuk_pendidikan_id" SMALLINT NOT NULL,
    "a_harus_ada" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.319366'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.319366'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_standar_sarana" PRIMARY KEY ("id_std_sarana")
);

-- CreateTable
CREATE TABLE "ref"."status_anak" (
    "status_anak_id" DECIMAL(1,0) NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.359947'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.359947'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_status_anak" PRIMARY KEY ("status_anak_id")
);

-- CreateTable
CREATE TABLE "ref"."status_di_kurikulum" (
    "status_di_kurikulum" DECIMAL(2,0) NOT NULL,
    "ket_stat_di_kurikulum" VARCHAR(40) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.378364'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.378364'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_status_di_kurikulum" PRIMARY KEY ("status_di_kurikulum")
);

-- CreateTable
CREATE TABLE "ref"."status_keaktifan_pegawai" (
    "status_keaktifan_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.391749'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.391749'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_status_keaktifan_pegawai" PRIMARY KEY ("status_keaktifan_id")
);

-- CreateTable
CREATE TABLE "ref"."status_kepegawaian" (
    "status_kepegawaian_id" SMALLINT NOT NULL,
    "nama" VARCHAR(30) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.408033'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.408033'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_status_kepegawaian" PRIMARY KEY ("status_kepegawaian_id")
);

-- CreateTable
CREATE TABLE "ref"."status_kepemilikan" (
    "status_kepemilikan_id" DECIMAL(1,0) NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.426803'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.426803'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_status_kepemilikan" PRIMARY KEY ("status_kepemilikan_id")
);

-- CreateTable
CREATE TABLE "ref"."status_kepemilikan_sarpras" (
    "kepemilikan_sarpras_id" DECIMAL(1,0) NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.444872'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.444872'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_status_kepemilikan_sarpras" PRIMARY KEY ("kepemilikan_sarpras_id")
);

-- CreateTable
CREATE TABLE "ref"."sumber_air" (
    "sumber_air_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(25) NOT NULL,
    "sumber_air" DECIMAL(1,0),
    "sumber_minum" DECIMAL(1,0),
    "create_date" TIMESTAMP(6),
    "last_update" TIMESTAMP(6),
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6),

    CONSTRAINT "pk_sumber_air" PRIMARY KEY ("sumber_air_id")
);

-- CreateTable
CREATE TABLE "ref"."sumber_dana" (
    "sumber_dana_id" DECIMAL(3,0) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.482201'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.482201'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_sumber_dana" PRIMARY KEY ("sumber_dana_id")
);

-- CreateTable
CREATE TABLE "ref"."sumber_dana_sekolah" (
    "sumber_dana_sekolah_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2020-04-16 09:40:03.422677'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_sumber_dana_sekolah" PRIMARY KEY ("sumber_dana_sekolah_id")
);

-- CreateTable
CREATE TABLE "ref"."sumber_gaji" (
    "sumber_gaji_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(40) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.50086'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.50086'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_sumber_gaji" PRIMARY KEY ("sumber_gaji_id")
);

-- CreateTable
CREATE TABLE "ref"."sumber_listrik" (
    "sumber_listrik_id" DECIMAL(2,0) NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.52024'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.52024'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_sumber_listrik" PRIMARY KEY ("sumber_listrik_id")
);

-- CreateTable
CREATE TABLE "ref"."table_sync" (
    "table_name" VARCHAR(30) NOT NULL,
    "table_alias" VARCHAR(50),
    "sync_type" CHAR(1) NOT NULL,
    "sync_seq" DECIMAL(4,0) NOT NULL,
    "kolom_kecuali" VARCHAR(200),
    "table_status" SMALLINT,
    "table_ket" VARCHAR(100),
    "jml_thread" SMALLINT DEFAULT 5,
    "baris_per_thread" INTEGER DEFAULT 500,
    "order_ekstra" VARCHAR(100),
    "a_table_aktif" DECIMAL(1,0) NOT NULL DEFAULT 1,

    CONSTRAINT "pk_table_sync" PRIMARY KEY ("table_name")
);

-- CreateTable
CREATE TABLE "ref"."tahun_ajaran" (
    "tahun_ajaran_id" DECIMAL(4,0) NOT NULL,
    "nama" VARCHAR(10) NOT NULL,
    "periode_aktif" DECIMAL(1,0) NOT NULL,
    "tanggal_mulai" DATE NOT NULL,
    "tanggal_selesai" DATE NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.628052'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.628052'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_tahun_ajaran" PRIMARY KEY ("tahun_ajaran_id")
);

-- CreateTable
CREATE TABLE "ref"."template_rapor" (
    "template_id" UUID NOT NULL,
    "mata_pelajaran_id" INTEGER NOT NULL,
    "no_urut" DECIMAL(3,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.73656'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.73656'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_template_rapor" PRIMARY KEY ("template_id","mata_pelajaran_id")
);

-- CreateTable
CREATE TABLE "ref"."template_un" (
    "template_id" UUID NOT NULL,
    "jenjang_pendidikan_id" DECIMAL(2,0) NOT NULL,
    "tahun_ajaran_id" DECIMAL(4,0) NOT NULL,
    "jurusan_id" VARCHAR(25),
    "template_ket" VARCHAR(250),
    "mp1_id" INTEGER,
    "mp2_id" INTEGER,
    "mp3_id" INTEGER,
    "mp4_id" INTEGER,
    "mp5_id" INTEGER,
    "mp6_id" INTEGER,
    "mp7_id" INTEGER,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.768528'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.768528'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_template_un" PRIMARY KEY ("template_id")
);

-- CreateTable
CREATE TABLE "ref"."tetangga_kabkota" (
    "kode_wilayah1" CHAR(8) NOT NULL,
    "kode_wilayah2" CHAR(8) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.838962'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.838962'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_tetangga_kabkota" PRIMARY KEY ("kode_wilayah1","kode_wilayah2")
);

-- CreateTable
CREATE TABLE "ref"."tingkat_pendidikan" (
    "tingkat_pendidikan_id" DECIMAL(2,0) NOT NULL,
    "kode" VARCHAR(5) NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "jenjang_pendidikan_id" DECIMAL(2,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.88044'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.88044'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_tingkat_pendidikan" PRIMARY KEY ("tingkat_pendidikan_id")
);

-- CreateTable
CREATE TABLE "ref"."tingkat_penghargaan" (
    "tingkat_penghargaan_id" INTEGER NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.897153'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.897153'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_tingkat_penghargaan" PRIMARY KEY ("tingkat_penghargaan_id")
);

-- CreateTable
CREATE TABLE "ref"."tingkat_prestasi" (
    "tingkat_prestasi_id" INTEGER NOT NULL,
    "nama" VARCHAR(50) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.911154'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:29:59.911154'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_tingkat_prestasi" PRIMARY KEY ("tingkat_prestasi_id")
);

-- CreateTable
CREATE TABLE "ref"."variabel" (
    "variabel_id" UUID NOT NULL,
    "nama" VARCHAR(500) NOT NULL,
    "header" VARCHAR(500),
    "urut" SMALLINT,
    "string_pattern" VARCHAR(500),
    "keterangan" VARCHAR(500),
    "jenis_variabel" CHAR(1) NOT NULL,
    "u_paud" DECIMAL(1,0) NOT NULL,
    "u_sd" DECIMAL(1,0) NOT NULL,
    "u_smp" DECIMAL(1,0) NOT NULL,
    "u_sma" DECIMAL(1,0) NOT NULL,
    "u_smk" DECIMAL(1,0) NOT NULL,
    "is_tampil" DECIMAL(1,0) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2022-06-28 18:58:39.297'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2022-06-28 18:58:39.297'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_variabel" PRIMARY KEY ("variabel_id")
);

-- CreateTable
CREATE TABLE "ref"."variabel_value" (
    "variabel_id" CHAR(36) NOT NULL,
    "value_id" INTEGER NOT NULL,
    "value_name" VARCHAR(200) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL,
    "last_update" TIMESTAMP(6) NOT NULL,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL
);

-- CreateTable
CREATE TABLE "ref"."waktu_penyelenggaraan" (
    "waktu_penyelenggaraan_id" DECIMAL(1,0) NOT NULL,
    "nama" VARCHAR(20) NOT NULL,
    "create_date" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:30:01.189185'::timestamp without time zone,
    "last_update" TIMESTAMP(6) NOT NULL DEFAULT '2019-09-10 14:30:01.189185'::timestamp without time zone,
    "expired_date" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6) NOT NULL DEFAULT '1901-01-01 00:00:00'::timestamp without time zone,

    CONSTRAINT "pk_waktu_penyelenggaraan" PRIMARY KEY ("waktu_penyelenggaraan_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sekolah_npsn_key" ON "dapodik"."sekolah"("npsn");

-- CreateIndex
CREATE INDEX "rombongan_belajar_sekolah_id_idx" ON "dapodik"."rombongan_belajar"("sekolah_id");

-- CreateIndex
CREATE INDEX "anggota_rombel_rombongan_belajar_id_idx" ON "dapodik"."anggota_rombel"("rombongan_belajar_id");

-- CreateIndex
CREATE INDEX "anggota_rombel_sekolah_id_idx" ON "dapodik"."anggota_rombel"("sekolah_id");

-- CreateIndex
CREATE INDEX "pembelajaran_rombongan_belajar_id_idx" ON "dapodik"."pembelajaran"("rombongan_belajar_id");

-- CreateIndex
CREATE INDEX "pembelajaran_sekolah_id_idx" ON "dapodik"."pembelajaran"("sekolah_id");

-- CreateIndex
CREATE INDEX "peserta_didik_sekolah_id_idx" ON "dapodik"."peserta_didik"("sekolah_id");

-- CreateIndex
CREATE INDEX "peserta_didik_rombongan_belajar_id_idx" ON "dapodik"."peserta_didik"("rombongan_belajar_id");

-- CreateIndex
CREATE INDEX "peserta_didik_qr_token_idx" ON "dapodik"."peserta_didik"("qr_token");

-- CreateIndex
CREATE INDEX "gtks_sekolah_id_idx" ON "dapodik"."gtks"("sekolah_id");

-- CreateIndex
CREATE INDEX "gtks_qr_token_idx" ON "dapodik"."gtks"("qr_token");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_username_key" ON "dapodik"."pengguna"("username");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "dapodik"."pengguna"("email");

-- CreateIndex
CREATE UNIQUE INDEX "app_keys_sekolah_id_key" ON "simak"."app_keys"("sekolah_id");

-- CreateIndex
CREATE UNIQUE INDEX "app_keys_key_api_key" ON "simak"."app_keys"("key_api");

-- CreateIndex
CREATE UNIQUE INDEX "app_keys_key_webService_key" ON "simak"."app_keys"("key_webService");

-- CreateIndex
CREATE INDEX "jenis_jadwal_sekolah_id_idx" ON "simak"."jenis_jadwal"("sekolah_id");

-- CreateIndex
CREATE INDEX "pengaturan_jadwal_hari_sekolah_id_idx" ON "simak"."pengaturan_jadwal_hari"("sekolah_id");

-- CreateIndex
CREATE INDEX "pengaturan_jadwal_hari_jenis_jadwal_id_idx" ON "simak"."pengaturan_jadwal_hari"("jenis_jadwal_id");

-- CreateIndex
CREATE UNIQUE INDEX "pengaturan_jadwal_hari_sekolah_id_jenis_jadwal_id_hari_key" ON "simak"."pengaturan_jadwal_hari"("sekolah_id", "jenis_jadwal_id", "hari");

-- CreateIndex
CREATE INDEX "pengaturan_jadwal_sekolah_id_idx" ON "simak"."pengaturan_jadwal"("sekolah_id");

-- CreateIndex
CREATE INDEX "pengaturan_jadwal_jenis_jadwal_id_idx" ON "simak"."pengaturan_jadwal"("jenis_jadwal_id");

-- CreateIndex
CREATE UNIQUE INDEX "pengaturan_jadwal_sekolah_id_jenis_jadwal_id_hari_urutan_key" ON "simak"."pengaturan_jadwal"("sekolah_id", "jenis_jadwal_id", "hari", "urutan");

-- CreateIndex
CREATE INDEX "jadwal_pelajaran_sekolah_id_idx" ON "simak"."jadwal_pelajaran"("sekolah_id");

-- CreateIndex
CREATE INDEX "jadwal_pelajaran_jenis_jadwal_id_idx" ON "simak"."jadwal_pelajaran"("jenis_jadwal_id");

-- CreateIndex
CREATE INDEX "jadwal_pelajaran_rombongan_belajar_id_idx" ON "simak"."jadwal_pelajaran"("rombongan_belajar_id");

-- CreateIndex
CREATE INDEX "jadwal_pelajaran_pembelajaran_id_idx" ON "simak"."jadwal_pelajaran"("pembelajaran_id");

-- CreateIndex
CREATE INDEX "jadwal_pelajaran_hari_urutan_idx" ON "simak"."jadwal_pelajaran"("hari", "urutan");

-- CreateIndex
CREATE UNIQUE INDEX "jadwal_pelajaran_sekolah_id_jenis_jadwal_id_rombongan_belaj_key" ON "simak"."jadwal_pelajaran"("sekolah_id", "jenis_jadwal_id", "rombongan_belajar_id", "hari", "urutan");

-- CreateIndex
CREATE INDEX "hari_libur_sekolah_id_idx" ON "simak"."hari_libur"("sekolah_id");

-- CreateIndex
CREATE INDEX "hari_libur_tanggal_mulai_tanggal_selesai_idx" ON "simak"."hari_libur"("tanggal_mulai", "tanggal_selesai");

-- CreateIndex
CREATE INDEX "izin_sekolah_id_idx" ON "simak"."izin"("sekolah_id");

-- CreateIndex
CREATE INDEX "izin_peserta_didik_id_idx" ON "simak"."izin"("peserta_didik_id");

-- CreateIndex
CREATE INDEX "izin_ptk_id_idx" ON "simak"."izin"("ptk_id");

-- CreateIndex
CREATE INDEX "presensi_peserta_didik_sekolah_id_tanggal_idx" ON "simak"."presensi_peserta_didik"("sekolah_id", "tanggal");

-- CreateIndex
CREATE INDEX "presensi_gtk_sekolah_id_tanggal_idx" ON "simak"."presensi_gtk"("sekolah_id", "tanggal");

-- CreateIndex
CREATE INDEX "presensi_mapel_sekolah_id_idx" ON "simak"."presensi_mapel"("sekolah_id");

-- CreateIndex
CREATE UNIQUE INDEX "mandala_key_key" ON "mandala"."mandala"("key");

-- CreateIndex
CREATE INDEX "pelaporan_cadisdik_id_idx" ON "mandala"."pelaporan"("cadisdik_id");

-- CreateIndex
CREATE INDEX "pelaporan_aktif_idx" ON "mandala"."pelaporan"("aktif");

-- CreateIndex
CREATE INDEX "pelaporan_sekolah_sekolah_id_idx" ON "mandala"."pelaporan_sekolah"("sekolah_id");

-- CreateIndex
CREATE UNIQUE INDEX "pelaporan_sekolah_pelaporan_id_sekolah_id_key" ON "mandala"."pelaporan_sekolah"("pelaporan_id", "sekolah_id");

-- CreateIndex
CREATE INDEX "pelaporan_dokumen_pelaporan_sekolah_id_idx" ON "mandala"."pelaporan_dokumen"("pelaporan_sekolah_id");

-- CreateIndex
CREATE INDEX "kategori_keperluan_cadisdik_id_idx" ON "mandala"."kategori_keperluan"("cadisdik_id");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_keperluan_cadisdik_id_nama_key" ON "mandala"."kategori_keperluan"("cadisdik_id", "nama");

-- CreateIndex
CREATE INDEX "antrian_cadisdik_id_idx" ON "mandala"."antrian"("cadisdik_id");

-- CreateIndex
CREATE INDEX "antrian_kategori_keperluan_id_idx" ON "mandala"."antrian"("kategori_keperluan_id");

-- CreateIndex
CREATE INDEX "antrian_status_idx" ON "mandala"."antrian"("status");

-- CreateIndex
CREATE INDEX "antrian_created_at_idx" ON "mandala"."antrian"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "antrian_cadisdik_id_tanggal_nomor_antrian_key" ON "mandala"."antrian"("cadisdik_id", "tanggal", "nomor_antrian");

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_nip_key" ON "mandala"."pegawai"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_email_key" ON "mandala"."pegawai"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_nik_key" ON "mandala"."pegawai"("nik");

-- CreateIndex
CREATE INDEX "pegawai_cadisdik_id_idx" ON "mandala"."pegawai"("cadisdik_id");

-- CreateIndex
CREATE INDEX "pegawai_nik_idx" ON "mandala"."pegawai"("nik");

-- CreateIndex
CREATE INDEX "pegawai_nip_idx" ON "mandala"."pegawai"("nip");

-- CreateIndex
CREATE INDEX "pegawai_email_idx" ON "mandala"."pegawai"("email");

-- CreateIndex
CREATE INDEX "mapping_pengawas_pegawai_id_idx" ON "mandala"."mapping_pengawas"("pegawai_id");

-- CreateIndex
CREATE INDEX "mapping_pengawas_sekolah_id_idx" ON "mandala"."mapping_pengawas"("sekolah_id");

-- CreateIndex
CREATE UNIQUE INDEX "mapping_pengawas_pegawai_id_sekolah_id_key" ON "mandala"."mapping_pengawas"("pegawai_id", "sekolah_id");

-- CreateIndex
CREATE INDEX "jenis_pelanggaran_sekolah_id_idx" ON "simak"."jenis_pelanggaran"("sekolah_id");

-- CreateIndex
CREATE INDEX "jenis_pelanggaran_target_idx" ON "simak"."jenis_pelanggaran"("target");

-- CreateIndex
CREATE INDEX "jenis_tindak_lanjut_sekolah_id_idx" ON "simak"."jenis_tindak_lanjut"("sekolah_id");

-- CreateIndex
CREATE INDEX "jenis_tindak_lanjut_target_idx" ON "simak"."jenis_tindak_lanjut"("target");

-- CreateIndex
CREATE INDEX "pelanggaran_sekolah_id_idx" ON "simak"."pelanggaran"("sekolah_id");

-- CreateIndex
CREATE INDEX "pelanggaran_peserta_didik_id_idx" ON "simak"."pelanggaran"("peserta_didik_id");

-- CreateIndex
CREATE INDEX "pelanggaran_ptk_id_idx" ON "simak"."pelanggaran"("ptk_id");

-- CreateIndex
CREATE INDEX "pelanggaran_jenis_pelanggaran_id_idx" ON "simak"."pelanggaran"("jenis_pelanggaran_id");

-- CreateIndex
CREATE INDEX "pelanggaran_tanggal_idx" ON "simak"."pelanggaran"("tanggal");

-- CreateIndex
CREATE INDEX "tindak_lanjut_pelanggaran_id_idx" ON "simak"."tindak_lanjut"("pelanggaran_id");

-- CreateIndex
CREATE INDEX "tindak_lanjut_jenis_tindak_lanjut_id_idx" ON "simak"."tindak_lanjut"("jenis_tindak_lanjut_id");

-- CreateIndex
CREATE INDEX "tindak_lanjut_tanggal_idx" ON "simak"."tindak_lanjut"("tanggal");

-- CreateIndex
CREATE INDEX "pengaturan_tagihan_sekolah_id_idx" ON "simak"."pengaturan_tagihan"("sekolah_id");

-- CreateIndex
CREATE INDEX "pengaturan_tagihan_tipe_idx" ON "simak"."pengaturan_tagihan"("tipe");

-- CreateIndex
CREATE INDEX "pengaturan_tagihan_aktif_idx" ON "simak"."pengaturan_tagihan"("aktif");

-- CreateIndex
CREATE INDEX "pengaturan_tagihan_rombel_pengaturan_tagihan_id_idx" ON "simak"."pengaturan_tagihan_rombel"("pengaturan_tagihan_id");

-- CreateIndex
CREATE INDEX "pengaturan_tagihan_rombel_rombongan_belajar_id_idx" ON "simak"."pengaturan_tagihan_rombel"("rombongan_belajar_id");

-- CreateIndex
CREATE UNIQUE INDEX "pengaturan_tagihan_rombel_pengaturan_tagihan_id_rombongan_b_key" ON "simak"."pengaturan_tagihan_rombel"("pengaturan_tagihan_id", "rombongan_belajar_id");

-- CreateIndex
CREATE INDEX "spp_sekolah_id_idx" ON "simak"."spp"("sekolah_id");

-- CreateIndex
CREATE INDEX "spp_peserta_didik_id_idx" ON "simak"."spp"("peserta_didik_id");

-- CreateIndex
CREATE INDEX "spp_pengaturan_tagihan_id_idx" ON "simak"."spp"("pengaturan_tagihan_id");

-- CreateIndex
CREATE INDEX "spp_status_idx" ON "simak"."spp"("status");

-- CreateIndex
CREATE INDEX "riwayat_transaksi_spp_spp_id_idx" ON "simak"."riwayat_transaksi_spp"("spp_id");

-- CreateIndex
CREATE INDEX "riwayat_transaksi_spp_sekolah_id_idx" ON "simak"."riwayat_transaksi_spp"("sekolah_id");

-- CreateIndex
CREATE INDEX "riwayat_transaksi_spp_peserta_didik_id_idx" ON "simak"."riwayat_transaksi_spp"("peserta_didik_id");

-- CreateIndex
CREATE INDEX "riwayat_transaksi_spp_jenis_transaksi_idx" ON "simak"."riwayat_transaksi_spp"("jenis_transaksi");

-- CreateIndex
CREATE INDEX "riwayat_transaksi_spp_tanggal_transaksi_idx" ON "simak"."riwayat_transaksi_spp"("tanggal_transaksi");

-- CreateIndex
CREATE INDEX "pengaturan_nomor_surat_sekolah_id_idx" ON "simak"."pengaturan_nomor_surat"("sekolah_id");

-- CreateIndex
CREATE INDEX "pengaturan_nomor_surat_kategori_idx" ON "simak"."pengaturan_nomor_surat"("kategori");

-- CreateIndex
CREATE INDEX "pengaturan_nomor_surat_aktif_idx" ON "simak"."pengaturan_nomor_surat"("aktif");

-- CreateIndex
CREATE UNIQUE INDEX "pengaturan_nomor_surat_sekolah_id_kategori_nama_label_key" ON "simak"."pengaturan_nomor_surat"("sekolah_id", "kategori", "nama_label");

-- CreateIndex
CREATE INDEX "template_surat_sekolah_id_idx" ON "simak"."template_surat"("sekolah_id");

-- CreateIndex
CREATE INDEX "template_surat_kategori_idx" ON "simak"."template_surat"("kategori");

-- CreateIndex
CREATE INDEX "template_surat_aktif_idx" ON "simak"."template_surat"("aktif");

-- CreateIndex
CREATE INDEX "surat_masuk_sekolah_id_idx" ON "simak"."surat_masuk"("sekolah_id");

-- CreateIndex
CREATE INDEX "surat_masuk_tanggal_surat_idx" ON "simak"."surat_masuk"("tanggal_surat");

-- CreateIndex
CREATE INDEX "surat_masuk_tanggal_diterima_idx" ON "simak"."surat_masuk"("tanggal_diterima");

-- CreateIndex
CREATE INDEX "surat_masuk_nomor_agenda_idx" ON "simak"."surat_masuk"("nomor_agenda");

-- CreateIndex
CREATE INDEX "surat_masuk_nomor_surat_idx" ON "simak"."surat_masuk"("nomor_surat");

-- CreateIndex
CREATE UNIQUE INDEX "surat_masuk_sekolah_id_nomor_agenda_key" ON "simak"."surat_masuk"("sekolah_id", "nomor_agenda");

-- CreateIndex
CREATE INDEX "surat_keluar_sekolah_id_idx" ON "simak"."surat_keluar"("sekolah_id");

-- CreateIndex
CREATE INDEX "surat_keluar_template_surat_id_idx" ON "simak"."surat_keluar"("template_surat_id");

-- CreateIndex
CREATE INDEX "surat_keluar_pengaturan_nomor_surat_id_idx" ON "simak"."surat_keluar"("pengaturan_nomor_surat_id");

-- CreateIndex
CREATE INDEX "surat_keluar_peserta_didik_id_idx" ON "simak"."surat_keluar"("peserta_didik_id");

-- CreateIndex
CREATE INDEX "surat_keluar_ptk_id_idx" ON "simak"."surat_keluar"("ptk_id");

-- CreateIndex
CREATE INDEX "surat_keluar_tanggal_surat_idx" ON "simak"."surat_keluar"("tanggal_surat");

-- CreateIndex
CREATE INDEX "surat_keluar_status_idx" ON "simak"."surat_keluar"("status");

-- CreateIndex
CREATE UNIQUE INDEX "surat_keluar_sekolah_id_nomor_surat_key" ON "simak"."surat_keluar"("sekolah_id", "nomor_surat");

-- CreateIndex
CREATE INDEX "riwayat_pendidikan_formal_ptk_id_idx" ON "dapodik"."riwayat_pendidikan_formal"("ptk_id");

-- CreateIndex
CREATE INDEX "layanan_cadisdik_id_idx" ON "mandala"."layanan"("cadisdik_id");

-- CreateIndex
CREATE INDEX "layanan_kategori_idx" ON "mandala"."layanan"("kategori");

-- CreateIndex
CREATE INDEX "layanan_aktif_idx" ON "mandala"."layanan"("aktif");

-- CreateIndex
CREATE UNIQUE INDEX "layanan_cadisdik_id_nama_layanan_kategori_key" ON "mandala"."layanan"("cadisdik_id", "nama_layanan", "kategori");

-- CreateIndex
CREATE INDEX "layanan_syarat_layanan_id_idx" ON "mandala"."layanan_syarat"("layanan_id");

-- CreateIndex
CREATE INDEX "layanan_syarat_aktif_idx" ON "mandala"."layanan_syarat"("aktif");

-- CreateIndex
CREATE UNIQUE INDEX "layanan_syarat_layanan_id_nama_syarat_key" ON "mandala"."layanan_syarat"("layanan_id", "nama_syarat");

-- CreateIndex
CREATE INDEX "permohonan_layanan_cadisdik_id_idx" ON "mandala"."permohonan_layanan"("cadisdik_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_sekolah_id_idx" ON "mandala"."permohonan_layanan"("sekolah_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_layanan_id_idx" ON "mandala"."permohonan_layanan"("layanan_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_status_idx" ON "mandala"."permohonan_layanan"("status");

-- CreateIndex
CREATE INDEX "permohonan_layanan_kategori_idx" ON "mandala"."permohonan_layanan"("kategori");

-- CreateIndex
CREATE INDEX "permohonan_layanan_tanggal_pengajuan_idx" ON "mandala"."permohonan_layanan"("tanggal_pengajuan");

-- CreateIndex
CREATE INDEX "permohonan_layanan_file_permohonan_layanan_id_idx" ON "mandala"."permohonan_layanan_file"("permohonan_layanan_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_file_layanan_syarat_id_idx" ON "mandala"."permohonan_layanan_file"("layanan_syarat_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_file_status_idx" ON "mandala"."permohonan_layanan_file"("status");

-- CreateIndex
CREATE INDEX "permohonan_layanan_log_permohonan_layanan_id_idx" ON "mandala"."permohonan_layanan_log"("permohonan_layanan_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_log_pegawai_id_idx" ON "mandala"."permohonan_layanan_log"("pegawai_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_log_status_idx" ON "mandala"."permohonan_layanan_log"("status");

-- CreateIndex
CREATE UNIQUE INDEX "agama_pk" ON "ref"."agama"("agama_id");

-- CreateIndex
CREATE UNIQUE INDEX "akreditasi_pk" ON "ref"."akreditasi"("akreditasi_id");

-- CreateIndex
CREATE UNIQUE INDEX "akses_internet_pk" ON "ref"."akses_internet"("akses_internet_id");

-- CreateIndex
CREATE UNIQUE INDEX "alasan_layak_pip_pk" ON "ref"."alasan_layak_pip"("id_layak_pip");

-- CreateIndex
CREATE UNIQUE INDEX "alat_transportasi_pk" ON "ref"."alat_transportasi"("alat_transportasi_id");

-- CreateIndex
CREATE UNIQUE INDEX "bank_pk" ON "ref"."bank"("id_bank");

-- CreateIndex
CREATE UNIQUE INDEX "batas_waktu_rapor_pk" ON "ref"."batas_waktu_rapor"("semester_id");

-- CreateIndex
CREATE UNIQUE INDEX "bentuk_lembaga_pk" ON "ref"."bentuk_lembaga"("bentuk_lembaga_id");

-- CreateIndex
CREATE UNIQUE INDEX "bentuk_pendidikan_pk" ON "ref"."bentuk_pendidikan"("bentuk_pendidikan_id");

-- CreateIndex
CREATE UNIQUE INDEX "bidang_studi_pk" ON "ref"."bidang_studi"("bidang_studi_id");

-- CreateIndex
CREATE INDEX "kelompok_fk" ON "ref"."bidang_studi"("kelompok_bidang_studi_id");

-- CreateIndex
CREATE UNIQUE INDEX "bidang_usaha_pk" ON "ref"."bidang_usaha"("bidang_usaha_id");

-- CreateIndex
CREATE UNIQUE INDEX "ekstra_kurikuler_pk" ON "ref"."ekstra_kurikuler"("id_ekskul");

-- CreateIndex
CREATE UNIQUE INDEX "errortype_pk" ON "ref"."errortype"("idtype");

-- CreateIndex
CREATE UNIQUE INDEX "fasilitas_layanan_pk" ON "ref"."fasilitas_layanan"("fasilitas_layanan_id");

-- CreateIndex
CREATE UNIQUE INDEX "gelar_akademik_pk" ON "ref"."gelar_akademik"("gelar_akademik_id");

-- CreateIndex
CREATE UNIQUE INDEX "group_matpel_pk" ON "ref"."group_matpel"("gmp_id");

-- CreateIndex
CREATE INDEX "gmp_kurikulum_fk" ON "ref"."group_matpel"("kurikulum_id");

-- CreateIndex
CREATE INDEX "gmp_tingkat_fk" ON "ref"."group_matpel"("tingkat_pendidikan_id");

-- CreateIndex
CREATE UNIQUE INDEX "jabatan_fungsional_pk" ON "ref"."jabatan_fungsional"("jabatan_fungsional_id");

-- CreateIndex
CREATE UNIQUE INDEX "jabatan_ptk_pk1" ON "ref"."jabatan_ptk"("jabatan_ptk_id");

-- CreateIndex
CREATE INDEX "jenis_ptk_jabatan_fk2" ON "ref"."jabatan_ptk"("jenis_ptk_id");

-- CreateIndex
CREATE UNIQUE INDEX "jabatan_tugas_ptk_pk" ON "ref"."jabatan_tugas_ptk"("jabatan_ptk_id");

-- CreateIndex
CREATE UNIQUE INDEX "jadwal_paud_pk" ON "ref"."jadwal_paud"("jadwal_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_akt_pd_pk" ON "ref"."jenis_akt_pd"("id_jns_akt_pd");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_aktivitas_kepanitiaan_pk" ON "ref"."jenis_aktivitas_kepanitiaan"("id_jns_akt_pan");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_bantuan_pk" ON "ref"."jenis_bantuan"("jenis_bantuan_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_beasiswa_pk" ON "ref"."jenis_beasiswa"("jenis_beasiswa_id");

-- CreateIndex
CREATE INDEX "sumber_beasiswa_fk" ON "ref"."jenis_beasiswa"("sumber_dana_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_cita_pk" ON "ref"."jenis_cita"("id_cita");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_diklat_pk" ON "ref"."jenis_diklat"("jenis_diklat_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_gugus_pk" ON "ref"."jenis_gugus"("jenis_gugus_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_hapus_buku_pk" ON "ref"."jenis_hapus_buku"("id_hapus_buku");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_hobby_pk" ON "ref"."jenis_hobby"("id_hobby");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_ijazah_pk" ON "ref"."jenis_ijazah"("jenis_ijazah_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_keluar_pk" ON "ref"."jenis_keluar"("jenis_keluar_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_kepanitiaan_pk" ON "ref"."jenis_kepanitiaan"("id_jns_panitia");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_kerusakan_pk" ON "ref"."jenis_kerusakan"("kerusakan_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_kesejahteraan_pk" ON "ref"."jenis_kesejahteraan"("jenis_kesejahteraan_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_koneksi_pk" ON "ref"."jenis_koneksi"("jenis_koneksi_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_ks_pk" ON "ref"."jenis_ks"("id_jns_ks");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_layanan_internet_pk" ON "ref"."jenis_layanan_internet"("jenis_layanan_internet_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_lembaga_pk" ON "ref"."jenis_lembaga"("jenis_lembaga_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_lk_pk" ON "ref"."jenis_lk"("id_jenis_lk");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_pendaftaran_pk" ON "ref"."jenis_pendaftaran"("jenis_pendaftaran_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_penghargaan_pk" ON "ref"."jenis_penghargaan"("jenis_penghargaan_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_pesan_pk" ON "ref"."jenis_pesan"("jenis_pesan_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_prasarana_pk" ON "ref"."jenis_prasarana"("jenis_prasarana_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_prestasi_pk" ON "ref"."jenis_prestasi"("jenis_prestasi_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_ptk_pk" ON "ref"."jenis_ptk"("jenis_ptk_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_rombel_pk" ON "ref"."jenis_rombel"("jenis_rombel");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_sarana_pk" ON "ref"."jenis_sarana"("jenis_sarana_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_sertifikasi_pk" ON "ref"."jenis_sertifikasi"("id_jenis_sertifikasi");

-- CreateIndex
CREATE INDEX "sertifikasi_kk_fk" ON "ref"."jenis_sertifikasi"("kebutuhan_khusus_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_test_pk" ON "ref"."jenis_test"("jenis_test_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_tinggal_pk" ON "ref"."jenis_tinggal"("jenis_tinggal_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenis_tunjangan_pk" ON "ref"."jenis_tunjangan"("jenis_tunjangan_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenjang_kepengawasan_pk" ON "ref"."jenjang_kepengawasan"("jenjang_kepengawasan_id");

-- CreateIndex
CREATE UNIQUE INDEX "jenjang_pendidikan_pk" ON "ref"."jenjang_pendidikan"("jenjang_pendidikan_id");

-- CreateIndex
CREATE UNIQUE INDEX "jurusan_pk" ON "ref"."jurusan"("jurusan_id");

-- CreateIndex
CREATE INDEX "induk_program_fk" ON "ref"."jurusan"("jurusan_induk");

-- CreateIndex
CREATE INDEX "jurusan_kel_bid_fk" ON "ref"."jurusan"("level_bidang_id");

-- CreateIndex
CREATE INDEX "jurusan_ls" ON "ref"."jurusan"("last_sync");

-- CreateIndex
CREATE INDEX "jurusan_lu" ON "ref"."jurusan"("last_update");

-- CreateIndex
CREATE INDEX "jurusan_std_jenjang_fk" ON "ref"."jurusan"("jenjang_pendidikan_id");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_desa_pk" ON "ref"."kategori_desa"("kategori_desa_id");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_tk_pk" ON "ref"."kategori_tk"("kategori_tk_id");

-- CreateIndex
CREATE UNIQUE INDEX "keahlian_laboratorium_pk" ON "ref"."keahlian_laboratorium"("keahlian_laboratorium_id");

-- CreateIndex
CREATE UNIQUE INDEX "kebutuhan_khusus_pk" ON "ref"."kebutuhan_khusus"("kebutuhan_khusus_id");

-- CreateIndex
CREATE UNIQUE INDEX "kelompok_bidang_pk" ON "ref"."kelompok_bidang"("level_bidang_id");

-- CreateIndex
CREATE INDEX "induk_kelompok_fk" ON "ref"."kelompok_bidang"("level_bidang_induk");

-- CreateIndex
CREATE UNIQUE INDEX "kelompok_usaha_pk" ON "ref"."kelompok_usaha"("kelompok_usaha_id");

-- CreateIndex
CREATE UNIQUE INDEX "klasifikasi_lembaga_pk" ON "ref"."klasifikasi_lembaga"("klasifikasi_lembaga_id");

-- CreateIndex
CREATE UNIQUE INDEX "kompetensi_pk" ON "ref"."kompetensi"("id_komp");

-- CreateIndex
CREATE INDEX "inti_dasar_fk" ON "ref"."kompetensi"("id_inti_dasar");

-- CreateIndex
CREATE INDEX "kompetensi_kurikulum_fk" ON "ref"."kompetensi"("kurikulum_id");

-- CreateIndex
CREATE INDEX "kompetensi_matpel_fk" ON "ref"."kompetensi"("mata_pelajaran_id");

-- CreateIndex
CREATE INDEX "kompetensi_tingkat_fk" ON "ref"."kompetensi"("tingkat_pendidikan_id");

-- CreateIndex
CREATE UNIQUE INDEX "kurikulum_pk" ON "ref"."kurikulum"("kurikulum_id");

-- CreateIndex
CREATE INDEX "kurikulum_jenjang_fk" ON "ref"."kurikulum"("jenjang_pendidikan_id");

-- CreateIndex
CREATE INDEX "kurikulum_jurusan_fk" ON "ref"."kurikulum"("jurusan_id");

-- CreateIndex
CREATE UNIQUE INDEX "lemb_sertifikasi_pk" ON "ref"."lemb_sertifikasi"("kode_lemb_sert");

-- CreateIndex
CREATE INDEX "alamat_kecamatan_fk6" ON "ref"."lemb_sertifikasi"("kode_wilayah");

-- CreateIndex
CREATE UNIQUE INDEX "lembaga_akreditasi_pk" ON "ref"."lembaga_akreditasi"("la_id");

-- CreateIndex
CREATE INDEX "alamat_kecamatan_fk5" ON "ref"."lembaga_akreditasi"("kode_wilayah");

-- CreateIndex
CREATE UNIQUE INDEX "lembaga_pengangkat_pk" ON "ref"."lembaga_pengangkat"("lembaga_pengangkat_id");

-- CreateIndex
CREATE UNIQUE INDEX "level_wilayah_pk" ON "ref"."level_wilayah"("id_level_wilayah");

-- CreateIndex
CREATE INDEX "map_bidang_studi_fk" ON "ref"."map_bidang_mata_pelajaran"("bidang_studi_id");

-- CreateIndex
CREATE UNIQUE INDEX "map_bidang_mata_pelajaran_pk" ON "ref"."map_bidang_mata_pelajaran"("mata_pelajaran_id", "bidang_studi_id");

-- CreateIndex
CREATE UNIQUE INDEX "mata_pelajaran_pk" ON "ref"."mata_pelajaran"("mata_pelajaran_id");

-- CreateIndex
CREATE INDEX "mapel_jurusan_fk" ON "ref"."mata_pelajaran"("jurusan_id");

-- CreateIndex
CREATE INDEX "matpel_ls" ON "ref"."mata_pelajaran"("last_sync");

-- CreateIndex
CREATE INDEX "matpel_lu" ON "ref"."mata_pelajaran"("last_update");

-- CreateIndex
CREATE INDEX "mapelkur_status_kur_fk" ON "ref"."mata_pelajaran_kurikulum"("status_di_kurikulum");

-- CreateIndex
CREATE INDEX "matpel_group_fk" ON "ref"."mata_pelajaran_kurikulum"("gmp_id");

-- CreateIndex
CREATE INDEX "matpel_kur_ls" ON "ref"."mata_pelajaran_kurikulum"("last_sync");

-- CreateIndex
CREATE INDEX "matpel_kur_lu" ON "ref"."mata_pelajaran_kurikulum"("last_update");

-- CreateIndex
CREATE INDEX "matpelkur_matpel_fk" ON "ref"."mata_pelajaran_kurikulum"("mata_pelajaran_id");

-- CreateIndex
CREATE INDEX "matpelkur_tingkat_fk" ON "ref"."mata_pelajaran_kurikulum"("tingkat_pendidikan_id");

-- CreateIndex
CREATE UNIQUE INDEX "mata_pelajaran_kurikulum_pk" ON "ref"."mata_pelajaran_kurikulum"("kurikulum_id", "mata_pelajaran_id", "tingkat_pendidikan_id");

-- CreateIndex
CREATE UNIQUE INDEX "mst_wilayah_pk" ON "ref"."mst_wilayah"("kode_wilayah");

-- CreateIndex
CREATE INDEX "kategori_desa_fk" ON "ref"."mst_wilayah"("kategori_desa_id");

-- CreateIndex
CREATE INDEX "level_wilayah_fk" ON "ref"."mst_wilayah"("id_level_wilayah");

-- CreateIndex
CREATE INDEX "parent_wilayah_fk" ON "ref"."mst_wilayah"("mst_kode_wilayah");

-- CreateIndex
CREATE INDEX "propinsi_negara_fk" ON "ref"."mst_wilayah"("negara_id");

-- CreateIndex
CREATE INDEX "mulok_mapel_fk" ON "ref"."mulok"("mata_pelajaran_id");

-- CreateIndex
CREATE UNIQUE INDEX "mulok_pk" ON "ref"."mulok"("kode_wilayah", "mata_pelajaran_id");

-- CreateIndex
CREATE UNIQUE INDEX "negara_pk" ON "ref"."negara"("negara_id");

-- CreateIndex
CREATE UNIQUE INDEX "pangkat_golongan_pk" ON "ref"."pangkat_golongan"("pangkat_golongan_id");

-- CreateIndex
CREATE UNIQUE INDEX "pekerjaan_pk" ON "ref"."pekerjaan"("pekerjaan_id");

-- CreateIndex
CREATE INDEX "jur_pemakai_pras_fk" ON "ref"."pemakai_prasarana"("jurusan_id");

-- CreateIndex
CREATE UNIQUE INDEX "pemakai_prasarana_pk" ON "ref"."pemakai_prasarana"("jenis_prasarana_id", "jurusan_id");

-- CreateIndex
CREATE INDEX "jur_pemakai_sar_fk" ON "ref"."pemakai_sarana"("jurusan_id");

-- CreateIndex
CREATE UNIQUE INDEX "pemakai_sarana_pk" ON "ref"."pemakai_sarana"("jenis_sarana_id", "jurusan_id");

-- CreateIndex
CREATE UNIQUE INDEX "penghasilan_pk" ON "ref"."penghasilan"("penghasilan_id");

-- CreateIndex
CREATE UNIQUE INDEX "sasaran_blockgrant_pk" ON "ref"."sasaran_blockgrant"("sasaran_blockgrant_id");

-- CreateIndex
CREATE INDEX "sasaran_jenis_bantuan_fk" ON "ref"."sasaran_blockgrant"("jenis_bantuan_id");

-- CreateIndex
CREATE INDEX "sasaran_prasarana_fk" ON "ref"."sasaran_blockgrant"("jenis_prasarana_id");

-- CreateIndex
CREATE INDEX "sasaran_sarana_fk" ON "ref"."sasaran_blockgrant"("jenis_sarana_id");

-- CreateIndex
CREATE INDEX "sasaran_sumber_fk" ON "ref"."sasaran_blockgrant"("sumber_dana_id");

-- CreateIndex
CREATE INDEX "sasaran_tahun_fk" ON "ref"."sasaran_blockgrant"("tahun_ajaran_id");

-- CreateIndex
CREATE UNIQUE INDEX "semester_pk" ON "ref"."semester"("semester_id");

-- CreateIndex
CREATE INDEX "semester_tahun_ajaran_fk" ON "ref"."semester"("tahun_ajaran_id");

-- CreateIndex
CREATE UNIQUE INDEX "sertifikasi_iso_pk" ON "ref"."sertifikasi_iso"("sertifikasi_iso_id");

-- CreateIndex
CREATE UNIQUE INDEX "standar_sarana_pk" ON "ref"."standar_sarana"("id_std_sarana");

-- CreateIndex
CREATE INDEX "sarana_standar_fk" ON "ref"."standar_sarana"("jenis_sarana_id");

-- CreateIndex
CREATE INDEX "standar_bentuk_fk" ON "ref"."standar_sarana"("bentuk_pendidikan_id");

-- CreateIndex
CREATE INDEX "standar_jenis_ruang_fk" ON "ref"."standar_sarana"("jenis_prasarana_id");

-- CreateIndex
CREATE INDEX "standar_jurusan_fk" ON "ref"."standar_sarana"("jurusan_id");

-- CreateIndex
CREATE UNIQUE INDEX "status_anak_pk" ON "ref"."status_anak"("status_anak_id");

-- CreateIndex
CREATE UNIQUE INDEX "status_di_kurikulum_pk" ON "ref"."status_di_kurikulum"("status_di_kurikulum");

-- CreateIndex
CREATE UNIQUE INDEX "status_keaktifan_pegawai_pk" ON "ref"."status_keaktifan_pegawai"("status_keaktifan_id");

-- CreateIndex
CREATE UNIQUE INDEX "status_kepegawaian_pk" ON "ref"."status_kepegawaian"("status_kepegawaian_id");

-- CreateIndex
CREATE UNIQUE INDEX "status_kepemilikan_pk" ON "ref"."status_kepemilikan"("status_kepemilikan_id");

-- CreateIndex
CREATE UNIQUE INDEX "status_kepemilikan_sarpras_pk" ON "ref"."status_kepemilikan_sarpras"("kepemilikan_sarpras_id");

-- CreateIndex
CREATE UNIQUE INDEX "sumber_air_pk" ON "ref"."sumber_air"("sumber_air_id");

-- CreateIndex
CREATE UNIQUE INDEX "sumber_dana_pk" ON "ref"."sumber_dana"("sumber_dana_id");

-- CreateIndex
CREATE UNIQUE INDEX "sumber_dana_sekolah_pk" ON "ref"."sumber_dana_sekolah"("sumber_dana_sekolah_id");

-- CreateIndex
CREATE UNIQUE INDEX "sumber_gaji_pk" ON "ref"."sumber_gaji"("sumber_gaji_id");

-- CreateIndex
CREATE UNIQUE INDEX "sumber_listrik_pk" ON "ref"."sumber_listrik"("sumber_listrik_id");

-- CreateIndex
CREATE UNIQUE INDEX "table_sync_pk" ON "ref"."table_sync"("table_name");

-- CreateIndex
CREATE UNIQUE INDEX "tahun_ajaran_pk" ON "ref"."tahun_ajaran"("tahun_ajaran_id");

-- CreateIndex
CREATE INDEX "trapor_mtp_fk" ON "ref"."template_rapor"("mata_pelajaran_id");

-- CreateIndex
CREATE UNIQUE INDEX "template_rapor_pk" ON "ref"."template_rapor"("template_id", "mata_pelajaran_id");

-- CreateIndex
CREATE UNIQUE INDEX "template_un_pk" ON "ref"."template_un"("template_id");

-- CreateIndex
CREATE INDEX "tun_jenjang_fk" ON "ref"."template_un"("jenjang_pendidikan_id");

-- CreateIndex
CREATE INDEX "tun_jurusan_fk" ON "ref"."template_un"("jurusan_id");

-- CreateIndex
CREATE INDEX "tun_mtp1_fk" ON "ref"."template_un"("mp3_id");

-- CreateIndex
CREATE INDEX "tun_mtp2_fk" ON "ref"."template_un"("mp4_id");

-- CreateIndex
CREATE INDEX "tun_mtp3_fk" ON "ref"."template_un"("mp7_id");

-- CreateIndex
CREATE INDEX "tun_mtp4_fk" ON "ref"."template_un"("mp5_id");

-- CreateIndex
CREATE INDEX "tun_mtp5_fk" ON "ref"."template_un"("mp1_id");

-- CreateIndex
CREATE INDEX "tun_mtp6_fk" ON "ref"."template_un"("mp2_id");

-- CreateIndex
CREATE INDEX "tun_mtp7_fk" ON "ref"."template_un"("mp6_id");

-- CreateIndex
CREATE INDEX "tun_tahun_fk" ON "ref"."template_un"("tahun_ajaran_id");

-- CreateIndex
CREATE INDEX "kabkota_2_fk" ON "ref"."tetangga_kabkota"("kode_wilayah2");

-- CreateIndex
CREATE UNIQUE INDEX "tetangga_kabkota_pk" ON "ref"."tetangga_kabkota"("kode_wilayah1", "kode_wilayah2");

-- CreateIndex
CREATE UNIQUE INDEX "tingkat_pendidikan_pk" ON "ref"."tingkat_pendidikan"("tingkat_pendidikan_id");

-- CreateIndex
CREATE INDEX "tingkat_jenjang_fk" ON "ref"."tingkat_pendidikan"("jenjang_pendidikan_id");

-- CreateIndex
CREATE UNIQUE INDEX "tingkat_penghargaan_pk" ON "ref"."tingkat_penghargaan"("tingkat_penghargaan_id");

-- CreateIndex
CREATE UNIQUE INDEX "tingkat_prestasi_pk" ON "ref"."tingkat_prestasi"("tingkat_prestasi_id");

-- CreateIndex
CREATE UNIQUE INDEX "waktu_penyelenggaraan_pk" ON "ref"."waktu_penyelenggaraan"("waktu_penyelenggaraan_id");

-- AddForeignKey
ALTER TABLE "dapodik"."sekolah" ADD CONSTRAINT "sekolah_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."anggota_rombel" ADD CONSTRAINT "anggota_rombel_rombongan_belajar_id_fkey" FOREIGN KEY ("rombongan_belajar_id") REFERENCES "dapodik"."rombongan_belajar"("rombongan_belajar_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."pembelajaran" ADD CONSTRAINT "pembelajaran_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."pembelajaran" ADD CONSTRAINT "pembelajaran_rombongan_belajar_id_fkey" FOREIGN KEY ("rombongan_belajar_id") REFERENCES "dapodik"."rombongan_belajar"("rombongan_belajar_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."peserta_didik" ADD CONSTRAINT "peserta_didik_rombongan_belajar_id_fkey" FOREIGN KEY ("rombongan_belajar_id") REFERENCES "dapodik"."rombongan_belajar"("rombongan_belajar_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."pengguna" ADD CONSTRAINT "pengguna_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."pengguna" ADD CONSTRAINT "pengguna_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."rwy_sertifikasi" ADD CONSTRAINT "rwy_sertifikasi_bidang_studi_id_fkey" FOREIGN KEY ("bidang_studi_id") REFERENCES "dapodik"."bidang_studi"("bidang_studi_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."rwy_sertifikasi" ADD CONSTRAINT "rwy_sertifikasi_kode_lemb_sert_fkey" FOREIGN KEY ("kode_lemb_sert") REFERENCES "dapodik"."lemb_sertifikasi"("kode_lemb_sert") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."rwy_sertifikasi" ADD CONSTRAINT "rwy_sertifikasi_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jenis_jadwal" ADD CONSTRAINT "jenis_jadwal_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_jadwal_hari" ADD CONSTRAINT "pengaturan_jadwal_hari_jenis_jadwal_id_fkey" FOREIGN KEY ("jenis_jadwal_id") REFERENCES "simak"."jenis_jadwal"("jenis_jadwal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_jadwal" ADD CONSTRAINT "pengaturan_jadwal_jenis_jadwal_id_fkey" FOREIGN KEY ("jenis_jadwal_id") REFERENCES "simak"."jenis_jadwal"("jenis_jadwal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_jenis_jadwal_id_fkey" FOREIGN KEY ("jenis_jadwal_id") REFERENCES "simak"."jenis_jadwal"("jenis_jadwal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_pembelajaran_id_fkey" FOREIGN KEY ("pembelajaran_id") REFERENCES "dapodik"."pembelajaran"("pembelajaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_rombongan_belajar_id_fkey" FOREIGN KEY ("rombongan_belajar_id") REFERENCES "dapodik"."rombongan_belajar"("rombongan_belajar_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."hari_libur" ADD CONSTRAINT "hari_libur_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."izin" ADD CONSTRAINT "izin_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."izin" ADD CONSTRAINT "izin_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."izin" ADD CONSTRAINT "izin_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_peserta_didik" ADD CONSTRAINT "presensi_peserta_didik_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_peserta_didik" ADD CONSTRAINT "presensi_peserta_didik_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_gtk" ADD CONSTRAINT "presensi_gtk_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_gtk" ADD CONSTRAINT "presensi_gtk_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_mapel" ADD CONSTRAINT "presensi_mapel_jadwal_pelajaran_id_fkey" FOREIGN KEY ("jadwal_pelajaran_id") REFERENCES "simak"."jadwal_pelajaran"("jadwal_pelajaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_mapel" ADD CONSTRAINT "presensi_mapel_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_mapel" ADD CONSTRAINT "presensi_mapel_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."pelaporan" ADD CONSTRAINT "pelaporan_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."pelaporan_sekolah" ADD CONSTRAINT "pelaporan_sekolah_pelaporan_id_fkey" FOREIGN KEY ("pelaporan_id") REFERENCES "mandala"."pelaporan"("pelaporan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."pelaporan_dokumen" ADD CONSTRAINT "pelaporan_dokumen_pelaporan_sekolah_id_fkey" FOREIGN KEY ("pelaporan_sekolah_id") REFERENCES "mandala"."pelaporan_sekolah"("pelaporan_sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."kategori_keperluan" ADD CONSTRAINT "kategori_keperluan_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."antrian" ADD CONSTRAINT "antrian_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."antrian" ADD CONSTRAINT "antrian_kategori_keperluan_id_fkey" FOREIGN KEY ("kategori_keperluan_id") REFERENCES "mandala"."kategori_keperluan"("kategori_keperluan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."pegawai" ADD CONSTRAINT "pegawai_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."mapping_pengawas" ADD CONSTRAINT "mapping_pengawas_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "mandala"."pegawai"("pegawai_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."mapping_pengawas" ADD CONSTRAINT "mapping_pengawas_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pelanggaran" ADD CONSTRAINT "pelanggaran_jenis_pelanggaran_id_fkey" FOREIGN KEY ("jenis_pelanggaran_id") REFERENCES "simak"."jenis_pelanggaran"("jenis_pelanggaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pelanggaran" ADD CONSTRAINT "pelanggaran_pelapor_ptk_id_fkey" FOREIGN KEY ("pelapor_ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pelanggaran" ADD CONSTRAINT "pelanggaran_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pelanggaran" ADD CONSTRAINT "pelanggaran_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."tindak_lanjut" ADD CONSTRAINT "tindak_lanjut_jenis_tindak_lanjut_id_fkey" FOREIGN KEY ("jenis_tindak_lanjut_id") REFERENCES "simak"."jenis_tindak_lanjut"("jenis_tindak_lanjut_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."tindak_lanjut" ADD CONSTRAINT "tindak_lanjut_pelanggaran_id_fkey" FOREIGN KEY ("pelanggaran_id") REFERENCES "simak"."pelanggaran"("pelanggaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."tindak_lanjut" ADD CONSTRAINT "tindak_lanjut_petugas_ptk_id_fkey" FOREIGN KEY ("petugas_ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_tagihan" ADD CONSTRAINT "pengaturan_tagihan_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_tagihan_rombel" ADD CONSTRAINT "pengaturan_tagihan_rombel_pengaturan_tagihan_id_fkey" FOREIGN KEY ("pengaturan_tagihan_id") REFERENCES "simak"."pengaturan_tagihan"("pengaturan_tagihan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_tagihan_rombel" ADD CONSTRAINT "pengaturan_tagihan_rombel_rombongan_belajar_id_fkey" FOREIGN KEY ("rombongan_belajar_id") REFERENCES "dapodik"."rombongan_belajar"("rombongan_belajar_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."spp" ADD CONSTRAINT "spp_pengaturan_tagihan_id_fkey" FOREIGN KEY ("pengaturan_tagihan_id") REFERENCES "simak"."pengaturan_tagihan"("pengaturan_tagihan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."spp" ADD CONSTRAINT "spp_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."spp" ADD CONSTRAINT "spp_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."riwayat_transaksi_spp" ADD CONSTRAINT "riwayat_transaksi_spp_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."riwayat_transaksi_spp" ADD CONSTRAINT "riwayat_transaksi_spp_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."riwayat_transaksi_spp" ADD CONSTRAINT "riwayat_transaksi_spp_spp_id_fkey" FOREIGN KEY ("spp_id") REFERENCES "simak"."spp"("spp_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_nomor_surat" ADD CONSTRAINT "pengaturan_nomor_surat_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."template_surat" ADD CONSTRAINT "template_surat_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_masuk" ADD CONSTRAINT "surat_masuk_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_keluar" ADD CONSTRAINT "surat_keluar_pengaturan_nomor_surat_id_fkey" FOREIGN KEY ("pengaturan_nomor_surat_id") REFERENCES "simak"."pengaturan_nomor_surat"("pengaturan_nomor_surat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_keluar" ADD CONSTRAINT "surat_keluar_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_keluar" ADD CONSTRAINT "surat_keluar_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_keluar" ADD CONSTRAINT "surat_keluar_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_keluar" ADD CONSTRAINT "surat_keluar_template_surat_id_fkey" FOREIGN KEY ("template_surat_id") REFERENCES "simak"."template_surat"("template_surat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."riwayat_pendidikan_formal" ADD CONSTRAINT "riwayat_pendidikan_formal_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."layanan" ADD CONSTRAINT "layanan_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."layanan_syarat" ADD CONSTRAINT "layanan_syarat_layanan_id_fkey" FOREIGN KEY ("layanan_id") REFERENCES "mandala"."layanan"("layanan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan" ADD CONSTRAINT "permohonan_layanan_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan" ADD CONSTRAINT "permohonan_layanan_layanan_id_fkey" FOREIGN KEY ("layanan_id") REFERENCES "mandala"."layanan"("layanan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan_file" ADD CONSTRAINT "permohonan_layanan_file_layanan_syarat_id_fkey" FOREIGN KEY ("layanan_syarat_id") REFERENCES "mandala"."layanan_syarat"("layanan_syarat_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan_file" ADD CONSTRAINT "permohonan_layanan_file_permohonan_layanan_id_fkey" FOREIGN KEY ("permohonan_layanan_id") REFERENCES "mandala"."permohonan_layanan"("permohonan_layanan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan_log" ADD CONSTRAINT "permohonan_layanan_log_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "mandala"."pegawai"("pegawai_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan_log" ADD CONSTRAINT "permohonan_layanan_log_permohonan_layanan_id_fkey" FOREIGN KEY ("permohonan_layanan_id") REFERENCES "mandala"."permohonan_layanan"("permohonan_layanan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ref"."batas_waktu_rapor" ADD CONSTRAINT "fk_batas_wa_batas_wak_semester" FOREIGN KEY ("semester_id") REFERENCES "ref"."semester"("semester_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."bidang_studi" ADD CONSTRAINT "fk_bidang_s_kelompok_bidang_s" FOREIGN KEY ("kelompok_bidang_studi_id") REFERENCES "ref"."bidang_studi"("bidang_studi_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."group_matpel" ADD CONSTRAINT "fk_group_ma_gmp_kurik_kurikulu" FOREIGN KEY ("kurikulum_id") REFERENCES "ref"."kurikulum"("kurikulum_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."group_matpel" ADD CONSTRAINT "fk_group_ma_gmp_tingk_tingkat_" FOREIGN KEY ("tingkat_pendidikan_id") REFERENCES "ref"."tingkat_pendidikan"("tingkat_pendidikan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."jabatan_ptk" ADD CONSTRAINT "fk_jabatan__jenis_ptk_jenis_pt" FOREIGN KEY ("jenis_ptk_id") REFERENCES "ref"."jenis_ptk"("jenis_ptk_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."jenis_beasiswa" ADD CONSTRAINT "fk_jenis_be_sumber_be_sumber_d" FOREIGN KEY ("sumber_dana_id") REFERENCES "ref"."sumber_dana"("sumber_dana_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."jenis_sertifikasi" ADD CONSTRAINT "fk_jenis_se_sertifika_kebutuha" FOREIGN KEY ("kebutuhan_khusus_id") REFERENCES "ref"."kebutuhan_khusus"("kebutuhan_khusus_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."jurusan" ADD CONSTRAINT "fk_jurusan_induk_pro_jurusan" FOREIGN KEY ("jurusan_induk") REFERENCES "ref"."jurusan"("jurusan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."jurusan" ADD CONSTRAINT "fk_jurusan_jurusan_k_kelompok" FOREIGN KEY ("level_bidang_id") REFERENCES "ref"."kelompok_bidang"("level_bidang_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."jurusan" ADD CONSTRAINT "fk_jurusan_jurusan_s_jenjang_" FOREIGN KEY ("jenjang_pendidikan_id") REFERENCES "ref"."jenjang_pendidikan"("jenjang_pendidikan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."kelompok_bidang" ADD CONSTRAINT "fk_kelompok_induk_kel_kelompok" FOREIGN KEY ("level_bidang_induk") REFERENCES "ref"."kelompok_bidang"("level_bidang_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."kompetensi" ADD CONSTRAINT "fk_kompeten_inti_dasa_kompeten" FOREIGN KEY ("id_inti_dasar") REFERENCES "ref"."kompetensi"("id_komp") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."kompetensi" ADD CONSTRAINT "fk_kompeten_kompetens_kurikulu" FOREIGN KEY ("kurikulum_id") REFERENCES "ref"."kurikulum"("kurikulum_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."kompetensi" ADD CONSTRAINT "fk_kompeten_kompetens_mata_pel" FOREIGN KEY ("mata_pelajaran_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."kompetensi" ADD CONSTRAINT "fk_kompeten_kompetens_tingkat_" FOREIGN KEY ("tingkat_pendidikan_id") REFERENCES "ref"."tingkat_pendidikan"("tingkat_pendidikan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."kurikulum" ADD CONSTRAINT "fk_kurikulu_kurikulum_jenjang_" FOREIGN KEY ("jenjang_pendidikan_id") REFERENCES "ref"."jenjang_pendidikan"("jenjang_pendidikan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."kurikulum" ADD CONSTRAINT "fk_kurikulu_kurikulum_jurusan" FOREIGN KEY ("jurusan_id") REFERENCES "ref"."jurusan"("jurusan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."lemb_sertifikasi" ADD CONSTRAINT "fk_lemb_ser_alamat_ke_mst_wila" FOREIGN KEY ("kode_wilayah") REFERENCES "ref"."mst_wilayah"("kode_wilayah") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."lembaga_akreditasi" ADD CONSTRAINT "fk_lembaga__alamat_ke_mst_wila" FOREIGN KEY ("kode_wilayah") REFERENCES "ref"."mst_wilayah"("kode_wilayah") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."map_bidang_mata_pelajaran" ADD CONSTRAINT "fk_map_bida_map_bidan_bidang_s" FOREIGN KEY ("bidang_studi_id") REFERENCES "ref"."bidang_studi"("bidang_studi_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."map_bidang_mata_pelajaran" ADD CONSTRAINT "fk_map_bida_map_mata__mata_pel" FOREIGN KEY ("mata_pelajaran_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mata_pelajaran" ADD CONSTRAINT "fk_mata_pel_mapel_jur_jurusan" FOREIGN KEY ("jurusan_id") REFERENCES "ref"."jurusan"("jurusan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mata_pelajaran_kurikulum" ADD CONSTRAINT "fk_mata_pel_mapelkur__status_d" FOREIGN KEY ("status_di_kurikulum") REFERENCES "ref"."status_di_kurikulum"("status_di_kurikulum") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mata_pelajaran_kurikulum" ADD CONSTRAINT "fk_mata_pel_matpel_gr_group_ma" FOREIGN KEY ("gmp_id") REFERENCES "ref"."group_matpel"("gmp_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mata_pelajaran_kurikulum" ADD CONSTRAINT "fk_mata_pel_matpelkur_kurikulu" FOREIGN KEY ("kurikulum_id") REFERENCES "ref"."kurikulum"("kurikulum_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mata_pelajaran_kurikulum" ADD CONSTRAINT "fk_mata_pel_matpelkur_mata_pel" FOREIGN KEY ("mata_pelajaran_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mata_pelajaran_kurikulum" ADD CONSTRAINT "fk_mata_pel_matpelkur_tingkat_" FOREIGN KEY ("tingkat_pendidikan_id") REFERENCES "ref"."tingkat_pendidikan"("tingkat_pendidikan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mst_wilayah" ADD CONSTRAINT "fk_mst_wila_kategori__kategori" FOREIGN KEY ("kategori_desa_id") REFERENCES "ref"."kategori_desa"("kategori_desa_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mst_wilayah" ADD CONSTRAINT "fk_mst_wila_level_wil_level_wi" FOREIGN KEY ("id_level_wilayah") REFERENCES "ref"."level_wilayah"("id_level_wilayah") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mst_wilayah" ADD CONSTRAINT "fk_mst_wila_parent_wi_mst_wila" FOREIGN KEY ("mst_kode_wilayah") REFERENCES "ref"."mst_wilayah"("kode_wilayah") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mst_wilayah" ADD CONSTRAINT "fk_mst_wila_propinsi__negara" FOREIGN KEY ("negara_id") REFERENCES "ref"."negara"("negara_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mulok" ADD CONSTRAINT "fk_mulok_mulok_map_mata_pel" FOREIGN KEY ("mata_pelajaran_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."mulok" ADD CONSTRAINT "fk_mulok_mulok_wil_mst_wila" FOREIGN KEY ("kode_wilayah") REFERENCES "ref"."mst_wilayah"("kode_wilayah") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."pemakai_prasarana" ADD CONSTRAINT "fk_pemakai__jur_pemak_jurusan" FOREIGN KEY ("jurusan_id") REFERENCES "ref"."jurusan"("jurusan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."pemakai_prasarana" ADD CONSTRAINT "fk_pemakai__pemakai_p_jenis_pr" FOREIGN KEY ("jenis_prasarana_id") REFERENCES "ref"."jenis_prasarana"("jenis_prasarana_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."pemakai_sarana" ADD CONSTRAINT "fk_pemakai__jur_pemak_jurusan" FOREIGN KEY ("jurusan_id") REFERENCES "ref"."jurusan"("jurusan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."pemakai_sarana" ADD CONSTRAINT "fk_pemakai__pemakai_s_jenis_sa" FOREIGN KEY ("jenis_sarana_id") REFERENCES "ref"."jenis_sarana"("jenis_sarana_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."sasaran_blockgrant" ADD CONSTRAINT "fk_sasaran__sasaran_j_jenis_ba" FOREIGN KEY ("jenis_bantuan_id") REFERENCES "ref"."jenis_bantuan"("jenis_bantuan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."sasaran_blockgrant" ADD CONSTRAINT "fk_sasaran__sasaran_p_jenis_pr" FOREIGN KEY ("jenis_prasarana_id") REFERENCES "ref"."jenis_prasarana"("jenis_prasarana_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."sasaran_blockgrant" ADD CONSTRAINT "fk_sasaran__sasaran_s_jenis_sa" FOREIGN KEY ("jenis_sarana_id") REFERENCES "ref"."jenis_sarana"("jenis_sarana_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."sasaran_blockgrant" ADD CONSTRAINT "fk_sasaran__sasaran_s_sumber_d" FOREIGN KEY ("sumber_dana_id") REFERENCES "ref"."sumber_dana"("sumber_dana_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."sasaran_blockgrant" ADD CONSTRAINT "fk_sasaran__sasaran_t_tahun_aj" FOREIGN KEY ("tahun_ajaran_id") REFERENCES "ref"."tahun_ajaran"("tahun_ajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."semester" ADD CONSTRAINT "fk_semester_semester__tahun_aj" FOREIGN KEY ("tahun_ajaran_id") REFERENCES "ref"."tahun_ajaran"("tahun_ajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."standar_sarana" ADD CONSTRAINT "fk_standar__sarana_st_jenis_sa" FOREIGN KEY ("jenis_sarana_id") REFERENCES "ref"."jenis_sarana"("jenis_sarana_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."standar_sarana" ADD CONSTRAINT "fk_standar__standar_b_bentuk_p" FOREIGN KEY ("bentuk_pendidikan_id") REFERENCES "ref"."bentuk_pendidikan"("bentuk_pendidikan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."standar_sarana" ADD CONSTRAINT "fk_standar__standar_j_jenis_pr" FOREIGN KEY ("jenis_prasarana_id") REFERENCES "ref"."jenis_prasarana"("jenis_prasarana_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."standar_sarana" ADD CONSTRAINT "fk_standar__standar_j_jurusan" FOREIGN KEY ("jurusan_id") REFERENCES "ref"."jurusan"("jurusan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_rapor" ADD CONSTRAINT "fk_template_trapor_mt_mata_pel" FOREIGN KEY ("mata_pelajaran_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_rapor" ADD CONSTRAINT "fk_template_trapor_tu_template" FOREIGN KEY ("template_id") REFERENCES "ref"."template_un"("template_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_un" ADD CONSTRAINT "fk_template_tun_jenja_jenjang_" FOREIGN KEY ("jenjang_pendidikan_id") REFERENCES "ref"."jenjang_pendidikan"("jenjang_pendidikan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_un" ADD CONSTRAINT "fk_template_tun_jurus_jurusan" FOREIGN KEY ("jurusan_id") REFERENCES "ref"."jurusan"("jurusan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_un" ADD CONSTRAINT "fk_template_tun_mtp1_mata_pel" FOREIGN KEY ("mp3_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_un" ADD CONSTRAINT "fk_template_tun_mtp2_mata_pel" FOREIGN KEY ("mp4_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_un" ADD CONSTRAINT "fk_template_tun_mtp3_mata_pel" FOREIGN KEY ("mp7_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_un" ADD CONSTRAINT "fk_template_tun_mtp4_mata_pel" FOREIGN KEY ("mp5_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_un" ADD CONSTRAINT "fk_template_tun_mtp5_mata_pel" FOREIGN KEY ("mp1_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_un" ADD CONSTRAINT "fk_template_tun_mtp6_mata_pel" FOREIGN KEY ("mp2_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_un" ADD CONSTRAINT "fk_template_tun_mtp7_mata_pel" FOREIGN KEY ("mp6_id") REFERENCES "ref"."mata_pelajaran"("mata_pelajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."template_un" ADD CONSTRAINT "fk_template_tun_tahun_tahun_aj" FOREIGN KEY ("tahun_ajaran_id") REFERENCES "ref"."tahun_ajaran"("tahun_ajaran_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."tetangga_kabkota" ADD CONSTRAINT "fk_tetangga_kabkota_1_mst_wila" FOREIGN KEY ("kode_wilayah1") REFERENCES "ref"."mst_wilayah"("kode_wilayah") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."tetangga_kabkota" ADD CONSTRAINT "fk_tetangga_kabkota_2_mst_wila" FOREIGN KEY ("kode_wilayah2") REFERENCES "ref"."mst_wilayah"("kode_wilayah") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "ref"."tingkat_pendidikan" ADD CONSTRAINT "fk_tingkat__tingkat_j_jenjang_" FOREIGN KEY ("jenjang_pendidikan_id") REFERENCES "ref"."jenjang_pendidikan"("jenjang_pendidikan_id") ON DELETE RESTRICT ON UPDATE RESTRICT;

