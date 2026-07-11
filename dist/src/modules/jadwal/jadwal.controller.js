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
exports.JadwalController = void 0;
const common_1 = require("@nestjs/common");
const jadwal_service_1 = require("./jadwal.service");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
let JadwalController = class JadwalController {
    jadwalService;
    constructor(jadwalService) {
        this.jadwalService = jadwalService;
    }
    getSekolahInfo(req) {
        const appKey = req['appKey'];
        return {
            sekolahId: appKey.sekolah_id,
            namaApp: appKey.nama_app,
        };
    }
    async getJenisJadwal(req) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.getJenisJadwal(sekolahId);
        return { status: 'success', klien: namaApp, data };
    }
    async createJenisJadwal(req, body) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.createJenisJadwal(sekolahId, body);
        return { status: 'success', klien: namaApp, data };
    }
    async updateJenisJadwal(req, id, body) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.updateJenisJadwal(sekolahId, id, body);
        return { status: 'success', klien: namaApp, data };
    }
    async deleteJenisJadwal(req, id) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.deleteJenisJadwal(sekolahId, id);
        return { status: 'success', klien: namaApp, data };
    }
    async toggleJenisJadwal(req, id, body) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.toggleJenisJadwal(sekolahId, id, body.aktif);
        return { status: 'success', klien: namaApp, data };
    }
    async updatePengaturanHari(req, body) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.updatePengaturanHari(sekolahId, body);
        return { status: 'success', klien: namaApp, data };
    }
    async getPengaturanJadwal(req, jenisJadwalId, hari) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const hariNum = hari ? parseInt(hari, 10) : undefined;
        const data = await this.jadwalService.getPengaturanJadwal(sekolahId, jenisJadwalId, hariNum);
        return { status: 'success', klien: namaApp, data };
    }
    async upsertPengaturanJadwal(req, body) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.upsertPengaturanJadwal(sekolahId, body);
        return { status: 'success', klien: namaApp, data };
    }
    async deletePengaturanJadwal(req, id) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.deletePengaturanJadwal(sekolahId, id);
        return { status: 'success', klien: namaApp, data };
    }
    async getJadwalPelajaran(req, jenisJadwalId, rombelId) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.getJadwalPelajaran(sekolahId, jenisJadwalId, rombelId);
        return { status: 'success', klien: namaApp, data };
    }
    async upsertJadwalPelajaran(req, body) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.upsertJadwalPelajaran(sekolahId, body);
        return { status: 'success', klien: namaApp, data };
    }
    async deleteJadwalPelajaran(req, id) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.jadwalService.deleteJadwalPelajaran(sekolahId, id);
        return { status: 'success', klien: namaApp, data };
    }
};
exports.JadwalController = JadwalController;
__decorate([
    (0, common_1.Get)('jenis-jadwal'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "getJenisJadwal", null);
__decorate([
    (0, common_1.Post)('jenis-jadwal'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "createJenisJadwal", null);
__decorate([
    (0, common_1.Patch)('jenis-jadwal/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "updateJenisJadwal", null);
__decorate([
    (0, common_1.Delete)('jenis-jadwal/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "deleteJenisJadwal", null);
__decorate([
    (0, common_1.Patch)('jenis-jadwal/:id/toggle'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "toggleJenisJadwal", null);
__decorate([
    (0, common_1.Patch)('pengaturan-hari'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "updatePengaturanHari", null);
__decorate([
    (0, common_1.Get)('pengaturan-jadwal'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('jenisJadwalId')),
    __param(2, (0, common_1.Query)('hari')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "getPengaturanJadwal", null);
__decorate([
    (0, common_1.Post)('pengaturan-jadwal'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "upsertPengaturanJadwal", null);
__decorate([
    (0, common_1.Delete)('pengaturan-jadwal/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "deletePengaturanJadwal", null);
__decorate([
    (0, common_1.Get)('jadwal-pelajaran'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('jenisJadwalId')),
    __param(2, (0, common_1.Query)('rombelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "getJadwalPelajaran", null);
__decorate([
    (0, common_1.Post)('jadwal-pelajaran'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "upsertJadwalPelajaran", null);
__decorate([
    (0, common_1.Delete)('jadwal-pelajaran/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], JadwalController.prototype, "deleteJadwalPelajaran", null);
exports.JadwalController = JadwalController = __decorate([
    (0, common_1.Controller)('jadwal'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [jadwal_service_1.JadwalService])
], JadwalController);
//# sourceMappingURL=jadwal.controller.js.map