export interface SchoolSettings {
  id: number | null;
  logoUrl: string | null;
  namaSekolah: string;
  alamat: string;
  telepon: string;
  email: string;
  website: string | null;
  kepalaSekolah: string;
  npsn: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SchoolSettingsResponse {
  success: boolean;
  data: SchoolSettings;
  error?: string;
}

export interface UpdateSchoolSettingsData {
  logoUrl?: string | null;
  namaSekolah: string;
  alamat: string;
  telepon: string;
  email: string;
  website?: string | null;
  kepalaSekolah: string;
  npsn: string;
}

class SchoolSettingsService {
  private baseUrl = '/api/school-settings';

  // Get school settings
  async getSchoolSettings(): Promise<SchoolSettingsResponse> {
    try {
      const response = await fetch(this.baseUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch school settings');
      }

      return data;
    } catch (error) {
      console.error('Error fetching school settings:', error);
      return {
        success: false,
        data: {
          id: null,
          logoUrl: null,
          namaSekolah: "SMK Negeri 1 Surabaya",
          alamat: "Jl. SMEA No.4, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur 60252",
          telepon: "031-5678910",
          email: "info@smkn1surabaya.sch.id",
          website: "www.smkn1surabaya.sch.id",
          kepalaSekolah: "Drs. H. Sutriono, M.Pd.",
          npsn: "20567890",
          createdAt: null,
          updatedAt: null
        },
        error: error instanceof Error ? error.message : 'Failed to fetch school settings'
      };
    }
  }

  // Update school settings
  async updateSchoolSettings(settingsData: UpdateSchoolSettingsData): Promise<SchoolSettingsResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update school settings');
      }

      return data;
    } catch (error) {
      console.error('Error updating school settings:', error);
      return {
        success: false,
        data: {
          id: null,
          logoUrl: null,
          namaSekolah: "SMK Negeri 1 Surabaya",
          alamat: "Jl. SMEA No.4, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur 60252",
          telepon: "031-5678910",
          email: "info@smkn1surabaya.sch.id",
          website: "www.smkn1surabaya.sch.id",
          kepalaSekolah: "Drs. H. Sutriono, M.Pd.",
          npsn: "20567890",
          createdAt: null,
          updatedAt: null
        },
        error: error instanceof Error ? error.message : 'Failed to update school settings'
      };
    }
  }
}

export const schoolSettingsService = new SchoolSettingsService();
