import { createFileRoute, Link } from '@tanstack/react-router'
import { Calendar, Users, Bell, Search, Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { consultaService } from '@/services/consulta.service'
import { medicoService } from '@/services/medico.service'
import { useState, useEffect } from 'react'
import type { Consulta } from '@/types/consulta.types'
import type { Medico } from '@/types/medico.types'

export const Route = createFileRoute('/_patient/dashboard')({
  component: PatientDashboard,
})

function PatientDashboard() {
  const { user } = useAuth()
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const [consultasData, medicosData] = await Promise.all([
          consultaService.getMyConsultas().catch((err) => {
            console.warn('Erro ao carregar consultas:', err)
            return []
          }),
          medicoService.list(1, 100).catch((err) => {
            console.warn('Erro ao carregar médicos:', err)
            return { data: [], total: 0, page: 1, limit: 100 }
          }),
        ])

        setConsultas(consultasData || [])
        setMedicos(medicosData?.data || [])
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        setError('Erro ao carregar informações do dashboard')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  const consultasAgendadas = consultas.filter(
    (c) => c.status === 'AGENDADA' || c.status === 'CONFIRMADA'
  )

  const quickStats = [
    {
      label: 'Consultas Agendadas',
      value: loading ? '-' : consultasAgendadas.length.toString(),
      icon: Calendar,
      color: 'bg-blue-50',
    },
    {
      label: 'Médicos Disponíveis',
      value: loading ? '-' : medicos.length.toString(),
      icon: Users,
      color: 'bg-green-50',
    },
  ]

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-600">Bem-vindo de volta ao seu portal de saúde</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className={`${stat.color} p-3 rounded-lg w-fit mb-4`}>
                    <Icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </CardContent>
              </Card>
            )
          })}
          <Card className="hover:shadow-lg transition-shadow bg-gray-50 border-dashed">
            <CardContent className="pt-6">
              <div className="bg-gray-200 p-3 rounded-lg w-fit mb-4">
                <Calendar className="h-6 w-6 text-gray-500" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Prontuários</p>
              <p className="text-sm text-gray-500 mt-2">Em breve</p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Próximas Consultas</CardTitle>
                  <CardDescription>Suas consultas agendadas</CardDescription>
                </div>
                <Link to="/appointments">
                  <Button variant="outline" size="sm">
                    Ver Todas
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : consultasAgendadas.length === 0 ? (
                  <p className="text-gray-600 py-8 text-center">Nenhuma consulta agendada</p>
                ) : (
                  consultasAgendadas.slice(0, 3).map((consulta) => {
                    const dataHora = new Date(consulta.dataHora)
                    const statusMap = {
                      CONFIRMADA: { label: 'Confirmada', class: 'bg-green-100 text-green-700' },
                      AGENDADA: { label: 'Agendada', class: 'bg-blue-100 text-blue-700' },
                      PENDENTE: { label: 'Pendente', class: 'bg-yellow-100 text-yellow-700' },
                      CANCELADA: { label: 'Cancelada', class: 'bg-red-100 text-red-700' },
                      CONCLUIDA: { label: 'Concluída', class: 'bg-gray-100 text-gray-700' },
                    }
                    const status = statusMap[consulta.status] || statusMap.PENDENTE

                    return (
                      <div
                        key={consulta.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {consulta.medico?.nome?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'MD'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {consulta.medico?.nome || 'Médico não informado'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {consulta.medico?.especialidade || 'Especialidade não informada'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {dataHora.toLocaleDateString('pt-BR')} às{' '}
                              {dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>

            {/* Nota: Prontuários removidos temporariamente */}
          </div>

          {/* Right Column - Doctors & Messages */}
          <div className="space-y-8">
            {/* Find a Doctor */}
            <Card>
              <CardHeader>
                <CardTitle>Buscar Médico</CardTitle>
                <CardDescription>Encontre um especialista</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Buscar por especialidade..." />
                <Link to="/find-doctor">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Buscar Médicos
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Link to="/appointments" className="block">
                <Button className="w-full" variant="default">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Minhas Consultas
                </Button>
              </Link>
              <Link to="/find-doctor" className="block">
                <Button className="w-full" variant="outline">
                  <Search className="h-4 w-4 mr-2" />
                  Buscar Médicos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
