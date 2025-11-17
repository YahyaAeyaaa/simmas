import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

// GET all guru
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Build where clause for search
    const whereClause: {
      OR?: Array<{
        nama?: { contains: string; mode: 'insensitive' };
        nip?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};
    
    if (search) {
      whereClause.OR = [
        { nama: { contains: search, mode: 'insensitive' } },
        { nip: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get guru list
    const guruList = await prisma.guru.findMany({
      where: whereClause,
      select: {
        id: true,
        nama: true,
        nip: true,
        alamat: true,
        telepon: true
      },
      orderBy: {
        nama: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: guruList
    });

  } catch (error) {
    console.error('Error fetching guru list:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch guru list' 
      },
      { status: 500 }
    );
  }
}