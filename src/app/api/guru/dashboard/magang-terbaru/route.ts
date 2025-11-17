// app/api/guru/dashboard/magang-terbaru/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';

// GET - Get magang terbaru untuk guru yang sedang login
export async function GET() {
  try {
    // Get session untuk validasi
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validasi role harus guru
    if (session.role !== 'guru') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Only guru can access this endpoint' },
        { status: 403 }
      );
    }

    // Ambil data guru berdasarkan userId dari session
    const guru = await prisma.guru.findUnique({
      where: { userId: session.userId },
      select: { id: true }
    });

    if (!guru) {
      return NextResponse.json(
        { success: false, error: 'Guru data not found' },
        { status: 404 }
      );
    }

    // Get magang terbaru (limit 5) untuk guru ini
    const magangTerbaru = await prisma.magang.findMany({
      where: {
        guruId: guru.id
      },
      include: {
        siswa: {
          select: {
            nama: true
          }
        },
        dudi: {
          select: {
            namaPerusahaan: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    // Format data untuk response
    const formattedMagang = magangTerbaru.map(magang => ({
      id: magang.id,
      studentName: magang.siswa.nama,
      companyName: magang.dudi.namaPerusahaan,
      startDate: magang.tanggalMulai ? new Date(magang.tanggalMulai).toLocaleDateString('id-ID') : '-',
      endDate: magang.tanggalSelesai ? new Date(magang.tanggalSelesai).toLocaleDateString('id-ID') : '-',
      status: magang.status
    }));

    // Jika tidak ada data real, return data dummy untuk testing
    if (formattedMagang.length === 0) {
      const dummyData = [
        {
          id: 1,
          studentName: "Ahmad Zaki",
          companyName: "PT. Techno Digital",
          startDate: "15/01/2025",
          endDate: "15/02/2025",
          status: "berlangsung" as const
        },
        {
          id: 2,
          studentName: "Siti Nurhaliza",
          companyName: "CV. Kreatif Media",
          startDate: "10/01/2025",
          endDate: "10/02/2025",
          status: "selesai" as const
        },
        {
          id: 3,
          studentName: "Budi Santoso",
          companyName: "PT. Inovasi Cemerlang",
          startDate: "20/01/2025",
          endDate: "20/02/2025",
          status: "pending" as const
        }
      ];

      return NextResponse.json({
        success: true,
        data: dummyData
      });
    }

    return NextResponse.json({
      success: true,
      data: formattedMagang
    });

  } catch (error) {
    console.error('Error fetching magang terbaru:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch magang terbaru' 
      },
      { status: 500 }
    );
  }
}
