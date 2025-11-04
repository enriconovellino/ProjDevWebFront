import React, { useState, useEffect } from 'react'
import { createFileRoute, useParams } from '@tanstack/react-router'
// Importa os tipos
import type { PatientRecord, MedicalInfo, EmergencyContact } from '../../../lib/types'

// Importa os componentes
import { Separator } from "../../../components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs"

// --- MOCK DATA (PARA ESTA PÁGINA) ---
const MOCK_RECORD: PatientRecord = {
  profile: {
    id: 1,
    name: 'Ana Clara Pereira',
    dob: '15 de março de 1988',
    gender: 'Feminino',
    phone: '(11) 98765-4321',
    email: 'anaclara.pereira@email.com',
  },
  address: 'Rua das Flores, 123, São Paulo, SP',
  medicalInfo: {
    bloodType: 'O+',
    weightKg: 65,
    heightCm: 168,
    bmi: 23.0,
    arterialPressure: '120/80 mmHg',
    heartRateBpm: 72,
  },
  emergencyContacts: [
    { name: 'Carlos Pereira', relationship: 'Marido', phone: '(11) 91234-5678' }
  ]
}
// --- FIM DOS DADOS MOCK ---

// 1. Cria a rota "index" (Visão Geral)
// A '/' no final significa que é o 'index' da rota pai '$patientId'
export const Route = createFileRoute('/_doctor/patients/$patientId/')({
  component: PatientOverviewPage,
})

// ---------------------------------------------
// HELPER COMPONENT (Para os campos de dados)
// ---------------------------------------------
interface InfoItemProps {
  label: string;
  value?: string | number;
}
function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-base font-medium text-foreground">{value || 'N/A'}</span>
    </div>
  )
}

// ---------------------------------------------
// O COMPONENTE DA PÁGINA ("Visão Geral")
// ---------------------------------------------
function PatientOverviewPage() {
  // Obtém o 'patientId' do URL
  // (O erro de TypeScript aqui é temporário)
  const { patientId } = useParams({ from: '/_doctor/patients/$patientId/' })
  const [record, setRecord] = useState<PatientRecord | null>(null);

  // Simula a busca de dados da API
  useEffect(() => {
    // Na vida real: fetch(`/api/patients/${patientId}`)
    setRecord(MOCK_RECORD);
  }, [patientId])

  if (!record) {
    return <div className="p-6">Carregando prontuário...</div>
  }

  // Renderiza o conteúdo da página
  return (
    // Esta página será renderizada DENTRO do <Outlet> do route.lazy.tsx
    <div className="container mx-auto max-w-5xl">
      
      {/* Cabeçalho */}
      <h1 className="text-3xl font-bold text-foreground">
        Prontuário de Paciente
      </h1>
      <p className="text-muted-foreground mt-1">
        Histórico médico completo de {record.profile.name}
      </p>

      {/* Sistema de Abas (Tabs) do shadcn */}
      <Tabs defaultValue="geral" className="w-full mt-6">
        
        {/* Lista de Abas */}
        <TabsList className="mb-6">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="diagnosticos">Diagnósticos</TabsTrigger>
          <TabsTrigger value="medicacoes">Medicações</TabsTrigger>
          <TabsTrigger value="exames">Exames</TabsTrigger>
          <TabsTrigger value="alergias">Alergias</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* Conteúdo da Aba "Geral" */}
        <TabsContent value="geral" className="space-y-8">
          
          {/* Secção 1: Informações Pessoais */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Informações Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoItem label="Nome" value={record.profile.name} />
              <InfoItem label="Data de Nascimento" value={record.profile.dob} />
              <InfoItem label="Gênero" value={record.profile.gender} />
              <InfoItem label="Telefone" value={record.profile.phone} />
              <InfoItem label="Email" value={record.profile.email} />
              <InfoItem label="Endereço" value={record.address} />
            </div>
          </section>

          <Separator />

          {/* Secção 2: Histórico Médico */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Histórico Médico</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <InfoItem label="Tipo Sanguíneo" value={record.medicalInfo.bloodType} />
              <InfoItem label="Peso" value={`${record.medicalInfo.weightKg} kg`} />
              <InfoItem label="Altura" value={`${record.medicalInfo.heightCm} cm`} />
              <InfoItem label="IMC" value={record.medicalInfo.bmi} />
              <InfoItem label="Pressão Arterial" value={record.medicalInfo.arterialPressure} />
              <InfoItem label="Frequência Cardíaca" value={`${record.medicalInfo.heartRateBpm} bpm`} />
            </div>
          </section>

          <Separator />

          {/* Secção 3: Contactos de Emergência */}
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Contatos de Emergência</h2>
            {record.emergencyContacts.map((contact: EmergencyContact, index: number) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoItem label="Nome do Contato" value={contact.name} />
                <InfoItem label="Parentesco" value={contact.relationship} />
                <InfoItem label="Telefone" value={contact.phone} />
              </div>
            ))}
          </section>

        </TabsContent>

        {/* Outras Abas (vazio por enquanto) */}
        <TabsContent value="diagnosticos"><p>Em breve...</p></TabsContent>
        <TabsContent value="medicacoes"><p>Em breve...</p></TabsContent>
        <TabsContent value="exames"><p>Em breve...</p></TabsContent>
        <TabsContent value="alergias"><p>Em breve...</p></TabsContent>
        <TabsContent value="historico"><p>Em breve...</p></TabsContent>
        
      </Tabs>
    </div>
  )
}

