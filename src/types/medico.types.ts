// Tipos relacionados a médicos

export type Especialidade = {
  id: number;
  nome: string;
  codigo: string;
  ativo: boolean;
}

export type MedicoEspecialidade = {
  medico_id: number;
  especialidade_id: number;
  especialidade: Especialidade;
}

export type Medico = {
  id: number;
  nome: string;
  telefone: string;
  crm: string;
  duracao_minutos: number;
  usuario_id: number;
  usuario: {
    id: number;
    nome: string;
    email: string;
    ativo: boolean;
  };
  especialidades: MedicoEspecialidade[];
}

export type CreateMedicoRequest = {
  email: string;
  senha: string;
  nome: string;
  cpf: string;
  telefone: string;
  crm: string;
  duracao_minutos: number;
}

export type UpdateMedicoRequest = {
  nome?: string;
  email?: string;
  telefone?: string;
  crm?: string;
  duracao_minutos?: number;
  ativo?: boolean;
}

export type MedicoListResponse = {
  data: Medico[];
  metadata: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
