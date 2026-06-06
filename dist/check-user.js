"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcryptjs"));
require("dotenv/config");
const connectionString = process.env.DATABASE_URL;
const pool = new pg_1.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function checkUser() {
    const username = '0089393908@20203728.pd.id';
    const password = '2008-03-21';
    console.log(`Checking user: ${username}`);
    const user = await prisma.pengguna.findFirst({
        where: {
            OR: [
                { username: username },
                { email: username },
            ],
        },
    });
    if (!user) {
        console.log('User NOT FOUND in database.');
        return;
    }
    console.log('User found:', {
        pengguna_id: user.pengguna_id,
        username: user.username,
        email: user.email,
        sekolah_id: user.sekolah_id,
        peran_id_str: user.peran_id_str
    });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match check: ${isMatch}`);
}
checkUser()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=check-user.js.map