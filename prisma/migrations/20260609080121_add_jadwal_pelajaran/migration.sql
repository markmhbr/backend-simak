-- CreateTable
CREATE TABLE "simak"."pengaturan_jam" (
    "pengaturan_jam_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "hari" SMALLINT NOT NULL,
    "urutan" SMALLINT NOT NULL,
    "tipe" SMALLINT NOT NULL,
    "jam_mulai" TIME NOT NULL,
    "jam_selesai" TIME NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pengaturan_jam_pkey" PRIMARY KEY ("pengaturan_jam_id")
);

-- CreateTable
CREATE TABLE "simak"."jadwal_pelajaran" (
    "jadwal_pelajaran_id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "rombongan_belajar_id" UUID NOT NULL,
    "pembelajaran_id" UUID NOT NULL,
    "hari" SMALLINT NOT NULL,
    "urutan" SMALLINT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "jadwal_pelajaran_pkey" PRIMARY KEY ("jadwal_pelajaran_id")
);

-- CreateIndex
CREATE INDEX "pengaturan_jam_sekolah_id_idx" ON "simak"."pengaturan_jam"("sekolah_id");

-- CreateIndex
CREATE UNIQUE INDEX "pengaturan_jam_sekolah_id_hari_urutan_key" ON "simak"."pengaturan_jam"("sekolah_id", "hari", "urutan");

-- CreateIndex
CREATE INDEX "jadwal_pelajaran_sekolah_id_idx" ON "simak"."jadwal_pelajaran"("sekolah_id");

-- CreateIndex
CREATE INDEX "jadwal_pelajaran_rombongan_belajar_id_idx" ON "simak"."jadwal_pelajaran"("rombongan_belajar_id");

-- CreateIndex
CREATE INDEX "jadwal_pelajaran_pembelajaran_id_idx" ON "simak"."jadwal_pelajaran"("pembelajaran_id");

-- CreateIndex
CREATE INDEX "jadwal_pelajaran_hari_urutan_idx" ON "simak"."jadwal_pelajaran"("hari", "urutan");

-- CreateIndex
CREATE UNIQUE INDEX "jadwal_pelajaran_sekolah_id_rombongan_belajar_id_hari_uruta_key" ON "simak"."jadwal_pelajaran"("sekolah_id", "rombongan_belajar_id", "hari", "urutan");

-- AddForeignKey
ALTER TABLE "simak"."pengaturan_jam" ADD CONSTRAINT "pengaturan_jam_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_rombongan_belajar_id_fkey" FOREIGN KEY ("rombongan_belajar_id") REFERENCES "dapodik"."rombongan_belajar"("rombongan_belajar_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_pembelajaran_id_fkey" FOREIGN KEY ("pembelajaran_id") REFERENCES "dapodik"."pembelajaran"("pembelajaran_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simak"."jadwal_pelajaran" ADD CONSTRAINT "jadwal_pelajaran_sekolah_id_hari_urutan_fkey" FOREIGN KEY ("sekolah_id", "hari", "urutan") REFERENCES "simak"."pengaturan_jam"("sekolah_id", "hari", "urutan") ON DELETE RESTRICT ON UPDATE CASCADE;
