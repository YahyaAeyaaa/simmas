import { Shield, GraduationCap, BookOpen, UserCheck, UserX, LucideIcon } from 'lucide-react';

export type StatusType = 'pending' | 'active' | 'selesai';

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
    selesai: {
      label: 'selesai',
      bgColor: 'bg-[#ffd5d5]',
      textColor: 'text-[#dc3545]'
    }
  };

  return statusMap[status];
};

export type Status = 'aktif' | 'selesai' | 'pending';

export interface StatusC {
  label: string;
  bgColor: string;
  textColor: string;
}

export interface DudiData {
  id: number;
  NIS : number;
  kelas : string
  jurursan : string
  Siswa: string;
  GuruPembimbing: string;
  NIP : number;
  dudi: string;
  lokasi : string;
  pemilik : string;
  periode_awal: string;
  periode_akhir: string;
  Nilai: number;
  status: Status;
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
    selesai: {
      label: 'selesai',
      bgColor: 'bg-[#ffd5d5]',
      textColor: 'text-[#dc3545]'
    }
  };

  return statusMap[status];
};

export const dudiDummyData: DudiData[] = [
  {
    id: 1,
    NIS: 10001,
    kelas: "XI RPL 1",
    jurursan: "Rekayasa Perangkat Lunak",
    Siswa: "John Doe",
    GuruPembimbing: "Hartono",
    NIP: 196501231990021001,
    dudi: "PT Kreasi Digital Nusantara",
    lokasi: "Jl. Merdeka No. 10, Surabaya",
    pemilik: "Bapak Andi Wijaya",
    periode_awal: "2025-01-10",
    periode_akhir: "2025-04-10",
    Nilai: 57,
    status: "aktif",
  },
  {
    id: 2,
    NIS: 10002,
    kelas: "XI TKJ 2",
    jurursan: "Teknik Komputer Jaringan",
    Siswa: "Siti Nurhaliza",
    GuruPembimbing: "Dewi Kurniawati",
    NIP: 197702151999032002,
    dudi: "CV Maju Jaya Digital",
    lokasi: "Jl. Ahmad Yani No. 12, Surabaya",
    pemilik: "Ibu Ratna Sari",
    periode_awal: "2025-01-15",
    periode_akhir: "2025-04-15",
    Nilai: 77,
    status: "aktif",
  },
  {
    id: 3,
    NIS: 10003,
    kelas: "XI MM 1",
    jurursan: "Multimedia",
    Siswa: "Budi Santoso",
    GuruPembimbing: "Teguh Prasetyo",
    NIP: 198303041998111003,
    dudi: "PT Solusi Informatika",
    lokasi: "Jl. Raya Darmo No. 88, Surabaya",
    pemilik: "Bapak Slamet Widodo",
    periode_awal: "2025-02-01",
    periode_akhir: "2025-05-01",
    Nilai: 82,
    status: "pending",
  },
  {
    id: 4,
    NIS: 10004,
    kelas: "XI RPL 2",
    jurursan: "Rekayasa Perangkat Lunak",
    Siswa: "Dewi Lestari",
    GuruPembimbing: "Sutrisno",
    NIP: 197509121997021004,
    dudi: "PT Inovasi Cemerlang",
    lokasi: "Jl. Basuki Rahmat No. 67, Surabaya",
    pemilik: "Ibu Nani Kurnia",
    periode_awal: "2025-01-20",
    periode_akhir: "2025-04-20",
    Nilai: 90,
    status: "aktif",
  },
  {
    id: 5,
    NIS: 10005,
    kelas: "XI TKJ 1",
    jurursan: "Teknik Komputer Jaringan",
    Siswa: "Rudi Hermawan",
    GuruPembimbing: "Sri Wahyuni",
    NIP: 198605231999041005,
    dudi: "CV Karya Mandiri",
    lokasi: "Jl. Ngagel No. 34, Surabaya",
    pemilik: "Bapak Bambang Saputra",
    periode_awal: "2024-10-01",
    periode_akhir: "2025-01-01",
    Nilai: 87,
    status: "selesai",
  },
  {
    id: 6,
    NIS: 10006,
    kelas: "XI MM 2",
    jurursan: "Multimedia",
    Siswa: "Maya Sari",
    GuruPembimbing: "Hendra Wijaya",
    NIP: 198110021997071006,
    dudi: "PT Digital Nusantara",
    lokasi: "Jl. Diponegoro No. 23, Surabaya",
    pemilik: "Ibu Shinta Dewi",
    periode_awal: "2025-02-15",
    periode_akhir: "2025-05-15",
    Nilai: 66,
    status: "aktif",
  },
  {
    id: 7,
    NIS: 10007,
    kelas: "XI RPL 3",
    jurursan: "Rekayasa Perangkat Lunak",
    Siswa: "Agus Prasetyo",
    GuruPembimbing: "Samsul Hadi",
    NIP: 197912111999031007,
    dudi: "CV Techno Media",
    lokasi: "Jl. Manyar No. 56, Surabaya",
    pemilik: "Bapak Gunawan",
    periode_awal: "2025-03-01",
    periode_akhir: "2025-06-01",
    Nilai: 89,
    status: "pending",
  },
  {
    id: 8,
    NIS: 10008,
    kelas: "XI TKJ 3",
    jurursan: "Teknik Komputer Jaringan",
    Siswa: "Linda Wijayanti",
    GuruPembimbing: "Rahmat Hidayat",
    NIP: 198208201999021008,
    dudi: "PT Global Solutions",
    lokasi: "Jl. Mayjen Sungkono No. 90, Surabaya",
    pemilik: "Ibu Kartini",
    periode_awal: "2024-09-10",
    periode_akhir: "2024-12-10",
    Nilai: 76,
    status: "selesai",
  },
];


