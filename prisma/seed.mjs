import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const hashedPassword = await bcrypt.hash('password', 10);

  // Bikin user admin
  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: 'admin@simmas.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('Admin berhasil dibuat:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });