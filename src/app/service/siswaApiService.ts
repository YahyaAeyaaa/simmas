export interface SiswaData {
  id: number;
  nama: string;
  nis: string;
  kelas: string;
  jurusan: string;
  alamat: string;
  telepon: string;
}

export interface SiswaResponse {
  success: boolean;
  data: SiswaData[];
  error?: string;
}

class SiswaService {
  private baseUrl = '/api/siswa';

  // Get all siswa with optional search
  async getSiswaList(search = ''): Promise<SiswaResponse> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch siswa list');
      }

      return data;
    } catch (error) {
      console.error('Error fetching siswa list:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch siswa list'
      };
    }
  }
}

export const siswaService = new SiswaService();