// app/api/magang/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';
import { isQuotaAvailable } from '@/app/lib/utils/quotaCalculator';

// GET - Get all magang with filters
export async function GET(request: NextRequest) {
  try {
    // Get session untuk validasi dan filter berdasarkan role
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build where clause
    const whereClause: any = {};

    // Filter berdasarkan role:
    // - Admin: lihat semua magang
    // - Guru: hanya lihat magang yang dipilih sebagai guru pembimbing
    // - Siswa: hanya lihat magang milik siswa tersebut
    if (session.role === 'guru') {
      // Ambil guruId dari session
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
      
      whereClause.guruId = guru.id;
    } else if (session.role === 'siswa') {
      // Ambil siswaId dari session
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
      
      whereClause.siswaId = siswa.id;
    }
    // Admin tidak perlu filter tambahan, lihat semua

    // Search by siswa name, NIS, or DUDI name
    if (search) {
      whereClause.OR = [
        { siswa: { nama: { contains: search, mode: 'insensitive' } } },
        { siswa: { nis: { contains: search, mode: 'insensitive' } } },
        { dudi: { namaPerusahaan: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Filter by status
    if (status && ['pending', 'diterima', 'ditolak', 'berlangsung', 'selesai', 'dibatalkan'].includes(status)) {
      whereClause.status = status;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalCount = await prisma.magang.count({
      where: whereClause
    });

    const magangList = await prisma.magang.findMany({
      where: whereClause,
      include: {
        siswa: {
          select: {
            nama: true,
            nis: true,
            kelas: true,
            jurusan: true
          }
        },
        guru: {
          select: {
            nama: true,
            nip: true
          }
        },
        dudi: {
          select: {
            namaPerusahaan: true,
            alamat: true,
            penanggungJawab: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: magangList,
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
    console.error('Error fetching magang list:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch magang list' 
      },
      { status: 500 }
    );
  }
}

// POST - Create new magang
export async function POST(request: NextRequest) {
  try {
    // Get session untuk validasi
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { siswaId, dudiId, guruId, tanggalMulai, tanggalSelesai, status } = body;

    // Validasi required fields
    if (!siswaId || !dudiId || !guruId || !tanggalMulai || !tanggalSelesai || !status) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: siswaId, dudiId, guruId, tanggalMulai, tanggalSelesai, status' 
        },
        { status: 400 }
      );
    }

    // Validasi tanggal
    const startDate = new Date(tanggalMulai);
    const endDate = new Date(tanggalSelesai);

    if (startDate >= endDate) {
      return NextResponse.json(
        { success: false, error: 'Tanggal selesai harus setelah tanggal mulai' },
        { status: 400 }
      );
    }

    // Validasi status enum
    const validStatuses = ['pending', 'diterima', 'ditolak', 'berlangsung', 'selesai', 'dibatalkan'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Status must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Cek apakah siswa sudah memiliki magang aktif
    const existingMagang = await prisma.magang.findFirst({
      where: {
        siswaId: parseInt(siswaId),
        status: {
          in: ['pending', 'diterima', 'berlangsung']
        }
      }
    });

    if (existingMagang) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Siswa sudah memiliki magang aktif atau pending' 
        },
        { status: 400 }
      );
    }

    // Validasi kuota DUDI jika status aktif
    if (status === 'berlangsung' || status === 'pending' || status === 'diterima') {
      const quotaAvailable = await isQuotaAvailable(parseInt(dudiId));
      if (!quotaAvailable) {
        return NextResponse.json(
          { success: false, error: 'Kuota magang untuk DUDI ini sudah penuh' },
          { status: 400 }
        );
      }
    }

    // Create magang
    const newMagang = await prisma.magang.create({
      data: {
        siswaId: parseInt(siswaId),
        dudiId: parseInt(dudiId),
        guruId: parseInt(guruId),
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        status: status as 'pending' | 'diterima' | 'ditolak' | 'berlangsung' | 'selesai' | 'dibatalkan',
        nilaiAkhir: null
      },
      include: {
        siswa: {
          select: {
            nama: true,
            nis: true,
            kelas: true,
            jurusan: true
          }
        },
        dudi: {
          select: {
            namaPerusahaan: true,
            alamat: true
          }
        },
        guru: {
          select: {
            nama: true,
            nip: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Data magang berhasil ditambahkan',
      data: newMagang
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating magang:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create magang' 
      },
      { status: 500 }
    );
  }
}