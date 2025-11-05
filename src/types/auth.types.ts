// Tipos relacionados à autenticação

export const Perfil = {
  ADMIN: 'ADMIN',
  MEDICO: 'MEDICO',
  PACIENTE: 'PACIENTE'
} as const;

export type Perfil = typeof Perfil[keyof typeof Perfil];

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  perfil: Perfil;
  ativo: boolean;
  cpf: string;
  criado_em?: string;
  atualizado_em?: string;
}

export type LoginRequest = {
  email: string;
  senha: string;
}

export type LoginResponse = {
  message: string;
  usuario: Usuario;
  token: string;
}

export type RegisterRequest = {
  email: string;
  senha: string;
  nome: string;
  cpf: string;
  telefone: string;
  data_nascimento: string;
}

export type RegisterResponse = {
  message: string;
  usuario: Usuario;
  token: string;
}

export type AuthContextType = {
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
