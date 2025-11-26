// Serviço de API para funcionalidades do médico

import api from './api';
import type { Appointment, Patient, PatientRecord } from '../lib/types';

export interface AppointmentResponse {
  id: number;
  paciente: {
    id: number;
    nome: string;
  };
  medico: {
    id: number;
    nome: string;
  };
  especialidade: string;
  data_hora: string;
  status: string;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface PatientResponse {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string;
  endereco?: string;
  dataNascimento?: string;
  criado_em: string;
  atualizado_em: string;
}

export const doctorService = {
  /**
   * Busca consultas do médico autenticado
   */
  async getAppointments(filters?: {
    data?: string;
    status?: string;
  }): Promise<Appointment[]> {
    const params = new URLSearchParams();

    if (filters?.data) {
      params.append('data', filters.data);
    }
    if (filters?.status) {
      params.append('status', filters.status);
    }

    const response = await api.get<any>(
      `/consultas/medico${params.toString() ? `?${params.toString()}` : ''}`
    );

    // A API pode retornar response.data ou response.data.data
    const consultas = Array.isArray(response.data) ? response.data : (response.data.data || []);

    // Mapeia a resposta da API para o formato esperado pelo frontend
    return consultas.map((consulta: any) => ({
      id: consulta.id,
      patient: consulta.paciente?.nome || 'Paciente não informado',
      dateTime: consulta.data_hora || consulta.dataHora,
      specialty: consulta.especialidade || 'Não informado',
      status: mapStatusToFrontend(consulta.status),
    }));
  },

  /**
   * Busca consultas de hoje do médico
   */
  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.getAppointments({ data: today });
  },

  /**
   * Busca pacientes do médico
   */
  async getPatients(): Promise<Patient[]> {
    const response = await api.get<PatientResponse[]>('/medicos/pacientes');

    return response.data.map(paciente => ({
      id: paciente.id,
      name: paciente.nome,
      email: paciente.email,
      phone: paciente.telefone || '',
      dob: paciente.dataNascimento || '',
      gender: 'Outro', // A API não retorna gênero, então usamos um valor padrão
    }));
  },

  /**
   * Busca detalhes de um paciente específico
   */
  async getPatientById(id: string | number): Promise<PatientRecord> {
    const response = await api.get<PatientResponse>(`/pacientes/${id}`);
    const paciente = response.data;

    return {
      profile: {
        id: paciente.id,
        name: paciente.nome,
        email: paciente.email,
        phone: paciente.telefone || '',
        dob: paciente.dataNascimento || '',
        gender: 'Outro',
      },
      address: paciente.endereco || '',
      medicalInfo: {
        // Dados médicos virão de endpoints futuros
      },
      emergencyContacts: [],
    };
  },

  /**
   * Busca histórico de consultas de um paciente
   */
  async getPatientAppointments(patientId: string | number): Promise<Appointment[]> {
    const response = await api.get<any>(
      `/consultas/paciente/${patientId}`
    );

    // A API pode retornar response.data ou response.data.data
    const consultas = Array.isArray(response.data) ? response.data : (response.data.data || []);

    return consultas.map((consulta: any) => ({
      id: consulta.id,
      patient: consulta.paciente?.nome || 'Paciente não informado',
      dateTime: consulta.data_hora || consulta.dataHora,
      specialty: consulta.especialidade || 'Não informado',
      status: mapStatusToFrontend(consulta.status),
    }));
  },

  /**
   * Cria nova consulta
   */
  async createAppointment(data: {
    pacienteId: number;
    especialidade: string;
    dataHora: string;
    observacoes?: string;
  }): Promise<AppointmentResponse> {
    const response = await api.post<AppointmentResponse>('/consultas', {
      paciente_id: data.pacienteId,
      especialidade: data.especialidade,
      data_hora: data.dataHora,
      observacoes: data.observacoes,
    });

    return response.data;
  },

  /**
   * Atualiza status de uma consulta
   */
  async updateAppointmentStatus(
    id: number,
    status: string
  ): Promise<AppointmentResponse> {
    const response = await api.put<AppointmentResponse>(`/consultas/${id}`, {
      status: mapStatusToBackend(status),
    });

    return response.data;
  },

  /**
   * Cancela uma consulta
   */
  async cancelAppointment(id: number): Promise<void> {
    await api.delete(`/consultas/${id}`);
  },
};

/**
 * Mapeia status do backend para o frontend
 */
function mapStatusToFrontend(status: string): 'Confirmado' | 'Pendente' | 'Agendada' | 'Concluída' {
  const statusMap: Record<string, 'Confirmado' | 'Pendente' | 'Agendada' | 'Concluída'> = {
    'CONFIRMADA': 'Confirmado',
    'PENDENTE': 'Pendente',
    'AGENDADA': 'Agendada',
    'CONCLUIDA': 'Concluída',
    'CONCLUÍDA': 'Concluída',
  };

  return statusMap[status.toUpperCase()] || 'Pendente';
}

/**
 * Mapeia status do frontend para o backend
 */
function mapStatusToBackend(status: string): string {
  const statusMap: Record<string, string> = {
    'Confirmado': 'CONFIRMADA',
    'Pendente': 'PENDENTE',
    'Agendada': 'AGENDADA',
    'Concluída': 'CONCLUIDA',
  };

  return statusMap[status] || 'PENDENTE';
}
