import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/db/prisma';
import { requireAuth } from '@/app/lib/auth/middleware';

// GET /api/logbook/[id] - Get specific logbook
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(['siswa', 'guru', 'admin']);
    const { id } = await params;
    const logbookId = parseInt(id);

    let whereClause: any = { id: logbookId };

    // Filter by role
    if (session.role === 'siswa') {
      whereClause.magang = {
        siswa: {
          user: {
            id: session.userId
          }
        }
      };
    } else if (session.role === 'guru') {
      whereClause.magang = {
        guru: {
          user: {
            id: session.userId
          }
        }
      };
    }

    const logbook = await prisma.logbook.findFirst({
      where: whereClause,
      include: {
        magang: {
          include: {
            siswa: {
              select: {
                id: true,
                nama: true,
                nis: true
              }
            },
            dudi: {
              select: {
                id: true,
                namaPerusahaan: true
              }
            },
            guru: {
              select: {
                id: true,
                nama: true
              }
            }
          }
        }
      }
    });

    if (!logbook) {
      return NextResponse.json(
        { success: false, error: 'Logbook not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: logbook
    });

  } catch (error) {
    console.error('Error fetching logbook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch logbook' },
      { status: 500 }
    );
  }
}

// PUT /api/logbook/[id] - Update logbook (approval/rejection by guru)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(['guru', 'admin']);
    const { id } = await params;
    const logbookId = parseInt(id);

    const body = await request.json();
    const { statusVerifikasi, catatanGuru } = body;

    // Validate status
    if (!['approved', 'rejected'].includes(statusVerifikasi)) {
      return NextResponse.json(
        { success: false, error: 'Invalid status. Must be approved or rejected' },
        { status: 400 }
      );
    }

    // Check if guru has access to this logbook
    let whereClause: any = { id: logbookId };

    if (session.role === 'guru') {
      whereClause.magang = {
        guru: {
          user: {
            id: session.userId
          }
        }
      };
    }

    const existingLogbook = await prisma.logbook.findFirst({
      where: whereClause,
      include: {
        magang: {
          include: {
            guru: true
          }
        }
      }
    });

    if (!existingLogbook) {
      return NextResponse.json(
        { success: false, error: 'Logbook not found or access denied' },
        { status: 404 }
      );
    }

    // Update logbook
    const updatedLogbook = await prisma.logbook.update({
      where: { id: logbookId },
      data: {
        statusVerifikasi: statusVerifikasi as 'approved' | 'rejected',
        catatanGuru: catatanGuru || null
      },
      include: {
        magang: {
          include: {
            siswa: {
              select: {
                id: true,
                nama: true,
                nis: true
              }
            },
            dudi: {
              select: {
                id: true,
                namaPerusahaan: true
              }
            },
            guru: {
              select: {
                id: true,
                nama: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedLogbook,
      message: `Logbook ${statusVerifikasi} successfully`
    });

  } catch (error) {
    console.error('Error updating logbook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update logbook' },
      { status: 500 }
    );
  }
}

// DELETE /api/logbook/[id] - Delete logbook (only by student or admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth(['siswa', 'admin']);
    const { id } = await params;
    const logbookId = parseInt(id);

    // Check if user has access to this logbook
    let whereClause: any = { id: logbookId };

    if (session.role === 'siswa') {
      whereClause.magang = {
        siswa: {
          user: {
            id: session.userId
          }
        }
      };
    }

    const existingLogbook = await prisma.logbook.findFirst({
      where: whereClause
    });

    if (!existingLogbook) {
      return NextResponse.json(
        { success: false, error: 'Logbook not found or access denied' },
        { status: 404 }
      );
    }

    // Only allow deletion if status is pending
    if (existingLogbook.statusVerifikasi !== 'pending') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete logbook that has been reviewed' },
        { status: 400 }
      );
    }

    await prisma.logbook.delete({
      where: { id: logbookId }
    });

    return NextResponse.json({
      success: true,
      message: 'Logbook deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting logbook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete logbook' },
      { status: 500 }
    );
  }
}
