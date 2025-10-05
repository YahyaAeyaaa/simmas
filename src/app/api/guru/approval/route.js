import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

// GET: Mengambil semua pengajuan magang yang menunggu approval dari guru tertentu
export async function GET() {
  try {
    // Dapatkan session untuk mengetahui guru yang sedang login
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "guru") {
      return NextResponse.json(
        { message: "Unauthorized: Anda tidak memiliki akses" },
        { status: 401 }
      );
    }

    // Dapatkan ID guru dari user yang login
    const guru = await prisma.guru.findFirst({
      where: {
        userId: session.user.id,
      },
    });

    if (!guru) {
      return NextResponse.json(
        { message: "Guru tidak ditemukan" },
        { status: 404 }
      );
    }

    // Ambil semua pengajuan magang yang ditujukan ke guru ini
    const pendingMagang = await prisma.magang.findMany({
      where: {
        guruId: guru.id,
        status: "pending", // Hanya yang statusnya pending
      },
      include: {
        siswa: true,
        dudi: true,
      },
      orderBy: {
        createdAt: "desc", // Urutkan dari yang terbaru
      },
    });

    return NextResponse.json(pendingMagang);
  } catch (error) {
    console.error("Error fetching pending magang:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memuat data" },
      { status: 500 }
    );
  }
}