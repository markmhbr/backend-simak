"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuratModule = void 0;
const common_1 = require("@nestjs/common");
const surat_service_1 = require("./surat.service");
const surat_controller_1 = require("./surat.controller");
const prisma_module_1 = require("../../core/prisma/prisma.module");
const app_key_module_1 = require("../../core/app-key/app-key.module");
let SuratModule = class SuratModule {
};
exports.SuratModule = SuratModule;
exports.SuratModule = SuratModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, app_key_module_1.AppKeyModule],
        controllers: [surat_controller_1.SuratController],
        providers: [surat_service_1.SuratService],
        exports: [surat_service_1.SuratService],
    })
], SuratModule);
//# sourceMappingURL=surat.module.js.map