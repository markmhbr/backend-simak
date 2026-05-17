/*
  Warnings:

  - A unique constraint covering the columns `[sekolah_id]` on the table `app_keys` will be added. If there are existing duplicate values, this will fail.
  - Made the column `sekolah_id` on table `app_keys` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "simak"."app_keys_key_adminPanel_key";

-- AlterTable
ALTER TABLE "simak"."app_keys" ALTER COLUMN "sekolah_id" SET NOT NULL,
ALTER COLUMN "key_webService" DROP NOT NULL,
ALTER COLUMN "key_adminPanel" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "app_keys_sekolah_id_key" ON "simak"."app_keys"("sekolah_id");
