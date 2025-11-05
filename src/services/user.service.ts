// Serviços de gerenciamento de usuários

import api from './api';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UpdateUserStatusRequest,
  UpdateUserPermissionsRequest,
  UserListResponse,
  UserResponse,
} from '../types/user.types';

export const userService = {
  /**
   * Lista todos os usuários
   */
  async list(): Promise<User[]> {
    const response = await api.get<UserListResponse>('/users');
    return response.data.data;
  },

  /**
   * Busca usuário por ID
   */
  async getById(id: string): Promise<User> {
    const response = await api.get<UserResponse>(`/users/${id}`);
    return response.data.data;
  },

  /**
   * Cria novo usuário
   */
  async create(data: CreateUserRequest): Promise<User> {
    const response = await api.post<UserResponse>('/users', data);
    return response.data.data;
  },

  /**
   * Atualiza usuário existente
   */
  async update(id: string, data: UpdateUserRequest): Promise<User> {
    const response = await api.put<UserResponse>(`/users/${id}`, data);
    return response.data.data;
  },

  /**
   * Remove usuário
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  },

  /**
   * Atualiza status do usuário (ativo/inativo)
   */
  async updateStatus(id: string, status: boolean): Promise<User> {
    const data: UpdateUserStatusRequest = { status };
    const response = await api.patch<UserResponse>(`/users/${id}/status`, data);
    return response.data.data;
  },

  /**
   * Atualiza permissões do usuário
   */
  async updatePermissions(id: string, permissions: UpdateUserPermissionsRequest): Promise<User> {
    const response = await api.patch<UserResponse>(`/users/${id}/permissions`, permissions);
    return response.data.data;
  },
};
