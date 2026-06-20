import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

// Configure DB
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrl = envContent.match(/DATABASE_URL="?([^"\n\r]*)"?/)?.[1];

if (!dbUrl) {
  console.error('DATABASE_URL tidak ditemukan di .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("=== MEMULAI KOREKSI EKSTENSI FILE DATABASE ===");

  // 1. Periksa Permohonan Layanan File
  const files = await prisma.permohonanLayananFile.findMany();
  console.log(`Menemukan ${files.length} record permohonan file.`);

  let updatedFilesCount = 0;

  for (const f of files) {
    if (!f.file_url) continue;

    const fileExt = path.extname(f.file_url).toLowerCase();
    // Jika ekstensinya bukan .jpg dan bukan .pdf (yang tidak dikompres)
    if (fileExt !== '.jpg' && fileExt !== '.pdf') {
      const fullPath = path.join(process.cwd(), f.file_url.replace(/^\//, ''));
      
      // Cek apakah file asli ada di disk
      if (!fs.existsSync(fullPath)) {
        // Cek apakah versi .jpg ada di disk
        const baseName = path.parse(fullPath).name;
        const dirName = path.dirname(fullPath);
        const jpgFullPath = path.join(dirName, `${baseName}.jpg`);

        if (fs.existsSync(jpgFullPath)) {
          // Update record di database
          const newUrl = f.file_url.replace(new RegExp(`\\${fileExt}$`, 'i'), '.jpg');
          const newName = f.nama_file.replace(new RegExp(`\\${fileExt}$`, 'i'), '.jpg');

          console.log(`Mengoreksi permohonan file id: ${f.permohonan_layanan_file_id}`);
          console.log(`  Dari: ${f.file_url}`);
          console.log(`  Ke  : ${newUrl}`);

          await prisma.permohonanLayananFile.update({
            where: { permohonan_layanan_file_id: f.permohonan_layanan_file_id },
            data: {
              nama_file: newName,
              file_url: newUrl,
            }
          });
          updatedFilesCount++;
        }
      }
    }
  }

  console.log(`Selesai memproses permohonan file. Terkoreksi: ${updatedFilesCount} file.`);
  console.log("=== KOREKSI SELESAI ===");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
