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
exports.MandalaController = void 0;
const common_1 = require("@nestjs/common");
const mandala_service_1 = require("./mandala.service");
const mandala_key_guard_1 = require("../../core/mandala/mandala-key.guard");
let MandalaController = class MandalaController {
    mandalaService;
    constructor(mandalaService) {
        this.mandalaService = mandalaService;
    }
    async getConnection() {
        const config = await this.mandalaService.getConnection();
        if (!config) {
            throw new common_1.NotFoundException('Mandala connection is not configured yet.');
        }
        return {
            status: 'success',
            data: config,
        };
    }
    async updateConnection(body) {
        if (!body.key || !body.url_mandala) {
            return {
                status: 'error',
                message: 'Both key and url_mandala are required.',
            };
        }
        const result = await this.mandalaService.saveOrUpdateConnection(body.key, body.url_mandala);
        return {
            status: 'success',
            message: 'Mandala connection successfully updated.',
            data: result,
        };
    }
    async getSchools() {
        const data = await this.mandalaService.getSchools();
        return {
            status: 'success',
            data,
        };
    }
    async getSchoolDetail(id) {
        const data = await this.mandalaService.getSchoolDetail(id);
        if (!data) {
            throw new common_1.NotFoundException(`School with ID ${id} not found.`);
        }
        return {
            status: 'success',
            data,
        };
    }
    async getSchoolSummary(id) {
        const data = await this.mandalaService.getSchoolSummary(id);
        if (!data) {
            throw new common_1.NotFoundException(`School with ID ${id} not found.`);
        }
        return {
            status: 'success',
            data,
        };
    }
    async getPesertaDidik(sekolahId, limit, page, search, status) {
        let take = limit ? parseInt(limit, 10) : 10;
        if (take > 100) {
            take = 100;
        }
        const skipPage = page ? parseInt(page, 10) : 1;
        return await this.mandalaService.getPesertaDidikForMandala(sekolahId, {
            limit: take,
            page: skipPage,
            search,
            status
        });
    }
    async getGtk(sekolahId, limit, page, search, status, type) {
        let take = limit ? parseInt(limit, 10) : 10;
        if (take > 100) {
            take = 100;
        }
        const skipPage = page ? parseInt(page, 10) : 1;
        return await this.mandalaService.getGtkForMandala(sekolahId, {
            limit: take,
            page: skipPage,
            search,
            status,
            type
        });
    }
};
exports.MandalaController = MandalaController;
__decorate([
    (0, common_1.Get)('connection'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getConnection", null);
__decorate([
    (0, common_1.Post)('connection'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "updateConnection", null);
__decorate([
    (0, common_1.Get)('sekolah'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getSchools", null);
__decorate([
    (0, common_1.Get)('sekolah/:id'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getSchoolDetail", null);
__decorate([
    (0, common_1.Get)('sekolah/:id/summary'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getSchoolSummary", null);
__decorate([
    (0, common_1.Get)('dapodik/peserta-didik'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getPesertaDidik", null);
__decorate([
    (0, common_1.Get)('dapodik/gtk'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __param(0, (0, common_1.Query)('sekolah_id')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], MandalaController.prototype, "getGtk", null);
exports.MandalaController = MandalaController = __decorate([
    (0, common_1.Controller)('mandala'),
    __metadata("design:paramtypes", [mandala_service_1.MandalaService])
], MandalaController);
//# sourceMappingURL=mandala.controller.js.map