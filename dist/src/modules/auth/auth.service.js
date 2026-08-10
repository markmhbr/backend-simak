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
const mail_service_1 = require("../../core/mail/mail.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    cryptoService;
    configService;
    appKeyService;
    mailService;
    constructor(prisma, jwtService, cryptoService, configService, appKeyService, mailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.cryptoService = cryptoService;
        this.configService = configService;
        this.appKeyService = appKeyService;
        this.mailService = mailService;
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
            if (user.peran_nama === 'Super Admin' || user.sekolah_id === null) {
                throw new common_1.UnauthorizedException('Super Admin hanya dapat login melalui portal pusat. Silakan hapus data sekolah di browser Anda atau gunakan akun sekolah.');
            }
            if (user.sekolah_id !== sekolahId) {
                console.log(`[Login Failed] School ID mismatch for user ${username}. User School: ${user.sekolah_id}, Request School: ${sekolahId}`);
                throw new common_1.UnauthorizedException('Akun Anda tidak terdaftar di sekolah ini');
            }
        }
        else {
            if (user.peran_nama !== 'Super Admin' || user.sekolah_id !== null) {
                throw new common_1.UnauthorizedException('Silakan login melalui portal sekolah Anda.');
            }
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            console.log(`[Login Failed] Password mismatch for user ${username}`);
            throw new common_1.UnauthorizedException('Kredensial tidak valid');
        }
        if (user.peran_nama === 'Super Admin') {
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
    async loginWithFaceId(embedding, sekolahId) {
        if (!sekolahId) {
            throw new common_1.BadRequestException('Sekolah ID diperlukan');
        }
        const users = await this.prisma.pengguna.findMany({
            where: {
                sekolah_id: sekolahId,
                face_embedding: { not: null },
            },
        });
        let bestMatch = null;
        let highestSimilarity = 0;
        for (const user of users) {
            if (!user.face_embedding)
                continue;
            try {
                const registeredEmbedding = JSON.parse(user.face_embedding);
                let dotProduct = 0;
                let normV1 = 0;
                let normV2 = 0;
                for (let i = 0; i < embedding.length; i++) {
                    dotProduct += embedding[i] * registeredEmbedding[i];
                    normV1 += embedding[i] * embedding[i];
                    normV2 += registeredEmbedding[i] * registeredEmbedding[i];
                }
                const similarity = (normV1 === 0 || normV2 === 0) ? 0 : dotProduct / (Math.sqrt(normV1) * Math.sqrt(normV2));
                if (similarity > highestSimilarity) {
                    highestSimilarity = similarity;
                    bestMatch = user;
                }
            }
            catch (e) {
                console.error('Failed to parse embedding for user:', user.pengguna_id, e);
            }
        }
        const threshold = 0.80;
        if (bestMatch && highestSimilarity >= threshold) {
            const role = await this.determineRole(bestMatch);
            const tokens = await this.generateTokens(bestMatch, role);
            return {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: tokens.user,
            };
        }
        throw new common_1.UnauthorizedException('Identifikasi wajah gagal atau wajah tidak terdaftar');
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
            const result = await verify({
                token: code,
                secret: secret,
                window: 1,
            });
            if (!result || !result.valid) {
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
        const peran = user.peran_nama || user.peran_id_str || '';
        if (user.peran_id === 10 || peran === 'Operator Sekolah') {
            return 'Operator Sekolah';
        }
        if (peran === 'Kepala Sekolah') {
            return 'Kepala Sekolah';
        }
        if (user.ptk_id) {
            const gtk = await this.prisma.gtk.findUnique({
                where: { ptk_id: user.ptk_id },
            });
            if (gtk && gtk.jenis_ptk_id) {
                const jPtk = await this.prisma.jenis_ptk.findUnique({
                    where: { jenis_ptk_id: gtk.jenis_ptk_id },
                });
                if (jPtk) {
                    return jPtk.jenis_ptk;
                }
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
            sekolahId: user.sekolah_id,
            ptkId: user.ptk_id
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: this.configService.get('JWT_EXPIRATION'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        });
        let foto = null;
        if (user.ptk_id) {
            const gtk = await this.prisma.gtk.findUnique({
                where: { ptk_id: user.ptk_id },
                select: { foto: true }
            });
            foto = gtk?.foto || null;
        }
        else if (user.peserta_didik_id) {
            const pd = await this.prisma.pesertaDidik.findUnique({
                where: { peserta_didik_id: user.peserta_didik_id },
                select: { foto: true }
            });
            foto = pd?.foto || null;
        }
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.pengguna_id,
                nama: user.nama,
                email: user.email,
                role: role,
                ptk_id: user.ptk_id,
                peserta_didik_id: user.peserta_didik_id,
                foto: foto,
            },
        };
    }
    async getSystemInfo(currentDomain) {
        const matchingKey = await this.appKeyService.findByDomain(currentDomain);
        const activeKey = await this.prisma.appKey.findFirst({
            where: { is_active: true }
        });
        return {
            isConfigured: !!matchingKey,
            registeredDomain: matchingKey ? matchingKey.domain : (activeKey?.domain || null)
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
    async reset2FA(body) {
        const { ptk_id, peserta_didik_id, pengguna_id } = body;
        let targetUser = null;
        if (pengguna_id) {
            targetUser = await this.prisma.pengguna.findUnique({
                where: { pengguna_id },
            });
        }
        else if (ptk_id) {
            targetUser = await this.prisma.pengguna.findFirst({
                where: { ptk_id },
            });
        }
        else if (peserta_didik_id) {
            targetUser = await this.prisma.pengguna.findFirst({
                where: { peserta_didik_id },
            });
        }
        if (!targetUser) {
            throw new common_1.BadRequestException('Pengguna tidak ditemukan');
        }
        await this.prisma.pengguna.update({
            where: { pengguna_id: targetUser.pengguna_id },
            data: { google2fa_secret: null },
        });
        return { status: 'success', message: 'Authenticator berhasil diset ulang' };
    }
    async getMe(penggunaId) {
        const user = await this.prisma.pengguna.findUnique({
            where: { pengguna_id: penggunaId },
            select: {
                pengguna_id: true,
                sekolah_id: true,
                username: true,
                nama: true,
                email: true,
                peran_nama: true,
                peran_id: true,
                alamat: true,
                no_telepon: true,
                no_hp: true,
                ptk_id: true,
                peserta_didik_id: true,
            }
        });
        if (!user)
            throw new common_1.BadRequestException('Pengguna tidak ditemukan');
        let ptkId = user.ptk_id;
        let pdId = user.peserta_didik_id;
        if (!ptkId && !pdId) {
            if (user.email || user.username || user.nama) {
                const foundGtk = await this.prisma.gtk.findFirst({
                    where: {
                        sekolah_id: user.sekolah_id || undefined,
                        OR: [
                            ...(user.email ? [{ email: { equals: user.email, mode: 'insensitive' } }] : []),
                            ...(user.username ? [
                                { nik: user.username },
                                { nuptk: user.username },
                                { email: { equals: user.username, mode: 'insensitive' } }
                            ] : []),
                            ...(user.nama ? [{ nama: { equals: user.nama, mode: 'insensitive' } }] : []),
                        ],
                    },
                    select: { ptk_id: true },
                });
                if (foundGtk) {
                    ptkId = foundGtk.ptk_id;
                    await this.prisma.pengguna.update({
                        where: { pengguna_id: user.pengguna_id },
                        data: { ptk_id: ptkId },
                    }).catch(() => { });
                }
                else {
                    const foundPd = await this.prisma.pesertaDidik.findFirst({
                        where: {
                            sekolah_id: user.sekolah_id || undefined,
                            OR: [
                                ...(user.email ? [{ email: { equals: user.email, mode: 'insensitive' } }] : []),
                                ...(user.username ? [
                                    { nisn: user.username },
                                    { nik: user.username },
                                    { email: { equals: user.username, mode: 'insensitive' } }
                                ] : []),
                                ...(user.nama ? [{ nama: { equals: user.nama, mode: 'insensitive' } }] : []),
                            ],
                        },
                        select: { peserta_didik_id: true },
                    });
                    if (foundPd) {
                        pdId = foundPd.peserta_didik_id;
                        await this.prisma.pengguna.update({
                            where: { pengguna_id: user.pengguna_id },
                            data: { peserta_didik_id: pdId },
                        }).catch(() => { });
                    }
                }
            }
        }
        let foto = null;
        if (ptkId) {
            const gtk = await this.prisma.gtk.findUnique({
                where: { ptk_id: ptkId },
                select: { foto: true }
            });
            foto = gtk?.foto || null;
        }
        else if (pdId) {
            const pd = await this.prisma.pesertaDidik.findUnique({
                where: { peserta_didik_id: pdId },
                select: { foto: true }
            });
            foto = pd?.foto || null;
        }
        return {
            ...user,
            ptk_id: ptkId,
            peserta_didik_id: pdId,
            foto,
        };
    }
    async requestReset2FA(username, pass, sekolahId) {
        const user = await this.prisma.pengguna.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username },
                ],
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Kredensial tidak valid');
        }
        if (sekolahId && user.sekolah_id && user.sekolah_id !== sekolahId) {
            throw new common_1.UnauthorizedException('Akun Anda tidak terdaftar di sekolah ini');
        }
        const isMatch = await bcrypt.compare(pass, user.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Kredensial tidak valid');
        }
        let email = null;
        let name = user.nama || user.username;
        if (user.ptk_id) {
            const gtk = await this.prisma.gtk.findUnique({
                where: { ptk_id: user.ptk_id },
                select: { email: true, nama: true }
            });
            if (gtk?.email) {
                email = gtk.email;
            }
            if (gtk?.nama) {
                name = gtk.nama;
            }
        }
        else if (user.peserta_didik_id) {
            const pd = await this.prisma.pesertaDidik.findUnique({
                where: { peserta_didik_id: user.peserta_didik_id },
                select: { email_aktif: true, nama: true }
            });
            if (pd?.email_aktif) {
                email = pd.email_aktif;
            }
            if (pd?.nama) {
                name = pd.nama;
            }
        }
        if (!email) {
            email = user.email;
        }
        if (!email || email.trim() === '') {
            throw new common_1.BadRequestException('Email tidak terdaftar pada akun Anda. Silakan hubungi admin sekolah Anda.');
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const otpHash = await bcrypt.hash(otp, salt);
        const emailSent = await this.mailService.sendOTP(email, otp, name);
        if (!emailSent) {
            throw new common_1.BadRequestException('Gagal mengirimkan kode OTP ke email Anda. Silakan coba beberapa saat lagi.');
        }
        const resetToken = this.jwtService.sign({ sub: user.pengguna_id, otpHash, type: 'reset_2fa' }, { secret: this.configService.get('JWT_SECRET'), expiresIn: '10m' });
        const emailParts = email.split('@');
        const maskedLocal = emailParts[0].length > 2
            ? emailParts[0].substring(0, 2) + '***'
            : emailParts[0] + '***';
        const maskedEmail = `${maskedLocal}@${emailParts[1]}`;
        return {
            status: 'success',
            message: `Kode OTP verifikasi telah dikirim ke email: ${maskedEmail}`,
            resetToken,
        };
    }
    async verifyReset2FA(resetToken, code) {
        try {
            const payload = this.jwtService.verify(resetToken, {
                secret: this.configService.get('JWT_SECRET'),
            });
            if (payload.type !== 'reset_2fa') {
                throw new common_1.UnauthorizedException('Token reset tidak valid');
            }
            const isMatch = await bcrypt.compare(code, payload.otpHash);
            if (!isMatch) {
                throw new common_1.UnauthorizedException('Kode OTP yang Anda masukkan salah');
            }
            await this.prisma.pengguna.update({
                where: { pengguna_id: payload.sub },
                data: { google2fa_secret: null },
            });
            return {
                status: 'success',
                message: 'Autentikasi Dua Faktor (2FA) berhasil diset ulang. Silakan masuk kembali.',
            };
        }
        catch (e) {
            if (e instanceof common_1.UnauthorizedException)
                throw e;
            if (e.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('Sesi reset 2FA telah berakhir (Expired). Silakan ajukan ulang.');
            }
            throw new common_1.UnauthorizedException('Verifikasi reset 2FA gagal');
        }
    }
    buildAlamat(data) {
        const parts = [];
        if (data.alamat_jalan)
            parts.push(data.alamat_jalan.trim());
        const rtVal = data.rt ? String(data.rt).trim() : '';
        const rwVal = data.rw ? String(data.rw).trim() : '';
        if (rtVal || rwVal) {
            parts.push(`RT ${rtVal || '-'}/RW ${rwVal || '-'}`);
        }
        if (data.nama_dusun)
            parts.push(`Dusun ${data.nama_dusun.trim()}`);
        if (data.desa_kelurahan)
            parts.push(`Desa/Kel. ${data.desa_kelurahan.trim()}`);
        if (data.kode_pos)
            parts.push(`Kode Pos ${data.kode_pos.trim()}`);
        return parts.length > 0 ? parts.join(', ') : '-';
    }
    async getPublicProfile(id) {
        const pd = await this.prisma.pesertaDidik.findFirst({
            where: {
                OR: [
                    { peserta_didik_id: id },
                    { qr_token: { endsWith: id } }
                ]
            },
            include: {
                rombongan_belajar: true,
            },
        });
        if (pd) {
            const sekolah = await this.prisma.sekolah.findUnique({
                where: { sekolah_id: pd.sekolah_id },
                select: { nama: true },
            });
            return {
                id: pd.peserta_didik_id,
                nama: pd.nama,
                nisn: pd.nisn || '-',
                jenis_kelamin: pd.jenis_kelamin === 'L' ? 'Laki-laki' : pd.jenis_kelamin === 'P' ? 'Perempuan' : (pd.jenis_kelamin || '-'),
                tipe: 'siswa',
                rombel: pd.rombongan_belajar?.nama || '-',
                sekolah: sekolah?.nama || '-',
                hasFoto: !!pd.foto,
                alamat: this.buildAlamat(pd),
            };
        }
        const gtk = await this.prisma.gtk.findFirst({
            where: {
                OR: [
                    { ptk_id: id },
                    { qr_token: { endsWith: id } }
                ]
            },
            include: {
                jenis_ptk: true,
            },
        });
        if (gtk) {
            const sekolah = await this.prisma.sekolah.findUnique({
                where: { sekolah_id: gtk.sekolah_id },
                select: { nama: true },
            });
            return {
                id: gtk.ptk_id,
                nama: gtk.nama,
                nuptk: gtk.nuptk || '-',
                jenis_kelamin: gtk.jenis_kelamin === 'L' ? 'Laki-laki' : gtk.jenis_kelamin === 'P' ? 'Perempuan' : (gtk.jenis_kelamin || '-'),
                tipe: 'gtk',
                unit_kerja: gtk.jenis_ptk?.jenis_ptk || 'Guru/Staf',
                rombel: gtk.jenis_ptk?.jenis_ptk || 'Guru/Staf',
                sekolah: sekolah?.nama || '-',
                hasFoto: !!gtk.foto,
                alamat: this.buildAlamat(gtk),
            };
        }
        throw new common_1.NotFoundException('Data tidak ditemukan');
    }
    async getPublicProfilePhoto(id, res) {
        let fotoPath = null;
        const pd = await this.prisma.pesertaDidik.findFirst({
            where: {
                OR: [
                    { peserta_didik_id: id },
                    { qr_token: { endsWith: id } }
                ]
            },
            select: { foto: true }
        });
        if (pd) {
            fotoPath = pd.foto;
        }
        else {
            const gtk = await this.prisma.gtk.findFirst({
                where: {
                    OR: [
                        { ptk_id: id },
                        { qr_token: { endsWith: id } }
                    ]
                },
                select: { foto: true }
            });
            if (gtk) {
                fotoPath = gtk.foto;
            }
        }
        if (fotoPath) {
            let cleanPath = fotoPath;
            if (cleanPath.startsWith('/storage/')) {
                cleanPath = cleanPath.substring(9);
            }
            else if (cleanPath.startsWith('storage/')) {
                cleanPath = cleanPath.substring(8);
            }
            const sanitizedPath = path.normalize(cleanPath).replace(/^(\.\.(\/|\\))+/, '');
            const fullPath = path.join(process.cwd(), 'storage', sanitizedPath);
            if (fs.existsSync(fullPath)) {
                res.setHeader('Cache-Control', 'public, max-age=86400');
                return res.sendFile(fullPath);
            }
        }
        const placeholderPath = path.join(process.cwd(), 'storage', 'default-avatar.png');
        if (fs.existsSync(placeholderPath)) {
            return res.sendFile(placeholderPath);
        }
        throw new common_1.NotFoundException('Foto tidak ditemukan');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        crypto_service_1.CryptoService,
        config_1.ConfigService,
        app_key_service_1.AppKeyService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map