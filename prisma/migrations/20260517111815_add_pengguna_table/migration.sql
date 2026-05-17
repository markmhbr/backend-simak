-- CreateTable
CREATE TABLE "dapodik"."pengguna" (
    "pengguna_id" UUID NOT NULL,
    "sekolah_id" UUID,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT,
    "peran_id_str" TEXT,
    "alamat" TEXT,
    "no_telepon" TEXT,
    "no_hp" TEXT,
    "ptk_id" UUID,
    "peserta_didik_id" UUID,
    "google2fa_secret" TEXT,
    "remember_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengguna_pkey" PRIMARY KEY ("pengguna_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_username_key" ON "dapodik"."pengguna"("username");

-- CreateIndex
CREATE UNIQUE INDEX "pengguna_email_key" ON "dapodik"."pengguna"("email");
