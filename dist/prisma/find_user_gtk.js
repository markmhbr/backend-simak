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
    console.log('=== CHECKING USER & GTK DATA ===');
    const users = await prisma.pengguna.findMany({
        where: {
            OR: [
                { nama: { contains: 'Rizki', mode: 'insensitive' } },
                { email: { contains: 'mitrapasundan', mode: 'insensitive' } },
                { username: { contains: 'mitrapasundan', mode: 'insensitive' } },
                { peran_nama: { contains: 'Operator', mode: 'insensitive' } }
            ]
        },
        select: {
            pengguna_id: true,
            sekolah_id: true,
            username: true,
            email: true,
            nama: true,
            peran_nama: true,
            ptk_id: true
        }
    });
    console.log('Pengguna matching query:', users);
    const gtks = await prisma.gtk.findMany({
        select: {
            ptk_id: true,
            sekolah_id: true,
            nama: true,
            email: true,
            nik: true,
            nuptk: true
        }
    });
    console.log('Total GTKs count:', gtks.length);
    console.log('Sample GTKs:', gtks.slice(0, 10));
}
main()
    .catch(console.error)
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=find_user_gtk.js.map