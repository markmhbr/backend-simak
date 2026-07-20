import * as crypto from 'crypto';

export function signUrl(filePath: string, expiresInSeconds: number = 86400): string {
  if (!filePath) return filePath;
  
  const storageIndex = filePath.indexOf('/storage/');
  if (storageIndex === -1) {
    return filePath;
  }

  const baseUrlPart = filePath.substring(0, storageIndex);
  const storagePathPart = filePath.substring(storageIndex);

  const [pathWithoutQuery, existingQuery] = storagePathPart.split('?');
  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const secret = process.env.JWT_SECRET || 'fallback-secret-key';

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${pathWithoutQuery}:${expires}`)
    .digest('hex');

  const queryParams = new URLSearchParams(existingQuery || '');
  queryParams.set('expires', expires.toString());
  queryParams.set('signature', signature);

  return `${baseUrlPart}${pathWithoutQuery}?${queryParams.toString()}`;
}

export function verifyUrlSignature(pathWithoutQuery: string, expires: string, signature: string): boolean {
  if (!expires || !signature) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  if (parseInt(expires, 10) < now) {
    return false;
  }

  const secret = process.env.JWT_SECRET || 'fallback-secret-key';
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${pathWithoutQuery}:${expires}`)
    .digest('hex');

  return signature === expectedSignature;
}
