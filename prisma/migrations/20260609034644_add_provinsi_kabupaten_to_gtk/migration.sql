-- AlterTable
ALTER TABLE "dapodik"."gtks" ADD COLUMN     "kabupaten_kota" TEXT,
ADD COLUMN     "provinsi" TEXT;

-- AddForeignKey
ALTER TABLE "dapodik"."pengguna" ADD CONSTRAINT "pengguna_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."pengguna" ADD CONSTRAINT "pengguna_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;
