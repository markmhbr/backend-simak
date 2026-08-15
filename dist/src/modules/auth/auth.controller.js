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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const throttler_1 = require("@nestjs/throttler");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginDto, request) {
        const appKey = request['appKey'];
        const sekolahId = appKey ? appKey.sekolah_id : undefined;
        return this.authService.validateUser(loginDto.username, loginDto.password, sekolahId);
    }
    async loginFaceId(embedding, request, response) {
        const appKey = request['appKey'];
        const sekolahId = appKey ? appKey.sekolah_id : undefined;
        if (!sekolahId) {
            throw new common_1.UnauthorizedException('Koneksi sekolah tidak terdeteksi');
        }
        const result = await this.authService.loginWithFaceId(embedding, sekolahId);
        this.setRefreshTokenCookie(response, result.refreshToken);
        return {
            status: 'success',
            accessToken: result.accessToken,
            user: result.user,
        };
    }
    async verify2fa(verifyDto, response) {
        const result = await this.authService.verify2FA(verifyDto.tempToken, verifyDto.code, verifyDto.secret);
        this.setRefreshTokenCookie(response, result.refreshToken);
        return {
            status: 'success',
            accessToken: result.accessToken,
            user: result.user,
        };
    }
    async refresh(request, response) {
        const refreshToken = request.cookies['refresh_token'];
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Sesi berakhir');
        }
        const result = await this.authService.refreshTokens(refreshToken);
        this.setRefreshTokenCookie(response, result.refreshToken);
        return {
            status: 'success',
            accessToken: result.accessToken,
            user: result.user,
        };
    }
    async logout(response) {
        response.clearCookie('refresh_token');
        return { status: 'success', message: 'Logout berhasil' };
    }
    async reset2fa(body) {
        return this.authService.reset2FA(body);
    }
    async requestReset2fa(body, request) {
        const appKey = request['appKey'];
        const sekolahId = appKey ? appKey.sekolah_id : undefined;
        return this.authService.requestReset2FA(body.username, body.password, sekolahId);
    }
    async verifyReset2fa(body) {
        return this.authService.verifyReset2FA(body.resetToken, body.code);
    }
    async getMe(request) {
        const user = request['user'];
        if (!user)
            throw new common_1.UnauthorizedException('Sesi berakhir');
        return this.authService.getMe(user.sub);
    }
    async linkGtk(request, body) {
        const user = request['user'];
        if (!user || !user.sub)
            throw new common_1.UnauthorizedException('Sesi berakhir');
        return this.authService.linkUserToGtk(user.sub, body.ptk_id);
    }
    async getSuperadminJenjang() {
        return this.authService.getJenjangList();
    }
    async getSuperadminSekolah(bentukPendidikanId) {
        const id = bentukPendidikanId ? parseInt(bentukPendidikanId, 10) : undefined;
        return this.authService.getSekolahByJenjang(id);
    }
    async switchSekolah(request, body, response) {
        const user = request['user'];
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Sesi berakhir atau hak akses tidak valid');
        }
        const result = await this.authService.switchSekolah(user.sub, body.sekolah_id);
        this.setRefreshTokenCookie(response, result.refreshToken);
        return result;
    }
    async getSystemInfo(request) {
        const domain = this.getRequestDomain(request);
        return this.authService.getSystemInfo(domain);
    }
    async getPublicProfile(id) {
        return this.authService.getPublicProfile(id);
    }
    async getPublicProfilePhoto(id, res) {
        return this.authService.getPublicProfilePhoto(id, res);
    }
    async systemSetup(apiKey, request) {
        const domain = this.getRequestDomain(request);
        return this.authService.setupSystem(apiKey, domain);
    }
    getRequestDomain(request) {
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
        return domainToTest;
    }
    setRefreshTokenCookie(response, token) {
        response.cookie('refresh_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/auth/refresh',
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard, api_key_guard_1.ApiKeyGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard, api_key_guard_1.ApiKeyGuard),
    (0, common_1.Post)('login-face-id'),
    __param(0, (0, common_1.Body)('embedding')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "loginFaceId", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('verify-2fa'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.Verify2faDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verify2fa", null);
__decorate([
    (0, common_1.Post)('refresh'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('reset-2fa'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reset2fa", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard, api_key_guard_1.ApiKeyGuard),
    (0, common_1.Post)('reset-2fa/request'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestReset2fa", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Post)('reset-2fa/verify'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyReset2fa", null);
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Get)('me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Post)('link-gtk'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "linkGtk", null);
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Get)('superadmin/jenjang'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSuperadminJenjang", null);
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Get)('superadmin/sekolah'),
    __param(0, (0, common_1.Query)('bentuk_pendidikan_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSuperadminSekolah", null);
__decorate([
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    (0, common_1.Post)('switch-sekolah'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "switchSekolah", null);
__decorate([
    (0, common_1.Get)('system-info'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSystemInfo", null);
__decorate([
    (0, common_1.Get)('public-profile/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getPublicProfile", null);
__decorate([
    (0, common_1.Get)('public-profile/photo/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getPublicProfilePhoto", null);
__decorate([
    (0, common_1.Post)('system-setup'),
    __param(0, (0, common_1.Body)('apiKey')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "systemSetup", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map