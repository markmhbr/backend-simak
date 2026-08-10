-- =========================================================================
-- SQL Migration & Cleanup Script untuk SIMAK (Multi-Sekolah Support)
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
-- 3. PEMBERSIHAN DATA PERAN TAMBAHAN / TUGAS TAMBAHAN LAMA & YATIM
-- -------------------------------------------------------------------------
-- 3a. Hapus tugas tambahan yang sudah di-soft-delete
DELETE FROM dapodik.ptk_tugas_tambahan WHERE soft_delete > 0;

-- 3b. Hapus tugas tambahan yatim (yang ptk_id NULL dan peserta_didik_id NULL)
DELETE FROM dapodik.ptk_tugas_tambahan WHERE ptk_id IS NULL AND peserta_didik_id IS NULL;

-- 3c. Sinkronkan sekolah_id pada ptk_tugas_tambahan yang masih NULL berdasarkan ptk/pd terkait
UPDATE dapodik.ptk_tugas_tambahan tt
SET sekolah_id = g.sekolah_id
FROM dapodik.gtk g
WHERE tt.sekolah_id IS NULL 
  AND tt.ptk_id = g.ptk_id 
  AND g.sekolah_id IS NOT NULL;

UPDATE dapodik.ptk_tugas_tambahan tt
SET sekolah_id = pd.sekolah_id
FROM dapodik.peserta_didik pd
WHERE tt.sekolah_id IS NULL 
  AND tt.peserta_didik_id = pd.peserta_didik_id 
  AND pd.sekolah_id IS NOT NULL;
