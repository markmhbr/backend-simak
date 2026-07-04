import * as fs from 'fs';

const content = fs.readFileSync('c:/backend-simak/prisma/schema.prisma', 'utf8');
const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.toLowerCase().includes('ptk_terdaftar_id')) {
    console.log(`${index + 1}: ${line}`);
  }
});
