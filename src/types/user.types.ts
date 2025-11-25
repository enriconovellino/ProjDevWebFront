// Tipos relacionados a usuários e permissões

export type UserPermissions = {
  gerenciarPacientes: boolean;
  agendarConsultas: boolean;
  acessarRelatorios: boolean;
}

export type User = {
  id: string;
  nome: string;
  email: string;
  cargo: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  status: boolean;
  permissions: UserPermissions;
  cpf?: string;
  telefone?: string;
  dataNascimento?: string;
}

export type CreateUserRequest = {
  nome: string;
  email: string;
  cargo: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  password: string;
  cpf: string;
  permissions: UserPermissions;
}

export type UpdateUserRequest = {
  nome?: string;
  email?: string;
  cargo?: 'ADMIN' | 'MEDICO' | 'PACIENTE';
  status?: boolean;
}

export type UpdateUserStatusRequest = {
  status: boolean;
}

export type UpdateUserPermissionsRequest = {
  permissions: UserPermissions;
}

export type UserListResponse = {
  success: boolean;
  data: User[];
}

export type UserResponse = {
  success: boolean;
  data: User;
  message?: string;
}
