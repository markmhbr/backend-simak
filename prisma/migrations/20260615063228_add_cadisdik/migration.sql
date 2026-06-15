-- CreateTable
CREATE TABLE "mandala"."cadisdik" (
    "cadisdik_id" UUID NOT NULL,
    "nama_instansi" VARCHAR(255) NOT NULL,
    "alamat" TEXT,
    "email" VARCHAR(255),
    "nomor_telepon" VARCHAR(50),
    "website" VARCHAR(255),
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cadisdik_pkey" PRIMARY KEY ("cadisdik_id")
);

-- AddForeignKey
ALTER TABLE "dapodik"."sekolah" ADD CONSTRAINT "sekolah_cadisdik_id_fkey" FOREIGN KEY ("cadisdik_id") REFERENCES "mandala"."cadisdik"("cadisdik_id") ON DELETE SET NULL ON UPDATE CASCADE;
