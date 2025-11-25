import { createFileRoute, Link } from '@tanstack/react-router'
import { Search, ArrowRight, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { medicoService } from '@/services/medico.service'
import type { Medico } from '@/types/medico.types'
import { toast } from 'sonner'

export const Route = createFileRoute('/_patient/find-doctor')({
  component: FindDoctorPage,
})

function FindDoctorPage() {
  const [doctors, setDoctors] = useState<Medico[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    try {
      setLoading(true)
      const response = await medicoService.list(1, 100)
      setDoctors(response.data)
    } catch (error) {
      console.error('Erro ao carregar médicos:', error)
      toast.error('Erro ao carregar médicos. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase()
    const matchName = doctor.nome.toLowerCase().includes(searchLower)
    const matchSpecialty = doctor.especialidades?.some((esp) =>
      esp.especialidade.nome.toLowerCase().includes(searchLower)
    )
    return matchName || matchSpecialty
  })

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Buscar Médico</h1>
          <p className="mt-1 text-gray-600">Encontre um médico por especialidade, nome ou data</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-8 py-6 bg-blue-50">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 bg-white rounded-lg border">
            <Search className="h-5 w-5 text-gray-400 ml-3" />
            <Input
              placeholder="Buscar por especialidade, nome ou data"
              className="border-0 placeholder-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Médicos Disponíveis</h2>
          {loading && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum médico encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback className="text-lg">
                          {doctor.nome
                            .split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{doctor.nome}</h3>
                            <div className="flex flex-wrap gap-1 mt-1">
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
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-sm text-gray-600">
                            CRM: {doctor.crm} | Tel: {doctor.telefone}
                          </p>
                        </div>
                      </div>
                    </div>
                    {doctor.usuario.ativo ? (
                      <Link
                        to="/doctor/$doctorId"
                        params={{ doctorId: doctor.id.toString() }}
                      >
                        <Button variant="default">
                          Ver Perfil
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Button variant="outline" disabled>
                        Indisponível
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
