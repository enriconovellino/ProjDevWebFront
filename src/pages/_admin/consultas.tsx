import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Calendar, Clock, Loader2, Eye, CheckCircle, XCircle, Trash2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { consultaService } from '@/services/consulta.service'
import type { Consulta, StatusConsulta } from '@/types/consulta.types'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const Route = createFileRoute('/_admin/consultas')({
  component: AdminConsultasPage,
})

function AdminConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null)
  const [actionType, setActionType] = useState<'confirm' | 'cancel' | 'delete' | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchConsultas()
  }, [])

  const fetchConsultas = async () => {
    try {
      setLoading(true)
      const data = await consultaService.list()
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

      switch (actionType) {
        case 'confirm':
          await consultaService.confirm(selectedConsulta.id)
          toast.success('Consulta confirmada com sucesso!')
          break
        case 'cancel':
          await consultaService.cancel(selectedConsulta.id)
          toast.success('Consulta cancelada com sucesso!')
          break
        case 'delete':
          await consultaService.delete(selectedConsulta.id)
          toast.success('Consulta excluída com sucesso!')
          break
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

  const openActionDialog = (consulta: Consulta, type: 'confirm' | 'cancel' | 'delete') => {
    setSelectedConsulta(consulta)
    setActionType(type)
  }

  const formatDate = (dateTime: string) => {
    try {
      return format(new Date(dateTime), "dd 'de' MMM 'de' yyyy", { locale: ptBR })
    } catch {
      return 'Data inválida'
    }
  }

  const formatTime = (dateTime: string) => {
    try {
      return format(new Date(dateTime), 'HH:mm')
    } catch {
      return '--:--'
    }
  }

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

  // Filtrar consultas
  const filteredConsultas = consultas
    .filter((consulta) => {
      const matchSearch =
        consulta.paciente?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        consulta.medico?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      const matchStatus = statusFilter === 'all' || consulta.status.toUpperCase() === statusFilter
      return matchSearch && matchStatus
    })
    .sort((a, b) => new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime())

  // Estatísticas
  const stats = {
    total: consultas.length,
    agendadas: consultas.filter((c) => c.status === 'AGENDADA').length,
    confirmadas: consultas.filter((c) => c.status === 'CONFIRMADA').length,
    canceladas: consultas.filter((c) => c.status === 'CANCELADA').length,
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gerenciar Consultas
            </h1>
            <p className="text-muted-foreground mt-1">
              Visualize e gerencie todas as consultas do sistema
            </p>
          </div>
          <Button onClick={fetchConsultas} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.agendadas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.confirmadas}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.canceladas}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por paciente ou médico..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="AGENDADA">Agendada</SelectItem>
                  <SelectItem value="CONFIRMADA">Confirmada</SelectItem>
                  <SelectItem value="CANCELADA">Cancelada</SelectItem>
                  <SelectItem value="CONCLUIDA">Concluída</SelectItem>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredConsultas.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm || statusFilter !== 'all'
                  ? 'Nenhuma consulta encontrada com os filtros aplicados'
                  : 'Nenhuma consulta cadastrada'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Médico</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredConsultas.map((consulta) => (
                      <TableRow key={consulta.id}>
                        <TableCell className="font-medium">
                          {consulta.paciente?.nome || 'Não informado'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {consulta.medico?.nome || 'Não informado'}
                            </div>
                            {consulta.medico?.especialidade && (
                              <div className="text-xs text-muted-foreground">
                                {consulta.medico.especialidade}
                              </div>
                            )}
                          </div>
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
                            {consulta.status !== 'CANCELADA' && consulta.status !== 'CONCLUIDA' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openActionDialog(consulta, 'cancel')}
                                title="Cancelar consulta"
                              >
                                <XCircle className="h-4 w-4 text-red-600" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openActionDialog(consulta, 'delete')}
                              title="Excluir consulta"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Dialog */}
        <Dialog open={!!actionType} onOpenChange={() => { setActionType(null); setSelectedConsulta(null) }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'confirm' && 'Confirmar Consulta'}
                {actionType === 'cancel' && 'Cancelar Consulta'}
                {actionType === 'delete' && 'Excluir Consulta'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'confirm' &&
                  `Tem certeza que deseja confirmar a consulta de ${selectedConsulta?.paciente?.nome} com ${selectedConsulta?.medico?.nome}?`}
                {actionType === 'cancel' &&
                  `Tem certeza que deseja cancelar a consulta de ${selectedConsulta?.paciente?.nome} com ${selectedConsulta?.medico?.nome}?`}
                {actionType === 'delete' &&
                  `Tem certeza que deseja excluir esta consulta? Esta ação não pode ser desfeita.`}
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
                variant={actionType === 'delete' ? 'destructive' : 'default'}
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
                    {actionType === 'cancel' && 'Cancelar Consulta'}
                    {actionType === 'delete' && 'Excluir'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}
