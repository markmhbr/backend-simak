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
exports.AppKeyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let AppKeyService = class AppKeyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateSecureToken(prefix) {
        const randomBuffer = crypto.randomBytes(24);
        const token = randomBuffer.toString('hex');
        return `simak_${prefix}_${token}`;
    }
    async validateApiKey(keyApi) {
        if (!keyApi)
            return null;
        const appKey = await this.prisma.appKey.findFirst({
            where: {
                OR: [
                    { key_api: keyApi },
                    { key_webService: keyApi },
                ],
            },
        });
        if (appKey && appKey.is_active) {
            return appKey;
        }
        return null;
    }
    async createKey(namaApp, sekolahId) {
        const existing = await this.prisma.appKey.findUnique({
            where: { sekolah_id: sekolahId },
        });
        if (existing) {
            throw new Error(`Sekolah ID ${sekolahId} sudah terdaftar atas nama: "${existing.nama_app}". Satu sekolah hanya boleh memiliki satu Key!`);
        }
        const keyApi = this.generateSecureToken('api');
        return await this.prisma.appKey.create({
            data: {
                nama_app: namaApp,
                sekolah_id: sekolahId,
                key_api: keyApi,
                key_webService: null,
                key_adminPanel: null,
                is_active: true,
            },
        });
    }
    async updateWebServiceKey(sekolahId, keyWs) {
        return await this.prisma.appKey.update({
            where: { sekolah_id: sekolahId },
            data: { key_webService: keyWs },
        });
    }
    async updateAdminPanelKey(sekolahId, keyAdm) {
        return await this.prisma.appKey.update({
            where: { sekolah_id: sekolahId },
            data: { key_adminPanel: keyAdm },
        });
    }
    async getAllKeys() {
        return await this.prisma.appKey.findMany({
            orderBy: { created_at: 'desc' },
        });
    }
    async regenerateKeys(id) {
        const existing = await this.prisma.appKey.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`AppKey dengan ID ${id} tidak ditemukan`);
        }
        const keyApi = this.generateSecureToken('api');
        return await this.prisma.appKey.update({
            where: { id },
            data: {
                key_api: keyApi,
            },
        });
    }
    async toggleActive(id) {
        const existing = await this.prisma.appKey.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`AppKey dengan ID ${id} tidak ditemukan`);
        }
        return await this.prisma.appKey.update({
            where: { id },
            data: {
                is_active: !existing.is_active,
            },
        });
    }
};
exports.AppKeyService = AppKeyService;
exports.AppKeyService = AppKeyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AppKeyService);
//# sourceMappingURL=app-key.service.js.map