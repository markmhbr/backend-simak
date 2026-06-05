"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppKeyModule = void 0;
const common_1 = require("@nestjs/common");
const app_key_service_1 = require("./app-key.service");
const api_key_guard_1 = require("./api-key.guard");
let AppKeyModule = class AppKeyModule {
};
exports.AppKeyModule = AppKeyModule;
exports.AppKeyModule = AppKeyModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [app_key_service_1.AppKeyService, api_key_guard_1.ApiKeyGuard],
        exports: [app_key_service_1.AppKeyService, api_key_guard_1.ApiKeyGuard],
    })
], AppKeyModule);
//# sourceMappingURL=app-key.module.js.map