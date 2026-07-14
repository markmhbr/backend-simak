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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutasiPdService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let MutasiPdService = class MutasiPdService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getReferenceJenisKeluar() {
        return this.prisma.jenis_keluar.findMany({
            where: {
                keluar_pd: 1,
            },
            select: {
                jenis_keluar_id: true,
                ket_keluar: true,
            },
        });
    }
    async getMutasiPdList(sekolahId) {
        return this.prisma.mutasiPd.findMany({
            where: { sekolah_id: sekolahId },
            include: {
                peserta_didik: {
                    select: {
                        nama: true,
                        nisn: true,
                        foto: true,
                        rombongan_belajar: {
                            select: {
                                nama: true,
                            },
                        },
                    },
                },
                jenis_keluar: {
                    select: {
                        ket_keluar: true,
                    },
                },
                ptk: {
                    select: {
                        nama: true,
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });
    }
    async createMutasiPd(sekolahId, data, ptkId, file) {
        const { saveDocument } = require('../../common/utils/upload.util');
        const student = await this.prisma.pesertaDidik.findFirst({
            where: { peserta_didik_id: data.peserta_didik_id, sekolah_id: sekolahId },
        });
        if (!student) {
            throw new common_1.NotFoundException('Siswa tidak ditemukan atau tidak terdaftar di sekolah Anda.');
        }
        const jnsKeluar = await this.prisma.jenis_keluar.findUnique({
            where: { jenis_keluar_id: data.jenis_keluar_id },
        });
        if (!jnsKeluar) {
            throw new common_1.BadRequestException('Jenis keluar tidak valid.');
        }
        let fileUrl = null;
        if (file) {
            const fileExt = path.extname(file.originalname).toLowerCase();
            if (fileExt !== '.pdf') {
                throw new common_1.BadRequestException('Format dokumen bukti harus berupa PDF (.pdf).');
            }
            const destDir = path.join(process.cwd(), 'storage', sekolahId, 'siswa', data.peserta_didik_id, 'mutasi');
            const finalFileName = `bukti_mutasi_${Date.now()}.pdf`;
            if (!fs.existsSync(destDir)) {
                fs.mkdirSync(destDir, { recursive: true });
            }
            const savedPath = saveDocument(file.buffer, destDir, finalFileName, 200 * 1024);
            const savedFileName = path.basename(savedPath);
            fileUrl = `/storage/${sekolahId}/siswa/${data.peserta_didik_id}/mutasi/${savedFileName}`;
        }
        return this.prisma.mutasiPd.create({
            data: {
                sekolah_id: sekolahId,
                peserta_didik_id: data.peserta_didik_id,
                jenis_keluar_id: data.jenis_keluar_id,
                ptk_id: ptkId,
                alasan: data.alasan || null,
                bukti: fileUrl,
                status: 0,
            },
        });
    }
    async approveMutasiPd(sekolahId, mutasiId) {
        const mutasi = await this.prisma.mutasiPd.findFirst({
            where: { mutasi_id: mutasiId, sekolah_id: sekolahId },
            include: { jenis_keluar: true },
        });
        if (!mutasi) {
            throw new common_1.NotFoundException('Pengajuan mutasi tidak ditemukan.');
        }
        if (mutasi.status !== 0) {
            throw new common_1.BadRequestException('Pengajuan mutasi sudah diproses sebelumnya.');
        }
        const updatedMutasi = await this.prisma.mutasiPd.update({
            where: { mutasi_id: mutasiId },
            data: { status: 1 },
        });
        return updatedMutasi;
    }
    async rejectMutasiPd(sekolahId, mutasiId, alasanTolak) {
        if (!alasanTolak) {
            throw new common_1.BadRequestException('Alasan penolakan wajib disertakan.');
        }
        const mutasi = await this.prisma.mutasiPd.findFirst({
            where: { mutasi_id: mutasiId, sekolah_id: sekolahId },
        });
        if (!mutasi) {
            throw new common_1.NotFoundException('Pengajuan mutasi tidak ditemukan.');
        }
        if (mutasi.status !== 0) {
            throw new common_1.BadRequestException('Pengajuan mutasi sudah diproses sebelumnya.');
        }
        return this.prisma.mutasiPd.update({
            where: { mutasi_id: mutasiId },
            data: {
                status: 2,
                alasan_tolak: alasanTolak,
            },
        });
    }
};
exports.MutasiPdService = MutasiPdService;
exports.MutasiPdService = MutasiPdService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MutasiPdService);
//# sourceMappingURL=mutasi-pd.service.js.map