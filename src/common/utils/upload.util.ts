import * as fs from 'fs';
import * as path from 'path';

let sharp: any;
try {
  sharp = require('sharp');
} catch (err) {
  console.warn('Warning: sharp package not loaded. Image compression will be disabled. Fallback to direct write.');
}

/**
 * Kompres gambar agar ukurannya di bawah 100KB dan menyimpannya ke folder tujuan.
 * @param fileBuffer Buffer data gambar
 * @param destinationDir Folder tujuan penyimpanan
 * @param fileName Nama file output (tanpa path)
 * @returns Path relatif / absolut dari file yang disimpan
 */
export async function compressAndSaveImage(
  fileBuffer: Buffer,
  destinationDir: string,
  fileName: string,
): Promise<string> {
  // Buat folder jika belum ada
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  const baseName = path.parse(fileName).name;
  const outputFileName = `${baseName}.jpg`;
  const fullPath = path.join(destinationDir, outputFileName);

  // Jika sharp tidak terinstall, langsung simpan file asli
  if (!sharp) {
    fs.writeFileSync(fullPath, fileBuffer);
    return fullPath;
  }

  try {
    // Set dimensi maksimal (lebar/tinggi) ke 1000px agar hemat memori & space
    let quality = 80;
    let compressedBuffer = await sharp(fileBuffer)
      .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality })
      .toBuffer();

    // Loop kompresi jika ukuran file di atas 100 KB dan quality masih di atas 20
    while (compressedBuffer.length > 100 * 1024 && quality > 20) {
      quality -= 10;
      compressedBuffer = await sharp(fileBuffer)
        .resize(1000, 1000, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality })
        .toBuffer();
    }

    // Tulis buffer akhir ke file system
    fs.writeFileSync(fullPath, compressedBuffer);
    return fullPath;
  } catch (error) {
    console.error('Failed to compress image with sharp, falling back to direct write:', error);
    fs.writeFileSync(fullPath, fileBuffer);
    return fullPath;
  }
}

/**
 * Menyimpan dokumen ke folder tujuan dengan validasi ukuran.
 * @param fileBuffer Buffer data dokumen
 * @param destinationDir Folder tujuan penyimpanan
 * @param fileName Nama file output
 * @param maxSizeBytes Batas maksimum ukuran file (default 200KB)
 * @returns Path lengkap file yang disimpan
 */
export function saveDocument(
  fileBuffer: Buffer,
  destinationDir: string,
  fileName: string,
  maxSizeBytes: number = 200 * 1024,
): string {
  if (fileBuffer.length > maxSizeBytes) {
    const sizeInKb = Math.round(maxSizeBytes / 1024);
    throw new Error(`Dokumen terlalu besar. Maksimum ukuran dokumen adalah ${sizeInKb} KB.`);
  }

  // Buat folder jika belum ada
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  const fullPath = path.join(destinationDir, fileName);
  fs.writeFileSync(fullPath, fileBuffer);
  return fullPath;
}
