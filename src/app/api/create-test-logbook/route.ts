import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

export async function POST(request: NextRequest) {
  try {
    // Find a student with active magang
    const magang = await prisma.magang.findFirst({
      where: {
        status: 'berlangsung'
      },
      include: {
        siswa: true,
        guru: true,
        dudi: true
      }
    });

    if (!magang) {
      return NextResponse.json(
        { success: false, error: 'No active magang found' },
        { status: 404 }
      );
    }

    // Create test logbook entries with pending status
    const logbook1 = await prisma.logbook.create({
      data: {
        magangId: magang.id,
        tanggal: new Date(),
        kegiatan: 'Membuat desain UI aplikasi kasir menggunakan Figma. Melakukan analisis user experience dan wireframing untuk meningkatkan user experience aplikasi.',
        kendala: 'Kesulitan menentukan skema warna yang tepat dan konsisten untuk seluruh aplikasi',
        file: '',
        statusVerifikasi: 'pending'
      }
    });

    const logbook2 = await prisma.logbook.create({
      data: {
        magangId: magang.id,
        tanggal: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        kegiatan: 'Belajar backend Laravel untuk membangun REST API sistem kasir. Mempelajari konsep MVC dan routing.',
        kendala: 'Error saat mengirimkan migration database dan kesulitan memahami relationship antar tabel',
        file: '',
        statusVerifikasi: 'pending'
      }
    });

    const logbook3 = await prisma.logbook.create({
      data: {
        magangId: magang.id,
        tanggal: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        kegiatan: 'Setup server Linux Ubuntu untuk deployment aplikasi web. Konfigurasi Apache dan MySQL.',
        kendala: 'Belum familiar dengan command line interface dan permission system di linux',
        file: '',
        statusVerifikasi: 'pending'
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test logbook entries created successfully with pending status',
      data: {
        logbookCount: 3,
        magang: {
          id: magang.id,
          siswa: magang.siswa.nama,
          guru: magang.guru.nama,
          dudi: magang.dudi.namaPerusahaan
        }
      }
    });

  } catch (error) {
    console.error('Error creating test logbook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create test logbook' },
      { status: 500 }
    );
  }
}
