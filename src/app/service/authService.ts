// service/authService.ts
import { prisma } from '@/app/lib/db/prisma'; 
import { comparePassword } from '@/app/lib/auth/hash'; 
import { signJwt } from '@/app/lib/auth/jwt';
import type { Role } from '@prisma/client';

export class AuthError extends Error {
  public code: string;
  constructor(message: string, code = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Result returned from loginService
 */
export type LoginResult = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  };
};

/**
 * Login logic:
 * - find user by email
 * - compare password
 * - sign jwt (payload: userId, email, role)
 * - return token + user public data
 */
export async function loginService(email: string, password: string): Promise<LoginResult> {
  // normalize email
  const mail = (email || '').trim().toLowerCase();
  if (!mail || !password) {
    throw new AuthError('Email and password are required', 'MISSING_CREDENTIALS');
  }

  const user = await prisma.user.findUnique({
    where: { email: mail },
  });

  if (!user) {
    // do not reveal whether email exists: generic message recommended,
    // but you can choose to give a specific message
    throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const ok = await comparePassword(password, user.password);
  if (!ok) {
    throw new AuthError('Invalid email or password', 'INVALID_CREDENTIALS');
  }

  // sign token: include minimal necessary info
  const token = signJwt(
    { userId: user.id, 
      email: user.email, 
      name: user.name,
      role: user.role },
    '7d' // expiration, bisa disesuaikan
  );

  // Return user public fields (exclude password)
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
  };
}
