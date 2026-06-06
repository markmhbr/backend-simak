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
        };
    }>;
    logout(response: Response): Promise<{
        status: string;
        message: string;
    }>;
    getSystemInfo(request: Request): Promise<{
        isConfigured: boolean;
        apiKey: string;
        registeredDomain: string;
    }>;
    systemSetup(apiKey: string, request: Request): Promise<{
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
    private setRefreshTokenCookie;
}
