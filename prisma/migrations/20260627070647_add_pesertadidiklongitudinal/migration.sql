-- AlterTable
ALTER TABLE "dapodik"."peserta_didik" ADD COLUMN     "berat_badan" DECIMAL(38,0),
ADD COLUMN     "jarak_rumah_ke_sekolah" DECIMAL(38,0),
ADD COLUMN     "jarak_rumah_ke_sekolah_km" DECIMAL(38,0),
ADD COLUMN     "jumlah_saudara_kandung" DECIMAL(38,0),
ADD COLUMN     "lingkar_kepala" DECIMAL(38,0),
ADD COLUMN     "menit_tempuh_ke_sekolah" DECIMAL(38,0),
ADD COLUMN     "tinggi_badan" DECIMAL(38,0),
ADD COLUMN     "waktu_tempuh_ke_sekolah" DECIMAL(38,0);

-- CreateTable
CREATE TABLE "dapodik"."rwy_kepangkatan" (
    "riwayat_kepangkatan_id" UUID NOT NULL,
    "sekolah_id" UUID,
    "ptk_id" UUID,
    "pangkat_golongan_id" DECIMAL(38,0),
    "nomor_sk" TEXT,
    "tanggal_sk" DATE,
    "tmt_pangkat" DATE,
    "masa_kerja_gol_tahun" DECIMAL(38,0),
    "masa_kerja_gol_bulan" DECIMAL(38,0),
    "asal_data" TEXT,
    "create_date" TIMESTAMP(3),
    "last_update" TIMESTAMP(3),
    "soft_delete" DECIMAL(38,0),
    "last_sync" TIMESTAMP(3),
    "updater_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rwy_kepangkatan_pkey" PRIMARY KEY ("riwayat_kepangkatan_id")
);

-- AddForeignKey
ALTER TABLE "dapodik"."anggota_rombel" ADD CONSTRAINT "anggota_rombel_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dapodik"."rwy_kepangkatan" ADD CONSTRAINT "rwy_kepangkatan_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE CASCADE ON UPDATE CASCADE;
