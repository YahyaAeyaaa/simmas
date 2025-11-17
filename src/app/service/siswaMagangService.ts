// Service untuk API magang siswa

export interface MagangStatusData {
  siswa: {
    nama: string;
    nis: string;
    kelas: string;
    jurusan: string;
  };
  dudi: {
    namaPerusahaan: string;
    alamat: string;
    bidangUsaha: string;
  };
  periode: {
    tanggalMulai: string | Date;
    tanggalSelesai: string | Date;
    status: 'aktif' | 'selesai' | 'pending';
  };
  guru: {
    nama: string;
    nip: string;
  };
  nilaiAkhir: number | null;
}

export const getMagangStatus = async (): Promise<{
  success: boolean;
  data?: MagangStatusData;
  error?: string;
}> => {
  try {
    const response = await fetch('/api/siswa/magang/status', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Failed to fetch internship status',
      };
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error('Error in getMagangStatus:', error);
    return {
      success: false,
      error: 'Network error',
    };
  }
};

