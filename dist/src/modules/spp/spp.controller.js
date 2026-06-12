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
exports.SppController = exports.GenerateSppDto = void 0;
const common_1 = require("@nestjs/common");
const spp_service_1 = require("./spp.service");
const create_pengaturan_tagihan_dto_1 = require("./dto/create-pengaturan-tagihan.dto");
const update_pengaturan_tagihan_dto_1 = require("./dto/update-pengaturan-tagihan.dto");
const create_pengaturan_tagihan_rombel_dto_1 = require("./dto/create-pengaturan-tagihan-rombel.dto");
const create_transaksi_spp_dto_1 = require("./dto/create-transaksi-spp.dto");
const class_validator_1 = require("class-validator");
class GenerateSppDto {
    sekolah_id;
    pengaturan_tagihan_id;
}
exports.GenerateSppDto = GenerateSppDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateSppDto.prototype, "sekolah_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], GenerateSppDto.prototype, "pengaturan_tagihan_id", void 0);
let SppController = class SppController {
    sppService;
    constructor(sppService) {
        this.sppService = sppService;
    }
    async createPengaturanTagihan(dto) {
        const data = await this.sppService.createPengaturanTagihan(dto);
        return {
            status: 'success',
            message: 'Master pengaturan tagihan berhasil dibuat.',
            data,
        };
    }
    async getPengaturanTagihan(sekolahId) {
        const data = await this.sppService.getPengaturanTagihan(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async updatePengaturanTagihan(id, dto) {
        const data = await this.sppService.updatePengaturanTagihan(id, dto);
        return {
            status: 'success',
            message: 'Pengaturan tagihan berhasil diperbarui.',
            data,
        };
    }
    async deletePengaturanTagihan(id) {
        await this.sppService.deletePengaturanTagihan(id);
        return {
            status: 'success',
            message: 'Pengaturan tagihan berhasil dihapus.',
        };
    }
    async createPengaturanTagihanRombel(dto) {
        const data = await this.sppService.createPengaturanTagihanRombel(dto);
        return {
            status: 'success',
            message: 'Pengaturan tagihan berhasil dihubungkan ke rombongan belajar.',
            data,
        };
    }
    async deletePengaturanTagihanRombel(id) {
        await this.sppService.deletePengaturanTagihanRombel(id);
        return {
            status: 'success',
            message: 'Hubungan pengaturan tagihan dengan rombongan belajar berhasil dihapus.',
        };
    }
    async generateSppTagihan(dto) {
        const data = await this.sppService.generateSppTagihan(dto.sekolah_id, dto.pengaturan_tagihan_id);
        return {
            status: 'success',
            message: data.message,
            data,
        };
    }
    async getTagihanSpp(sekolahId, pesertaDidikId, status) {
        const data = await this.sppService.getTagihanSpp(sekolahId, {
            peserta_didik_id: pesertaDidikId,
            status: status !== undefined ? Number(status) : undefined,
        });
        return {
            status: 'success',
            data,
        };
    }
    async createTransaksiSpp(dto) {
        const data = await this.sppService.createTransaksiSpp(dto);
        return {
            status: 'success',
            message: 'Transaksi SPP berhasil dicatat.',
            data,
        };
    }
    async getTunggakanPerSiswa(sekolahId) {
        const data = await this.sppService.getTunggakanPerSiswa(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async getTunggakanPerKelas(sekolahId) {
        const data = await this.sppService.getTunggakanPerKelas(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async getTotalPembayaran(sekolahId) {
        const data = await this.sppService.getTotalPembayaran(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async getTotalBeasiswa(sekolahId) {
        const data = await this.sppService.getTotalBeasiswa(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async getRekapBulanan(sekolahId) {
        const data = await this.sppService.getRekapBulanan(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
    async getRekapTahunPelajaran(sekolahId) {
        const data = await this.sppService.getRekapTahunPelajaran(sekolahId);
        return {
            status: 'success',
            data,
        };
    }
};
exports.SppController = SppController;
__decorate([
    (0, common_1.Post)('pengaturan'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pengaturan_tagihan_dto_1.CreatePengaturanTagihanDto]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "createPengaturanTagihan", null);
__decorate([
    (0, common_1.Get)('pengaturan/:sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "getPengaturanTagihan", null);
__decorate([
    (0, common_1.Patch)('pengaturan/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pengaturan_tagihan_dto_1.UpdatePengaturanTagihanDto]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "updatePengaturanTagihan", null);
__decorate([
    (0, common_1.Delete)('pengaturan/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "deletePengaturanTagihan", null);
__decorate([
    (0, common_1.Post)('pengaturan-rombel'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_pengaturan_tagihan_rombel_dto_1.CreatePengaturanTagihanRombelDto]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "createPengaturanTagihanRombel", null);
__decorate([
    (0, common_1.Delete)('pengaturan-rombel/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "deletePengaturanTagihanRombel", null);
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GenerateSppDto]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "generateSppTagihan", null);
__decorate([
    (0, common_1.Get)('tagihan/:sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __param(1, (0, common_1.Query)('peserta_didik_id')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "getTagihanSpp", null);
__decorate([
    (0, common_1.Post)('transaksi'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transaksi_spp_dto_1.CreateTransaksiSppDto]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "createTransaksiSpp", null);
__decorate([
    (0, common_1.Get)('laporan/tunggakan-siswa/:sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "getTunggakanPerSiswa", null);
__decorate([
    (0, common_1.Get)('laporan/tunggakan-kelas/:sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "getTunggakanPerKelas", null);
__decorate([
    (0, common_1.Get)('laporan/total-pembayaran/:sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "getTotalPembayaran", null);
__decorate([
    (0, common_1.Get)('laporan/total-beasiswa/:sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "getTotalBeasiswa", null);
__decorate([
    (0, common_1.Get)('laporan/rekap-bulanan/:sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "getRekapBulanan", null);
__decorate([
    (0, common_1.Get)('laporan/rekap-tahun-pelajaran/:sekolah_id'),
    __param(0, (0, common_1.Param)('sekolah_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SppController.prototype, "getRekapTahunPelajaran", null);
exports.SppController = SppController = __decorate([
    (0, common_1.Controller)('spp'),
    __metadata("design:paramtypes", [spp_service_1.SppService])
], SppController);
//# sourceMappingURL=spp.controller.js.map