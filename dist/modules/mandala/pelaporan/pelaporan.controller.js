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
exports.PelaporanController = void 0;
const common_1 = require("@nestjs/common");
const pelaporan_service_1 = require("./pelaporan.service");
const mandala_key_guard_1 = require("../../../core/mandala/mandala-key.guard");
const create_pelaporan_dto_1 = require("./dto/create-pelaporan.dto");
let PelaporanController = class PelaporanController {
    pelaporanService;
    constructor(pelaporanService) {
        this.pelaporanService = pelaporanService;
    }
    getCadisdikId(req) {
        const cadisdikId = req['user']?.cadisdik_id || req.body?.cadisdik_id || req.query?.cadisdik_id;
        if (!cadisdikId) {
            throw new common_1.BadRequestException('cadisdik_id is required. Please provide it in the body/query or ensure you are logged in correctly.');
        }
        return cadisdikId;
    }
    async createPelaporan(req, dto) {
        const cadisdikId = this.getCadisdikId(req);
        const data = await this.pelaporanService.createPelaporan(cadisdikId, dto);
        return {
            status: 'success',
            message: 'Pelaporan berhasil dibuat',
            data,
        };
    }
    async getListPelaporan(req, page = '1', limit = '10') {
        const cadisdikId = this.getCadisdikId(req);
        const data = await this.pelaporanService.getListPelaporan(cadisdikId, parseInt(page, 10), parseInt(limit, 10));
        return {
            status: 'success',
            ...data,
        };
    }
    async getDetailPelaporan(req, id) {
        const cadisdikId = this.getCadisdikId(req);
        const data = await this.pelaporanService.getDetailPelaporan(cadisdikId, id);
        return {
            status: 'success',
            data,
        };
    }
    async getDokumenSekolah(req, id, sekolahId) {
        const cadisdikId = this.getCadisdikId(req);
        const data = await this.pelaporanService.getDokumenSekolah(cadisdikId, id, sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async previewPelaporan(req, res, id, sekolahId) {
        const cadisdikId = this.getCadisdikId(req);
        const html = await this.pelaporanService.renderPelaporanHtml(cadisdikId, id, sekolahId);
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
    }
    async exportPelaporan(req, res, id) {
        const cadisdikId = this.getCadisdikId(req);
        const buffer = await this.pelaporanService.exportAllSekolahExcel(cadisdikId, id);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=rekap_laporan_${id}.xlsx`);
        return res.send(buffer);
    }
    async updatePelaporan(req, id, dto) {
        const cadisdikId = this.getCadisdikId(req);
        const data = await this.pelaporanService.updatePelaporan(cadisdikId, id, dto);
        return {
            status: 'success',
            message: 'Pelaporan berhasil diperbarui',
            data,
        };
    }
    async deletePelaporan(req, id) {
        const cadisdikId = this.getCadisdikId(req);
        await this.pelaporanService.deletePelaporan(cadisdikId, id);
        return {
            status: 'success',
            message: 'Pelaporan berhasil dihapus',
        };
    }
};
exports.PelaporanController = PelaporanController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_pelaporan_dto_1.CreatePelaporanDto]),
    __metadata("design:returntype", Promise)
], PelaporanController.prototype, "createPelaporan", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PelaporanController.prototype, "getListPelaporan", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PelaporanController.prototype, "getDetailPelaporan", null);
__decorate([
    (0, common_1.Get)(':id/sekolah/:sekolahId'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('sekolahId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], PelaporanController.prototype, "getDokumenSekolah", null);
__decorate([
    (0, common_1.Get)(':id/sekolah/:sekolahId/preview'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Param)('sekolahId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], PelaporanController.prototype, "previewPelaporan", null);
__decorate([
    (0, common_1.Get)(':id/export'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], PelaporanController.prototype, "exportPelaporan", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_pelaporan_dto_1.CreatePelaporanDto]),
    __metadata("design:returntype", Promise)
], PelaporanController.prototype, "updatePelaporan", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PelaporanController.prototype, "deletePelaporan", null);
exports.PelaporanController = PelaporanController = __decorate([
    (0, common_1.Controller)('mandala/pelaporan'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __metadata("design:paramtypes", [pelaporan_service_1.PelaporanService])
], PelaporanController);
//# sourceMappingURL=pelaporan.controller.js.map