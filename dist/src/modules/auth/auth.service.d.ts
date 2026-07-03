import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CryptoService } from '../../core/crypto/crypto.service';
import { AppKeyService } from '../../core/app-key/app-key.service';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwtService;
    private cryptoService;
    private configService;
    private appKeyService;
    constructor(prisma: PrismaService, jwtService: JwtService, cryptoService: CryptoService, configService: ConfigService, appKeyService: AppKeyService);
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
        };
    }>;
    private determineRole;
    private generateTokens;
    getSystemInfo(currentDomain: string): Promise<{
        isConfigured: boolean;
        registeredDomain: string;
    }>;
    setupSystem(apiKey: string, domain: string): Promise<{
        sekolah_id: string;
        id: string;
        created_at: Date;
        updated_at: Date;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
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
        sekolah_id: string;
        nama: string;
        email: string;
        pengguna_id: string;
        username: string;
        peran_nama: string;
        peran_id: number;
        alamat: string;
        no_telepon: string;
        no_hp: string;
        ptk_id: string;
        peserta_didik_id: string;
    }>;
}
