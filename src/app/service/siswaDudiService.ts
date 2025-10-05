export interface SiswaDudiData {
  id: number;
  nama: string;
  bidang: string;
  alamat: string;
  pic: string;
  kuotaMagang: string;
  slotTerisi: number;
  slotTotal: number;
  deskripsi: string;
  sudahDaftar: boolean;
  badge: string;
  // Additional fields for modal
  telepon: string;
  email: string;
  penanggungJawab: string;
}

export interface SiswaDudiResponse {
  success: boolean;
  data: SiswaDudiData[];
  error?: string;
}

export interface SingleSiswaDudiResponse {
  success: boolean;
  data: SiswaDudiData;
  error?: string;
}

class SiswaDudiService {
  private baseUrl = '/api/siswa/dudi';

  // Get all dudi for siswa
  async getDudiList(search = ''): Promise<SiswaDudiResponse> {
    try {
      const params = new URLSearchParams({
        search
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
  async getDudiById(id: number): Promise<SingleSiswaDudiResponse> {
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
        data: {} as SiswaDudiData,
        error: error instanceof Error ? error.message : 'Failed to fetch dudi'
      };
    }
  }
}

export const siswaDudiService = new SiswaDudiService();
