import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { AppKeyService } from '../../core/app-key/app-key.service';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../../core/mail/mail.service';
import { Response } from 'express';
export declare class AuthService {
    private prisma;
    private jwtService;
    private cryptoService;
    private configService;
    private appKeyService;
    private mailService;
    constructor(prisma: PrismaService, jwtService: JwtService, cryptoService: CryptoService, configService: ConfigService, appKeyService: AppKeyService, mailService: MailService);
    validateUser(username: string, pass: string, sekolahId?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            nama: any;
            email: any;
            role: string;
            ptk_id: any;
            peserta_didik_id: any;
            foto: string;
        };
        requires2FA: boolean;
        is2FASetup?: undefined;
        tempToken?: undefined;
        qrCodeUrl?: undefined;
        secret?: undefined;
    } | {
        requires2FA: boolean;
        is2FASetup: boolean;
        tempToken: string;
        qrCodeUrl: any;
        secret: any;
    } | {
        requires2FA: boolean;
        is2FASetup: boolean;
        tempToken: string;
        qrCodeUrl?: undefined;
        secret?: undefined;
    }>;
    verify2FA(tempToken: string, code: string, secretToSave?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            nama: any;
            email: any;
            role: string;
            ptk_id: any;
            peserta_didik_id: any;
            foto: string;
        };
    }>;
    private determineRole;
    private generateTokens;
    getSystemInfo(currentDomain: string): Promise<{
        isConfigured: boolean;
        registeredDomain: string;
    }>;
    setupSystem(apiKey: string, domain: string): Promise<{
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        created_at: Date;
        updated_at: Date;
        domain: string | null;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            nama: any;
            email: any;
            role: string;
            ptk_id: any;
            peserta_didik_id: any;
            foto: string;
        };
    }>;
    reset2FA(body: {
        ptk_id?: string;
        peserta_didik_id?: string;
        pengguna_id?: string;
    }): Promise<{
        status: string;
        message: string;
    }>;
    getMe(penggunaId: string): Promise<{
        foto: string;
        sekolah_id: string;
        alamat: string;
        email: string;
        pengguna_id: string;
        username: string;
        nama: string;
        peran_nama: string;
        peran_id: number;
        no_telepon: string;
        no_hp: string;
        ptk_id: string;
        peserta_didik_id: string;
    }>;
    requestReset2FA(username: string, pass: string, sekolahId?: string): Promise<{
        status: string;
        message: string;
        resetToken: string;
    }>;
    verifyReset2FA(resetToken: string, code: string): Promise<{
        status: string;
        message: string;
    }>;
    getPublicProfile(id: string): Promise<{
        id: string;
        nama: string;
        tipe: string;
        rombel: string;
        sekolah: string;
        hasFoto: boolean;
    }>;
    getPublicProfilePhoto(id: string, res: Response): Promise<void>;
}
