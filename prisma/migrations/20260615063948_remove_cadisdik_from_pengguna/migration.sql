/*
  Warnings:

  - You are about to drop the column `cadisdik_id` on the `pengguna` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "dapodik"."pengguna" DROP CONSTRAINT "pengguna_cadisdik_id_fkey";

-- AlterTable
ALTER TABLE "dapodik"."pengguna" DROP COLUMN "cadisdik_id";
