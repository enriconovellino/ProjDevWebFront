// Tipos relacionados a prontuários médicos

export type TipoProntuario = 'CONSULTA' | 'EXAME' | 'PROCEDIMENTO' | 'RECEITA';

export interface Prontuario {
  id: string;
  pacienteId: string;
  medicoId: string;
  consultaId?: string;
  tipo: TipoProntuario;
  titulo: string;
  descricao: string;
  data: string;
  anexos?: string[];
  createdAt: string;
  updatedAt: string;
  medico?: {
    id: string;
    nome: string;
    especialidade?: string;
    crm?: string;
  };
}

export interface CreateProntuarioRequest {
  pacienteId: string;
  medicoId: string;
  consultaId?: string;
  tipo: TipoProntuario;
  titulo: string;
  descricao: string;
  data: string;
}

export interface UpdateProntuarioRequest {
  tipo?: TipoProntuario;
  titulo?: string;
  descricao?: string;
  data?: string;
}

export interface ProntuarioListResponse {
  data: Prontuario[];
  total: number;
}

export interface ProntuarioResponse {
  data: Prontuario;
}
