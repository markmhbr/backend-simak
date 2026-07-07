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
        const refJenisKeluar = await prisma.jenis_keluar.findMany({
            select: { jenis_keluar_id: true, ket_keluar: true }
        });
        console.log('refJenisKeluar:', refJenisKeluar);
        const students = await prisma.pesertaDidik.findMany({
            where: { NOT: { status: 'Aktif' } },
            take: 5,
            select: {
                peserta_didik_id: true,
                nama: true,
                jenis_keluar_id: true,
                keterangan: true
            }
        });
        console.log('Raw students from DB:', students);
        const mapped = students.map((item) => {
            const jk = refJenisKeluar.find((r) => String(r.jenis_keluar_id) === String(item.jenis_keluar_id));
            return {
                nama: item.nama,
                jenis_keluar_id: item.jenis_keluar_id,
                jenis_keluar_id_str: jk?.ket_keluar || null,
                keterangan: item.keterangan
            };
        });
        console.log('Mapped students:', JSON.stringify(mapped, null, 2));
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