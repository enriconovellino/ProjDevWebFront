// Este é o local correto para os tipos no seu projeto.
// "Interface" é um contrato que define a "forma" de um objeto.

// ----------------------------------------------------
// TIPOS DE CONSULTA (JÁ EXISTENTES)
// ----------------------------------------------------
export type AppointmentStatus = 
  | 'Confirmado' 
  | 'Pendente' 
  | 'Agendada' 
  | 'Concluída';

export interface Appointment {
  id: string | number;
  patient: string;
  dateTime: string; // Ex: "2024-07-16T14:30:00"
  specialty?: string;
  status: AppointmentStatus;
}

// ----------------------------------------------------
// TIPO DE PERFIL DO MÉDICO (JÁ EXISTENTE)
// ----------------------------------------------------
export interface DoctorProfile {
  name: string;
  avatarUrl?: string; 
}

// ----------------------------------------------------
// TIPOS DE PACIENTE (ATUALIZADOS E EXPANDIDOS)
// ----------------------------------------------------

// Interface base para a tabela (JÁ EXISTENTE)
export interface Patient {
  id: string | number;
  name: string;
  dob: string; // Data de Nascimento
  gender: 'Feminino' | 'Masculino' | 'Outro';
  phone: string;
  email: string;
}

// --- NOVAS INTERFACES PARA O PRONTUÁRIO ---

// Informações do "Histórico Médico"
export interface MedicalInfo {
  bloodType?: string;
  weightKg?: number;
  heightCm?: number;
  bmi?: number;
  arterialPressure?: string; // Ex: "120/80 mmHg"
  heartRateBpm?: number; // Ex: 72
}

// Informações do "Contacto de Emergência"
export interface EmergencyContact {
  name: string;
  relationship: string; // Ex: "Marido"
  phone: string;
}

// O Prontuário completo, que combina tudo
export interface PatientRecord {
  profile: Patient; // Os dados base de "Informações Pessoais"
  address: string; // O endereço que estava em "Informações Pessoais"
  medicalInfo: MedicalInfo;
  emergencyContacts: EmergencyContact[];
  // No futuro, podemos adicionar:
  // diagnostics: Diagnostic[];
  // medications: Medication[];
  // allergies: Allergy[];
}

