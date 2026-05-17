-- CreateTable
CREATE TABLE "dapodik"."rombongan_belajar" (
    "rombongan_belajar_id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "tingkat_pendidikan_id" TEXT,
    "tingkat_pendidikan_id_str" TEXT,
    "semester_id" TEXT,
    "jenis_rombel" TEXT,
    "jenis_rombel_str" TEXT,
    "kurikulum_id" INTEGER,
    "kurikulum_id_str" TEXT,
    "id_ruang" UUID,
    "id_ruang_str" TEXT,
    "moving_class" TEXT,
    "ptk_id" UUID,
    "ptk_id_str" TEXT,
    "jurusan_id" TEXT,
    "jurusan_id_str" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rombongan_belajar_pkey" PRIMARY KEY ("rombongan_belajar_id")
);

-- CreateTable
CREATE TABLE "dapodik"."anggota_rombel" (
    "anggota_rombel_id" UUID NOT NULL,
    "rombongan_belajar_id" UUID NOT NULL,
    "peserta_didik_id" UUID NOT NULL,
    "jenis_pendaftaran_id" TEXT,
    "jenis_pendaftaran_id_str" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anggota_rombel_pkey" PRIMARY KEY ("anggota_rombel_id")
);

-- CreateTable
CREATE TABLE "dapodik"."pembelajaran" (
    "pembelajaran_id" UUID NOT NULL,
    "rombongan_belajar_id" UUID NOT NULL,
    "mata_pelajaran_id" TEXT,
    "mata_pelajaran_id_str" TEXT,
    "ptk_terdaftar_id" UUID,
    "ptk_id" UUID,
    "nama_mata_pelajaran" TEXT,
    "induk_pembelajaran_id" UUID,
    "jam_mengajar_per_minggu" TEXT,
    "status_di_kurikulum" TEXT,
    "status_di_kurikulum_str" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pembelajaran_pkey" PRIMARY KEY ("pembelajaran_id")
);

-- AddForeignKey
ALTER TABLE "dapodik"."anggota_rombel" ADD CONSTRAINT "anggota_rombel_rombongan_belajar_id_fkey" FOREIGN KEY ("rombongan_belajar_id") REFERENCES "dapodik"."rombongan_belajar"("rombongan_belajar_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."pembelajaran" ADD CONSTRAINT "pembelajaran_rombongan_belajar_id_fkey" FOREIGN KEY ("rombongan_belajar_id") REFERENCES "dapodik"."rombongan_belajar"("rombongan_belajar_id") ON DELETE CASCADE ON UPDATE CASCADE;
