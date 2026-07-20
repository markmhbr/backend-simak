export declare function signUrl(filePath: string, expiresInSeconds?: number): string;
export declare function verifyUrlSignature(pathWithoutQuery: string, expires: string, signature: string): boolean;
