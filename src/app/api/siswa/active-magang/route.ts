import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { requireAuth } from '@/app/lib/auth/middleware';

// GET /api/siswa/active-magang - Get student's active magang
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(['siswa']);
    
    // Find student's active magang
    const activeMagang = await prisma.magang.findFirst({
      where: {
        siswa: {
          user: {
            id: session.userId
          }
        },
        status: 'berlangsung'
      },
      include: {
        siswa: {
          select: {
            id: true,
            nama: true,
            nis: true
          }
        },
        dudi: {
          select: {
            id: true,
            namaPerusahaan: true,
            alamat: true
          }
        },
        guru: {
          select: {
            id: true,
            nama: true,
            nip: true
          }
        }
      }
    });

    if (!activeMagang) {
      return NextResponse.json(
        { success: false, error: 'Tidak ada magang aktif' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: activeMagang
    });

  } catch (error) {
    console.error('Error fetching active magang:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch active magang' },
      { status: 500 }
    );
  }
}
