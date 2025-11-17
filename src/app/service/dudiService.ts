import { DudiData } from '@/helper/status';

export interface DudiStats {
  totalDudi: number;
  aktifDudi: number;
  nonaktifDudi: number;
  pendingDudi: number;
  totalSiswaMagang: number;
}

export interface DudiResponse {
  success: boolean;
  data: DudiData[];
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

export interface DudiStatsResponse {
  success: boolean;
  data: DudiStats;
  error?: string;
}

export interface SingleDudiResponse {
  success: boolean;
  data: DudiData;
  error?: string;
}

export interface CreateDudiData {
  namaPerusahaan: string;
  alamat: string;
  telepon: string;
  email: string;
  penanggungJawab: string;
  bidangUsaha: string;
  deskripsi: string;
  kuotaMagang: number;
  status?: 'aktif' | 'nonaktif' | 'pending';
  guruPenanggungJawabId?: number | null;
}

export interface UpdateDudiData extends CreateDudiData {
  id: number;
}

class DudiService {
  private baseUrl = '/api/dudi';

  // Get all dudi with optional search and pagination
  async getDudiList(search = '', page = 1, limit = 10): Promise<DudiResponse> {
    try {
      const params = new URLSearchParams({
        search,
        page: page.toString(),
        limit: limit.toString()
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dudi list');
      }

      return data;
    } catch (error) {
      console.error('Error fetching dudi list:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch dudi list'
      };
    }
  }

  // Get single dudi by ID
  async getDudiById(id: number): Promise<SingleDudiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dudi');
      }

      return data;
    } catch (error) {
      console.error('Error fetching dudi:', error);
      return {
        success: false,
        data: {} as DudiData,
        error: error instanceof Error ? error.message : 'Failed to fetch dudi'
      };
    }
  }

  // Create new dudi
  async createDudi(dudiData: CreateDudiData): Promise<SingleDudiResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dudiData),
      });

      const data = await response.json();
      console.log('API Response:', { status: response.status, data });

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error || 'Failed to create dudi');
      }

      return data;
    } catch (error) {
      console.error('Error creating dudi:', error);
      return {
        success: false,
        data: {} as DudiData,
        error: error instanceof Error ? error.message : 'Failed to create dudi'
      };
    }
  }

  // Update dudi
  async updateDudi(dudiData: UpdateDudiData): Promise<SingleDudiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${dudiData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dudiData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update dudi');
      }

      return data;
    } catch (error) {
      console.error('Error updating dudi:', error);
      return {
        success: false,
        data: {} as DudiData,
        error: error instanceof Error ? error.message : 'Failed to update dudi'
      };
    }
  }

  // Delete dudi
  async deleteDudi(id: number): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete dudi');
      }

      return data;
    } catch (error) {
      console.error('Error deleting dudi:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete dudi'
      };
    }
  }

  // Get dudi statistics
  async getDudiStats(): Promise<DudiStatsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dudi statistics');
      }

      return data;
    } catch (error) {
      console.error('Error fetching dudi statistics:', error);
      return {
        success: false,
        data: {
          totalDudi: 0,
          aktifDudi: 0,
          nonaktifDudi: 0,
          pendingDudi: 0,
          totalSiswaMagang: 0
        },
        error: error instanceof Error ? error.message : 'Failed to fetch dudi statistics'
      };
    }
  }
}

export const dudiService = new DudiService();
