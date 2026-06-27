/*
  Warnings:

  - You are about to drop the column `pesertaDidikPeserta_didik_id` on the `anggota_akt_pd` table. All the data in the column will be lost.
  - You are about to drop the column `bidang_studi_id_str` on the `riwayat_pendidikan_formal` table. All the data in the column will be lost.
  - You are about to drop the column `gelar_akademik_id_str` on the `riwayat_pendidikan_formal` table. All the data in the column will be lost.
  - You are about to drop the column `jenjang_pendidikan_id_str` on the `riwayat_pendidikan_formal` table. All the data in the column will be lost.
  - The `kependidikan` column on the `riwayat_pendidikan_formal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tahun_masuk` column on the `riwayat_pendidikan_formal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tahun_lulus` column on the `riwayat_pendidikan_formal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status_kuliah` column on the `riwayat_pendidikan_formal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `semester` column on the `riwayat_pendidikan_formal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ipk` column on the `riwayat_pendidikan_formal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `prodi` column on the `riwayat_pendidikan_formal` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id_reg_pd` column on the `riwayat_pendidikan_formal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "dapodik"."anggota_akt_pd" DROP CONSTRAINT "anggota_akt_pd_pesertaDidikPeserta_didik_id_fkey";

-- AlterTable
ALTER TABLE "dapodik"."anggota_akt_pd" DROP COLUMN "pesertaDidikPeserta_didik_id";

-- AlterTable
ALTER TABLE "dapodik"."riwayat_pendidikan_formal" DROP COLUMN "bidang_studi_id_str",
DROP COLUMN "gelar_akademik_id_str",
DROP COLUMN "jenjang_pendidikan_id_str",
ADD COLUMN     "bidang_studi_id" INTEGER,
ADD COLUMN     "gelar_akademik_id" INTEGER,
ADD COLUMN     "jenjang_pendidikan_id" DECIMAL(2,0),
DROP COLUMN "kependidikan",
ADD COLUMN     "kependidikan" DECIMAL(1,0),
DROP COLUMN "tahun_masuk",
ADD COLUMN     "tahun_masuk" DECIMAL(4,0),
DROP COLUMN "tahun_lulus",
ADD COLUMN     "tahun_lulus" DECIMAL(4,0),
DROP COLUMN "status_kuliah",
ADD COLUMN     "status_kuliah" DECIMAL(1,0),
DROP COLUMN "semester",
ADD COLUMN     "semester" DECIMAL(2,0),
DROP COLUMN "ipk",
ADD COLUMN     "ipk" DECIMAL(5,2),
DROP COLUMN "prodi",
ADD COLUMN     "prodi" UUID,
DROP COLUMN "id_reg_pd",
ADD COLUMN     "id_reg_pd" UUID;

-- AddForeignKey
ALTER TABLE "dapodik"."mou" ADD CONSTRAINT "mou_dudi_id_fkey" FOREIGN KEY ("dudi_id") REFERENCES "dapodik"."dudi"("dudi_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."akt_pd" ADD CONSTRAINT "akt_pd_mou_id_fkey" FOREIGN KEY ("mou_id") REFERENCES "dapodik"."mou"("mou_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."anggota_akt_pd" ADD CONSTRAINT "anggota_akt_pd_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."riwayat_pendidikan_formal" ADD CONSTRAINT "riwayat_pendidikan_formal_jenjang_pendidikan_id_fkey" FOREIGN KEY ("jenjang_pendidikan_id") REFERENCES "ref"."jenjang_pendidikan"("jenjang_pendidikan_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
