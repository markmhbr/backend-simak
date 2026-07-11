"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const connectionString = "postgresql://postgres:@127.0.0.1:5432/backend?schema=public";
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const result = await prisma.pegawai.deleteMany({
        where: {
            cadisdik_id: 'a7d04456-3fc8-4153-b0f3-b30a730075d8'
        }
    });
    console.log(`Successfully deleted all ${result.count} imported Pegawai records from database to ensure a clean state for Postman.`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=cleanup-all.js.map