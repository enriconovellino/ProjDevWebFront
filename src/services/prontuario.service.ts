// Serviço de gerenciamento de prontuários médicos

import api from './api';
import type {
  Prontuario,
  CreateProntuarioRequest,
  UpdateProntuarioRequest,
  ProntuarioListResponse,
  ProntuarioResponse,
} from '../types/prontuario.types';

export const prontuarioService = {
  /**
   * Lista todos os prontuários
   */
  async list(): Promise<Prontuario[]> {
    const response = await api.get<ProntuarioListResponse>('/prontuarios');
    return response.data.data;
  },

  /**
   * Lista prontuários de um paciente específico
   */
  async listByPaciente(pacienteId: string): Promise<Prontuario[]> {
    const response = await api.get<ProntuarioListResponse>(`/prontuarios/paciente/${pacienteId}`);
    return response.data.data;
  },

  /**
   * Busca prontuário por ID
   */
  async getById(id: string): Promise<Prontuario> {
    const response = await api.get<ProntuarioResponse>(`/prontuarios/${id}`);
    return response.data.data;
  },

  /**
   * Cria novo prontuário
   */
  async create(data: CreateProntuarioRequest): Promise<Prontuario> {
    const response = await api.post<ProntuarioResponse>('/prontuarios', data);
    return response.data.data;
  },

  /**
   * Atualiza prontuário existente
   */
  async update(id: string, data: UpdateProntuarioRequest): Promise<Prontuario> {
    const response = await api.put<ProntuarioResponse>(`/prontuarios/${id}`, data);
    return response.data.data;
  },

  /**
   * Remove prontuário
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/prontuarios/${id}`);
  },
};
