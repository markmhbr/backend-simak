/*
  Warnings:
  - Data migration: Copy data from `nama_ibu_kandung` to `nama_ibu` where `nama_ibu` is empty.
  - You are about to drop the column `nama_ibu_kandung` on the `peserta_didik` table. All the data in the column will be lost.
*/

-- 1. Migrasi data: Pastikan nama ibu kandung tidak hilang saat kolom dihapus
UPDATE "dapodik"."peserta_didik" 
SET "nama_ibu" = "nama_ibu_kandung" 
WHERE ("nama_ibu" IS NULL OR "nama_ibu" = '') AND "nama_ibu_kandung" IS NOT NULL;

-- 2. Hapus kolom lama
ALTER TABLE "dapodik"."peserta_didik" DROP COLUMN "nama_ibu_kandung";

-- 3. (Opsional) Penyesuaian lain jika ada dari prisma (misal field di gtks yang terdeteksi)
-- ALTER TABLE "dapodik"."gtks" ADD COLUMN IF NOT EXISTS "id_bank" TEXT,
-- ADD COLUMN IF NOT EXISTS "nama_kcp" TEXT,
-- ADD COLUMN IF NOT EXISTS "rekening_atas_nama" TEXT,
-- ADD COLUMN IF NOT EXISTS "rekening_bank" TEXT;
