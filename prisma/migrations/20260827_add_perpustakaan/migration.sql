-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "simak";

-- CreateTable kategori_buku
CREATE TABLE IF NOT EXISTS "simak"."kategori_buku" (
    "kategori_buku_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sekolah_id" UUID NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kategori_buku_pkey" PRIMARY KEY ("kategori_buku_id")
);

-- CreateTable buku
CREATE TABLE IF NOT EXISTS "simak"."buku" (
    "buku_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sekolah_id" UUID NOT NULL,
    "kategori_buku_id" UUID NOT NULL,
    "kode" TEXT NOT NULL,
    "isbn" TEXT,
    "judul" TEXT NOT NULL,
    "penulis" TEXT,
    "penerbit" TEXT,
    "tahun_terbit" INTEGER,
    "jumlah" INTEGER NOT NULL DEFAULT 0,
    "tersedia" INTEGER NOT NULL DEFAULT 0,
    "kondisi" SMALLINT NOT NULL DEFAULT 1,
    "lokasi_rak" TEXT,
    "sampul" TEXT,
    "deskripsi" TEXT,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "buku_pkey" PRIMARY KEY ("buku_id")
);

-- CreateTable peminjaman
CREATE TABLE IF NOT EXISTS "simak"."peminjaman" (
    "peminjaman_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sekolah_id" UUID NOT NULL,
    "peserta_didik_id" UUID,
    "ptk_id" UUID,
    "nomor_peminjaman" TEXT NOT NULL,
    "tanggal_pinjam" DATE NOT NULL,
    "tanggal_jatuh_tempo" DATE NOT NULL,
    "tanggal_kembali" DATE,
    "status" SMALLINT NOT NULL DEFAULT 1,
    "denda" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "keterangan" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "peminjaman_pkey" PRIMARY KEY ("peminjaman_id")
);

-- CreateTable detail_peminjaman
CREATE TABLE IF NOT EXISTS "simak"."detail_peminjaman" (
    "detail_peminjaman_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "peminjaman_id" UUID NOT NULL,
    "buku_id" UUID NOT NULL,
    "jumlah" INTEGER NOT NULL DEFAULT 1,
    "jumlah_kembali" INTEGER NOT NULL DEFAULT 0,
    "kondisi_kembali" SMALLINT,
    "keterangan" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "detail_peminjaman_pkey" PRIMARY KEY ("detail_peminjaman_id")
);

-- CreateTable kunjungan_perpustakaan
CREATE TABLE IF NOT EXISTS "simak"."kunjungan_perpustakaan" (
    "kunjungan_perpustakaan_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sekolah_id" UUID NOT NULL,
    "peserta_didik_id" UUID,
    "ptk_id" UUID,
    "tanggal" DATE NOT NULL,
    "jam_masuk" TEXT NOT NULL,
    "jam_keluar" TEXT,
    "keperluan" TEXT,
    "keterangan" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "kunjungan_perpustakaan_pkey" PRIMARY KEY ("kunjungan_perpustakaan_id")
);

-- CreateTable literasi_perpustakaan
CREATE TABLE IF NOT EXISTS "simak"."literasi_perpustakaan" (
    "literasi_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sekolah_id" UUID NOT NULL,
    "peserta_didik_id" UUID NOT NULL,
    "nama_buku" TEXT NOT NULL,
    "halaman_dari" INTEGER NOT NULL,
    "halaman_sampai" INTEGER NOT NULL,
    "kesimpulan" TEXT,
    "tanggal" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "literasi_perpustakaan_pkey" PRIMARY KEY ("literasi_id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "kategori_buku_sekolah_id_nama_key" ON "simak"."kategori_buku"("sekolah_id", "nama");
CREATE INDEX IF NOT EXISTS "kategori_buku_sekolah_id_idx" ON "simak"."kategori_buku"("sekolah_id");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "buku_sekolah_id_kode_key" ON "simak"."buku"("sekolah_id", "kode");
CREATE INDEX IF NOT EXISTS "buku_sekolah_id_idx" ON "simak"."buku"("sekolah_id");
CREATE INDEX IF NOT EXISTS "buku_kategori_buku_id_idx" ON "simak"."buku"("kategori_buku_id");
CREATE INDEX IF NOT EXISTS "buku_sekolah_id_judul_idx" ON "simak"."buku"("sekolah_id", "judul");
CREATE INDEX IF NOT EXISTS "buku_sekolah_id_status_idx" ON "simak"."buku"("sekolah_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "peminjaman_sekolah_id_nomor_peminjaman_key" ON "simak"."peminjaman"("sekolah_id", "nomor_peminjaman");
CREATE INDEX IF NOT EXISTS "peminjaman_sekolah_id_idx" ON "simak"."peminjaman"("sekolah_id");
CREATE INDEX IF NOT EXISTS "peminjaman_peserta_didik_id_idx" ON "simak"."peminjaman"("peserta_didik_id");
CREATE INDEX IF NOT EXISTS "peminjaman_ptk_id_idx" ON "simak"."peminjaman"("ptk_id");
CREATE INDEX IF NOT EXISTS "peminjaman_sekolah_id_status_idx" ON "simak"."peminjaman"("sekolah_id", "status");
CREATE INDEX IF NOT EXISTS "peminjaman_sekolah_id_tanggal_pinjam_idx" ON "simak"."peminjaman"("sekolah_id", "tanggal_pinjam");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "detail_peminjaman_peminjaman_id_idx" ON "simak"."detail_peminjaman"("peminjaman_id");
CREATE INDEX IF NOT EXISTS "detail_peminjaman_buku_id_idx" ON "simak"."detail_peminjaman"("buku_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "kunjungan_perpustakaan_sekolah_id_idx" ON "simak"."kunjungan_perpustakaan"("sekolah_id");
CREATE INDEX IF NOT EXISTS "kunjungan_perpustakaan_peserta_didik_id_idx" ON "simak"."kunjungan_perpustakaan"("peserta_didik_id");
CREATE INDEX IF NOT EXISTS "kunjungan_perpustakaan_ptk_id_idx" ON "simak"."kunjungan_perpustakaan"("ptk_id");
CREATE INDEX IF NOT EXISTS "kunjungan_perpustakaan_sekolah_id_tanggal_idx" ON "simak"."kunjungan_perpustakaan"("sekolah_id", "tanggal");
CREATE INDEX IF NOT EXISTS "kunjungan_perpustakaan_sekolah_id_jam_masuk_idx" ON "simak"."kunjungan_perpustakaan"("sekolah_id", "jam_masuk");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "literasi_perpustakaan_sekolah_id_idx" ON "simak"."literasi_perpustakaan"("sekolah_id");
CREATE INDEX IF NOT EXISTS "literasi_perpustakaan_peserta_didik_id_idx" ON "simak"."literasi_perpustakaan"("peserta_didik_id");
CREATE INDEX IF NOT EXISTS "literasi_perpustakaan_sekolah_id_tanggal_idx" ON "simak"."literasi_perpustakaan"("sekolah_id", "tanggal");
CREATE INDEX IF NOT EXISTS "literasi_perpustakaan_sekolah_id_peserta_didik_id_idx" ON "simak"."literasi_perpustakaan"("sekolah_id", "peserta_didik_id");

-- AddForeignKey (with IF NOT EXISTS guard logic)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kategori_buku_sekolah_id_fkey') THEN
        ALTER TABLE "simak"."kategori_buku" ADD CONSTRAINT "kategori_buku_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'buku_sekolah_id_fkey') THEN
        ALTER TABLE "simak"."buku" ADD CONSTRAINT "buku_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'buku_kategori_buku_id_fkey') THEN
        ALTER TABLE "simak"."buku" ADD CONSTRAINT "buku_kategori_buku_id_fkey" FOREIGN KEY ("kategori_buku_id") REFERENCES "simak"."kategori_buku"("kategori_buku_id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'peminjaman_sekolah_id_fkey') THEN
        ALTER TABLE "simak"."peminjaman" ADD CONSTRAINT "peminjaman_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'peminjaman_peserta_didik_id_fkey') THEN
        ALTER TABLE "simak"."peminjaman" ADD CONSTRAINT "peminjaman_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'peminjaman_ptk_id_fkey') THEN
        ALTER TABLE "simak"."peminjaman" ADD CONSTRAINT "peminjaman_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'detail_peminjaman_peminjaman_id_fkey') THEN
        ALTER TABLE "simak"."detail_peminjaman" ADD CONSTRAINT "detail_peminjaman_peminjaman_id_fkey" FOREIGN KEY ("peminjaman_id") REFERENCES "simak"."peminjaman"("peminjaman_id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'detail_peminjaman_buku_id_fkey') THEN
        ALTER TABLE "simak"."detail_peminjaman" ADD CONSTRAINT "detail_peminjaman_buku_id_fkey" FOREIGN KEY ("buku_id") REFERENCES "simak"."buku"("buku_id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kunjungan_perpustakaan_sekolah_id_fkey') THEN
        ALTER TABLE "simak"."kunjungan_perpustakaan" ADD CONSTRAINT "kunjungan_perpustakaan_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kunjungan_perpustakaan_peserta_didik_id_fkey') THEN
        ALTER TABLE "simak"."kunjungan_perpustakaan" ADD CONSTRAINT "kunjungan_perpustakaan_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'kunjungan_perpustakaan_ptk_id_fkey') THEN
        ALTER TABLE "simak"."kunjungan_perpustakaan" ADD CONSTRAINT "kunjungan_perpustakaan_ptk_id_fkey" FOREIGN KEY ("ptk_id") REFERENCES "dapodik"."gtks"("ptk_id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'literasi_perpustakaan_sekolah_id_fkey') THEN
        ALTER TABLE "simak"."literasi_perpustakaan" ADD CONSTRAINT "literasi_perpustakaan_sekolah_id_fkey" FOREIGN KEY ("sekolah_id") REFERENCES "dapodik"."sekolah"("sekolah_id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'literasi_perpustakaan_peserta_didik_id_fkey') THEN
        ALTER TABLE "simak"."literasi_perpustakaan" ADD CONSTRAINT "literasi_perpustakaan_peserta_didik_id_fkey" FOREIGN KEY ("peserta_didik_id") REFERENCES "dapodik"."peserta_didik"("peserta_didik_id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
