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
exports.PresensiController = void 0;
const common_1 = require("@nestjs/common");
const presensi_service_1 = require("./presensi.service");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
const express = __importStar(require("express"));
let PresensiController = class PresensiController {
    presensiService;
    constructor(presensiService) {
        this.presensiService = presensiService;
    }
    getConfig(req) {
        const appKey = req['appKey'];
        return this.presensiService.getAttendanceConfig(appKey.sekolah_id);
    }
    scanQr(req, data) {
        const appKey = req['appKey'];
        return this.presensiService.scanQr(appKey.sekolah_id, data.token, data.latitude, data.longitude);
    }
    lookupUser(req, data) {
        const appKey = req['appKey'];
        return this.presensiService.findUserByQr(appKey.sekolah_id, data.token);
    }
    getHariLibur(sekolahId) {
        return this.presensiService.getHariLibur(sekolahId);
    }
    createHariLibur(sekolahId, data) {
        return this.presensiService.createHariLibur(sekolahId, data);
    }
    updateHariLibur(sekolahId, id, data) {
        return this.presensiService.updateHariLibur(sekolahId, id, data);
    }
    deleteHariLibur(sekolahId, id) {
        return this.presensiService.deleteHariLibur(sekolahId, id);
    }
    presensiPesertaDidik(sekolahId, data) {
        return this.presensiService.presensiPesertaDidik(sekolahId, data);
    }
    presensiGtk(sekolahId, data) {
        return this.presensiService.presensiGtk(sekolahId, data);
    }
    presensiMapel(sekolahId, data) {
        return this.presensiService.presensiMapel(sekolahId, data);
    }
    createIzin(sekolahId, data) {
        return this.presensiService.createIzin(sekolahId, data);
    }
    getIzinKeluar(sekolahId, tanggal) {
        return this.presensiService.getIzinKeluarHariIni(sekolahId, tanggal);
    }
    catatKembali(sekolahId, izinId) {
        return this.presensiService.catatKembali(sekolahId, izinId);
    }
    setujuiIzin(sekolahId, izinId) {
        return this.presensiService.setujuiIzin(sekolahId, izinId);
    }
    deleteIzin(sekolahId, izinId) {
        return this.presensiService.deleteIzin(sekolahId, izinId);
    }
    getRekapPesertaDidik(sekolahId, tanggal) {
        return this.presensiService.getPresensiPesertaDidik(sekolahId, tanggal);
    }
    getRekapGtk(sekolahId, tanggal) {
        return this.presensiService.getPresensiGtk(sekolahId, tanggal);
    }
    getRekapPeriodik(sekolahId, rombel, tanggalMulai, tanggalSelesai, tipe) {
        return this.presensiService.getRekapPeriodik(sekolahId, rombel, tanggalMulai, tanggalSelesai, tipe || 'pd');
    }
};
exports.PresensiController = PresensiController;
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Get)('config'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "getConfig", null);
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Post)('scan'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "scanQr", null);
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Post)('lookup'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "lookupUser", null);
__decorate([
    (0, common_1.Get)('hari-libur/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "getHariLibur", null);
__decorate([
    (0, common_1.Post)('hari-libur/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "createHariLibur", null);
__decorate([
    (0, common_1.Patch)('hari-libur/:sekolahId/:id'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "updateHariLibur", null);
__decorate([
    (0, common_1.Delete)('hari-libur/:sekolahId/:id'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "deleteHariLibur", null);
__decorate([
    (0, common_1.Post)('peserta-didik/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "presensiPesertaDidik", null);
__decorate([
    (0, common_1.Post)('gtk/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "presensiGtk", null);
__decorate([
    (0, common_1.Post)('mapel/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "presensiMapel", null);
__decorate([
    (0, common_1.Post)('izin/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "createIzin", null);
__decorate([
    (0, common_1.Get)('izin-keluar/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Query)('tanggal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "getIzinKeluar", null);
__decorate([
    (0, common_1.Post)('izin-keluar/kembali/:sekolahId/:izinId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Param)('izinId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "catatKembali", null);
__decorate([
    (0, common_1.Post)('izin-keluar/setujui/:sekolahId/:izinId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Param)('izinId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "setujuiIzin", null);
__decorate([
    (0, common_1.Delete)('izin-keluar/:sekolahId/:izinId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Param)('izinId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "deleteIzin", null);
__decorate([
    (0, common_1.Get)('rekap-pd/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Query)('tanggal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "getRekapPesertaDidik", null);
__decorate([
    (0, common_1.Get)('rekap-gtk/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Query)('tanggal')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "getRekapGtk", null);
__decorate([
    (0, common_1.Get)('rekap-periodik/:sekolahId'),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Query)('rombel')),
    __param(2, (0, common_1.Query)('tanggal_mulai')),
    __param(3, (0, common_1.Query)('tanggal_selesai')),
    __param(4, (0, common_1.Query)('tipe')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], PresensiController.prototype, "getRekapPeriodik", null);
exports.PresensiController = PresensiController = __decorate([
    (0, common_1.Controller)('kurikulum/presensi'),
    __metadata("design:paramtypes", [presensi_service_1.PresensiService])
], PresensiController);
//# sourceMappingURL=presensi.controller.js.map