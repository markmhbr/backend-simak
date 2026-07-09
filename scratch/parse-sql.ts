import * as fs from 'fs';
import * as path from 'path';

const sqlPath = 'c:\\Users\\hexa8\\Downloads\\pegawai_kcds.sql';

function parseSqlFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Find where the values start
  const valuesStart = content.indexOf('VALUES');
  if (valuesStart === -1) {
    throw new Error('Could not find VALUES clause in SQL file.');
  }

  // Extract the text after VALUES
  const valuesText = content.substring(valuesStart + 6).trim();

  // Parse rows
  // A row is of the form: (9, 9, 'Dr. EDEN...', NULL, ..., 6), or (...);
  const rows: any[] = [];
  
  // Simple state machine or regex to find matching parentheses
  let currentWord = '';
  let inQuotes = false;
  let quoteChar = '';
  let inRow = false;
  let currentRowValues: any[] = [];

  for (let i = 0; i < valuesText.length; i++) {
    const char = valuesText[i];
    
    if (inQuotes) {
      if (char === '\\') {
        // Handle escaped character
        currentWord += char + (valuesText[i + 1] || '');
        i++;
      } else if (char === quoteChar) {
        inQuotes = false;
      } else {
        currentWord += char;
      }
    } else {
      if (char === "'" || char === '"') {
        inQuotes = true;
        quoteChar = char;
      } else if (char === '(') {
        if (!inRow) {
          inRow = true;
          currentRowValues = [];
          currentWord = '';
        } else {
          currentWord += char;
        }
      } else if (char === ')') {
        if (inRow) {
          currentRowValues.push(currentWord.trim());
          rows.push(currentRowValues);
          inRow = false;
        } else {
          // ignore
        }
      } else if (char === ',') {
        if (inRow) {
          currentRowValues.push(currentWord.trim());
          currentWord = '';
        }
      } else if (char === ';') {
        if (inRow) {
          currentRowValues.push(currentWord.trim());
          rows.push(currentRowValues);
          inRow = false;
        }
        break; // End of statement
      } else {
        currentWord += char;
      }
    }
  }

  return rows;
}

const parsed = parseSqlFile(sqlPath);
console.log('Parsed rows count:', parsed.length);
console.log('Sample parsed row 0:', parsed[0]);
console.log('Sample parsed row 1:', parsed[1]);
