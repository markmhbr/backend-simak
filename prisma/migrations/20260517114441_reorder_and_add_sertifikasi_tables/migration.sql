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

-- AddForeignKey
ALTER TABLE "dapodik"."rwy_sertifikasi" ADD CONSTRAINT "rwy_sertifikasi_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."rwy_sertifikasi" ADD CONSTRAINT "rwy_sertifikasi_bidang_studi_id_fkey" FOREIGN KEY ("bidang_studi_id") REFERENCES "dapodik"."bidang_studi"("bidang_studi_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."rwy_sertifikasi" ADD CONSTRAINT "rwy_sertifikasi_kode_lemb_sert_fkey" FOREIGN KEY ("kode_lemb_sert") REFERENCES "dapodik"."lemb_sertifikasi"("kode_lemb_sert") ON DELETE SET NULL ON UPDATE CASCADE;
