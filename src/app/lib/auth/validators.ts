// lib/validators.ts

export function isValidEmail(email?: string) {
  if (!email) return false;
  // simple regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(pw?: string) {
  if (!pw) return false;
  // minimal: 8 chars; you can extend the rule
  return pw.length >= 8;
}
