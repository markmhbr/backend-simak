import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReferenceService } from './reference.service';
import { ApiKeyGuard } from '../../core/app-key/api-key.guard';

@Controller('reference')
@UseGuards(ApiKeyGuard)
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get('options')
  async getOptions() {
    const data = await this.referenceService.getAllOptions();
    return {
      status: 'success',
      data,
    };
  }

  @Get('agama')
  async getAgama() {
    return {
      status: 'success',
      data: await this.referenceService.getAgama(),
    };
  }

  @Get('bank')
  async getBank(@Query('search') search?: string) {
    return {
      status: 'success',
      data: await this.referenceService.getBank(search),
    };
  }

  @Get('jabatan-ptk')
  async getJabatanPtk() {
    return {
      status: 'success',
      data: await this.referenceService.getJabatanPtk(),
    };
  }

  @Get('jenis-ptk')
  async getJenisPtk() {
    return {
      status: 'success',
      data: await this.referenceService.getJenisPtk(),
    };
  }

  @Get('keahlian-laboratorium')
  async getKeahlianLaboratorium() {
    return {
      status: 'success',
      data: await this.referenceService.getKeahlianLaboratorium(),
    };
  }

  @Get('mst-wilayah')
  async getMstWilayah(@Query('search') search?: string, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 50;
    return {
      status: 'success',
      data: await this.referenceService.getMstWilayah(search, limitNum),
    };
  }

  @Get('wilayah')
  async getWilayah(@Query('level') level: string, @Query('parentCode') parentCode?: string) {
    const levelNum = parseInt(level, 10) || 1;
    return {
      status: 'success',
      data: await this.referenceService.getWilayahByParent(levelNum, parentCode),
    };
  }

  @Get('lembaga-pengangkat')
  async getLembagaPengangkat() {
    return {
      status: 'success',
      data: await this.referenceService.getLembagaPengangkat(),
    };
  }

  @Get('pangkat-golongan')
  async getPangkatGolongan() {
    return {
      status: 'success',
      data: await this.referenceService.getPangkatGolongan(),
    };
  }

  @Get('status-kepegawaian')
  async getStatusKepegawaian() {
    return {
      status: 'success',
      data: await this.referenceService.getStatusKepegawaian(),
    };
  }

  @Get('sumber-gaji')
  async getSumberGaji() {
    return {
      status: 'success',
      data: await this.referenceService.getSumberGaji(),
    };
  }

  @Get('alat-transportasi')
  async getAlatTransportasi() {
    return {
      status: 'success',
      data: await this.referenceService.getAlatTransportasi(),
    };
  }

  @Get('jenis-cita')
  async getJenisCita() {
    return {
      status: 'success',
      data: await this.referenceService.getJenisCita(),
    };
  }

  @Get('jenis-hobby')
  async getJenisHobby() {
    return {
      status: 'success',
      data: await this.referenceService.getJenisHobby(),
    };
  }

  @Get('alasan-layak-pip')
  async getAlasanLayakPip() {
    return {
      status: 'success',
      data: await this.referenceService.getAlasanLayakPip(),
    };
  }

  @Get('jenis-pendaftaran')
  async getJenisPendaftaran() {
    return {
      status: 'success',
      data: await this.referenceService.getJenisPendaftaran(),
    };
  }

  @Get('jenis-tinggal')
  async getJenisTinggal() {
    return {
      status: 'success',
      data: await this.referenceService.getJenisTinggal(),
    };
  }

  @Get('jenis-keluar')
  async getJenisKeluar() {
    return {
      status: 'success',
      data: await this.referenceService.getJenisKeluar(),
    };
  }

  @Get('kebutuhan-khusus')
  async getKebutuhanKhusus() {
    return {
      status: 'success',
      data: await this.referenceService.getKebutuhanKhusus(),
    };
  }

  @Get('pekerjaan')
  async getPekerjaan() {
    return {
      status: 'success',
      data: await this.referenceService.getPekerjaan(),
    };
  }

  @Get('jenjang-pendidikan')
  async getJenjangPendidikan() {
    return {
      status: 'success',
      data: await this.referenceService.getJenjangPendidikan(),
    };
  }

  @Get('penghasilan')
  async getPenghasilan() {
    return {
      status: 'success',
      data: await this.referenceService.getPenghasilan(),
    };
  }
}
