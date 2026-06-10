"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsensiController = void 0;
const common_1 = require("@nestjs/common");
const absensi_service_1 = require("./absensi.service");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
const express = __importStar(require("express"));
let AbsensiController = class AbsensiController {
    absensiService;
    constructor(absensiService) {
        this.absensiService = absensiService;
    }
    getConfig(req) {
        const appKey = req['appKey'];
        return this.absensiService.getAttendanceConfig(appKey.sekolah_id);
    }
    scanQr(req, data) {
        const appKey = req['appKey'];
        return this.absensiService.scanQr(appKey.sekolah_id, data.token);
    }
    lookupUser(req, data) {
        const appKey = req['appKey'];
        return this.absensiService.findUserByQr(appKey.sekolah_id, data.token);
    }
    getHariLibur(sekolahId) {
        return this.absensiService.getHariLibur(sekolahId);
    }
    createHariLibur(sekolahId, data) {
        return this.absensiService.createHariLibur(sekolahId, data);
    }
    deleteHariLibur(sekolahId, id) {
        return this.absensiService.deleteHariLibur(sekolahId, id);
    }
    absenPesertaDidik(sekolahId, data) {
        return this.absensiService.absenPesertaDidik(sekolahId, data);
    }
    absenGtk(sekolahId, data) {
        return this.absensiService.absenGtk(sekolahId, data);
    }
    absenMapel(sekolahId, data) {
        return this.absensiService.absenMapel(sekolahId, data);
    }
    createIzin(sekolahId, data) {
        return this.absensiService.createIzin(sekolahId, data);
    }
};
exports.AbsensiController = AbsensiController;
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Get)('config'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AbsensiController.prototype, "getConfig", null);
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Post)('scan'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AbsensiController.prototype, "scanQr", null);
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Post)('lookup'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AbsensiController.prototype, "lookupUser", null);
__decorate([
    (0, common_1.Get)('hari-libur/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AbsensiController.prototype, "getHariLibur", null);
__decorate([
    (0, common_1.Post)('hari-libur/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AbsensiController.prototype, "createHariLibur", null);
__decorate([
    (0, common_1.Delete)('hari-libur/:sekolahId/:id'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AbsensiController.prototype, "deleteHariLibur", null);
__decorate([
    (0, common_1.Post)('peserta-didik/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AbsensiController.prototype, "absenPesertaDidik", null);
__decorate([
    (0, common_1.Post)('gtk/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AbsensiController.prototype, "absenGtk", null);
__decorate([
    (0, common_1.Post)('mapel/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AbsensiController.prototype, "absenMapel", null);
__decorate([
    (0, common_1.Post)('izin/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AbsensiController.prototype, "createIzin", null);
exports.AbsensiController = AbsensiController = __decorate([
    (0, common_1.Controller)('kurikulum/absensi'),
    __metadata("design:paramtypes", [absensi_service_1.AbsensiService])
], AbsensiController);
//# sourceMappingURL=absensi.controller.js.map