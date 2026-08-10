-- =========================================================================
-- SQL Migration & Reset Script untuk SIMAK (Multi-Sekolah Support)
-- Jalankan perintah SQL ini di pgAdmin / DBeaver / cPanel Terminal Hosting
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. MIGRASI STRUKTUR TABEL MENU_ROLES
-- -------------------------------------------------------------------------
-- Tambahkan kolom sekolah_id ke tabel simak.menu_roles (jika belum ada)
ALTER TABLE simak.menu_roles ADD COLUMN IF NOT EXISTS sekolah_id UUID NULL;

-- Buat indeks untuk kolom sekolah_id agar pencarian cepat
CREATE INDEX IF NOT EXISTS menu_roles_sekolah_id_idx ON simak.menu_roles(sekolah_id);


-- -------------------------------------------------------------------------
-- 2. PEMBERSIHAN DATA MENU ROLES LAMA (SEKOLAH_ID NULL)
-- -------------------------------------------------------------------------
-- Hapus data menu_roles lama yang tidak terikat ke sekolah manapun
DELETE FROM simak.menu_roles WHERE sekolah_id IS NULL;


-- -------------------------------------------------------------------------
-- 3. HAPUS SEMUA PERAN TAMBAHAN / TUGAS TAMBAHAN (RESET KOSONG)
-- -------------------------------------------------------------------------
-- Hapus seluruh data peran tambahan/tugas tambahan dari database
DELETE FROM dapodik.ptk_tugas_tambahan;
