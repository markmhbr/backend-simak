/*
  Warnings:

  - You are about to drop the `pengaturan_jam` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sekolah_id,jenis_jadwal_id,rombongan_belajar_id,hari,urutan]` on the table `jadwal_pelajaran` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jenis_jadwal_id` to the `jadwal_pelajaran` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "simak"."jadwal_pelajaran" DROP CONSTRAINT "jadwal_pelajaran_sekolah_id_hari_urutan_fkey";

-- DropForeignKey
ALTER TABLE "simak"."pengaturan_jam" DROP CONSTRAINT "pengaturan_jam_sekolah_id_fkey";

-- DropIndex
DROP INDEX "simak"."jadwal_pelajaran_sekolah_id_rombongan_belajar_id_hari_uruta_key";

-- AlterTable
ALTER TABLE "dapodik"."pembelajaran" ADD COLUMN     "ptk_id_str" TEXT;

-- AlterTable
ALTER TABLE "simak"."jadwal_pelajaran" ADD COLUMN     "aktif" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "jenis_jadwal_id" UUID NOT NULL;

-- DropTable
DROP TABLE "simak"."pengaturan_jam";

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

    CONSTRAINT "izin_pkey" PRIMARY KEY ("izin_id")
);

-- CreateTable
CREATE TABLE "simak"."absensi_peserta_didik" (
    "peserta_didik_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "jam_masuk" TIMESTAMPTZ(6),
    "jam_pulang" TIMESTAMPTZ(6),
    "status_masuk" SMALLINT,
    "status_pulang" SMALLINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "absensi_peserta_didik_pkey" PRIMARY KEY ("peserta_didik_id","tanggal")
);

-- CreateTable
CREATE TABLE "simak"."absensi_gtk" (
    "ptk_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "jam_masuk" TIMESTAMPTZ(6),
    "jam_pulang" TIMESTAMPTZ(6),
    "status_masuk" SMALLINT,
    "status_pulang" SMALLINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "absensi_gtk_pkey" PRIMARY KEY ("ptk_id","tanggal")
);

-- CreateTable
CREATE TABLE "simak"."absensi_mapel" (
    "jadwal_pelajaran_id" UUID NOT NULL,
    "peserta_didik_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "status" SMALLINT NOT NULL,
    "waktu_absen" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "absensi_mapel_pkey" PRIMARY KEY ("jadwal_pelajaran_id","peserta_didik_id","tanggal")
);

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
CREATE INDEX "absensi_peserta_didik_sekolah_id_tanggal_idx" ON "simak"."absensi_peserta_didik"("sekolah_id", "tanggal");

-- CreateIndex
CREATE INDEX "absensi_gtk_sekolah_id_tanggal_idx" ON "simak"."absensi_gtk"("sekolah_id", "tanggal");

-- CreateIndex
CREATE INDEX "absensi_mapel_sekolah_id_idx" ON "simak"."absensi_mapel"("sekolah_id");

-- CreateIndex
CREATE INDEX "anggota_rombel_rombongan_belajar_id_idx" ON "dapodik"."anggota_rombel"("rombongan_belajar_id");

-- CreateIndex
CREATE INDEX "anggota_rombel_sekolah_id_idx" ON "dapodik"."anggota_rombel"("sekolah_id");

-- CreateIndex
CREATE INDEX "gtks_sekolah_id_idx" ON "dapodik"."gtks"("sekolah_id");

-- CreateIndex
CREATE INDEX "gtks_qr_token_idx" ON "dapodik"."gtks"("qr_token");

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
CREATE INDEX "rombongan_belajar_sekolah_id_idx" ON "dapodik"."rombongan_belajar"("sekolah_id");

-- CreateIndex
CREATE INDEX "jadwal_pelajaran_jenis_jadwal_id_idx" ON "simak"."jadwal_pelajaran"("jenis_jadwal_id");

-- CreateIndex
CREATE UNIQUE INDEX "jadwal_pelajaran_sekolah_id_jenis_jadwal_id_rombongan_belaj_key" ON "simak"."jadwal_pelajaran"("sekolah_id", "jenis_jadwal_id", "rombongan_belajar_id", "hari", "urutan");

-- AddForeignKey
ALTER TABLE "dapodik"."pembelajaran" ADD CONSTRAINT "pembelajaran_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jenis_jadwal" ADD CONSTRAINT "jenis_jadwal_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_jadwal_hari" ADD CONSTRAINT "pengaturan_jadwal_hari_jenis_jadwal_id_fkey" FOREIGN KEY ("jenis_jadwal_id") REFERENCES "simak"."jenis_jadwal"("jenis_jadwal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_jadwal" ADD CONSTRAINT "pengaturan_jadwal_jenis_jadwal_id_fkey" FOREIGN KEY ("jenis_jadwal_id") REFERENCES "simak"."jenis_jadwal"("jenis_jadwal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_jenis_jadwal_id_fkey" FOREIGN KEY ("jenis_jadwal_id") REFERENCES "simak"."jenis_jadwal"("jenis_jadwal_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."hari_libur" ADD CONSTRAINT "hari_libur_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."izin" ADD CONSTRAINT "izin_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."izin" ADD CONSTRAINT "izin_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."izin" ADD CONSTRAINT "izin_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."absensi_peserta_didik" ADD CONSTRAINT "absensi_peserta_didik_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."absensi_peserta_didik" ADD CONSTRAINT "absensi_peserta_didik_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."absensi_gtk" ADD CONSTRAINT "absensi_gtk_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."absensi_gtk" ADD CONSTRAINT "absensi_gtk_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."absensi_mapel" ADD CONSTRAINT "absensi_mapel_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."absensi_mapel" ADD CONSTRAINT "absensi_mapel_jadwal_pelajaran_id_fkey" FOREIGN KEY ("jadwal_pelajaran_id") REFERENCES "simak"."jadwal_pelajaran"("jadwal_pelajaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."absensi_mapel" ADD CONSTRAINT "absensi_mapel_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;
