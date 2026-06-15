-- CreateTable
CREATE TABLE "mandala"."pegawai" (
    "pegawai_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cadisdik_id" UUID NOT NULL,
    "nama_lengkap" VARCHAR(255) NOT NULL,
    "nip" VARCHAR(30) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "authenticator_secret" VARCHAR(255),
    "jabatan" SMALLINT NOT NULL,
    "jenis_kelamin" SMALLINT NOT NULL,
    "nomor_telepon" VARCHAR(30),
    "foto" VARCHAR(500),
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pegawai_pkey" PRIMARY KEY ("pegawai_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_nip_key" ON "mandala"."pegawai"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "pegawai_email_key" ON "mandala"."pegawai"("email");

-- CreateIndex
CREATE INDEX "pegawai_cadisdik_id_idx" ON "mandala"."pegawai"("cadisdik_id");

-- CreateIndex
CREATE INDEX "pegawai_nip_idx" ON "mandala"."pegawai"("nip");

-- CreateIndex
CREATE INDEX "pegawai_email_idx" ON "mandala"."pegawai"("email");

-- AddForeignKey
ALTER TABLE "mandala"."pegawai" ADD CONSTRAINT "pegawai_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE RESTRICT ON UPDATE CASCADE;
