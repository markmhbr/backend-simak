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
exports.PerpustakaanController = void 0;
const common_1 = require("@nestjs/common");
const api_key_guard_1 = require("../../core/app-key/api-key.guard");
const perpustakaan_service_1 = require("./perpustakaan.service");
const kategori_buku_dto_1 = require("./dto/kategori-buku.dto");
const buku_dto_1 = require("./dto/buku.dto");
const peminjaman_dto_1 = require("./dto/peminjaman.dto");
const pengembalian_dto_1 = require("./dto/pengembalian.dto");
const kunjungan_dto_1 = require("./dto/kunjungan.dto");
const literasi_dto_1 = require("./dto/literasi.dto");
let PerpustakaanController = class PerpustakaanController {
    perpustakaanService;
    constructor(perpustakaanService) {
        this.perpustakaanService = perpustakaanService;
    }
    getSekolahId(req) {
        const appKey = req['appKey'];
        const sekolahId = appKey?.sekolah_id;
        if (!sekolahId) {
            throw new common_1.BadRequestException('Sekolah ID tidak terdeteksi dari API Key / Token.');
        }
        return sekolahId;
    }
    async getDashboardStats(req) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.getDashboardStats(sekolahId);
        return { status: 'success', data };
    }
    async getKategoriList(req) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.getKategoriList(sekolahId);
        return { status: 'success', data };
    }
    async getKategoriById(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.getKategoriById(sekolahId, id);
        return { status: 'success', data };
    }
    async createKategori(req, dto) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.createKategori(sekolahId, dto);
        return { status: 'success', message: 'Kategori buku berhasil ditambahkan.', data };
    }
    async updateKategori(req, id, dto) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.updateKategori(sekolahId, id, dto);
        return { status: 'success', message: 'Kategori buku berhasil diperbarui.', data };
    }
    async deleteKategori(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.deleteKategori(sekolahId, id);
        return { status: 'success', message: 'Kategori buku berhasil dihapus.', data };
    }
    async getBukuList(req, search, kategori_buku_id, status, page, limit) {
        const sekolahId = this.getSekolahId(req);
        const result = await this.perpustakaanService.getBukuList(sekolahId, {
            search,
            kategori_buku_id,
            status,
            page,
            limit,
        });
        return { status: 'success', ...result };
    }
    async getBukuById(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.getBukuById(sekolahId, id);
        return { status: 'success', data };
    }
    async createBuku(req, dto) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.createBuku(sekolahId, dto);
        return { status: 'success', message: 'Data buku berhasil ditambahkan.', data };
    }
    async updateBuku(req, id, dto) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.updateBuku(sekolahId, id, dto);
        return { status: 'success', message: 'Data buku berhasil diperbarui.', data };
    }
    async deleteBuku(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.deleteBuku(sekolahId, id);
        return { status: 'success', message: 'Data buku berhasil dihapus.', data };
    }
    async getPeminjamanList(req, search, status, peserta_didik_id, ptk_id, tanggal_mulai, tanggal_selesai, page, limit) {
        const sekolahId = this.getSekolahId(req);
        const result = await this.perpustakaanService.getPeminjamanList(sekolahId, {
            search,
            status,
            peserta_didik_id,
            ptk_id,
            tanggal_mulai,
            tanggal_selesai,
            page,
            limit,
        });
        return { status: 'success', ...result };
    }
    async getPeminjamanById(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.getPeminjamanById(sekolahId, id);
        return { status: 'success', data };
    }
    async createPeminjaman(req, dto) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.createPeminjaman(sekolahId, dto);
        return { status: 'success', message: 'Transaksi peminjaman berhasil dicatat.', data };
    }
    async prosesPengembalian(req, id, dto) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.prosesPengembalian(sekolahId, id, dto);
        return { status: 'success', message: 'Pengembalian buku berhasil diproses.', data };
    }
    async batalkanPeminjaman(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.batalkanPeminjaman(sekolahId, id);
        return { status: 'success', message: 'Transaksi peminjaman berhasil dibatalkan dan stok dikembalikan.', data };
    }
    async deletePeminjaman(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.deletePeminjaman(sekolahId, id);
        return { status: 'success', message: 'Data peminjaman berhasil dihapus.', data };
    }
    async getKunjunganList(req, tanggal, sedang_berada_di_perpus, peserta_didik_id, ptk_id, page, limit) {
        const sekolahId = this.getSekolahId(req);
        const isInside = sedang_berada_di_perpus === 'true' || sedang_berada_di_perpus === '1';
        const result = await this.perpustakaanService.getKunjunganList(sekolahId, {
            tanggal,
            sedang_berada_di_perpus: isInside ? true : undefined,
            peserta_didik_id,
            ptk_id,
            page,
            limit,
        });
        return { status: 'success', ...result };
    }
    async getKunjunganById(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.getKunjunganById(sekolahId, id);
        return { status: 'success', data };
    }
    async checkInKunjungan(req, dto) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.checkInKunjungan(sekolahId, dto);
        return { status: 'success', message: 'Check-in kunjungan perpustakaan berhasil.', data };
    }
    async smartScanKunjungan(req, dto) {
        const sekolahId = this.getSekolahId(req);
        const result = await this.perpustakaanService.smartScanKunjungan(sekolahId, dto);
        return { status: 'success', ...result };
    }
    async checkOutKunjungan(req, id, dto) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.checkOutKunjungan(sekolahId, id, dto);
        return { status: 'success', message: 'Check-out kunjungan perpustakaan berhasil.', data };
    }
    async updateKunjungan(req, id, body) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.updateKunjungan(sekolahId, id, body);
        return { status: 'success', message: 'Data kunjungan berhasil diperbarui.', data };
    }
    async deleteKunjungan(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.deleteKunjungan(sekolahId, id);
        return { status: 'success', message: 'Data kunjungan berhasil dihapus.', data };
    }
    async getLiterasiList(req, peserta_didik_id, tanggal, search, page, limit) {
        const sekolahId = this.getSekolahId(req);
        const result = await this.perpustakaanService.getLiterasiList(sekolahId, {
            peserta_didik_id,
            tanggal,
            search,
            page,
            limit,
        });
        return { status: 'success', ...result };
    }
    async getLiterasiById(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.getLiterasiById(sekolahId, id);
        return { status: 'success', data };
    }
    async createLiterasi(req, dto) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.createLiterasi(sekolahId, dto);
        return { status: 'success', message: 'Aktivitas literasi berhasil dicatat.', data };
    }
    async updateLiterasi(req, id, dto) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.updateLiterasi(sekolahId, id, dto);
        return { status: 'success', message: 'Aktivitas literasi berhasil diperbarui.', data };
    }
    async deleteLiterasi(req, id) {
        const sekolahId = this.getSekolahId(req);
        const data = await this.perpustakaanService.deleteLiterasi(sekolahId, id);
        return { status: 'success', message: 'Data literasi berhasil dihapus.', data };
    }
};
exports.PerpustakaanController = PerpustakaanController;
__decorate([
    (0, common_1.Get)('dashboard/stats'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('kategori'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getKategoriList", null);
__decorate([
    (0, common_1.Get)('kategori/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getKategoriById", null);
__decorate([
    (0, common_1.Post)('kategori'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, kategori_buku_dto_1.CreateKategoriBukuDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "createKategori", null);
__decorate([
    (0, common_1.Put)('kategori/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, kategori_buku_dto_1.UpdateKategoriBukuDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "updateKategori", null);
__decorate([
    (0, common_1.Delete)('kategori/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "deleteKategori", null);
__decorate([
    (0, common_1.Get)('buku'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('kategori_buku_id')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getBukuList", null);
__decorate([
    (0, common_1.Get)('buku/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getBukuById", null);
__decorate([
    (0, common_1.Post)('buku'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, buku_dto_1.CreateBukuDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "createBuku", null);
__decorate([
    (0, common_1.Put)('buku/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, buku_dto_1.UpdateBukuDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "updateBuku", null);
__decorate([
    (0, common_1.Delete)('buku/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "deleteBuku", null);
__decorate([
    (0, common_1.Get)('peminjaman'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('search')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('peserta_didik_id')),
    __param(4, (0, common_1.Query)('ptk_id')),
    __param(5, (0, common_1.Query)('tanggal_mulai')),
    __param(6, (0, common_1.Query)('tanggal_selesai')),
    __param(7, (0, common_1.Query)('page')),
    __param(8, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getPeminjamanList", null);
__decorate([
    (0, common_1.Get)('peminjaman/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getPeminjamanById", null);
__decorate([
    (0, common_1.Post)('peminjaman'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, peminjaman_dto_1.CreatePeminjamanDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "createPeminjaman", null);
__decorate([
    (0, common_1.Post)('peminjaman/:id/kembali'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, pengembalian_dto_1.PengembalianDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "prosesPengembalian", null);
__decorate([
    (0, common_1.Patch)('peminjaman/:id/batalkan'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "batalkanPeminjaman", null);
__decorate([
    (0, common_1.Delete)('peminjaman/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "deletePeminjaman", null);
__decorate([
    (0, common_1.Get)('kunjungan'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('tanggal')),
    __param(2, (0, common_1.Query)('sedang_berada_di_perpus')),
    __param(3, (0, common_1.Query)('peserta_didik_id')),
    __param(4, (0, common_1.Query)('ptk_id')),
    __param(5, (0, common_1.Query)('page')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getKunjunganList", null);
__decorate([
    (0, common_1.Get)('kunjungan/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getKunjunganById", null);
__decorate([
    (0, common_1.Post)('kunjungan/check-in'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, kunjungan_dto_1.CreateKunjunganDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "checkInKunjungan", null);
__decorate([
    (0, common_1.Post)('kunjungan/smart-scan'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, kunjungan_dto_1.CreateKunjunganDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "smartScanKunjungan", null);
__decorate([
    (0, common_1.Patch)('kunjungan/:id/check-out'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, kunjungan_dto_1.CheckOutKunjunganDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "checkOutKunjungan", null);
__decorate([
    (0, common_1.Put)('kunjungan/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "updateKunjungan", null);
__decorate([
    (0, common_1.Delete)('kunjungan/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "deleteKunjungan", null);
__decorate([
    (0, common_1.Get)('literasi'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('peserta_didik_id')),
    __param(2, (0, common_1.Query)('tanggal')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('page')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getLiterasiList", null);
__decorate([
    (0, common_1.Get)('literasi/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "getLiterasiById", null);
__decorate([
    (0, common_1.Post)('literasi'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, literasi_dto_1.CreateLiterasiDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "createLiterasi", null);
__decorate([
    (0, common_1.Put)('literasi/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, literasi_dto_1.UpdateLiterasiDto]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "updateLiterasi", null);
__decorate([
    (0, common_1.Delete)('literasi/:id'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PerpustakaanController.prototype, "deleteLiterasi", null);
exports.PerpustakaanController = PerpustakaanController = __decorate([
    (0, common_1.Controller)('perpustakaan'),
    (0, common_1.UseGuards)(api_key_guard_1.ApiKeyGuard),
    __metadata("design:paramtypes", [perpustakaan_service_1.PerpustakaanService])
], PerpustakaanController);
//# sourceMappingURL=perpustakaan.controller.js.map