"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PengaturanUmumModule = void 0;
const common_1 = require("@nestjs/common");
const pengaturan_umum_service_1 = require("./pengaturan-umum.service");
const pengaturan_umum_controller_1 = require("./pengaturan-umum.controller");
let PengaturanUmumModule = class PengaturanUmumModule {
};
exports.PengaturanUmumModule = PengaturanUmumModule;
exports.PengaturanUmumModule = PengaturanUmumModule = __decorate([
    (0, common_1.Module)({
        controllers: [pengaturan_umum_controller_1.PengaturanUmumController],
        providers: [pengaturan_umum_service_1.PengaturanUmumService],
        exports: [pengaturan_umum_service_1.PengaturanUmumService],
    })
], PengaturanUmumModule);
//# sourceMappingURL=pengaturan-umum.module.js.map