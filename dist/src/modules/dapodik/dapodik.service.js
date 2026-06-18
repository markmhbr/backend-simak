"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DapodikService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let DapodikService = class DapodikService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getSekolahFilter(sekolahId) {
        if (!sekolahId) {
            throw new Error('Akses ditolak: Sekolah ID tidak ditemukan dalam kredensial API.');
        }
        return { sekolah_id: sekolahId };
    }
    async getLatestSemesterId(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const latestRombel = await this.prisma.rombonganBelajar.findFirst({
            where: filter,
            select: { semester_id: true },
            orderBy: { semester_id: 'desc' },
        });
        return latestRombel?.semester_id || null;
    }
    async getSummary(sekolahId) {
        if (!sekolahId)
            return null;
        const semesterId = await this.getLatestSemesterId(sekolahId);
        const [totalTanah, totalBangunan, totalRuang, totalSiswa, totalGtk, totalRombel] = await Promise.all([
            this.prisma.tanah.count({ where: { sekolah_id: sekolahId } }),
            this.prisma.bangunan.count({ where: { sekolah_id: sekolahId } }),
            this.prisma.ruang.count({ where: { sekolah_id: sekolahId } }),
            this.prisma.pesertaDidik.count({
                where: {
                    sekolah_id: sekolahId,
                    status: 'Aktif'
                }
            }),
            this.prisma.gtk.count({
                where: {
                    sekolah_id: sekolahId,
                    status: 'Aktif'
                }
            }),
            this.prisma.rombonganBelajar.count({
                where: {
                    sekolah_id: sekolahId,
                    semester_id: semesterId || undefined,
                    jenis_rombel_str: { contains: 'Kelas', mode: 'insensitive' }
                }
            }),
        ]);
        return {
            sekolah_id: sekolahId,
            total_tanah: totalTanah,
            total_bangunan: totalBangunan,
            total_ruang: totalRuang,
            total_siswa: totalSiswa,
            total_pd: totalSiswa,
            total_gtk: totalGtk,
            total_rombel: totalRombel,
        };
    }
    async getSekolah(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const sekolah = await this.prisma.sekolah.findUnique({
            where: { sekolah_id: filter.sekolah_id },
        });
        if (!sekolah)
            return null;
        let kepalaSekolah = await this.prisma.pengguna.findFirst({
            where: {
                sekolah_id: filter.sekolah_id,
                peran_id_str: { contains: 'Kepala Sekolah', mode: 'insensitive' }
            },
            select: { nama: true }
        });
        let namaKepalaSekolah = kepalaSekolah?.nama || null;
        if (!namaKepalaSekolah) {
            const kepalaSekolahGtk = await this.prisma.gtk.findFirst({
                where: {
                    AND: [
                        { sekolah_id: filter.sekolah_id },
                        {
                            OR: [
                                { jabatan_ptk_id_str: { contains: 'Kepala Sekolah', mode: 'insensitive' } },
                                { jenis_ptk_id_str: { contains: 'Kepala Sekolah', mode: 'insensitive' } },
                                { ptk_induk: { contains: 'Kepala Sekolah', mode: 'insensitive' } }
                            ]
                        }
                    ]
                },
                select: { nama: true }
            });
            namaKepalaSekolah = kepalaSekolahGtk?.nama || null;
        }
        const operatorSekolah = await this.prisma.pengguna.findFirst({
            where: {
                sekolah_id: filter.sekolah_id,
                peran_id_str: { contains: 'Operator Sekolah', mode: 'insensitive' }
            },
            select: { nama: true }
        });
        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        const logoUrl = sekolah.logo ? (sekolah.logo.startsWith('http') ? sekolah.logo : `${appUrl}${sekolah.logo}`) : null;
        return {
            ...sekolah,
            logo: logoUrl,
            nama_kepala_sekolah: namaKepalaSekolah,
            nama_operator: operatorSekolah?.nama || null
        };
    }
    async updateSekolah(sekolahId, data) {
        return await this.prisma.sekolah.update({
            where: { sekolah_id: sekolahId },
            data: {
                nama: data.nama,
                npsn: data.npsn,
                nomor_telepon: data.nomor_telepon,
                nomor_fax: data.nomor_fax,
                email: data.email,
                website: data.website,
                spmb: data.spmb,
                peta: data.peta,
                social_media: data.social_media,
                cadisdik_id: data.cadisdik_id,
            },
        });
    }
    async uploadLogo(sekolahId, file) {
        const path = require('path');
        const { compressAndSaveImage } = require('../../common/utils/upload.util');
        const destDir = path.join(process.cwd(), 'storage', sekolahId);
        const fileName = 'logo';
        await compressAndSaveImage(file.buffer, destDir, fileName);
        const relativePath = `/storage/${sekolahId}/logo.jpg`;
        return await this.prisma.sekolah.update({
            where: { sekolah_id: sekolahId },
            data: { logo: relativePath },
        });
    }
    async uploadSiswaFoto(sekolahId, uuidSiswa, file) {
        const path = require('path');
        const { compressAndSaveImage } = require('../../common/utils/upload.util');
        const siswa = await this.prisma.pesertaDidik.findFirst({
            where: { peserta_didik_id: uuidSiswa, sekolah_id: sekolahId }
        });
        if (!siswa) {
            throw new Error('Siswa tidak ditemukan atau tidak terdaftar di sekolah Anda.');
        }
        const destDir = path.join(process.cwd(), 'storage', sekolahId, 'siswa', uuidSiswa);
        const fileName = 'foto_profil';
        const savedPath = await compressAndSaveImage(file.buffer, destDir, fileName);
        const relativePath = `/storage/${sekolahId}/siswa/${uuidSiswa}/foto_profil.jpg`;
        await this.prisma.pesertaDidik.update({
            where: { peserta_didik_id: uuidSiswa },
            data: { foto: relativePath }
        });
        return {
            filePath: relativePath,
            savedPath
        };
    }
    async uploadGtkFoto(sekolahId, uuidGtk, file) {
        const path = require('path');
        const { compressAndSaveImage } = require('../../common/utils/upload.util');
        const gtk = await this.prisma.gtk.findFirst({
            where: { ptk_id: uuidGtk, sekolah_id: sekolahId }
        });
        if (!gtk) {
            throw new Error('GTK tidak ditemukan atau tidak terdaftar di sekolah Anda.');
        }
        const destDir = path.join(process.cwd(), 'storage', sekolahId, 'gtk', uuidGtk);
        const fileName = 'foto_profil';
        const savedPath = await compressAndSaveImage(file.buffer, destDir, fileName);
        const relativePath = `/storage/${sekolahId}/gtk/${uuidGtk}/foto_profil.jpg`;
        await this.prisma.gtk.update({
            where: { ptk_id: uuidGtk },
            data: { foto: relativePath }
        });
        return {
            filePath: relativePath,
            savedPath
        };
    }
    async uploadSiswaDokumen(sekolahId, uuidSiswa, file, docName) {
        const path = require('path');
        const { compressAndSaveImage, saveDocument } = require('../../common/utils/upload.util');
        const siswa = await this.prisma.pesertaDidik.findFirst({
            where: { peserta_didik_id: uuidSiswa, sekolah_id: sekolahId }
        });
        if (!siswa) {
            throw new Error('Siswa tidak ditemukan atau tidak terdaftar di sekolah Anda.');
        }
        const destDir = path.join(process.cwd(), 'storage', sekolahId, 'siswa', uuidSiswa, 'dokumen');
        const fileExt = path.extname(file.originalname).toLowerCase();
        const cleanDocName = docName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
        const finalFileName = `${cleanDocName}${fileExt}`;
        let savedPath = '';
        let isCompressed = false;
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(fileExt)) {
            savedPath = await compressAndSaveImage(file.buffer, destDir, finalFileName);
            isCompressed = true;
        }
        else if (fileExt === '.pdf') {
            savedPath = saveDocument(file.buffer, destDir, finalFileName, 200 * 1024);
        }
        else {
            throw new Error('Format dokumen tidak didukung. Gunakan PDF atau Gambar (JPG, PNG, WebP).');
        }
        const relativePath = `/storage/${sekolahId}/siswa/${uuidSiswa}/dokumen/${finalFileName}`;
        return {
            fileName: finalFileName,
            filePath: relativePath,
            isCompressed,
            sizeBytes: file.buffer.length
        };
    }
    async uploadGtkDokumen(sekolahId, uuidGtk, file, docName) {
        const path = require('path');
        const { compressAndSaveImage, saveDocument } = require('../../common/utils/upload.util');
        const gtk = await this.prisma.gtk.findFirst({
            where: { ptk_id: uuidGtk, sekolah_id: sekolahId }
        });
        if (!gtk) {
            throw new Error('GTK tidak ditemukan atau tidak terdaftar di sekolah Anda.');
        }
        const destDir = path.join(process.cwd(), 'storage', sekolahId, 'gtk', uuidGtk, 'dokumen');
        const fileExt = path.extname(file.originalname).toLowerCase();
        const cleanDocName = docName.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
        const finalFileName = `${cleanDocName}${fileExt}`;
        let savedPath = '';
        let isCompressed = false;
        if (['.jpg', '.jpeg', '.png', '.webp'].includes(fileExt)) {
            savedPath = await compressAndSaveImage(file.buffer, destDir, finalFileName);
            isCompressed = true;
        }
        else if (fileExt === '.pdf') {
            savedPath = saveDocument(file.buffer, destDir, finalFileName, 200 * 1024);
        }
        else {
            throw new Error('Format dokumen tidak didukung. Gunakan PDF atau Gambar (JPG, PNG, WebP).');
        }
        const relativePath = `/storage/${sekolahId}/gtk/${uuidGtk}/dokumen/${finalFileName}`;
        return {
            fileName: finalFileName,
            filePath: relativePath,
            isCompressed,
            sizeBytes: file.buffer.length
        };
    }
    async deleteGtkDokumen(sekolahId, uuidGtk, fileName) {
        const fs = require('fs');
        const path = require('path');
        const destFile = path.join(process.cwd(), 'storage', sekolahId, 'gtk', uuidGtk, 'dokumen', fileName);
        if (fs.existsSync(destFile)) {
            fs.unlinkSync(destFile);
        }
    }
    async deleteSiswaDokumen(sekolahId, uuidSiswa, fileName) {
        const fs = require('fs');
        const path = require('path');
        const destFile = path.join(process.cwd(), 'storage', sekolahId, 'siswa', uuidSiswa, 'dokumen', fileName);
        if (fs.existsSync(destFile)) {
            fs.unlinkSync(destFile);
        }
    }
    async getTanah(sekolahId, limit = 10, search, page = 1) {
        const filter = this.getSekolahFilter(sekolahId);
        let whereClause = {
            AND: [{ sekolah_id: filter.sekolah_id }],
        };
        if (search) {
            whereClause.AND.push({
                OR: [
                    { nama: { contains: search, mode: 'insensitive' } },
                    { alamat_jalan: { contains: search, mode: 'insensitive' } },
                    { no_sertifikat_tanah: { contains: search, mode: 'insensitive' } },
                ],
            });
        }
        const skip = (page - 1) * limit;
        const [total, data] = await Promise.all([
            this.prisma.tanah.count({ where: whereClause }),
            this.prisma.tanah.findMany({
                where: whereClause,
                take: limit,
                skip: skip,
                orderBy: { nama: 'asc' },
            }),
        ]);
        return { total, data };
    }
    async getTahunPelajaran(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const semesters = await this.prisma.rombonganBelajar.findMany({
            where: filter,
            select: { semester_id: true },
            distinct: ['semester_id'],
            orderBy: { semester_id: 'desc' },
        });
        if (semesters.length === 0)
            return [];
        const latestSemesterId = semesters[0].semester_id;
        return semesters.map((s) => {
            const sId = s.semester_id || '';
            const yearPrefix = sId.substring(0, 4);
            const semesterCode = sId.substring(4, 5);
            const yearStart = parseInt(yearPrefix, 10);
            const yearEnd = yearStart + 1;
            return {
                semester_id: sId,
                tahun_pelajaran: `${yearStart}/${yearEnd}`,
                semester: semesterCode === '1' ? 'Ganjil' : 'Genap',
                status: sId === latestSemesterId ? 'Aktif' : 'Non-Aktif',
            };
        });
    }
    async getBangunan(sekolahId, limit = 10, search, page = 1) {
        const filter = this.getSekolahFilter(sekolahId);
        let whereClause = {
            AND: [{ sekolah_id: filter.sekolah_id }],
        };
        if (search) {
            whereClause.AND.push({
                OR: [
                    { nama: { contains: search, mode: 'insensitive' } },
                    { thn_dibangun: { contains: search, mode: 'insensitive' } },
                ],
            });
        }
        const skip = (page - 1) * limit;
        const [total, data] = await Promise.all([
            this.prisma.bangunan.count({ where: whereClause }),
            this.prisma.bangunan.findMany({
                where: whereClause,
                take: limit,
                skip: skip,
                orderBy: { nama: 'asc' },
            }),
        ]);
        return { total, data };
    }
    async getRuang(sekolahId, limit = 10, search, page = 1) {
        const filter = this.getSekolahFilter(sekolahId);
        let whereClause = {
            AND: [{ sekolah_id: filter.sekolah_id }],
        };
        if (search) {
            whereClause.AND.push({
                OR: [
                    { nm_ruang: { contains: search, mode: 'insensitive' } },
                    { kd_ruang: { contains: search, mode: 'insensitive' } },
                ],
            });
        }
        const skip = (page - 1) * limit;
        const [total, data] = await Promise.all([
            this.prisma.ruang.count({ where: whereClause }),
            this.prisma.ruang.findMany({
                where: whereClause,
                take: limit,
                skip: skip,
                orderBy: { nm_ruang: 'asc' },
            }),
        ]);
        return { total, data };
    }
    async getPesertaDidik(sekolahId, limit = 10, search, page = 1, rombelName, status, tingkat) {
        const filter = this.getSekolahFilter(sekolahId);
        let whereClause = {
            AND: [
                { sekolah_id: filter.sekolah_id },
            ],
        };
        if (status !== 'non-aktif') {
            whereClause.AND.push({
                NOT: { nama_rombel: { contains: 'Ekstrakurikuler', mode: 'insensitive' } }
            });
        }
        if (rombelName) {
            whereClause.AND.push({ nama_rombel: rombelName });
        }
        if (tingkat && tingkat !== 'all') {
            let rombelPrefix = '';
            if (tingkat === '10')
                rombelPrefix = 'X';
            else if (tingkat === '11')
                rombelPrefix = 'XI';
            else if (tingkat === '12')
                rombelPrefix = 'XII';
            if (rombelPrefix) {
                if (rombelPrefix === 'X') {
                    whereClause.AND.push({
                        nama_rombel: { startsWith: 'X', mode: 'insensitive' },
                    });
                    whereClause.AND.push({
                        NOT: { nama_rombel: { startsWith: 'XI', mode: 'insensitive' } },
                    });
                }
                else if (rombelPrefix === 'XI') {
                    whereClause.AND.push({
                        nama_rombel: { startsWith: 'XI', mode: 'insensitive' },
                    });
                    whereClause.AND.push({
                        NOT: { nama_rombel: { startsWith: 'XII', mode: 'insensitive' } },
                    });
                }
                else {
                    whereClause.AND.push({
                        nama_rombel: { startsWith: 'XII', mode: 'insensitive' },
                    });
                }
            }
        }
        if (status === 'aktif') {
            whereClause.AND.push({ status: 'Aktif' });
        }
        else if (status === 'non-aktif') {
            whereClause.AND.push({ NOT: { status: 'Aktif' } });
        }
        if (search) {
            whereClause.AND.push({
                OR: [
                    { nama: { contains: search, mode: 'insensitive' } },
                    { nisn: { contains: search, mode: 'insensitive' } },
                ],
            });
        }
        const skip = (page - 1) * limit;
        const [total, data] = await Promise.all([
            this.prisma.pesertaDidik.count({ where: whereClause }),
            this.prisma.pesertaDidik.findMany({
                where: whereClause,
                take: limit,
                skip: skip,
                select: {
                    peserta_didik_id: true,
                    nama: true,
                    nisn: true,
                    nipd: true,
                    nik: true,
                    no_kk: true,
                    jenis_kelamin: true,
                    foto: true,
                    qr_token: true,
                    nama_rombel: true,
                    tempat_lahir: true,
                    tanggal_lahir: true,
                    jenis_pendaftaran_id_str: true,
                    jenis_keluar_id: true,
                    ket_keluar: true,
                    tanggal_keluar: true,
                    status: true,
                    tingkat_pendidikan_id: true,
                    tanggal_masuk_sekolah: true,
                    agama_id_str: true,
                    alamat_jalan: true,
                    rt: true,
                    rw: true,
                    provinsi: true,
                    kabupaten_kota: true,
                    kecamatan: true,
                    desa_kelurahan: true,
                    nomor_telepon_seluler: true,
                    email: true,
                    nama_ayah: true,
                    nama_ibu: true,
                    tinggi_badan: true,
                    berat_badan: true,
                },
                orderBy: { nama: 'asc' },
            }),
        ]);
        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        const formattedData = data.map(item => ({
            ...item,
            foto: item.foto ? (item.foto.startsWith('http') ? item.foto : `${appUrl}${item.foto}`) : null
        }));
        return { total, data: formattedData };
    }
    async getPesertaDidikForMandala(sekolahId, query) {
        const { limit, page, search, status } = query;
        const whereClause = {
            sekolah_id: sekolahId,
        };
        if (search) {
            whereClause.OR = [
                { nama: { contains: search, mode: 'insensitive' } },
                { nisn: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (status === 'aktif') {
            whereClause.status = 'Aktif';
        }
        else if (status === 'non-aktif') {
            whereClause.status = { not: 'Aktif' };
        }
        const skip = (page - 1) * limit;
        const [total, students] = await Promise.all([
            this.prisma.pesertaDidik.count({ where: whereClause }),
            this.prisma.pesertaDidik.findMany({
                where: whereClause,
                take: limit,
                skip: skip,
                include: {
                    rombongan_belajar: true,
                },
                orderBy: { nama: 'asc' },
            }),
        ]);
        const formattedData = students.map((pd) => {
            const addressParts = [
                pd.alamat_jalan,
                pd.rt ? `RT ${pd.rt}` : null,
                pd.rw ? `RW ${pd.rw}` : null,
                pd.dusun ? `Dusun ${pd.dusun}` : null,
                pd.desa_kelurahan ? `Desa/Kel. ${pd.desa_kelurahan}` : null,
                pd.kecamatan ? `Kec. ${pd.kecamatan}` : null,
                pd.kabupaten_kota,
                pd.provinsi,
                pd.kode_pos
            ].filter(Boolean);
            const alamatLengkap = addressParts.length > 0 ? addressParts.join(', ') : '';
            const hpOrangTua = pd.no_wa_ayah || pd.no_wa_ibu || pd.no_wa || pd.nomor_telepon_seluler || '';
            return {
                identitas: {
                    id: pd.peserta_didik_id,
                    nama: pd.nama,
                    nisn: pd.nisn,
                    nik: pd.nik,
                    jenis_kelamin: pd.jenis_kelamin,
                    tempat_lahir: pd.tempat_lahir,
                    tanggal_lahir: pd.tanggal_lahir,
                    agama: pd.agama_id_str || pd.agama_id || '',
                },
                akademik: {
                    nama_rombel: pd.nama_rombel || pd.rombongan_belajar?.nama || '',
                    tingkat: pd.rombongan_belajar?.tingkat_pendidikan_id_str || pd.rombongan_belajar?.tingkat_pendidikan_id || pd.tingkat_pendidikan_id || '',
                    jurusan: pd.rombongan_belajar?.jurusan_id_str || pd.rombongan_belajar?.jurusan_id || pd.jurusan_sp_id || '',
                },
                data_pendukung: {
                    alamat_lengkap: alamatLengkap,
                    nama_ayah: pd.nama_ayah || '',
                    nama_ibu: pd.nama_ibu || '',
                    hp_orang_tua: hpOrangTua,
                },
            };
        });
        return {
            status: 'success',
            data: formattedData,
            total_data: total,
            total_pages: Math.ceil(total / limit),
            current_page: page,
            meta: {
                total_data: total,
                total_pages: Math.ceil(total / limit),
                current_page: page,
            },
        };
    }
    async getPdRekapTingkat(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const students = await this.prisma.pesertaDidik.findMany({
            where: {
                sekolah_id: filter.sekolah_id,
                status: 'Aktif',
            },
            select: {
                nama_rombel: true,
                jenis_kelamin: true,
                jenis_pendaftaran_id_str: true,
            }
        });
        const rekapMap = new Map();
        ['10', '11', '12'].forEach(tingkat => {
            rekapMap.set(tingkat, { tingkat, l: 0, p: 0, total: 0, siswaBaru: 0, pindahan: 0, mengulang: 0 });
        });
        students.forEach(pd => {
            let t = 'Lainnya';
            if (pd.nama_rombel) {
                if (pd.nama_rombel.startsWith('XII'))
                    t = '12';
                else if (pd.nama_rombel.startsWith('XI'))
                    t = '11';
                else if (pd.nama_rombel.startsWith('X'))
                    t = '10';
            }
            if (!rekapMap.has(t)) {
                rekapMap.set(t, { tingkat: t, l: 0, p: 0, total: 0, siswaBaru: 0, pindahan: 0, mengulang: 0 });
            }
            const data = rekapMap.get(t);
            if (pd.jenis_kelamin === 'L')
                data.l += 1;
            if (pd.jenis_kelamin === 'P')
                data.p += 1;
            data.total += 1;
            const jp = (pd.jenis_pendaftaran_id_str || '').toLowerCase();
            if (jp.includes('siswa baru'))
                data.siswaBaru += 1;
            else if (jp.includes('pindahan'))
                data.pindahan += 1;
            else if (jp.includes('mengulang'))
                data.mengulang += 1;
        });
        return Array.from(rekapMap.values());
    }
    async getPdRekapKompetensi(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const rombels = await this.prisma.rombonganBelajar.findMany({
            where: {
                AND: [
                    { sekolah_id: filter.sekolah_id },
                    { jurusan_id_str: { not: null } },
                    { jenis_rombel_str: { not: 'Ekstrakurikuler' } },
                ],
            },
            select: {
                nama: true,
                jurusan_id_str: true,
            },
        });
        const jurusanMap = new Map();
        rombels.forEach((r) => {
            const parts = r.nama.split(' ');
            let kode = parts.length > 1 ? parts[1] : parts[0];
            if (!jurusanMap.has(kode) && r.jurusan_id_str) {
                jurusanMap.set(kode, r.jurusan_id_str);
            }
        });
        const students = await this.prisma.pesertaDidik.findMany({
            where: {
                sekolah_id: filter.sekolah_id,
                status: 'Aktif',
                nama_rombel: { not: null }
            },
            select: {
                nama_rombel: true,
                jenis_kelamin: true,
            }
        });
        const rekapMap = new Map();
        students.forEach(pd => {
            const rombel = pd.nama_rombel || '';
            const parts = rombel.split(' ');
            let kode = parts.length > 1 ? parts[1] : 'Umum';
            if (kode === 'MIPA' || kode === 'IPS')
                kode = parts[1];
            const namaJurusan = jurusanMap.get(kode);
            const kompetensiName = namaJurusan ? `${namaJurusan} (${kode})` : kode;
            if (!rekapMap.has(kode)) {
                rekapMap.set(kode, {
                    kompetensi: kompetensiName,
                    xL: 0, xP: 0, xJml: 0,
                    xiL: 0, xiP: 0, xiJml: 0,
                    xiiL: 0, xiiP: 0, xiiJml: 0,
                    grandTotal: 0
                });
            }
            const data = rekapMap.get(kode);
            const isL = pd.jenis_kelamin === 'L';
            const isP = pd.jenis_kelamin === 'P';
            let t = '';
            if (rombel.startsWith('XII'))
                t = '12';
            else if (rombel.startsWith('XI'))
                t = '11';
            else if (rombel.startsWith('X'))
                t = '10';
            if (t === '10') {
                if (isL)
                    data.xL += 1;
                if (isP)
                    data.xP += 1;
                data.xJml += 1;
            }
            else if (t === '11') {
                if (isL)
                    data.xiL += 1;
                if (isP)
                    data.xiP += 1;
                data.xiJml += 1;
            }
            else if (t === '12') {
                if (isL)
                    data.xiiL += 1;
                if (isP)
                    data.xiiP += 1;
                data.xiiJml += 1;
            }
            data.grandTotal += 1;
        });
        return Array.from(rekapMap.values()).sort((a, b) => a.kompetensi.localeCompare(b.kompetensi));
    }
    async getPdRekapUsia(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const students = await this.prisma.pesertaDidik.findMany({
            where: {
                sekolah_id: filter.sekolah_id,
                status: 'Aktif',
            },
            select: {
                tanggal_lahir: true,
                tingkat_pendidikan_id: true,
                jenis_kelamin: true,
            }
        });
        const now = new Date();
        const result = {
            '< 15 Tahun': { l: 0, p: 0, total: 0 },
            '15 Tahun': { l: 0, p: 0, total: 0 },
            '16 Tahun': { l: 0, p: 0, total: 0 },
            '17 Tahun': { l: 0, p: 0, total: 0 },
            '18 Tahun': { l: 0, p: 0, total: 0 },
            '> 18 Tahun': { l: 0, p: 0, total: 0 }
        };
        students.forEach(pd => {
            if (!pd.tanggal_lahir)
                return;
            const birthDate = new Date(pd.tanggal_lahir);
            let age = now.getFullYear() - birthDate.getFullYear();
            const m = now.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
            let category = '';
            if (age < 15)
                category = '< 15 Tahun';
            else if (age === 15)
                category = '15 Tahun';
            else if (age === 16)
                category = '16 Tahun';
            else if (age === 17)
                category = '17 Tahun';
            else if (age === 18)
                category = '18 Tahun';
            else
                category = '> 18 Tahun';
            const data = result[category];
            if (pd.jenis_kelamin === 'L')
                data.l += 1;
            if (pd.jenis_kelamin === 'P')
                data.p += 1;
            data.total += 1;
        });
        return Object.keys(result).map(key => ({
            usia: key,
            l: result[key].l,
            p: result[key].p,
            total: result[key].total
        }));
    }
    async getCadisdiks() {
        return await this.prisma.cadisdik.findMany({
            where: { aktif: true },
            orderBy: { nama_instansi: 'asc' },
        });
    }
    async getLayananMaster(kategori) {
        return await this.prisma.layanan.findMany({
            where: {
                aktif: true,
                ...(kategori !== undefined ? { kategori } : {}),
            },
            include: {
                syarat: {
                    where: { aktif: true },
                    orderBy: { urutan: 'asc' },
                },
            },
            orderBy: { nama_layanan: 'asc' },
        });
    }
    async getPermohonanLayanan(filters) {
        const where = {};
        if (filters.sekolah_id)
            where.sekolah_id = filters.sekolah_id;
        if (filters.status !== undefined)
            where.status = filters.status;
        if (filters.kategori !== undefined)
            where.kategori = filters.kategori;
        const results = await this.prisma.permohonanLayanan.findMany({
            where,
            include: {
                layanan: true,
                permohonan_layanan_file: {
                    include: { layanan_syarat: true }
                },
                permohonan_layanan_log: {
                    orderBy: { created_at: 'desc' },
                    include: { pegawai: { select: { nama_lengkap: true } } }
                },
            },
            orderBy: { created_at: 'desc' },
        });
        const enrichedResults = await Promise.all(results.map(async (item) => {
            let ptk = null;
            let peserta_didik = null;
            if (item.ptk_id) {
                ptk = await this.prisma.gtk.findUnique({ where: { ptk_id: item.ptk_id } });
            }
            if (item.peserta_didik_id) {
                peserta_didik = await this.prisma.pesertaDidik.findUnique({ where: { peserta_didik_id: item.peserta_didik_id } });
            }
            return {
                ...item,
                ptk,
                peserta_didik,
            };
        }));
        return enrichedResults;
    }
    async createPermohonanLayanan(dto) {
        if (dto.kategori === 0) {
            if (!dto.ptk_id)
                throw new Error('ptk_id wajib diisi untuk kategori GTK');
            dto.peserta_didik_id = null;
        }
        else if (dto.kategori === 1) {
            if (!dto.peserta_didik_id)
                throw new Error('peserta_didik_id wajib diisi untuk kategori Peserta Didik');
            dto.ptk_id = null;
        }
        else if (dto.kategori === 2) {
            dto.ptk_id = null;
            dto.peserta_didik_id = null;
        }
        const nomorPermohonan = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        return await this.prisma.permohonanLayanan.create({
            data: {
                sekolah_id: dto.sekolah_id,
                layanan_id: dto.layanan_id,
                kategori: dto.kategori,
                ptk_id: dto.ptk_id,
                peserta_didik_id: dto.peserta_didik_id,
                nomor_permohonan: nomorPermohonan,
                keterangan: dto.keterangan,
                status: 1,
                tanggal_pengajuan: new Date(),
            },
        });
    }
    async getRombelRekapKategori(sekolahId) {
        if (!sekolahId)
            return [];
        const semesterId = await this.getLatestSemesterId(sekolahId);
        const baseFilter = {
            sekolah_id: sekolahId,
            semester_id: semesterId || undefined
        };
        const categories = [
            { id: 1, label: 'Reguler', pattern: 'Kelas' },
            { id: 2, label: 'Praktik', pattern: 'Praktik' },
            { id: 3, label: 'Ekskul', pattern: 'Ekstra' },
            { id: 4, label: 'Matpel Pilihan', pattern: 'Pilihan' },
        ];
        const results = await Promise.all(categories.map(async (cat) => {
            const [t10, t11, t12, total] = await Promise.all([
                this.prisma.rombonganBelajar.count({
                    where: {
                        ...baseFilter,
                        jenis_rombel_str: { contains: cat.pattern, mode: 'insensitive' },
                        tingkat_pendidikan_id: '10'
                    }
                }),
                this.prisma.rombonganBelajar.count({
                    where: {
                        ...baseFilter,
                        jenis_rombel_str: { contains: cat.pattern, mode: 'insensitive' },
                        tingkat_pendidikan_id: '11'
                    }
                }),
                this.prisma.rombonganBelajar.count({
                    where: {
                        ...baseFilter,
                        jenis_rombel_str: { contains: cat.pattern, mode: 'insensitive' },
                        tingkat_pendidikan_id: '12'
                    }
                }),
                this.prisma.rombonganBelajar.count({
                    where: {
                        ...baseFilter,
                        jenis_rombel_str: { contains: cat.pattern, mode: 'insensitive' },
                    }
                }),
            ]);
            return {
                id: cat.id,
                kategori: cat.label,
                tingkat10: t10,
                tingkat11: t11,
                tingkat12: t12,
                total: total
            };
        }));
        return results;
    }
    async getRombelRekapKompetensi(sekolahId) {
        if (!sekolahId)
            return [];
        const semesterId = await this.getLatestSemesterId(sekolahId);
        const jurusans = await this.prisma.rombonganBelajar.findMany({
            where: {
                sekolah_id: sekolahId,
                semester_id: semesterId || undefined,
                jurusan_id_str: { not: null },
                jenis_rombel_str: { not: 'Ekstrakurikuler' }
            },
            select: { jurusan_id_str: true },
            distinct: ['jurusan_id_str']
        });
        const results = await Promise.all(jurusans.map(async (j, index) => {
            const counts = await Promise.all(['10', '11', '12'].map(tingkat => this.prisma.rombonganBelajar.count({
                where: {
                    sekolah_id: sekolahId,
                    semester_id: semesterId || undefined,
                    jurusan_id_str: j.jurusan_id_str,
                    tingkat_pendidikan_id: tingkat
                }
            })));
            return {
                id: index + 1,
                kompetensi: j.jurusan_id_str,
                tingkat10: counts[0],
                tingkat11: counts[1],
                tingkat12: counts[2],
                total: counts[0] + counts[1] + counts[2]
            };
        }));
        return results;
    }
    async getRombonganBelajar(sekolahId, type, limit = 10, page = 1, search, tingkat) {
        const filter = this.getSekolahFilter(sekolahId);
        let whereClause = {
            AND: [
                { sekolah_id: filter.sekolah_id },
            ],
        };
        if (type === 'reguler') {
            whereClause.AND.push({ jenis_rombel_str: 'Kelas' });
        }
        else if (type === 'pilihan') {
            whereClause.AND.push({ jenis_rombel_str: 'Matapelajaran Pilihan' });
        }
        else {
            whereClause.AND.push({ jenis_rombel_str: { not: 'Ekstrakurikuler' } });
        }
        if (tingkat && tingkat !== 'all') {
            whereClause.AND.push({ tingkat_pendidikan_id: tingkat });
        }
        if (search) {
            whereClause.AND.push({
                OR: [
                    { nama: { contains: search, mode: 'insensitive' } },
                    { ptk_id_str: { contains: search, mode: 'insensitive' } },
                ],
            });
        }
        const skip = (page - 1) * limit;
        const [total, data] = await Promise.all([
            this.prisma.rombonganBelajar.count({ where: whereClause }),
            this.prisma.rombonganBelajar.findMany({
                where: whereClause,
                take: limit,
                skip: skip,
                select: {
                    rombongan_belajar_id: true,
                    nama: true,
                    tingkat_pendidikan_id_str: true,
                    jurusan_id_str: true,
                    kurikulum_id_str: true,
                    ptk_id_str: true,
                    id_ruang_str: true,
                    jenis_rombel_str: true,
                    _count: {
                        select: { anggota_rombel: true }
                    }
                },
                orderBy: { nama: 'asc' },
            })
        ]);
        return {
            total,
            data: data.map(item => ({
                ...item,
                jumlah_siswa: item._count.anggota_rombel
            }))
        };
    }
    async getRombelAnggota(rombelId) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(rombelId)) {
            return [];
        }
        const anggota = await this.prisma.anggotaRombel.findMany({
            where: { rombongan_belajar_id: rombelId },
            select: { peserta_didik_id: true },
        });
        let pdIds = anggota.map((a) => a.peserta_didik_id);
        if (pdIds.length > 0) {
            return await this.prisma.pesertaDidik.findMany({
                where: {
                    peserta_didik_id: { in: pdIds },
                },
                select: {
                    peserta_didik_id: true,
                    nama: true,
                    nisn: true,
                    nipd: true,
                    jenis_kelamin: true,
                    foto: true,
                    qr_token: true,
                },
                orderBy: { nama: 'asc' },
            });
        }
        const students = await this.prisma.pesertaDidik.findMany({
            where: {
                rombongan_belajar_id: rombelId,
                status: 'Aktif'
            },
            select: {
                peserta_didik_id: true,
                nama: true,
                nisn: true,
                nipd: true,
                jenis_kelamin: true,
                foto: true,
                qr_token: true,
            },
            orderBy: { nama: 'asc' },
        });
        return students;
    }
    async getRombelPembelajaran(rombelId) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(rombelId)) {
            return [];
        }
        const rombel = await this.prisma.rombonganBelajar.findUnique({
            where: { rombongan_belajar_id: rombelId },
            select: { nama: true, sekolah_id: true },
        });
        if (!rombel)
            return [];
        const relatedRombels = await this.prisma.rombonganBelajar.findMany({
            where: {
                nama: rombel.nama,
                sekolah_id: rombel.sekolah_id,
                jenis_rombel_str: { in: ['Kelas', 'Matapelajaran Pilihan'] },
            },
            select: { rombongan_belajar_id: true },
        });
        const rombelIds = relatedRombels.map((r) => r.rombongan_belajar_id);
        return this.prisma.pembelajaran.findMany({
            where: { rombongan_belajar_id: { in: rombelIds } },
            select: {
                pembelajaran_id: true,
                nama_mata_pelajaran: true,
                jam_mengajar_per_minggu: true,
                ptk_id: true,
                ptk_id_str: true,
                gtk: {
                    select: {
                        nama: true,
                        sekolah_id: true,
                    },
                },
            },
            orderBy: { nama_mata_pelajaran: 'asc' },
        });
    }
    async getEkstrakurikuler(sekolahId, search) {
        const filter = this.getSekolahFilter(sekolahId);
        let whereClause = {
            AND: [
                { sekolah_id: filter.sekolah_id },
                { jenis_rombel_str: 'Ekstrakurikuler' },
            ],
        };
        if (search) {
            whereClause.AND.push({
                OR: [
                    { nm_ekskul: { contains: search, mode: 'insensitive' } },
                    { nama: { contains: search, mode: 'insensitive' } },
                    { ptk_id_str: { contains: search, mode: 'insensitive' } },
                ],
            });
        }
        const data = await this.prisma.rombonganBelajar.findMany({
            where: whereClause,
            select: {
                rombongan_belajar_id: true,
                nm_ekskul: true,
                nama: true,
                ptk_id_str: true,
                id_ruang_str: true,
                _count: {
                    select: { anggota_rombel: true }
                }
            },
            orderBy: { nama: 'asc' },
        });
        return data.map(item => ({
            ...item,
            anggotaRombel: item._count.anggota_rombel
        }));
    }
    async getJurusan(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const rombels = await this.prisma.rombonganBelajar.findMany({
            where: {
                AND: [
                    { sekolah_id: filter.sekolah_id },
                    { jurusan_id_str: { not: null } },
                    { jenis_rombel_str: { not: 'Ekstrakurikuler' } },
                ],
            },
            select: {
                nama: true,
                jurusan_id_str: true,
            },
        });
        const jurusanMap = new Map();
        rombels.forEach((r) => {
            const parts = r.nama.split(' ');
            let kode = parts.length > 1 ? parts[1] : parts[0];
            if (!jurusanMap.has(kode)) {
                jurusanMap.set(kode, r.jurusan_id_str);
            }
        });
        return Array.from(jurusanMap.entries()).map(([kode, nama]) => ({
            kode,
            nama_jurusan: nama,
        }));
    }
    async getMataPelajaran(sekolahId, limit = 10, search, page = 1) {
        const filter = this.getSekolahFilter(sekolahId);
        const whereClause = {
            AND: [
                { sekolah_id: filter.sekolah_id },
            ],
        };
        if (search) {
            whereClause.AND.push({
                nama_mata_pelajaran: { contains: search, mode: 'insensitive' },
            });
        }
        const skip = (page - 1) * limit;
        const [total, data] = await Promise.all([
            this.prisma.pembelajaran.groupBy({
                by: ['mata_pelajaran_id', 'nama_mata_pelajaran'],
                where: whereClause,
            }).then(res => res.length),
            this.prisma.pembelajaran.findMany({
                where: whereClause,
                select: {
                    mata_pelajaran_id: true,
                    nama_mata_pelajaran: true,
                },
                distinct: ['mata_pelajaran_id', 'nama_mata_pelajaran'],
                take: limit,
                skip: skip,
                orderBy: { nama_mata_pelajaran: 'asc' },
            }),
        ]);
        return { total, data };
    }
    async getAllPembelajaran(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        return this.prisma.pembelajaran.findMany({
            where: { sekolah_id: filter.sekolah_id },
            select: {
                pembelajaran_id: true,
                rombongan_belajar_id: true,
                nama_mata_pelajaran: true,
                jam_mengajar_per_minggu: true,
                ptk_id: true,
                ptk_id_str: true,
                gtk: {
                    select: {
                        nama: true,
                    },
                },
                rombongan_belajar: {
                    select: {
                        rombongan_belajar_id: true,
                        nama: true,
                    },
                },
            },
            orderBy: { nama_mata_pelajaran: 'asc' },
        });
    }
    async getGtk(sekolahId, limit = 10, search, page = 1, type, status) {
        const filter = this.getSekolahFilter(sekolahId);
        let whereClause = {
            AND: [{ sekolah_id: filter.sekolah_id }],
        };
        if (search) {
            whereClause.AND.push({
                OR: [
                    { nama: { contains: search, mode: 'insensitive' } },
                    { nuptk: { contains: search, mode: 'insensitive' } },
                    { nip: { contains: search, mode: 'insensitive' } },
                ],
            });
        }
        if (type === 'guru') {
            whereClause.AND.push({ jenis_ptk_id_str: { contains: 'Guru', mode: 'insensitive' } });
        }
        else if (type === 'tendik') {
            whereClause.AND.push({
                NOT: { jenis_ptk_id_str: { contains: 'Guru', mode: 'insensitive' } },
            });
        }
        if (status === 'aktif') {
            whereClause.AND.push({ status: 'Aktif' });
        }
        else if (status === 'non-aktif') {
            whereClause.AND.push({ NOT: { status: 'Aktif' } });
        }
        const skip = (page - 1) * limit;
        const [total, data] = await Promise.all([
            this.prisma.gtk.count({ where: whereClause }),
            this.prisma.gtk.findMany({
                where: whereClause,
                take: limit,
                skip: skip,
                select: {
                    ptk_id: true,
                    nama: true,
                    nuptk: true,
                    nik: true,
                    nip: true,
                    foto: true,
                    qr_token: true,
                    jabatan_ptk_id_str: true,
                    jenis_ptk_id_str: true,
                    ptk_induk: true,
                    jenis_kelamin: true,
                    tempat_lahir: true,
                    tanggal_lahir: true,
                    nama_ibu_kandung: true,
                    status_kepegawaian_id_str: true,
                    alamat_jalan: true,
                    tanggal_surat_tugas: true,
                    status: true,
                    no_kk: true,
                    no_hp: true,
                    email: true,
                    sk_pengangkatan: true,
                    tmt_pengangkatan: true,
                    sumber_gaji: true,
                    pendidikan_terakhir: true,
                    updated_at: true,
                },
                orderBy: { nama: 'asc' },
            }),
        ]);
        const appUrl = process.env.APP_URL || 'http://localhost:3000';
        const formattedData = data.map(item => ({
            ...item,
            foto: item.foto ? (item.foto.startsWith('http') ? item.foto : `${appUrl}${item.foto}`) : null,
        }));
        return { total, data: formattedData };
    }
    async getGtkById(sekolahId, id) {
        const gtk = await this.prisma.gtk.findFirst({
            where: {
                AND: [{ ptk_id: id }, { sekolah_id: sekolahId }],
            },
            include: {
                penggunas: {
                    select: { email: true },
                },
                rwy_sertifikasi: {
                    include: {
                        bidang_studi: true,
                        lemb_sertifikasi: true,
                    }
                },
                riwayat_pendidikan_formal: true,
            },
        });
        if (gtk) {
            const fs = require('fs');
            const path = require('path');
            const destDir = path.join(process.cwd(), 'storage', sekolahId, 'gtk', id, 'dokumen');
            let fotoDokumen = [];
            if (fs.existsSync(destDir)) {
                try {
                    const files = fs.readdirSync(destDir);
                    fotoDokumen = files.map((file, index) => {
                        const baseName = file.substring(0, file.lastIndexOf('.'));
                        const nameWords = baseName.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                        return {
                            id: index,
                            nama: nameWords,
                            fileName: file,
                            fileUrl: `/storage/${sekolahId}/gtk/${id}/dokumen/${file}`
                        };
                    });
                }
                catch (e) {
                    console.error('Error reading GTK documents directory:', e);
                }
            }
            return {
                ...gtk,
                foto_dokumen: fotoDokumen
            };
        }
        return null;
    }
    async updateGtk(sekolahId, id, data) {
        const updateData = { ...data };
        delete updateData.ptk_id;
        delete updateData.sekolah_id;
        const emailAkun = updateData.email_akun;
        delete updateData.email_akun;
        if (updateData.tmt_pengangkatan) {
            updateData.tmt_pengangkatan = new Date(updateData.tmt_pengangkatan);
        }
        if (updateData.tanggal_surat_tugas) {
            updateData.tanggal_surat_tugas = new Date(updateData.tanggal_surat_tugas);
        }
        if (updateData.tmt_cpns) {
            updateData.tmt_cpns = new Date(updateData.tmt_cpns);
        }
        if (updateData.tmt_pns) {
            updateData.tmt_pns = new Date(updateData.tmt_pns);
        }
        const updatedGtk = await this.prisma.gtk.update({
            where: { ptk_id: id },
            data: updateData,
        });
        if (emailAkun !== undefined) {
            await this.prisma.pengguna.updateMany({
                where: { ptk_id: id },
                data: { email: emailAkun || null },
            });
        }
        return updatedGtk;
    }
    async getPesertaDidikById(sekolahId, id) {
        const student = await this.prisma.pesertaDidik.findFirst({
            where: {
                AND: [{ peserta_didik_id: id }, { sekolah_id: sekolahId }],
            },
            include: {
                penggunas: {
                    select: { email: true },
                },
            },
        });
        if (student) {
            const fs = require('fs');
            const path = require('path');
            const destDir = path.join(process.cwd(), 'storage', sekolahId, 'siswa', id, 'dokumen');
            let uploadedDocs = [];
            if (fs.existsSync(destDir)) {
                try {
                    uploadedDocs = fs.readdirSync(destDir);
                }
                catch (e) {
                    console.error('Error reading student documents directory:', e);
                }
            }
            return {
                ...student,
                uploaded_docs: uploadedDocs
            };
        }
        return null;
    }
    async updatePesertaDidik(sekolahId, id, data) {
        const updateData = { ...data };
        delete updateData.peserta_didik_id;
        delete updateData.sekolah_id;
        const emailAkun = updateData.email_akun;
        delete updateData.email_akun;
        if (updateData.tanggal_lahir) {
            updateData.tanggal_lahir = new Date(updateData.tanggal_lahir);
        }
        if (updateData.tanggal_masuk_sekolah) {
            updateData.tanggal_masuk_sekolah = new Date(updateData.tanggal_masuk_sekolah);
        }
        const updatedPd = await this.prisma.pesertaDidik.update({
            where: { peserta_didik_id: id },
            data: updateData,
        });
        if (emailAkun !== undefined) {
            await this.prisma.pengguna.updateMany({
                where: { peserta_didik_id: id },
                data: { email: emailAkun || null },
            });
        }
        return updatedPd;
    }
    async getGtkRekapKategori(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const gtks = await this.prisma.gtk.findMany({
            where: {
                AND: [
                    { sekolah_id: filter.sekolah_id },
                    { status: 'Aktif' }
                ]
            },
            select: {
                jenis_ptk_id_str: true,
                jenis_kelamin: true,
                status_kepegawaian_id_str: true,
            }
        });
        const isGuru = (j) => (j || '').toLowerCase().includes('guru');
        const isAsn = (s) => ['pns', 'pppk'].includes((s || '').toLowerCase());
        const guru = gtks.filter(i => isGuru(i.jenis_ptk_id_str));
        const tendik = gtks.filter(i => !isGuru(i.jenis_ptk_id_str));
        return [
            {
                id: 1,
                kategori: "Guru",
                lakiLaki: guru.filter(i => i.jenis_kelamin === 'L').length,
                perempuan: guru.filter(i => i.jenis_kelamin === 'P').length,
                totalJK: guru.length,
                asn: guru.filter(i => isAsn(i.status_kepegawaian_id_str)).length,
                nonAsn: guru.filter(i => !isAsn(i.status_kepegawaian_id_str)).length,
                totalStatus: guru.length
            },
            {
                id: 2,
                kategori: "Tendik",
                lakiLaki: tendik.filter(i => i.jenis_kelamin === 'L').length,
                perempuan: tendik.filter(i => i.jenis_kelamin === 'P').length,
                totalJK: tendik.length,
                asn: tendik.filter(i => isAsn(i.status_kepegawaian_id_str)).length,
                nonAsn: tendik.filter(i => !isAsn(i.status_kepegawaian_id_str)).length,
                totalStatus: tendik.length
            }
        ];
    }
    async getGtkRekapPendidikan(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const gtks = await this.prisma.gtk.findMany({
            where: {
                AND: [
                    { sekolah_id: filter.sekolah_id },
                    { status: 'Aktif' }
                ]
            },
            select: {
                pendidikan_terakhir: true,
                jenis_kelamin: true,
                status_kepegawaian_id_str: true,
            }
        });
        const isAsn = (s) => ['pns', 'pppk'].includes((s || '').toLowerCase());
        const categories = [
            { label: "S2/Pasca Sarjana", keys: ["S2"] },
            { label: "S1/Sarjana", keys: ["S1", null, ""] },
            { label: "D3/Diploma", keys: ["D3"] },
            { label: "SMA/Sederajat", keys: ["SMA", "SMK"] },
        ];
        return categories.map((cat, idx) => {
            const subset = gtks.filter(i => {
                if (cat.keys.includes(null) && !i.pendidikan_terakhir)
                    return true;
                return cat.keys.includes(i.pendidikan_terakhir);
            });
            return {
                id: idx + 1,
                pendidikan: cat.label,
                lakiLaki: subset.filter(i => i.jenis_kelamin === 'L').length,
                perempuan: subset.filter(i => i.jenis_kelamin === 'P').length,
                totalJK: subset.length,
                asn: subset.filter(i => isAsn(i.status_kepegawaian_id_str)).length,
                nonAsn: subset.filter(i => !isAsn(i.status_kepegawaian_id_str)).length,
                totalStatus: subset.length
            };
        });
    }
    async getGtkRekapUsia(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const gtks = await this.prisma.gtk.findMany({
            where: {
                AND: [
                    { sekolah_id: filter.sekolah_id },
                    { status: 'Aktif' }
                ]
            },
            select: {
                tanggal_lahir: true,
                jenis_kelamin: true,
                status_kepegawaian_id_str: true,
            }
        });
        const isAsn = (s) => ['pns', 'pppk'].includes((s || '').toLowerCase());
        const calculateAge = (birthDate) => {
            if (!birthDate)
                return 0;
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };
        const ranges = [
            { label: "< 30 Tahun", min: 0, max: 30 },
            { label: "31 - 40 Tahun", min: 31, max: 40 },
            { label: "41 - 50 Tahun", min: 41, max: 50 },
            { label: "> 50 Tahun", min: 51, max: 150 },
        ];
        return ranges.map((range, idx) => {
            const subset = gtks.filter(i => {
                const age = calculateAge(i.tanggal_lahir);
                return age >= range.min && age <= range.max;
            });
            return {
                id: idx + 1,
                rentangUsia: range.label,
                lakiLaki: subset.filter(i => i.jenis_kelamin === 'L').length,
                perempuan: subset.filter(i => i.jenis_kelamin === 'P').length,
                totalJK: subset.length,
                asn: subset.filter(i => isAsn(i.status_kepegawaian_id_str)).length,
                nonAsn: subset.filter(i => !isAsn(i.status_kepegawaian_id_str)).length,
                totalStatus: subset.length
            };
        });
    }
};
exports.DapodikService = DapodikService;
exports.DapodikService = DapodikService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DapodikService);
//# sourceMappingURL=dapodik.service.js.map