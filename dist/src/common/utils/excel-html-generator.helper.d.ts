export interface StudentRow {
    nisn: string;
    nama: string;
}
export declare function validateExcelHeader(filePathOrBuffer: string | Buffer): boolean;
export declare function parseExcelData(filePathOrBuffer: string | Buffer): StudentRow[];
export declare function generateHtmlTable(students: StudentRow[]): string;
export declare function generateHtmlTableRows(students: StudentRow[]): string;
