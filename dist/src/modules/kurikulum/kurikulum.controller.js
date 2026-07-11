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
Object.defineProperty(exports, "__esModule", { value: true });
exports.KurikulumController = void 0;
const common_1 = require("@nestjs/common");
const kurikulum_service_1 = require("./kurikulum.service");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
let KurikulumController = class KurikulumController {
    kurikulumService;
    constructor(kurikulumService) {
        this.kurikulumService = kurikulumService;
    }
    getSekolahInfo(req) {
        const appKey = req['appKey'];
        return {
            sekolahId: appKey.sekolah_id,
            namaApp: appKey.nama_app,
        };
    }
};
exports.KurikulumController = KurikulumController;
exports.KurikulumController = KurikulumController = __decorate([
    (0, common_1.Controller)('kurikulum'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [kurikulum_service_1.KurikulumService])
], KurikulumController);
//# sourceMappingURL=kurikulum.controller.js.map