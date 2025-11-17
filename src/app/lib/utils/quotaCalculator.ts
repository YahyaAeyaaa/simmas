// app/lib/utils/quotaCalculator.ts
import { prisma } from '@/app/lib/db/prisma';

export interface QuotaInfo {
  totalQuota: number;
  usedQuota: number; // magang yang sedang aktif (pending + berlangsung)
  availableQuota: number;
  completedQuota: number; // magang yang sudah selesai
}

/**
 * Menghitung informasi kuota magang untuk DUDI tertentu
 * @param dudiId ID DUDI
 * @returns Informasi kuota magang
 */
export async function calculateDudiQuota(dudiId: number): Promise<QuotaInfo> {
  const dudi = await prisma.dudi.findUnique({
    where: { id: dudiId },
    select: { kuotaMagang: true }
  });

  if (!dudi) {
    throw new Error('DUDI tidak ditemukan');
  }

  const totalQuota = dudi.kuotaMagang || 0;

  // Hitung magang yang sedang aktif (pending + diterima + berlangsung)
  const activeMagangCount = await prisma.magang.count({
    where: {
      dudiId: dudiId,
      status: {
        in: ['pending', 'diterima', 'berlangsung']
      }
    }
  });

  // Hitung magang yang sudah selesai
  const completedMagangCount = await prisma.magang.count({
    where: {
      dudiId: dudiId,
      status: 'selesai'
    }
  });

  return {
    totalQuota,
    usedQuota: activeMagangCount,
    availableQuota: Math.max(0, totalQuota - activeMagangCount),
    completedQuota: completedMagangCount
  };
}

/**
 * Memvalidasi apakah DUDI masih memiliki kuota tersedia
 * @param dudiId ID DUDI
 * @returns true jika masih ada kuota tersedia
 */
export async function isQuotaAvailable(dudiId: number): Promise<boolean> {
  const quotaInfo = await calculateDudiQuota(dudiId);
  return quotaInfo.availableQuota > 0;
}

/**
 * Memvalidasi apakah DUDI masih memiliki kuota tersedia untuk siswa tertentu
 * (mengecualikan magang siswa yang sama jika sedang update)
 * @param dudiId ID DUDI
 * @param excludeMagangId ID magang yang akan dikecualikan dari perhitungan (untuk update)
 * @returns true jika masih ada kuota tersedia
 */
export async function isQuotaAvailableForUpdate(dudiId: number, excludeMagangId?: number): Promise<boolean> {
  const dudi = await prisma.dudi.findUnique({
    where: { id: dudiId },
    select: { kuotaMagang: true }
  });

  if (!dudi) {
    throw new Error('DUDI tidak ditemukan');
  }

  const totalQuota = dudi.kuotaMagang || 0;

  // Hitung magang yang sedang aktif, kecuali yang sedang diupdate
  const whereClause: any = {
    dudiId: dudiId,
    status: {
      in: ['pending', 'diterima', 'berlangsung']
    }
  };

  if (excludeMagangId) {
    whereClause.id = {
      not: excludeMagangId
    };
  }

  const activeMagangCount = await prisma.magang.count({
    where: whereClause
  });

  return activeMagangCount < totalQuota;
}