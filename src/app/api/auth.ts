

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'guru';
}

export interface AuthResponse {
  data: {
    token: string;
    user: User;
  };
}

export type RoleType = 'user' | 'guru' | '';