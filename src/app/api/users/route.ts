import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause for search and role filter
    const whereClause: {
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        siswa?: { nama: { contains: string; mode: 'insensitive' } };
        guru?: { nama: { contains: string; mode: 'insensitive' } };
        dudi?: { namaPerusahaan: { contains: string; mode: 'insensitive' } };
      }>;
      role?: string;
    } = {};
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { siswa: { nama: { contains: search, mode: 'insensitive' } } },
        { guru: { nama: { contains: search, mode: 'insensitive' } } },
        { dudi: { namaPerusahaan: { contains: search, mode: 'insensitive' } } }
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.user.count({
      where: whereClause
    });

    // Get users with pagination
    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        siswa: true,
        guru: true,
        dudi: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Transform data to match frontend interface
    const transformedUsers = users.map(user => {
      let displayName = user.name;
      let displayId = user.id.toString();

      // Get display name and ID based on role
      if (user.role === 'siswa' && user.siswa) {
        displayName = user.siswa.nama;
        displayId = user.siswa.nis;
      } else if (user.role === 'guru' && user.guru) {
        displayName = user.guru.nama;
        displayId = user.guru.nip;
      } else if (user.role === 'admin') {
        displayName = user.name;
        displayId = user.id.toString();
      } else if (user.dudi) {
        displayName = user.dudi.namaPerusahaan;
        displayId = user.id.toString();
      }

      return {
        id: user.id,
        namaPerusahaan: displayName,
        id_user: displayId,
        email: user.email,
        verifed_at: user.emailVerifiedAt ? 'Verified' : 'Unverified',
        penanggungJawab: displayName,
        status: user.role,
        Terdaftar_pada: user.createdAt.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        })
      };
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: transformedUsers,
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
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch users' 
      },
      { status: 500 }
    );
  }
}
