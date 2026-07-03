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
const path = __importStar(require("path"));
dotenv.config({ path: path.join(__dirname, '../.env') });
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const student = await prisma.pesertaDidik.findFirst({
        where: { nama: { contains: 'Ramdani', mode: 'insensitive' } },
        select: {
            peserta_didik_id: true,
            nama: true,
            kode_wilayah: true,
            desa_kelurahan: true,
            alamat_jalan: true
        }
    });
    console.log('STUDENT ROW:', student);
    if (student && student.kode_wilayah) {
        const result = {
            desa: null,
            kecamatan: null,
            kabupaten: null,
            provinsi: null,
            negara: null,
        };
        let currentKode = student.kode_wilayah.trim();
        let maxDepth = 6;
        while (currentKode && maxDepth > 0) {
            const wil = await prisma.mst_wilayah.findUnique({
                where: { kode_wilayah: currentKode },
                select: { nama: true, id_level_wilayah: true, mst_kode_wilayah: true },
            });
            console.log(`Querying ${currentKode} ->`, wil);
            if (!wil)
                break;
            switch (wil.id_level_wilayah) {
                case 4:
                    result.desa = wil.nama;
                    break;
                case 3:
                    result.kecamatan = wil.nama;
                    break;
                case 2:
                    result.kabupaten = wil.nama;
                    break;
                case 1:
                    result.provinsi = wil.nama;
                    break;
                case 0:
                    result.negara = wil.nama;
                    break;
            }
            currentKode = wil.mst_kode_wilayah?.trim() || null;
            maxDepth--;
        }
        console.log('RESOLVE RESULT:', result);
    }
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=test_student.js.map