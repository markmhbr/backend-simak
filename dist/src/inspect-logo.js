"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const fs = require('fs');
const path = require('path');
const dotenvContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf-8');
const dbUrlLine = dotenvContent.split('\n').find((l) => l.startsWith('DATABASE_URL='));
const dbUrlValue = dbUrlLine ? dbUrlLine.split('=')[1].replace(/"/g, '').trim() : '';
const pool = new pg_1.Pool({ connectionString: dbUrlValue });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const sekolah = await prisma.sekolah.findFirst();
    console.log('====================================');
    console.log('Sekolah logo from DB:', sekolah?.logo);
    console.log('====================================');
    process.exit(0);
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=inspect-logo.js.map