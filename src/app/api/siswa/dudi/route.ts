import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';

// GET all dudi for siswa (only active dudi)
export async function GET(request: NextRequest) {
  try {
    // Get session untuk validasi
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validasi role harus siswa
    if (session.role !== 'siswa') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Only siswa can access this endpoint' },
        { status: 403 }
      );
    }

    // Ambil data siswa berdasarkan userId dari session
    const siswa = await prisma.siswa.findUnique({
      where: { userId: session.userId },
      select: { id: true }
    });

    if (!siswa) {
      return NextResponse.json(
        { success: false, error: 'Siswa data not found' },
        { status: 404 }
      );
    }

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

    // Get dudi with active magang count (ONLY yang sudah disetujui/berlangsung)
    const dudiList = await prisma.dudi.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            magang: {
              where: {
                status: 'berlangsung'
              }
            }
          }
        },
        magang: {
          where: {
            siswaId: siswa.id
          },
          select: {
            status: true,
            createdAt: true
          }
        },
        guruPenanggungJawab: {
          select: {
            nama: true,
            nip: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform data to match frontend interface
    const transformedDudi = dudiList.map(dudi => {
      // dudi.magang sudah difilter siswaId: siswa.id, jadi cukup cek panjang array
      const studentMagang = dudi.magang[0];
      const sudahDaftar = dudi.magang.length > 0;
      
      // Determine badge based on registration status
      let badge = 'Tersedia';
      if (sudahDaftar && studentMagang) {
        switch (studentMagang.status) {
          case 'pending':
            badge = 'Menunggu Approval';
            break;
          case 'berlangsung':
            badge = 'Diterima';
            break;
          case 'ditolak':
            badge = 'Ditolak';
            break;
          case 'selesai':
            badge = 'Selesai';
            break;
        }
      }

      return {
        id: dudi.id,
        nama: dudi.namaPerusahaan,
        bidang: dudi.bidangUsaha || 'Tidak Diketahui',
        alamat: dudi.alamat,
        pic: dudi.penanggungJawab,
        kuotaMagang: `${dudi._count.magang}/${dudi.kuotaMagang || 0}`,
        slotTerisi: dudi._count.magang,
        slotTotal: dudi.kuotaMagang || 0,
        deskripsi: dudi.deskripsi || 'Tidak ada deskripsi',
        sudahDaftar,
        badge,
        // Additional fields for modal
        telepon: dudi.telepon,
        email: dudi.email,
        penanggungJawab: dudi.penanggungJawab,
        guruPenanggungJawab: dudi.guruPenanggungJawab ? {
          nama: dudi.guruPenanggungJawab.nama,
          nip: dudi.guruPenanggungJawab.nip
        } : null
      };
    });

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
