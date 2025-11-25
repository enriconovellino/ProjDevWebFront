// Tipos relacionados a pacientes

export type Paciente = {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  endereco?: string;
  usuario_id: number;
  usuario: {
    id: number;
    nome: string;
    email: string;
    ativo: boolean;
  };
  criado_em?: string;
  atualizado_em?: string;
}

export type CreatePacienteRequest = {
  email: string;
  senha: string;
  nome: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  endereco?: string;
}

export type UpdatePacienteRequest = {
  nome?: string;
  email?: string;
  telefone?: string;
  dataNascimento?: string;
  endereco?: string;
  ativo?: boolean;
}

export type PacienteListResponse = {
  data: Paciente[];
  metadata: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export type PacienteResponse = {
  data: Paciente;
}
