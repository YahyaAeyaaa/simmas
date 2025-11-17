import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { hashPassword } from '@/app/lib/auth/hash';
import { z } from 'zod';

// Validation schema for base user
const baseUserSchema = {
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['admin', 'guru', 'siswa']),
  emailVerification: z.enum(['verified', 'unverified']),
};

// Schema for siswa
const siswaSchema = z.object({
  ...baseUserSchema,
  role: z.literal('siswa'),
  jurusan: z.string().min(1, 'Jurusan wajib diisi'),
  kelas: z.enum(['XI', 'XII']),
  nis: z.string().optional(),
});

// Schema for guru
const guruSchema = z.object({
  ...baseUserSchema,
  role: z.literal('guru'),
  nip: z.string().optional(),
});

// Schema for admin
const adminSchema = z.object({
  ...baseUserSchema,
  role: z.literal('admin'),
});

// Combined schema using discriminated union
const createUserSchema = z.discriminatedUnion('role', [
  siswaSchema,
  guruSchema,
  adminSchema,
]);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = createUserSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Data tidak valid',
          details: validationResult.error
        },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    const { username, email, password, role, emailVerification } = data;

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email sudah terdaftar' 
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Set email verification date
    const emailVerifiedAt = emailVerification === 'verified' ? new Date() : null;

    let user;

    // Create user with related data based on role
    if (role === 'siswa') {
      user = await prisma.user.create({
        data: {
          name: username,
          email,
          password: hashedPassword,
          role,
          emailVerifiedAt,
          siswa: {
            create: {
              nama: username,
              nis: data.nis || `NIS-${Date.now()}`,
              kelas: data.kelas,
              jurusan: data.jurusan,
              alamat: "-",
              telepon: "-"
            }
          }
        },
        include: {
          siswa: true
        }
      });
    } else if (role === 'guru') {
      user = await prisma.user.create({
        data: {
          name: username,
          email,
          password: hashedPassword,
          role,
          emailVerifiedAt,
          guru: {
            create: {
              nama: username,
              nip: data.nip || `NIP-${Date.now()}`,
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
      // Admin role - selalu set emailVerifiedAt untuk admin
      user = await prisma.user.create({
        data: {
          name: username,
          email,
          password: hashedPassword,
          role,
          emailVerifiedAt: new Date() // Pastikan email admin selalu terverifikasi
        },
        include: {
          siswa: true,
          guru: true
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerifiedAt: user.emailVerifiedAt,
        siswa: user.siswa,
        guru: user.guru
      },
      message: 'User berhasil dibuat'
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Data tidak valid',
          details: error
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal membuat user' 
      },
      { status: 500 }
    );
  }
}
