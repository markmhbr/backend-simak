-- AlterTable
ALTER TABLE "dapodik"."gtks" ADD COLUMN     "id_telegram" TEXT,
ADD COLUMN     "no_whatsapp" TEXT;

-- AlterTable
ALTER TABLE "dapodik"."peserta_didik" ADD COLUMN     "email_aktif" TEXT,
ADD COLUMN     "is_wali" BOOLEAN DEFAULT false,
ADD COLUMN     "no_whatsapp" TEXT;

-- CreateTable
CREATE TABLE "dapodik"."jurusan_sp" (
    "jurusan_sp_id" UUID NOT NULL,
    "sekolah_id" UUID,
    "kebutuhan_khusus_id" INTEGER NOT NULL,
    "jurusan_id" TEXT NOT NULL,
    "nama_jurusan_sp" TEXT NOT NULL,
    "sk_izin" TEXT,
    "tanggal_sk_izin" DATE,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,
    "soft_delete" DECIMAL,
    "last_sync" TIMESTAMP(3),
    "updater_id" UUID,

    CONSTRAINT "jurusan_sp_pkey" PRIMARY KEY ("jurusan_sp_id")
);

-- CreateTable
CREATE TABLE "dapodik"."tugas_tambahan" (
    "ptk_tugas_tambahan_id" UUID NOT NULL,
    "ptk_id" UUID NOT NULL,
    "sekolah_id" UUID,
    "jabatan_ptk_id" DECIMAL,
    "jumlah_jam" DECIMAL,
    "nomor_sk" TEXT,
    "tmt_tambahan" DATE,
    "tst_tambahan" DATE,
    "soft_delete" DECIMAL,
    "create_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_update" TIMESTAMP(3) NOT NULL,
    "last_sync" TIMESTAMP(3),
    "updater_id" UUID,

    CONSTRAINT "tugas_tambahan_pkey" PRIMARY KEY ("ptk_tugas_tambahan_id")
);

-- CreateTable
CREATE TABLE "simak"."pengajuan_perbaikan" (
    "id" UUID NOT NULL,
    "sekolah_id" UUID NOT NULL,
    "ptk_id" UUID,
    "peserta_didik_id" UUID,
    "tipe" TEXT NOT NULL,
    "perubahan" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pengajuan_perbaikan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simak"."menu_roles" (
    "menu_role_id" UUID NOT NULL,
    "menu_id" VARCHAR(100) NOT NULL,
    "peran_id" INTEGER NOT NULL,
    "peran_nama" VARCHAR(100),

    CONSTRAINT "menu_roles_pkey" PRIMARY KEY ("menu_role_id")
);

-- CreateIndex
CREATE INDEX "jurusan_sp_sekolah_id_idx" ON "dapodik"."jurusan_sp"("sekolah_id");

-- CreateIndex
CREATE INDEX "tugas_tambahan_ptk_id_idx" ON "dapodik"."tugas_tambahan"("ptk_id");

-- CreateIndex
CREATE INDEX "tugas_tambahan_sekolah_id_idx" ON "dapodik"."tugas_tambahan"("sekolah_id");

-- CreateIndex
CREATE INDEX "menu_roles_menu_id_idx" ON "simak"."menu_roles"("menu_id");

-- CreateIndex
CREATE INDEX "menu_roles_peran_id_idx" ON "simak"."menu_roles"("peran_id");

-- AddForeignKey
ALTER TABLE "dapodik"."rombongan_belajar" ADD CONSTRAINT "rombongan_belajar_jurusan_sp_id_fkey" FOREIGN KEY ("jurusan_sp_id") REFERENCES "dapodik"."jurusan_sp"("jurusan_sp_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "dapodik"."tugas_tambahan" ADD CONSTRAINT "tugas_tambahan_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE RESTRICT ON UPDATE CASCADE;
