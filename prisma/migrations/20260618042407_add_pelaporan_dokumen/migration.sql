-- CreateTable
CREATE TABLE "mandala"."pelaporan" (
    "pelaporan_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "judul" VARCHAR(255) NOT NULL,
    "deskripsi" TEXT,
    "tanggal_mulai" TIMESTAMPTZ(6),
    "tanggal_selesai" TIMESTAMPTZ(6),
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pelaporan_pkey" PRIMARY KEY ("pelaporan_id")
);

-- CreateTable
CREATE TABLE "mandala"."pelaporan_sekolah" (
    "pelaporan_sekolah_id" UUID NOT NULL,
    "pelaporan_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pelaporan_sekolah_pkey" PRIMARY KEY ("pelaporan_sekolah_id")
);

-- CreateTable
CREATE TABLE "mandala"."pelaporan_dokumen" (
    "pelaporan_dokumen_id" UUID NOT NULL,
    "pelaporan_sekolah_id" UUID NOT NULL,
    "nama_file" VARCHAR(255) NOT NULL,
    "file_url" VARCHAR(500) NOT NULL,
    "ukuran_file" BIGINT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pelaporan_dokumen_pkey" PRIMARY KEY ("pelaporan_dokumen_id")
);

-- CreateIndex
CREATE INDEX "pelaporan_cadisdik_id_idx" ON "mandala"."pelaporan"("cadisdik_id");

-- CreateIndex
CREATE INDEX "pelaporan_aktif_idx" ON "mandala"."pelaporan"("aktif");

-- CreateIndex
CREATE INDEX "pelaporan_sekolah_sekolah_id_idx" ON "mandala"."pelaporan_sekolah"("sekolah_id");

-- CreateIndex
CREATE UNIQUE INDEX "pelaporan_sekolah_pelaporan_id_sekolah_id_key" ON "mandala"."pelaporan_sekolah"("pelaporan_id", "sekolah_id");

-- CreateIndex
CREATE INDEX "pelaporan_dokumen_pelaporan_sekolah_id_idx" ON "mandala"."pelaporan_dokumen"("pelaporan_sekolah_id");

-- AddForeignKey
ALTER TABLE "mandala"."pelaporan" ADD CONSTRAINT "pelaporan_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."pelaporan_sekolah" ADD CONSTRAINT "pelaporan_sekolah_pelaporan_id_fkey" FOREIGN KEY ("pelaporan_id") REFERENCES "mandala"."pelaporan"("pelaporan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."pelaporan_dokumen" ADD CONSTRAINT "pelaporan_dokumen_pelaporan_sekolah_id_fkey" FOREIGN KEY ("pelaporan_sekolah_id") REFERENCES "mandala"."pelaporan_sekolah"("pelaporan_sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;
