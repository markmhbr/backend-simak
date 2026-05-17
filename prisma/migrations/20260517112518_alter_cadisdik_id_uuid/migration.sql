/*
  Warnings:

  - The `cadisdik_id` column on the `sekolah` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "dapodik"."sekolah" DROP COLUMN "cadisdik_id",
ADD COLUMN     "cadisdik_id" UUID;
