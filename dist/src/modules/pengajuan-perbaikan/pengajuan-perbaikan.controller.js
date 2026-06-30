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
exports.PengajuanPerbaikanController = void 0;
const common_1 = require("@nestjs/common");
const pengajuan_perbaikan_service_1 = require("./pengajuan-perbaikan.service");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
let PengajuanPerbaikanController = class PengajuanPerbaikanController {
    service;
    constructor(service) {
        this.service = service;
    }
    getSekolahId(req) {
        if (req['isMandala']) {
            const querySekolahId = req.query.sekolah_id;
            if (!querySekolahId) {
                throw new common_1.BadRequestException('sekolah_id query parameter is required.');
            }
            return querySekolahId;
        }
        const appKey = req['appKey'];
        if (!appKey || !appKey.sekolah_id) {
            throw new common_1.BadRequestException('sekolah_id tidak terdeteksi dari API Key.');
        }
        return appKey.sekolah_id;
    }
    async buatPengajuan(req, body) {
        const sekolahId = this.getSekolahId(req);
        return this.service.buatPengajuan(sekolahId, body);
    }
    async dapatkanPerbaikanDisetujui(req) {
        const sekolahId = this.getSekolahId(req);
        return this.service.dapatkanPerbaikanDisetujui(sekolahId);
    }
    async clearPerbaikanDisetujui(req, body) {
        const sekolahId = this.getSekolahId(req);
        return this.service.clearPerbaikanDisetujui(sekolahId, body.ids);
    }
    async dapatkanDaftar(req) {
        const sekolahId = this.getSekolahId(req);
        return this.service.dapatkanDaftar(sekolahId);
    }
    async setujuiPengajuan(req, id) {
        const sekolahId = this.getSekolahId(req);
        return this.service.setujuiPengajuan(sekolahId, id);
    }
    async tolakPengajuan(req, id) {
        const sekolahId = this.getSekolahId(req);
        return this.service.tolakPengajuan(sekolahId, id);
    }
};
exports.PengajuanPerbaikanController = PengajuanPerbaikanController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PengajuanPerbaikanController.prototype, "buatPengajuan", null);
__decorate([
    (0, common_1.Get)('approved-updates'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PengajuanPerbaikanController.prototype, "dapatkanPerbaikanDisetujui", null);
__decorate([
    (0, common_1.Post)('approved-updates/clear'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PengajuanPerbaikanController.prototype, "clearPerbaikanDisetujui", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PengajuanPerbaikanController.prototype, "dapatkanDaftar", null);
__decorate([
    (0, common_1.Post)(':id/setujui'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PengajuanPerbaikanController.prototype, "setujuiPengajuan", null);
__decorate([
    (0, common_1.Post)(':id/tolak'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PengajuanPerbaikanController.prototype, "tolakPengajuan", null);
exports.PengajuanPerbaikanController = PengajuanPerbaikanController = __decorate([
    (0, common_1.Controller)('pengajuan-perbaikan'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [pengajuan_perbaikan_service_1.PengajuanPerbaikanService])
], PengajuanPerbaikanController);
//# sourceMappingURL=pengajuan-perbaikan.controller.js.map