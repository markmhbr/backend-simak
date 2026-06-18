"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayananMandalaModule = void 0;
const common_1 = require("@nestjs/common");
const layanan_mandala_service_1 = require("./layanan-mandala.service");
const layanan_mandala_controller_1 = require("./layanan-mandala.controller");
const prisma_module_1 = require("../../core/prisma/prisma.module");
let LayananMandalaModule = class LayananMandalaModule {
};
exports.LayananMandalaModule = LayananMandalaModule;
exports.LayananMandalaModule = LayananMandalaModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [layanan_mandala_controller_1.LayananMandalaController],
        providers: [layanan_mandala_service_1.LayananMandalaService],
        exports: [layanan_mandala_service_1.LayananMandalaService],
    })
], LayananMandalaModule);
//# sourceMappingURL=layanan-mandala.module.js.map