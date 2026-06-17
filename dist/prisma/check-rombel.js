"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const stats = await prisma.rombonganBelajar.groupBy({
        by: ['jenis_rombel_str', 'tingkat_pendidikan_id'],
        _count: true,
    });
    console.log(JSON.stringify(stats, null, 2));
}
main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=check-rombel.js.map