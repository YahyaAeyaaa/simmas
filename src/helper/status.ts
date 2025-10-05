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

