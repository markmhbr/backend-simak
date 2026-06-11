/*
  Warnings:

  - You are about to drop the `absensi_gtk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `absensi_mapel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `absensi_peserta_didik` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "simak"."absensi_gtk" DROP CONSTRAINT "absensi_gtk_ptk_id_fkey";

-- DropForeignKey
ALTER TABLE "simak"."absensi_gtk" DROP CONSTRAINT "absensi_gtk_sekolah_id_fkey";

-- DropForeignKey
ALTER TABLE "simak"."absensi_mapel" DROP CONSTRAINT "absensi_mapel_jadwal_pelajaran_id_fkey";

-- DropForeignKey
ALTER TABLE "simak"."absensi_mapel" DROP CONSTRAINT "absensi_mapel_peserta_didik_id_fkey";

-- DropForeignKey
ALTER TABLE "simak"."absensi_mapel" DROP CONSTRAINT "absensi_mapel_sekolah_id_fkey";

-- DropForeignKey
ALTER TABLE "simak"."absensi_peserta_didik" DROP CONSTRAINT "absensi_peserta_didik_peserta_didik_id_fkey";

-- DropForeignKey
ALTER TABLE "simak"."absensi_peserta_didik" DROP CONSTRAINT "absensi_peserta_didik_sekolah_id_fkey";

-- DropTable
DROP TABLE "simak"."absensi_gtk";

-- DropTable
DROP TABLE "simak"."absensi_mapel";

-- DropTable
DROP TABLE "simak"."absensi_peserta_didik";

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

-- CreateIndex
CREATE INDEX "presensi_peserta_didik_sekolah_id_tanggal_idx" ON "simak"."presensi_peserta_didik"("sekolah_id", "tanggal");

-- CreateIndex
CREATE INDEX "presensi_gtk_sekolah_id_tanggal_idx" ON "simak"."presensi_gtk"("sekolah_id", "tanggal");

-- CreateIndex
CREATE INDEX "presensi_mapel_sekolah_id_idx" ON "simak"."presensi_mapel"("sekolah_id");

-- AddForeignKey
ALTER TABLE "simak"."presensi_peserta_didik" ADD CONSTRAINT "presensi_peserta_didik_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_peserta_didik" ADD CONSTRAINT "presensi_peserta_didik_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_gtk" ADD CONSTRAINT "presensi_gtk_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_gtk" ADD CONSTRAINT "presensi_gtk_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_mapel" ADD CONSTRAINT "presensi_mapel_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_mapel" ADD CONSTRAINT "presensi_mapel_jadwal_pelajaran_id_fkey" FOREIGN KEY ("jadwal_pelajaran_id") REFERENCES "simak"."jadwal_pelajaran"("jadwal_pelajaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."presensi_mapel" ADD CONSTRAINT "presensi_mapel_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;
