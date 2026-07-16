"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MandalaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandalaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto_service_1 = require("../../core/crypto/crypto.service");
const bcrypt = __importStar(require("bcryptjs"));
const { generateSecret, generateURI, verify } = require('otplib');
let MandalaService = MandalaService_1 = class MandalaService {
    prisma;
    jwtService;
    configService;
    cryptoService;
    logger = new common_1.Logger(MandalaService_1.name);
    constructor(prisma, jwtService, configService, cryptoService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.cryptoService = cryptoService;
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
            include: {
                cadisdik: true,
            },
            orderBy: { nama: 'asc' },
        });
        const getBentukNama = (id) => {
            if (!id)
                return null;
            const map = {
                1: 'TK',
                5: 'SD',
                6: 'SMP',
                13: 'SMA',
                15: 'SMK',
                16: 'PNF',
                17: 'SLB',
                34: 'SPK SD',
                35: 'SPK SMP',
                36: 'SPK SMA',
            };
            return map[id] || null;
        };
        const [studentCounts, gtkCounts, bentukPendidikanList] = await Promise.all([
            this.prisma.pesertaDidik.groupBy({
                by: ['sekolah_id'],
                _count: { sekolah_id: true },
            }),
            this.prisma.gtk.groupBy({
                by: ['sekolah_id'],
                _count: { sekolah_id: true },
            }),
            this.prisma.bentuk_pendidikan.findMany(),
        ]);
        const studentCountMap = new Map();
        for (const c of studentCounts) {
            if (c.sekolah_id) {
                studentCountMap.set(c.sekolah_id, c._count.sekolah_id);
            }
        }
        const gtkCountMap = new Map();
        for (const c of gtkCounts) {
            if (c.sekolah_id) {
                gtkCountMap.set(c.sekolah_id, c._count.sekolah_id);
            }
        }
        const bentukPendMap = new Map(bentukPendidikanList.map((b) => [b.bentuk_pendidikan_id, b.nama]));
        const wilayahCache = new Map();
        const resolveCachedWilayah = async (kodeWilayah) => {
            const result = {
                desa: null,
                kecamatan: null,
                kabupaten: null,
                provinsi: null,
                negara: null,
            };
            if (!kodeWilayah)
                return result;
            const trimmed = kodeWilayah.trim();
            if (wilayahCache.has(trimmed)) {
                return wilayahCache.get(trimmed);
            }
            try {
                let currentKode = trimmed;
                let maxDepth = 6;
                while (currentKode && maxDepth > 0) {
                    const wil = await this.prisma.mst_wilayah.findUnique({
                        where: { kode_wilayah: currentKode },
                        select: { nama: true, id_level_wilayah: true, mst_kode_wilayah: true },
                    });
                    if (!wil)
                        break;
                    switch (wil.id_level_wilayah) {
                        case 4:
                            result.desa = wil.nama;
                            break;
                        case 3:
                            result.kecamatan = wil.nama;
                            break;
                        case 2:
                            result.kabupaten = wil.nama;
                            break;
                        case 1:
                            result.provinsi = wil.nama;
                            break;
                        case 0:
                            result.negara = wil.nama;
                            break;
                    }
                    currentKode = wil.mst_kode_wilayah?.trim() || null;
                    maxDepth--;
                }
            }
            catch (e) {
            }
            wilayahCache.set(trimmed, result);
            return result;
        };
        const richSchools = await Promise.all(schools.map(async (school) => {
            const wilayahHierarchy = await resolveCachedWilayah(school.kode_wilayah);
            return {
                sekolah_id: school.sekolah_id,
                nama: school.nama,
                npsn: school.npsn,
                status_sekolah: school.status_sekolah === '1' ? 'Negeri' : (school.status_sekolah === '2' ? 'Swasta' : school.status_sekolah),
                alamat: school.alamat_jalan,
                email: school.email,
                website: school.website,
                bentuk_pendidikan_is_str: bentukPendMap.get(school.bentuk_pendidikan_id || 0) || getBentukNama(school.bentuk_pendidikan_id) || null,
                bentuk_pendidikan_id_str: school.bentuk_pendidikan_id?.toString() || null,
                kabupaten_kota: wilayahHierarchy.kabupaten,
                kecamatan: wilayahHierarchy.kecamatan,
                provinsi: wilayahHierarchy.provinsi,
                lintang: school.lintang,
                bujur: school.bujur,
                desa_kelurahan: school.desa_kelurahan || wilayahHierarchy.desa,
                total_siswa: studentCountMap.get(school.sekolah_id) || 0,
                total_gtk: gtkCountMap.get(school.sekolah_id) || 0,
                nomor_telepon: school.nomor_telepon,
                kode_wilayah: school.kode_wilayah,
                last_update: school.last_update,
                cadisdik: school.cadisdik ? {
                    id: school.cadisdik.cadisdik_id,
                    nama: school.cadisdik.nama_instansi,
                } : null,
            };
        }));
        return richSchools;
    }
    async getCadisdiks() {
        return await this.prisma.cadisdik.findMany({
            orderBy: { nama_instansi: 'asc' },
        });
    }
    async getCadisdikById(id) {
        const data = await this.prisma.cadisdik.findUnique({
            where: { cadisdik_id: id },
            include: {
                sekolah: {
                    select: {
                        sekolah_id: true,
                        nama: true,
                        npsn: true,
                    },
                },
            },
        });
        if (!data)
            throw new common_1.NotFoundException(`Cadisdik with ID ${id} not found.`);
        return data;
    }
    async validateKabupatenDuplication(kabupatenList, excludeId) {
        if (!kabupatenList || kabupatenList.length === 0)
            return;
        const existing = await this.prisma.cadisdik.findFirst({
            where: {
                cadisdik_id: excludeId ? { not: excludeId } : undefined,
                kabupaten: {
                    hasSome: kabupatenList
                }
            },
            select: {
                nama_instansi: true,
                kabupaten: true
            }
        });
        if (existing) {
            const dup = kabupatenList.find(k => existing.kabupaten.includes(k));
            throw new common_1.BadRequestException(`Kabupaten/Kota "${dup}" sudah terdaftar di instansi lain (${existing.nama_instansi})`);
        }
    }
    async getAllProvinsi() {
        const list = await this.prisma.mst_wilayah.findMany({
            where: {
                id_level_wilayah: 1,
            },
            orderBy: { nama: 'asc' },
            select: { nama: true }
        });
        return list.map(item => item.nama.trim());
    }
    async getKabupatenByProvinsi(provinsiNama) {
        if (!provinsiNama)
            return [];
        const prov = await this.prisma.mst_wilayah.findFirst({
            where: {
                id_level_wilayah: 1,
                nama: {
                    equals: provinsiNama.trim(),
                    mode: 'insensitive'
                }
            },
            select: { kode_wilayah: true }
        });
        if (!prov)
            return [];
        const list = await this.prisma.mst_wilayah.findMany({
            where: {
                id_level_wilayah: 2,
                mst_kode_wilayah: prov.kode_wilayah
            },
            orderBy: { nama: 'asc' },
            select: { nama: true }
        });
        return list.map(item => item.nama.trim());
    }
    async createCadisdik(data) {
        const kabupatenList = Array.isArray(data.kabupaten) ? data.kabupaten : [];
        await this.validateKabupatenDuplication(kabupatenList);
        return await this.prisma.cadisdik.create({
            data: {
                nama_instansi: data.nama_instansi,
                alamat: data.alamat,
                email: data.email,
                nomor_telepon: data.nomor_telepon,
                website: data.website,
                provinsi: data.provinsi || null,
                kabupaten: kabupatenList,
                aktif: data.aktif !== undefined ? data.aktif : true,
            },
        });
    }
    async updateCadisdik(id, data) {
        await this.getCadisdikById(id);
        const kabupatenList = Array.isArray(data.kabupaten) ? data.kabupaten : [];
        await this.validateKabupatenDuplication(kabupatenList, id);
        return await this.prisma.cadisdik.update({
            where: { cadisdik_id: id },
            data: {
                nama_instansi: data.nama_instansi,
                alamat: data.alamat,
                email: data.email,
                nomor_telepon: data.nomor_telepon,
                website: data.website,
                provinsi: data.provinsi || null,
                kabupaten: kabupatenList,
                aktif: data.aktif,
                updated_at: new Date(),
            },
        });
    }
    async deleteCadisdik(id) {
        await this.getCadisdikById(id);
        return await this.prisma.cadisdik.delete({
            where: { cadisdik_id: id },
        });
    }
    async getKategoriKeperluan(cadisdikId) {
        return await this.prisma.kategoriKeperluan.findMany({
            where: cadisdikId ? { cadisdik_id: cadisdikId } : {},
            orderBy: { nama: 'asc' },
        });
    }
    async createKategoriKeperluan(data) {
        return await this.prisma.kategoriKeperluan.create({
            data,
        });
    }
    async updateKategoriKeperluan(id, data) {
        return await this.prisma.kategoriKeperluan.update({
            where: { kategori_keperluan_id: id },
            data,
        });
    }
    async deleteKategoriKeperluan(id) {
        return await this.prisma.kategoriKeperluan.delete({
            where: { kategori_keperluan_id: id },
        });
    }
    async getAntrian(filters) {
        const { cadisdik_id, status, start_date, end_date } = filters;
        const where = {};
        if (cadisdik_id)
            where.cadisdik_id = cadisdik_id;
        if (status !== undefined)
            where.status = status;
        if (start_date || end_date) {
            where.created_at = {};
            if (start_date)
                where.created_at.gte = new Date(start_date);
            if (end_date) {
                const endDate = new Date(end_date);
                endDate.setHours(23, 59, 59, 999);
                where.created_at.lte = endDate;
            }
        }
        return await this.prisma.antrian.findMany({
            where,
            include: {
                kategori_keperluan: true,
            },
            orderBy: { created_at: 'asc' },
        });
    }
    async createAntrian(data) {
        let attempts = 0;
        const maxAttempts = 5;
        while (attempts < maxAttempts) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    await tx.$executeRaw `
            SELECT pg_advisory_xact_lock(hashtext(${data.cadisdik_id}))
          `;
                    const result = await tx.$queryRaw `
            SELECT COALESCE(MAX(nomor_antrian), 0) as max_nomor
            FROM "mandala"."antrian"
            WHERE cadisdik_id = ${data.cadisdik_id}::uuid
              AND tanggal = CURRENT_DATE
          `;
                    const maxNomor = result[0]?.max_nomor ?? 0;
                    const nextNomor = Number(maxNomor) + 1;
                    return await tx.antrian.create({
                        data: {
                            ...data,
                            nomor_antrian: nextNomor,
                        },
                    });
                });
            }
            catch (error) {
                const isUniqueViolation = error &&
                    (error.code === 'P2002' ||
                        (error.message && error.message.includes('Unique constraint failed')));
                if (isUniqueViolation) {
                    attempts++;
                    this.logger.warn(`Unique constraint hit when creating antrian for cadisdik ${data.cadisdik_id}. Retrying transaction attempt ${attempts}/${maxAttempts}...`);
                    if (attempts >= maxAttempts) {
                        throw error;
                    }
                    await new Promise((resolve) => setTimeout(resolve, Math.random() * 50 + 10));
                    continue;
                }
                throw error;
            }
        }
    }
    async updateAntrianStatus(id, status) {
        return await this.prisma.antrian.update({
            where: { antrian_id: id },
            data: { status },
        });
    }
    async getAntrianSummary(cadisdikId) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const baseWhere = {
            created_at: {
                gte: today,
                lt: tomorrow,
            },
        };
        if (cadisdikId)
            baseWhere.cadisdik_id = cadisdikId;
        const [total, menunggu, dipanggil, melayani, selesai, batal] = await Promise.all([
            this.prisma.antrian.count({ where: baseWhere }),
            this.prisma.antrian.count({ where: { ...baseWhere, status: 0 } }),
            this.prisma.antrian.count({ where: { ...baseWhere, status: 1 } }),
            this.prisma.antrian.count({ where: { ...baseWhere, status: 2 } }),
            this.prisma.antrian.count({ where: { ...baseWhere, status: 3 } }),
            this.prisma.antrian.count({ where: { ...baseWhere, status: 4 } }),
        ]);
        return {
            hari_ini: today.toISOString().split('T')[0],
            total,
            menunggu,
            dipanggil,
            melayani,
            selesai,
            batal,
        };
    }
    async getJenisJabatans() {
        return await this.prisma.jenisJabatan.findMany({
            orderBy: { nama: 'asc' },
        });
    }
    async getJenisJabatanById(id) {
        const data = await this.prisma.jenisJabatan.findUnique({
            where: { jenis_jabatan_id: id },
        });
        if (!data)
            throw new common_1.NotFoundException(`Jenis Jabatan with ID ${id} not found.`);
        return data;
    }
    async createJenisJabatan(data) {
        return await this.prisma.jenisJabatan.create({
            data: {
                nama: data.nama,
            },
        });
    }
    async updateJenisJabatan(id, data) {
        await this.getJenisJabatanById(id);
        return await this.prisma.jenisJabatan.update({
            where: { jenis_jabatan_id: id },
            data: {
                nama: data.nama,
                updated_at: new Date(),
            },
        });
    }
    async deleteJenisJabatan(id) {
        await this.getJenisJabatanById(id);
        return await this.prisma.jenisJabatan.delete({
            where: { jenis_jabatan_id: id },
        });
    }
    async getPegawais(cadisdikId) {
        const where = {};
        if (cadisdikId)
            where.cadisdik_id = cadisdikId;
        return await this.prisma.pegawai.findMany({
            where,
            include: {
                cadisdik: {
                    select: {
                        nama_instansi: true,
                    },
                },
                jenis_jabatan: true,
            },
            orderBy: { nama_lengkap: 'asc' },
        });
    }
    async getPegawaiById(id) {
        const data = await this.prisma.pegawai.findUnique({
            where: { pegawai_id: id },
            include: {
                cadisdik: true,
                jenis_jabatan: true,
            },
        });
        if (!data)
            throw new common_1.NotFoundException(`Pegawai with ID ${id} not found.`);
        return data;
    }
    async createPegawai(data) {
        const orConditions = [];
        if (data.nip && data.nip.trim() !== '') {
            orConditions.push({ nip: data.nip });
        }
        if (data.email && data.email.trim() !== '') {
            orConditions.push({ email: data.email });
        }
        if (data.nik && data.nik.trim() !== '') {
            orConditions.push({ nik: data.nik });
        }
        if (orConditions.length > 0) {
            const existing = await this.prisma.pegawai.findFirst({
                where: {
                    OR: orConditions,
                },
            });
            if (existing) {
                if (data.nip && existing.nip === data.nip) {
                    throw new common_1.BadRequestException('Pegawai with this NIP already exists.');
                }
                if (data.email && existing.email === data.email) {
                    throw new common_1.BadRequestException('Pegawai with this Email already exists.');
                }
                if (data.nik && existing.nik === data.nik) {
                    throw new common_1.BadRequestException('Pegawai with this NIK already exists.');
                }
            }
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return await this.prisma.pegawai.create({
            data: {
                cadisdik_id: data.cadisdik_id,
                nama_lengkap: data.nama_lengkap,
                nik: data.nik && data.nik.trim() !== '' ? data.nik : null,
                tempat_lahir: data.tempat_lahir,
                tanggal_lahir: new Date(data.tanggal_lahir),
                alamat_lengkap: data.alamat_lengkap,
                nip: data.nip && data.nip.trim() !== '' ? data.nip : null,
                email: data.email,
                password: hashedPassword,
                jabatan: data.jenis_jabatan_id ? null : (data.jabatan !== undefined && data.jabatan !== null ? parseInt(data.jabatan, 10) : null),
                jenis_kelamin: data.jenis_kelamin,
                nomor_telepon: data.nomor_telepon,
                foto: data.foto,
                aktif: data.aktif !== undefined ? data.aktif : true,
                golongan: data.golongan !== undefined && data.golongan !== null && data.golongan !== '' ? parseInt(data.golongan, 10) : null,
                jenis_jabatan_id: data.jenis_jabatan_id || null,
            },
        });
    }
    async updatePegawai(id, data) {
        await this.getPegawaiById(id);
        const updateData = {
            cadisdik_id: data.cadisdik_id,
            nama_lengkap: data.nama_lengkap,
            nik: data.nik !== undefined ? (data.nik && data.nik.trim() !== '' ? data.nik : null) : undefined,
            tempat_lahir: data.tempat_lahir,
            tanggal_lahir: data.tanggal_lahir ? new Date(data.tanggal_lahir) : undefined,
            alamat_lengkap: data.alamat_lengkap,
            nip: data.nip !== undefined ? (data.nip && data.nip.trim() !== '' ? data.nip : null) : undefined,
            email: data.email,
            jabatan: data.jenis_jabatan_id ? null : (data.jabatan !== undefined ? (data.jabatan !== null && data.jabatan !== '' ? parseInt(data.jabatan, 10) : null) : undefined),
            jenis_kelamin: data.jenis_kelamin,
            nomor_telepon: data.nomor_telepon,
            foto: data.foto,
            aktif: data.aktif,
            golongan: data.golongan !== undefined ? (data.golongan !== null && data.golongan !== '' ? parseInt(data.golongan, 10) : null) : undefined,
            jenis_jabatan_id: data.jenis_jabatan_id !== undefined ? (data.jenis_jabatan_id || null) : undefined,
            updated_at: new Date(),
        };
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        return await this.prisma.pegawai.update({
            where: { pegawai_id: id },
            data: updateData,
        });
    }
    async deletePegawai(id) {
        await this.getPegawaiById(id);
        return await this.prisma.pegawai.delete({
            where: { pegawai_id: id },
        });
    }
    async getMappingPengawas(pegawaiId, sekolahId) {
        const where = {};
        if (pegawaiId)
            where.pegawai_id = pegawaiId;
        if (sekolahId)
            where.sekolah_id = sekolahId;
        return await this.prisma.mappingPengawas.findMany({
            where,
            include: {
                pegawai: {
                    select: { nama_lengkap: true, nip: true },
                },
                sekolah: {
                    select: { nama: true, npsn: true },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async createMappingPengawas(data) {
        const existing = await this.prisma.mappingPengawas.findFirst({
            where: {
                pegawai_id: data.pegawai_id,
                sekolah_id: data.sekolah_id,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Mapping for this Pegawai and Sekolah already exists.');
        }
        return await this.prisma.mappingPengawas.create({
            data: {
                pegawai_id: data.pegawai_id,
                sekolah_id: data.sekolah_id,
            },
        });
    }
    async deleteMappingPengawas(id) {
        const existing = await this.prisma.mappingPengawas.findUnique({ where: { mapping_pengawas_id: id } });
        if (!existing) {
            throw new common_1.NotFoundException(`MappingPengawas with ID ${id} not found.`);
        }
        return await this.prisma.mappingPengawas.delete({
            where: { mapping_pengawas_id: id },
        });
    }
    async loginPegawai(credentials) {
        const { identifier, password } = credentials;
        const pegawai = await this.prisma.pegawai.findFirst({
            where: {
                OR: [
                    { nip: identifier },
                    { email: identifier },
                ],
            },
            include: {
                cadisdik: true,
            },
        });
        let userType = 'pegawai';
        let userEntity = pegawai;
        if (!userEntity) {
            const operator = await this.prisma.pengguna.findFirst({
                where: {
                    email: identifier,
                    peran_nama: 'Operator Sekolah',
                },
            });
            if (operator) {
                userType = 'operator';
                userEntity = operator;
            }
        }
        if (!userEntity) {
            throw new common_1.UnauthorizedException('Kredensial tidak valid (User tidak ditemukan).');
        }
        if (userType === 'pegawai' && !userEntity.aktif) {
            throw new common_1.ForbiddenException('Akun Anda telah dinonaktifkan.');
        }
        const isMatch = await bcrypt.compare(password, userEntity.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Kredensial tidak valid (Password salah).');
        }
        const payload = {
            sub: userType === 'pegawai' ? userEntity.pegawai_id : userEntity.pengguna_id,
            type: userType === 'pegawai' ? '2fa_pending_mandala' : '2fa_pending_mandala_operator'
        };
        const tempToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: '10m'
        });
        const userSecret = userType === 'pegawai' ? userEntity.authenticator_secret : userEntity.google2fa_secret;
        if (!userSecret) {
            const secret = generateSecret();
            const otpauthUrl = generateURI({
                label: userType === 'pegawai' ? userEntity.nip : userEntity.email,
                issuer: 'MANDALA',
                secret
            });
            return {
                status: 'success',
                requires2FA: true,
                is2FASetup: false,
                tempToken,
                qrCodeUrl: otpauthUrl,
                secret: secret
            };
        }
        return {
            status: 'success',
            requires2FA: true,
            is2FASetup: true,
            tempToken
        };
    }
    async verify2FAPegawai(tempToken, code, secretToSave) {
        try {
            const payload = this.jwtService.verify(tempToken, {
                secret: this.configService.get('JWT_SECRET')
            });
            if (payload.type !== '2fa_pending_mandala' && payload.type !== '2fa_pending_mandala_operator') {
                throw new common_1.UnauthorizedException('Token tidak valid');
            }
            const isOperator = payload.type === '2fa_pending_mandala_operator';
            let userEntity;
            let secret;
            if (isOperator) {
                userEntity = await this.prisma.pengguna.findUnique({
                    where: { pengguna_id: payload.sub },
                });
            }
            else {
                userEntity = await this.prisma.pegawai.findUnique({
                    where: { pegawai_id: payload.sub },
                    include: { cadisdik: true }
                });
            }
            if (!userEntity)
                throw new common_1.UnauthorizedException('User tidak ditemukan');
            const currentSecret = isOperator ? userEntity.google2fa_secret : userEntity.authenticator_secret;
            if (!currentSecret) {
                if (!secretToSave) {
                    throw new common_1.UnauthorizedException('Setup 2FA belum selesai');
                }
                secret = secretToSave;
            }
            else {
                secret = this.cryptoService.decrypt(currentSecret);
            }
            const result = await verify({
                token: code,
                secret: secret,
                window: 1,
            });
            if (!result || !result.valid) {
                throw new common_1.UnauthorizedException('Kode 2FA tidak valid');
            }
            if (!currentSecret && secretToSave) {
                const encryptedSecret = this.cryptoService.encrypt(secretToSave);
                if (isOperator) {
                    await this.prisma.pengguna.update({
                        where: { pengguna_id: userEntity.pengguna_id },
                        data: { google2fa_secret: encryptedSecret }
                    });
                }
                else {
                    await this.prisma.pegawai.update({
                        where: { pegawai_id: userEntity.pegawai_id },
                        data: { authenticator_secret: encryptedSecret }
                    });
                }
            }
            let cadisdikId = null;
            let cadisdikNama = null;
            if (isOperator) {
                if (userEntity.sekolah_id) {
                    const sekolah = await this.prisma.sekolah.findUnique({
                        where: { sekolah_id: userEntity.sekolah_id },
                        include: { cadisdik: true }
                    });
                    cadisdikId = sekolah?.cadisdik_id || null;
                    cadisdikNama = sekolah?.cadisdik?.nama_instansi || null;
                }
            }
            const finalPayload = isOperator ? {
                sub: userEntity.pengguna_id,
                email: userEntity.email,
                nip: '',
                nik: '',
                role: 'Operator Sekolah',
                cadisdik_id: cadisdikId,
                cadisdik_nama: cadisdikNama,
                sekolahId: userEntity.sekolah_id,
            } : {
                sub: userEntity.pegawai_id,
                email: userEntity.email,
                nip: userEntity.nip,
                nik: userEntity.nik,
                role: 'Mandala Pegawai',
                jabatan: userEntity.jabatan,
                cadisdik_id: userEntity.cadisdik_id,
                cadisdik_nama: userEntity.cadisdik?.nama_instansi,
            };
            const accessToken = this.jwtService.sign(finalPayload);
            const refreshToken = this.jwtService.sign(finalPayload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
            });
            return {
                status: 'success',
                data: {
                    accessToken,
                    refreshToken,
                    pegawai: isOperator ? {
                        id: userEntity.pengguna_id,
                        nama: userEntity.nama,
                        nip: '',
                        nik: '',
                        email: userEntity.email,
                        role: 'Operator Sekolah',
                        cadisdik: cadisdikNama || '',
                    } : {
                        id: userEntity.pegawai_id,
                        nama: userEntity.nama_lengkap,
                        nip: userEntity.nip,
                        nik: userEntity.nik || '',
                        email: userEntity.email,
                        role: 'Mandala Pegawai',
                        jabatan: userEntity.jabatan,
                        cadisdik: userEntity.cadisdik?.nama_instansi,
                    },
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            console.error('2FA Error Mandala:', error);
            throw new common_1.UnauthorizedException('Verifikasi 2FA gagal');
        }
    }
    async refreshTokensPegawai(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const isOperator = payload.role === 'Operator Sekolah';
            let finalPayload;
            let userResponse;
            if (isOperator) {
                const operator = await this.prisma.pengguna.findUnique({
                    where: { pengguna_id: payload.sub },
                });
                if (!operator)
                    throw new common_1.UnauthorizedException('User tidak ditemukan');
                let cadisdikId = null;
                let cadisdikNama = null;
                if (operator.sekolah_id) {
                    const sekolah = await this.prisma.sekolah.findUnique({
                        where: { sekolah_id: operator.sekolah_id },
                        include: { cadisdik: true }
                    });
                    cadisdikId = sekolah?.cadisdik_id || null;
                    cadisdikNama = sekolah?.cadisdik?.nama_instansi || null;
                }
                finalPayload = {
                    sub: operator.pengguna_id,
                    email: operator.email,
                    nip: '',
                    nik: '',
                    role: 'Operator Sekolah',
                    cadisdik_id: cadisdikId,
                    cadisdik_nama: cadisdikNama,
                };
                userResponse = {
                    id: operator.pengguna_id,
                    nama: operator.nama,
                    nip: '',
                    nik: '',
                    email: operator.email,
                    role: 'Operator Sekolah',
                    cadisdik: cadisdikNama || '',
                };
            }
            else {
                const pegawai = await this.prisma.pegawai.findUnique({
                    where: { pegawai_id: payload.sub },
                    include: { cadisdik: true }
                });
                if (!pegawai)
                    throw new common_1.UnauthorizedException('Pegawai tidak ditemukan');
                if (!pegawai.aktif)
                    throw new common_1.ForbiddenException('Akun Anda telah dinonaktifkan.');
                finalPayload = {
                    sub: pegawai.pegawai_id,
                    email: pegawai.email,
                    nip: pegawai.nip,
                    nik: pegawai.nik,
                    role: 'Mandala Pegawai',
                    jabatan: pegawai.jabatan,
                    cadisdik_id: pegawai.cadisdik_id,
                    cadisdik_nama: pegawai.cadisdik?.nama_instansi,
                };
                userResponse = {
                    id: pegawai.pegawai_id,
                    nama: pegawai.nama_lengkap,
                    nip: pegawai.nip,
                    nik: pegawai.nik || '',
                    email: pegawai.email,
                    role: 'Mandala Pegawai',
                    jabatan: pegawai.jabatan,
                    cadisdik: pegawai.cadisdik?.nama_instansi,
                };
            }
            const accessToken = this.jwtService.sign(finalPayload);
            const newRefreshToken = this.jwtService.sign(finalPayload, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION') || '7d',
            });
            return {
                accessToken,
                refreshToken: newRefreshToken,
                pegawai: userResponse,
            };
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Sesi telah berakhir, silakan login kembali');
        }
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
                            { jenis_ptk: { jenis_ptk: { contains: 'Kepala Sekolah', mode: 'insensitive' } } },
                            { jabatan_ptk: { jabatan_ptk: { contains: 'Kepala Sekolah', mode: 'insensitive' } } },
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
                    rombongan_belajar: {
                        include: {
                            jurusan_sp: true,
                        },
                    },
                    anggota_rombel: {
                        where: {
                            rombongan_belajar: {
                                jenis_rombel: 1,
                            },
                        },
                        include: {
                            rombongan_belajar: {
                                include: {
                                    jurusan_sp: true,
                                },
                            },
                        },
                    },
                    agama: true,
                },
                orderBy: { nama: 'asc' },
            }),
        ]);
        const formattedData = students.map((pd) => {
            const addressParts = [
                pd.alamat_jalan,
                pd.rt ? `RT ${pd.rt}` : null,
                pd.rw ? `RW ${pd.rw}` : null,
                pd.nama_dusun ? `Dusun ${pd.nama_dusun}` : null,
                pd.desa_kelurahan ? `Desa/Kel. ${pd.desa_kelurahan}` : null,
                pd.kode_pos
            ].filter(Boolean);
            const alamatLengkap = addressParts.length > 0 ? addressParts.join(', ') : '';
            const hpOrangTua = pd.nomor_telepon_seluler || '';
            const activeAnggota = pd.anggota_rombel?.[0];
            const activeRombel = activeAnggota?.rombongan_belajar || pd.rombongan_belajar;
            return {
                identitas: {
                    id: pd.peserta_didik_id,
                    sekolah_id: pd.sekolah_id,
                    nama: pd.nama,
                    nisn: pd.nisn,
                    nik: pd.nik,
                    nipd: pd.nipd || '',
                    desa: pd.desa_kelurahan || '',
                    jenis_kelamin: pd.jenis_kelamin,
                    tempat_lahir: pd.tempat_lahir,
                    tanggal_lahir: pd.tanggal_lahir,
                    agama: pd.agama?.nama || pd.agama_id || '',
                    jenis_pendaftaran_id_str: pd.jenis_pendaftaran_id?.toString() || '',
                    foto: pd.foto || '',
                    tanggal_masuk_sekolah: pd.tanggal_masuk_sekolah || null,
                    tanggal_keluar: pd.tanggal_keluar || null,
                    jenis_keluar_id: pd.jenis_keluar_id || null,
                    last_update: pd.updated_at,
                },
                akademik: {
                    nama_rombel: activeRombel?.nama || '',
                    tingkat: activeRombel?.tingkat_pendidikan_id?.toString() || '',
                    jurusan: activeRombel?.jurusan_sp?.nama_jurusan_sp || activeRombel?.jurusan_sp_id || '',
                },
                data_pendukung: {
                    alamat_lengkap: alamatLengkap,
                    desa: pd.desa_kelurahan || '',
                    nama_ayah: pd.nama_ayah || '',
                    nama_ibu: pd.nama_ibu_kandung || '',
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
            whereClause.jenis_ptk = { jenis_ptk: { contains: 'Guru', mode: 'insensitive' } };
        }
        else if (type === 'tendik') {
            whereClause.NOT = {
                jenis_ptk: { jenis_ptk: { contains: 'Guru', mode: 'insensitive' } },
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
                include: {
                    jenis_ptk: true,
                    status_kepegawaian: true,
                    jabatan_ptk: true,
                    agama: true,
                    riwayat_pendidikan_formal: {
                        select: { jenjang_pendidikan_id: true }
                    },
                    rwy_sertifikasi: true,
                },
                take: limit,
                skip: skip,
                orderBy: { nama: 'asc' },
            }),
        ]);
        const getPendidikanTerakhir = (riwayat) => {
            const ids = riwayat.map(r => r.jenjang_pendidikan_id ? Number(r.jenjang_pendidikan_id) : 0);
            if (ids.some(id => id === 40 || id === 41))
                return 'S3';
            if (ids.some(id => id === 35 || id === 36))
                return 'S2';
            if (ids.some(id => id === 30 || id === 31 || id === 23))
                return 'S1';
            if (ids.some(id => id === 22))
                return 'D3';
            if (ids.some(id => id === 21))
                return 'D2';
            if (ids.some(id => id === 20))
                return 'D1';
            if (ids.some(id => id === 6 || id === 9))
                return 'SMA';
            return '';
        };
        const allKodeLembSert = new Set();
        const allIdJenisSertifikasi = new Set();
        const allBidangStudiId = new Set();
        for (const g of gtks) {
            if (g.rwy_sertifikasi) {
                for (const s of g.rwy_sertifikasi) {
                    if (s.kode_lemb_sert) {
                        const val = Number(s.kode_lemb_sert);
                        if (!isNaN(val))
                            allKodeLembSert.add(val);
                    }
                    if (s.id_jenis_sertifikasi) {
                        const val = Number(s.id_jenis_sertifikasi);
                        if (!isNaN(val))
                            allIdJenisSertifikasi.add(val);
                    }
                    if (s.bidang_studi_id) {
                        allBidangStudiId.add(s.bidang_studi_id);
                    }
                }
            }
        }
        const [lembList, jenisList, bidangList] = await Promise.all([
            allKodeLembSert.size > 0
                ? this.prisma.lemb_sertifikasi.findMany({
                    where: { kode_lemb_sert: { in: Array.from(allKodeLembSert) } },
                    select: { kode_lemb_sert: true, nm_lemb_sert: true }
                })
                : [],
            allIdJenisSertifikasi.size > 0
                ? this.prisma.jenis_sertifikasi.findMany({
                    where: { id_jenis_sertifikasi: { in: Array.from(allIdJenisSertifikasi) } },
                    select: { id_jenis_sertifikasi: true, jenis_sertifikasi: true }
                })
                : [],
            allBidangStudiId.size > 0
                ? this.prisma.bidang_studi.findMany({
                    where: { bidang_studi_id: { in: Array.from(allBidangStudiId) } },
                    select: { bidang_studi_id: true, bidang_studi: true }
                })
                : [],
        ]);
        const lembMap = new Map(lembList.map((item) => [Number(item.kode_lemb_sert), item.nm_lemb_sert]));
        const jenisMap = new Map(jenisList.map((item) => [Number(item.id_jenis_sertifikasi), item.jenis_sertifikasi]));
        const bidangMap = new Map(bidangList.map((item) => [item.bidang_studi_id, item.bidang_studi]));
        const formattedData = gtks.map((g) => {
            const addressParts = [
                g.alamat_jalan,
                g.rt ? `RT ${g.rt}` : null,
                g.rw ? `RW ${g.rw}` : null,
                g.nama_dusun ? `Dusun ${g.nama_dusun}` : null,
                g.desa_kelurahan ? `Desa/Kel. ${g.desa_kelurahan}` : null,
                g.kode_pos
            ].filter(Boolean);
            const alamatLengkap = addressParts.length > 0 ? addressParts.join(', ') : '';
            const sertifikasi = (g.rwy_sertifikasi || []).map((s) => {
                const kodeLembVal = s.kode_lemb_sert ? Number(s.kode_lemb_sert) : null;
                const idJenisVal = s.id_jenis_sertifikasi ? Number(s.id_jenis_sertifikasi) : null;
                const bidangIdVal = s.bidang_studi_id || null;
                return {
                    riwayat_sertifikasi_id: s.riwayat_sertifikasi_id,
                    kode_lemb_sert: s.kode_lemb_sert,
                    lembaga_sertifikasi: (kodeLembVal !== null ? lembMap.get(kodeLembVal) : null) || s.kode_lemb_sert || '',
                    lembaga_sertifikasi_nama: (kodeLembVal !== null ? lembMap.get(kodeLembVal) : null) || s.kode_lemb_sert || '',
                    bidang_studi_id: s.bidang_studi_id,
                    bidang_studi: (bidangIdVal !== null ? bidangMap.get(bidangIdVal) : null) || s.bidang_studi_id_str || '',
                    bidang_studi_nama: (bidangIdVal !== null ? bidangMap.get(bidangIdVal) : null) || s.bidang_studi_id_str || '',
                    id_jenis_sertifikasi: s.id_jenis_sertifikasi,
                    jenis_sertifikasi: (idJenisVal !== null ? jenisMap.get(idJenisVal) : null) || s.id_jenis_sertifikasi || '',
                    jenis_sertifikasi_nama: (idJenisVal !== null ? jenisMap.get(idJenisVal) : null) || s.id_jenis_sertifikasi || '',
                    tgl_berlaku: s.tgl_sert || null,
                    tgl_habis_berlaku: s.tgl_exp_sert || null,
                    no_sertifikasi: s.nomor_sertifikat || '',
                    no_registrasi: s.nomer_registrasi || '',
                    nomer_registrasi: s.nomer_registrasi || '',
                    nomor_peserta: s.nomor_peserta || '',
                    kualifikasi: s.kualifikasi || '',
                };
            });
            return {
                identitas: {
                    id: g.ptk_id,
                    sekolah_id: g.sekolah_id,
                    nama: g.nama,
                    nip: g.nip || '',
                    nik: g.nik || '',
                    nuptk: g.nuptk || '',
                    desa: g.desa_kelurahan || '',
                    jenis_kelamin: g.jenis_kelamin || '',
                    tempat_lahir: g.tempat_lahir || '',
                    tanggal_lahir: g.tanggal_lahir || null,
                    agama: g.agama?.nama || g.agama_id?.toString() || '',
                    foto: g.foto || '',
                    jenis_keluar_id: g.jenis_keluar_id || null,
                    last_update: g.last_update,
                },
                kepegawaian: {
                    jenis_ptk: g.jenis_ptk?.jenis_ptk || '',
                    jabatan: g.jabatan_ptk?.jabatan_ptk || '',
                    status_kepegawaian: g.status_kepegawaian?.nama || '',
                    status: g.status,
                    pendidikan_terakhir: getPendidikanTerakhir(g.riwayat_pendidikan_formal),
                    ptk_induk: g.ptk_induk !== null && g.ptk_induk !== undefined ? Number(g.ptk_induk) : 0,
                },
                data_pendukung: {
                    alamat_lengkap: alamatLengkap,
                    desa: g.desa_kelurahan || '',
                    no_hp: g.no_hp || '',
                    no_wa: '',
                    email: g.email || '',
                    nama_ibu_kandung: g.nama_ibu_kandung || '',
                },
                sertifikasi,
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
    async getGtkRekapForMandala(sekolahId) {
        if (!sekolahId) {
            throw new common_1.BadRequestException('sekolah_id query parameter is required for GTK recap.');
        }
        const school = await this.prisma.sekolah.findUnique({
            where: { sekolah_id: sekolahId },
        });
        if (!school) {
            throw new common_1.NotFoundException(`School with ID ${sekolahId} not found.`);
        }
        const rawGtks = await this.prisma.gtk.findMany({
            where: {
                sekolah_id: sekolahId,
                status: 'Aktif',
            },
            select: {
                jenis_kelamin: true,
                tanggal_lahir: true,
                jenis_ptk: {
                    select: { jenis_ptk: true }
                },
                status_kepegawaian: {
                    select: { nama: true }
                },
                riwayat_pendidikan_formal: {
                    select: { jenjang_pendidikan_id: true }
                }
            },
        });
        const getPendidikanTerakhir = (riwayat) => {
            const ids = riwayat.map(r => r.jenjang_pendidikan_id ? Number(r.jenjang_pendidikan_id) : 0);
            if (ids.some(id => id === 40 || id === 41))
                return 'S3';
            if (ids.some(id => id === 35 || id === 36))
                return 'S2';
            if (ids.some(id => id === 30 || id === 31 || id === 23))
                return 'S1';
            if (ids.some(id => id === 22))
                return 'D3';
            if (ids.some(id => id === 21))
                return 'D2';
            if (ids.some(id => id === 20))
                return 'D1';
            if (ids.some(id => id === 6 || id === 9))
                return 'SMA';
            return '';
        };
        const gtks = rawGtks.map((g) => ({
            jenis_ptk_id_str: g.jenis_ptk?.jenis_ptk || '',
            jenis_kelamin: g.jenis_kelamin,
            status_kepegawaian_id_str: g.status_kepegawaian?.nama || '',
            tanggal_lahir: g.tanggal_lahir,
            pendidikan_terakhir: getPendidikanTerakhir(g.riwayat_pendidikan_formal)
        }));
        const isGuru = (j) => (j || '').toLowerCase().includes('guru');
        const isAsn = (s) => ['pns', 'pppk'].includes((s || '').toLowerCase());
        const guru = gtks.filter(i => isGuru(i.jenis_ptk_id_str));
        const tendik = gtks.filter(i => !isGuru(i.jenis_ptk_id_str));
        const rekapKategori = [
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
        const categories = [
            { label: "S2/Pasca Sarjana", keys: ["S2"] },
            { label: "S1/Sarjana", keys: ["S1", null, ""] },
            { label: "D3/Diploma", keys: ["D3"] },
            { label: "SMA/Sederajat", keys: ["SMA", "SMK"] },
        ];
        const rekapPendidikan = categories.map((cat, idx) => {
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
        const rekapUsia = ranges.map((range, idx) => {
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
        return {
            status: 'success',
            data: {
                rekap_kategori: rekapKategori,
                rekap_pendidikan: rekapPendidikan,
                rekap_usia: rekapUsia,
            }
        };
    }
    async getPesertaDidikPresenceForMandala(sekolahId, date) {
        const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        const dateOnly = new Date(wibDate.toISOString().split('T')[0]);
        const data = await this.prisma.presensiPesertaDidik.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: dateOnly,
            },
            include: {
                peserta_didik: {
                    select: {
                        nama: true,
                        nisn: true,
                        nipd: true,
                        foto: true,
                        rombongan_belajar: {
                            select: {
                                nama: true,
                                tingkat_pendidikan_id: true,
                            }
                        }
                    }
                }
            },
            orderBy: { jam_masuk: 'desc' },
        });
        return data.map(item => ({
            ...item,
            status_masuk_str: this.mapStatusMasuk(item.status_masuk),
            status_pulang_str: this.mapStatusPulang(item.status_pulang),
        }));
    }
    async getGtkPresenceForMandala(sekolahId, date) {
        const wibDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        const dateOnly = new Date(wibDate.toISOString().split('T')[0]);
        const data = await this.prisma.presensiGtk.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: dateOnly,
            },
            include: {
                gtk: {
                    select: {
                        nama: true,
                        nuptk: true,
                        nip: true,
                        foto: true,
                        jenis_ptk: {
                            select: { jenis_ptk: true }
                        },
                    }
                }
            },
            orderBy: { jam_masuk: 'desc' },
        });
        return data.map(item => {
            let formattedGtk = null;
            if (item.gtk) {
                const { jenis_ptk, ...gtkRest } = item.gtk;
                formattedGtk = {
                    ...gtkRest,
                    jenis_ptk_id_str: jenis_ptk?.jenis_ptk || null
                };
            }
            return {
                ...item,
                gtk: formattedGtk,
                status_masuk_str: this.mapStatusMasuk(item.status_masuk),
                status_pulang_str: this.mapStatusPulang(item.status_pulang),
            };
        });
    }
    mapStatusMasuk(status) {
        switch (status) {
            case 1: return 'Hadir';
            case 2: return 'Terlambat';
            case 3: return 'Izin';
            case 4: return 'Sakit';
            case 5: return 'Alpha';
            default: return '-';
        }
    }
    mapStatusPulang(status) {
        switch (status) {
            case 1: return 'Normal';
            case 2: return 'Pulang Awal';
            case 3: return 'Izin Pulang';
            default: return '-';
        }
    }
    async getPesertaDidikAnnualSummaryForMandala(sekolahId, year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);
        const presensi = await this.prisma.presensiPesertaDidik.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                tanggal: true,
                status_masuk: true,
            },
        });
        return this.calculateMonthlySummary(presensi);
    }
    async getGtkAnnualSummaryForMandala(sekolahId, year) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);
        const presensi = await this.prisma.presensiGtk.findMany({
            where: {
                sekolah_id: sekolahId,
                tanggal: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            select: {
                tanggal: true,
                status_masuk: true,
            },
        });
        return this.calculateMonthlySummary(presensi);
    }
    calculateMonthlySummary(presensi) {
        const months = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        const summary = months.map((month, index) => ({
            bulan: month,
            index: index + 1,
            hadir: 0,
            sakit: 0,
            izin: 0,
            alpha: 0,
        }));
        presensi.forEach(item => {
            const monthIndex = new Date(item.tanggal).getMonth();
            const status = item.status_masuk;
            if (status === 1 || status === 2) {
                summary[monthIndex].hadir++;
            }
            else if (status === 3) {
                summary[monthIndex].izin++;
            }
            else if (status === 4) {
                summary[monthIndex].sakit++;
            }
            else if (status === 5) {
                summary[monthIndex].alpha++;
            }
        });
        return summary;
    }
    async resolveWilayahHierarchy(kodeWilayah) {
        const result = {
            desa: null,
            kecamatan: null,
            kabupaten: null,
            provinsi: null,
            negara: null,
        };
        if (!kodeWilayah)
            return result;
        try {
            let currentKode = kodeWilayah.trim();
            let maxDepth = 6;
            while (currentKode && maxDepth > 0) {
                const wil = await this.prisma.mst_wilayah.findUnique({
                    where: { kode_wilayah: currentKode },
                    select: { nama: true, id_level_wilayah: true, mst_kode_wilayah: true },
                });
                if (!wil)
                    break;
                switch (wil.id_level_wilayah) {
                    case 4:
                        result.desa = wil.nama;
                        break;
                    case 3:
                        result.kecamatan = wil.nama;
                        break;
                    case 2:
                        result.kabupaten = wil.nama;
                        break;
                    case 1:
                        result.provinsi = wil.nama;
                        break;
                    case 0:
                        result.negara = wil.nama;
                        break;
                }
                currentKode = wil.mst_kode_wilayah?.trim() || null;
                maxDepth--;
            }
        }
        catch (e) {
        }
        return result;
    }
    async getSemestersForMandala() {
        const semesters = await this.prisma.semester.findMany({
            where: { periode_aktif: 1 },
            orderBy: { semester_id: 'desc' },
        });
        return semesters.map((s) => {
            const nama = s.nama ? s.nama.trim() : '';
            const parts = nama.split(' ');
            const tahun_ajaran = parts[0] || '';
            const semester_nama = parts.slice(1).join(' ') || '';
            return {
                semester_id: s.semester_id,
                nama: s.nama,
                tahun_ajaran: tahun_ajaran,
                semester: semester_nama,
                periode_aktif: Number(s.periode_aktif) === 1,
            };
        });
    }
    async getMenuRoles() {
        return this.prisma.mandalaMenuRole.findMany({
            include: {
                jenis_jabatan: true,
            },
        });
    }
    async updateMenuRoles(roles) {
        await this.prisma.mandalaMenuRole.deleteMany();
        const createdRoles = [];
        for (const role of roles) {
            const created = await this.prisma.mandalaMenuRole.create({
                data: {
                    menu_key: role.menu_key,
                    jabatan_id: role.jabatan_id !== undefined && role.jabatan_id !== null ? role.jabatan_id : null,
                    jabatan_nama: role.jabatan_nama || null,
                    jenis_jabatan_id: role.jenis_jabatan_id !== undefined && role.jenis_jabatan_id !== null ? role.jenis_jabatan_id : null,
                },
            });
            createdRoles.push(created);
        }
        return createdRoles;
    }
    async getSekolahBinaan(pegawaiId, cadisdikId) {
        return await this.prisma.sekolah.findMany({
            where: {
                cadisdik_id: cadisdikId,
                mapping_pengawas: {
                    some: {
                        pegawai_id: pegawaiId,
                    },
                },
            },
            select: {
                sekolah_id: true,
                nama: true,
                npsn: true,
            },
        });
    }
    async getJadwalMonitoring(cadisdikId, query) {
        const where = {
            cadisdik_id: cadisdikId,
        };
        if (query.pegawai_id) {
            where.pegawai_id = query.pegawai_id;
        }
        if (query.sekolah_id) {
            where.sekolah_id = query.sekolah_id;
        }
        if (query.start_date || query.end_date) {
            if (query.start_date && query.end_date) {
                where.AND = [
                    { tanggal_mulai: { gte: new Date(query.start_date) } },
                    { tanggal_selesai: { lte: new Date(query.end_date) } }
                ];
            }
            else if (query.start_date) {
                where.tanggal_mulai = { gte: new Date(query.start_date) };
            }
            else if (query.end_date) {
                where.tanggal_selesai = { lte: new Date(query.end_date) };
            }
        }
        const data = await this.prisma.jadwalMonitoring.findMany({
            where,
            include: {
                sekolah: {
                    select: {
                        nama: true,
                        npsn: true,
                    },
                },
                pegawai: {
                    select: {
                        nama_lengkap: true,
                        nip: true,
                    },
                },
            },
            orderBy: { tanggal_mulai: 'asc' },
        });
        return data.map(item => ({
            ...item,
            tanggal_mulai: item.tanggal_mulai.toISOString().split('T')[0],
            tanggal_selesai: item.tanggal_selesai.toISOString().split('T')[0],
        }));
    }
    async createJadwalMonitoring(cadisdikId, pegawaiId, body) {
        const created = await this.prisma.jadwalMonitoring.create({
            data: {
                cadisdik_id: cadisdikId,
                pegawai_id: pegawaiId,
                sekolah_id: body.sekolah_id,
                tanggal_mulai: new Date(body.tanggal_mulai),
                tanggal_selesai: new Date(body.tanggal_selesai),
                agenda: body.agenda,
                keterangan: body.keterangan || null,
                status: 'scheduled',
            },
        });
        return {
            ...created,
            tanggal_mulai: created.tanggal_mulai.toISOString().split('T')[0],
            tanggal_selesai: created.tanggal_selesai.toISOString().split('T')[0],
        };
    }
    async updateJadwalMonitoring(id, cadisdikId, user, body) {
        const existing = await this.prisma.jadwalMonitoring.findFirst({
            where: {
                jadwal_monitoring_id: id,
                cadisdik_id: cadisdikId,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Jadwal monitoring tidak ditemukan.');
        }
        const isPengawas = Number(user.jabatan) === 6;
        if (isPengawas && existing.pegawai_id !== user.sub) {
            throw new common_1.ForbiddenException('Anda tidak berhak mengubah jadwal ini.');
        }
        const updateData = {};
        if (body.sekolah_id !== undefined)
            updateData.sekolah_id = body.sekolah_id;
        if (body.tanggal_mulai !== undefined)
            updateData.tanggal_mulai = new Date(body.tanggal_mulai);
        if (body.tanggal_selesai !== undefined)
            updateData.tanggal_selesai = new Date(body.tanggal_selesai);
        if (body.agenda !== undefined)
            updateData.agenda = body.agenda;
        if (body.keterangan !== undefined)
            updateData.keterangan = body.keterangan;
        if (body.status !== undefined)
            updateData.status = body.status;
        return await this.prisma.jadwalMonitoring.update({
            where: { jadwal_monitoring_id: id },
            data: updateData,
        });
    }
    async deleteJadwalMonitoring(id, cadisdikId, user) {
        const existing = await this.prisma.jadwalMonitoring.findFirst({
            where: {
                jadwal_monitoring_id: id,
                cadisdik_id: cadisdikId,
            },
        });
        if (!existing) {
            throw new common_1.NotFoundException('Jadwal monitoring tidak ditemukan.');
        }
        const isPengawas = Number(user.jabatan) === 6;
        if (isPengawas && existing.pegawai_id !== user.sub) {
            throw new common_1.ForbiddenException('Anda tidak berhak menghapus jadwal ini.');
        }
        return await this.prisma.jadwalMonitoring.delete({
            where: { jadwal_monitoring_id: id },
        });
    }
};
exports.MandalaService = MandalaService;
exports.MandalaService = MandalaService = MandalaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService,
        crypto_service_1.CryptoService])
], MandalaService);
//# sourceMappingURL=mandala.service.js.map