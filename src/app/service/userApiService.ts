import { UserData, ApiResponse } from '@/helper/RoleVerifed';

const API_BASE_URL = '/api';

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  emailVerification: string;
  jurusan?: string;
}

export interface UpdateUserData {
  username: string;
  email: string;
  role: string;
  emailVerification: string;
}

export class UserApiService {
  // Get all users with optional search, role filter, and pagination
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

      const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`);
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

  // Create new user
  static async createUser(userData: CreateUserData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          emailVerification: userData.emailVerification,
          ...(userData.role === 'siswa' && userData.jurusan ? { jurusan: userData.jurusan } : {})
        })
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

  // Get single user by ID
  static async getUserById(id: number): Promise<ApiResponse<UserData>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
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

  // Update user
  static async updateUser(id: number, userData: UpdateUserData): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
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

  // Delete user
  static async deleteUser(id: number): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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
