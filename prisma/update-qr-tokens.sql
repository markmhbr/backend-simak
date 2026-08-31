-- 1. Update Peserta Didik di schema dapodik ke format universal: sekolah_id/peserta_didik_id
UPDATE "dapodik"."peserta_didik" 
SET qr_token = CONCAT(sekolah_id, '/', peserta_didik_id) 
WHERE sekolah_id IS NOT NULL;

-- 2. Update GTK di schema dapodik ke format universal: sekolah_id/ptk_id
UPDATE "dapodik"."gtks" 
SET qr_token = CONCAT(sekolah_id, '/', ptk_id) 
WHERE sekolah_id IS NOT NULL;
