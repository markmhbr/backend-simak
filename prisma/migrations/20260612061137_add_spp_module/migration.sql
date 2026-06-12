-- CreateTable
CREATE TABLE "simak"."pengaturan_tagihan" (
    "pengaturan_tagihan_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "nama_tagihan" VARCHAR(150) NOT NULL,
    "nominal" BIGINT NOT NULL,
    "tipe" SMALLINT NOT NULL,
    "bulan" SMALLINT,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "pengaturan_tagihan_pkey" PRIMARY KEY ("pengaturan_tagihan_id")
);

-- CreateTable
CREATE TABLE "simak"."pengaturan_tagihan_rombel" (
    "pengaturan_tagihan_rombel_id" UUID NOT NULL,
    "pengaturan_tagihan_id" UUID NOT NULL,
    "rombongan_belajar_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengaturan_tagihan_rombel_pkey" PRIMARY KEY ("pengaturan_tagihan_rombel_id")
);

-- CreateTable
CREATE TABLE "simak"."spp" (
    "spp_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "peserta_didik_id" UUID NOT NULL,
    "pengaturan_tagihan_id" UUID NOT NULL,
    "nominal_tagihan" BIGINT NOT NULL,
    "nominal_terbayar" BIGINT NOT NULL DEFAULT 0,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "jatuh_tempo" DATE,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "spp_pkey" PRIMARY KEY ("spp_id")
);

-- CreateTable
CREATE TABLE "simak"."riwayat_transaksi_spp" (
    "riwayat_transaksi_spp_id" UUID NOT NULL,
    "spp_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "peserta_didik_id" UUID NOT NULL,
    "jenis_transaksi" SMALLINT NOT NULL,
    "nominal" BIGINT NOT NULL,
    "tanggal_transaksi" TIMESTAMPTZ(6) NOT NULL,
    "metode_pembayaran" SMALLINT,
    "keterangan" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "riwayat_transaksi_spp_pkey" PRIMARY KEY ("riwayat_transaksi_spp_id")
);

-- CreateIndex
CREATE INDEX "pengaturan_tagihan_sekolah_id_idx" ON "simak"."pengaturan_tagihan"("sekolah_id");

-- CreateIndex
CREATE INDEX "pengaturan_tagihan_tipe_idx" ON "simak"."pengaturan_tagihan"("tipe");

-- CreateIndex
CREATE INDEX "pengaturan_tagihan_aktif_idx" ON "simak"."pengaturan_tagihan"("aktif");

-- CreateIndex
CREATE INDEX "pengaturan_tagihan_rombel_pengaturan_tagihan_id_idx" ON "simak"."pengaturan_tagihan_rombel"("pengaturan_tagihan_id");

-- CreateIndex
CREATE INDEX "pengaturan_tagihan_rombel_rombongan_belajar_id_idx" ON "simak"."pengaturan_tagihan_rombel"("rombongan_belajar_id");

-- CreateIndex
CREATE UNIQUE INDEX "pengaturan_tagihan_rombel_pengaturan_tagihan_id_rombongan_b_key" ON "simak"."pengaturan_tagihan_rombel"("pengaturan_tagihan_id", "rombongan_belajar_id");

-- CreateIndex
CREATE INDEX "spp_sekolah_id_idx" ON "simak"."spp"("sekolah_id");

-- CreateIndex
CREATE INDEX "spp_peserta_didik_id_idx" ON "simak"."spp"("peserta_didik_id");

-- CreateIndex
CREATE INDEX "spp_pengaturan_tagihan_id_idx" ON "simak"."spp"("pengaturan_tagihan_id");

-- CreateIndex
CREATE INDEX "spp_status_idx" ON "simak"."spp"("status");

-- CreateIndex
CREATE INDEX "riwayat_transaksi_spp_spp_id_idx" ON "simak"."riwayat_transaksi_spp"("spp_id");

-- CreateIndex
CREATE INDEX "riwayat_transaksi_spp_sekolah_id_idx" ON "simak"."riwayat_transaksi_spp"("sekolah_id");

-- CreateIndex
CREATE INDEX "riwayat_transaksi_spp_peserta_didik_id_idx" ON "simak"."riwayat_transaksi_spp"("peserta_didik_id");

-- CreateIndex
CREATE INDEX "riwayat_transaksi_spp_jenis_transaksi_idx" ON "simak"."riwayat_transaksi_spp"("jenis_transaksi");

-- CreateIndex
CREATE INDEX "riwayat_transaksi_spp_tanggal_transaksi_idx" ON "simak"."riwayat_transaksi_spp"("tanggal_transaksi");

-- AddForeignKey
ALTER TABLE "dapodik"."peserta_didik" ADD CONSTRAINT "peserta_didik_rombongan_belajar_id_fkey" FOREIGN KEY ("rombongan_belajar_id") REFERENCES "dapodik"."rombongan_belajar"("rombongan_belajar_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_tagihan" ADD CONSTRAINT "pengaturan_tagihan_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_tagihan_rombel" ADD CONSTRAINT "pengaturan_tagihan_rombel_pengaturan_tagihan_id_fkey" FOREIGN KEY ("pengaturan_tagihan_id") REFERENCES "simak"."pengaturan_tagihan"("pengaturan_tagihan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_tagihan_rombel" ADD CONSTRAINT "pengaturan_tagihan_rombel_rombongan_belajar_id_fkey" FOREIGN KEY ("rombongan_belajar_id") REFERENCES "dapodik"."rombongan_belajar"("rombongan_belajar_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."spp" ADD CONSTRAINT "spp_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."spp" ADD CONSTRAINT "spp_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."spp" ADD CONSTRAINT "spp_pengaturan_tagihan_id_fkey" FOREIGN KEY ("pengaturan_tagihan_id") REFERENCES "simak"."pengaturan_tagihan"("pengaturan_tagihan_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."riwayat_transaksi_spp" ADD CONSTRAINT "riwayat_transaksi_spp_spp_id_fkey" FOREIGN KEY ("spp_id") REFERENCES "simak"."spp"("spp_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."riwayat_transaksi_spp" ADD CONSTRAINT "riwayat_transaksi_spp_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."riwayat_transaksi_spp" ADD CONSTRAINT "riwayat_transaksi_spp_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;
