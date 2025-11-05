// Serviços de autenticação

import api from './api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  Usuario
} from '../types/auth.types';

export const authService = {
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Registra novo paciente
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Busca perfil do usuário autenticado
   */
  async getPerfil(): Promise<Usuario> {
    const response = await api.get<Usuario>('/auth/perfil');
    return response.data;
  },

  /**
   * Armazena token e dados do usuário no localStorage
   */
  saveAuth(token: string, user: Usuario): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * Remove token e dados do usuário do localStorage
   */
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Recupera token do localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Recupera usuário do localStorage
   */
  getUser(): Usuario | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as Usuario;
    } catch {
      return null;
    }
  },
};
