// app/api/guru/dudi/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';

// GET - Get DUDI statistics untuk guru yang sedang login
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

    // Get total DUDI mitra yang aktif untuk guru ini
    const totalDudiMitra = await prisma.dudi.count({
      where: {
        magang: {
          some: {
            guruId: guru.id,
            status: {
              in: ['pending', 'berlangsung', 'selesai']
            }
          }
        },
        status: 'aktif'
      }
    });

    // Get total siswa magang dari siswa bimbingan guru ini
    const totalSiswaMagang = await prisma.magang.count({
      where: {
        guruId: guru.id,
        status: {
          in: ['pending', 'berlangsung', 'selesai']
        }
      }
    });

    // Hitung rata-rata siswa per perusahaan
    const rataRataSiswaPerusahaan = totalDudiMitra > 0 ? Math.round(totalSiswaMagang / totalDudiMitra) : 0;

    // Get detail statistik per status
    const statistikPerStatus = await prisma.magang.groupBy({
      by: ['status'],
      where: {
        guruId: guru.id
      },
      _count: {
        id: true
      }
    });

    // Transform status statistics
    const statusStats = {
      pending: 0,
      berlangsung: 0,
      selesai: 0
    };

    statistikPerStatus.forEach(stat => {
      if (stat.status in statusStats) {
        statusStats[stat.status as keyof typeof statusStats] = stat._count.id;
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        totalDudiMitra,
        totalSiswaMagang,
        rataRataSiswaPerusahaan,
        statusStats
      }
    });

  } catch (error) {
    console.error('Error fetching guru dudi statistics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch guru dudi statistics' 
      },
      { status: 500 }
    );
  }
}
