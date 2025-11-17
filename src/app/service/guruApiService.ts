// app/service/guruApiService.ts

export interface GuruData {
  id: number;
  nama: string;
  nip: string;
  alamat: string;
  telepon: string;
  userId: number;
}

export interface GuruResponse {
  success: boolean;
  data: GuruData;
  error?: string;
}

export interface DashboardStats {
  totalSiswa: number;
  totalDudi: number;
  magangAktif: number;
  logbookPending: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
  error?: string;
}

export interface MagangTerbaru {
  id: number;
  studentName: string;
  companyName: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'diterima' | 'ditolak' | 'berlangsung' | 'selesai' | 'dibatalkan';
}

export interface MagangTerbaruResponse {
  success: boolean;
  data: MagangTerbaru[];
  error?: string;
}

export interface DudiAktif {
  id: number;
  companyName: string;
  address: string;
  phone: string;
  studentCount: number;
}

export interface DudiAktifResponse {
  success: boolean;
  data: DudiAktif[];
  error?: string;
}

export interface LogbookTerbaru {
  id: number;
  name: string;
  date: string;
  issue: string;
  status: 'pending' | 'disetujui' | 'ditolak';
}

export interface LogbookTerbaruResponse {
  success: boolean;
  data: LogbookTerbaru[];
  error?: string;
}

class GuruService {
  private baseUrl = '/api/guru';

  // Get guru yang sedang login
  async getCurrentGuru(): Promise<GuruResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/me`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch current guru');
      }

      return data;
    } catch (error) {
      console.error('Error fetching current guru:', error);
      return {
        success: false,
        data: {} as GuruData,
        error: error instanceof Error ? error.message : 'Failed to fetch current guru'
      };
    }
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/stats`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard stats');
      }

      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        data: {} as DashboardStats,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
      };
    }
  }

  // Get magang terbaru
  async getMagangTerbaru(): Promise<MagangTerbaruResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/magang-terbaru`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch magang terbaru');
      }

      return data;
    } catch (error) {
      console.error('Error fetching magang terbaru:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch magang terbaru'
      };
    }
  }

  // Get dudi aktif
  async getDudiAktif(): Promise<DudiAktifResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/dudi-aktif`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dudi aktif');
      }

      return data;
    } catch (error) {
      console.error('Error fetching dudi aktif:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch dudi aktif'
      };
    }
  }

  // Get logbook terbaru
  async getLogbookTerbaru(): Promise<LogbookTerbaruResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/logbook-terbaru`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch logbook terbaru');
      }

      return data;
    } catch (error) {
      console.error('Error fetching logbook terbaru:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch logbook terbaru'
      };
    }
  }
}

export const guruService = new GuruService();