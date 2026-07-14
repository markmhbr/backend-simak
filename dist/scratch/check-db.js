"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function check() {
    try {
        const list = await prisma.jenisJabatan.findMany();
        console.log('--- JENIS JABATAN ENTRIES ---');
        console.log(JSON.stringify(list, null, 2));
    }
    catch (error) {
        console.error(error);
    }
    finally {
        await prisma.$disconnect();
        await pool.end();
    }
}
check();
//# sourceMappingURL=check-db.js.map