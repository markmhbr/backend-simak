-- CreateTable
CREATE TABLE "simak"."jenis_pelanggaran" (
    "jenis_pelanggaran_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "target" SMALLINT NOT NULL,
    "poin" SMALLINT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "jenis_pelanggaran_pkey" PRIMARY KEY ("jenis_pelanggaran_id")
);

-- CreateTable
CREATE TABLE "simak"."jenis_tindak_lanjut" (
    "jenis_tindak_lanjut_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "nama" VARCHAR(150) NOT NULL,
    "target" SMALLINT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "jenis_tindak_lanjut_pkey" PRIMARY KEY ("jenis_tindak_lanjut_id")
);

-- CreateTable
CREATE TABLE "simak"."pelanggaran" (
    "pelanggaran_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "peserta_didik_id" UUID,
    "ptk_id" UUID,
    "jenis_pelanggaran_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "waktu" TIMESTAMPTZ(6) NOT NULL,
    "keterangan" TEXT,
    "poin" SMALLINT NOT NULL,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "pelapor_ptk_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pelanggaran_pkey" PRIMARY KEY ("pelanggaran_id")
);

-- CreateTable
CREATE TABLE "simak"."tindak_lanjut" (
    "tindak_lanjut_id" UUID NOT NULL,
    "pelanggaran_id" UUID NOT NULL,
    "jenis_tindak_lanjut_id" UUID NOT NULL,
    "tanggal" DATE NOT NULL,
    "keterangan" TEXT,
    "petugas_ptk_id" UUID,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "tindak_lanjut_pkey" PRIMARY KEY ("tindak_lanjut_id")
);

-- CreateIndex
CREATE INDEX "jenis_pelanggaran_sekolah_id_idx" ON "simak"."jenis_pelanggaran"("sekolah_id");

-- CreateIndex
CREATE INDEX "jenis_pelanggaran_target_idx" ON "simak"."jenis_pelanggaran"("target");

-- CreateIndex
CREATE INDEX "jenis_tindak_lanjut_sekolah_id_idx" ON "simak"."jenis_tindak_lanjut"("sekolah_id");

-- CreateIndex
CREATE INDEX "jenis_tindak_lanjut_target_idx" ON "simak"."jenis_tindak_lanjut"("target");

-- CreateIndex
CREATE INDEX "pelanggaran_sekolah_id_idx" ON "simak"."pelanggaran"("sekolah_id");

-- CreateIndex
CREATE INDEX "pelanggaran_peserta_didik_id_idx" ON "simak"."pelanggaran"("peserta_didik_id");

-- CreateIndex
CREATE INDEX "pelanggaran_ptk_id_idx" ON "simak"."pelanggaran"("ptk_id");

-- CreateIndex
CREATE INDEX "pelanggaran_jenis_pelanggaran_id_idx" ON "simak"."pelanggaran"("jenis_pelanggaran_id");

-- CreateIndex
CREATE INDEX "pelanggaran_tanggal_idx" ON "simak"."pelanggaran"("tanggal");

-- CreateIndex
CREATE INDEX "tindak_lanjut_pelanggaran_id_idx" ON "simak"."tindak_lanjut"("pelanggaran_id");

-- CreateIndex
CREATE INDEX "tindak_lanjut_jenis_tindak_lanjut_id_idx" ON "simak"."tindak_lanjut"("jenis_tindak_lanjut_id");

-- CreateIndex
CREATE INDEX "tindak_lanjut_tanggal_idx" ON "simak"."tindak_lanjut"("tanggal");

-- AddForeignKey
ALTER TABLE "simak"."pelanggaran" ADD CONSTRAINT "pelanggaran_jenis_pelanggaran_id_fkey" FOREIGN KEY ("jenis_pelanggaran_id") REFERENCES "simak"."jenis_pelanggaran"("jenis_pelanggaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pelanggaran" ADD CONSTRAINT "pelanggaran_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pelanggaran" ADD CONSTRAINT "pelanggaran_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pelanggaran" ADD CONSTRAINT "pelanggaran_pelapor_ptk_id_fkey" FOREIGN KEY ("pelapor_ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."tindak_lanjut" ADD CONSTRAINT "tindak_lanjut_pelanggaran_id_fkey" FOREIGN KEY ("pelanggaran_id") REFERENCES "simak"."pelanggaran"("pelanggaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."tindak_lanjut" ADD CONSTRAINT "tindak_lanjut_jenis_tindak_lanjut_id_fkey" FOREIGN KEY ("jenis_tindak_lanjut_id") REFERENCES "simak"."jenis_tindak_lanjut"("jenis_tindak_lanjut_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."tindak_lanjut" ADD CONSTRAINT "tindak_lanjut_petugas_ptk_id_fkey" FOREIGN KEY ("petugas_ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;
