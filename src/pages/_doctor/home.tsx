import React, { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
// Importa o TIPO de consulta
import type { Appointment } from '../../lib/types' 
// Importa o Badge de Status que já criámos (REMOVIDO)
// import StatusBadge from '../../components/common/doctor/StatusBadge'
// Importa os componentes de Card do shadcn
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"

// 1. Define os dados mockados (substitua pela sua API)
const MOCK_DATA: Appointment[] = [
  { id: 1, patient: 'Sofia Pereira', time: '09:00 AM', specialty: 'Cardiologia', status: 'Confirmado' },
  { id: 2, patient: 'Lucas Martins', time: '10:30 AM', specialty: 'Dermatologia', status: 'Pendente' },
  { id: 3, patient: 'Isabela Costa', time: '11:45 AM', specialty: 'Ortopedia', status: 'Confirmado' },
  { id: 4, patient: 'Gabriel Santos', time: '02:15 PM', specialty: 'Neurologia', status: 'Confirmado' },
  { id: 5, patient: 'Beatriz Oliveira', time: '03:45 PM', specialty: 'Pediatria', status: 'Pendente' },
];

// 2. Cria a rota para esta página
// O TanStack vai transformar isto na rota '/home'
export const Route = createFileRoute('/_doctor/home')({
  component: HomePage, // Define o componente da página
})

// 3. Define o componente da página
function HomePage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simula a busca de dados da API
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppointments(MOCK_DATA);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <h1 className="p-6 text-2xl font-semibold">Carregando...</h1>;
  }

  return (
    // Container principal da página
    <div className="container mx-auto max-w-5xl p-6 py-10">
      
      {/* Lista de Consultas (usamos um Card como na página de Configurações) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Consultas de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* O 'div' a seguir substitui o <table> para facilitar com Tailwind */}
          <div className="border-t border-border">
            
            {/* Cabeçalho da Lista */}
            <div className="grid grid-cols-4 gap-4 p-4 border-b border-border bg-muted/50">
              <span className="text-sm font-medium text-muted-foreground">Paciente</span>
              <span className="text-sm font-medium text-muted-foreground">Horário</span>
              <span className="text-sm font-medium text-muted-foreground">Especialidade</span>
              <span className="text-sm font-medium text-muted-foreground">Status</span>
            </div>

            {/* Linhas de Dados */}
            {appointments.map(appt => (
              <div key={appt.id} className="grid grid-cols-4 gap-4 p-4 border-b border-border last:border-b-0 items-center">
                <span className="font-medium text-foreground">{appt.patient}</span>
                <span className="text-muted-foreground">{appt.time}</span>
                <span className="text-muted-foreground">{appt.specialty}</span>
                {/* MUDANÇA: Removemos o StatusBadge e mostramos apenas o texto.
                  Adicionei 'text-muted-foreground' para ficar igual às outras colunas.
                */}
                <span className="text-muted-foreground">{appt.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

