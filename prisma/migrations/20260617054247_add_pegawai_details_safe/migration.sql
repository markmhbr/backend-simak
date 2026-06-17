/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `pegawai` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "mandala"."pegawai" ADD COLUMN     "alamat_lengkap" TEXT,
ADD COLUMN     "nik" VARCHAR(16),
ADD COLUMN     "tanggal_lahir" DATE,
ADD COLUMN     "tempat_lahir" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_nik_key" ON "mandala"."pegawai"("nik");

-- CreateIndex
CREATE INDEX "pegawai_nik_idx" ON "mandala"."pegawai"("nik");
