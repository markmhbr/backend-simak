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
exports.SystemSettingController = void 0;
const common_1 = require("@nestjs/common");
const system_setting_service_1 = require("./system-setting.service");
const mandala_key_guard_1 = require("../../../core/mandala/mandala-key.guard");
let SystemSettingController = class SystemSettingController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getSettings(cadisdikId) {
        const data = await this.service.getSettings(cadisdikId);
        return {
            status: 'success',
            data,
        };
    }
    async upsertSettings(cadisdikId, body) {
        const data = await this.service.upsertSettings(cadisdikId, body);
        return {
            status: 'success',
            message: 'System settings successfully updated.',
            data,
        };
    }
};
exports.SystemSettingController = SystemSettingController;
__decorate([
    (0, common_1.Get)(':cadisdik_id'),
    __param(0, (0, common_1.Param)('cadisdik_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SystemSettingController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Post)(':cadisdik_id'),
    __param(0, (0, common_1.Param)('cadisdik_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SystemSettingController.prototype, "upsertSettings", null);
exports.SystemSettingController = SystemSettingController = __decorate([
    (0, common_1.Controller)('mandala/system-setting'),
    (0, common_1.UseGuards)(mandala_key_guard_1.MandalaKeyGuard),
    __metadata("design:paramtypes", [system_setting_service_1.SystemSettingService])
], SystemSettingController);
//# sourceMappingURL=system-setting.controller.js.map