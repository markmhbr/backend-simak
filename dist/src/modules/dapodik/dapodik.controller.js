"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DapodikController = void 0;
const common_1 = require("@nestjs/common");
const dapodik_service_1 = require("./dapodik.service");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
const platform_express_1 = require("@nestjs/platform-express");
let DapodikController = class DapodikController {
    dapodikService;
    constructor(dapodikService) {
        this.dapodikService = dapodikService;
    }
    getSekolahInfo(req) {
        if (req['isMandala']) {
            const querySekolahId = req.query.sekolah_id;
            if (!querySekolahId) {
                throw new common_1.BadRequestException('sekolah_id query parameter is required for Mandala integration.');
            }
            return {
                sekolahId: querySekolahId,
                namaApp: 'Mandala Integration',
            };
        }
        const appKey = req['appKey'];
        return {
            sekolahId: appKey?.sekolah_id || null,
            namaApp: appKey?.nama_app || '',
        };
    }
    async getCadisdikList() {
        const data = await this.dapodikService.getCadisdiks();
        return {
            status: 'success',
            data,
        };
    }
    async getLayananMaster(kategori) {
        const data = await this.dapodikService.getLayananMaster(kategori ? parseInt(kategori, 10) : undefined);
        return {
            status: 'success',
            data,
        };
    }
    async getSummarySummary(req) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getSummary(sekolahId);
        return {
            status: 'success',
            klien: namaApp,
            data,
        };
    }
    async getSekolahInfoDetail(req) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getSekolah(sekolahId);
        return {
            status: 'success',
            klien: namaApp,
            data,
        };
    }
    async updateSekolahInfoDetail(req, body) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.updateSekolah(sekolahId, body);
        return {
            status: 'success',
            klien: namaApp,
            data,
        };
    }
    async uploadSekolahLogo(req, file) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.uploadLogo(sekolahId, file);
        return {
            status: 'success',
            klien: namaApp,
            data,
        };
    }
    async uploadSiswaFoto(req, uuid, file) {
        if (!file) {
            throw new common_1.BadRequestException('Berkas foto wajib disertakan.');
        }
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        try {
            const data = await this.dapodikService.uploadSiswaFoto(sekolahId, uuid, file);
            return {
                status: 'success',
                klien: namaApp,
                data,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message);
        }
    }
    async uploadGtkFoto(req, uuid, file) {
        if (!file) {
            throw new common_1.BadRequestException('Berkas foto wajib disertakan.');
        }
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        try {
            const data = await this.dapodikService.uploadGtkFoto(sekolahId, uuid, file);
            return {
                status: 'success',
                klien: namaApp,
                data,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message);
        }
    }
    async uploadSiswaDokumen(req, uuid, namaDokumen, file) {
        if (!file) {
            throw new common_1.BadRequestException('Berkas dokumen wajib disertakan.');
        }
        if (!namaDokumen) {
            throw new common_1.BadRequestException('Parameter nama_dokumen wajib diisi.');
        }
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        try {
            const data = await this.dapodikService.uploadSiswaDokumen(sekolahId, uuid, file, namaDokumen);
            return {
                status: 'success',
                klien: namaApp,
                data,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message);
        }
    }
    async uploadGtkDokumen(req, uuid, namaDokumen, file) {
        if (!file) {
            throw new common_1.BadRequestException('Berkas dokumen wajib disertakan.');
        }
        if (!namaDokumen) {
            throw new common_1.BadRequestException('Parameter nama_dokumen wajib diisi.');
        }
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        try {
            const data = await this.dapodikService.uploadGtkDokumen(sekolahId, uuid, file, namaDokumen);
            return {
                status: 'success',
                klien: namaApp,
                data,
            };
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message);
        }
    }
    async deleteGtkDokumen(req, uuid, fileName) {
        const { sekolahId } = this.getSekolahInfo(req);
        try {
            await this.dapodikService.deleteGtkDokumen(sekolahId, uuid, fileName);
            return { status: 'success', message: 'Dokumen berhasil dihapus' };
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message);
        }
    }
    async deleteSiswaDokumen(req, uuid, fileName) {
        const { sekolahId } = this.getSekolahInfo(req);
        try {
            await this.dapodikService.deleteSiswaDokumen(sekolahId, uuid, fileName);
            return { status: 'success', message: 'Dokumen berhasil dihapus' };
        }
        catch (err) {
            throw new common_1.BadRequestException(err.message);
        }
    }
    async getGtkRekapKategori(req) {
        const { sekolahId } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getGtkRekapKategori(sekolahId);
        return { status: 'success', data };
    }
    async getGtkRekapPendidikan(req) {
        const { sekolahId } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getGtkRekapPendidikan(sekolahId);
        return { status: 'success', data };
    }
    async getGtkRekapUsia(req) {
        const { sekolahId } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getGtkRekapUsia(sekolahId);
        return { status: 'success', data };
    }
    async getTanahList(req, limit, search, page) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const take = limit ? parseInt(limit, 10) : 10;
        const skipPage = page ? parseInt(page, 10) : 1;
        const { data, total } = await this.dapodikService.getTanah(sekolahId, take, search, skipPage);
        return {
            status: 'success',
            klien: namaApp,
            data,
            meta: {
                total,
                page: skipPage,
                limit: take,
                total_pages: Math.ceil(total / take)
            }
        };
    }
    async getTahunPelajaranList(req) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getTahunPelajaran(sekolahId);
        return {
            status: 'success',
            klien: namaApp,
            data,
        };
    }
    async getBangunanList(req, limit, search, page) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const take = limit ? parseInt(limit, 10) : 10;
        const skipPage = page ? parseInt(page, 10) : 1;
        const { data, total } = await this.dapodikService.getBangunan(sekolahId, take, search, skipPage);
        return {
            status: 'success',
            klien: namaApp,
            data,
            meta: {
                total,
                page: skipPage,
                limit: take,
                total_pages: Math.ceil(total / take)
            }
        };
    }
    async getRuangList(req, limit, search, page) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const take = limit ? parseInt(limit, 10) : 10;
        const skipPage = page ? parseInt(page, 10) : 1;
        const { data, total } = await this.dapodikService.getRuang(sekolahId, take, search, skipPage);
        return {
            status: 'success',
            klien: namaApp,
            data,
            meta: {
                total,
                page: skipPage,
                limit: take,
                total_pages: Math.ceil(total / take)
            }
        };
    }
    async getPdRekapTingkat(req) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getPdRekapTingkat(sekolahId);
        return {
            status: 'success',
            klien: namaApp,
            data,
        };
    }
    async getPdRekapKompetensi(req) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getPdRekapKompetensi(sekolahId);
        return {
            status: 'success',
            klien: namaApp,
            data,
        };
    }
    async getPdRekapUsia(req) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getPdRekapUsia(sekolahId);
        return {
            status: 'success',
            klien: namaApp,
            data,
        };
    }
    async getPesertaDidikList(req, limit, search, page, rombelName, status, tingkat, sekolahIdQuery) {
        if (req['isMandala']) {
            if (!sekolahIdQuery) {
                throw new common_1.BadRequestException('sekolah_id query parameter is required for Mandala integration.');
            }
            const take = limit ? parseInt(limit, 10) : 10;
            const skipPage = page ? parseInt(page, 10) : 1;
            return await this.dapodikService.getPesertaDidikForMandala(sekolahIdQuery, {
                limit: take,
                page: skipPage,
                search,
                status,
            });
        }
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const take = limit ? parseInt(limit, 10) : 10;
        const skipPage = page ? parseInt(page, 10) : 1;
        const { data, total } = await this.dapodikService.getPesertaDidik(sekolahId, take, search, skipPage, rombelName, status, tingkat);
        return {
            status: 'success',
            klien: namaApp,
            data,
            meta: {
                total,
                page: skipPage,
                limit: take,
                total_pages: Math.ceil(total / take)
            }
        };
    }
    async getRombelRekapKategori(req) {
        const { sekolahId } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getRombelRekapKategori(sekolahId);
        return { status: 'success', data };
    }
    async getRombelRekapKompetensi(req) {
        const { sekolahId } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getRombelRekapKompetensi(sekolahId);
        return { status: 'success', data };
    }
    async getRombonganBelajarList(req, type, limit, page, search, tingkat) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const take = limit ? parseInt(limit, 10) : 10;
        const skipPage = page ? parseInt(page, 10) : 1;
        const { total, data } = await this.dapodikService.getRombonganBelajar(sekolahId, type, take, skipPage, search, tingkat);
        return {
            status: 'success',
            klien: namaApp,
            data,
            meta: {
                total,
                page: skipPage,
                limit: take,
                total_pages: Math.ceil(total / take)
            }
        };
    }
    async getRombelAnggota(id) {
        const data = await this.dapodikService.getRombelAnggota(id);
        return {
            status: 'success',
            data,
        };
    }
    async getRombelPembelajaran(id) {
        const data = await this.dapodikService.getRombelPembelajaran(id);
        return {
            status: 'success',
            data,
        };
    }
    async getEkstrakurikulerList(req, search) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getEkstrakurikuler(sekolahId, search);
        return {
            status: 'success',
            klien: namaApp,
            count: data.length,
            data,
        };
    }
    async getJurusanList(req) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getJurusan(sekolahId);
        return {
            status: 'success',
            klien: namaApp,
            data,
        };
    }
    async getMataPelajaranList(req, limit, search, page) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const take = limit ? parseInt(limit, 10) : 10;
        const skipPage = page ? parseInt(page, 10) : 1;
        const { data, total } = await this.dapodikService.getMataPelajaran(sekolahId, take, search, skipPage);
        return {
            status: 'success',
            klien: namaApp,
            data,
            meta: {
                total,
                page: skipPage,
                limit: take,
                total_pages: Math.ceil(total / take)
            }
        };
    }
    async getAllPembelajaran(req) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getAllPembelajaran(sekolahId);
        return { status: 'success', klien: namaApp, data };
    }
    async getGtkList(req, limit, search, page, type, status) {
        const { sekolahId, namaApp } = this.getSekolahInfo(req);
        const take = limit ? parseInt(limit, 10) : 10;
        const skipPage = page ? parseInt(page, 10) : 1;
        const { data, total } = await this.dapodikService.getGtk(sekolahId, take, search, skipPage, type, status);
        return {
            status: 'success',
            klien: namaApp,
            data,
            meta: {
                total,
                page: skipPage,
                limit: take,
                total_pages: Math.ceil(total / take)
            }
        };
    }
    async getGtkDetail(req, id) {
        const { sekolahId } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getGtkById(sekolahId, id);
        return { status: 'success', data };
    }
    async updateGtkDetail(req, id, body) {
        const { sekolahId } = this.getSekolahInfo(req);
        const data = await this.dapodikService.updateGtk(sekolahId, id, body);
        return { status: 'success', data };
    }
    async getPesertaDidikDetail(req, id) {
        const { sekolahId } = this.getSekolahInfo(req);
        const data = await this.dapodikService.getPesertaDidikById(sekolahId, id);
        return { status: 'success', data };
    }
    async updatePesertaDidikDetail(req, id, body) {
        const { sekolahId } = this.getSekolahInfo(req);
        const data = await this.dapodikService.updatePesertaDidik(sekolahId, id, body);
        return { status: 'success', data };
    }
};
exports.DapodikController = DapodikController;
__decorate([
    (0, common_1.Get)('cadisdik'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getCadisdikList", null);
__decorate([
    (0, common_1.Get)('master-layanan'),
    __param(0, (0, common_1.Query)('kategori')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getLayananMaster", null);
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getSummarySummary", null);
__decorate([
    (0, common_1.Get)('sekolah'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getSekolahInfoDetail", null);
__decorate([
    (0, common_1.Patch)('sekolah'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "updateSekolahInfoDetail", null);
__decorate([
    (0, common_1.Post)('sekolah/logo'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logo')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "uploadSekolahLogo", null);
__decorate([
    (0, common_1.Post)('siswa/:uuid/upload-foto'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('uuid')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "uploadSiswaFoto", null);
__decorate([
    (0, common_1.Post)('gtk/:uuid/upload-foto'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('uuid')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "uploadGtkFoto", null);
__decorate([
    (0, common_1.Post)('siswa/:uuid/upload-dokumen'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('uuid')),
    __param(2, (0, common_1.Body)('nama_dokumen')),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "uploadSiswaDokumen", null);
__decorate([
    (0, common_1.Post)('gtk/:uuid/upload-dokumen'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('uuid')),
    __param(2, (0, common_1.Body)('nama_dokumen')),
    __param(3, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "uploadGtkDokumen", null);
__decorate([
    (0, common_1.Delete)('gtk/:uuid/dokumen/:fileName'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('uuid')),
    __param(2, (0, common_1.Param)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "deleteGtkDokumen", null);
__decorate([
    (0, common_1.Delete)('siswa/:uuid/dokumen/:fileName'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('uuid')),
    __param(2, (0, common_1.Param)('fileName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "deleteSiswaDokumen", null);
__decorate([
    (0, common_1.Get)('gtk/rekap-kategori'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getGtkRekapKategori", null);
__decorate([
    (0, common_1.Get)('gtk/rekap-pendidikan'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getGtkRekapPendidikan", null);
__decorate([
    (0, common_1.Get)('gtk/rekap-usia'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getGtkRekapUsia", null);
__decorate([
    (0, common_1.Get)('tanah'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getTanahList", null);
__decorate([
    (0, common_1.Get)('tahun-pelajaran'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getTahunPelajaranList", null);
__decorate([
    (0, common_1.Get)('bangunan'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getBangunanList", null);
__decorate([
    (0, common_1.Get)('ruang'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getRuangList", null);
__decorate([
    (0, common_1.Get)('peserta-didik/rekap-tingkat'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getPdRekapTingkat", null);
__decorate([
    (0, common_1.Get)('peserta-didik/rekap-kompetensi'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getPdRekapKompetensi", null);
__decorate([
    (0, common_1.Get)('peserta-didik/rekap-usia'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getPdRekapUsia", null);
__decorate([
    (0, common_1.Get)('peserta-didik'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('rombelName')),
    __param(5, (0, common_1.Query)('status')),
    __param(6, (0, common_1.Query)('tingkat')),
    __param(7, (0, common_1.Query)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getPesertaDidikList", null);
__decorate([
    (0, common_1.Get)('rombongan-belajar/rekap-kategori'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getRombelRekapKategori", null);
__decorate([
    (0, common_1.Get)('rombongan-belajar/rekap-kompetensi'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getRombelRekapKompetensi", null);
__decorate([
    (0, common_1.Get)('rombongan-belajar'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('tingkat')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getRombonganBelajarList", null);
__decorate([
    (0, common_1.Get)('rombongan-belajar/:id/anggota'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getRombelAnggota", null);
__decorate([
    (0, common_1.Get)('rombongan-belajar/:id/pembelajaran'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getRombelPembelajaran", null);
__decorate([
    (0, common_1.Get)('ekstrakurikuler'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getEkstrakurikulerList", null);
__decorate([
    (0, common_1.Get)('jurusan'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getJurusanList", null);
__decorate([
    (0, common_1.Get)('mata-pelajaran'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getMataPelajaranList", null);
__decorate([
    (0, common_1.Get)('pembelajaran'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getAllPembelajaran", null);
__decorate([
    (0, common_1.Get)('gtk'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('type')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getGtkList", null);
__decorate([
    (0, common_1.Get)('gtk/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getGtkDetail", null);
__decorate([
    (0, common_1.Patch)('gtk/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "updateGtkDetail", null);
__decorate([
    (0, common_1.Get)('peserta-didik/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "getPesertaDidikDetail", null);
__decorate([
    (0, common_1.Patch)('peserta-didik/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], DapodikController.prototype, "updatePesertaDidikDetail", null);
exports.DapodikController = DapodikController = __decorate([
    (0, common_1.Controller)('dapodik'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [dapodik_service_1.DapodikService])
], DapodikController);
//# sourceMappingURL=dapodik.controller.js.map