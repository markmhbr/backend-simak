/*
  Warnings:

  - You are about to drop the `mandala` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "mandala";

-- DropTable
DROP TABLE "simak"."mandala";

-- CreateTable
CREATE TABLE "mandala"."mandala" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "url_mandala" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "mandala_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mandala_key_key" ON "mandala"."mandala"("key");
