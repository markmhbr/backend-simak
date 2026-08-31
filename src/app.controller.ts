import { Controller, Get, UseGuards, Req, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiKeyGuard } from './core/app-key/api-key.guard';
import { PrismaService } from './core/prisma/prisma.service';
import type { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Universal Public Profile Redirect:
   * /p/:sekolahId/:id -> Cari domain sekolah di AppKey -> Redirect (302) ke ${domainSekolah}/public-profile/:id
   */
  @Get('p/:sekolahId/:id')
  async redirectProfile(
    @Param('sekolahId') sekolahId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const appKey = await this.prisma.appKey.findUnique({
        where: { sekolah_id: sekolahId },
      });

      if (appKey?.domain) {
        let cleanDomain = appKey.domain.replace(/\/+$/, '');
        if (cleanDomain.includes('localhost') || cleanDomain.includes('127.0.0.1')) {
          cleanDomain = cleanDomain.replace(/^https:\/\//, 'http://');
          if (!cleanDomain.startsWith('http://')) {
            cleanDomain = `http://${cleanDomain}`;
          }
        } else {
          if (!cleanDomain.startsWith('http://') && !cleanDomain.startsWith('https://')) {
            cleanDomain = `https://${cleanDomain}`;
          }
        }
        return res.redirect(302, `${cleanDomain}/public-profile/${id}`);
      }
    } catch (e) {}

    // Fallback: Jika domain sekolah belum terdaftar di AppKey
    let fallbackUrl = (process.env.APP_URL || '').replace(/\/+$/, '');
    if (fallbackUrl.includes('localhost') || fallbackUrl.includes('127.0.0.1')) {
      fallbackUrl = fallbackUrl.replace(/^https:\/\//, 'http://');
      if (!fallbackUrl.startsWith('http://')) {
        fallbackUrl = `http://${fallbackUrl}`;
      }
    } else if (!fallbackUrl.startsWith('http://') && !fallbackUrl.startsWith('https://')) {
      fallbackUrl = `https://${fallbackUrl}`;
    }
    return res.redirect(302, `${fallbackUrl}/public-profile/${id}`);
  }

  @Get('p/:id')
  async redirectProfileById(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    if (id.includes('/')) {
      const [sekolahId, userId] = id.split('/');
      return this.redirectProfile(sekolahId, userId, res);
    }

    try {
      const student = await this.prisma.pesertaDidik.findUnique({
        where: { peserta_didik_id: id },
        select: { sekolah_id: true },
      });
      const gtk = !student
        ? await this.prisma.gtk.findUnique({
            where: { ptk_id: id },
            select: { sekolah_id: true },
          })
        : null;

      const sekolahId = student?.sekolah_id || gtk?.sekolah_id;
      if (sekolahId) {
        return this.redirectProfile(sekolahId, id, res);
      }
    } catch (e) {}

    const fallbackUrl = (process.env.APP_URL || '').replace(/\/+$/, '');
    return res.redirect(302, `${fallbackUrl}/public-profile/${id}`);
  }

  @Get('test-protected')
  @UseGuards(ApiKeyGuard)
  getProtectedData(@Req() req: Request) {
    const appKey = req['appKey'];
    return {
      message: 'Selamat, Anda berhasil mengakses endpoint terproteksi!',
      app_info: {
        id: appKey.id,
        nama_app: appKey.nama_app,
        sekolah_id: appKey.sekolah_id,
        key_api: appKey.key_api,
      },
    };
  }
}

