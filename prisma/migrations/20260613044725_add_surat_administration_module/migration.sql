-- CreateTable
CREATE TABLE "simak"."pengaturan_nomor_surat" (
    "pengaturan_nomor_surat_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
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
CREATE TABLE "simak"."template_surat" (
    "template_surat_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
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
CREATE TABLE "simak"."surat_masuk" (
    "surat_masuk_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
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
CREATE TABLE "simak"."surat_keluar" (
    "surat_keluar_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "template_surat_id" UUID NOT NULL,
    "pengaturan_nomor_surat_id" UUID NOT NULL,
    "kategori" SMALLINT NOT NULL,
    "peserta_didik_id" UUID,
    "ptk_id" UUID,
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
CREATE INDEX "pengaturan_nomor_surat_sekolah_id_idx" ON "simak"."pengaturan_nomor_surat"("sekolah_id");

-- CreateIndex
CREATE INDEX "pengaturan_nomor_surat_kategori_idx" ON "simak"."pengaturan_nomor_surat"("kategori");

-- CreateIndex
CREATE INDEX "pengaturan_nomor_surat_aktif_idx" ON "simak"."pengaturan_nomor_surat"("aktif");

-- CreateIndex
CREATE UNIQUE INDEX "pengaturan_nomor_surat_sekolah_id_kategori_nama_label_key" ON "simak"."pengaturan_nomor_surat"("sekolah_id", "kategori", "nama_label");

-- CreateIndex
CREATE INDEX "template_surat_sekolah_id_idx" ON "simak"."template_surat"("sekolah_id");

-- CreateIndex
CREATE INDEX "template_surat_kategori_idx" ON "simak"."template_surat"("kategori");

-- CreateIndex
CREATE INDEX "template_surat_aktif_idx" ON "simak"."template_surat"("aktif");

-- CreateIndex
CREATE INDEX "surat_masuk_sekolah_id_idx" ON "simak"."surat_masuk"("sekolah_id");

-- CreateIndex
CREATE INDEX "surat_masuk_tanggal_surat_idx" ON "simak"."surat_masuk"("tanggal_surat");

-- CreateIndex
CREATE INDEX "surat_masuk_tanggal_diterima_idx" ON "simak"."surat_masuk"("tanggal_diterima");

-- CreateIndex
CREATE INDEX "surat_masuk_nomor_agenda_idx" ON "simak"."surat_masuk"("nomor_agenda");

-- CreateIndex
CREATE INDEX "surat_masuk_nomor_surat_idx" ON "simak"."surat_masuk"("nomor_surat");

-- CreateIndex
CREATE UNIQUE INDEX "surat_masuk_sekolah_id_nomor_agenda_key" ON "simak"."surat_masuk"("sekolah_id", "nomor_agenda");

-- CreateIndex
CREATE INDEX "surat_keluar_sekolah_id_idx" ON "simak"."surat_keluar"("sekolah_id");

-- CreateIndex
CREATE INDEX "surat_keluar_template_surat_id_idx" ON "simak"."surat_keluar"("template_surat_id");

-- CreateIndex
CREATE INDEX "surat_keluar_pengaturan_nomor_surat_id_idx" ON "simak"."surat_keluar"("pengaturan_nomor_surat_id");

-- CreateIndex
CREATE INDEX "surat_keluar_peserta_didik_id_idx" ON "simak"."surat_keluar"("peserta_didik_id");

-- CreateIndex
CREATE INDEX "surat_keluar_ptk_id_idx" ON "simak"."surat_keluar"("ptk_id");

-- CreateIndex
CREATE INDEX "surat_keluar_tanggal_surat_idx" ON "simak"."surat_keluar"("tanggal_surat");

-- CreateIndex
CREATE INDEX "surat_keluar_status_idx" ON "simak"."surat_keluar"("status");

-- CreateIndex
CREATE UNIQUE INDEX "surat_keluar_sekolah_id_nomor_surat_key" ON "simak"."surat_keluar"("sekolah_id", "nomor_surat");

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_nomor_surat" ADD CONSTRAINT "pengaturan_nomor_surat_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."template_surat" ADD CONSTRAINT "template_surat_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_masuk" ADD CONSTRAINT "surat_masuk_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_keluar" ADD CONSTRAINT "surat_keluar_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_keluar" ADD CONSTRAINT "surat_keluar_template_surat_id_fkey" FOREIGN KEY ("template_surat_id") REFERENCES "simak"."template_surat"("template_surat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_keluar" ADD CONSTRAINT "surat_keluar_pengaturan_nomor_surat_id_fkey" FOREIGN KEY ("pengaturan_nomor_surat_id") REFERENCES "simak"."pengaturan_nomor_surat"("pengaturan_nomor_surat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_keluar" ADD CONSTRAINT "surat_keluar_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."surat_keluar" ADD CONSTRAINT "surat_keluar_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;
