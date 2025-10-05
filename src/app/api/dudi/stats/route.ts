import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

// GET dudi statistics
export async function GET(request: NextRequest) {
  try {
    // Get total dudi count
    const totalDudi = await prisma.dudi.count();

    // Get active dudi count
    const aktifDudi = await prisma.dudi.count({
      where: { status: 'aktif' }
    });

    // Get non-active dudi count
    const nonaktifDudi = await prisma.dudi.count({
      where: { status: 'nonaktif' }
    });

    // Get pending dudi count
    const pendingDudi = await prisma.dudi.count({
      where: { status: 'pending' }
    });

    // Get total students in internship
    const totalSiswaMagang = await prisma.magang.count({
      where: {
        status: {
          in: ['diterima', 'berlangsung']
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalDudi,
        aktifDudi,
        nonaktifDudi,
        pendingDudi,
        totalSiswaMagang
      }
    });

  } catch (error) {
    console.error('Error fetching dudi statistics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil statistik dudi' 
      },
      { status: 500 }
    );
  }
}
