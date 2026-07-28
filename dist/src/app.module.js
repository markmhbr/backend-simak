"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_client_exception_filter_1 = require("./common/filters/prisma-client-exception.filter");
const env_validation_1 = require("./config/env.validation");
const prisma_module_1 = require("./core/prisma/prisma.module");
const app_key_module_1 = require("./core/app-key/app-key.module");
const crypto_module_1 = require("./core/crypto/crypto.module");
const auth_module_1 = require("./modules/auth/auth.module");
const dapodik_module_1 = require("./modules/dapodik/dapodik.module");
const sync_module_1 = require("./modules/sync/sync.module");
const kurikulum_module_1 = require("./modules/kurikulum/kurikulum.module");
const jadwal_module_1 = require("./modules/jadwal/jadwal.module");
const presensi_module_1 = require("./modules/presensi/presensi.module");
const mandala_module_1 = require("./modules/mandala/mandala.module");
const layanan_mandala_module_1 = require("./modules/layanan-mandala/layanan-mandala.module");
const pelaporan_module_1 = require("./modules/mandala/pelaporan/pelaporan.module");
const indisipliner_module_1 = require("./modules/indisipliner/indisipliner.module");
const spp_module_1 = require("./modules/spp/spp.module");
const surat_module_1 = require("./modules/surat/surat.module");
const reference_module_1 = require("./modules/reference/reference.module");
const pengajuan_perbaikan_module_1 = require("./modules/pengajuan-perbaikan/pengajuan-perbaikan.module");
const pengaturan_umum_module_1 = require("./modules/pengaturan-umum/pengaturan-umum.module");
const mutasi_pd_module_1 = require("./modules/mutasi-pd/mutasi-pd.module");
const mail_module_1 = require("./core/mail/mail.module");
const pengaturan_va_module_1 = require("./modules/pengaturan-va/pengaturan-va.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validate: env_validation_1.validate,
            }),
            prisma_module_1.PrismaModule,
            app_key_module_1.AppKeyModule,
            crypto_module_1.CryptoModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            dapodik_module_1.DapodikModule,
            sync_module_1.SyncModule,
            kurikulum_module_1.KurikulumModule,
            jadwal_module_1.JadwalModule,
            presensi_module_1.PresensiModule,
            mandala_module_1.MandalaModule,
            layanan_mandala_module_1.LayananMandalaModule,
            pelaporan_module_1.PelaporanModule,
            indisipliner_module_1.IndisiplinerModule,
            spp_module_1.SppModule,
            surat_module_1.SuratModule,
            reference_module_1.ReferenceModule,
            pengajuan_perbaikan_module_1.PengajuanPerbaikanModule,
            pengaturan_umum_module_1.PengaturanUmumModule,
            mutasi_pd_module_1.MutasiPdModule,
            pengaturan_va_module_1.PengaturanVaModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_FILTER,
                useFactory: ({ httpAdapter }) => {
                    return new prisma_client_exception_filter_1.PrismaClientExceptionFilter(httpAdapter);
                },
                inject: [core_1.HttpAdapterHost],
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map