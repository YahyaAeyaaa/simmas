// app/api/guru/list/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';

// GET - Get list of all gurus for dropdown
export async function GET() {
  try {
    // Get session untuk validasi
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validasi role harus admin
    if (session.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Only admin can access this endpoint' },
        { status: 403 }
      );
    }

    // Get all gurus
    const gurus = await prisma.guru.findMany({
      select: {
        id: true,
        nama: true,
        nip: true
      },
      orderBy: {
        nama: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: gurus
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
