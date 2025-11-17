// app/api/guru/dashboard/logbook-terbaru/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';

// GET - Get logbook terbaru untuk guru yang sedang login
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

    // Get logbook terbaru (limit 5) untuk siswa bimbingan guru ini
    const logbookTerbaru = await prisma.logbook.findMany({
      where: {
        magang: {
          guruId: guru.id
        }
      },
      include: {
        magang: {
          include: {
            siswa: {
              select: {
                nama: true
              }
            }
          }
        }
      },
      orderBy: {
        tanggal: 'desc'
      },
      take: 5
    });

    // Format data untuk response
    const formattedLogbook = logbookTerbaru.map(logbook => ({
      id: logbook.id,
      name: logbook.magang.siswa.nama,
      date: new Date(logbook.tanggal).toLocaleDateString('id-ID'),
      issue: logbook.kegiatan || logbook.kendala || '-',
      status: logbook.statusVerifikasi
    }));

    // Jika tidak ada data real, return data dummy untuk testing
    if (formattedLogbook.length === 0) {
      const dummyData = [
        {
          id: 1,
          name: "Ahmad Zaki",
          date: "15/01/2025",
          issue: "Mempelajari sistem database dan membuat laporan harian",
          status: "pending" as const
        },
        {
          id: 2,
          name: "Siti Nurhaliza",
          date: "14/01/2025",
          issue: "Mengikuti meeting dengan tim development",
          status: "disetujui" as const
        },
        {
          id: 3,
          name: "Budi Santoso",
          date: "13/01/2025",
          issue: "Mengalami kendala dalam memahami framework baru",
          status: "ditolak" as const
        }
      ];

      return NextResponse.json({
        success: true,
        data: dummyData
      });
    }

    return NextResponse.json({
      success: true,
      data: formattedLogbook
    });

  } catch (error) {
    console.error('Error fetching logbook terbaru:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch logbook terbaru' 
      },
      { status: 500 }
    );
  }
}
