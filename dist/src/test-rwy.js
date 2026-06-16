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
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const envPath = path.join(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const dbUrl = envContent.match(/DATABASE_URL="?([^"\n\r]*)"?/)?.[1];
if (!dbUrl) {
    console.error('DATABASE_URL tidak ditemukan di .env');
    process.exit(1);
}
const pool = new pg_1.Pool({ connectionString: dbUrl });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Testing RwySertifikasi query...');
    try {
        const count = await prisma.rwySertifikasi.count();
        console.log('Current count:', count);
        const gtk = await prisma.gtk.findFirst({ select: { ptk_id: true } });
        console.log('Found GTK:', gtk);
        if (gtk) {
            console.log('Attempting dummy insert...');
            const dummy = await prisma.rwySertifikasi.create({
                data: {
                    riwayat_sertifikasi_id: '11111111-1111-1111-1111-111111111111',
                    ptk_id: gtk.ptk_id,
                    id_jenis_sertifikasi: '1',
                    nomor_sertifikat: 'test-nomor',
                }
            });
            console.log('Insert success:', dummy);
            await prisma.rwySertifikasi.delete({
                where: { riwayat_sertifikasi_id: dummy.riwayat_sertifikasi_id }
            });
            console.log('Delete success');
        }
    }
    catch (error) {
        console.error('Error encountered:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
//# sourceMappingURL=test-rwy.js.map