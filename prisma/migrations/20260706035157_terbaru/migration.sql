-- DropForeignKey
ALTER TABLE "dapodik"."tugas_tambahan" DROP CONSTRAINT "tugas_tambahan_ptk_id_fkey";

-- AlterTable
ALTER TABLE "dapodik"."tugas_tambahan" ADD COLUMN     "index" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "jabatan" TEXT,
ADD COLUMN     "peserta_didik_id" UUID,
ALTER COLUMN "ptk_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "mandala"."pegawai" ADD COLUMN     "golongan" SMALLINT;

-- CreateTable
CREATE TABLE "mandala"."system_settings" (
    "system_setting_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "app_name" TEXT NOT NULL DEFAULT 'SIMAK',
    "app_short_name" TEXT NOT NULL DEFAULT 'Mandala',
    "app_logo" TEXT,
    "app_logo_dark" TEXT,
    "app_favicon" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "contact_address" TEXT,
    "copyright_text" TEXT NOT NULL DEFAULT '© 2026 SIMAK. All Rights Reserved.',
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("system_setting_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_cadisdik_id_key" ON "mandala"."system_settings"("cadisdik_id");

-- CreateIndex
CREATE INDEX "tugas_tambahan_peserta_didik_id_idx" ON "dapodik"."tugas_tambahan"("peserta_didik_id");

-- AddForeignKey
ALTER TABLE "dapodik"."tugas_tambahan" ADD CONSTRAINT "tugas_tambahan_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."tugas_tambahan" ADD CONSTRAINT "tugas_tambahan_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."system_settings" ADD CONSTRAINT "system_settings_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;
