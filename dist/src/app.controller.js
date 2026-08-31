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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const api_key_guard_1 = require("./core/app-key/api-key.guard");
const prisma_service_1 = require("./core/prisma/prisma.service");
let AppController = class AppController {
    appService;
    prisma;
    constructor(appService, prisma) {
        this.appService = appService;
        this.prisma = prisma;
    }
    getHello() {
        return this.appService.getHello();
    }
    async redirectProfile(sekolahId, id, res) {
        try {
            const appKey = await this.prisma.appKey.findUnique({
                where: { sekolah_id: sekolahId },
            });
            if (appKey?.domain) {
                let cleanDomain = appKey.domain.replace(/\/+$/, '');
                if (cleanDomain.includes('localhost') || cleanDomain.includes('127.0.0.1')) {
                    cleanDomain = cleanDomain.replace(/^https:\/\//, 'http://');
                    if (!cleanDomain.startsWith('http://')) {
                        cleanDomain = `http://${cleanDomain}`;
                    }
                }
                else {
                    if (!cleanDomain.startsWith('http://') && !cleanDomain.startsWith('https://')) {
                        cleanDomain = `https://${cleanDomain}`;
                    }
                }
                return res.redirect(302, `${cleanDomain}/public-profile/${id}`);
            }
        }
        catch (e) { }
        let fallbackUrl = (process.env.APP_URL || '').replace(/\/+$/, '');
        if (fallbackUrl.includes('localhost') || fallbackUrl.includes('127.0.0.1')) {
            fallbackUrl = fallbackUrl.replace(/^https:\/\//, 'http://');
            if (!fallbackUrl.startsWith('http://')) {
                fallbackUrl = `http://${fallbackUrl}`;
            }
        }
        else if (!fallbackUrl.startsWith('http://') && !fallbackUrl.startsWith('https://')) {
            fallbackUrl = `https://${fallbackUrl}`;
        }
        return res.redirect(302, `${fallbackUrl}/public-profile/${id}`);
    }
    async redirectProfileById(id, res) {
        if (id.includes('/')) {
            const [sekolahId, userId] = id.split('/');
            return this.redirectProfile(sekolahId, userId, res);
        }
        try {
            const student = await this.prisma.pesertaDidik.findUnique({
                where: { peserta_didik_id: id },
                select: { sekolah_id: true },
            });
            const gtk = !student
                ? await this.prisma.gtk.findUnique({
                    where: { ptk_id: id },
                    select: { sekolah_id: true },
                })
                : null;
            const sekolahId = student?.sekolah_id || gtk?.sekolah_id;
            if (sekolahId) {
                return this.redirectProfile(sekolahId, id, res);
            }
        }
        catch (e) { }
        const fallbackUrl = (process.env.APP_URL || '').replace(/\/+$/, '');
        return res.redirect(302, `${fallbackUrl}/public-profile/${id}`);
    }
    getProtectedData(req) {
        const appKey = req['appKey'];
        return {
            message: 'Selamat, Anda berhasil mengakses endpoint terproteksi!',
            app_info: {
                id: appKey.id,
                nama_app: appKey.nama_app,
                sekolah_id: appKey.sekolah_id,
                key_api: appKey.key_api,
            },
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, common_1.Get)(['p/:sekolahId/:id', 'api/p/:sekolahId/:id']),
    __param(0, (0, common_1.Param)('sekolahId')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "redirectProfile", null);
__decorate([
    (0, common_1.Get)(['p/:id', 'api/p/:id']),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "redirectProfileById", null);
__decorate([
    (0, common_1.Get)('test-protected'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getProtectedData", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        prisma_service_1.PrismaService])
], AppController);
//# sourceMappingURL=app.controller.js.map