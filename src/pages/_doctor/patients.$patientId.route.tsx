import React, { useState, useEffect } from 'react'
import { Outlet, Link, useParams, createFileRoute } from '@tanstack/react-router'
// Importa os componentes de UI
// CORREÇÃO: Caminho corrigido de ../../../ para ../../
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
// Importa os ícones
import { 
  LayoutDashboard, 
  User, 
  ClipboardList, 
  FileText, 
  Settings 
} from 'lucide-react'
// Importa os tipos
// CORREÇÃO: Caminho corrigido de ../../../ para ../../
import type { Patient } from '../../lib/types'

// --- Mock Data (Substitua pela sua API) ---
const MOCK_PATIENT_PROFILE: Patient = {
  id: 1,
  name: 'Ana Clara Pereira',
  dob: '15 de março de 1988',
  gender: 'Feminino',
  phone: '(11) 98765-4321',
  email: 'anaclara.pereira@email.com',
}
// -----------------------------------------

// 1. Cria a rota de layout /_doctor/patients/$patientId
// (O erro de TypeScript aqui é temporário)
export const Route = createFileRoute('/_doctor/patients/$patientId')({
  component: PatientRecordLayout,
})

// 2. Define o componente de Layout
function PatientRecordLayout() {
  const { patientId } = useParams({ from: '/_doctor/patients/$patientId' })
  const [patient, setPatient] = useState<Patient | null>(null)

  useEffect(() => {
    setPatient(MOCK_PATIENT_PROFILE);
  }, [patientId])

  if (!patient) {
    return <div className="p-6">Carregando dados do paciente...</div>
  }

  // Classes de link
  const linkClass = "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
  const activeLinkClass = "bg-accent text-accent-foreground"

  return (
    <div className="flex">
      
      {/* Sidebar Vertical (Específica do Prontuário) */}
      <aside className="sticky top-20 h-[calc(100vh-5rem)] w-64 flex-shrink-0 border-r border-border bg-sidebar p-6 hidden md:block">
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${patient.email}`} />
            <AvatarFallback>{patient.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <span className="font-semibold text-lg block">{patient.name}</span>
            <span className="text-sm text-muted-foreground">Paciente</span>
          </div>
        </div>
        
        {/* Navegação da Sidebar Vertical (AGORA COMPLETA) */}
        {/* (Os erros de TypeScript nestes links são temporários) */}
        <nav className="flex flex-col gap-1">
          <Link
            to="/patients/$patientId"
            params={{ patientId }}
            className={linkClass}
            activeProps={{ className: activeLinkClass }}
          >
            <LayoutDashboard className="h-4 w-4" />
            Visão geral
          </Link>
          <Link
            to="/patients/$patientId/consultas"
            params={{ patientId }}
            className={linkClass}
            activeProps={{ className: activeLinkClass }}
          >
            <ClipboardList className="h-4 w-4" />
            Consultas
          </Link>
          
          {/* --- LINKS ADICIONADOS --- */}
          <Link
            to="/patients/$patientId/prontuario"
            params={{ patientId }}
            className={linkClass}
            activeProps={{ className: activeLinkClass }}
          >
            <User className="h-4 w-4" />
            Prontuário
          </Link>
          <Link
            to="/patients/$patientId/documentos"
            params={{ patientId }}
            className={linkClass}
            activeProps={{ className: activeLinkClass }}
          >
            <FileText className="h-4 w-4" />
            Documentos
          </Link>
          <Link
            to="/patients/$patientId/configuracoes"
            params={{ patientId }}
            className={linkClass}
            activeProps={{ className: activeLinkClass }}
          >
            <Settings className="h-4 w-4" />
            Configurações
          </Link>
          {/* --- FIM DOS LINKS ADICIONADOS --- */}
        </nav>
      </aside>

      {/* O <Outlet/> renderizará a página 'index.tsx' */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>
    </div>
  )
}

