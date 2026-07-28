"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PengaturanVaModule = void 0;
const common_1 = require("@nestjs/common");
const pengaturan_va_service_1 = require("./pengaturan-va.service");
const pengaturan_va_controller_1 = require("./pengaturan-va.controller");
let PengaturanVaModule = class PengaturanVaModule {
};
exports.PengaturanVaModule = PengaturanVaModule;
exports.PengaturanVaModule = PengaturanVaModule = __decorate([
    (0, common_1.Module)({
        controllers: [pengaturan_va_controller_1.PengaturanVaController],
        providers: [pengaturan_va_service_1.PengaturanVaService],
    })
], PengaturanVaModule);
//# sourceMappingURL=pengaturan-va.module.js.map