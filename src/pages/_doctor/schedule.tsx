import React, { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
// Importa o tipo de consulta
import type { Appointment } from '../../lib/types'
// Importa os componentes shadcn que acabámos de adicionar
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Calendar } from "../../components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { Search } from 'lucide-react'
// O Calendário depende de 'date-fns' para formatar
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale' // Para datas em português

// 1. Define os dados mockados
// (Note que agora usamos 'dateTime' e os novos status)
const MOCK_UPCOMING: Appointment[] = [
  { id: 1, patient: 'Carlos Mendes', dateTime: '2024-07-15T10:00:00', status: 'Agendada' },
  { id: 2, patient: 'Beatriz Lima', dateTime: '2024-07-16T14:30:00', status: 'Agendada' },
  { id: 3, patient: 'Ricardo Nunes', dateTime: '2024-07-17T09:00:00', status: 'Agendada' },
];

const MOCK_PAST: Appointment[] = [
  { id: 4, patient: 'Mariana Costa', dateTime: '2024-07-10T11:00:00', status: 'Concluída' },
  { id: 5, patient: 'Lucas Pereira', dateTime: '2024-07-09T16:00:00', status: 'Concluída' },
  { id: 6, patient: 'Sofia Almeida', dateTime: '2024-07-08T13:00:00', status: 'Concluída' },
];

// 2. Cria a rota para esta página
export const Route = createFileRoute('/_doctor/schedule')({
  component: SchedulePage, // Define o componente da página
})

// 3. Define o componente da página
function SchedulePage() {
  // Estado para guardar a data selecionada no calendário
  // A 'new Date()' começa no mês atual
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Função helper para formatar data e hora
  const formatDate = (dateTime: string) => format(new Date(dateTime), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formatTime = (dateTime: string) => format(new Date(dateTime), "HH:mm");

  return (
    // Container principal da página
    <div className="container mx-auto max-w-7xl p-6 py-10">

      {/* Secção Superior: Título, Busca, Filtros, Botão */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Consultas
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Buscar por paciente..." className="pl-10" />
          </div>
          <Select defaultValue="dr-ana">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecionar Médico" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr-ana">Dr. Ana Souza</SelectItem>
              <SelectItem value="dr-ricardo">Dr. Ricardo Almeida</SelectItem>
            </SelectContent>
          </Select>
          <Button>Nova Consulta</Button>
        </div>
      </div>

      {/* Secção do Calendário (como na imagem, 2 meses) */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md"
            // Mostra 2 meses lado a lado
            numberOfMonths={2}
            // Define o mês inicial (ex: Julho de 2024)
            defaultMonth={new Date(2024, 6)}
            // Traduz os nomes para Português
            locale={ptBR}
          />
        </CardContent>
      </Card>

      {/* Secção de Listas (Próximas e Passadas) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Próximas Consultas */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Consultas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_UPCOMING.map(appt => (
                  <TableRow key={appt.id}>
                    <TableCell className="font-medium">{appt.patient}</TableCell>
                    <TableCell>{formatDate(appt.dateTime)}</TableCell>
                    <TableCell>{formatTime(appt.dateTime)}</TableCell>
                    <TableCell>
                      {/* TODO: Usar o StatusBadge se quiser cor */}
                      {appt.status}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* CORREÇÃO: <Link to="#"> trocado por <button> */}
                      <button
                        onClick={() => { /* Lógica para ver detalhes */ }}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Ver Detalhes
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Consultas Passadas */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas Passadas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_PAST.map(appt => (
                  <TableRow key={appt.id}>
                    <TableCell className="font-medium">{appt.patient}</TableCell>
                    <TableCell>{formatDate(appt.dateTime)}</TableCell>
                    <TableCell>{formatTime(appt.dateTime)}</TableCell>
                    <TableCell>{appt.status}</TableCell>
                    <TableCell className="text-right">
                      {/* CORREÇÃO: <Link to="#"> trocado por <button> */}
                      <button
                        onClick={() => { /* Lógica para ver detalhes */ }}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Ver Detalhes
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

