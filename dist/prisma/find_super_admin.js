"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
require("dotenv/config");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const users = await prisma.pengguna.findMany({
        where: {
            OR: [
                { peran_nama: 'Super Admin' },
                { sekolah_id: null }
            ]
        },
        select: {
            pengguna_id: true,
            username: true,
            email: true,
            nama: true,
            peran_nama: true,
            sekolah_id: true,
            google2fa_secret: true
        }
    });
    console.log('--- USER DATA ---');
    console.log(JSON.stringify(users, null, 2));
}
main().finally(() => prisma.$disconnect());
//# sourceMappingURL=find_super_admin.js.map