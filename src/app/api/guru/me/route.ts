// app/api/guru/me/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/auth/middleware';
import { prisma } from '@/app/lib/db/prisma';

export async function GET() {
  try {
    // Get session dari cookie
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
      select: {
        id: true,
        nama: true,
        nip: true,
        alamat: true,
        telepon: true,
        userId: true
      }
    });

    if (!guru) {
      return NextResponse.json(
        { success: false, error: 'Guru data not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: guru
    });

  } catch (error) {
    console.error('Error fetching current guru:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch guru data' 
      },
      { status: 500 }
    );
  }
}