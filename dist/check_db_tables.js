"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
require("dotenv/config");
async function checkTables() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new pg_1.Pool({ connectionString });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    const prisma = new client_1.PrismaClient({ adapter });
    try {
        const schoolCount = await prisma.sekolah.count();
        console.log('Total schools in Sekolah table:', schoolCount);
        const schools = await prisma.sekolah.findMany();
        console.log('Schools detail:', JSON.stringify(schools, null, 2));
    }
    catch (error) {
        console.error('Error checking tables:', error);
    }
    finally {
        await prisma.$disconnect();
    }
}
checkTables();
//# sourceMappingURL=check_db_tables.js.map