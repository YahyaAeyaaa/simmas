// Import removed - not used in this file

export type StatusType = 'pending' | 'active' | 'rejected';

export interface StatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

export const getStatusConfig = (status: StatusType): StatusConfig => {
  const statusMap: Record<StatusType, StatusConfig> = {
    pending: {
      label: 'Pending',
      bgColor: 'bg-[#ffc107]',
      textColor: 'text-[#ffea07]'
    },
    active: {
      label: 'Aktif',
      bgColor: 'bg-[#cfffe9]',
      textColor: 'text-[#198754]'
    },
    rejected: {
      label: 'Reject',
      bgColor: 'bg-[#ffd5d5]',
      textColor: 'text-[#dc3545]'
    }
  };

  return statusMap[status];
};

export type Status = 'aktif' | 'nonaktif' | 'pending';

export interface StatusC {
  label: string;
  bgColor: string;
  textColor: string;
}

// Magang Status Types
export type MagangStatus = 'pending' | 'diterima' | 'ditolak' | 'berlangsung' | 'selesai' | 'dibatalkan';

export interface MagangStatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

export const getMagangStatus = (status: MagangStatus): MagangStatusConfig => {
  const statusMap: Record<MagangStatus, MagangStatusConfig> = {
    pending: {
      label: 'Pending',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    diterima: {
      label: 'Diterima',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    },
    ditolak: {
      label: 'Ditolak',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    },
    berlangsung: {
      label: 'Berlangsung',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    selesai: {
      label: 'Selesai',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    dibatalkan: {
      label: 'Dibatalkan',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    }
  };

  return statusMap[status];
};

// Logbook Status Types
export type LogbookStatus = 'pending' | 'disetujui' | 'ditolak';

export interface LogbookStatusConfig {
  label: string;
  bgColor: string;
  textColor: string;
}

export const getLogbookStatus = (status: LogbookStatus): LogbookStatusConfig => {
  const statusMap: Record<LogbookStatus, LogbookStatusConfig> = {
    pending: {
      label: 'Pending',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    disetujui: {
      label: 'Disetujui',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    ditolak: {
      label: 'Ditolak',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700'
    }
  };

  return statusMap[status];
};

export interface DudiData {
  id: number;
  namaPerusahaan: string;
  alamat: string;
  email: string;
  telepon: string;
  penanggungJawab: string;
  bidangUsaha?: string;
  deskripsi?: string;
  kuotaMagang?: number;
  status: Status;
  jumlahSiswaMagang: number;
  guruPenanggungJawabId?: number | null;
  guruPenanggungJawab?: {
    id: number;
    nama: string;
    nip: string;
  } | null;
}

export const getStatus = (status: Status): StatusC => {
  const statusMap: Record<Status, StatusC> = {
    pending: {
      label: 'Pending',
      bgColor: 'bg-[#ffc107]',
      textColor: 'text-[#ffea07]'
    },
    aktif: {
      label: 'Aktif',
      bgColor: 'bg-[#cfffe9]',
      textColor: 'text-[#198754]'
    },
    nonaktif: {
      label: 'Tidak Aktif',
      bgColor: 'bg-[#ffd5d5]',
      textColor: 'text-[#dc3545]'
    }
  };

  return statusMap[status];
};

export const dudiDummyData: DudiData[] = [
  {
    id: 1,
    namaPerusahaan: 'PT Kreasi Teknologi',
    alamat: 'Jl. Semolowaru no. 45, Surabaya',
    email: 'info@kreasi2lab.com',
    telepon: '081-123456789',
    penanggungJawab: 'Andi Wijaya',
    status: 'aktif',
    jumlahSiswaMagang: 3
  },
  {
    id: 2,
    namaPerusahaan: 'CV Maju Jaya Digital',
    alamat: 'Jl. Ahmad Yani no. 12, Surabaya',
    email: 'contact@majujaya.co.id',
    telepon: '081-987654321',
    penanggungJawab: 'Siti Nurhaliza',
    status: 'aktif',
    jumlahSiswaMagang: 5
  },
  {
    id: 3,
    namaPerusahaan: 'PT Solusi Informatika',
    alamat: 'Jl. Raya Darmo no. 88, Surabaya',
    email: 'hr@solusinfo.com',
    telepon: '031-5551234',
    penanggungJawab: 'Budi Santoso',
    status: 'pending',
    jumlahSiswaMagang: 0
  },
  {
    id: 4,
    namaPerusahaan: 'PT Inovasi Cemerlang',
    alamat: 'Jl. Basuki Rahmat no. 67, Surabaya',
    email: 'info@inovasi.id',
    telepon: '081-234567890',
    penanggungJawab: 'Dewi Lestari',
    status: 'aktif',
    jumlahSiswaMagang: 2
  },
  {
    id: 5,
    namaPerusahaan: 'CV Karya Mandiri',
    alamat: 'Jl. Ngagel no. 34, Surabaya',
    email: 'admin@karyamandiri.com',
    telepon: '031-7778899',
    penanggungJawab: 'Rudi Hermawan',
    status: 'nonaktif',
    jumlahSiswaMagang: 0
  },
  {
    id: 6,
    namaPerusahaan: 'PT Digital Nusantara',
    alamat: 'Jl. Diponegoro no. 23, Surabaya',
    email: 'contact@digitalnusantara.co.id',
    telepon: '081-345678901',
    penanggungJawab: 'Maya Sari',
    status: 'aktif',
    jumlahSiswaMagang: 4
  },
  {
    id: 7,
    namaPerusahaan: 'CV Techno Media',
    alamat: 'Jl. Manyar no. 56, Surabaya',
    email: 'info@technomedia.net',
    telepon: '031-6665544',
    penanggungJawab: 'Agus Prasetyo',
    status: 'pending',
    jumlahSiswaMagang: 0
  },
  {
    id: 8,
    namaPerusahaan: 'PT Global Solutions',
    alamat: 'Jl. Mayjen Sungkono no. 90, Surabaya',
    email: 'hr@globalsolutions.com',
    telepon: '081-456789012',
    penanggungJawab: 'Linda Wijayanti',
    status: 'nonaktif',
    jumlahSiswaMagang: 0
  }
];

