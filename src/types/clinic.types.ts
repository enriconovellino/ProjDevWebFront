// Tipos relacionados às configurações da clínica

export type ClinicSettings = {
  id?: number;
  clinicName: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
  openingHours?: string;
  criado_em?: string;
  atualizado_em?: string;
}

export type ClinicSettingsResponse = {
  success: boolean;
  data: ClinicSettings;
  message?: string;
}
