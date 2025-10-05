import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

// GET single dudi by ID for siswa
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dudiId = parseInt(params.id);
    
    if (isNaN(dudiId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID dudi tidak valid' 
        },
        { status: 400 }
      );
    }

    const dudi = await prisma.dudi.findUnique({
      where: { 
        id: dudiId,
        status: 'aktif' // Only active dudi
      },
      include: {
        _count: {
          select: {
            magang: true
          }
        }
      }
    });

    if (!dudi) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dudi tidak ditemukan atau tidak aktif' 
        },
        { status: 404 }
      );
    }

    // Transform data to match frontend interface
    const transformedDudi = {
      id: dudi.id,
      nama: dudi.namaPerusahaan,
      bidang: dudi.bidangUsaha || 'Tidak Diketahui',
      alamat: dudi.alamat,
      pic: dudi.penanggungJawab,
      kuotaMagang: `${dudi._count.magang}/${dudi.kuotaMagang || 0}`,
      slotTerisi: dudi._count.magang,
      slotTotal: dudi.kuotaMagang || 0,
      deskripsi: dudi.deskripsi || 'Tidak ada deskripsi',
      sudahDaftar: false, // TODO: Implement based on user's magang status
      badge: 'Tersedia',
      // Additional fields for modal
      telepon: dudi.telepon,
      email: dudi.email,
      penanggungJawab: dudi.penanggungJawab
    };

    return NextResponse.json({
      success: true,
      data: transformedDudi
    });

  } catch (error) {
    console.error('Error fetching dudi:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data dudi' 
      },
      { status: 500 }
    );
  }
}
