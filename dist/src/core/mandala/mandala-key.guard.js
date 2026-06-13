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
exports.MandalaKeyGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MandalaKeyGuard = class MandalaKeyGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        let key = request.headers['x-mandala-key'];
        if (!key && request.query['x-mandala-key']) {
            key = request.query['x-mandala-key'];
        }
        if (!key && request.query.key) {
            key = request.query.key;
        }
        if (!key) {
            throw new common_1.UnauthorizedException('Mandala API key is missing. Please provide x-mandala-key header or key query param.');
        }
        const connection = await this.prisma.mandala.findUnique({
            where: { key },
        });
        if (!connection) {
            throw new common_1.UnauthorizedException('Invalid Mandala API key.');
        }
        request['mandala'] = connection;
        return true;
    }
};
exports.MandalaKeyGuard = MandalaKeyGuard;
exports.MandalaKeyGuard = MandalaKeyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MandalaKeyGuard);
//# sourceMappingURL=mandala-key.guard.js.map