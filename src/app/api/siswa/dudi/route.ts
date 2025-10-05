import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

// GET all dudi for siswa (only active dudi)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build where clause for search and only active dudi
    const whereClause: {
      status: 'aktif';
      OR?: Array<{
        namaPerusahaan?: { contains: string; mode: 'insensitive' };
        alamat?: { contains: string; mode: 'insensitive' };
        bidangUsaha?: { contains: string; mode: 'insensitive' };
      }>;
    } = {
      status: 'aktif'
    };
    
    if (search) {
      whereClause.OR = [
        { namaPerusahaan: { contains: search, mode: 'insensitive' } },
        { alamat: { contains: search, mode: 'insensitive' } },
        { bidangUsaha: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get dudi with magang count
    const dudiList = await prisma.dudi.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            magang: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match frontend interface
    const transformedDudi = dudiList.map(dudi => ({
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
    }));

    return NextResponse.json({
      success: true,
      data: transformedDudi
    });

  } catch (error) {
    console.error('Error fetching dudi for siswa:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dudi list' 
      },
      { status: 500 }
    );
  }
}
