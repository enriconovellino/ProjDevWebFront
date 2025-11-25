// Tipos relacionados a consultas

export type StatusConsulta = 'AGENDADA' | 'CONFIRMADA' | 'CANCELADA' | 'CONCLUIDA' | 'PENDENTE';

export interface Consulta {
  id: string;
  pacienteId: string;
  medicoId: string;
  dataHora: string;
  status: StatusConsulta;
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  medico?: {
    id: string;
    nome: string;
    especialidade?: string;
    crm?: string;
  };
  paciente?: {
    id: string;
    nome: string;
    cpf?: string;
  };
}

export interface CreateConsultaRequest {
  pacienteId: string;
  medicoId: string;
  dataHora: string;
  observacoes?: string;
}

export interface UpdateConsultaRequest {
  dataHora?: string;
  status?: StatusConsulta;
  observacoes?: string;
}

export interface ConsultaListResponse {
  data: Consulta[];
  total: number;
}

export interface ConsultaResponse {
  data: Consulta;
}
