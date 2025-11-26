// Serviços de médicos

import api from './api';
import type {
  Medico,
  CreateMedicoRequest,
  UpdateMedicoRequest,
  MedicoListResponse
} from '../types/medico.types';

export const medicoService = {
  /**
   * Lista todos os médicos com paginação
   */
  async list(page: number = 1, limit: number = 10): Promise<MedicoListResponse> {
    const response = await api.get<MedicoListResponse>('/medicos', {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Busca médico por ID
   */
  async getById(id: number): Promise<Medico> {
    const response = await api.get<Medico>(`/medicos/${id}`);
    return response.data;
  },

  /**
   * Busca médico por CRM
   */
  async getByCrm(crm: string): Promise<Medico | null> {
    try {
      const listResponse = await this.list(1, 100); // Busca até 100 médicos
      const medico = listResponse.data.find(m => m.crm === crm);
      return medico || null;
    } catch {
      return null;
    }
  },

  /**
   * Cria novo médico
   */
  async create(data: CreateMedicoRequest): Promise<Medico> {
    const response = await api.post<Medico>('/medicos', data);
    return response.data;
  },

  /**
   * Atualiza médico existente
   */
  async update(id: number, data: UpdateMedicoRequest): Promise<Medico> {
    const response = await api.put<Medico>(`/medicos/${id}`, data);
    return response.data;
  },

  /**
   * Remove médico (soft delete)
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/medicos/${id}`);
  },

  /**
   * Vincula especialidade ao médico
   */
  async addEspecialidade(medicoId: number, especialidadeId: number): Promise<void> {
    await api.post(`/medicos/${medicoId}/especialidades`, {
      especialidade_id: especialidadeId,
    });
  },

  /**
   * Remove vínculo entre médico e especialidade
   */
  async removeEspecialidade(medicoId: number, especialidadeId: number): Promise<void> {
    await api.delete(`/medicos/${medicoId}/especialidades/${especialidadeId}`);
  },
};
