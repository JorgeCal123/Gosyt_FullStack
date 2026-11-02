const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isEmail(value: string): boolean {
  return EMAIL_REGEX.test(value);
}

export function isUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}
