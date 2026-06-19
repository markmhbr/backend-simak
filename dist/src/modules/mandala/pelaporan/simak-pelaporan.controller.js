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
exports.SimakPelaporanController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const pelaporan_service_1 = require("./pelaporan.service");
const api_key_guard_1 = require("../../../core/app-key/api-key.guard");
let SimakPelaporanController = class SimakPelaporanController {
    pelaporanService;
    constructor(pelaporanService) {
        this.pelaporanService = pelaporanService;
    }
    getSekolahInfo(req) {
        const appKey = req['appKey'];
        if (!appKey || !appKey.sekolah_id) {
            throw new common_1.BadRequestException('Akses ditolak: sekolah_id tidak ditemukan pada API Key');
        }
        return appKey.sekolah_id;
    }
    async getSimakListPelaporan(req, page = '1', limit = '10') {
        const sekolahId = this.getSekolahInfo(req);
        const data = await this.pelaporanService.getSimakListPelaporan(sekolahId, parseInt(page, 10), parseInt(limit, 10));
        return {
            status: 'success',
            ...data,
        };
    }
    async getSimakDetailPelaporan(req, id) {
        const sekolahId = this.getSekolahInfo(req);
        const data = await this.pelaporanService.getSimakDetailPelaporan(sekolahId, id);
        return {
            status: 'success',
            data,
        };
    }
    async uploadDokumen(req, id, files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Tidak ada file yang diunggah');
        }
        const sekolahId = this.getSekolahInfo(req);
        const data = await this.pelaporanService.uploadDokumenSimak(sekolahId, id, files);
        return {
            status: 'success',
            message: 'Dokumen berhasil diunggah',
            data,
        };
    }
};
exports.SimakPelaporanController = SimakPelaporanController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SimakPelaporanController.prototype, "getSimakListPelaporan", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SimakPelaporanController.prototype, "getSimakDetailPelaporan", null);
__decorate([
    (0, common_1.Post)(':id/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        limits: { fileSize: 10 * 1024 * 1024 }
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Array]),
    __metadata("design:returntype", Promise)
], SimakPelaporanController.prototype, "uploadDokumen", null);
exports.SimakPelaporanController = SimakPelaporanController = __decorate([
    (0, common_1.Controller)('simak/pelaporan'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [pelaporan_service_1.PelaporanService])
], SimakPelaporanController);
//# sourceMappingURL=simak-pelaporan.controller.js.map