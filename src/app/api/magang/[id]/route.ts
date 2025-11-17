// app/api/magang/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';
import { isQuotaAvailableForUpdate } from '@/app/lib/utils/quotaCalculator';

// PUT - Update magang by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session untuk validasi
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const magangId = parseInt(params.id);
    
    if (isNaN(magangId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid magang ID' },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { tanggalMulai, tanggalSelesai, status, nilaiAkhir } = body;

    // Validasi required fields
    if (!tanggalMulai || !tanggalSelesai || !status) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: tanggalMulai, tanggalSelesai, status' 
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

    // Validasi status enum (tambahkan 'ditolak')
    const validStatuses = ['pending', 'berlangsung', 'selesai', 'ditolak'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Status must be one of: ${validStatuses.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Cek apakah magang exists
    const existingMagang = await prisma.magang.findUnique({
      where: { id: magangId }
    });

    if (!existingMagang) {
      return NextResponse.json(
        { success: false, error: 'Magang tidak ditemukan' },
        { status: 404 }
      );
    }

    // Validasi kuota jika status berubah menjadi aktif
    if (status === 'berlangsung' || status === 'pending') {
      const quotaAvailable = await isQuotaAvailableForUpdate(existingMagang.dudiId, magangId);
      if (!quotaAvailable) {
        return NextResponse.json(
          { success: false, error: 'Kuota magang untuk DUDI ini sudah penuh' },
          { status: 400 }
        );
      }
    }

    // Validasi nilai jika status selesai
    if (status === 'selesai' && nilaiAkhir !== null && nilaiAkhir !== undefined) {
      const nilai = parseFloat(nilaiAkhir);
      if (isNaN(nilai) || nilai < 0 || nilai > 100) {
        return NextResponse.json(
          { success: false, error: 'Nilai harus antara 0-100' },
          { status: 400 }
        );
      }
    }

    // Update magang
    const updatedMagang = await prisma.magang.update({
      where: { id: magangId },
      data: {
        tanggalMulai: new Date(tanggalMulai),
        tanggalSelesai: new Date(tanggalSelesai),
        status: status as 'pending' | 'berlangsung' | 'selesai' | 'ditolak',
        nilaiAkhir: status === 'selesai' && nilaiAkhir !== null && nilaiAkhir !== undefined 
          ? parseFloat(nilaiAkhir) 
          : null
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
            alamat: true,
            penanggungJawab: true
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
      message: 'Data magang berhasil diperbarui',
      data: updatedMagang
    });

  } catch (error) {
    console.error('Error updating magang:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update magang' 
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete magang by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session untuk validasi
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const magangId = parseInt(params.id);
    
    if (isNaN(magangId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid magang ID' },
        { status: 400 }
      );
    }

    // Cek apakah magang exists
    const existingMagang = await prisma.magang.findUnique({
      where: { id: magangId },
      include: {
        logbooks: true
      }
    });

    if (!existingMagang) {
      return NextResponse.json(
        { success: false, error: 'Magang tidak ditemukan' },
        { status: 404 }
      );
    }

    // Cek apakah ada logbook yang terkait
    if (existingMagang.logbooks.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Tidak dapat menghapus magang yang memiliki logbook. Hapus logbook terlebih dahulu.' 
        },
        { status: 400 }
      );
    }

    // Delete magang
    await prisma.magang.delete({
      where: { id: magangId }
    });

    return NextResponse.json({
      success: true,
      message: 'Data magang berhasil dihapus'
    });

  } catch (error) {
    console.error('Error deleting magang:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete magang' 
      },
      { status: 500 }
    );
  }
}
