import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Clock, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { medicoService } from '@/services/medico.service'
import { consultaService } from '@/services/consulta.service'
import { pacienteService } from '@/services/paciente.service'
import type { Medico } from '@/types/medico.types'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

export const Route = createFileRoute('/_patient/doctor/$doctorId')({
  component: DoctorProfilePage,
})

function DoctorProfilePage() {
  const { doctorId } = Route.useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [doctor, setDoctor] = useState<Medico | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [observacoes, setObservacoes] = useState('')
  const [pacienteId, setPacienteId] = useState<number | null>(null)

  useEffect(() => {
    loadDoctor()
    loadPacienteInfo()
  }, [doctorId, user?.id])

  const loadPacienteInfo = async () => {
    if (!user?.id) return

    try {
      const paciente = await pacienteService.getMe()
      setPacienteId(paciente.id)
    } catch (error) {
      console.error('Erro ao carregar informações do paciente:', error)
      toast.error('Erro ao carregar suas informações.')
    }
  }

  const loadDoctor = async () => {
    try {
      setLoading(true)
      const data = await medicoService.getById(Number(doctorId))
      setDoctor(data)
    } catch (error) {
      console.error('Erro ao carregar médico:', error)
      toast.error('Erro ao carregar informações do médico.')
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: (Date | null)[] = []

    // Adiciona dias vazios no início
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Adiciona os dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const changeMonth = (offset: number) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(newDate.getMonth() + offset)
      return newDate
    })
  }

  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`)
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`)
      }
    }
    return slots
  }

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Por favor, selecione uma data e horário.')
      return
    }

    if (!pacienteId) {
      toast.error('Carregando suas informações... Tente novamente em instantes.')
      return
    }

    try {
      setBookingLoading(true)

      // Combina data e hora
      const [hours, minutes] = selectedTime.split(':')
      const appointmentDate = new Date(selectedDate)
      appointmentDate.setHours(Number(hours), Number(minutes), 0, 0)

      await consultaService.create({
        pacienteId: pacienteId.toString(),
        medicoId: doctorId,
        dataHora: appointmentDate.toISOString(),
        observacoes: observacoes || undefined,
      })

      toast.success('Consulta agendada com sucesso!')
      navigate({ to: '/appointments' })
    } catch (error: any) {
      console.error('Erro ao agendar consulta:', error)
      toast.error(error.response?.data?.message || 'Erro ao agendar consulta. Tente novamente.')
    } finally {
      setBookingLoading(false)
    }
  }

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false
    return date.toDateString() === selectedDate.toDateString()
  }

  const isPastDate = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  if (loading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </main>
    )
  }

  if (!doctor) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-500">Médico não encontrado.</p>
          <Button onClick={() => navigate({ to: '/_patient/find-doctor' })} className="mt-4">
            Voltar para busca
          </Button>
        </div>
      </main>
    )
  }

  const monthName = currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
  const timeSlots = generateTimeSlots()
  const daysInMonth = getDaysInMonth(currentMonth)
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate({ to: '/_patient/find-doctor' })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Perfil do Médico
            </h1>
            <p className="text-muted-foreground mt-1">
              Veja os detalhes e agende uma consulta
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Doctor Profile Card */}
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="text-2xl">
                      {doctor.nome
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-2xl">Dr. {doctor.nome}</CardTitle>
                  <CardDescription className="mt-2">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {doctor.especialidades && doctor.especialidades.length > 0 ? (
                        doctor.especialidades.map((esp) => (
                          <span
                            key={esp.especialidade.id}
                            className="text-sm text-gray-600 bg-gray-100 px-2 py-0.5 rounded"
                          >
                            {esp.especialidade.nome}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">Sem especialidade</span>
                      )}
                    </div>
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{doctor.telefone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{doctor.usuario.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">CRM</p>
                    <p className="font-medium">{doctor.crm}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duração da Consulta</p>
                    <p className="font-medium">{doctor.duracao_minutos} minutos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dr. {doctor.nome} é um profissional qualificado com experiência em{' '}
                  {doctor.especialidades && doctor.especialidades.length > 0
                    ? doctor.especialidades.map((e) => e.especialidade.nome).join(', ')
                    : 'diversas áreas'}.
                  Está comprometido em fornecer atendimento personalizado e de qualidade aos pacientes.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Scheduling */}
          <div className="lg:col-span-2 space-y-6">
            {/* Calendar Card */}
            <Card>
              <CardHeader>
                <CardTitle>Agendar Consulta</CardTitle>
                <CardDescription>Selecione uma data e horário disponível</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changeMonth(-1)}
                    >
                      ←
                    </Button>
                    <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => changeMonth(1)}
                    >
                      →
                    </Button>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-muted-foreground py-2"
                      >
                        {day}
                      </div>
                    ))}
                    {daysInMonth.map((date, index) => (
                      <button
                        key={index}
                        disabled={!date || isPastDate(date)}
                        onClick={() => date && setSelectedDate(date)}
                        className={`
                          aspect-square p-2 text-sm rounded-lg transition-colors
                          ${!date ? 'invisible' : ''}
                          ${isPastDate(date) ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
                          ${isDateSelected(date) ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
                          ${date && !isPastDate(date) && !isDateSelected(date) ? 'bg-white border' : ''}
                        `}
                      >
                        {date?.getDate()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Horários Disponíveis</h3>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {timeSlots.map((time) => (
                        <Button
                          key={time}
                          variant={selectedTime === time ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedTime(time)}
                          className="w-full"
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Observações */}
                {selectedDate && selectedTime && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Observações (Opcional)
                    </label>
                    <textarea
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      placeholder="Descreva brevemente o motivo da consulta..."
                      className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Book Button */}
                {selectedDate && selectedTime && (
                  <Button
                    onClick={handleBookAppointment}
                    disabled={bookingLoading || !pacienteId}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Agendando...
                      </>
                    ) : !pacienteId ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Carregando...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4" />
                        Confirmar Agendamento
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
