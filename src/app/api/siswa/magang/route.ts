// app/api/siswa/magang/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { getSession } from '@/app/lib/auth/middleware';

// POST - Siswa mendaftar magang ke DUDI tertentu dengan memilih guru pembimbing
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'siswa') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { dudiId, guruId } = body as { dudiId?: number; guruId?: number };

    if (!dudiId) {
      return NextResponse.json(
        { success: false, error: 'dudiId wajib diisi' },
        { status: 400 }
      );
    }

    // Ambil siswaId dari session
    const siswa = await prisma.siswa.findUnique({
      where: { userId: session.userId }
    });

    if (!siswa) {
      return NextResponse.json(
        { success: false, error: 'Data siswa tidak ditemukan' },
        { status: 404 }
      );
    }

    // Ambil data DUDI untuk mendapatkan guru penanggung jawab
    const dudi = await prisma.dudi.findUnique({
      where: { id: dudiId },
      select: { 
        guruPenanggungJawabId: true,
        namaPerusahaan: true
      }
    });

    if (!dudi) {
      return NextResponse.json(
        { success: false, error: 'DUDI tidak ditemukan' },
        { status: 404 }
      );
    }

    // Tentukan guruId: gunakan guru penanggung jawab DUDI jika ada, atau guruId dari request
    let finalGuruId = guruId;
    
    if (dudi.guruPenanggungJawabId) {
      // Auto-assign ke guru penanggung jawab DUDI
      finalGuruId = dudi.guruPenanggungJawabId;
    } else if (!guruId) {
      // Jika tidak ada guru penanggung jawab dan tidak ada guruId dari request
      return NextResponse.json(
        { success: false, error: 'DUDI ini belum memiliki guru penanggung jawab. Silakan pilih guru pembimbing.' },
        { status: 400 }
      );
    }

    // Cegah multiple magang aktif/pending
    const existingMagang = await prisma.magang.findFirst({
      where: {
        siswaId: siswa.id,
        status: { in: ['pending', 'berlangsung'] }
      }
    });

    if (existingMagang) {
      return NextResponse.json(
        { success: false, error: 'Anda sudah memiliki pengajuan/aktif magang' },
        { status: 400 }
      );
    }

    // Default periode (misal 3 bulan mulai hari ini) — bisa diedit guru nanti
    const today = new Date();
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    const created = await prisma.magang.create({
      data: {
        siswaId: siswa.id,
        dudiId: Number(dudiId),
        guruId: Number(finalGuruId),
        status: 'pending',
        tanggalMulai: today,
        tanggalSelesai: threeMonthsLater,
      },
      include: {
        siswa: { select: { nama: true, nis: true, kelas: true, jurusan: true } },
        dudi: { select: { namaPerusahaan: true, alamat: true } },
        guru: { select: { nama: true, nip: true } }
      }
    });

    // Tentukan message berdasarkan apakah guru di-assign otomatis atau manual
    const message = dudi.guruPenanggungJawabId 
      ? `Pengajuan magang dibuat. Anda otomatis ter-assign ke guru penanggung jawab ${dudi.namaPerusahaan}.`
      : 'Pengajuan magang dibuat';

    return NextResponse.json({
      success: true,
      message,
      data: created
    }, { status: 201 });
  } catch (error) {
    console.error('Error siswa daftar magang:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal membuat pengajuan magang' },
      { status: 500 }
    );
  }
}