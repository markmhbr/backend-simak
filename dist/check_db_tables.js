"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
async function checkTables() {
    const prisma = new client_1.PrismaClient();
    try {
        console.log('Checking for mandala.layanan table...');
        const result = await prisma.$queryRaw `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'mandala' AND table_name = 'layanan')`;
        console.log('mandala.layanan exists:', result);
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