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
    console.log('Searching for Budi Setiawan...');
    const budi = await prisma.pegawai.findFirst({
        where: {
            nama_lengkap: {
                contains: 'Budi Setiawan',
                mode: 'insensitive',
            },
        },
    });
    if (!budi) {
        console.log('Budi Setiawan not found in pegawai table.');
        return;
    }
    console.log('Found Budi:', budi);
    console.log('Searching for a school...');
    const sekolah = await prisma.sekolah.findFirst();
    if (!sekolah) {
        console.log('No schools found.');
        return;
    }
    console.log('Found Sekolah:', sekolah);
    console.log('Trying to insert JadwalMonitoring...');
    try {
        const created = await prisma.jadwalMonitoring.create({
            data: {
                cadisdik_id: budi.cadisdik_id || '',
                pegawai_id: budi.pegawai_id,
                sekolah_id: sekolah.sekolah_id,
                tanggal_mulai: new Date(),
                tanggal_selesai: new Date(),
                agenda: 'Test Agenda',
                keterangan: 'Test Keterangan',
                status: 'scheduled',
            },
        });
        console.log('Successfully created:', created);
    }
    catch (err) {
        console.error('Error inserting JadwalMonitoring:', err);
    }
}
main()
    .catch((e) => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=test-insert.js.map