// Cliente Axios configurado para integração com o backend

import axios from 'axios';
import type { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 10000;

// Cria instância do Axios
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Token expirado ou inválido
    if (error.response?.status === 401) {
      // Limpa o token e redireciona para login
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Evita loop infinito se já estiver na página de login
      if (window.location.pathname !== '/sign-in') {
        window.location.href = '/sign-in';
      }
    }

    return Promise.reject(error);
  }
);

// Helper para tratar erros de API
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; errors?: string[] }>;

    // Erro de resposta do servidor
    if (axiosError.response?.data) {
      const data = axiosError.response.data;

      // Retorna a mensagem de erro do backend
      if (data.message) {
        return data.message;
      }

      // Retorna array de erros formatado
      if (data.errors && Array.isArray(data.errors)) {
        return data.errors.join(', ');
      }
    }

    // Erro de timeout
    if (axiosError.code === 'ECONNABORTED') {
      return 'Tempo de resposta esgotado. Tente novamente.';
    }

    // Erro de rede
    if (axiosError.message === 'Network Error') {
      return 'Erro de conexão. Verifique sua internet ou se o servidor está online.';
    }

    // Erro genérico do Axios
    return axiosError.message;
  }

  // Erro desconhecido
  return 'Erro desconhecido. Tente novamente.';
};

export default api;
