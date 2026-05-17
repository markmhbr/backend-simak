-- CreateTable
CREATE TABLE "dapodik"."sekolah" (
    "sekolah_id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "nss" TEXT,
    "npsn" TEXT,
    "bentuk_pendidikan_id" INTEGER,
    "bentuk_pendidikan_id_str" TEXT,
    "status_sekolah" TEXT,
    "status_sekolah_str" TEXT,
    "alamat_jalan" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "kode_wilayah" TEXT,
    "kode_pos" TEXT,
    "nomor_telepon" TEXT,
    "nomor_fax" TEXT,
    "email" TEXT,
    "website" TEXT,
    "is_sks" BOOLEAN DEFAULT false,
    "lintang" DECIMAL(65,30),
    "bujur" DECIMAL(65,30),
    "dusun" TEXT,
    "desa_kelurahan" TEXT,
    "kecamatan" TEXT,
    "kabupaten_kota" TEXT,
    "provinsi" TEXT,
    "cadisdik_id" TEXT,
    "cadisdik_edit_count" INTEGER NOT NULL DEFAULT 0,
    "spmb" TEXT,
    "logo" TEXT,
    "background_kartu_gtk" TEXT,
    "background_kartu_pesertadidik" TEXT,
    "peta" TEXT,
    "social_media" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sekolah_pkey" PRIMARY KEY ("sekolah_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sekolah_npsn_key" ON "dapodik"."sekolah"("npsn");
