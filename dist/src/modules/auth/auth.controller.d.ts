import { AuthService } from './auth.service';
import { LoginDto, Verify2faDto } from './dto/auth.dto';
import type { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto, request: Request): Promise<{
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
    loginFaceId(embedding: number[], request: Request, response: Response): Promise<{
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
        ptk_id: string;
        peserta_didik_id: string;
        foto: string;
        sekolah_id: string;
        nama: string;
        email: string;
        alamat: string;
        pengguna_id: string;
        username: string;
        peran_nama: string;
        peran_id: number;
        no_telepon: string;
        no_hp: string;
    }>;
    linkGtk(request: Request, body: {
        ptk_id: string;
    }): Promise<{
        status: string;
        message: string;
        ptk_id: string;
    }>;
    getSuperadminJenjang(): Promise<{
        nama: string;
        bentuk_pendidikan_id: number;
    }[]>;
    getSuperadminSekolah(bentukPendidikanId?: string): Promise<{
        sekolah_id: string;
        nama: string;
        npsn: string;
        bentuk_pendidikan_id: number;
        alamat_jalan: string;
    }[]>;
    switchSekolah(request: Request, body: {
        sekolah_id: string;
    }, response: Response): Promise<{
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
        status: string;
        message: string;
        sekolah: {
            sekolah_id: string;
            nama: string;
            npsn: string;
            bentuk_pendidikan_id: number;
        };
        appKey: {
            sekolah_id: string;
            created_at: Date;
            updated_at: Date;
            is_active: boolean;
            id: string;
            nama_app: string;
            key_api: string;
            key_webService: string | null;
            key_adminPanel: string | null;
            domain: string | null;
        } | {
            id: string;
            nama_app: string;
            sekolah_id: string;
            key_api: string;
            domain: string;
            is_active: true;
        };
    }>;
    getSystemInfo(request: Request): Promise<{
        isConfigured: boolean;
        registeredDomain: string;
    }>;
    getPublicProfile(id: string): Promise<{
        id: string;
        nama: string;
        nisn: string;
        jenis_kelamin: string;
        tipe: string;
        rombel: string;
        sekolah: string;
        hasFoto: boolean;
        alamat: string;
        nuptk?: undefined;
        unit_kerja?: undefined;
    } | {
        id: string;
        nama: string;
        nuptk: string;
        jenis_kelamin: string;
        tipe: string;
        unit_kerja: string;
        rombel: string;
        sekolah: string;
        hasFoto: boolean;
        alamat: string;
        nisn?: undefined;
    }>;
    getPublicProfilePhoto(id: string, res: Response): Promise<void>;
    systemSetup(apiKey: string, request: Request): Promise<{
        sekolah_id: string;
        created_at: Date;
        updated_at: Date;
        is_active: boolean;
        id: string;
        nama_app: string;
        key_api: string;
        key_webService: string | null;
        key_adminPanel: string | null;
        domain: string | null;
    }>;
    private getRequestDomain;
    private setRefreshTokenCookie;
}
