"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MandalaModule = void 0;
const common_1 = require("@nestjs/common");
const mandala_service_1 = require("./mandala.service");
const mandala_controller_1 = require("./mandala.controller");
const prisma_module_1 = require("../../core/prisma/prisma.module");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto_module_1 = require("../../core/crypto/crypto.module");
const mandala_surat_module_1 = require("./surat/mandala-surat.module");
const system_setting_module_1 = require("./system-setting/system-setting.module");
let MandalaModule = class MandalaModule {
};
exports.MandalaModule = MandalaModule;
exports.MandalaModule = MandalaModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            crypto_module_1.CryptoModule,
            mandala_surat_module_1.MandalaSuratModule,
            system_setting_module_1.MandalaSystemSettingModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRATION') || '1d' },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [mandala_controller_1.MandalaController],
        providers: [mandala_service_1.MandalaService],
        exports: [mandala_service_1.MandalaService],
    })
], MandalaModule);
//# sourceMappingURL=mandala.module.js.map