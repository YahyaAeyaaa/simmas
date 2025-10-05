import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';

// GET school settings
export async function GET(request: NextRequest) {
  try {
    // Get the first (and should be only) school settings record
    const schoolSettings = await prisma.schoolSettings.findFirst();

    if (!schoolSettings) {
      // Return default values if no settings exist
      return NextResponse.json({
        success: true,
        data: {
          id: null,
          logoUrl: null,
          namaSekolah: "SMK Negeri 1 Surabaya",
          alamat: "Jl. SMEA No.4, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur 60252",
          telepon: "031-5678910",
          email: "info@smkn1surabaya.sch.id",
          website: "www.smkn1surabaya.sch.id",
          kepalaSekolah: "Drs. H. Sutriono, M.Pd.",
          npsn: "20567890",
          createdAt: null,
          updatedAt: null
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: schoolSettings
    });

  } catch (error) {
    console.error('Error fetching school settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch school settings' 
      },
      { status: 500 }
    );
  }
}

// PUT update school settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      logoUrl,
      namaSekolah, 
      alamat, 
      telepon, 
      email, 
      website,
      kepalaSekolah,
      npsn
    } = body;

    // Validate required fields
    if (!namaSekolah || !alamat || !telepon || !email || !kepalaSekolah || !npsn) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Semua field wajib diisi' 
        },
        { status: 400 }
      );
    }

    // Check if school settings already exist
    const existingSettings = await prisma.schoolSettings.findFirst();

    let updatedSettings;

    if (existingSettings) {
      // Update existing settings
      updatedSettings = await prisma.schoolSettings.update({
        where: { id: existingSettings.id },
        data: {
          logoUrl,
          namaSekolah,
          alamat,
          telepon,
          email,
          website,
          kepalaSekolah,
          npsn
        }
      });
    } else {
      // Create new settings
      updatedSettings = await prisma.schoolSettings.create({
        data: {
          logoUrl,
          namaSekolah,
          alamat,
          telepon,
          email,
          website,
          kepalaSekolah,
          npsn
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: 'Pengaturan sekolah berhasil diperbarui'
    });

  } catch (error) {
    console.error('Error updating school settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gagal memperbarui pengaturan sekolah' 
      },
      { status: 500 }
    );
  }
}
