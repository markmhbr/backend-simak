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
exports.Verify2faDto = exports.LoginDto = void 0;
const class_validator_1 = require("class-validator");
class LoginDto {
    username;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Username harus berupa teks' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Username wajib diisi' }),
    __metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Password wajib diisi' }),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class Verify2faDto {
    tempToken;
    code;
    secret;
}
exports.Verify2faDto = Verify2faDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Token sementara wajib disertakan' }),
    __metadata("design:type", String)
], Verify2faDto.prototype, "tempToken", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)({ message: 'Kode OTP wajib diisi' }),
    (0, class_validator_1.Length)(6, 6, { message: 'Kode OTP harus 6 digit' }),
    __metadata("design:type", String)
], Verify2faDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], Verify2faDto.prototype, "secret", void 0);
//# sourceMappingURL=auth.dto.js.map