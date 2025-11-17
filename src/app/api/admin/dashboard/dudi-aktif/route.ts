// app/api/admin/dashboard/dudi-aktif/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';

// GET - Get active DUDI for admin dashboard
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

    // Get all active DUDI (limit 50 for performance)
    const dudiList = await prisma.dudi.findMany({
      where: {
        status: 'aktif'
      },
      take: 50,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            magang: {
              where: {
                status: {
                  in: ['pending', 'berlangsung']
                }
              }
            }
          }
        }
      }
    });

    const transformedDudi = dudiList.map(dudi => ({
      id: dudi.id,
      companyName: dudi.namaPerusahaan,
      address: dudi.alamat,
      phone: dudi.telepon,
      email: dudi.email,
      studentCount: dudi._count.magang,
      status: dudi.status,
    }));

    return NextResponse.json({
      success: true,
      data: transformedDudi
    });
  } catch (error) {
    console.error('Error fetching dudi aktif:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

