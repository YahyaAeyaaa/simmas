// app/service/userApiService.ts
import { UserData, ApiResponse } from '@/helper/RoleVerifed';

const API_BASE_URL = '/api';

function getAuthToken(): string | null {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: 'admin' | 'guru' | 'siswa' | string;
  emailVerification: 'verified' | 'unverified' | string;
  jurusan?: string | null;
  kelas?: 'XI' | 'XII' | string ;
  nis?: number | null;
  nip?: string | null;
  alamat?: string | null;
  telepon?: string | null;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: 'admin' | 'guru' | 'siswa' | string;
  emailVerification?: 'verified' | 'unverified' | string;
  jurusan?: string | null;
  kelas?: 'XI' | 'XII' | string | null;
  nis?: number | null;
  nip?: string | null;
  password?: string;
}

export class UserApiService {

  static async getUsers(
    search?: string,
    role?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<UserData[]>> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (role) params.append('role', role);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }

      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users'
      };
    }
  }


  static async createUser(userData: CreateUserData): Promise<ApiResponse<any>> {
    try {
      const payload: any = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        emailVerification: userData.emailVerification
      };

      if (userData.role === 'siswa') {
        payload.jurusan = userData.jurusan ?? null;
        payload.kelas = userData.kelas ?? null;
        payload.nis = userData.nis ?? null;
        if (userData.alamat) payload.alamat = userData.alamat;
        if (userData.telepon) payload.telepon = userData.telepon;
      }

      if (userData.role === 'guru') {
        payload.nip = userData.nip ?? null;
        if (userData.alamat) payload.alamat = userData.alamat;
        if (userData.telepon) payload.telepon = userData.telepon;
      }

      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      return data;
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user'
      };
    }
  }

  static async getUserById(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user');
      }

      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      };
    }
  }


  static async updateUser(id: number, userData: UpdateUserData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user'
      };
    }
  }


  static async deleteUser(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user');
      }

      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user'
      };
    }
  }
}
