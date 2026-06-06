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
    async getSystemInfo(request) {
        const domain = request.headers.host || request.hostname;
        return this.authService.getSystemInfo(domain);
    }
    async systemSetup(apiKey, request) {
        const domain = request.headers.host || request.hostname;
        return this.authService.setupSystem(apiKey, domain);
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
    (0, common_1.Get)('system-info'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getSystemInfo", null);
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