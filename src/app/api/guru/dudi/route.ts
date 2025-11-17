// app/api/guru/dudi/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';

// GET - Get DUDI berdasarkan siswa bimbingan guru yang sedang login
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause untuk search
    const whereClause: {
      AND: Array<{
        magang: {
          some: {
            guruId: number;
            status?: { in: string[] };
          };
        };
        OR?: Array<{
          namaPerusahaan?: { contains: string; mode: 'insensitive' };
          alamat?: { contains: string; mode: 'insensitive' };
          email?: { contains: string; mode: 'insensitive' };
          penanggungJawab?: { contains: string; mode: 'insensitive' };
          bidangUsaha?: { contains: string; mode: 'insensitive' };
        }>;
      }>;
    } = {
      AND: [
        {
          magang: {
            some: {
              guruId: guru.id,
              status: {
                in: ['pending', 'berlangsung', 'selesai']
              }
            }
          }
        }
      ]
    };

    // Add search conditions
    if (search) {
      whereClause.AND.push({
        OR: [
          { namaPerusahaan: { contains: search, mode: 'insensitive' } },
          { alamat: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { penanggungJawab: { contains: search, mode: 'insensitive' } },
          { bidangUsaha: { contains: search, mode: 'insensitive' } }
        ]
      });
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.dudi.count({
      where: whereClause
    });

    // Get DUDI dengan siswa bimbingan guru
    const dudiList = await prisma.dudi.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            magang: {
              where: {
                guruId: guru.id,
                status: {
                  in: ['pending', 'berlangsung', 'selesai']
                }
              }
            }
          }
        },
        magang: {
          where: {
            guruId: guru.id,
            status: {
              in: ['pending', 'berlangsung', 'selesai']
            }
          },
          include: {
            siswa: {
              select: {
                nama: true,
                nis: true,
                kelas: true,
                jurusan: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Transform data untuk frontend
    const transformedDudi = dudiList.map(dudi => ({
      id: dudi.id,
      namaPerusahaan: dudi.namaPerusahaan,
      alamat: dudi.alamat,
      email: dudi.email,
      telepon: dudi.telepon,
      penanggungJawab: dudi.penanggungJawab,
      bidangUsaha: dudi.bidangUsaha,
      deskripsi: dudi.deskripsi,
      kuotaMagang: dudi.kuotaMagang,
      status: dudi.status,
      jumlahSiswaMagang: dudi._count.magang,
      siswaBimbingan: dudi.magang.map(m => ({
        id: m.id,
        nama: m.siswa.nama,
        nis: m.siswa.nis,
        kelas: m.siswa.kelas,
        jurusan: m.siswa.jurusan,
        status: m.status,
        tanggalMulai: m.tanggalMulai,
        tanggalSelesai: m.tanggalSelesai
      }))
    }));

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: transformedDudi,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('Error fetching guru dudi:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch guru dudi' 
      },
      { status: 500 }
    );
  }
}
