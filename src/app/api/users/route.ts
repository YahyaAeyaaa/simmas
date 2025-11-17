// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/prisma";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const search = (url.searchParams.get("search") || "").trim();
    const role = (url.searchParams.get("role") || "").trim();
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: { siswa: true, guru: true, dudi: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    // Map to frontend shape (match fields your frontend expects)
    const data = items.map(u => {
      const role = u.role;
      const isDudi = !!u.dudi;
      const displayName = isDudi ? u.dudi!.namaPerusahaan : u.name;
      return {
        id: u.id,
        id_user: u.id,
        namaPerusahaan: displayName,
        email: u.email,
        status: role,
        verifed_at: u.emailVerifiedAt ? "verified" : "unverified",
        Terdaftar_pada: u.createdAt.toISOString(),
        jurusan: u.siswa?.jurusan ?? null,
        kelas: u.siswa?.kelas ?? null,
        // keep full nested objects in case needed
        _raw: { user: u }
      };
    });

    
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      }
    });
  } catch (err) {
    console.error("GET users error", err);
    return NextResponse.json({ success: false, error: "Gagal memuat users" }, { status: 500 });
  }
}
