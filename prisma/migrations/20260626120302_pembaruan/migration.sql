-- DropForeignKey
ALTER TABLE "dapodik"."akt_pd" DROP CONSTRAINT "akt_pd_mou_id_fkey";

-- DropForeignKey
ALTER TABLE "dapodik"."anggota_akt_pd" DROP CONSTRAINT "anggota_akt_pd_id_akt_pd_fkey";

-- DropForeignKey
ALTER TABLE "dapodik"."anggota_akt_pd" DROP CONSTRAINT "anggota_akt_pd_peserta_didik_id_fkey";

-- DropForeignKey
ALTER TABLE "dapodik"."bimbing_pd" DROP CONSTRAINT "bimbing_pd_id_akt_pd_fkey";

-- DropForeignKey
ALTER TABLE "dapodik"."bimbing_pd" DROP CONSTRAINT "bimbing_pd_ptk_id_fkey";

-- DropForeignKey
ALTER TABLE "dapodik"."mou" DROP CONSTRAINT "mou_dudi_id_fkey";

-- AlterTable
ALTER TABLE "dapodik"."anggota_akt_pd" ADD COLUMN     "aktPdId_akt_pd" UUID,
ADD COLUMN     "pesertaDidikPeserta_didik_id" UUID;

-- AlterTable
ALTER TABLE "dapodik"."bimbing_pd" ADD COLUMN     "aktPdId_akt_pd" UUID,
ADD COLUMN     "gtkPtk_id" UUID;

-- AddForeignKey
ALTER TABLE "dapodik"."anggota_akt_pd" ADD CONSTRAINT "anggota_akt_pd_pesertaDidikPeserta_didik_id_fkey" FOREIGN KEY ("pesertaDidikPeserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."anggota_akt_pd" ADD CONSTRAINT "anggota_akt_pd_aktPdId_akt_pd_fkey" FOREIGN KEY ("aktPdId_akt_pd") REFERENCES "dapodik"."akt_pd"("id_akt_pd") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."bimbing_pd" ADD CONSTRAINT "bimbing_pd_gtkPtk_id_fkey" FOREIGN KEY ("gtkPtk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."bimbing_pd" ADD CONSTRAINT "bimbing_pd_aktPdId_akt_pd_fkey" FOREIGN KEY ("aktPdId_akt_pd") REFERENCES "dapodik"."akt_pd"("id_akt_pd") ON DELETE SET NULL ON UPDATE CASCADE;
