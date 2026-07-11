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
exports.IndisiplinerController = void 0;
const common_1 = require("@nestjs/common");
const indisipliner_service_1 = require("./indisipliner.service");
const create_jenis_pelanggaran_dto_1 = require("./dto/create-jenis-pelanggaran.dto");
const create_jenis_tindak_lanjut_dto_1 = require("./dto/create-jenis-tindak-lanjut.dto");
const create_pelanggaran_dto_1 = require("./dto/create-pelanggaran.dto");
const create_tindak_lanjut_dto_1 = require("./dto/create-tindak-lanjut.dto");
let IndisiplinerController = class IndisiplinerController {
    indisiplinerService;
    constructor(indisiplinerService) {
        this.indisiplinerService = indisiplinerService;
    }
    async getJenisPelanggaran(sekolahId) {
        if (!sekolahId) {
            throw new common_1.BadRequestException('sekolah_id query parameter is required.');
        }
        const data = await this.indisiplinerService.getJenisPelanggaran(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async createJenisPelanggaran(dto) {
        const data = await this.indisiplinerService.createJenisPelanggaran(dto);
        return {
            status: 'success',
            message: 'Jenis pelanggaran berhasil dibuat.',
            data,
        };
    }
    async getJenisTindakLanjut(sekolahId) {
        if (!sekolahId) {
            throw new common_1.BadRequestException('sekolah_id query parameter is required.');
        }
        const data = await this.indisiplinerService.getJenisTindakLanjut(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async createJenisTindakLanjut(dto) {
        const data = await this.indisiplinerService.createJenisTindakLanjut(dto);
        return {
            status: 'success',
            message: 'Jenis tindak lanjut berhasil dibuat.',
            data,
        };
    }
    async getPelanggaran(sekolahId, pesertaDidikId, ptkId, status) {
        if (!sekolahId) {
            throw new common_1.BadRequestException('sekolah_id query parameter is required.');
        }
        const data = await this.indisiplinerService.getPelanggaran(sekolahId, {
            peserta_didik_id: pesertaDidikId,
            ptk_id: ptkId,
            status: status ? Number(status) : undefined,
        });
        return {
            status: 'success',
            data,
        };
    }
    async createPelanggaran(dto) {
        const data = await this.indisiplinerService.createPelanggaran(dto);
        return {
            status: 'success',
            message: 'Pelanggaran berhasil dicatat.',
            data,
        };
    }
    async updatePelanggaranStatus(id, status) {
        if (status === undefined || status === null) {
            throw new common_1.BadRequestException('status body field is required.');
        }
        const data = await this.indisiplinerService.updatePelanggaranStatus(id, status);
        return {
            status: 'success',
            message: 'Status pelanggaran berhasil diperbarui.',
            data,
        };
    }
    async createTindakLanjut(dto) {
        const data = await this.indisiplinerService.createTindakLanjut(dto);
        return {
            status: 'success',
            message: 'Tindak lanjut pelanggaran berhasil dicatat.',
            data,
        };
    }
    async getSchoolSummary(sekolahId) {
        const data = await this.indisiplinerService.getSchoolSummary(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
};
exports.IndisiplinerController = IndisiplinerController;
__decorate([
    (0, common_1.Get)('jenis-pelanggaran'),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IndisiplinerController.prototype, "getJenisPelanggaran", null);
__decorate([
    (0, common_1.Post)('jenis-pelanggaran'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_jenis_pelanggaran_dto_1.CreateJenisPelanggaranDto]),
    __metadata("design:returntype", Promise)
], IndisiplinerController.prototype, "createJenisPelanggaran", null);
__decorate([
    (0, common_1.Get)('jenis-tindak-lanjut'),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IndisiplinerController.prototype, "getJenisTindakLanjut", null);
__decorate([
    (0, common_1.Post)('jenis-tindak-lanjut'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_jenis_tindak_lanjut_dto_1.CreateJenisTindakLanjutDto]),
    __metadata("design:returntype", Promise)
], IndisiplinerController.prototype, "createJenisTindakLanjut", null);
__decorate([
    (0, common_1.Get)('pelanggaran'),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __param(1, (0, common_1.Query)('peserta_didik_id')),
    __param(2, (0, common_1.Query)('ptk_id')),
    __param(3, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number]),
    __metadata("design:returntype", Promise)
], IndisiplinerController.prototype, "getPelanggaran", null);
__decorate([
    (0, common_1.Post)('pelanggaran'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pelanggaran_dto_1.CreatePelanggaranDto]),
    __metadata("design:returntype", Promise)
], IndisiplinerController.prototype, "createPelanggaran", null);
__decorate([
    (0, common_1.Patch)('pelanggaran/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], IndisiplinerController.prototype, "updatePelanggaranStatus", null);
__decorate([
    (0, common_1.Post)('tindak-lanjut'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tindak_lanjut_dto_1.CreateTindakLanjutDto]),
    __metadata("design:returntype", Promise)
], IndisiplinerController.prototype, "createTindakLanjut", null);
__decorate([
    (0, common_1.Get)('rekap-sekolah/:sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IndisiplinerController.prototype, "getSchoolSummary", null);
exports.IndisiplinerController = IndisiplinerController = __decorate([
    (0, common_1.Controller)('indisipliner'),
    __metadata("design:paramtypes", [indisipliner_service_1.IndisiplinerService])
], IndisiplinerController);
//# sourceMappingURL=indisipliner.controller.js.map