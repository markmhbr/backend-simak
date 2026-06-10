"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbsensiModule = void 0;
const common_1 = require("@nestjs/common");
const absensi_service_1 = require("./absensi.service");
const absensi_controller_1 = require("./absensi.controller");
const prisma_module_1 = require("../../core/prisma/prisma.module");
const app_key_module_1 = require("../../core/app-key/app-key.module");
let AbsensiModule = class AbsensiModule {
};
exports.AbsensiModule = AbsensiModule;
exports.AbsensiModule = AbsensiModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, app_key_module_1.AppKeyModule],
        controllers: [absensi_controller_1.AbsensiController],
        providers: [absensi_service_1.AbsensiService],
        exports: [absensi_service_1.AbsensiService],
    })
], AbsensiModule);
//# sourceMappingURL=absensi.module.js.map