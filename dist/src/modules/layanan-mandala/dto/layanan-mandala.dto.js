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
exports.UpdatePermohonanStatusDto = exports.CreatePermohonanLayananFileDto = exports.CreatePermohonanLayananDto = exports.CreateLayananSyaratDto = exports.CreateLayananDto = void 0;
const class_validator_1 = require("class-validator");
class CreateLayananDto {
    cadisdik_id;
    nama_layanan;
    kategori;
    aktif;
}
exports.CreateLayananDto = CreateLayananDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateLayananDto.prototype, "cadisdik_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLayananDto.prototype, "nama_layanan", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateLayananDto.prototype, "kategori", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateLayananDto.prototype, "aktif", void 0);
class CreateLayananSyaratDto {
    nama_syarat;
    wajib;
    urutan;
    aktif;
}
exports.CreateLayananSyaratDto = CreateLayananSyaratDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateLayananSyaratDto.prototype, "nama_syarat", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateLayananSyaratDto.prototype, "wajib", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateLayananSyaratDto.prototype, "urutan", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateLayananSyaratDto.prototype, "aktif", void 0);
class CreatePermohonanLayananDto {
    cadisdik_id;
    sekolah_id;
    layanan_id;
    kategori;
    ptk_id;
    peserta_didik_id;
    nomor_permohonan;
    keterangan;
}
exports.CreatePermohonanLayananDto = CreatePermohonanLayananDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePermohonanLayananDto.prototype, "cadisdik_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePermohonanLayananDto.prototype, "sekolah_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePermohonanLayananDto.prototype, "layanan_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePermohonanLayananDto.prototype, "kategori", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePermohonanLayananDto.prototype, "ptk_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePermohonanLayananDto.prototype, "peserta_didik_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePermohonanLayananDto.prototype, "nomor_permohonan", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePermohonanLayananDto.prototype, "keterangan", void 0);
class CreatePermohonanLayananFileDto {
    layanan_syarat_id;
    jenis_file;
    nama_file;
    file_url;
    catatan;
}
exports.CreatePermohonanLayananFileDto = CreatePermohonanLayananFileDto;
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePermohonanLayananFileDto.prototype, "layanan_syarat_id", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreatePermohonanLayananFileDto.prototype, "jenis_file", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePermohonanLayananFileDto.prototype, "nama_file", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePermohonanLayananFileDto.prototype, "file_url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePermohonanLayananFileDto.prototype, "catatan", void 0);
class UpdatePermohonanStatusDto {
    status;
    pegawai_id;
    catatan;
}
exports.UpdatePermohonanStatusDto = UpdatePermohonanStatusDto;
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdatePermohonanStatusDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdatePermohonanStatusDto.prototype, "pegawai_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePermohonanStatusDto.prototype, "catatan", void 0);
//# sourceMappingURL=layanan-mandala.dto.js.map