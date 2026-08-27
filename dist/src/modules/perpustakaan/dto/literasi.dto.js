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
exports.UpdateLiterasiDto = exports.CreateLiterasiDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreateLiterasiDto {
    peserta_didik_id;
    nama_buku;
    halaman_dari;
    halaman_sampai;
    kesimpulan;
    tanggal;
}
exports.CreateLiterasiDto = CreateLiterasiDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'peserta_didik_id wajib diisi' }),
    (0, class_validator_1.IsUUID)('4', { message: 'peserta_didik_id harus format UUID' }),
    __metadata("design:type", String)
], CreateLiterasiDto.prototype, "peserta_didik_id", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'nama_buku wajib diisi' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLiterasiDto.prototype, "nama_buku", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'halaman_dari wajib diisi' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'halaman_dari minimal 1' }),
    __metadata("design:type", Number)
], CreateLiterasiDto.prototype, "halaman_dari", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'halaman_sampai wajib diisi' }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1, { message: 'halaman_sampai minimal 1' }),
    __metadata("design:type", Number)
], CreateLiterasiDto.prototype, "halaman_sampai", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateLiterasiDto.prototype, "kesimpulan", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Tanggal wajib diisi' }),
    (0, class_validator_1.IsDateString)({}, { message: 'Format tanggal tidak valid (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreateLiterasiDto.prototype, "tanggal", void 0);
class UpdateLiterasiDto {
    peserta_didik_id;
    nama_buku;
    halaman_dari;
    halaman_sampai;
    kesimpulan;
    tanggal;
}
exports.UpdateLiterasiDto = UpdateLiterasiDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'peserta_didik_id harus format UUID' }),
    __metadata("design:type", String)
], UpdateLiterasiDto.prototype, "peserta_didik_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLiterasiDto.prototype, "nama_buku", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateLiterasiDto.prototype, "halaman_dari", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateLiterasiDto.prototype, "halaman_sampai", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateLiterasiDto.prototype, "kesimpulan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Format tanggal tidak valid (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], UpdateLiterasiDto.prototype, "tanggal", void 0);
//# sourceMappingURL=literasi.dto.js.map