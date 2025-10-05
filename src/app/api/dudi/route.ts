import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

// GET all dudi with optional search and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause for search
    const whereClause: {
      OR?: Array<{
        namaPerusahaan?: { contains: string; mode: 'insensitive' };
        alamat?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        penanggungJawab?: { contains: string; mode: 'insensitive' };
        bidangUsaha?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};
    
    if (search) {
      whereClause.OR = [
        { namaPerusahaan: { contains: search, mode: 'insensitive' } },
        { alamat: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { penanggungJawab: { contains: search, mode: 'insensitive' } },
        { bidangUsaha: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.dudi.count({
      where: whereClause
    });

    // Get dudi with pagination and include magang count
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
      },
      skip,
      take: limit
    });

    // Transform data to match frontend interface
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
      jumlahSiswaMagang: dudi._count.magang
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
    console.error('Error fetching dudi:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dudi' 
      },
      { status: 500 }
    );
  }
}

// POST create new dudi
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      namaPerusahaan, 
      alamat, 
      telepon, 
      email, 
      penanggungJawab,
      bidangUsaha,
      deskripsi,
      kuotaMagang,
      status = 'pending' 
    } = body;
    
    if (!namaPerusahaan || !alamat || !telepon || !email || !penanggungJawab || !bidangUsaha || !deskripsi || kuotaMagang === undefined || kuotaMagang === null || kuotaMagang < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Semua field wajib diisi' 
        },
        { status: 400 }
      );
    }

    // Check if email already exists (case insensitive)
    const existingDudi = await prisma.dudi.findFirst({
      where: { 
        email: {
          equals: email,
          mode: 'insensitive'
        }
      }
    });

    if (existingDudi) {
      console.log('Email conflict detected:', { 
        inputEmail: email, 
        existingEmail: existingDudi.email,
        existingId: existingDudi.id 
      });
      return NextResponse.json(
        { 
          success: false, 
          error: `Email ${email} sudah terdaftar untuk perusahaan ${existingDudi.namaPerusahaan}` 
        },
        { status: 400 }
      );
    }

    // Create new dudi
    const newDudi = await prisma.dudi.create({
      data: {
        namaPerusahaan,
        alamat,
        telepon,
        email,
        penanggungJawab,
        bidangUsaha,
        deskripsi,
        kuotaMagang,
        status: status as 'aktif' | 'nonaktif' | 'pending'
      },
      include: {
        _count: {
          select: {
            magang: true
          }
        }
      }
    });

    // Transform response
    const transformedDudi = {
      id: newDudi.id,
      namaPerusahaan: newDudi.namaPerusahaan,
      alamat: newDudi.alamat,
      email: newDudi.email,
      telepon: newDudi.telepon,
      penanggungJawab: newDudi.penanggungJawab,
      bidangUsaha: newDudi.bidangUsaha,
      deskripsi: newDudi.deskripsi,
      kuotaMagang: newDudi.kuotaMagang,
      status: newDudi.status,
      jumlahSiswaMagang: newDudi._count.magang
    };

    return NextResponse.json({
      success: true,
      data: transformedDudi,
      message: 'Dudi berhasil ditambahkan'
    });

  } catch (error) {
    console.error('Error creating dudi:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal menambahkan dudi' 
      },
      { status: 500 }
    );
  }
}
