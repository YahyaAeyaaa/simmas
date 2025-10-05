import { prisma } from '@/app/lib/db/prisma';
import { hashPassword } from '@/app/lib/auth/hash';

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'siswa' | 'guru';
};

export class AppError extends Error {
  public code: string;
  constructor(message: string, code = 'APP_ERROR') {
    super(message);
    this.name = 'AppError';
    this.code = code;
    // maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(payload: CreateUserPayload) {
  // password must be hashed before calling this
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
}

/**
 * convenience: validate+hash then create
 */
export async function registerUser(payload: CreateUserPayload) {
  const exist = await findUserByEmail(payload.email);
  if (exist) {
    throw new AppError('email alredy regitered' , 'EMAIL_EXISTS')
  }

  const hashed = await hashPassword(payload.password);
  return createUser({ ...payload, password: hashed });
}