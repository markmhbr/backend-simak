/*
  Warnings:

  - You are about to drop the column `peran_id_str` on the `pengguna` table. All the data in the column will be lost.
  - You are about to drop the column `agama_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `alasan_layak_pip` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `alasan_menolak_kip` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `alat_transportasi_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `anggota_rombel_id` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `asal_data` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `berat_badan` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `cita_cita` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `create_date` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `dusun` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `hobi` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `jarak_rumah_ke_sekolah_km` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_pendaftaran_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `jenis_tinggal_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `jumlah_saudara_kandung` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `kabupaten_kota` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `kebutuhan_khusus` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `kebutuhan_khusus_ayah` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `kebutuhan_khusus_ibu` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `kecamatan` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `ket_keluar` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `konfirmasi_mutasi` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `kurikulum_id` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `kurikulum_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `last_sync` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `last_update` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `lingkar_kepala` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `nama_di_kip` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `nama_ibu` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `nama_rombel` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `no_registrasi_akta_lahir` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `no_seri_skhun` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `no_ujian_nasional` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `no_wa` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `no_wa_ayah` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `no_wa_ibu` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `no_wa_wali` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `nomor_induk_pd` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `npsn_sekolah_asal` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `paud_formal` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `paud_non_formal` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `pekerjaan_ayah_id` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `pekerjaan_ayah_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `pekerjaan_ibu_id` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `pekerjaan_ibu_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `pekerjaan_wali_id` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `pekerjaan_wali_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `pendidikan_ayah_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `pendidikan_ibu_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `pendidikan_wali_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `penghasilan_ayah_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `penghasilan_ibu_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `penghasilan_wali_id_str` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `provinsi` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `semester_id` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `status_wali` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `tinggi_badan` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `tingkat_pendidikan_id` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `updater_id` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `vld_count` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `waktu_tempuh_menit` on the `peserta_didik` table. All the data in the column will be lost.
  - You are about to drop the column `yatim_piatu` on the `peserta_didik` table. All the data in the column will be lost.
  - The `agama_id` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rt` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `rw` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jenis_tinggal_id` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `alat_transportasi_id` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `anak_keberapa` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tahun_lahir_ayah` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jenjang_pendidikan_ayah` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `penghasilan_id_ayah` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tahun_lahir_ibu` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jenjang_pendidikan_ibu` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `penghasilan_id_ibu` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tahun_lahir_wali` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jenjang_pendidikan_wali` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `penghasilan_id_wali` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `penerima_kps` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `layak_pip` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id_layak_pip` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `penerima_kip` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jenis_pendaftaran_id` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `jurusan_sp_id` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `a_pernah_paud` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `a_pernah_tk` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id_hobby` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id_cita` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `soft_delete` column on the `peserta_didik` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "dapodik"."pengguna" DROP COLUMN "peran_id_str",
ADD COLUMN     "peran_id" INTEGER,
ADD COLUMN     "peran_nama" TEXT;

-- AlterTable
ALTER TABLE "dapodik"."peserta_didik" DROP COLUMN "agama_id_str",
DROP COLUMN "alasan_layak_pip",
DROP COLUMN "alasan_menolak_kip",
DROP COLUMN "alat_transportasi_id_str",
DROP COLUMN "anggota_rombel_id",
DROP COLUMN "asal_data",
DROP COLUMN "berat_badan",
DROP COLUMN "cita_cita",
DROP COLUMN "create_date",
DROP COLUMN "dusun",
DROP COLUMN "hobi",
DROP COLUMN "jarak_rumah_ke_sekolah_km",
DROP COLUMN "jenis_pendaftaran_id_str",
DROP COLUMN "jenis_tinggal_id_str",
DROP COLUMN "jumlah_saudara_kandung",
DROP COLUMN "kabupaten_kota",
DROP COLUMN "kebutuhan_khusus",
DROP COLUMN "kebutuhan_khusus_ayah",
DROP COLUMN "kebutuhan_khusus_ibu",
DROP COLUMN "kecamatan",
DROP COLUMN "ket_keluar",
DROP COLUMN "konfirmasi_mutasi",
DROP COLUMN "kurikulum_id",
DROP COLUMN "kurikulum_id_str",
DROP COLUMN "last_sync",
DROP COLUMN "last_update",
DROP COLUMN "lingkar_kepala",
DROP COLUMN "nama_di_kip",
DROP COLUMN "nama_ibu",
DROP COLUMN "nama_rombel",
DROP COLUMN "no_registrasi_akta_lahir",
DROP COLUMN "no_seri_skhun",
DROP COLUMN "no_ujian_nasional",
DROP COLUMN "no_wa",
DROP COLUMN "no_wa_ayah",
DROP COLUMN "no_wa_ibu",
DROP COLUMN "no_wa_wali",
DROP COLUMN "nomor_induk_pd",
DROP COLUMN "npsn_sekolah_asal",
DROP COLUMN "paud_formal",
DROP COLUMN "paud_non_formal",
DROP COLUMN "pekerjaan_ayah_id",
DROP COLUMN "pekerjaan_ayah_id_str",
DROP COLUMN "pekerjaan_ibu_id",
DROP COLUMN "pekerjaan_ibu_id_str",
DROP COLUMN "pekerjaan_wali_id",
DROP COLUMN "pekerjaan_wali_id_str",
DROP COLUMN "pendidikan_ayah_id_str",
DROP COLUMN "pendidikan_ibu_id_str",
DROP COLUMN "pendidikan_wali_id_str",
DROP COLUMN "penghasilan_ayah_id_str",
DROP COLUMN "penghasilan_ibu_id_str",
DROP COLUMN "penghasilan_wali_id_str",
DROP COLUMN "provinsi",
DROP COLUMN "semester_id",
DROP COLUMN "status_wali",
DROP COLUMN "tinggi_badan",
DROP COLUMN "tingkat_pendidikan_id",
DROP COLUMN "updater_id",
DROP COLUMN "vld_count",
DROP COLUMN "waktu_tempuh_menit",
DROP COLUMN "yatim_piatu",
ADD COLUMN     "nama_ibu_kandung" TEXT,
DROP COLUMN "agama_id",
ADD COLUMN     "agama_id" SMALLINT,
ALTER COLUMN "kewarganegaraan" DROP DEFAULT,
DROP COLUMN "rt",
ADD COLUMN     "rt" DECIMAL,
DROP COLUMN "rw",
ADD COLUMN     "rw" DECIMAL,
ALTER COLUMN "lintang" SET DATA TYPE DECIMAL,
ALTER COLUMN "bujur" SET DATA TYPE DECIMAL,
DROP COLUMN "jenis_tinggal_id",
ADD COLUMN     "jenis_tinggal_id" DECIMAL,
DROP COLUMN "alat_transportasi_id",
ADD COLUMN     "alat_transportasi_id" DECIMAL,
DROP COLUMN "anak_keberapa",
ADD COLUMN     "anak_keberapa" DECIMAL,
DROP COLUMN "tahun_lahir_ayah",
ADD COLUMN     "tahun_lahir_ayah" DECIMAL,
DROP COLUMN "jenjang_pendidikan_ayah",
ADD COLUMN     "jenjang_pendidikan_ayah" DECIMAL,
DROP COLUMN "penghasilan_id_ayah",
ADD COLUMN     "penghasilan_id_ayah" INTEGER,
DROP COLUMN "tahun_lahir_ibu",
ADD COLUMN     "tahun_lahir_ibu" DECIMAL,
DROP COLUMN "jenjang_pendidikan_ibu",
ADD COLUMN     "jenjang_pendidikan_ibu" DECIMAL,
DROP COLUMN "penghasilan_id_ibu",
ADD COLUMN     "penghasilan_id_ibu" INTEGER,
DROP COLUMN "tahun_lahir_wali",
ADD COLUMN     "tahun_lahir_wali" DECIMAL,
DROP COLUMN "jenjang_pendidikan_wali",
ADD COLUMN     "jenjang_pendidikan_wali" DECIMAL,
DROP COLUMN "penghasilan_id_wali",
ADD COLUMN     "penghasilan_id_wali" INTEGER,
DROP COLUMN "penerima_kps",
ADD COLUMN     "penerima_kps" DECIMAL,
DROP COLUMN "layak_pip",
ADD COLUMN     "layak_pip" DECIMAL,
DROP COLUMN "id_layak_pip",
ADD COLUMN     "id_layak_pip" DECIMAL,
DROP COLUMN "penerima_kip",
ADD COLUMN     "penerima_kip" DECIMAL,
DROP COLUMN "jenis_pendaftaran_id",
ADD COLUMN     "jenis_pendaftaran_id" DECIMAL,
DROP COLUMN "jurusan_sp_id",
ADD COLUMN     "jurusan_sp_id" UUID,
DROP COLUMN "a_pernah_paud",
ADD COLUMN     "a_pernah_paud" DECIMAL,
DROP COLUMN "a_pernah_tk",
ADD COLUMN     "a_pernah_tk" DECIMAL,
DROP COLUMN "id_hobby",
ADD COLUMN     "id_hobby" DECIMAL,
DROP COLUMN "id_cita",
ADD COLUMN     "id_cita" DECIMAL,
DROP COLUMN "soft_delete",
ADD COLUMN     "soft_delete" DECIMAL;

-- AddForeignKey
ALTER TABLE "dapodik"."peserta_didik" ADD CONSTRAINT "peserta_didik_agama_id_fkey" FOREIGN KEY ("agama_id") REFERENCES "ref"."agama"("agama_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
