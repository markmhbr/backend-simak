import { AuthService } from './auth.service';
import { LoginDto, Verify2faDto } from './dto/auth.dto';
import type { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, request: Request): Promise<{
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
    verify2fa(verifyDto: Verify2faDto, response: Response): Promise<{
        status: string;
        accessToken: string;
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
    refresh(request: Request, response: Response): Promise<{
        status: string;
        accessToken: string;
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
    logout(response: Response): Promise<{
        status: string;
        message: string;
    }>;
    reset2fa(body: {
        ptk_id?: string;
        peserta_didik_id?: string;
        pengguna_id?: string;
    }): Promise<{
        status: string;
        message: string;
    }>;
    requestReset2fa(body: LoginDto, request: Request): Promise<{
        status: string;
        message: string;
        resetToken: string;
    }>;
    verifyReset2fa(body: {
        resetToken: string;
        code: string;
    }): Promise<{
        status: string;
        message: string;
    }>;
    getMe(request: Request): Promise<{
        foto: string;
        email: string;
        sekolah_id: string;
        alamat: string;
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
    getSystemInfo(request: Request): Promise<{
        isConfigured: boolean;
        registeredDomain: string;
    }>;
    systemSetup(apiKey: string, request: Request): Promise<{
        created_at: Date;
        updated_at: Date;
        id: string;
        sekolah_id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        is_active: boolean;
        domain: string | null;
    }>;
    private getRequestDomain;
    private setRefreshTokenCookie;
}
