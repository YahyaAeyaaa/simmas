import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { hashPassword } from '@/app/lib/auth/hash';
import { z } from 'zod';

// Validation schema
const createUserSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  role: z.enum(['admin', 'guru', 'siswa']),
  emailVerification: z.enum(['verified', 'unverified']),
  jurusan: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = createUserSchema.parse(body);
    
    const { username, email, password, role, emailVerification, jurusan } = validatedData;

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

    // Create user
    const user = await prisma.user.create({
      data: {
        name: username,
        email,
        password: hashedPassword,
        role,
        emailVerifiedAt,
        ...(role === 'siswa' && {
          siswa: {
            create: {
              nama: username,
              nis: '', // Default empty, should be updated later
              kelas: '', // Default empty, should be updated later
              jurusan: jurusan || '',
              alamat: '', // Default empty, should be updated later
              telepon: '' // Default empty, should be updated later
            }
          }
        })
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        emailVerifiedAt: user.emailVerifiedAt
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
          details: error.errors
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
