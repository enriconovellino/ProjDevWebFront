// Serviço de gerenciamento de pacientes

import api from './api';
import type {
  Paciente,
  CreatePacienteRequest,
  UpdatePacienteRequest,
  PacienteListResponse,
  PacienteResponse,
} from '../types/paciente.types';

export const pacienteService = {
  /**
   * Lista todos os pacientes com paginação
   */
  async list(page: number = 1, limit: number = 10): Promise<PacienteListResponse> {
    const response = await api.get<PacienteListResponse>('/pacientes', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Busca paciente por ID
   */
  async getById(id: number): Promise<Paciente> {
    const response = await api.get<PacienteResponse>(`/pacientes/${id}`);
    return response.data.data;
  },

  /**
   * Busca dados do paciente logado (próprio usuário)
   * Implementa fallback robusto caso o endpoint /pacientes/me tenha problemas
   */
  async getMe(): Promise<Paciente> {
    try {
      // Tenta primeiro pelo endpoint /pacientes/me (ideal)
      const response = await api.get<PacienteResponse>('/pacientes/me');
      return response.data.data;
    } catch (error: any) {
      console.log('Endpoint /pacientes/me falhou:', error.response?.status, error.response?.data?.message);

      // Fallback 1: Tenta buscar por CPF usando endpoint específico
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('Usuário não autenticado');
        }

        const user = JSON.parse(userStr);
        if (!user.cpf) {
          throw new Error('CPF do usuário não encontrado');
        }

        console.log('Tentando buscar paciente por CPF:', user.cpf);
        const cpfResponse = await api.get<PacienteResponse>(`/pacientes/cpf/${user.cpf}`);
        return cpfResponse.data.data;
      } catch (cpfError: any) {
        console.log('Endpoint /pacientes/cpf também falhou:', cpfError.response?.status);

        // Fallback 2: Tenta buscar pelo usuario_id
        try {
          const userStr = localStorage.getItem('user');
          const user = JSON.parse(userStr!);
          console.log('Tentando buscar paciente por usuario_id:', user.id);
          return await this.getByUsuarioId(user.id);
        } catch (userIdError: any) {
          console.error('Todas as tentativas falharam');
          throw new Error('Não foi possível carregar os dados do paciente. Verifique se você está cadastrado como paciente no sistema.');
        }
      }
    }
  },

  /**
   * Busca paciente por usuario_id (requer permissões de admin)
   */
  async getByUsuarioId(usuarioId: number): Promise<Paciente> {
    try {
      // Tenta primeiro pelo endpoint específico
      const response = await api.get<PacienteResponse>(`/pacientes/usuario/${usuarioId}`);
      return response.data.data;
    } catch (error) {
      // Se falhar, busca na lista de pacientes (requer permissões de admin)
      console.log('Endpoint /pacientes/usuario não encontrado, buscando na lista...');
      const listResponse = await this.list(1, 100);
      const paciente = listResponse.data.find(p => p.usuario_id === usuarioId);

      if (!paciente) {
        throw new Error('Paciente não encontrado');
      }

      return paciente;
    }
  },

  /**
   * Busca paciente por CPF
   */
  async getByCpf(cpf: string): Promise<Paciente | null> {
    try {
      const listResponse = await this.list(1, 100);
      const paciente = listResponse.data.find(p => p.cpf === cpf);
      return paciente || null;
    } catch {
      return null;
    }
  },

  /**
   * Cria novo paciente
   */
  async create(data: CreatePacienteRequest): Promise<Paciente> {
    const response = await api.post<PacienteResponse>('/pacientes', data);
    return response.data.data;
  },

  /**
   * Atualiza paciente existente
   */
  async update(id: number, data: UpdatePacienteRequest): Promise<Paciente> {
    const response = await api.put<PacienteResponse>(`/pacientes/${id}`, data);
    return response.data.data;
  },

  /**
   * Remove paciente (soft delete)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/pacientes/${id}`);
  },
};
