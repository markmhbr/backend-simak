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
        const filter = this.getSekolahFilter(sekolahId);
        const [totalTanah, totalBangunan, totalRuang, totalSiswa, totalGtk] = await Promise.all([
            this.prisma.tanah.count({ where: filter }),
            this.prisma.bangunan.count({ where: filter }),
            this.prisma.ruang.count({ where: filter }),
            this.prisma.pesertaDidik.count({ where: filter }),
            this.prisma.gtk.count({ where: filter }),
        ]);
        return {
            sekolah_id: sekolahId,
            total_tanah: totalTanah,
            total_bangunan: totalBangunan,
            total_ruang: totalRuang,
            total_siswa: totalSiswa,
            total_gtk: totalGtk,
        };
    }
    async getSekolah(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        const sekolah = await this.prisma.sekolah.findUnique({
            where: { sekolah_id: filter.sekolah_id },
        });
        if (!sekolah)
            return null;
        const totalGtk = await this.prisma.gtk.count({
            where: { sekolah_id: filter.sekolah_id }
        });
        const kepalaSekolah = await this.prisma.gtk.findFirst({
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
            select: { nama: true, jabatan_ptk_id_str: true, jenis_ptk_id_str: true, status: true }
        });
        return {
            ...sekolah,
            nama_kepala_sekolah: kepalaSekolah?.nama || null
        };
    }
    async updateSekolah(sekolahId, data) {
        return await this.prisma.sekolah.update({
            where: { sekolah_id: sekolahId },
            data: {
                nama: data.nama,
                npsn: data.npsn,
                spmb: data.spmb,
                peta: data.peta,
                social_media: data.social_media,
                cadisdik_id: data.cadisdik_id,
            },
        });
    }
    async uploadLogo(sekolahId, file) {
        const fs = require('fs');
        const path = require('path');
        const frontendPublicDir = path.join(process.cwd(), '../frontend-simak/public/uploads');
        if (!fs.existsSync(frontendPublicDir)) {
            fs.mkdirSync(frontendPublicDir, { recursive: true });
        }
        const fileExt = path.extname(file.originalname);
        const fileName = `logo_${sekolahId}${fileExt}`;
        const filePath = path.join(frontendPublicDir, fileName);
        fs.writeFileSync(filePath, file.buffer);
        const relativePath = `/uploads/${fileName}`;
        return await this.prisma.sekolah.update({
            where: { sekolah_id: sekolahId },
            data: { logo: relativePath },
        });
    }
    async getTanah(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        return await this.prisma.tanah.findMany({
            where: filter,
            orderBy: { nama: 'asc' },
        });
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
    async getBangunan(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        return await this.prisma.bangunan.findMany({
            where: filter,
            orderBy: { nama: 'asc' },
        });
    }
    async getRuang(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        return await this.prisma.ruang.findMany({
            where: filter,
            orderBy: { nm_ruang: 'asc' },
        });
    }
    async getPesertaDidik(sekolahId, limit = 10, search, page = 1, rombelName, status, tingkat) {
        const filter = this.getSekolahFilter(sekolahId);
        let whereClause = {
            AND: [
                { sekolah_id: filter.sekolah_id },
                { NOT: { nama_rombel: { contains: 'Ekstrakurikuler', mode: 'insensitive' } } },
            ],
        };
        if (rombelName) {
            whereClause.AND[1] = { nama_rombel: rombelName };
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
                orderBy: { nama: 'asc' },
            }),
        ]);
        return { total, data };
    }
    async getRombonganBelajar(sekolahId, type, limit = 10, page = 1) {
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
    async getEkstrakurikuler(sekolahId) {
        const filter = this.getSekolahFilter(sekolahId);
        return await this.prisma.rombonganBelajar.findMany({
            where: {
                AND: [
                    { sekolah_id: filter.sekolah_id },
                    { jenis_rombel_str: 'Ekstrakurikuler' },
                ],
            },
            select: {
                rombongan_belajar_id: true,
                nm_ekskul: true,
                nama: true,
                ptk_id_str: true,
                id_ruang_str: true,
            },
            orderBy: { nama: 'asc' },
        });
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
                orderBy: { nama: 'asc' },
            }),
        ]);
        return { total, data };
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