// app/api/admin/dashboard/magang-terbaru/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';

// GET - Get latest magang for admin dashboard
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

    // Get all latest magang (limit 50 for performance)
    const magangList = await prisma.magang.findMany({
      take: 50,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        siswa: {
          select: {
            id: true,
            nama: true,
            nis: true,
          }
        },
        dudi: {
          select: {
            id: true,
            namaPerusahaan: true,
            alamat: true,
          }
        },
        guru: {
          select: {
            id: true,
            nama: true,
            nip: true,
          }
        }
      }
    });

    const transformedMagang = magangList.map(magang => ({
      id: magang.id,
      studentName: magang.siswa.nama,
      studentNis: magang.siswa.nis,
      companyName: magang.dudi.namaPerusahaan,
      companyAddress: magang.dudi.alamat,
      teacherName: magang.guru.nama,
      startDate: magang.tanggalMulai,
      endDate: magang.tanggalSelesai,
      status: magang.status,
      createdAt: magang.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: transformedMagang
    });
  } catch (error) {
    console.error('Error fetching magang terbaru:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

