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
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const targetId = 'f9db3138-3deb-456a-85a7-df5f7b55edfd';
    console.log(`🔍 Memeriksa data peserta didik dengan ID: ${targetId}...\n`);
    const student = await prisma.pesertaDidik.findUnique({
        where: { peserta_didik_id: targetId },
        select: {
            peserta_didik_id: true,
            sekolah_id: true,
            nama: true,
            nisn: true,
            nipd: true,
            qr_token: true,
        },
    });
    if (!student) {
        console.log(`❌ Siswa dengan ID "${targetId}" TIDAK DITEMUKAN di database.`);
    }
    else {
        console.log('====================================================');
        console.log('✅ DATA SISWA DITEMUKAN:');
        console.log('====================================================');
        console.log(`Nama        : ${student.nama}`);
        console.log(`NISN        : ${student.nisn || '-'}`);
        console.log(`NIPD        : ${student.nipd || '-'}`);
        console.log(`Sekolah ID  : ${student.sekolah_id}`);
        console.log(`ID Siswa    : ${student.peserta_didik_id}`);
        console.log(`QR Token DB : ${student.qr_token || '(KOSONG)'}`);
        console.log('----------------------------------------------------');
        const appUrl = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '');
        const fullQrUrl = student.qr_token
            ? (student.qr_token.startsWith('http') ? student.qr_token : `${appUrl}/p/${student.qr_token}`)
            : `${appUrl}/p/${student.sekolah_id}/${student.peserta_didik_id}`;
        console.log(`Full QR URL : ${fullQrUrl}`);
        console.log('====================================================');
    }
}
main()
    .catch((e) => {
    console.error('❌ Error saat query:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=check-student-qr.js.map