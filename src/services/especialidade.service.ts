// Serviços de especialidades médicas

import api from './api';
import type { Especialidade } from '../types/medico.types';

type EspecialidadeListResponse = {
  data: Especialidade[];
  metadata: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export const especialidadeService = {
  /**
   * Lista todas as especialidades
   */
  async list(page: number = 1, limit: number = 100, ativo: boolean = true): Promise<Especialidade[]> {
    const response = await api.get<EspecialidadeListResponse>('/especialidades', {
      params: { page, limit, ativo },
    });
    return response.data.data;
  },

  /**
   * Cria nova especialidade
   */
  async create(nome: string, codigo: string): Promise<Especialidade> {
    const response = await api.post<Especialidade>('/especialidades', { nome, codigo });
    return response.data;
  },

  /**
   * Atualiza especialidade
   */
  async update(id: number, data: Partial<Especialidade>): Promise<Especialidade> {
    const response = await api.put<Especialidade>(`/especialidades/${id}`, data);
    return response.data;
  },
};
