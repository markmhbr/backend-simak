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
exports.UpdateBukuDto = exports.CreateBukuDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateBukuDto {
    kategori_buku_id;
    kode;
    isbn;
    judul;
    penulis;
    penerbit;
    tahun_terbit;
    jumlah;
    tersedia;
    kondisi;
    lokasi_rak;
    sampul;
    deskripsi;
    status;
}
exports.CreateBukuDto = CreateBukuDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'kategori_buku_id wajib diisi' }),
    (0, class_validator_1.IsUUID)('4', { message: 'kategori_buku_id harus format UUID' }),
    __metadata("design:type", String)
], CreateBukuDto.prototype, "kategori_buku_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Kode buku wajib diisi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBukuDto.prototype, "kode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBukuDto.prototype, "isbn", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Judul buku wajib diisi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBukuDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBukuDto.prototype, "penulis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBukuDto.prototype, "penerbit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1000),
    (0, class_validator_1.Max)(9999),
    __metadata("design:type", Number)
], CreateBukuDto.prototype, "tahun_terbit", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Jumlah buku wajib diisi' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'Jumlah buku minimal 0' }),
    __metadata("design:type", Number)
], CreateBukuDto.prototype, "jumlah", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0, { message: 'Stok tersedia minimal 0' }),
    __metadata("design:type", Number)
], CreateBukuDto.prototype, "tersedia", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], CreateBukuDto.prototype, "kondisi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBukuDto.prototype, "lokasi_rak", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBukuDto.prototype, "sampul", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBukuDto.prototype, "deskripsi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(2),
    __metadata("design:type", Number)
], CreateBukuDto.prototype, "status", void 0);
class UpdateBukuDto {
    kategori_buku_id;
    kode;
    isbn;
    judul;
    penulis;
    penerbit;
    tahun_terbit;
    jumlah;
    tersedia;
    kondisi;
    lokasi_rak;
    sampul;
    deskripsi;
    status;
}
exports.UpdateBukuDto = UpdateBukuDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'kategori_buku_id harus format UUID' }),
    __metadata("design:type", String)
], UpdateBukuDto.prototype, "kategori_buku_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBukuDto.prototype, "kode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBukuDto.prototype, "isbn", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBukuDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBukuDto.prototype, "penulis", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBukuDto.prototype, "penerbit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateBukuDto.prototype, "tahun_terbit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateBukuDto.prototype, "jumlah", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateBukuDto.prototype, "tersedia", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(4),
    __metadata("design:type", Number)
], UpdateBukuDto.prototype, "kondisi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBukuDto.prototype, "lokasi_rak", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBukuDto.prototype, "sampul", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBukuDto.prototype, "deskripsi", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(2),
    __metadata("design:type", Number)
], UpdateBukuDto.prototype, "status", void 0);
//# sourceMappingURL=buku.dto.js.map