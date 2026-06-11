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
exports.SyncController = void 0;
const common_1 = require("@nestjs/common");
const sync_service_1 = require("./sync.service");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
let SyncController = class SyncController {
    syncService;
    constructor(syncService) {
        this.syncService = syncService;
    }
    getSekolahId(req) {
        const appKey = req['appKey'];
        return appKey?.sekolah_id;
    }
    async validateSyncKey(body) {
        const result = await this.syncService.validateAndRegisterDomain(body.key, body.domain);
        return {
            status: 'success',
            message: 'Domain berhasil disinkronkan',
            data: result
        };
    }
    async syncSekolah(req, data) {
        const rows = Array.isArray(data) ? data : [data];
        let sekolahId = this.getSekolahId(req);
        const rawApiKey = req['rawApiKey'];
        if (!sekolahId && rows.length > 0) {
            sekolahId = rows[0].sekolah_id || rows[0].id || rows[0].npsn;
        }
        const result = await this.syncService.syncSekolah(sekolahId, rows, rawApiKey);
        return { status: 'success', count: result.successCount };
    }
    async syncRombel(req, data) {
        const sekolahId = this.getSekolahId(req);
        const rows = Array.isArray(data) ? data : [data];
        const result = await this.syncService.syncRombel(sekolahId, rows);
        return { status: 'success', count: result.successCount };
    }
    async syncPesertaDidik(req, data) {
        const sekolahId = this.getSekolahId(req);
        const rows = Array.isArray(data) ? data : [data];
        const result = await this.syncService.syncPesertaDidik(sekolahId, rows);
        return { status: 'success', count: result.successCount };
    }
    async syncGtk(req, data) {
        const sekolahId = this.getSekolahId(req);
        const rows = Array.isArray(data) ? data : [data];
        const result = await this.syncService.syncGtk(sekolahId, rows);
        return { status: 'success', count: result.successCount };
    }
    async syncPengguna(req, data) {
        const sekolahId = this.getSekolahId(req);
        const rows = Array.isArray(data) ? data : [data];
        const result = await this.syncService.syncPengguna(sekolahId, rows);
        return { status: 'success', count: result.successCount };
    }
    async syncSarpras(req, data) {
        const sekolahId = this.getSekolahId(req);
        const rows = Array.isArray(data) ? data : [data];
        const result = await this.syncService.syncSarpras(sekolahId, rows);
        return { status: 'success', count: result.successCount };
    }
    async syncBidangStudi(req, data) {
        const sekolahId = this.getSekolahId(req);
        const rows = Array.isArray(data) ? data : [data];
        const result = await this.syncService.syncBidangStudi(sekolahId, rows);
        return { status: 'success', count: result.successCount };
    }
    async syncLembSertifikasi(req, data) {
        const sekolahId = this.getSekolahId(req);
        const rows = Array.isArray(data) ? data : [data];
        const result = await this.syncService.syncLembSertifikasi(sekolahId, rows);
        return { status: 'success', count: result.successCount };
    }
    async syncRwySertifikat(req, data) {
        const sekolahId = this.getSekolahId(req);
        const rows = Array.isArray(data) ? data : [data];
        const result = await this.syncService.syncRwySertifikat(sekolahId, rows);
        return { status: 'success', count: result.successCount };
    }
};
exports.SyncController = SyncController;
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "validateSyncKey", null);
__decorate([
    (0, common_1.Post)('sekolah'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncSekolah", null);
__decorate([
    (0, common_1.Post)('rombel'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncRombel", null);
__decorate([
    (0, common_1.Post)(['siswa', 'pesertadidik']),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncPesertaDidik", null);
__decorate([
    (0, common_1.Post)('gtk'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncGtk", null);
__decorate([
    (0, common_1.Post)('pengguna'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncPengguna", null);
__decorate([
    (0, common_1.Post)('sarpras'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncSarpras", null);
__decorate([
    (0, common_1.Post)('bidang_studi'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncBidangStudi", null);
__decorate([
    (0, common_1.Post)('lemb_sertifikasi'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncLembSertifikasi", null);
__decorate([
    (0, common_1.Post)('rwy_sertifikat'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], SyncController.prototype, "syncRwySertifikat", null);
exports.SyncController = SyncController = __decorate([
    (0, common_1.Controller)('sync'),
    __metadata("design:paramtypes", [sync_service_1.SyncService])
], SyncController);
//# sourceMappingURL=sync.controller.js.map