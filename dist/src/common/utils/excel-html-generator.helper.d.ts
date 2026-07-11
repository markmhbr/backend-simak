export interface StudentRow {
    nisn: string;
    nama: string;
}
export declare function validateExcelHeader(filePathOrBuffer: string | Buffer): boolean;
export declare function parseExcelData(filePathOrBuffer: string | Buffer): StudentRow[];
export declare function generateHtmlTable(students: StudentRow[]): string;
export declare function generateHtmlTableRows(students: StudentRow[]): string;
export declare function getTemplateHeaders(templateKonten?: string): string[] | null;
export declare function isAutoField(header: string): boolean;
export declare function validateDynamicExcel(filePathOrBuffer: string | Buffer, expectedHeaders: string[]): {
    isValid: boolean;
    error?: string;
};
export declare function parseDynamicExcel(filePathOrBuffer: string | Buffer, expectedHeaders: string[], schoolData: any): any[];
export declare function generateDynamicHtmlTable(headers: string[], rows: any[]): string;
