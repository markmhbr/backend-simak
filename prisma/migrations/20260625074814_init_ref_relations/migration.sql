/*
  Warnings:

  - You are about to drop the column `agama_id_str` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `bidang_studi_terakhir` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `dusun` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `jabatan_ptk_id_str` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_ptk_id_str` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `kabupaten_kota` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `keahlian_bahasa_isyarat` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `keahlian_laboratorium` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `kecamatan` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `kode` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `lembaga_pengangkat` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `lisensi_kepsek` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `mampu_menangani_kebutuhan_khusus` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `nama_kcp` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `nama_wajib_pajak` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `no_wa` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `pangkat_golongan_terakhir` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `pendidikan_terakhir` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `provinsi` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `rwy_kepangkatan` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `sk_mengajar` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `status_kepegawaian_id_str` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `sumber_gaji` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `tandatangan` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `tmt_cpns` on the `gtks` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `gtks` table. All the data in the column will be lost.
  - The `tahun_ajaran_id` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ptk_induk` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `agama_id` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status_perkawinan` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `pekerjaan_suami_istri` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jenis_ptk_id` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jabatan_ptk_id` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status_kepegawaian_id` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `keahlian_braille` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rt` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rw` column on the `gtks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `last_update` to the `gtks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dapodik"."gtks" DROP COLUMN "agama_id_str",
DROP COLUMN "bidang_studi_terakhir",
DROP COLUMN "created_at",
DROP COLUMN "dusun",
DROP COLUMN "jabatan_ptk_id_str",
DROP COLUMN "jenis_ptk_id_str",
DROP COLUMN "kabupaten_kota",
DROP COLUMN "keahlian_bahasa_isyarat",
DROP COLUMN "keahlian_laboratorium",
DROP COLUMN "kecamatan",
DROP COLUMN "kode",
DROP COLUMN "lembaga_pengangkat",
DROP COLUMN "lisensi_kepsek",
DROP COLUMN "mampu_menangani_kebutuhan_khusus",
DROP COLUMN "nama_kcp",
DROP COLUMN "nama_wajib_pajak",
DROP COLUMN "no_wa",
DROP COLUMN "pangkat_golongan_terakhir",
DROP COLUMN "pendidikan_terakhir",
DROP COLUMN "provinsi",
DROP COLUMN "rwy_kepangkatan",
DROP COLUMN "sk_mengajar",
DROP COLUMN "status_kepegawaian_id_str",
DROP COLUMN "sumber_gaji",
DROP COLUMN "tandatangan",
DROP COLUMN "tmt_cpns",
DROP COLUMN "updated_at",
ADD COLUMN     "blob_id" UUID,
ADD COLUMN     "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "jenis_keluar_id" TEXT,
ADD COLUMN     "jumlah_sekolah_binaan" SMALLINT,
ADD COLUMN     "karpas" TEXT,
ADD COLUMN     "karpeg" TEXT,
ADD COLUMN     "keahlian_bhs_isyarat" DECIMAL,
ADD COLUMN     "keahlian_laboratorium_id" SMALLINT,
ADD COLUMN     "kebutuhan_khusus_id" INTEGER,
ADD COLUMN     "kode_wilayah" TEXT,
ADD COLUMN     "last_sync" TIMESTAMP(3),
ADD COLUMN     "last_update" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "lembaga_pengangkat_id" DECIMAL,
ADD COLUMN     "mampu_handle_kk" INTEGER,
ADD COLUMN     "nama_dusun" TEXT,
ADD COLUMN     "nip_suami_istri" TEXT,
ADD COLUMN     "nm_wp" TEXT,
ADD COLUMN     "nomor_surat_tugas" TEXT,
ADD COLUMN     "pangkat_golongan_id" DECIMAL,
ADD COLUMN     "pengawas_bidang_studi_id" INTEGER,
ADD COLUMN     "pernah_diklat_kepengawasan" DECIMAL,
ADD COLUMN     "soft_delete" DECIMAL,
ADD COLUMN     "status_data" INTEGER,
ADD COLUMN     "status_keaktifan_id" DECIMAL,
ADD COLUMN     "sudah_lisensi_kepala_sekolah" DECIMAL,
ADD COLUMN     "sumber_gaji_id" DECIMAL,
ADD COLUMN     "tgl_cpns" DATE,
ADD COLUMN     "tgl_ptk_keluar" DATE,
ADD COLUMN     "tmt_tugas" DATE,
ADD COLUMN     "updater_id" UUID,
DROP COLUMN "tahun_ajaran_id",
ADD COLUMN     "tahun_ajaran_id" DECIMAL,
DROP COLUMN "ptk_induk",
ADD COLUMN     "ptk_induk" DECIMAL,
DROP COLUMN "agama_id",
ADD COLUMN     "agama_id" SMALLINT,
ALTER COLUMN "kewarganegaraan" DROP DEFAULT,
DROP COLUMN "status_perkawinan",
ADD COLUMN     "status_perkawinan" DECIMAL,
DROP COLUMN "pekerjaan_suami_istri",
ADD COLUMN     "pekerjaan_suami_istri" INTEGER,
DROP COLUMN "jenis_ptk_id",
ADD COLUMN     "jenis_ptk_id" DECIMAL,
DROP COLUMN "jabatan_ptk_id",
ADD COLUMN     "jabatan_ptk_id" DECIMAL,
DROP COLUMN "status_kepegawaian_id",
ADD COLUMN     "status_kepegawaian_id" SMALLINT,
DROP COLUMN "keahlian_braille",
ADD COLUMN     "keahlian_braille" DECIMAL,
DROP COLUMN "rt",
ADD COLUMN     "rt" DECIMAL,
DROP COLUMN "rw",
ADD COLUMN     "rw" DECIMAL,
ALTER COLUMN "lintang" SET DATA TYPE DECIMAL,
ALTER COLUMN "bujur" SET DATA TYPE DECIMAL;

-- AddForeignKey
ALTER TABLE "dapodik"."gtks" ADD CONSTRAINT "gtks_jenis_ptk_id_fkey" FOREIGN KEY ("jenis_ptk_id") REFERENCES "ref"."jenis_ptk"("jenis_ptk_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dapodik"."gtks" ADD CONSTRAINT "gtks_status_kepegawaian_id_fkey" FOREIGN KEY ("status_kepegawaian_id") REFERENCES "ref"."status_kepegawaian"("status_kepegawaian_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dapodik"."gtks" ADD CONSTRAINT "gtks_jabatan_ptk_id_fkey" FOREIGN KEY ("jabatan_ptk_id") REFERENCES "ref"."jabatan_ptk"("jabatan_ptk_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dapodik"."gtks" ADD CONSTRAINT "gtks_sumber_gaji_id_fkey" FOREIGN KEY ("sumber_gaji_id") REFERENCES "ref"."sumber_gaji"("sumber_gaji_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dapodik"."gtks" ADD CONSTRAINT "gtks_agama_id_fkey" FOREIGN KEY ("agama_id") REFERENCES "ref"."agama"("agama_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
