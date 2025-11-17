import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

// GET single dudi by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dudiId = parseInt(id);
    
    if (isNaN(dudiId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID dudi tidak valid' 
        },
        { status: 400 }
      );
    }

    const dudi = await prisma.dudi.findUnique({
      where: { id: dudiId },
      include: {
        _count: {
          select: {
            magang: true
          }
        },
        guruPenanggungJawab: {
          select: {
            id: true,
            nama: true,
            nip: true
          }
        }
      }
    });

    if (!dudi) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dudi tidak ditemukan' 
        },
        { status: 404 }
      );
    }

    // Transform data to match frontend interface
    const transformedDudi = {
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
      guruPenanggungJawabId: dudi.guruPenanggungJawabId,
      guruPenanggungJawab: dudi.guruPenanggungJawab
    };

    return NextResponse.json({
      success: true,
      data: transformedDudi
    });

  } catch (error) {
    console.error('Error fetching dudi:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal mengambil data dudi' 
      },
      { status: 500 }
    );
  }
}

// PUT update dudi by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dudiId = parseInt(id);
    
    if (isNaN(dudiId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID dudi tidak valid' 
        },
        { status: 400 }
      );
    }

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
      status,
      guruPenanggungJawabId
    } = body;

    // Validate required fields
    if (!namaPerusahaan || !alamat || !telepon || !email || !penanggungJawab || !bidangUsaha || !deskripsi || !kuotaMagang) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Semua field wajib diisi' 
        },
        { status: 400 }
      );
    }

    // Check if dudi exists
    const existingDudi = await prisma.dudi.findUnique({
      where: { id: dudiId }
    });

    if (!existingDudi) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dudi tidak ditemukan' 
        },
        { status: 404 }
      );
    }

    // Check if email already exists for other dudi
    const emailExists = await prisma.dudi.findFirst({
      where: { 
        email,
        id: { not: dudiId }
      }
    });

    if (emailExists) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email sudah terdaftar untuk dudi lain' 
        },
        { status: 400 }
      );
    }

    // Update dudi
    const updatedDudi = await prisma.dudi.update({
      where: { id: dudiId },
      data: {
        namaPerusahaan,
        alamat,
        telepon,
        email,
        penanggungJawab,
        bidangUsaha,
        deskripsi,
        kuotaMagang,
        status: status as 'aktif' | 'nonaktif' | 'pending',
        guruPenanggungJawabId: guruPenanggungJawabId || null
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
      id: updatedDudi.id,
      namaPerusahaan: updatedDudi.namaPerusahaan,
      alamat: updatedDudi.alamat,
      email: updatedDudi.email,
      telepon: updatedDudi.telepon,
      penanggungJawab: updatedDudi.penanggungJawab,
      bidangUsaha: updatedDudi.bidangUsaha,
      deskripsi: updatedDudi.deskripsi,
      kuotaMagang: updatedDudi.kuotaMagang,
      status: updatedDudi.status,
      jumlahSiswaMagang: updatedDudi._count.magang
    };

    return NextResponse.json({
      success: true,
      data: transformedDudi,
      message: 'Dudi berhasil diperbarui'
    });

  } catch (error) {
    console.error('Error updating dudi:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal memperbarui dudi' 
      },
      { status: 500 }
    );
  }
}

// DELETE dudi by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dudiId = parseInt(id);
    
    if (isNaN(dudiId)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID dudi tidak valid' 
        },
        { status: 400 }
      );
    }

    // Check if dudi exists
    const existingDudi = await prisma.dudi.findUnique({
      where: { id: dudiId },
      include: {
        _count: {
          select: {
            magang: true
          }
        }
      }
    });

    if (!existingDudi) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Dudi tidak ditemukan' 
        },
        { status: 404 }
      );
    }

    // Check if dudi has magang records
    if (existingDudi._count.magang > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tidak dapat menghapus dudi karena memiliki data magang yang terkait' 
        },
        { status: 400 }
      );
    }

    // Delete dudi
    await prisma.dudi.delete({
      where: { id: dudiId }
    });

    return NextResponse.json({
      success: true,
      message: 'Dudi berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting dudi:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal menghapus dudi' 
      },
      { status: 500 }
    );
  }
}
