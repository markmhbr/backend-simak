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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutasiPdController = void 0;
const common_1 = require("@nestjs/common");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
const platform_express_1 = require("@nestjs/platform-express");
const mutasi_pd_service_1 = require("./mutasi-pd.service");
let MutasiPdController = class MutasiPdController {
    mutasiService;
    constructor(mutasiService) {
        this.mutasiService = mutasiService;
    }
    getSekolahId(req) {
        const appKey = req['appKey'];
        const sekolahId = appKey?.sekolah_id;
        if (!sekolahId) {
            throw new common_1.BadRequestException('Sekolah ID tidak terdeteksi dari API Key.');
        }
        return sekolahId;
    }
    async getReference() {
        return this.mutasiService.getReferenceJenisKeluar();
    }
    async getList(req, paramSekolahId) {
        const sekolahId = this.getSekolahId(req);
        if (sekolahId !== paramSekolahId) {
            throw new common_1.BadRequestException('Akses ditolak. ID Sekolah tidak cocok.');
        }
        const data = await this.mutasiService.getMutasiPdList(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async create(req, data, file) {
        const sekolahId = this.getSekolahId(req);
        if (!data.peserta_didik_id || !data.jenis_keluar_id) {
            throw new common_1.BadRequestException('peserta_didik_id dan jenis_keluar_id wajib diisi.');
        }
        const user = req['user'];
        const ptkId = user?.ptkId || null;
        const res = await this.mutasiService.createMutasiPd(sekolahId, data, ptkId, file);
        return {
            status: 'success',
            message: 'Pengajuan mutasi berhasil dibuat.',
            data: res,
        };
    }
    async approve(req, id) {
        const sekolahId = this.getSekolahId(req);
        const res = await this.mutasiService.approveMutasiPd(sekolahId, id);
        return {
            status: 'success',
            message: 'Pengajuan mutasi berhasil disetujui.',
            data: res,
        };
    }
    async reject(req, id, body) {
        const sekolahId = this.getSekolahId(req);
        if (!body.alasan_tolak) {
            throw new common_1.BadRequestException('Alasan penolakan wajib disertakan.');
        }
        const res = await this.mutasiService.rejectMutasiPd(sekolahId, id, body.alasan_tolak);
        return {
            status: 'success',
            message: 'Pengajuan mutasi berhasil ditolak.',
            data: res,
        };
    }
};
exports.MutasiPdController = MutasiPdController;
__decorate([
    (0, common_1.Get)('reference'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MutasiPdController.prototype, "getReference", null);
__decorate([
    (0, common_1.Get)(':sekolahId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('sekolahId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MutasiPdController.prototype, "getList", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], MutasiPdController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MutasiPdController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], MutasiPdController.prototype, "reject", null);
exports.MutasiPdController = MutasiPdController = __decorate([
    (0, common_1.Controller)('kurikulum/mutasi-pd'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [mutasi_pd_service_1.MutasiPdService])
], MutasiPdController);
//# sourceMappingURL=mutasi-pd.controller.js.map