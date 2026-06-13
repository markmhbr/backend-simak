"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const crypto_service_1 = require("../../core/crypto/crypto.service");
const app_key_service_1 = require("../../core/app-key/app-key.service");
const bcrypt = __importStar(require("bcryptjs"));
const { generateSecret, generateURI, verify } = require('otplib');
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    prisma;
    jwtService;
    cryptoService;
    configService;
    appKeyService;
    constructor(prisma, jwtService, cryptoService, configService, appKeyService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.cryptoService = cryptoService;
        this.configService = configService;
        this.appKeyService = appKeyService;
    }
    async validateUser(username, pass, sekolahId) {
        const user = await this.prisma.pengguna.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username },
                ],
            },
        });
        if (!user) {
            console.log(`[Login Failed] User not found: ${username}`);
            throw new common_1.UnauthorizedException('Kredensial tidak valid');
        }
        if (sekolahId) {
            if (user.peran_id_str === 'Super Admin' || user.sekolah_id === null) {
                throw new common_1.UnauthorizedException('Super Admin hanya dapat login melalui portal pusat. Silakan hapus data sekolah di browser Anda atau gunakan akun sekolah.');
            }
            if (user.sekolah_id !== sekolahId) {
                console.log(`[Login Failed] School ID mismatch for user ${username}. User School: ${user.sekolah_id}, Request School: ${sekolahId}`);
                throw new common_1.UnauthorizedException('Akun Anda tidak terdaftar di sekolah ini');
            }
        }
        else {
            if (user.peran_id_str !== 'Super Admin' || user.sekolah_id !== null) {
                throw new common_1.UnauthorizedException('Silakan login melalui portal sekolah Anda.');
            }
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            console.log(`[Login Failed] Password mismatch for user ${username}`);
            throw new common_1.UnauthorizedException('Kredensial tidak valid');
        }
        if (user.peran_id_str === 'Super Admin') {
            const role = 'Super Admin';
            const tokens = await this.generateTokens(user, role);
            return {
                requires2FA: false,
                ...tokens
            };
        }
        const payload = { sub: user.pengguna_id, type: '2fa_pending', sekolahId };
        const tempToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: '10m'
        });
        if (!user.google2fa_secret) {
            const secret = generateSecret();
            const otpauthUrl = generateURI({
                label: user.email || user.username,
                issuer: 'SIMAK',
                secret
            });
            return {
                requires2FA: true,
                is2FASetup: false,
                tempToken,
                qrCodeUrl: otpauthUrl,
                secret: secret
            };
        }
        return {
            requires2FA: true,
            is2FASetup: true,
            tempToken
        };
    }
    async verify2FA(tempToken, code, secretToSave) {
        try {
            const payload = this.jwtService.verify(tempToken, {
                secret: this.configService.get('JWT_SECRET')
            });
            if (payload.type !== '2fa_pending') {
                throw new common_1.UnauthorizedException('Token tidak valid');
            }
            const user = await this.prisma.pengguna.findUnique({
                where: { pengguna_id: payload.sub },
            });
            if (!user)
                throw new common_1.UnauthorizedException('User tidak ditemukan');
            let secret;
            if (!user.google2fa_secret) {
                if (!secretToSave) {
                    throw new common_1.UnauthorizedException('Setup 2FA belum selesai');
                }
                secret = secretToSave;
            }
            else {
                secret = this.cryptoService.decrypt(user.google2fa_secret);
            }
            const isValid = verify({
                token: code,
                secret: secret,
                window: 1,
            });
            if (!isValid) {
                console.log(`[2FA Failed] Invalid code for user ${user.username}. Code: ${code}`);
                throw new common_1.UnauthorizedException('Kode 2FA tidak valid');
            }
            if (!user.google2fa_secret && secretToSave) {
                const encryptedSecret = this.cryptoService.encrypt(secretToSave);
                await this.prisma.pengguna.update({
                    where: { pengguna_id: user.pengguna_id },
                    data: { google2fa_secret: encryptedSecret }
                });
            }
            const role = await this.determineRole(user);
            return this.generateTokens(user, role);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            console.error('2FA Error:', error);
            throw new common_1.UnauthorizedException('Verifikasi 2FA gagal');
        }
    }
    async determineRole(user) {
        const peran = user.peran_id_str || '';
        if (peran === 'Kepala Sekolah') {
            return 'Kepala Sekolah';
        }
        if (user.ptk_id) {
            const gtk = await this.prisma.gtk.findUnique({
                where: { ptk_id: user.ptk_id },
            });
            if (gtk && gtk.jenis_ptk_id_str) {
                return gtk.jenis_ptk_id_str;
            }
            return 'Admin';
        }
        if (user.peserta_didik_id) {
            return 'Peserta Didik';
        }
        return peran || 'User';
    }
    async generateTokens(user, role) {
        const payload = {
            sub: user.pengguna_id,
            email: user.email,
            role: role,
            sekolahId: user.sekolah_id
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRATION'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.pengguna_id,
                nama: user.nama,
                email: user.email,
                role: role,
            },
        };
    }
    async getSystemInfo(currentDomain) {
        const activeKey = await this.prisma.appKey.findFirst({
            where: {
                is_active: true,
            }
        });
        const isDomainValid = activeKey && activeKey.domain === currentDomain;
        return {
            isConfigured: !!isDomainValid,
            apiKey: isDomainValid ? activeKey?.key_api : null,
            registeredDomain: activeKey?.domain || null
        };
    }
    async setupSystem(apiKey, domain) {
        if (!apiKey)
            throw new common_1.UnauthorizedException('API Key wajib diisi');
        const existingKey = await this.prisma.appKey.findUnique({
            where: { key_api: apiKey }
        });
        if (existingKey) {
            return await this.appKeyService.updateSchoolDomain(existingKey.sekolah_id, domain);
        }
        const currentKey = await this.prisma.appKey.findFirst();
        if (currentKey) {
            await this.appKeyService.updateSchoolDomain(currentKey.sekolah_id, domain);
            return await this.prisma.appKey.update({
                where: { id: currentKey.id },
                data: { key_api: apiKey }
            });
        }
        await this.prisma.appKey.deleteMany({});
        return await this.prisma.appKey.create({
            data: {
                nama_app: 'SIMAK School Instance',
                key_api: apiKey,
                domain: domain,
                sekolah_id: '00000000-0000-0000-0000-000000000000',
                is_active: true
            }
        });
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
            const user = await this.prisma.pengguna.findUnique({
                where: { pengguna_id: payload.sub },
            });
            if (!user)
                throw new common_1.UnauthorizedException();
            const role = await this.determineRole(user);
            return this.generateTokens(user, role);
        }
        catch (e) {
            throw new common_1.UnauthorizedException('Sesi telah berakhir, silakan login kembali');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        crypto_service_1.CryptoService,
        config_1.ConfigService,
        app_key_service_1.AppKeyService])
], AuthService);
//# sourceMappingURL=auth.service.js.map