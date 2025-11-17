import { prisma } from '@/app/lib/db/prisma';
import { hashPassword } from '@/app/lib/auth/hash';

export type CreateUserPayload = {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'siswa' | 'guru';
  // Tambahan untuk siswa
  jurusan?: string;
  kelas?: 'XI' | 'XII';
  nis?: string;
  // Tambahan untuk guru
  nip?: string;
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
  let user;
  
  if (payload.role === 'siswa') {
    user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role,
        siswa: {
          create: {
            nama: payload.name,
            nis: payload.nis || `NIS-${Date.now()}`,
            kelas: payload.kelas || 'XI',
            jurusan: payload.jurusan || 'Umum',
            alamat: "-",
            telepon: "-"
          }
        }
      },
      include: {
        siswa: true
      }
    });
  } else if (payload.role === 'guru') {
    user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role,
        guru: {
          create: {
            nama: payload.name,
            nip: payload.nip || `NIP-${Date.now()}`,
            alamat: "-",
            telepon: "-"
          }
        }
      },
      include: {
        guru: true
      }
    });
  } else {
    // Admin
    user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role,
      }
    });
  }
  
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