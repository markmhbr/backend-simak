-- =========================================================================
-- SQL Migration Script untuk SIMAK Menu Roles (Multi-Sekolah Support)
-- Jalankan perintah SQL ini di pgAdmin / DBeaver / Terminal PostgreSQL Hosting
-- =========================================================================

-- 1. Tambahkan kolom sekolah_id ke tabel simak.menu_roles (jika belum ada)
ALTER TABLE simak.menu_roles ADD COLUMN IF NOT EXISTS sekolah_id UUID NULL;

-- 2. Buat indeks untuk kolom sekolah_id agar pencarian cepat
CREATE INDEX IF NOT EXISTS menu_roles_sekolah_id_idx ON simak.menu_roles(sekolah_id);

-- 3. (Opsional) Jika Anda ingin membersihkan data pengaturan menu lama 
--    yang belum terasosiasi dengan sekolah_id manapun (sekolah_id IS NULL):
-- UNCOMMENT baris di bawah jika ingin menghapus data menu_roles yang tidak terkait sekolah:
-- DELETE FROM simak.menu_roles WHERE sekolah_id IS NULL;
