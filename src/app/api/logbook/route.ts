import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { requireAuth } from '@/app/lib/auth/middleware';

// GET /api/logbook - Get logbooks for current user
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth(['siswa', 'guru', 'admin']);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    let whereClause: any = {};

    // Filter by role
    if (session.role === 'siswa') {
      // Siswa can only see their own logbooks
      whereClause.magang = {
        siswa: {
          user: {
            id: session.userId
          }
        }
      };
    } else if (session.role === 'guru') {
      // Guru can only see logbooks from their students
      whereClause.magang = {
        guru: {
          user: {
            id: session.userId
          }
        }
      };
    }
    // Admin can see all logbooks (no additional filter)

    // Filter by status
    if (status) {
      whereClause.statusVerifikasi = status;
    }

    // Search functionality
    if (search) {
      whereClause.OR = [
        { kegiatan: { contains: search, mode: 'insensitive' } },
        { kendala_2: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [logbooks, totalCount] = await Promise.all([
      prisma.logbook.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          magang: {
            include: {
              siswa: {
                select: {
                  id: true,
                  nama: true,
                  nis: true
                }
              },
              dudi: {
                select: {
                  id: true,
                  namaPerusahaan: true
                }
              },
              guru: {
                select: {
                  id: true,
                  nama: true
                }
              }
            }
          }
        }
      }),
      prisma.logbook.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      success: true,
      data: logbooks,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Error fetching logbooks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logbooks' },
      { status: 500 }
    );
  }
}

// POST /api/logbook - Create new logbook entry
export async function POST(request: NextRequest) {
  try {
    const session = await requireAuth(['siswa']);
    
    const body = await request.json();
    const { magangId, kegiatan, kendala_2, file } = body;

    // Validate required fields
    if (!magangId || !kegiatan) {
      return NextResponse.json(
        { success: false, error: 'Magang ID and kegiatan are required' },
        { status: 400 }
      );
    }

    // Check if student has active magang
    const magang = await prisma.magang.findFirst({
      where: {
        id: magangId,
        siswa: {
          user: {
            id: session.userId
          }
        },
        status: 'berlangsung'
      },
      include: {
        guru: true
      }
    });

    if (!magang) {
      return NextResponse.json(
        { success: false, error: 'Active magang not found or you are not authorized' },
        { status: 404 }
      );
    }

    // Create logbook entry
    const logbook = await prisma.logbook.create({
      data: {
        magangId,
        tanggal: new Date(),
        kegiatan,
        kendala_2: kendala_2 || '',
        file: file || '',
        statusVerifikasi: 'pending'
      },
      include: {
        magang: {
          include: {
            siswa: {
              select: {
                id: true,
                nama: true,
                nis: true
              }
            },
            dudi: {
              select: {
                id: true,
                namaPerusahaan: true
              }
            },
            guru: {
              select: {
                id: true,
                nama: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: logbook,
      message: 'Logbook entry created successfully'
    });

  } catch (error) {
    console.error('Error creating logbook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create logbook entry' },
      { status: 500 }
    );
  }
}
