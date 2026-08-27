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
exports.CheckOutKunjunganDto = exports.CreateKunjunganDto = void 0;
const class_validator_1 = require("class-validator");
class CreateKunjunganDto {
    peserta_didik_id;
    ptk_id;
    tanggal;
    jam_masuk;
    keperluan;
    keterangan;
}
exports.CreateKunjunganDto = CreateKunjunganDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'peserta_didik_id harus format UUID' }),
    __metadata("design:type", String)
], CreateKunjunganDto.prototype, "peserta_didik_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('4', { message: 'ptk_id harus format UUID' }),
    __metadata("design:type", String)
], CreateKunjunganDto.prototype, "ptk_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Format tanggal tidak valid (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], CreateKunjunganDto.prototype, "tanggal", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
        message: 'Format jam_masuk harus HH:mm atau HH:mm:ss',
    }),
    __metadata("design:type", String)
], CreateKunjunganDto.prototype, "jam_masuk", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKunjunganDto.prototype, "keperluan", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateKunjunganDto.prototype, "keterangan", void 0);
class CheckOutKunjunganDto {
    jam_keluar;
}
exports.CheckOutKunjunganDto = CheckOutKunjunganDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
        message: 'Format jam_keluar harus HH:mm atau HH:mm:ss',
    }),
    __metadata("design:type", String)
], CheckOutKunjunganDto.prototype, "jam_keluar", void 0);
//# sourceMappingURL=kunjungan.dto.js.map