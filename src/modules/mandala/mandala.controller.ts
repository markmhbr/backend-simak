import { Controller, Get, Post, Body, Param, UseGuards, HttpStatus, HttpCode, NotFoundException, Query, BadRequestException, Patch, Delete, Req, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { MandalaService } from './mandala.service';
import { MandalaKeyGuard } from '../../core/mandala/mandala-key.guard';

@Controller('mandala')
export class MandalaController {
  constructor(private readonly mandalaService: MandalaService) {}

  @Get('connection')
  async getConnection() {
    const config = await this.mandalaService.getConnection();
    if (!config) {
      throw new NotFoundException('Mandala connection is not configured yet.');
    }
    return {
      status: 'success',
      data: config,
    };
  }

  @Post('connection')
  @HttpCode(HttpStatus.OK)
  async updateConnection(@Body() body: { key: string; url_mandala: string }) {
    if (!body.key || !body.url_mandala) {
      return {
        status: 'error',
        message: 'Both key and url_mandala are required.',
      };
    }
    const result = await this.mandalaService.saveOrUpdateConnection(body.key, body.url_mandala);
    return {
      status: 'success',
      message: 'Mandala connection successfully updated.',
      data: result,
    };
  }

  @Get('sekolah')
  @UseGuards(MandalaKeyGuard)
  async getSchools() {
    const data = await this.mandalaService.getSchools();
    return {
      status: 'success',
      data,
    };
  }

  @Get('wilayah/provinsi')
  @UseGuards(MandalaKeyGuard)
  async getProvinsiList() {
    const data = await this.mandalaService.getAllProvinsi();
    return {
      status: 'success',
      data,
    };
  }

  @Get('wilayah/kabupaten')
  @UseGuards(MandalaKeyGuard)
  async getKabupatenList(@Query('provinsi') provinsiNama: string) {
    const data = await this.mandalaService.getKabupatenByProvinsi(provinsiNama);
    return {
      status: 'success',
      data,
    };
  }

  // --- CADISDIK ENDPOINTS ---

  @Get('cadisdik')
  @UseGuards(MandalaKeyGuard)
  async getCadisdiks() {
    const data = await this.mandalaService.getCadisdiks();
    return {
      status: 'success',
      data,
    };
  }

  @Get('cadisdik/:id')
  @UseGuards(MandalaKeyGuard)
  async getCadisdikDetail(@Param('id') id: string) {
    const data = await this.mandalaService.getCadisdikById(id);
    return {
      status: 'success',
      data,
    };
  }

  @Post('cadisdik')
  @UseGuards(MandalaKeyGuard)
  async createCadisdik(@Body() body: any) {
    if (!body.nama_instansi) {
      throw new BadRequestException('nama_instansi is required.');
    }
    const data = await this.mandalaService.createCadisdik(body);
    return {
      status: 'success',
      message: 'Cadisdik successfully created.',
      data,
    };
  }

  @Patch('cadisdik/:id')
  @UseGuards(MandalaKeyGuard)
  async updateCadisdik(@Param('id') id: string, @Body() body: any) {
    const data = await this.mandalaService.updateCadisdik(id, body);
    return {
      status: 'success',
      message: 'Cadisdik successfully updated.',
      data,
    };
  }

  @Delete('cadisdik/:id')
  @UseGuards(MandalaKeyGuard)
  async deleteCadisdik(@Param('id') id: string) {
    await this.mandalaService.deleteCadisdik(id);
    return {
      status: 'success',
      message: 'Cadisdik successfully deleted.',
    };
  }

  // --- KATEGORI KEPERLUAN ENDPOINTS ---

  @Get('kategori-keperluan')
  @UseGuards(MandalaKeyGuard)
  async getKategoriKeperluan(@Query('cadisdik_id') cadisdikId?: string) {
    const data = await this.mandalaService.getKategoriKeperluan(cadisdikId);
    return {
      status: 'success',
      data,
    };
  }

  @Post('kategori-keperluan')
  @UseGuards(MandalaKeyGuard)
  async createKategoriKeperluan(@Body() body: any) {
    if (!body.cadisdik_id || !body.nama) {
      throw new BadRequestException('cadisdik_id and nama are required.');
    }
    const data = await this.mandalaService.createKategoriKeperluan(body);
    return {
      status: 'success',
      message: 'Kategori keperluan successfully created.',
      data,
    };
  }

  @Patch('kategori-keperluan/:id')
  @UseGuards(MandalaKeyGuard)
  async updateKategoriKeperluan(@Param('id') id: string, @Body() body: any) {
    const data = await this.mandalaService.updateKategoriKeperluan(id, body);
    return {
      status: 'success',
      message: 'Kategori keperluan successfully updated.',
      data,
    };
  }

  @Delete('kategori-keperluan/:id')
  @UseGuards(MandalaKeyGuard)
  async deleteKategoriKeperluan(@Param('id') id: string) {
    await this.mandalaService.deleteKategoriKeperluan(id);
    return {
      status: 'success',
      message: 'Kategori keperluan successfully deleted.',
    };
  }

  // --- ANTRIAN ENDPOINTS ---

  @Get('antrian')
  @UseGuards(MandalaKeyGuard)
  async getAntrian(
    @Query('cadisdik_id') cadisdikId?: string,
    @Query('status') status?: string,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
  ) {
    const data = await this.mandalaService.getAntrian({
      cadisdik_id: cadisdikId,
      status: status !== undefined ? parseInt(status, 10) : undefined,
      start_date: startDate,
      end_date: endDate,
    });
    return {
      status: 'success',
      data,
    };
  }

  @Post('antrian')
  @UseGuards(MandalaKeyGuard)
  async createAntrian(@Body() body: any) {
    if (!body.cadisdik_id || !body.kategori_keperluan_id || !body.nama_lengkap) {
      throw new BadRequestException('cadisdik_id, kategori_keperluan_id, and nama_lengkap are required.');
    }
    const data = await this.mandalaService.createAntrian(body);
    return {
      status: 'success',
      message: 'Antrian successfully created.',
      data,
    };
  }

  @Patch('antrian/:id/status')
  @UseGuards(MandalaKeyGuard)
  async updateAntrianStatus(@Param('id') id: string, @Body('status') status: number) {
    if (status === undefined) {
      throw new BadRequestException('status is required.');
    }
    const data = await this.mandalaService.updateAntrianStatus(id, status);
    return {
      status: 'success',
      message: 'Antrian status successfully updated.',
      data,
    };
  }

  @Get('antrian/rekap')
  @UseGuards(MandalaKeyGuard)
  async getAntrianRekap(@Query('cadisdik_id') cadisdikId?: string) {
    const data = await this.mandalaService.getAntrianSummary(cadisdikId);
    return {
      status: 'success',
      data,
    };
  }

  // --- JENIS JABATAN ENDPOINTS ---

  @Get('jenis-jabatan')
  @UseGuards(MandalaKeyGuard)
  async getJenisJabatans() {
    const data = await this.mandalaService.getJenisJabatans();
    return {
      status: 'success',
      data,
    };
  }

  @Get('jenis-jabatan/:id')
  @UseGuards(MandalaKeyGuard)
  async getJenisJabatanDetail(@Param('id') id: string) {
    const data = await this.mandalaService.getJenisJabatanById(id);
    return {
      status: 'success',
      data,
    };
  }

  @Post('jenis-jabatan')
  @UseGuards(MandalaKeyGuard)
  async createJenisJabatan(@Body() body: { nama: string }) {
    if (!body.nama || body.nama.trim() === '') {
      throw new BadRequestException('nama is required.');
    }
    const data = await this.mandalaService.createJenisJabatan(body);
    return {
      status: 'success',
      message: 'Jenis Jabatan successfully created.',
      data,
    };
  }

  @Patch('jenis-jabatan/:id')
  @UseGuards(MandalaKeyGuard)
  async updateJenisJabatan(@Param('id') id: string, @Body() body: { nama: string }) {
    if (!body.nama || body.nama.trim() === '') {
      throw new BadRequestException('nama is required.');
    }
    const data = await this.mandalaService.updateJenisJabatan(id, body);
    return {
      status: 'success',
      message: 'Jenis Jabatan successfully updated.',
      data,
    };
  }

  @Delete('jenis-jabatan/:id')
  @UseGuards(MandalaKeyGuard)
  async deleteJenisJabatan(@Param('id') id: string) {
    await this.mandalaService.deleteJenisJabatan(id);
    return {
      status: 'success',
      message: 'Jenis Jabatan successfully deleted.',
    };
  }

  // --- PEGAWAI ENDPOINTS ---

  @Post('auth/login')
  @HttpCode(HttpStatus.OK)
  async loginPegawai(@Body() body: any) {
    if (!body.identifier || !body.password) {
      throw new BadRequestException('identifier (NIP/Email) and password are required.');
    }
    return await this.mandalaService.loginPegawai(body);
  }

  @Post('auth/verify-2fa')
  @HttpCode(HttpStatus.OK)
  async verify2FA(@Body() body: { tempToken: string; code: string; secretToSave?: string }) {
    if (!body.tempToken || !body.code) {
      throw new BadRequestException('tempToken and code are required.');
    }
    return await this.mandalaService.verify2FAPegawai(body.tempToken, body.code, body.secretToSave);
  }

  @Post('auth/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('refreshToken is required.');
    }
    return await this.mandalaService.refreshTokensPegawai(refreshToken);
  }

  @Get('pegawai')
  @UseGuards(MandalaKeyGuard)
  async getPegawais(@Query('cadisdik_id') cadisdikId?: string) {
    const data = await this.mandalaService.getPegawais(cadisdikId);
    return {
      status: 'success',
      data,
    };
  }

  @Get('pegawai/:id')
  @UseGuards(MandalaKeyGuard)
  async getPegawaiDetail(@Param('id') id: string) {
    const data = await this.mandalaService.getPegawaiById(id);
    return {
      status: 'success',
      data,
    };
  }

  @Post('pegawai')
  @UseGuards(MandalaKeyGuard)
  async createPegawai(@Body() body: any) {
    if (
      !body.cadisdik_id ||
      !body.nama_lengkap ||
      !body.nik ||
      !body.tempat_lahir ||
      !body.tanggal_lahir ||
      !body.alamat_lengkap ||
      !body.email ||
      !body.password ||
      (body.jabatan === undefined && !body.jenis_jabatan_id) ||
      body.jenis_kelamin === undefined
    ) {
      throw new BadRequestException(
        'Required fields: cadisdik_id, nama_lengkap, nik, tempat_lahir, tanggal_lahir, alamat_lengkap, email, password, jenis_kelamin. Either jabatan or jenis_jabatan_id must be provided.',
      );
    }
    const data = await this.mandalaService.createPegawai(body);
    return {
      status: 'success',
      message: 'Pegawai successfully created.',
      data,
    };
  }

  @Patch('pegawai/:id')
  @UseGuards(MandalaKeyGuard)
  async updatePegawai(@Param('id') id: string, @Body() body: any) {
    const data = await this.mandalaService.updatePegawai(id, body);
    return {
      status: 'success',
      message: 'Pegawai successfully updated.',
      data,
    };
  }

  @Delete('pegawai/:id')
  @UseGuards(MandalaKeyGuard)
  async deletePegawai(@Param('id') id: string) {
    await this.mandalaService.deletePegawai(id);
    return {
      status: 'success',
      message: 'Pegawai successfully deleted.',
    };
  }

  @Post('pegawai/:id/reset-2fa')
  @UseGuards(MandalaKeyGuard)
  @HttpCode(HttpStatus.OK)
  async reset2FAPegawai(@Param('id') id: string) {
    await this.mandalaService.reset2FAPegawai(id);
    return {
      status: 'success',
      message: 'Pegawai 2FA successfully reset.',
    };
  }

  // --- MAPPING PENGAWAS ENDPOINTS ---

  @Get('mapping-pengawas')
  @UseGuards(MandalaKeyGuard)
  async getMappingPengawas(@Query('pegawai_id') pegawaiId?: string, @Query('sekolah_id') sekolahId?: string) {
    const data = await this.mandalaService.getMappingPengawas(pegawaiId, sekolahId);
    return {
      status: 'success',
      data,
    };
  }

  @Post('mapping-pengawas')
  @UseGuards(MandalaKeyGuard)
  async createMappingPengawas(@Body() body: any) {
    if (!body.pegawai_id || !body.sekolah_id) {
      throw new BadRequestException('pegawai_id and sekolah_id are required.');
    }
    const data = await this.mandalaService.createMappingPengawas(body);
    return {
      status: 'success',
      message: 'Mapping Pengawas successfully created.',
      data,
    };
  }

  @Delete('mapping-pengawas/:id')
  @UseGuards(MandalaKeyGuard)
  async deleteMappingPengawas(@Param('id') id: string) {
    await this.mandalaService.deleteMappingPengawas(id);
    return {
      status: 'success',
      message: 'Mapping Pengawas successfully deleted.',
    };
  }

  @Get('sekolah/:id')
  @UseGuards(MandalaKeyGuard)
  async getSchoolDetail(@Param('id') id: string) {
    const data = await this.mandalaService.getSchoolDetail(id);
    if (!data) {
      throw new NotFoundException(`School with ID ${id} not found.`);
    }
    return {
      status: 'success',
      data,
    };
  }

  @Get('sekolah/:id/summary')
  @UseGuards(MandalaKeyGuard)
  async getSchoolSummary(@Param('id') id: string) {
    const data = await this.mandalaService.getSchoolSummary(id);
    if (!data) {
      throw new NotFoundException(`School with ID ${id} not found.`);
    }
    return {
      status: 'success',
      data,
    };
  }

  @Get('dapodik/peserta-didik')
  @UseGuards(MandalaKeyGuard)
  async getPesertaDidik(
    @Query('sekolah_id') sekolahId?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('status') status?: 'aktif' | 'non-aktif'
  ) {
    let take = limit ? parseInt(limit, 10) : 10;
    if (take > 100) {
      take = 100; // Cap at 100 to optimize performance
    }
    const skipPage = page ? parseInt(page, 10) : 1;
    return await this.mandalaService.getPesertaDidikForMandala(sekolahId, {
      limit: take,
      page: skipPage,
      search,
      status
    });
  }

  @Get('dapodik/gtk')
  @UseGuards(MandalaKeyGuard)
  async getGtk(
    @Query('sekolah_id') sekolahId?: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('status') status?: 'aktif' | 'non-aktif',
    @Query('type') type?: 'guru' | 'tendik',
    @Query('tab') tab?: string
  ) {
    if (tab === 'rekap') {
      return await this.mandalaService.getGtkRekapForMandala(sekolahId);
    }
    let take = limit ? parseInt(limit, 10) : 10;
    if (take > 100) {
      take = 100; // Cap at 100 to optimize performance
    }
    const skipPage = page ? parseInt(page, 10) : 1;
    return await this.mandalaService.getGtkForMandala(sekolahId, {
      limit: take,
      page: skipPage,
      search,
      status,
      type
    });
  }

  @Get('presensi/peserta-didik')
  @UseGuards(MandalaKeyGuard)
  async getPesertaDidikPresence(
    @Query('sekolah_id') sekolahId: string,
    @Query('tanggal') tanggal?: string,
  ) {
    if (!sekolahId) {
      throw new BadRequestException('sekolah_id is required.');
    }
    const date = tanggal ? new Date(tanggal) : new Date();
    const data = await this.mandalaService.getPesertaDidikPresenceForMandala(sekolahId, date);
    return {
      status: 'success',
      data,
    };
  }

  @Get('presensi/gtk')
  @UseGuards(MandalaKeyGuard)
  async getGtkPresence(
    @Query('sekolah_id') sekolahId: string,
    @Query('tanggal') tanggal?: string,
  ) {
    if (!sekolahId) {
      throw new BadRequestException('sekolah_id is required.');
    }
    const date = tanggal ? new Date(tanggal) : new Date();
    const data = await this.mandalaService.getGtkPresenceForMandala(sekolahId, date);
    return {
      status: 'success',
      data,
    };
  }

  @Get('presensi/peserta-didik/summary')
  @UseGuards(MandalaKeyGuard)
  async getPesertaDidikPresenceSummary(
    @Query('sekolah_id') sekolahId: string,
    @Query('tahun') tahun?: string,
  ) {
    if (!sekolahId) {
      throw new BadRequestException('sekolah_id is required.');
    }
    const year = tahun ? parseInt(tahun, 10) : new Date().getFullYear();
    const data = await this.mandalaService.getPesertaDidikAnnualSummaryForMandala(sekolahId, year);
    return {
      status: 'success',
      data,
    };
  }

  @Get('presensi/gtk/summary')
  @UseGuards(MandalaKeyGuard)
  async getGtkPresenceSummary(
    @Query('sekolah_id') sekolahId: string,
    @Query('tahun') tahun?: string,
  ) {
    if (!sekolahId) {
      throw new BadRequestException('sekolah_id is required.');
    }
    const year = tahun ? parseInt(tahun, 10) : new Date().getFullYear();
    const data = await this.mandalaService.getGtkAnnualSummaryForMandala(sekolahId, year);
    return {
      status: 'success',
      data,
    };
  }

  @Get('dapodik/semester_id')
  @UseGuards(MandalaKeyGuard)
  async getSemesterIds() {
    const data = await this.mandalaService.getSemestersForMandala();
    return {
      status: 'success',
      data,
    };
  }

  @Get('menu-roles')
  async getMenuRoles() {
    const data = await this.mandalaService.getMenuRoles();
    return {
      status: 'success',
      data,
    };
  }

  @Post('menu-roles')
  @HttpCode(HttpStatus.OK)
  async updateMenuRoles(@Body() body: { roles: Array<{ menu_key: string; jabatan_id?: number; jabatan_nama?: string; jenis_jabatan_id?: string }> }) {
    if (!body.roles || !Array.isArray(body.roles)) {
      throw new BadRequestException('Roles array is required.');
    }
    const result = await this.mandalaService.updateMenuRoles(body.roles);
    return {
      status: 'success',
      message: 'Menu roles successfully updated.',
      data: result,
    };
  }

  // --- MONITORING ENDPOINTS ---

  @Get('pengawas/sekolah-binaan')
  @UseGuards(MandalaKeyGuard)
  async getSekolahBinaan(@Req() req: any) {
    const user = req['user'];
    if (!user || !user.sub) {
      throw new UnauthorizedException('Invalid user token.');
    }
    const pegawaiId = user.sub;
    const cadisdikId = user.cadisdik_id;
    if (!cadisdikId) {
      throw new BadRequestException('cadisdik_id is missing from token.');
    }

    const data = await this.mandalaService.getSekolahBinaan(pegawaiId, cadisdikId);
    return {
      status: 'success',
      data,
    };
  }

  @Get('monitoring/jadwal')
  @UseGuards(MandalaKeyGuard)
  async getJadwalMonitoring(
    @Req() req: any,
    @Query('start_date') startDate?: string,
    @Query('end_date') endDate?: string,
    @Query('sekolah_id') sekolahId?: string,
    @Query('pegawai_id') pegawaiId?: string,
  ) {
    const user = req['user'];
    if (!user || !user.sub) {
      throw new UnauthorizedException('Invalid user token.');
    }
    const cadisdikId = user.cadisdik_id;
    if (!cadisdikId) {
      throw new BadRequestException('cadisdik_id is missing from token.');
    }

    let targetPegawaiId = pegawaiId;
    const isPengawas = Number(user.jabatan) === 6;
    if (isPengawas) {
      targetPegawaiId = user.sub;
    }

    const data = await this.mandalaService.getJadwalMonitoring(cadisdikId, {
      start_date: startDate,
      end_date: endDate,
      sekolah_id: sekolahId,
      pegawai_id: targetPegawaiId,
    });

    return {
      status: 'success',
      data,
    };
  }

  @Post('monitoring/jadwal')
  @UseGuards(MandalaKeyGuard)
  async createJadwalMonitoring(@Req() req: any, @Body() body: any) {
    const user = req['user'];
    if (!user || !user.sub) {
      throw new UnauthorizedException('Invalid user token.');
    }
    const cadisdikId = user.cadisdik_id;
    if (!cadisdikId) {
      throw new BadRequestException('cadisdik_id is missing from token.');
    }

    if (!body.sekolah_id || !body.tanggal_mulai || !body.tanggal_selesai || !body.agenda) {
      throw new BadRequestException('sekolah_id, tanggal_mulai, tanggal_selesai, and agenda are required.');
    }

    let targetPegawaiId = user.sub;
    const isPengawas = Number(user.jabatan) === 6;
    if (!isPengawas) {
      if (body.pegawai_id) {
        targetPegawaiId = body.pegawai_id;
      }
    }

    const data = await this.mandalaService.createJadwalMonitoring(cadisdikId, targetPegawaiId, body);
    return {
      status: 'success',
      message: 'Jadwal monitoring berhasil dibuat',
      data,
    };
  }

  @Patch('monitoring/jadwal/:id')
  @UseGuards(MandalaKeyGuard)
  async updateJadwalMonitoring(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const user = req['user'];
    if (!user || !user.sub) {
      throw new UnauthorizedException('Invalid user token.');
    }
    const cadisdikId = user.cadisdik_id;
    if (!cadisdikId) {
      throw new BadRequestException('cadisdik_id is missing from token.');
    }

    await this.mandalaService.updateJadwalMonitoring(id, cadisdikId, user, body);
    return {
      status: 'success',
      message: 'Jadwal monitoring berhasil diperbarui',
    };
  }

  @Delete('monitoring/jadwal/:id')
  @UseGuards(MandalaKeyGuard)
  async deleteJadwalMonitoring(@Req() req: any, @Param('id') id: string) {
    const user = req['user'];
    if (!user || !user.sub) {
      throw new UnauthorizedException('Invalid user token.');
    }
    const cadisdikId = user.cadisdik_id;
    if (!cadisdikId) {
      throw new BadRequestException('cadisdik_id is missing from token.');
    }

    await this.mandalaService.deleteJadwalMonitoring(id, cadisdikId, user);
    return {
      status: 'success',
      message: 'Jadwal monitoring berhasil dihapus',
    };
  }
}

