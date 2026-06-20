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
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt = require('jsonwebtoken');
let ApiKeyGuard = class ApiKeyGuard {
    appKeyService;
    configService;
    prisma;
    constructor(appKeyService, configService, prisma) {
        this.appKeyService = appKeyService;
        this.configService = configService;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        let mandalaKey = request.headers['x-mandala-key'];
        if (!mandalaKey && request.query.key) {
            mandalaKey = request.query.key;
        }
        if (mandalaKey) {
            const connection = await this.prisma.mandala.findUnique({
                where: { key: mandalaKey },
            });
            if (connection) {
                request['mandala'] = connection;
                request['isMandala'] = true;
                return true;
            }
            throw new common_1.UnauthorizedException('Invalid Mandala API key.');
        }
        const authHeader = request.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const secret = this.configService.get('JWT_SECRET');
                const decoded = jwt.verify(token, secret);
                if (decoded) {
                    if (decoded.role === 'Super Admin' || decoded.role === 'superadmin') {
                        const firstSekolah = await this.prisma.sekolah.findFirst({
                            select: { sekolah_id: true }
                        });
                        const resolvedSekolahId = firstSekolah?.sekolah_id || '00000000-0000-0000-0000-000000000000';
                        request['appKey'] = {
                            id: 'super-admin-bypass',
                            nama_app: 'Pusat (Super Admin)',
                            sekolah_id: resolvedSekolahId,
                            key_api: 'super-admin-bypass-key',
                            domain: '*',
                            is_active: true,
                        };
                        return true;
                    }
                    if (decoded.sekolahId) {
                        const appKey = await this.prisma.appKey.findUnique({
                            where: { sekolah_id: decoded.sekolahId }
                        });
                        if (appKey && appKey.is_active) {
                            request['appKey'] = appKey;
                            request['user'] = decoded;
                            return true;
                        }
                    }
                }
            }
            catch (err) {
                throw new common_1.UnauthorizedException('Token kedaluwarsa atau tidak valid. Silakan login kembali.');
            }
        }
        let apiKey = (request.headers['x-api-key'] || request.headers['x-sync-token']);
        if (!apiKey && request.query.key_api) {
            apiKey = request.query.key_api;
        }
        if (!apiKey && request.params && request.params.key_api) {
            apiKey = request.params.key_api;
        }
        if (!apiKey) {
            if (request.url.includes('/auth/')) {
                const origin = request.headers.origin;
                const referer = request.headers.referer;
                const host = request.headers.host;
                let domainToTest;
                if (origin) {
                    domainToTest = origin.replace(/^https?:\/\//, '');
                }
                else if (referer) {
                    try {
                        const url = new URL(referer);
                        domainToTest = url.host;
                    }
                    catch {
                        domainToTest = host;
                    }
                }
                else {
                    domainToTest = host;
                }
                const keyByDomain = await this.appKeyService.findByDomain(domainToTest);
                if (keyByDomain) {
                    request['appKey'] = keyByDomain;
                }
                return true;
            }
            throw new common_1.ForbiddenException('Akses ditolak. Silakan login atau sertakan API Key yang valid.');
        }
        const validKey = await this.appKeyService.validateApiKey(apiKey);
        const isSyncSekolah = request.method === 'POST' && request.url.includes('/api/sync/sekolah');
        if (!validKey && !isSyncSekolah) {
            if (request.url.includes('/api/auth/')) {
                throw new common_1.ForbiddenException('API Key tidak valid');
            }
            throw new common_1.ForbiddenException('API Key tidak valid atau tidak aktif');
        }
        request['appKey'] = validKey;
        request['rawApiKey'] = apiKey;
        return true;
    }
};
exports.ApiKeyGuard = ApiKeyGuard;
exports.ApiKeyGuard = ApiKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_key_service_1.AppKeyService,
        config_1.ConfigService,
        prisma_service_1.PrismaService])
], ApiKeyGuard);
//# sourceMappingURL=api-key.guard.js.map