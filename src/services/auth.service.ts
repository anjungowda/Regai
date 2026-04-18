import axiosInstance from '../lib/axios';
import { User, Organisation } from '../types';

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  orgName: string;
  planType: 'standard' | 'professional';
  agreedToTerms: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  data: {
    user: User;
    organisation: Organisation;
  };
}

export const authService = {
  register: (payload: RegisterPayload) => 
    axiosInstance.post<AuthResponse>('/auth/register', payload),

  login: (payload: LoginPayload) => 
    axiosInstance.post<AuthResponse>('/auth/login', payload),

  logout: () => 
    axiosInstance.post('/auth/logout'),

  forgotPassword: (email: string) => 
    axiosInstance.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string, confirmPassword: string) => 
    axiosInstance.post('/auth/reset-password', { token, newPassword, confirmPassword }),

  getMe: () => 
    axiosInstance.get<AuthResponse>('/auth/me'),

  refreshToken: () => 
    axiosInstance.post<AuthResponse>('/auth/refresh'),
};
