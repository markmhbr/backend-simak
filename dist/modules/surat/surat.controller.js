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
exports.SuratController = void 0;
const common_1 = require("@nestjs/common");
const surat_service_1 = require("./surat.service");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
let SuratController = class SuratController {
    suratService;
    constructor(suratService) {
        this.suratService = suratService;
    }
    getSekolahId(req) {
        const appKey = req['appKey'];
        if (!appKey || !appKey.sekolah_id) {
            throw new Error('Sekolah ID tidak terdeteksi dari API Key atau domain context.');
        }
        return appKey.sekolah_id;
    }
    async createPengaturanNomor(req, body) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.suratService.createPengaturanNomor(sekolahId, body);
        return {
            status: 'success',
            message: 'Pengaturan penomoran surat berhasil dibuat.',
            data,
        };
    }
    async getPengaturanNomorList(req) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.suratService.getPengaturanNomorList(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async updatePengaturanNomor(id, body) {
        const data = await this.suratService.updatePengaturanNomor(id, body);
        return {
            status: 'success',
            message: 'Pengaturan penomoran surat berhasil diperbarui.',
            data,
        };
    }
    async deletePengaturanNomor(id) {
        await this.suratService.deletePengaturanNomor(id);
        return {
            status: 'success',
            message: 'Pengaturan penomoran surat berhasil dihapus.',
        };
    }
    async createTemplate(req, body) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.suratService.createTemplate(sekolahId, body);
        return {
            status: 'success',
            message: 'Template surat berhasil disimpan.',
            data,
        };
    }
    async getTemplateList(req) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.suratService.getTemplateList(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async getTemplateDetail(id) {
        const data = await this.suratService.getTemplateDetail(id);
        return {
            status: 'success',
            data,
        };
    }
    async updateTemplate(id, body) {
        const data = await this.suratService.updateTemplate(id, body);
        return {
            status: 'success',
            message: 'Template surat berhasil diperbarui.',
            data,
        };
    }
    async deleteTemplate(id) {
        await this.suratService.deleteTemplate(id);
        return {
            status: 'success',
            message: 'Template surat berhasil dihapus.',
        };
    }
    async createSuratMasuk(req, body) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.suratService.createSuratMasuk(sekolahId, body);
        return {
            status: 'success',
            message: 'Surat masuk berhasil dicatat.',
            data,
        };
    }
    async getSuratMasukList(req, search, limit, page) {
        const sekolahId = this.getSekolahId(req);
        return await this.suratService.getSuratMasukList(sekolahId, { search, limit, page });
    }
    async updateSuratMasuk(id, body) {
        const data = await this.suratService.updateSuratMasuk(id, body);
        return {
            status: 'success',
            message: 'Surat masuk berhasil diperbarui.',
            data,
        };
    }
    async deleteSuratMasuk(id) {
        await this.suratService.deleteSuratMasuk(id);
        return {
            status: 'success',
            message: 'Surat masuk berhasil dihapus.',
        };
    }
    async createSuratKeluar(req, body) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.suratService.createSuratKeluar(sekolahId, body);
        return {
            status: 'success',
            message: 'Draft surat keluar berhasil dibuat.',
            data,
        };
    }
    async getSuratKeluarList(req, search, limit, page, status, kategori, sub) {
        const sekolahId = this.getSekolahId(req);
        return await this.suratService.getSuratKeluarList(sekolahId, {
            search,
            limit,
            page,
            status,
            kategori,
            sub,
        });
    }
    async getSuratKeluarDetail(id) {
        const data = await this.suratService.getSuratKeluarDetail(id);
        return {
            status: 'success',
            data,
        };
    }
    async updateSuratKeluar(id, body) {
        const data = await this.suratService.updateSuratKeluar(id, body);
        return {
            status: 'success',
            message: 'Draft surat keluar berhasil diperbarui.',
            data,
        };
    }
    async terbitkanSurat(id) {
        const data = await this.suratService.terbitkanSurat(id);
        return {
            status: 'success',
            message: 'Surat resmi berhasil diterbitkan.',
            data,
        };
    }
    async previewSurat(id) {
        const surat = await this.suratService.getSuratKeluarDetail(id);
        return {
            status: 'success',
            data: {
                konten_html: surat.isi_final_html,
                ukuran_kertas: surat.template_surat.ukuran_kertas,
                margin: {
                    atas: surat.template_surat.margin_atas,
                    bawah: surat.template_surat.margin_bawah,
                    kiri: surat.template_surat.margin_kiri,
                    kanan: surat.template_surat.margin_kanan,
                },
                nomor_surat: surat.nomor_surat || '[DRAFT - NOMOR AKAN CO-GENERATED SAAT TERBIT]',
                status: surat.status,
            },
        };
    }
    async deleteSuratKeluar(id) {
        await this.suratService.deleteSuratKeluar(id);
        return {
            status: 'success',
            message: 'Draft surat keluar berhasil dihapus.',
        };
    }
};
exports.SuratController = SuratController;
__decorate([
    (0, common_1.Post)('pengaturan'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "createPengaturanNomor", null);
__decorate([
    (0, common_1.Get)('pengaturan'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "getPengaturanNomorList", null);
__decorate([
    (0, common_1.Patch)('pengaturan/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "updatePengaturanNomor", null);
__decorate([
    (0, common_1.Delete)('pengaturan/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "deletePengaturanNomor", null);
__decorate([
    (0, common_1.Post)('template'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Get)('template'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "getTemplateList", null);
__decorate([
    (0, common_1.Get)('template/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "getTemplateDetail", null);
__decorate([
    (0, common_1.Patch)('template/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "updateTemplate", null);
__decorate([
    (0, common_1.Delete)('template/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "deleteTemplate", null);
__decorate([
    (0, common_1.Post)('masuk'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "createSuratMasuk", null);
__decorate([
    (0, common_1.Get)('masuk'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "getSuratMasukList", null);
__decorate([
    (0, common_1.Patch)('masuk/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "updateSuratMasuk", null);
__decorate([
    (0, common_1.Delete)('masuk/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "deleteSuratMasuk", null);
__decorate([
    (0, common_1.Post)('keluar'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "createSuratKeluar", null);
__decorate([
    (0, common_1.Get)('keluar'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('status')),
    __param(5, (0, common_1.Query)('kategori')),
    __param(6, (0, common_1.Query)('sub')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "getSuratKeluarList", null);
__decorate([
    (0, common_1.Get)('keluar/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "getSuratKeluarDetail", null);
__decorate([
    (0, common_1.Patch)('keluar/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "updateSuratKeluar", null);
__decorate([
    (0, common_1.Post)('keluar/:id/terbitkan'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "terbitkanSurat", null);
__decorate([
    (0, common_1.Get)('keluar/:id/preview'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "previewSurat", null);
__decorate([
    (0, common_1.Delete)('keluar/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuratController.prototype, "deleteSuratKeluar", null);
exports.SuratController = SuratController = __decorate([
    (0, common_1.Controller)('surat'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [surat_service_1.SuratService])
], SuratController);
//# sourceMappingURL=surat.controller.js.map