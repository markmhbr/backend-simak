import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwtService;
    private cryptoService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, cryptoService: CryptoService, configService: ConfigService);
    validateUser(username: string, pass: string, sekolahId?: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            nama: any;
            email: any;
            role: string;
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
        };
    }>;
    private determineRole;
    private generateTokens;
    getSystemInfo(currentDomain: string): Promise<{
        isConfigured: boolean;
        apiKey: string;
        registeredDomain: string;
    }>;
    setupSystem(apiKey: string, domain: string): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
        is_active: boolean;
    }>;
    refreshTokens(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            nama: any;
            email: any;
            role: string;
        };
    }>;
}
