// service/adminDashboardService.ts
import { MagangStatus } from '@/helper/status';

export interface AdminDashboardStats {
  totalSiswa: number;
  totalGuru: number;
  totalDudi: number;
  totalMagang: number;
  magangAktif: number;
  magangPending: number;
  logbookPending: number;
}

export interface MagangTerbaru {
  id: number;
  studentName: string;
  studentNis: string;
  companyName: string;
  companyAddress: string;
  teacherName: string;
  startDate: string | Date;
  endDate: string | Date;
  status: MagangStatus;
  createdAt: string | Date;
}

export interface DudiAktif {
  id: number;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  studentCount: number;
  status: string;
}

class AdminDashboardService {
  private baseUrl = '/api/admin/dashboard';

  async getDashboardStats(): Promise<AdminDashboardStats> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'GET',
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard stats');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getMagangTerbaru(): Promise<MagangTerbaru[]> {
    try {
      const response = await fetch(`${this.baseUrl}/magang-terbaru`, {
        method: 'GET',
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch magang terbaru');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching magang terbaru:', error);
      throw error;
    }
  }

  async getDudiAktif(): Promise<DudiAktif[]> {
    try {
      const response = await fetch(`${this.baseUrl}/dudi-aktif`, {
        method: 'GET',
        credentials: 'same-origin',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dudi aktif');
      }

      return data.data;
    } catch (error) {
      console.error('Error fetching dudi aktif:', error);
      throw error;
    }
  }
}

export const adminDashboardService = new AdminDashboardService();

