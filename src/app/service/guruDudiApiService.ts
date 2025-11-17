// app/service/guruDudiApiService.ts

export interface GuruDudiData {
  id: number;
  namaPerusahaan: string;
  alamat: string;
  email: string;
  telepon: string;
  penanggungJawab: string;
  bidangUsaha: string;
  deskripsi: string;
  kuotaMagang: number;
  status: 'aktif' | 'nonaktif' | 'pending';
  jumlahSiswaMagang: number;
  siswaBimbingan: Array<{
    id: number;
    nama: string;
    nis: string;
    kelas: string;
    jurusan: string;
    status: 'pending' | 'berlangsung' | 'selesai';
    tanggalMulai: string;
    tanggalSelesai: string;
  }>;
}

export interface GuruDudiStats {
  totalDudiMitra: number;
  totalSiswaMagang: number;
  rataRataSiswaPerusahaan: number;
  statusStats: {
    pending: number;
    berlangsung: number;
    selesai: number;
  };
}

export interface GuruDudiResponse {
  success: boolean;
  data: GuruDudiData[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
}

export interface GuruDudiStatsResponse {
  success: boolean;
  data: GuruDudiStats;
  error?: string;
}

class GuruDudiService {
  private baseUrl = '/api/guru/dudi';

  // Get DUDI berdasarkan siswa bimbingan guru
  async getGuruDudiList(
    search: string = '', 
    page: number = 1, 
    limit: number = 10
  ): Promise<GuruDudiResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch guru dudi list');
      }

      return data;
    } catch (error) {
      console.error('Error fetching guru dudi list:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch guru dudi list'
      };
    }
  }

  // Get statistik DUDI guru
  async getGuruDudiStats(): Promise<GuruDudiStatsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch guru dudi stats');
      }

      return data;
    } catch (error) {
      console.error('Error fetching guru dudi stats:', error);
      return {
        success: false,
        data: {
          totalDudiMitra: 0,
          totalSiswaMagang: 0,
          rataRataSiswaPerusahaan: 0,
          statusStats: {
            pending: 0,
            berlangsung: 0,
            selesai: 0
          }
        },
        error: error instanceof Error ? error.message : 'Failed to fetch guru dudi stats'
      };
    }
  }
}

export const guruDudiService = new GuruDudiService();
