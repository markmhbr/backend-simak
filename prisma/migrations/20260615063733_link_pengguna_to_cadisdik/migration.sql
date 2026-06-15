-- AlterTable
ALTER TABLE "dapodik"."pengguna" ADD COLUMN     "cadisdik_id" UUID;

-- AddForeignKey
ALTER TABLE "dapodik"."pengguna" ADD CONSTRAINT "pengguna_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE SET NULL ON UPDATE CASCADE;
