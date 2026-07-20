"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUrl = signUrl;
exports.verifyUrlSignature = verifyUrlSignature;
const crypto = __importStar(require("crypto"));
function signUrl(filePath, expiresInSeconds = 86400) {
    if (!filePath)
        return filePath;
    const storageIndex = filePath.indexOf('/storage/');
    if (storageIndex === -1) {
        return filePath;
    }
    const baseUrlPart = filePath.substring(0, storageIndex);
    const storagePathPart = filePath.substring(storageIndex);
    const [pathWithoutQuery, existingQuery] = storagePathPart.split('?');
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const signature = crypto
        .createHmac('sha256', secret)
        .update(`${pathWithoutQuery}:${expires}`)
        .digest('hex');
    const queryParams = new URLSearchParams(existingQuery || '');
    queryParams.set('expires', expires.toString());
    queryParams.set('signature', signature);
    return `${baseUrlPart}${pathWithoutQuery}?${queryParams.toString()}`;
}
function verifyUrlSignature(pathWithoutQuery, expires, signature) {
    if (!expires || !signature) {
        return false;
    }
    const now = Math.floor(Date.now() / 1000);
    if (parseInt(expires, 10) < now) {
        return false;
    }
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${pathWithoutQuery}:${expires}`)
        .digest('hex');
    return signature === expectedSignature;
}
//# sourceMappingURL=signed-url.helper.js.map