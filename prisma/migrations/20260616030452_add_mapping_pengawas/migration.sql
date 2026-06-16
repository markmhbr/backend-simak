-- CreateTable
CREATE TABLE "mandala"."mapping_pengawas" (
    "mapping_pengawas_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pegawai_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mapping_pengawas_pkey" PRIMARY KEY ("mapping_pengawas_id")
);

-- CreateIndex
CREATE INDEX "mapping_pengawas_pegawai_id_idx" ON "mandala"."mapping_pengawas"("pegawai_id");

-- CreateIndex
CREATE INDEX "mapping_pengawas_sekolah_id_idx" ON "mandala"."mapping_pengawas"("sekolah_id");

-- CreateIndex
CREATE UNIQUE INDEX "mapping_pengawas_pegawai_id_sekolah_id_key" ON "mandala"."mapping_pengawas"("pegawai_id", "sekolah_id");

-- AddForeignKey
ALTER TABLE "mandala"."mapping_pengawas" ADD CONSTRAINT "mapping_pengawas_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "mandala"."pegawai"("pegawai_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."mapping_pengawas" ADD CONSTRAINT "mapping_pengawas_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;
