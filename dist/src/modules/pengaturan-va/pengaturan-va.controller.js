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
exports.PengaturanVaController = void 0;
const common_1 = require("@nestjs/common");
const pengaturan_va_service_1 = require("./pengaturan-va.service");
const update_pengaturan_va_dto_1 = require("./dto/update-pengaturan-va.dto");
let PengaturanVaController = class PengaturanVaController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getSettings(sekolahId) {
        const data = await this.service.getSettings(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async updateSettings(sekolahId, body) {
        const data = await this.service.updateSettings(sekolahId, body);
        return {
            status: 'success',
            message: 'Konfigurasi BJB Virtual Account berhasil disimpan.',
            data,
        };
    }
};
exports.PengaturanVaController = PengaturanVaController;
__decorate([
    (0, common_1.Get)(':sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PengaturanVaController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)(':sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pengaturan_va_dto_1.UpdatePengaturanVaDto]),
    __metadata("design:returntype", Promise)
], PengaturanVaController.prototype, "updateSettings", null);
exports.PengaturanVaController = PengaturanVaController = __decorate([
    (0, common_1.Controller)('pengaturan-va'),
    __metadata("design:paramtypes", [pengaturan_va_service_1.PengaturanVaService])
], PengaturanVaController);
//# sourceMappingURL=pengaturan-va.controller.js.map