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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const app_key_service_1 = require("./app-key.service");
let ApiKeyGuard = class ApiKeyGuard {
    appKeyService;
    constructor(appKeyService) {
        this.appKeyService = appKeyService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        let apiKey = (request.headers['x-api-key'] || request.headers['x-sync-token']);
        if (!apiKey && request.query.key_api) {
            apiKey = request.query.key_api;
        }
        if (!apiKey && request.params && request.params.key_api) {
            apiKey = request.params.key_api;
        }
        if (!apiKey) {
            const domain = request.headers.host || request.hostname;
            const keyByDomain = await this.appKeyService.findByDomain(domain);
            if (keyByDomain) {
                request['appKey'] = keyByDomain;
                return true;
            }
            if (request.url.includes('/api/auth/')) {
                return true;
            }
            throw new common_1.UnauthorizedException('Sistem belum terhubung. API Key tidak ditemukan dan domain tidak terdaftar.');
        }
        const validKey = await this.appKeyService.validateApiKey(apiKey);
        const isSyncSekolah = request.method === 'POST' && request.url.includes('/api/sync/sekolah');
        if (!validKey && !isSyncSekolah) {
            if (request.url.includes('/api/auth/')) {
                throw new common_1.UnauthorizedException('API Key tidak valid');
            }
            throw new common_1.UnauthorizedException('API Key tidak valid atau tidak aktif');
        }
        request['appKey'] = validKey;
        request['rawApiKey'] = apiKey;
        return true;
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_key_service_1.AppKeyService])
], ApiKeyGuard);
//# sourceMappingURL=api-key.guard.js.map