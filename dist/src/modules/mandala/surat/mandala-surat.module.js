"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandalaSuratModule = void 0;
const common_1 = require("@nestjs/common");
const mandala_surat_service_1 = require("./mandala-surat.service");
const mandala_surat_controller_1 = require("./mandala-surat.controller");
const prisma_module_1 = require("../../../core/prisma/prisma.module");
let MandalaSuratModule = class MandalaSuratModule {
};
exports.MandalaSuratModule = MandalaSuratModule;
exports.MandalaSuratModule = MandalaSuratModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [mandala_surat_controller_1.MandalaSuratController],
        providers: [mandala_surat_service_1.MandalaSuratService],
        exports: [mandala_surat_service_1.MandalaSuratService],
    })
], MandalaSuratModule);
//# sourceMappingURL=mandala-surat.module.js.map