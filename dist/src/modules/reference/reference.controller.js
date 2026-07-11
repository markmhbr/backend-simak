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
exports.ReferenceController = void 0;
const common_1 = require("@nestjs/common");
const reference_service_1 = require("./reference.service");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
let ReferenceController = class ReferenceController {
    referenceService;
    constructor(referenceService) {
        this.referenceService = referenceService;
    }
    async getOptions() {
        const data = await this.referenceService.getAllOptions();
        return {
            status: 'success',
            data,
        };
    }
    async getAgama() {
        return {
            status: 'success',
            data: await this.referenceService.getAgama(),
        };
    }
    async getBank(search) {
        return {
            status: 'success',
            data: await this.referenceService.getBank(search),
        };
    }
    async getJabatanPtk() {
        return {
            status: 'success',
            data: await this.referenceService.getJabatanPtk(),
        };
    }
    async getJenisPtk() {
        return {
            status: 'success',
            data: await this.referenceService.getJenisPtk(),
        };
    }
    async getKeahlianLaboratorium() {
        return {
            status: 'success',
            data: await this.referenceService.getKeahlianLaboratorium(),
        };
    }
    async getMstWilayah(search, limit) {
        const limitNum = limit ? parseInt(limit, 10) : 50;
        return {
            status: 'success',
            data: await this.referenceService.getMstWilayah(search, limitNum),
        };
    }
    async getWilayah(level, parentCode) {
        const levelNum = parseInt(level, 10) || 1;
        return {
            status: 'success',
            data: await this.referenceService.getWilayahByParent(levelNum, parentCode),
        };
    }
    async getLembagaPengangkat() {
        return {
            status: 'success',
            data: await this.referenceService.getLembagaPengangkat(),
        };
    }
    async getPangkatGolongan() {
        return {
            status: 'success',
            data: await this.referenceService.getPangkatGolongan(),
        };
    }
    async getStatusKepegawaian() {
        return {
            status: 'success',
            data: await this.referenceService.getStatusKepegawaian(),
        };
    }
    async getSumberGaji() {
        return {
            status: 'success',
            data: await this.referenceService.getSumberGaji(),
        };
    }
    async getAlatTransportasi() {
        return {
            status: 'success',
            data: await this.referenceService.getAlatTransportasi(),
        };
    }
    async getJenisCita() {
        return {
            status: 'success',
            data: await this.referenceService.getJenisCita(),
        };
    }
    async getJenisHobby() {
        return {
            status: 'success',
            data: await this.referenceService.getJenisHobby(),
        };
    }
    async getAlasanLayakPip() {
        return {
            status: 'success',
            data: await this.referenceService.getAlasanLayakPip(),
        };
    }
    async getJenisPendaftaran() {
        return {
            status: 'success',
            data: await this.referenceService.getJenisPendaftaran(),
        };
    }
    async getJenisTinggal() {
        return {
            status: 'success',
            data: await this.referenceService.getJenisTinggal(),
        };
    }
    async getJenisKeluar() {
        return {
            status: 'success',
            data: await this.referenceService.getJenisKeluar(),
        };
    }
    async getKebutuhanKhusus() {
        return {
            status: 'success',
            data: await this.referenceService.getKebutuhanKhusus(),
        };
    }
    async getPekerjaan() {
        return {
            status: 'success',
            data: await this.referenceService.getPekerjaan(),
        };
    }
    async getJenjangPendidikan() {
        return {
            status: 'success',
            data: await this.referenceService.getJenjangPendidikan(),
        };
    }
    async getPenghasilan() {
        return {
            status: 'success',
            data: await this.referenceService.getPenghasilan(),
        };
    }
};
exports.ReferenceController = ReferenceController;
__decorate([
    (0, common_1.Get)('options'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getOptions", null);
__decorate([
    (0, common_1.Get)('agama'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getAgama", null);
__decorate([
    (0, common_1.Get)('bank'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getBank", null);
__decorate([
    (0, common_1.Get)('jabatan-ptk'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getJabatanPtk", null);
__decorate([
    (0, common_1.Get)('jenis-ptk'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getJenisPtk", null);
__decorate([
    (0, common_1.Get)('keahlian-laboratorium'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getKeahlianLaboratorium", null);
__decorate([
    (0, common_1.Get)('mst-wilayah'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getMstWilayah", null);
__decorate([
    (0, common_1.Get)('wilayah'),
    __param(0, (0, common_1.Query)('level')),
    __param(1, (0, common_1.Query)('parentCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getWilayah", null);
__decorate([
    (0, common_1.Get)('lembaga-pengangkat'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getLembagaPengangkat", null);
__decorate([
    (0, common_1.Get)('pangkat-golongan'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getPangkatGolongan", null);
__decorate([
    (0, common_1.Get)('status-kepegawaian'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getStatusKepegawaian", null);
__decorate([
    (0, common_1.Get)('sumber-gaji'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getSumberGaji", null);
__decorate([
    (0, common_1.Get)('alat-transportasi'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getAlatTransportasi", null);
__decorate([
    (0, common_1.Get)('jenis-cita'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getJenisCita", null);
__decorate([
    (0, common_1.Get)('jenis-hobby'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getJenisHobby", null);
__decorate([
    (0, common_1.Get)('alasan-layak-pip'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getAlasanLayakPip", null);
__decorate([
    (0, common_1.Get)('jenis-pendaftaran'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getJenisPendaftaran", null);
__decorate([
    (0, common_1.Get)('jenis-tinggal'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getJenisTinggal", null);
__decorate([
    (0, common_1.Get)('jenis-keluar'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getJenisKeluar", null);
__decorate([
    (0, common_1.Get)('kebutuhan-khusus'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getKebutuhanKhusus", null);
__decorate([
    (0, common_1.Get)('pekerjaan'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getPekerjaan", null);
__decorate([
    (0, common_1.Get)('jenjang-pendidikan'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getJenjangPendidikan", null);
__decorate([
    (0, common_1.Get)('penghasilan'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReferenceController.prototype, "getPenghasilan", null);
exports.ReferenceController = ReferenceController = __decorate([
    (0, common_1.Controller)('reference'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [reference_service_1.ReferenceService])
], ReferenceController);
//# sourceMappingURL=reference.controller.js.map