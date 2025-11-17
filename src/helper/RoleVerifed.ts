import { Shield, GraduationCap, BookOpen, UserCheck, UserX, LucideIcon } from 'lucide-react';

export type Role = 'admin' | 'guru' | 'siswa';
export type VerificationStatus = 'Verified' | 'Unverified';

export interface UserData {
  id: number;
  namaPerusahaan: string;
  id_user: string;
  email: string;
  verifed_at: string;
  penanggungJawab: string;
  status: Role;
  Terdaftar_pada: string;
  jurusan?: string;
  kelas?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface StatusInfo {
  label: string;
  bgColor: string;
  textColor: string;
  icon: LucideIcon;
}

export interface VerificationInfo {
  label: string;
  bgColor: string;
  textColor: string;
  icon: LucideIcon;
}

export const getRole = (status: Role): StatusInfo => {
  const statusMap: Record<Role, StatusInfo> = {
    admin: {
      label: 'Admin',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
      icon: Shield
    },
    guru: {
      label: 'Guru',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      icon: GraduationCap
    },
    siswa: {
      label: 'Siswa',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: BookOpen
    }
  };

  return statusMap[status];
};

export const getVerificationStatus = (status: string): VerificationInfo => {
  const isVerified = status.toLowerCase().includes('verified') && !status.toLowerCase().includes('unverified');
  
  if (isVerified) {
    return {
      label: 'Verified',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      icon: UserCheck
    };
  } else {
    return {
      label: 'Unverified',
      bgColor: 'bg-red-100',
      textColor: 'text-red-700',
      icon: UserX
    };
  }
};

export const userDummyData: UserData[] = [
  // {
  //   id: 1,
  //   namaPerusahaan: 'Andi Wijaya',
  //   id_user: '15',
  //   email: 'andi.wijaya@gmail.com',
  //   verifed_at: 'Verified',
  //   penanggungJawab: 'Andi Wijaya',
  //   status: 'admin',
  //   Terdaftar_pada: '3 aug 2024'
  // },
  // {
  //   id: 2,
  //   namaPerusahaan: 'Siti Nurhaliza',
  //   id_user: '14',
  //   email: 'siti.nurhaliza@gmail.com',
  //   verifed_at: 'Verified',
  //   penanggungJawab: 'Siti Nurhaliza',
  //   status: 'guru',
  //   Terdaftar_pada: '2 feb 2020'
  // },
  // {
  //   id: 3,
  //   namaPerusahaan: 'Budi Santoso',
  //   id_user: '13',
  //   email: 'budi.santoso@gmail.com',
  //   verifed_at: 'Verified',
  //   penanggungJawab: 'Budi Santoso',
  //   status: 'guru',
  //   Terdaftar_pada: '2 sep 2024'
  // },
  // {
  //   id: 4,
  //   namaPerusahaan: 'Dewi Lestari',
  //   id_user: '12',
  //   email: 'dewi.lestari@gmail.com',
  //   verifed_at: 'Unverified',
  //   penanggungJawab: 'Dewi Lestari',
  //   status: 'siswa',
  //   Terdaftar_pada: '8 Marc 2024'
  // },
  // {
  //   id: 5,
  //   namaPerusahaan: 'Rudi Hermawan',
  //   id_user: '11',
  //   email: 'rudi.hermawan@gmail.com',
  //   verifed_at: 'Verified',
  //   penanggungJawab: 'Rudi Hermawan',
  //   status: 'guru',
  //   Terdaftar_pada: '7 jan 2024'
  // },
];