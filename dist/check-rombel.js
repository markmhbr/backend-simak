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
async function checkRombel() {
    console.log('--- ROMBEL DATA CHECK ---');
    const distinctJenis = await prisma.rombonganBelajar.findMany({
        select: { jenis_rombel_str: true },
        distinct: ['jenis_rombel_str']
    });
    console.log('Distinct jenis_rombel_str values:', distinctJenis.map(j => j.jenis_rombel_str));
    const samplePilihan = await prisma.rombonganBelajar.findMany({
        where: {
            OR: [
                { jenis_rombel_str: { contains: 'pilihan', mode: 'insensitive' } },
                { jenis_rombel_str: { contains: 'mapel', mode: 'insensitive' } }
            ]
        },
        take: 5
    });
    console.log('Sample data matching "pilihan":', JSON.stringify(samplePilihan, null, 2));
}
checkRombel()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=check-rombel.js.map