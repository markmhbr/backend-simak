/*
  Warnings:

  - You are about to drop the column `bentuk_pendidikan_id_str` on the `sekolah` table. All the data in the column will be lost.
  - You are about to drop the column `kebutuhan_khusus_id_str` on the `sekolah` table. All the data in the column will be lost.
  - You are about to drop the column `kode_wilayah_str` on the `sekolah` table. All the data in the column will be lost.
  - You are about to drop the column `vld_count` on the `sekolah` table. All the data in the column will be lost.
  - You are about to drop the column `yayasan_id_str` on the `sekolah` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dapodik"."sekolah" DROP COLUMN "bentuk_pendidikan_id_str",
DROP COLUMN "kebutuhan_khusus_id_str",
DROP COLUMN "kode_wilayah_str",
DROP COLUMN "vld_count",
DROP COLUMN "yayasan_id_str";
