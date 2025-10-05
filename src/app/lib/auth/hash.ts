// lib/hash.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function comparePassword(password: string , hashed: string) : Promise<boolean> {
  return bcrypt.compare(password , hashed)
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
