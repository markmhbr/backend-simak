"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MutasiPdModule = void 0;
const common_1 = require("@nestjs/common");
const mutasi_pd_service_1 = require("./mutasi-pd.service");
const mutasi_pd_controller_1 = require("./mutasi-pd.controller");
let MutasiPdModule = class MutasiPdModule {
};
exports.MutasiPdModule = MutasiPdModule;
exports.MutasiPdModule = MutasiPdModule = __decorate([
    (0, common_1.Module)({
        controllers: [mutasi_pd_controller_1.MutasiPdController],
        providers: [mutasi_pd_service_1.MutasiPdService],
        exports: [mutasi_pd_service_1.MutasiPdService],
    })
], MutasiPdModule);
//# sourceMappingURL=mutasi-pd.module.js.map