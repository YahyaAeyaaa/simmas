// app/api/admin/dashboard/stats/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';

// GET - Get admin dashboard statistics
export async function GET(request: NextRequest) {
  try {
    // Verify session
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Only admin can access this endpoint' },
        { status: 403 }
      );
    }

    // Get statistics
    const [
      totalSiswa,
      totalGuru,
      totalDudi,
      totalMagang,
      magangAktif,
      magangPending,
      logbookPending,
    ] = await Promise.all([
      // Total siswa
      prisma.siswa.count(),
      
      // Total guru
      prisma.guru.count(),
      
      // Total DUDI
      prisma.dudi.count(),
      
      // Total magang
      prisma.magang.count(),
      
      // Magang aktif (berlangsung)
      prisma.magang.count({
        where: { status: 'berlangsung' }
      }),
      
      // Magang pending
      prisma.magang.count({
        where: { status: 'pending' }
      }),
      
      // Logbook pending (if you have logbook model)
      // For now, return 0 if no logbook model exists
      0, // TODO: Update when logbook model is available
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalSiswa,
        totalGuru,
        totalDudi,
        totalMagang,
        magangAktif,
        magangPending,
        logbookPending,
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

