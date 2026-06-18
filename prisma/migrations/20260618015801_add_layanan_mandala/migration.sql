-- CreateTable
CREATE TABLE "mandala"."layanan" (
    "layanan_id" UUID NOT NULL,
    "nama_layanan" VARCHAR(150) NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "layanan_pkey" PRIMARY KEY ("layanan_id")
);

-- CreateTable
CREATE TABLE "mandala"."layanan_syarat" (
    "layanan_syarat_id" UUID NOT NULL,
    "layanan_id" UUID NOT NULL,
    "nama_syarat" VARCHAR(150) NOT NULL,
    "wajib" BOOLEAN NOT NULL DEFAULT true,
    "urutan" SMALLINT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "layanan_syarat_pkey" PRIMARY KEY ("layanan_syarat_id")
);

-- CreateTable
CREATE TABLE "mandala"."permohonan_layanan" (
    "permohonan_layanan_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "layanan_id" UUID NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "ptk_id" UUID,
    "peserta_didik_id" UUID,
    "nomor_permohonan" VARCHAR(50),
    "keterangan" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "tanggal_pengajuan" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permohonan_layanan_pkey" PRIMARY KEY ("permohonan_layanan_id")
);

-- CreateTable
CREATE TABLE "mandala"."permohonan_layanan_file" (
    "permohonan_layanan_file_id" UUID NOT NULL,
    "permohonan_layanan_id" UUID NOT NULL,
    "layanan_syarat_id" UUID,
    "jenis_file" SMALLINT NOT NULL,
    "nama_file" VARCHAR(255),
    "file_url" VARCHAR(500),
    "catatan" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permohonan_layanan_file_pkey" PRIMARY KEY ("permohonan_layanan_file_id")
);

-- CreateTable
CREATE TABLE "mandala"."permohonan_layanan_log" (
    "permohonan_layanan_log_id" UUID NOT NULL,
    "permohonan_layanan_id" UUID NOT NULL,
    "pegawai_id" UUID NOT NULL,
    "status" SMALLINT NOT NULL,
    "catatan" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permohonan_layanan_log_pkey" PRIMARY KEY ("permohonan_layanan_log_id")
);

-- CreateIndex
CREATE INDEX "layanan_kategori_idx" ON "mandala"."layanan"("kategori");

-- CreateIndex
CREATE INDEX "layanan_aktif_idx" ON "mandala"."layanan"("aktif");

-- CreateIndex
CREATE UNIQUE INDEX "layanan_nama_layanan_kategori_key" ON "mandala"."layanan"("nama_layanan", "kategori");

-- CreateIndex
CREATE INDEX "layanan_syarat_layanan_id_idx" ON "mandala"."layanan_syarat"("layanan_id");

-- CreateIndex
CREATE INDEX "layanan_syarat_aktif_idx" ON "mandala"."layanan_syarat"("aktif");

-- CreateIndex
CREATE UNIQUE INDEX "layanan_syarat_layanan_id_nama_syarat_key" ON "mandala"."layanan_syarat"("layanan_id", "nama_syarat");

-- CreateIndex
CREATE INDEX "permohonan_layanan_sekolah_id_idx" ON "mandala"."permohonan_layanan"("sekolah_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_layanan_id_idx" ON "mandala"."permohonan_layanan"("layanan_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_status_idx" ON "mandala"."permohonan_layanan"("status");

-- CreateIndex
CREATE INDEX "permohonan_layanan_kategori_idx" ON "mandala"."permohonan_layanan"("kategori");

-- CreateIndex
CREATE INDEX "permohonan_layanan_tanggal_pengajuan_idx" ON "mandala"."permohonan_layanan"("tanggal_pengajuan");

-- CreateIndex
CREATE INDEX "permohonan_layanan_file_permohonan_layanan_id_idx" ON "mandala"."permohonan_layanan_file"("permohonan_layanan_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_file_layanan_syarat_id_idx" ON "mandala"."permohonan_layanan_file"("layanan_syarat_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_file_status_idx" ON "mandala"."permohonan_layanan_file"("status");

-- CreateIndex
CREATE INDEX "permohonan_layanan_log_permohonan_layanan_id_idx" ON "mandala"."permohonan_layanan_log"("permohonan_layanan_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_log_pegawai_id_idx" ON "mandala"."permohonan_layanan_log"("pegawai_id");

-- CreateIndex
CREATE INDEX "permohonan_layanan_log_status_idx" ON "mandala"."permohonan_layanan_log"("status");

-- AddForeignKey
ALTER TABLE "mandala"."layanan_syarat" ADD CONSTRAINT "layanan_syarat_layanan_id_fkey" FOREIGN KEY ("layanan_id") REFERENCES "mandala"."layanan"("layanan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan" ADD CONSTRAINT "permohonan_layanan_layanan_id_fkey" FOREIGN KEY ("layanan_id") REFERENCES "mandala"."layanan"("layanan_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan_file" ADD CONSTRAINT "permohonan_layanan_file_permohonan_layanan_id_fkey" FOREIGN KEY ("permohonan_layanan_id") REFERENCES "mandala"."permohonan_layanan"("permohonan_layanan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan_file" ADD CONSTRAINT "permohonan_layanan_file_layanan_syarat_id_fkey" FOREIGN KEY ("layanan_syarat_id") REFERENCES "mandala"."layanan_syarat"("layanan_syarat_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan_log" ADD CONSTRAINT "permohonan_layanan_log_permohonan_layanan_id_fkey" FOREIGN KEY ("permohonan_layanan_id") REFERENCES "mandala"."permohonan_layanan"("permohonan_layanan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."permohonan_layanan_log" ADD CONSTRAINT "permohonan_layanan_log_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "mandala"."pegawai"("pegawai_id") ON DELETE RESTRICT ON UPDATE CASCADE;
