import React, { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Badge } from "../../components/ui/badge"
import { Search, Loader2, Eye, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuth } from '@/hooks/useAuth'
import { consultaService } from '@/services/consulta.service'
import type { Consulta } from '@/types/consulta.types'
import { toast } from 'sonner'

export const Route = createFileRoute('/_doctor/schedule')({
  component: SchedulePage,
})

function SchedulePage() {
  const { user } = useAuth()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null)
  const [actionType, setActionType] = useState<'confirm' | 'complete' | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchConsultas()
  }, [user?.id])

  const fetchConsultas = async () => {
    if (!user?.id) return

    try {
      setLoading(true)
      const data = await consultaService.listByMedico(user.id.toString())
      setConsultas(data || [])
    } catch (error) {
      console.error('Erro ao carregar consultas:', error)
      toast.error('Erro ao carregar consultas')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selectedConsulta || !actionType) return

    try {
      setActionLoading(true)

      if (actionType === 'confirm') {
        await consultaService.confirm(selectedConsulta.id)
        toast.success('Consulta confirmada com sucesso!')
      } else if (actionType === 'complete') {
        await consultaService.update(selectedConsulta.id, { status: 'CONCLUIDA' })
        toast.success('Consulta marcada como concluída!')
      }

      setSelectedConsulta(null)
      setActionType(null)
      fetchConsultas()
    } catch (error) {
      console.error('Erro ao executar ação:', error)
      toast.error('Erro ao executar ação')
    } finally {
      setActionLoading(false)
    }
  }

  const openActionDialog = (consulta: Consulta, type: 'confirm' | 'complete') => {
    setSelectedConsulta(consulta)
    setActionType(type)
  }

  const formatDate = (dateTime: string) => format(new Date(dateTime), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
  const formatTime = (dateTime: string) => format(new Date(dateTime), "HH:mm")

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'CONFIRMADA': 'default',
      'AGENDADA': 'secondary',
      'CANCELADA': 'destructive',
      'CONCLUIDA': 'outline',
      'PENDENTE': 'secondary',
    }
    return variants[status.toUpperCase()] || 'secondary'
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'CONFIRMADA': 'Confirmada',
      'AGENDADA': 'Agendada',
      'CANCELADA': 'Cancelada',
      'CONCLUIDA': 'Concluída',
      'PENDENTE': 'Pendente',
    }
    return labels[status.toUpperCase()] || status
  }

  // Filtrar consultas por nome do paciente
  const filteredConsultas = consultas.filter(consulta =>
    consulta.paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Separar consultas futuras e passadas
  const now = new Date()
  const upcomingConsultas = filteredConsultas
    .filter(c => new Date(c.dataHora) >= now && c.status !== 'CANCELADA' && c.status !== 'CONCLUIDA')
    .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())

  const pastConsultas = filteredConsultas
    .filter(c => new Date(c.dataHora) < now || c.status === 'CONCLUIDA')
    .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())

  return (
    // Container principal da página
    <div className="container mx-auto max-w-7xl p-6 py-10">

      {/* Secção Superior: Título, Busca, Total */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Minhas Consultas
          </h1>
          <p className="text-muted-foreground mt-1">
            {loading ? 'Carregando...' : `Total: ${consultas.length} consulta${consultas.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar por paciente..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
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
            <CardTitle>Próximas Consultas ({upcomingConsultas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : upcomingConsultas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma consulta próxima
              </div>
            ) : (
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
                  {upcomingConsultas.map(consulta => (
                    <TableRow key={consulta.id}>
                      <TableCell className="font-medium">
                        {consulta.paciente?.nome || 'Paciente não informado'}
                      </TableCell>
                      <TableCell>{formatDate(consulta.dataHora)}</TableCell>
                      <TableCell>{formatTime(consulta.dataHora)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(consulta.status)}>
                          {getStatusLabel(consulta.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {consulta.status !== 'CONFIRMADA' && consulta.status !== 'CONCLUIDA' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openActionDialog(consulta, 'confirm')}
                              title="Confirmar consulta"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                          )}
                          {consulta.status === 'CONFIRMADA' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openActionDialog(consulta, 'complete')}
                              title="Marcar como concluída"
                            >
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            </Button>
                          )}
                          <Link
                            to="/patients/$patientId"
                            params={{ patientId: consulta.pacienteId }}
                            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Consultas Passadas */}
        <Card>
          <CardHeader>
            <CardTitle>Consultas Passadas ({pastConsultas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : pastConsultas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma consulta passada
              </div>
            ) : (
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
                  {pastConsultas.map(consulta => (
                    <TableRow key={consulta.id}>
                      <TableCell className="font-medium">
                        {consulta.paciente?.nome || 'Paciente não informado'}
                      </TableCell>
                      <TableCell>{formatDate(consulta.dataHora)}</TableCell>
                      <TableCell>{formatTime(consulta.dataHora)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(consulta.status)}>
                          {getStatusLabel(consulta.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          to="/patients/$patientId"
                          params={{ patientId: consulta.pacienteId }}
                          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver Detalhes
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Action Dialog */}
      <Dialog open={!!actionType} onOpenChange={() => { setActionType(null); setSelectedConsulta(null) }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'confirm' && 'Confirmar Consulta'}
              {actionType === 'complete' && 'Concluir Consulta'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'confirm' &&
                `Tem certeza que deseja confirmar a consulta com ${selectedConsulta?.paciente?.nome}?`}
              {actionType === 'complete' &&
                `Marcar a consulta com ${selectedConsulta?.paciente?.nome} como concluída?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setActionType(null); setSelectedConsulta(null) }}
              disabled={actionLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAction}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processando...
                </>
              ) : (
                <>
                  {actionType === 'confirm' && 'Confirmar'}
                  {actionType === 'complete' && 'Concluir'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

