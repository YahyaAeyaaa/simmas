import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { requireAuth } from '@/app/lib/auth/middleware';

// GET /api/logbook/stats - Get logbook statistics
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(['siswa', 'guru', 'admin']);

    let whereClause: any = {};

    // Filter by role
    if (session.role === 'siswa') {
      // Siswa can only see their own logbook stats
      whereClause.magang = {
        siswa: {
          user: {
            id: session.userId
          }
        }
      };
    } else if (session.role === 'guru') {
      // Guru can only see stats from their students
      whereClause.magang = {
        guru: {
          user: {
            id: session.userId
          }
        }
      };
    }
    // Admin can see all logbook stats (no additional filter)

    const [
      totalLogbook,
      pendingLogbook,
      approvedLogbook,
      rejectedLogbook
    ] = await Promise.all([
      prisma.logbook.count({ where: whereClause }),
      prisma.logbook.count({ 
        where: { 
          ...whereClause, 
          statusVerifikasi: 'pending' 
        } 
      }),
      prisma.logbook.count({ 
        where: { 
          ...whereClause, 
          statusVerifikasi: 'approved' 
        } 
      }),
      prisma.logbook.count({ 
        where: { 
          ...whereClause, 
          statusVerifikasi: 'rejected' 
        } 
      })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalLogbook,
        pendingLogbook,
        approvedLogbook,
        rejectedLogbook
      }
    });

  } catch (error) {
    console.error('Error fetching logbook stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logbook statistics' },
      { status: 500 }
    );
  }
}
