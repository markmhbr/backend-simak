"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
async function main() {
    const baseConnectionString = "postgresql://postgres:simak@localhost:5432/postgres";
    const baseClient = new pg_1.Client({ connectionString: baseConnectionString });
    try {
        await baseClient.connect();
        console.log('Successfully connected to port 5432!');
        const dbRes = await baseClient.query("SELECT datname FROM pg_database WHERE datistemplate = false;");
        const databases = dbRes.rows.map((r) => r.datname);
        console.log('Databases on 5432:', databases);
        for (const db of databases) {
            console.log(`\nChecking database on 5432: ${db}`);
            const client = new pg_1.Client({ connectionString: `postgresql://postgres:simak@localhost:5432/${db}` });
            await client.connect();
            try {
                const schemasRes = await client.query("SELECT schema_name FROM information_schema.schemata;");
                console.log(`  Schemas:`, schemasRes.rows.map((r) => r.schema_name));
                const tablesRes = await client.query(`
          SELECT table_schema, table_name 
          FROM information_schema.tables 
          WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
          ORDER BY table_schema, table_name;
        `);
                console.log(`  Tables:`, tablesRes.rows.map((r) => `${r.table_schema}.${r.table_name}`));
            }
            catch (err) {
                console.log(`  Error connecting to ${db}:`, err.message);
            }
            finally {
                await client.end();
            }
        }
    }
    catch (error) {
        console.error('Error connecting to 5432:', error.message);
    }
    finally {
        try {
            await baseClient.end();
        }
        catch { }
    }
}
main();
//# sourceMappingURL=scratch-check.js.map