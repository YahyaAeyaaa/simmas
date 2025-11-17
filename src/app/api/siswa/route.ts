// app/api/siswa/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

// GET all siswa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build where clause for search
    const whereClause: {
      OR?: Array<{
        nama?: { contains: string; mode: 'insensitive' };
        nis?: { contains: string; mode: 'insensitive' };
        kelas?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};
    
    if (search) {
      whereClause.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nis: { contains: search, mode: 'insensitive' } },
        { kelas: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get siswa list
    const siswaList = await prisma.siswa.findMany({
      where: whereClause,
      select: {
        id: true,
        nama: true,
        nis: true,
        kelas: true,
        jurusan: true,
        alamat: true,
        telepon: true
      },
      orderBy: {
        nama: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: siswaList
    });

  } catch (error) {
    console.error('Error fetching siswa list:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch siswa list' 
      },
      { status: 500 }
    );
  }
}