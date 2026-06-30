-- AlterTable
ALTER TABLE "dapodik"."gtks" ADD COLUMN     "nama_kcp" TEXT;

-- CreateTable
CREATE TABLE "simak"."pengaturan_umum" (
    "pengaturan_umum_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "background_gtk" TEXT,
    "background_pd" TEXT,
    "waktu_mulai_pengajuan" TEXT,
    "waktu_sampai_pengajuan" TEXT,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengaturan_umum_pkey" PRIMARY KEY ("pengaturan_umum_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengaturan_umum_sekolah_id_key" ON "simak"."pengaturan_umum"("sekolah_id");

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_umum" ADD CONSTRAINT "pengaturan_umum_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;
