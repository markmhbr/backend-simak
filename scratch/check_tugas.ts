import * as fs from 'fs';

const content = fs.readFileSync('c:/backend-simak/prisma/schema.prisma', 'utf8');
const lines = content.split('\n');

let inGtk = false;
let inPd = false;

lines.forEach((line, index) => {
  if (line.includes('model Gtk ')) inGtk = true;
  if (line.includes('model PesertaDidik ')) inPd = true;
  
  if (inGtk && line.includes('}')) inGtk = false;
  if (inPd && line.includes('}')) inPd = false;
  
  if (inGtk && line.toLowerCase().includes('foto')) {
    console.log(`Gtk foto field at line ${index + 1}: ${line.trim()}`);
  }
  if (inPd && line.toLowerCase().includes('foto')) {
    console.log(`PesertaDidik foto field at line ${index + 1}: ${line.trim()}`);
  }
});
