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

export interface MagangRegistrationData {
  id: number;
  dudi: {
    namaPerusahaan: string;
    alamat: string;
    bidangUsaha: string;
  };
  guru: {
    nama: string;
    nip: string;
  };
  status: 'pending' | 'berlangsung' | 'selesai';
  tanggalMulai: string;
  tanggalSelesai: string;
  nilaiAkhir: number | null;
  createdAt: string;
}

export interface MagangRegistrationResponse {
  success: boolean;
  data: MagangRegistrationData[];
  error?: string;
}

export interface MagangRegistrationRequest {
  success: boolean;
  message: string;
  data: {
    id: number;
    siswa: {
      nama: string;
      nis: string;
      kelas: string;
      jurusan: string;
    };
    dudi: {
      namaPerusahaan: string;
      alamat: string;
    };
    guru: {
      nama: string;
      nip: string;
    };
    status: string;
    tanggalMulai: string;
    tanggalSelesai: string;
  };
  error?: string;
}

class SiswaDudiService {
  private baseUrl = '/api/siswa/dudi';
  private magangUrl = '/api/siswa/magang';

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
  
  async daftarMagang(dudiId: number): Promise<MagangRegistrationRequest> {
    try {
      const response = await fetch(this.magangUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dudiId
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to register for magang');
      }

      return data;
    } catch (error) {
      console.error('Error registering for magang:', error);
      return {
        success: false,
        message: '',
        data: {} as any,
        error: error instanceof Error ? error.message : 'Failed to register for magang'
      };
    }
  }

  // Get student's magang registrations
  async getMagangRegistrations(): Promise<MagangRegistrationResponse> {
    try {
      const response = await fetch(this.magangUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch magang registrations');
      }

      return data;
    } catch (error) {
      console.error('Error fetching magang registrations:', error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : 'Failed to fetch magang registrations'
      };
    }
  }
}

export const siswaDudiService = new SiswaDudiService();
