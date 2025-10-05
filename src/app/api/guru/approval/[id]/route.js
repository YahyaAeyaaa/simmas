import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";

// PATCH: Update status magang (approve/reject)
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { status } = await request.json();

    // Validasi status yang dikirim
    if (!["diterima", "ditolak"].includes(status)) {
      return NextResponse.json(
        { message: "Status tidak valid" },
        { status: 400 }
      );
    }

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

    // Cari magang yang akan diupdate
    const magang = await prisma.magang.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!magang) {
      return NextResponse.json(
        { message: "Data magang tidak ditemukan" },
        { status: 404 }
      );
    }

    // Pastikan guru yang mengupdate adalah guru yang ditugaskan
    if (magang.guruId !== guru.id) {
      return NextResponse.json(
        { message: "Anda tidak berwenang mengubah status magang ini" },
        { status: 403 }
      );
    }

    // Update status magang
    const updatedMagang = await prisma.magang.update({
      where: {
        id: parseInt(id),
      },
      data: {
        status: status,
      },
    });

    return NextResponse.json({
      message: `Pengajuan magang berhasil ${status === "diterima" ? "disetujui" : "ditolak"}`,
      data: updatedMagang,
    });
  } catch (error) {
    console.error("Error updating magang status:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat memperbarui status" },
      { status: 500 }
    );
  }
}