// prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // allow global var in dev to avoid multiple instances
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;
