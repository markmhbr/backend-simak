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
exports.LayananMandalaController = void 0;
const common_1 = require("@nestjs/common");
const layanan_mandala_service_1 = require("./layanan-mandala.service");
const layanan_mandala_dto_1 = require("./dto/layanan-mandala.dto");
const mandala_key_guard_1 = require("../../core/mandala/mandala-key.guard");
let LayananMandalaController = class LayananMandalaController {
    layananMandalaService;
    constructor(layananMandalaService) {
        this.layananMandalaService = layananMandalaService;
    }
    async createLayanan(dto) {
        return {
            status: 'success',
            data: await this.layananMandalaService.createLayanan(dto),
        };
    }
    async getLayanan(kategori) {
        const cat = kategori !== undefined ? parseInt(kategori, 10) : undefined;
        return {
            status: 'success',
            data: await this.layananMandalaService.getLayanan(cat),
        };
    }
    async updateLayanan(id, dto) {
        return {
            status: 'success',
            data: await this.layananMandalaService.updateLayanan(id, dto),
        };
    }
    async createSyarat(layananId, dto) {
        return {
            status: 'success',
            data: await this.layananMandalaService.createSyarat(layananId, dto),
        };
    }
    async getSyarat(layananId) {
        return {
            status: 'success',
            data: await this.layananMandalaService.getSyaratByLayanan(layananId),
        };
    }
    async createPermohonan(dto) {
        return {
            status: 'success',
            message: 'Permohonan layanan berhasil diajukan',
            data: await this.layananMandalaService.createPermohonan(dto),
        };
    }
    async getPermohonan(sekolahId, status, kategori) {
        const filters = {
            sekolah_id: sekolahId,
            status: status !== undefined ? parseInt(status, 10) : undefined,
            kategori: kategori !== undefined ? parseInt(kategori, 10) : undefined,
        };
        return {
            status: 'success',
            data: await this.layananMandalaService.getPermohonan(filters),
        };
    }
    async getPermohonanById(id) {
        return {
            status: 'success',
            data: await this.layananMandalaService.getPermohonanById(id),
        };
    }
    async updateStatus(id, dto) {
        return {
            status: 'success',
            message: 'Status permohonan berhasil diperbarui',
            data: await this.layananMandalaService.updatePermohonanStatus(id, dto),
        };
    }
    async uploadFile(id, dto) {
        return {
            status: 'success',
            message: 'File berhasil diunggah',
            data: await this.layananMandalaService.uploadFile(id, dto),
        };
    }
    async updateFileStatus(fileId, body) {
        if (body.status === undefined)
            throw new common_1.BadRequestException('status is required');
        return {
            status: 'success',
            message: 'Status file berhasil diperbarui',
            data: await this.layananMandalaService.updateFileStatus(fileId, body.status, body.catatan),
        };
    }
};
exports.LayananMandalaController = LayananMandalaController;
__decorate([
    (0, common_1.Post)('master'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [layanan_mandala_dto_1.CreateLayananDto]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "createLayanan", null);
__decorate([
    (0, common_1.Get)('master'),
    __param(0, (0, common_1.Query)('kategori')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "getLayanan", null);
__decorate([
    (0, common_1.Patch)('master/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "updateLayanan", null);
__decorate([
    (0, common_1.Post)('master/:layananId/syarat'),
    __param(0, (0, common_1.Param)('layananId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, layanan_mandala_dto_1.CreateLayananSyaratDto]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "createSyarat", null);
__decorate([
    (0, common_1.Get)('master/:layananId/syarat'),
    __param(0, (0, common_1.Param)('layananId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "getSyarat", null);
__decorate([
    (0, common_1.Post)('permohonan'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [layanan_mandala_dto_1.CreatePermohonanLayananDto]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "createPermohonan", null);
__decorate([
    (0, common_1.Get)('permohonan'),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('kategori')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "getPermohonan", null);
__decorate([
    (0, common_1.Get)('permohonan/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "getPermohonanById", null);
__decorate([
    (0, common_1.Patch)('permohonan/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, layanan_mandala_dto_1.UpdatePermohonanStatusDto]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('permohonan/:id/file'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, layanan_mandala_dto_1.CreatePermohonanLayananFileDto]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Patch)('file/:fileId/status'),
    __param(0, (0, common_1.Param)('fileId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], LayananMandalaController.prototype, "updateFileStatus", null);
exports.LayananMandalaController = LayananMandalaController = __decorate([
    (0, common_1.Controller)('layanan-mandala'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __metadata("design:paramtypes", [layanan_mandala_service_1.LayananMandalaService])
], LayananMandalaController);
//# sourceMappingURL=layanan-mandala.controller.js.map