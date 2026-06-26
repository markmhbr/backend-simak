/*
  Warnings:

  - You are about to drop the column `created_at` on the `anggota_rombel` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_pendaftaran_id_str` on the `anggota_rombel` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `anggota_rombel` table. All the data in the column will be lost.
  - The `jenis_pendaftaran_id` column on the `anggota_rombel` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `pembelajaran` table. All the data in the column will be lost.
  - You are about to drop the column `mata_pelajaran_id_str` on the `pembelajaran` table. All the data in the column will be lost.
  - You are about to drop the column `ptk_id_str` on the `pembelajaran` table. All the data in the column will be lost.
  - You are about to drop the column `status_di_kurikulum_str` on the `pembelajaran` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `pembelajaran` table. All the data in the column will be lost.
  - The `mata_pelajaran_id` column on the `pembelajaran` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jam_mengajar_per_minggu` column on the `pembelajaran` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status_di_kurikulum` column on the `pembelajaran` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `created_at` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `id_ekskul` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `id_kelas_ekskul` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `id_ruang_str` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_rombel_str` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `jurusan_id` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `jurusan_id_str` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `kurikulum_id_str` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `nm_ekskul` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `ptk_id_str` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `sk_ekskul` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `tingkat_pendidikan_id_str` on the `rombongan_belajar` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `rombongan_belajar` table. All the data in the column will be lost.
  - The `tingkat_pendidikan_id` column on the `rombongan_belajar` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jenis_rombel` column on the `rombongan_belajar` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `moving_class` column on the `rombongan_belajar` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `last_update` to the `anggota_rombel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_update` to the `pembelajaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_update` to the `rombongan_belajar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dapodik"."anggota_rombel" DROP COLUMN "created_at",
DROP COLUMN "jenis_pendaftaran_id_str",
DROP COLUMN "updated_at",
ADD COLUMN     "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_sync" TIMESTAMP(3),
ADD COLUMN     "last_update" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "soft_delete" DECIMAL,
ADD COLUMN     "updater_id" UUID,
DROP COLUMN "jenis_pendaftaran_id",
ADD COLUMN     "jenis_pendaftaran_id" DECIMAL;

-- AlterTable
ALTER TABLE "dapodik"."pembelajaran" DROP COLUMN "created_at",
DROP COLUMN "mata_pelajaran_id_str",
DROP COLUMN "ptk_id_str",
DROP COLUMN "status_di_kurikulum_str",
DROP COLUMN "updated_at",
ADD COLUMN     "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "last_sync" TIMESTAMP(3),
ADD COLUMN     "last_update" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "semester_id" TEXT,
ADD COLUMN     "sk_mengajar" TEXT,
ADD COLUMN     "soft_delete" DECIMAL,
ADD COLUMN     "tanggal_sk_mengajar" DATE,
ADD COLUMN     "updater_id" UUID,
DROP COLUMN "mata_pelajaran_id",
ADD COLUMN     "mata_pelajaran_id" INTEGER,
DROP COLUMN "jam_mengajar_per_minggu",
ADD COLUMN     "jam_mengajar_per_minggu" DECIMAL,
DROP COLUMN "status_di_kurikulum",
ADD COLUMN     "status_di_kurikulum" DECIMAL;

-- AlterTable
ALTER TABLE "dapodik"."rombongan_belajar" DROP COLUMN "created_at",
DROP COLUMN "id_ekskul",
DROP COLUMN "id_kelas_ekskul",
DROP COLUMN "id_ruang_str",
DROP COLUMN "jenis_rombel_str",
DROP COLUMN "jurusan_id",
DROP COLUMN "jurusan_id_str",
DROP COLUMN "kurikulum_id_str",
DROP COLUMN "nm_ekskul",
DROP COLUMN "ptk_id_str",
DROP COLUMN "sk_ekskul",
DROP COLUMN "tingkat_pendidikan_id_str",
DROP COLUMN "updated_at",
ADD COLUMN     "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "jurusan_sp_id" UUID,
ADD COLUMN     "kebutuhan_khusus_id" INTEGER,
ADD COLUMN     "last_sync" TIMESTAMP(3),
ADD COLUMN     "last_update" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sks" DECIMAL,
ADD COLUMN     "soft_delete" DECIMAL,
ADD COLUMN     "tanggal_mulai" DATE,
ADD COLUMN     "tanggal_selesai" DATE,
ADD COLUMN     "updater_id" UUID,
DROP COLUMN "tingkat_pendidikan_id",
ADD COLUMN     "tingkat_pendidikan_id" DECIMAL,
DROP COLUMN "jenis_rombel",
ADD COLUMN     "jenis_rombel" DECIMAL,
DROP COLUMN "moving_class",
ADD COLUMN     "moving_class" DECIMAL;
