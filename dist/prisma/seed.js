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
const bcrypt = __importStar(require("bcryptjs"));
require("dotenv/config");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('Cleaning ref schema for manual dump import...');
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS ref CASCADE;`);
    await prisma.$executeRawUnsafe(`CREATE SCHEMA ref;`);
    console.log('Schema ref reset successfully.');
    const rawPassword = 'simak2026';
    const hashedPassword = await bcrypt.hash(rawPassword, 10);
    const adminIdentifier = 'admin';
    console.log('Checking for existing Super Admin...');
    const existingAdmin = await prisma.pengguna.findFirst({
        where: {
            email: adminIdentifier
        }
    });
    const nipLogin = '199501012024011001';
    console.log('Checking for existing Cadisdik reference...');
    let defaultCadisdik = await prisma.cadisdik.findFirst();
    if (!defaultCadisdik) {
        console.log('No Cadisdik found. Creating a mock Cadisdik for relation...');
        defaultCadisdik = await prisma.cadisdik.create({
            data: {
                nama_instansi: 'Wilayah Mock Kesatu',
            }
        });
    }
    const targetCadisdikId = defaultCadisdik.cadisdik_id;
    console.log('Checking for existing Pegawai account...');
    const existingPegawai = await prisma.pegawai.findUnique({
        where: {
            nip: nipLogin
        }
    });
    if (!existingPegawai) {
        console.log('Creating default Pegawai account...');
        await prisma.pegawai.create({
            data: {
                cadisdik_id: targetCadisdikId,
                nama_lengkap: 'Budi Setiawan, S.Kom',
                nik: '3273012345670001',
                tempat_lahir: 'Bandung',
                tanggal_lahir: new Date('1995-01-01'),
                alamat_lengkap: 'Jl. Diponegoro No. 22, Kota Bandung, Jawa Barat',
                nip: nipLogin,
                email: 'budi.setiawan@simak.go.id',
                password: hashedPassword,
                jabatan: 1,
                jenis_kelamin: 1,
                nomor_telepon: '081234567890',
                foto: null,
                aktif: true
            }
        });
        console.log('Pegawai account created successfully!');
        console.log(`Login NIP  : ${nipLogin}`);
        console.log(`Password   : ${rawPassword}`);
    }
    else {
        console.log(`Pegawai with NIP ${nipLogin} already exists.`);
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map