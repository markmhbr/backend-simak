-- DropIndex
DROP INDEX IF EXISTS "mandala"."antrian_cadisdik_id_nomor_antrian_key";

-- DropIndex
DROP INDEX IF EXISTS "mandala"."layanan_nama_layanan_kategori_key";

-- AlterTable
ALTER TABLE "dapodik"."sekolah" ADD COLUMN IF NOT EXISTS "radius" INTEGER DEFAULT 100;

-- AlterTable
ALTER TABLE "mandala"."antrian" ADD COLUMN IF NOT EXISTS "tanggal" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "mandala"."layanan" ADD COLUMN IF NOT EXISTS "cadisdik_id" UUID;

-- AlterTable
ALTER TABLE "mandala"."permohonan_layanan" ADD COLUMN IF NOT EXISTS "cadisdik_id" UUID;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "antrian_cadisdik_id_tanggal_nomor_antrian_key" ON "mandala"."antrian"("cadisdik_id", "tanggal", "nomor_antrian");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "layanan_cadisdik_id_idx" ON "mandala"."layanan"("cadisdik_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "layanan_cadisdik_id_nama_layanan_kategori_key" ON "mandala"."layanan"("cadisdik_id", "nama_layanan", "kategori");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "permohonan_layanan_cadisdik_id_idx" ON "mandala"."permohonan_layanan"("cadisdik_id");

-- AddForeignKey
ALTER TABLE "mandala"."layanan" ADD CONSTRAINT "layanan_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan" ADD CONSTRAINT "permohonan_layanan_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;
