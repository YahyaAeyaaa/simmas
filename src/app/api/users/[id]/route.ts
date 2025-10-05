import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { z } from 'zod';

// Validation schema for update
const updateUserSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  email: z.string().email('Format email tidak valid'),
  role: z.enum(['admin', 'guru', 'siswa']),
  emailVerification: z.enum(['verified', 'unverified'])
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID user tidak valid' 
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = updateUserSchema.parse(body);
    
    const { username, email, role, emailVerification } = validatedData;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User tidak ditemukan' 
        },
        { status: 404 }
      );
    }

    // Check if email already exists (excluding current user)
    const emailExists = await prisma.user.findFirst({
      where: { 
        email,
        id: { not: userId }
      }
    });

    if (emailExists) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email sudah digunakan oleh user lain' 
        },
        { status: 400 }
      );
    }

    // Set email verification date
    const emailVerifiedAt = emailVerification === 'verified' ? new Date() : null;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: username,
        email,
        role,
        emailVerifiedAt
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        emailVerifiedAt: updatedUser.emailVerifiedAt
      },
      message: 'User berhasil diperbarui'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    
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
        error: 'Gagal memperbarui user' 
      },
      { status: 500 }
    );
  }
}

// GET single user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID user tidak valid' 
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        siswa: true,
        guru: true,
        dudi: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User tidak ditemukan' 
        },
        { status: 404 }
      );
    }

    // Transform data to match frontend interface
    let displayName = user.name;
    let displayId = user.id.toString();

    // Get display name and ID based on role
    if (user.role === 'siswa' && user.siswa) {
      displayName = user.siswa.nama;
      displayId = user.siswa.nis;
    } else if (user.role === 'guru' && user.guru) {
      displayName = user.guru.nama;
      displayId = user.guru.nip;
    } else if (user.role === 'admin') {
      displayName = user.name;
      displayId = user.id.toString();
    } else if (user.dudi) {
      displayName = user.dudi.namaPerusahaan;
      displayId = user.id.toString();
    }

    const transformedUser = {
      id: user.id,
      namaPerusahaan: displayName,
      id_user: displayId,
      email: user.email,
      verifed_at: user.emailVerifiedAt ? 'Verified' : 'Unverified',
      penanggungJawab: displayName,
      status: user.role,
      Terdaftar_pada: user.createdAt.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    return NextResponse.json({
      success: true,
      data: transformedUser
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data user' 
      },
      { status: 500 }
    );
  }
}

// DELETE user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    
    if (isNaN(userId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID user tidak valid' 
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        siswa: true,
        guru: true,
        dudi: true
      }
    });

    if (!existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User tidak ditemukan' 
        },
        { status: 404 }
      );
    }

    // Check if user has related data that prevents deletion
    // For example, if siswa has magang records, we might want to prevent deletion
    if (existingUser.siswa) {
      const magangCount = await prisma.magang.count({
        where: { siswaId: existingUser.siswa.id }
      });
      
      if (magangCount > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Tidak dapat menghapus user karena memiliki data magang yang terkait' 
          },
          { status: 400 }
        );
      }
    }

    if (existingUser.guru) {
      const magangCount = await prisma.magang.count({
        where: { guruId: existingUser.guru.id }
      });
      
      if (magangCount > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Tidak dapat menghapus user karena memiliki data magang yang terkait' 
          },
          { status: 400 }
        );
      }
    }

    if (existingUser.dudi) {
      const magangCount = await prisma.magang.count({
        where: { dudiId: existingUser.dudi.id }
      });
      
      if (magangCount > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Tidak dapat menghapus user karena memiliki data magang yang terkait' 
          },
          { status: 400 }
        );
      }
    }

    // Delete user (this will cascade delete related records due to Prisma relations)
    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({
      success: true,
      message: 'User berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal menghapus user' 
      },
      { status: 500 }
    );
  }
}