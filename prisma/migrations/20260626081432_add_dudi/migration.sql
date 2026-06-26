/*
  Warnings:

  - You are about to drop the `bidang_studi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lemb_sertifikasi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "dapodik"."rwy_sertifikasi" DROP CONSTRAINT "rwy_sertifikasi_bidang_studi_id_fkey";

-- DropForeignKey
ALTER TABLE "dapodik"."rwy_sertifikasi" DROP CONSTRAINT "rwy_sertifikasi_kode_lemb_sert_fkey";

-- DropTable
DROP TABLE "dapodik"."bidang_studi";

-- DropTable
DROP TABLE "dapodik"."lemb_sertifikasi";

-- CreateTable
CREATE TABLE "dapodik"."dudi" (
    "dudi_id" UUID NOT NULL,
    "sekolah_id" UUID,
    "nama" TEXT NOT NULL,
    "bidang_usaha_id" CHAR(10),
    "nama_bidang_usaha" TEXT,
    "alamat_jalan" TEXT,
    "rt" TEXT,
    "rw" TEXT,
    "nama_dusun" TEXT,
    "desa_kelurahan" TEXT,
    "kode_wilayah" TEXT,
    "kode_pos" TEXT,
    "lintang" DECIMAL,
    "bujur" DECIMAL,
    "nomor_telepon" TEXT,
    "nomor_fax" TEXT,
    "email" TEXT,
    "website" TEXT,
    "npwp" TEXT,
    "nama_cp" TEXT,
    "no_hp_cp" TEXT,
    "soft_delete" DECIMAL,
    "create_date" TIMESTAMP(6),
    "last_update" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6),
    "updater_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dudi_pkey" PRIMARY KEY ("dudi_id")
);

-- CreateTable
CREATE TABLE "dapodik"."mou" (
    "mou_id" UUID NOT NULL,
    "dudi_id" UUID NOT NULL,
    "sekolah_id" UUID,
    "nomor_mou" TEXT,
    "judul_mou" TEXT,
    "tanggal_mulai" DATE,
    "tanggal_selesai" DATE,
    "keterangan" TEXT,
    "soft_delete" DECIMAL,
    "create_date" TIMESTAMP(6),
    "last_update" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6),
    "updater_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mou_pkey" PRIMARY KEY ("mou_id")
);

-- CreateTable
CREATE TABLE "dapodik"."akt_pd" (
    "id_akt_pd" UUID NOT NULL,
    "mou_id" UUID NOT NULL,
    "sekolah_id" UUID,
    "jenis_akt_pd" TEXT,
    "judul_akt_pd" TEXT,
    "sk_tugas" TEXT,
    "tanggal_sk_tugas" DATE,
    "tanggal_mulai" DATE,
    "tanggal_selesai" DATE,
    "lokasi" TEXT,
    "soft_delete" DECIMAL,
    "create_date" TIMESTAMP(6),
    "last_update" TIMESTAMP(6),
    "last_sync" TIMESTAMP(6),
    "updater_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "akt_pd_pkey" PRIMARY KEY ("id_akt_pd")
);

-- CreateTable
CREATE TABLE "dapodik"."anggota_akt_pd" (
    "anggota_akt_pd_id" UUID NOT NULL,
    "id_akt_pd" UUID NOT NULL,
    "sekolah_id" UUID,
    "registrasi_id" UUID,
    "peserta_didik_id" UUID,
    "soft_delete" DECIMAL,
    "create_date" TIMESTAMP(6),
    "last_update" TIMESTAMP(6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_akt_pd_pkey" PRIMARY KEY ("anggota_akt_pd_id")
);

-- CreateTable
CREATE TABLE "dapodik"."bimbing_pd" (
    "bimbing_pd_id" UUID NOT NULL,
    "id_akt_pd" UUID NOT NULL,
    "sekolah_id" UUID,
    "ptk_id" UUID,
    "urutan_pembimbing" INTEGER,
    "soft_delete" DECIMAL,
    "create_date" TIMESTAMP(6),
    "last_update" TIMESTAMP(6),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bimbing_pd_pkey" PRIMARY KEY ("bimbing_pd_id")
);

-- CreateIndex
CREATE INDEX "dudi_sekolah_id_idx" ON "dapodik"."dudi"("sekolah_id");

-- CreateIndex
CREATE INDEX "mou_dudi_id_idx" ON "dapodik"."mou"("dudi_id");

-- CreateIndex
CREATE INDEX "mou_sekolah_id_idx" ON "dapodik"."mou"("sekolah_id");

-- CreateIndex
CREATE INDEX "akt_pd_mou_id_idx" ON "dapodik"."akt_pd"("mou_id");

-- CreateIndex
CREATE INDEX "akt_pd_sekolah_id_idx" ON "dapodik"."akt_pd"("sekolah_id");

-- CreateIndex
CREATE INDEX "anggota_akt_pd_id_akt_pd_idx" ON "dapodik"."anggota_akt_pd"("id_akt_pd");

-- CreateIndex
CREATE INDEX "anggota_akt_pd_sekolah_id_idx" ON "dapodik"."anggota_akt_pd"("sekolah_id");

-- CreateIndex
CREATE INDEX "anggota_akt_pd_peserta_didik_id_idx" ON "dapodik"."anggota_akt_pd"("peserta_didik_id");

-- CreateIndex
CREATE INDEX "bimbing_pd_id_akt_pd_idx" ON "dapodik"."bimbing_pd"("id_akt_pd");

-- CreateIndex
CREATE INDEX "bimbing_pd_sekolah_id_idx" ON "dapodik"."bimbing_pd"("sekolah_id");

-- CreateIndex
CREATE INDEX "bimbing_pd_ptk_id_idx" ON "dapodik"."bimbing_pd"("ptk_id");

-- AddForeignKey
ALTER TABLE "dapodik"."mou" ADD CONSTRAINT "mou_dudi_id_fkey" FOREIGN KEY ("dudi_id") REFERENCES "dapodik"."dudi"("dudi_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."akt_pd" ADD CONSTRAINT "akt_pd_mou_id_fkey" FOREIGN KEY ("mou_id") REFERENCES "dapodik"."mou"("mou_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."anggota_akt_pd" ADD CONSTRAINT "anggota_akt_pd_id_akt_pd_fkey" FOREIGN KEY ("id_akt_pd") REFERENCES "dapodik"."akt_pd"("id_akt_pd") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."anggota_akt_pd" ADD CONSTRAINT "anggota_akt_pd_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."bimbing_pd" ADD CONSTRAINT "bimbing_pd_id_akt_pd_fkey" FOREIGN KEY ("id_akt_pd") REFERENCES "dapodik"."akt_pd"("id_akt_pd") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."bimbing_pd" ADD CONSTRAINT "bimbing_pd_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;
