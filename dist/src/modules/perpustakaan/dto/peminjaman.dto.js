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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePeminjamanDto = exports.PeminjamanItemDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class PeminjamanItemDto {
    buku_id;
    jumlah;
    keterangan;
}
exports.PeminjamanItemDto = PeminjamanItemDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'buku_id wajib diisi' }),
    (0, class_validator_1.IsUUID)('4', { message: 'buku_id harus format UUID' }),
    __metadata("design:type", String)
], PeminjamanItemDto.prototype, "buku_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Jumlah buku wajib diisi' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'Jumlah peminjaman minimal 1' }),
    __metadata("design:type", Number)
], PeminjamanItemDto.prototype, "jumlah", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PeminjamanItemDto.prototype, "keterangan", void 0);
class CreatePeminjamanDto {
    peserta_didik_id;
    ptk_id;
    nomor_peminjaman;
    tanggal_pinjam;
    tanggal_jatuh_tempo;
    keterangan;
    items;
}
exports.CreatePeminjamanDto = CreatePeminjamanDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'peserta_didik_id harus format UUID' }),
    __metadata("design:type", String)
], CreatePeminjamanDto.prototype, "peserta_didik_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'ptk_id harus format UUID' }),
    __metadata("design:type", String)
], CreatePeminjamanDto.prototype, "ptk_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePeminjamanDto.prototype, "nomor_peminjaman", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tanggal pinjam wajib diisi' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Format tanggal_pinjam tidak valid (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreatePeminjamanDto.prototype, "tanggal_pinjam", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tanggal jatuh tempo wajib diisi' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Format tanggal_jatuh_tempo tidak valid (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreatePeminjamanDto.prototype, "tanggal_jatuh_tempo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePeminjamanDto.prototype, "keterangan", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Items peminjaman harus berupa array' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Minimal harus ada 1 buku yang dipinjam' }),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PeminjamanItemDto),
    __metadata("design:type", Array)
], CreatePeminjamanDto.prototype, "items", void 0);
//# sourceMappingURL=peminjaman.dto.js.map