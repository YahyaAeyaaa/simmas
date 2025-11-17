// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db/prisma";
import { hashPassword } from "@/app/lib/auth/hash";
import { z } from "zod";

/** Auth guard - check if user is admin */
async function ensureAdmin(req: NextRequest) {
  // Untuk sementara, bypass auth check agar admin bisa mengedit data
  // TODO: Implementasikan auth check yang lebih baik menggunakan session
  return null;
}

const updateSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  role: z.enum(["admin", "guru", "siswa"]).optional(),
  emailVerification: z.enum(["verified", "unverified"]).optional(),
  jurusan: z.string().optional().nullable(),
  kelas: z.enum(["XI","XII"]).optional().nullable(),
  nis: z.string().optional().nullable(),
  nip: z.string().optional().nullable(),
  password: z.string().min(6).optional()
});

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    const u = await prisma.user.findUnique({
      where: { id },
      include: { siswa: true, guru: true, dudi: true }
    });
    if (!u) return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });

    const payload = {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      emailVerifiedAt: u.emailVerifiedAt,
      siswa: u.siswa,
      guru: u.guru,
      dudi: u.dudi
    };
    return NextResponse.json({ success: true, data: payload });
  } catch (err) {
    console.error("GET user error", err);
    return NextResponse.json({ success: false, error: "Gagal memuat user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // auth guard (dev)
    const forbidden = await ensureAdmin(request);
    if (forbidden) return forbidden;

    const id = Number(params.id);
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Payload tidak valid", details: parsed.error.errors }, { status: 400 });
    }
    const data = parsed.data;

    const user = await prisma.user.findUnique({ where: { id }, include: { siswa: true, guru: true, dudi: true }});
    if (!user) return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });

    // Start transaction to sync role changes
    const updateOps: any = {
      name: data.username ?? user.name,
      email: data.email ?? user.email,
    };

    if (data.password) {
      updateOps.password = await hashPassword(data.password);
    }

    if (data.emailVerification) {
      updateOps.emailVerifiedAt = data.emailVerification === "verified" ? new Date() : null;
    }

    // handle role change or profile updates
    await prisma.$transaction(async (tx) => {
      // If role stays same:
      if (data.role && data.role !== user.role) {
        // If switching away from siswa/guru/dudi -> remove old profile (if exist)
        if (user.siswa) await tx.siswa.delete({ where: { id: user.siswa.id }});
        if (user.guru) await tx.guru.delete({ where: { id: user.guru.id }});
        if (user.dudi) await tx.dudi.delete({ where: { id: user.dudi!.id }}).catch(()=>{});
        // then create new profile if new role is siswa/guru
        if (data.role === "siswa") {
          updateOps.role = "siswa";
          await tx.user.update({
            where: { id },
            data: {
              ...updateOps,
              siswa: {
                create: {
                  nama: data.username ?? user.name,
                  nis: data.jurusan ? `NIS-${Date.now()}` : `NIS-${Date.now()}`,
                  kelas: data.kelas ?? "XI",
                  jurusan: data.jurusan ?? "Umum",
                  alamat: "-",
                  telepon: "-"
                }
              }
            }
          });
          return;
        } else if (data.role === "guru") {
          updateOps.role = "guru";
          await tx.user.update({
            where: { id },
            data: {
              ...updateOps,
              guru: {
                create: {
                  nama: data.username ?? user.name,
                  nip: `NIP-${Date.now()}`,
                  alamat: "-",
                  telepon: "-"
                }
              }
            }
          });
          return;
        } else {
          // admin
          updateOps.role = "admin";
          await tx.user.update({ where: { id }, data: updateOps });
          return;
        }
      } else {
        // same role -> update user and profile if provided
        await tx.user.update({ where: { id }, data: updateOps });

        if (user.siswa && (data.jurusan || data.kelas || data.username)) {
          await tx.siswa.update({
            where: { id: user.siswa.id },
            data: {
              jurusan: data.jurusan ?? user.siswa.jurusan,
              kelas: data.kelas ?? user.siswa.kelas,
              nama: data.username ?? user.siswa.nama
            }
          });
        }

        if (user.guru && (data.username || data.nip)) {
          await tx.guru.update({
            where: { id: user.guru.id },
            data: {
              nama: data.username ?? user.guru.nama,
              nip: data.nip ?? user.guru.nip
            }
          });
        }
      }
    });

    return NextResponse.json({ success: true, message: "User berhasil diperbarui" });
  } catch (err) {
    console.error("PUT user error", err);
    return NextResponse.json({ success: false, error: "Gagal memperbarui user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // auth guard (dev)
    const forbidden = await ensureAdmin(request);
    if (forbidden) return forbidden;

    const id = Number(params.id);
    const user = await prisma.user.findUnique({ where: { id }, include: { siswa: true, guru: true, dudi: true }});
    if (!user) return NextResponse.json({ success: false, error: "User tidak ditemukan" }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      if (user.siswa) await tx.siswa.delete({ where: { id: user.siswa.id }});
      if (user.guru) await tx.guru.delete({ where: { id: user.guru.id }});
      if (user.dudi) await tx.dudi.delete({ where: { id: user.dudi!.id } }).catch(()=>{});
      await tx.user.delete({ where: { id }});
    });

    return NextResponse.json({ success: true, message: "User dihapus" });
  } catch (err) {
    console.error("DELETE user error", err);
    return NextResponse.json({ success: false, error: "Gagal menghapus user" }, { status: 500 });
  }
}
