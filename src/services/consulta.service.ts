// Serviço de gerenciamento de consultas

import api from './api';
import type {
  Consulta,
  CreateConsultaRequest,
  UpdateConsultaRequest,
  ConsultaListResponse,
  ConsultaResponse,
} from '../types/consulta.types';

export const consultaService = {
  /**
   * Lista todas as consultas
   */
  async list(): Promise<Consulta[]> {
    const response = await api.get<ConsultaListResponse>('/consultas');
    return response.data.data;
  },

  /**
   * Lista consultas do paciente logado
   */
  async getMyConsultas(): Promise<Consulta[]> {
    try {
      const response = await api.get<ConsultaListResponse>('/consultas/me');
      return response.data.data;
    } catch (error: any) {
      console.log('Endpoint /consultas/me falhou, tentando /consultas/minhas...');

      try {
        const response = await api.get<ConsultaListResponse>('/consultas/minhas');
        return response.data.data;
      } catch (error2: any) {
        console.log('Endpoint /consultas/minhas também falhou');
        throw new Error('Não foi possível carregar suas consultas. Entre em contato com o suporte.');
      }
    }
  },

  /**
   * Lista consultas de um paciente específico (requer permissões de admin)
   */
  async listByPaciente(pacienteId: string): Promise<Consulta[]> {
    const response = await api.get<ConsultaListResponse>(`/consultas/paciente/${pacienteId}`);
    return response.data.data;
  },

  /**
   * Lista consultas de um médico específico
   */
  async listByMedico(medicoId: string): Promise<Consulta[]> {
    const response = await api.get<ConsultaListResponse>(`/consultas/medico/${medicoId}`);
    return response.data.data;
  },

  /**
   * Busca consulta por ID
   */
  async getById(id: string): Promise<Consulta> {
    const response = await api.get<ConsultaResponse>(`/consultas/${id}`);
    return response.data.data;
  },

  /**
   * Cria nova consulta
   */
  async create(data: CreateConsultaRequest): Promise<Consulta> {
    const response = await api.post<ConsultaResponse>('/consultas', data);
    return response.data.data;
  },

  /**
   * Atualiza consulta existente
   */
  async update(id: string, data: UpdateConsultaRequest): Promise<Consulta> {
    const response = await api.put<ConsultaResponse>(`/consultas/${id}`, data);
    return response.data.data;
  },

  /**
   * Cancela uma consulta
   */
  async cancel(id: string): Promise<Consulta> {
    const response = await api.patch<ConsultaResponse>(`/consultas/${id}/cancelar`);
    return response.data.data;
  },

  /**
   * Confirma uma consulta
   */
  async confirm(id: string): Promise<Consulta> {
    const response = await api.patch<ConsultaResponse>(`/consultas/${id}/confirmar`);
    return response.data.data;
  },

  /**
   * Remove consulta
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/consultas/${id}`);
  },
};
