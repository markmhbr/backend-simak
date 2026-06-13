-- CreateTable
CREATE TABLE "dapodik"."riwayat_pendidikan_formal" (
    "riwayat_pendidikan_formal_id" UUID NOT NULL,
    "ptk_id" UUID NOT NULL,
    "satuan_pendidikan_formal" TEXT NOT NULL,
    "fakultas" TEXT,
    "kependidikan" TEXT,
    "tahun_masuk" TEXT,
    "tahun_lulus" TEXT,
    "nim" TEXT,
    "status_kuliah" TEXT,
    "semester" TEXT,
    "ipk" TEXT,
    "prodi" TEXT,
    "id_reg_pd" TEXT,
    "bidang_studi_id_str" TEXT,
    "jenjang_pendidikan_id_str" TEXT,
    "gelar_akademik_id_str" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "riwayat_pendidikan_formal_pkey" PRIMARY KEY ("riwayat_pendidikan_formal_id")
);

-- CreateIndex
CREATE INDEX "riwayat_pendidikan_formal_ptk_id_idx" ON "dapodik"."riwayat_pendidikan_formal"("ptk_id");

-- AddForeignKey
ALTER TABLE "dapodik"."riwayat_pendidikan_formal" ADD CONSTRAINT "riwayat_pendidikan_formal_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;
