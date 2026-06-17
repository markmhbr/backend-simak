/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `pegawai` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `alamat_lengkap` to the `pegawai` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nik` to the `pegawai` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_lahir` to the `pegawai` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempat_lahir` to the `pegawai` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mandala"."pegawai" ADD COLUMN     "alamat_lengkap" TEXT NOT NULL,
ADD COLUMN     "nik" VARCHAR(16) NOT NULL,
ADD COLUMN     "tanggal_lahir" DATE NOT NULL,
ADD COLUMN     "tempat_lahir" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_nik_key" ON "mandala"."pegawai"("nik");

-- CreateIndex
CREATE INDEX "pegawai_nik_idx" ON "mandala"."pegawai"("nik");
