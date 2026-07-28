import { Controller, Post, Body, Res, Req, UnauthorizedException, UseGuards, Get, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, Verify2faDto } from './dto/auth.dto';
import type { Response, Request } from 'express';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ThrottlerGuard, ApiKeyGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() request: Request) {
    // Ambil sekolahId dari appKey jika ada (diset oleh ApiKeyGuard)
    const appKey = request['appKey'];
    const sekolahId = appKey ? appKey.sekolah_id : undefined;

    return this.authService.validateUser(loginDto.username, loginDto.password, sekolahId);
  }

  @UseGuards(ThrottlerGuard, ApiKeyGuard)
  @Post('login-face-id')
  async loginFaceId(
    @Body('embedding') embedding: number[],
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const appKey = request['appKey'];
    const sekolahId = appKey ? appKey.sekolah_id : undefined;
    if (!sekolahId) {
      throw new UnauthorizedException('Koneksi sekolah tidak terdeteksi');
    }

    const result = await this.authService.loginWithFaceId(embedding, sekolahId);
    
    this.setRefreshTokenCookie(response, result.refreshToken);

    return {
      status: 'success',
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @UseGuards(ThrottlerGuard)
  @Post('verify-2fa')
  async verify2fa(
    @Body() verifyDto: Verify2faDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.verify2FA(verifyDto.tempToken, verifyDto.code, verifyDto.secret);
    
    // Simpan Refresh Token di HttpOnly Cookie
    this.setRefreshTokenCookie(response, result.refreshToken);

    // Kirim Access Token dan Data User di body
    return {
      status: 'success',
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Sesi berakhir');
    }

    const result = await this.authService.refreshTokens(refreshToken);
    this.setRefreshTokenCookie(response, result.refreshToken);

    return {
      status: 'success',
      accessToken: result.accessToken,
      user: result.user,
    };
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('refresh_token');
    return { status: 'success', message: 'Logout berhasil' };
  }

  @Post('reset-2fa')
  async reset2fa(@Body() body: { ptk_id?: string; peserta_didik_id?: string; pengguna_id?: string }) {
    return this.authService.reset2FA(body);
  }

  @UseGuards(ThrottlerGuard, ApiKeyGuard)
  @Post('reset-2fa/request')
  async requestReset2fa(
    @Body() body: LoginDto,
    @Req() request: Request,
  ) {
    const appKey = request['appKey'];
    const sekolahId = appKey ? appKey.sekolah_id : undefined;
    return this.authService.requestReset2FA(body.username, body.password, sekolahId);
  }

  @UseGuards(ThrottlerGuard)
  @Post('reset-2fa/verify')
  async verifyReset2fa(
    @Body() body: { resetToken: string; code: string },
  ) {
    return this.authService.verifyReset2FA(body.resetToken, body.code);
  }

  @UseGuards(ApiKeyGuard)
  @Get('me')
  async getMe(@Req() request: Request) {
    const user = request['user'] as any;
    if (!user) throw new UnauthorizedException('Sesi berakhir');
    return this.authService.getMe(user.sub);
  }

  // Endpoint untuk mendapatkan identitas sekolah (Public)
  @Get('system-info')
  async getSystemInfo(@Req() request: Request) {
    const domain = this.getRequestDomain(request);
    return this.authService.getSystemInfo(domain);
  }

  // Endpoint public profile untuk QR code scan (Public)
  @Get('public-profile/:id')
  async getPublicProfile(@Param('id') id: string) {
    return this.authService.getPublicProfile(id);
  }

  // Endpoint public profile photo (Public)
  @Get('public-profile/photo/:id')
  async getPublicProfilePhoto(@Param('id') id: string, @Res() res: Response) {
    return this.authService.getPublicProfilePhoto(id, res);
  }

  // Endpoint untuk setup awal oleh Operator
  @Post('system-setup')
  async systemSetup(@Body('apiKey') apiKey: string, @Req() request: Request) {
    const domain = this.getRequestDomain(request);
    return this.authService.setupSystem(apiKey, domain);
  }

  private getRequestDomain(request: Request): string {
    const origin = request.headers.origin as string;
    const referer = request.headers.referer as string;
    const host = request.headers.host;

    let domainToTest: string;
    if (origin) {
      domainToTest = origin.replace(/^https?:\/\//, '');
    } else if (referer) {
      try {
        const url = new URL(referer);
        domainToTest = url.host;
      } catch {
        domainToTest = host;
      }
    } else {
      domainToTest = host;
    }
    return domainToTest;
  }

  private setRefreshTokenCookie(response: Response, token: string) {
    response.cookie('refresh_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 hari
      path: '/api/auth/refresh', // Hanya dikirim ke endpoint refresh untuk keamanan ekstra
    });
  }
}
