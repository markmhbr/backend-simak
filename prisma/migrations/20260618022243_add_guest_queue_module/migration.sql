-- CreateTable
CREATE TABLE "mandala"."kategori_keperluan" (
    "kategori_keperluan_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "nama" VARCHAR(100) NOT NULL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "kategori_keperluan_pkey" PRIMARY KEY ("kategori_keperluan_id")
);

-- CreateTable
CREATE TABLE "mandala"."antrian" (
    "antrian_id" UUID NOT NULL,
    "cadisdik_id" UUID NOT NULL,
    "kategori_keperluan_id" UUID NOT NULL,
    "nomor_antrian" INTEGER NOT NULL,
    "nama_lengkap" VARCHAR(255) NOT NULL,
    "jabatan" VARCHAR(100),
    "unit_instansi" VARCHAR(255),
    "nomor_hp" VARCHAR(30),
    "keperluan" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "antrian_pkey" PRIMARY KEY ("antrian_id")
);

-- CreateIndex
CREATE INDEX "kategori_keperluan_cadisdik_id_idx" ON "mandala"."kategori_keperluan"("cadisdik_id");

-- CreateIndex
CREATE UNIQUE INDEX "kategori_keperluan_cadisdik_id_nama_key" ON "mandala"."kategori_keperluan"("cadisdik_id", "nama");

-- CreateIndex
CREATE INDEX "antrian_cadisdik_id_idx" ON "mandala"."antrian"("cadisdik_id");

-- CreateIndex
CREATE INDEX "antrian_kategori_keperluan_id_idx" ON "mandala"."antrian"("kategori_keperluan_id");

-- CreateIndex
CREATE INDEX "antrian_status_idx" ON "mandala"."antrian"("status");

-- CreateIndex
CREATE INDEX "antrian_created_at_idx" ON "mandala"."antrian"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "antrian_cadisdik_id_nomor_antrian_key" ON "mandala"."antrian"("cadisdik_id", "nomor_antrian");

-- AddForeignKey
ALTER TABLE "mandala"."kategori_keperluan" ADD CONSTRAINT "kategori_keperluan_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."antrian" ADD CONSTRAINT "antrian_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mandala"."antrian" ADD CONSTRAINT "antrian_kategori_keperluan_id_fkey" FOREIGN KEY ("kategori_keperluan_id") REFERENCES "mandala"."kategori_keperluan"("kategori_keperluan_id") ON DELETE RESTRICT ON UPDATE CASCADE;
