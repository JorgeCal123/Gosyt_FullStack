import crypto from 'crypto';

export const ACTIVATION_HOURS = 24;

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// El token "crudo" viaja en el enlace del correo; en la base de datos solo se guarda su hash.
export function generateActivationToken() {
  const token = crypto.randomBytes(32).toString('hex');
  return {
    token,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + ACTIVATION_HOURS * 60 * 60 * 1000),
  };
}
