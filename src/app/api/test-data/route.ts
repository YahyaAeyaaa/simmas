import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

// GET /api/test-data - Create test data for development
export async function GET(request: NextRequest) {
  try {
    // Check if we already have test data
    const existingMagang = await prisma.magang.findFirst({
      where: { status: 'berlangsung' }
    });

    if (existingMagang) {
      return NextResponse.json({
        success: true,
        message: 'Test data already exists',
        data: { magangCount: await prisma.magang.count() }
      });
    }

    // Create test user (siswa)
    const testUser = await prisma.user.upsert({
      where: { email: 'siswa@test.com' },
      update: {},
      create: {
        name: 'Siswa Test',
        email: 'siswa@test.com',
        password: '$2b$10$example', // Hashed password
        role: 'siswa'
      }
    });

    // Create test siswa
    const testSiswa = await prisma.siswa.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        nama: 'Siswa Test',
        nis: '12345',
        kelas: 'XII',
        jurusan: 'RPL',
        userId: testUser.id
      }
    });

    // Create test guru
    const testGuruUser = await prisma.user.upsert({
      where: { email: 'guru@test.com' },
      update: {},
      create: {
        name: 'Guru Test',
        email: 'guru@test.com',
        password: '$2b$10$example',
        role: 'guru'
      }
    });

    const testGuru = await prisma.guru.upsert({
      where: { userId: testGuruUser.id },
      update: {},
      create: {
        nama: 'Guru Test',
        nip: 'G001',
        userId: testGuruUser.id
      }
    });

    // Create test DUDI
    const testDudi = await prisma.dudi.upsert({
      where: { namaPerusahaan: 'PT Test Company' },
      update: {},
      create: {
        namaPerusahaan: 'PT Test Company',
        alamat: 'Jl. Test No. 1',
        telepon: '08123456789',
        email: 'test@company.com',
        penanggungJawab: 'Test PIC',
        bidangUsaha: 'Technology',
        deskripsi: 'Test company',
        kuotaMagang: 10,
        status: 'aktif',
        guruPenanggungJawabId: testGuru.id
      }
    });

    // Create test magang
    const testMagang = await prisma.magang.create({
      data: {
        siswaId: testSiswa.id,
        dudiId: testDudi.id,
        guruId: testGuru.id,
        status: 'berlangsung',
        tanggalMulai: new Date(),
        tanggalSelesai: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Test data created successfully',
      data: {
        user: testUser,
        siswa: testSiswa,
        guru: testGuru,
        dudi: testDudi,
        magang: testMagang
      }
    });

  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create test data' },
      { status: 500 }
    );
  }
}
