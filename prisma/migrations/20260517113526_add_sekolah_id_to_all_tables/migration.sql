-- AlterTable
ALTER TABLE "dapodik"."anggota_rombel" ADD COLUMN     "sekolah_id" UUID;

-- AlterTable
ALTER TABLE "dapodik"."pembelajaran" ADD COLUMN     "sekolah_id" UUID;

-- AlterTable
ALTER TABLE "dapodik"."rombongan_belajar" ADD COLUMN     "sekolah_id" UUID;
