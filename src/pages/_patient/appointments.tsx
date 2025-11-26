import { createFileRoute, Link } from '@tanstack/react-router'
import { Calendar, Clock, MapPin, Loader2, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { consultaService } from '@/services/consulta.service'
import type { Consulta } from '@/types/consulta.types'
import { toast } from 'sonner'

export const Route = createFileRoute('/_patient/appointments')({
  component: PatientAppointments,
})

function PatientAppointments() {
  const { user } = useAuth()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConsulta, setSelectedConsulta] = useState<Consulta | null>(null)
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false)
  const [isCancelOpen, setIsCancelOpen] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTime, setRescheduleTime] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchConsultas()
    }
  }, [user?.id])

  const fetchConsultas = async () => {
    try {
      setLoading(true)
      const data = await consultaService.getMyConsultas()
      setConsultas(data || [])
    } catch (error) {
      console.error('Erro ao carregar consultas:', error)
      toast.error('Erro ao carregar consultas')
    } finally {
      setLoading(false)
    }
  }

  const handleRescheduleClick = (consulta: Consulta) => {
    setSelectedConsulta(consulta)
    const dataHora = new Date(consulta.dataHora)
    setRescheduleDate(dataHora.toISOString().split('T')[0])
    setRescheduleTime(dataHora.toTimeString().slice(0, 5))
    setIsRescheduleOpen(true)
  }

  const handleCancelClick = (consulta: Consulta) => {
    setSelectedConsulta(consulta)
    setIsCancelOpen(true)
  }

  const handleReschedule = async () => {
    if (!selectedConsulta || !rescheduleDate || !rescheduleTime) {
      toast.error('Preencha a nova data e horário')
      return
    }

    try {
      setActionLoading(true)
      const newDataHora = `${rescheduleDate}T${rescheduleTime}:00`
      await consultaService.update(selectedConsulta.id, {
        dataHora: newDataHora,
      })
      toast.success('Consulta reagendada com sucesso!')
      setIsRescheduleOpen(false)
      fetchConsultas()
    } catch (error) {
      console.error('Erro ao reagendar consulta:', error)
      toast.error('Erro ao reagendar consulta')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!selectedConsulta) return

    try {
      setActionLoading(true)
      await consultaService.cancel(selectedConsulta.id)
      toast.success('Consulta cancelada com sucesso!')
      setIsCancelOpen(false)
      fetchConsultas()
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error)
      toast.error('Erro ao cancelar consulta')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMADA':
        return 'default'
      case 'AGENDADA':
        return 'secondary'
      case 'CANCELADA':
        return 'destructive'
      case 'CONCLUIDA':
        return 'outline'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case 'CONFIRMADA':
        return 'Confirmada'
      case 'AGENDADA':
        return 'Agendada'
      case 'CANCELADA':
        return 'Cancelada'
      case 'CONCLUIDA':
        return 'Concluída'
      case 'PENDENTE':
        return 'Pendente'
      default:
        return status
    }
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Minhas Consultas
            </h1>
            <p className="text-muted-foreground">
              Visualize todas as suas consultas agendadas
            </p>
          </div>
          <Link to="/schedule-appointment">
            <Button size="lg">Agendar Nova Consulta</Button>
          </Link>
        </div>

        {/* Consultas */}
        <div className="space-y-4">
          {loading ? (
            <Card className="p-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            </Card>
          ) : consultas.length === 0 ? (
            <Card className="p-8">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-medium text-muted-foreground">
                  Nenhuma consulta agendada
                </p>
              </div>
            </Card>
          ) : (
            consultas.map(consulta => {
              const dataHora = new Date(consulta.dataHora)
              const canModify = consulta.status !== 'CANCELADA' && consulta.status !== 'CONCLUIDA'

              return (
                <Card key={consulta.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {consulta.medico?.nome || 'Médico não informado'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {consulta.medico?.especialidade || 'Especialidade não informada'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {dataHora.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {consulta.observacoes && (
                          <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {consulta.observacoes}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-4 sm:min-w-[180px]">
                      <Badge variant={getStatusColor(consulta.status)}>
                        {getStatusLabel(consulta.status)}
                      </Badge>
                      {canModify && (
                        <div className="flex gap-2 w-full sm:flex-col">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRescheduleClick(consulta)}
                          >
                            Reagendar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleCancelClick(consulta)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Modal de Reagendamento */}
        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reagendar Consulta</DialogTitle>
              <DialogDescription>
                Escolha a nova data e horário para sua consulta com {selectedConsulta?.medico?.nome}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="reschedule-date">Nova Data</Label>
                <Input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="mt-2"
                  disabled={actionLoading}
                />
              </div>
              <div>
                <Label htmlFor="reschedule-time">Novo Horário</Label>
                <Input
                  id="reschedule-time"
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="mt-2"
                  disabled={actionLoading}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRescheduleOpen(false)}
                disabled={actionLoading}
              >
                Cancelar
              </Button>
              <Button onClick={handleReschedule} disabled={actionLoading}>
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Reagendando...
                  </>
                ) : (
                  'Reagendar'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de Cancelamento */}
        <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancelar Consulta</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja cancelar a consulta com {selectedConsulta?.medico?.nome}?
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCancelOpen(false)}
                disabled={actionLoading}
              >
                Não, manter consulta
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Cancelando...
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Sim, cancelar consulta
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
