// app/service/magangApiService.ts

export interface CreateMagangData {
  siswaId: number;
  dudiId: number;
  guruId: number;
  tanggalMulai: string; // format: YYYY-MM-DD
  tanggalSelesai: string; // format: YYYY-MM-DD
  status: 'pending' | 'berlangsung' | 'selesai';
}

export interface MagangData {
  id: number;
  siswaId: number;
  dudiId: number;
  guruId: number;
  status: string;
  nilaiAkhir: number | null;
  tanggalMulai: string;
  tanggalSelesai: string;
  createdAt: string;
  updatedAt: string;
  siswa: {
    nama: string;
    nis: string;
    kelas: string;
    jurusan: string;
  };
  dudi: {
    namaPerusahaan: string;
    alamat: string;
    penanggungJawab: string;
  };
  guru: {
    nama: string;
    nip: string;
  };
}

export interface MagangListResponse {
  success: boolean;
  data: MagangData[];
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

export interface MagangResponse {
  success: boolean;
  message?: string;
  data?: MagangData;
  error?: string;
}

export interface UpdateMagangData {
  tanggalMulai: string; // format: YYYY-MM-DD
  tanggalSelesai: string; // format: YYYY-MM-DD
  status: 'pending' | 'berlangsung' | 'selesai';
  nilaiAkhir?: string | number | null;
}

class MagangService {
  private baseUrl = '/api/magang';

  // Get all magang with optional filters
  async getMagangList(search = '', status = '', page = 1, limit = 10): Promise<MagangListResponse> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch magang list');
      }

      return data;
    } catch (error) {
      console.error('Error fetching magang list:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch magang list'
      };
    }
  }

  // Create new magang
  async createMagang(magangData: CreateMagangData): Promise<MagangResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(magangData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create magang');
      }

      return data;
    } catch (error) {
      console.error('Error creating magang:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create magang'
      };
    }
  }

  // Update magang by ID
  async updateMagang(id: number, magangData: UpdateMagangData): Promise<MagangResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(magangData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update magang');
      }

      return data;
    } catch (error) {
      console.error('Error updating magang:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update magang'
      };
    }
  }

  // Delete magang by ID
  async deleteMagang(id: number): Promise<MagangResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete magang');
      }

      return data;
    } catch (error) {
      console.error('Error deleting magang:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete magang'
      };
    }
  }
}

export const magangService = new MagangService();