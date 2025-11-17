import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth/middleware';
import { prisma } from '@/app/lib/db/prisma';

/**
 * GET /api/siswa/magang/status
 * Fetch current internship status for logged-in student
 */
export async function GET(req: NextRequest) {
  try {
    // Get session
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow siswa role
    if (session.role !== 'siswa') {
      return NextResponse.json(
        { success: false, error: 'Forbidden - Siswa only' },
        { status: 403 }
      );
    }

    const userId = session.userId;

    // Get siswa data
    const siswa = await prisma.siswa.findFirst({
      where: { userId },
      select: {
        id: true,
        nis: true,
        nama: true,
        kelas: true,
        jurusan: true,
      }
    });

    if (!siswa) {
      return NextResponse.json(
        { success: false, error: 'Student data not found' },
        { status: 404 }
      );
    }

    // Get active or most recent internship
    const magang = await prisma.magang.findFirst({
      where: {
        siswaId: siswa.id,
      },
      include: {
        dudi: {
          select: {
            namaPerusahaan: true,
            alamat: true,
            bidangUsaha: true,
          }
        },
        guru: {
          select: {
            nama: true,
            nip: true,
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // aktif first
        { createdAt: 'desc' }, // then most recent
      ]
    });

    if (!magang) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No internship data found',
          data: null 
        },
        { status: 404 }
      );
    }

    // Format the response
    const statusMagang = {
      siswa: {
        nama: siswa.nama,
        nis: siswa.nis,
        kelas: siswa.kelas,
        jurusan: siswa.jurusan,
      },
      dudi: {
        namaPerusahaan: magang.dudi.namaPerusahaan,
        alamat: magang.dudi.alamat,
        bidangUsaha: magang.dudi.bidangUsaha || '-',
      },
      periode: {
        tanggalMulai: magang.tanggalMulai,
        tanggalSelesai: magang.tanggalSelesai,
        status: magang.status,
      },
      guru: {
        nama: magang.guru.nama,
        nip: magang.guru.nip,
      },
      nilaiAkhir: magang.nilaiAkhir || null,
    };

    return NextResponse.json(
      {
        success: true,
        data: statusMagang,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching student internship status:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

