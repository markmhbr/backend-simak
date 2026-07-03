-- CreateTable
CREATE TABLE "mandala"."pengaturan_nomor_surat" (
    "pengaturan_nomor_surat_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "nama_label" VARCHAR(100) NOT NULL,
    "format_nomor" VARCHAR(255) NOT NULL,
    "counter" INTEGER NOT NULL DEFAULT 0,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pengaturan_nomor_surat_pkey" PRIMARY KEY ("pengaturan_nomor_surat_id")
);

-- CreateTable
CREATE TABLE "mandala"."template_surat" (
    "template_surat_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "nama_template" VARCHAR(150) NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "ukuran_kertas" SMALLINT NOT NULL,
    "margin_atas" SMALLINT NOT NULL DEFAULT 20,
    "margin_bawah" SMALLINT NOT NULL DEFAULT 20,
    "margin_kiri" SMALLINT NOT NULL DEFAULT 20,
    "margin_kanan" SMALLINT NOT NULL DEFAULT 20,
    "konten_html" TEXT NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "template_surat_pkey" PRIMARY KEY ("template_surat_id")
);

-- CreateTable
CREATE TABLE "mandala"."surat_masuk" (
    "surat_masuk_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "tanggal_surat" DATE NOT NULL,
    "tanggal_diterima" DATE NOT NULL,
    "nomor_agenda" VARCHAR(50) NOT NULL,
    "nomor_surat" VARCHAR(100) NOT NULL,
    "asal_surat" VARCHAR(255) NOT NULL,
    "tujuan_disposisi" VARCHAR(255) NOT NULL,
    "perihal" VARCHAR(255) NOT NULL,
    "keterangan" TEXT,
    "file_url" VARCHAR(500) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "surat_masuk_pkey" PRIMARY KEY ("surat_masuk_id")
);

-- CreateTable
CREATE TABLE "mandala"."surat_keluar" (
    "surat_keluar_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "template_surat_id" UUID NOT NULL,
    "pengaturan_nomor_surat_id" UUID NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "pegawai_id" UUID,
    "sekolah_id" UUID,
    "nomor_surat" VARCHAR(255),
    "tanggal_surat" DATE NOT NULL,
    "perihal" VARCHAR(255) NOT NULL,
    "isi_final_html" TEXT NOT NULL,
    "file_pdf" VARCHAR(500),
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "surat_keluar_pkey" PRIMARY KEY ("surat_keluar_id")
);

-- CreateIndex
CREATE INDEX "pengaturan_nomor_surat_cadisdik_id_idx" ON "mandala"."pengaturan_nomor_surat"("cadisdik_id");

-- CreateIndex
CREATE INDEX "pengaturan_nomor_surat_kategori_idx" ON "mandala"."pengaturan_nomor_surat"("kategori");

-- CreateIndex
CREATE INDEX "pengaturan_nomor_surat_aktif_idx" ON "mandala"."pengaturan_nomor_surat"("aktif");

-- CreateIndex
CREATE UNIQUE INDEX "pengaturan_nomor_surat_cadisdik_id_kategori_nama_label_key" ON "mandala"."pengaturan_nomor_surat"("cadisdik_id", "kategori", "nama_label");

-- CreateIndex
CREATE INDEX "template_surat_cadisdik_id_idx" ON "mandala"."template_surat"("cadisdik_id");

-- CreateIndex
CREATE INDEX "template_surat_kategori_idx" ON "mandala"."template_surat"("kategori");

-- CreateIndex
CREATE INDEX "template_surat_aktif_idx" ON "mandala"."template_surat"("aktif");

-- CreateIndex
CREATE INDEX "surat_masuk_cadisdik_id_idx" ON "mandala"."surat_masuk"("cadisdik_id");

-- CreateIndex
CREATE INDEX "surat_masuk_tanggal_surat_idx" ON "mandala"."surat_masuk"("tanggal_surat");

-- CreateIndex
CREATE INDEX "surat_masuk_tanggal_diterima_idx" ON "mandala"."surat_masuk"("tanggal_diterima");

-- CreateIndex
CREATE INDEX "surat_masuk_nomor_agenda_idx" ON "mandala"."surat_masuk"("nomor_agenda");

-- CreateIndex
CREATE INDEX "surat_masuk_nomor_surat_idx" ON "mandala"."surat_masuk"("nomor_surat");

-- CreateIndex
CREATE UNIQUE INDEX "surat_masuk_cadisdik_id_nomor_agenda_key" ON "mandala"."surat_masuk"("cadisdik_id", "nomor_agenda");

-- CreateIndex
CREATE INDEX "surat_keluar_cadisdik_id_idx" ON "mandala"."surat_keluar"("cadisdik_id");

-- CreateIndex
CREATE INDEX "surat_keluar_template_surat_id_idx" ON "mandala"."surat_keluar"("template_surat_id");

-- CreateIndex
CREATE INDEX "surat_keluar_pengaturan_nomor_surat_id_idx" ON "mandala"."surat_keluar"("pengaturan_nomor_surat_id");

-- CreateIndex
CREATE INDEX "surat_keluar_pegawai_id_idx" ON "mandala"."surat_keluar"("pegawai_id");

-- CreateIndex
CREATE INDEX "surat_keluar_sekolah_id_idx" ON "mandala"."surat_keluar"("sekolah_id");

-- CreateIndex
CREATE INDEX "surat_keluar_tanggal_surat_idx" ON "mandala"."surat_keluar"("tanggal_surat");

-- CreateIndex
CREATE INDEX "surat_keluar_status_idx" ON "mandala"."surat_keluar"("status");

-- CreateIndex
CREATE UNIQUE INDEX "surat_keluar_cadisdik_id_nomor_surat_key" ON "mandala"."surat_keluar"("cadisdik_id", "nomor_surat");

-- AddForeignKey
ALTER TABLE "mandala"."pengaturan_nomor_surat" ADD CONSTRAINT "pengaturan_nomor_surat_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."template_surat" ADD CONSTRAINT "template_surat_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."surat_masuk" ADD CONSTRAINT "surat_masuk_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."surat_keluar" ADD CONSTRAINT "surat_keluar_pengaturan_nomor_surat_id_fkey" FOREIGN KEY ("pengaturan_nomor_surat_id") REFERENCES "mandala"."pengaturan_nomor_surat"("pengaturan_nomor_surat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."surat_keluar" ADD CONSTRAINT "surat_keluar_pegawai_id_fkey" FOREIGN KEY ("pegawai_id") REFERENCES "mandala"."pegawai"("pegawai_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."surat_keluar" ADD CONSTRAINT "surat_keluar_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."surat_keluar" ADD CONSTRAINT "surat_keluar_template_surat_id_fkey" FOREIGN KEY ("template_surat_id") REFERENCES "mandala"."template_surat"("template_surat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."surat_keluar" ADD CONSTRAINT "surat_keluar_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;
