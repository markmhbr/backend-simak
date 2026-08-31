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
    console.log('🔄 Memulai migrasi format qr_token ke: ${sekolah_id}/${id}...');
    const students = await prisma.pesertaDidik.findMany({
        select: { peserta_didik_id: true, sekolah_id: true, qr_token: true },
    });
    let pdUpdated = 0;
    for (const s of students) {
        if (!s.sekolah_id)
            continue;
        const expectedToken = `${s.sekolah_id}/${s.peserta_didik_id}`;
        if (s.qr_token !== expectedToken) {
            await prisma.pesertaDidik.update({
                where: { peserta_didik_id: s.peserta_didik_id },
                data: { qr_token: expectedToken },
            });
            pdUpdated++;
        }
    }
    console.log(`✅ Peserta Didik dimigrasi: ${pdUpdated} dari total ${students.length}`);
    const gtks = await prisma.gtk.findMany({
        select: { ptk_id: true, sekolah_id: true, qr_token: true },
    });
    let gtkUpdated = 0;
    for (const g of gtks) {
        if (!g.sekolah_id)
            continue;
        const expectedToken = `${g.sekolah_id}/${g.ptk_id}`;
        if (g.qr_token !== expectedToken) {
            await prisma.gtk.update({
                where: { ptk_id: g.ptk_id },
                data: { qr_token: expectedToken },
            });
            gtkUpdated++;
        }
    }
    console.log(`✅ GTK dimigrasi: ${gtkUpdated} dari total ${gtks.length}`);
    console.log('🎉 Migrasi qr_token selesai dengan sukses!');
}
main()
    .catch((e) => {
    console.error('❌ Error migrasi:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=migrate-qr-tokens.js.map