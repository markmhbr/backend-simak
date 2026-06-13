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
var MandalaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandalaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
let MandalaService = MandalaService_1 = class MandalaService {
    prisma;
    logger = new common_1.Logger(MandalaService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        const urlMandala = process.env.URL_MANDALA;
        const keyMandala = process.env.KEY_MANDALA || 'simak_mandala_secure_connection_key_2026';
        if (urlMandala) {
            try {
                const count = await this.prisma.mandala.count();
                if (count === 0) {
                    this.logger.log(`Seeding default Mandala connection: URL=${urlMandala}`);
                    await this.prisma.mandala.create({
                        data: {
                            key: keyMandala,
                            url_mandala: urlMandala,
                        },
                    });
                }
            }
            catch (error) {
                this.logger.error('Failed to seed default Mandala connection:', error);
            }
        }
    }
    async getConnection() {
        return await this.prisma.mandala.findFirst({
            orderBy: { created_at: 'desc' },
        });
    }
    async saveOrUpdateConnection(key, urlMandala) {
        const existing = await this.prisma.mandala.findFirst();
        if (existing) {
            return await this.prisma.mandala.update({
                where: { id: existing.id },
                data: {
                    key,
                    url_mandala: urlMandala,
                },
            });
        }
        else {
            return await this.prisma.mandala.create({
                data: {
                    key,
                    url_mandala: urlMandala,
                },
            });
        }
    }
    async getSchools() {
        const schools = await this.prisma.sekolah.findMany({
            orderBy: { nama: 'asc' },
        });
        const richSchools = await Promise.all(schools.map(async (school) => {
            const [totalSiswa, totalGtk] = await Promise.all([
                this.prisma.pesertaDidik.count({ where: { sekolah_id: school.sekolah_id } }),
                this.prisma.gtk.count({ where: { sekolah_id: school.sekolah_id } }),
            ]);
            return {
                sekolah_id: school.sekolah_id,
                nama: school.nama,
                npsn: school.npsn,
                status_sekolah: school.status_sekolah_str || school.status_sekolah,
                alamat: school.alamat_jalan,
                email: school.email,
                website: school.website,
                total_siswa: totalSiswa,
                total_gtk: totalGtk,
            };
        }));
        return richSchools;
    }
    async getSchoolDetail(sekolahId) {
        const school = await this.prisma.sekolah.findUnique({
            where: { sekolah_id: sekolahId },
        });
        if (!school)
            return null;
        const kepalaSekolah = await this.prisma.gtk.findFirst({
            where: {
                AND: [
                    { sekolah_id: sekolahId },
                    {
                        OR: [
                            { jabatan_ptk_id_str: { contains: 'Kepala Sekolah', mode: 'insensitive' } },
                            { jenis_ptk_id_str: { contains: 'Kepala Sekolah', mode: 'insensitive' } },
                        ],
                    },
                ],
            },
            select: { nama: true },
        });
        return {
            ...school,
            nama_kepala_sekolah: kepalaSekolah?.nama || null,
        };
    }
    async getSchoolSummary(sekolahId) {
        const filter = { sekolah_id: sekolahId };
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
    async getPesertaDidikForMandala(sekolahId, query) {
        const { limit, page, search, status } = query;
        const whereClause = {};
        if (sekolahId) {
            whereClause.sekolah_id = sekolahId;
        }
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
                    sekolah_id: pd.sekolah_id,
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
                    nama_ibu: pd.nama_ibu_kandung || pd.nama_ibu || '',
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
    async getGtkForMandala(sekolahId, query) {
        const { limit, page, search, status, type } = query;
        const whereClause = {};
        if (sekolahId) {
            whereClause.sekolah_id = sekolahId;
        }
        if (search) {
            whereClause.OR = [
                { nama: { contains: search, mode: 'insensitive' } },
                { nuptk: { contains: search, mode: 'insensitive' } },
                { nip: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (type === 'guru') {
            whereClause.jenis_ptk_id_str = { contains: 'Guru', mode: 'insensitive' };
        }
        else if (type === 'tendik') {
            whereClause.NOT = {
                jenis_ptk_id_str: { contains: 'Guru', mode: 'insensitive' },
            };
        }
        if (status === 'aktif') {
            whereClause.status = 'Aktif';
        }
        else if (status === 'non-aktif') {
            whereClause.status = { not: 'Aktif' };
        }
        const skip = (page - 1) * limit;
        const [total, gtks] = await Promise.all([
            this.prisma.gtk.count({ where: whereClause }),
            this.prisma.gtk.findMany({
                where: whereClause,
                take: limit,
                skip: skip,
                orderBy: { nama: 'asc' },
            }),
        ]);
        const formattedData = gtks.map((g) => {
            const addressParts = [
                g.alamat_jalan,
                g.rt ? `RT ${g.rt}` : null,
                g.rw ? `RW ${g.rw}` : null,
                g.dusun ? `Dusun ${g.dusun}` : null,
                g.desa_kelurahan ? `Desa/Kel. ${g.desa_kelurahan}` : null,
                g.kecamatan ? `Kec. ${g.kecamatan}` : null,
                g.kabupaten_kota,
                g.provinsi,
                g.kode_pos
            ].filter(Boolean);
            const alamatLengkap = addressParts.length > 0 ? addressParts.join(', ') : '';
            return {
                identitas: {
                    id: g.ptk_id,
                    sekolah_id: g.sekolah_id,
                    nama: g.nama,
                    nip: g.nip || '',
                    nik: g.nik || '',
                    nuptk: g.nuptk || '',
                    jenis_kelamin: g.jenis_kelamin || '',
                    tempat_lahir: g.tempat_lahir || '',
                    tanggal_lahir: g.tanggal_lahir || null,
                    agama: g.agama_id_str || g.agama_id || '',
                },
                kepegawaian: {
                    jenis_ptk: g.jenis_ptk_id_str || '',
                    jabatan: g.jabatan_ptk_id_str || '',
                    status_kepegawaian: g.status_kepegawaian_id_str || '',
                    status: g.status,
                },
                data_pendukung: {
                    alamat_lengkap: alamatLengkap,
                    no_hp: g.no_hp || '',
                    no_wa: g.no_wa || '',
                    email: g.email || '',
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
};
exports.MandalaService = MandalaService;
exports.MandalaService = MandalaService = MandalaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MandalaService);
//# sourceMappingURL=mandala.service.js.map