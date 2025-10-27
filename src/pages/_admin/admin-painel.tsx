import { useState } from 'react'
import { Search, Filter, CirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin-painel')({
  component: AdminPainelPage,
})

type Med = {
  nome: string
  crm: string
  especialidade: string
  escala: string
}

const medicos: Med[] = [
  { nome: 'Dr. Carlos Silva', crm: '12345-SP', especialidade: 'Cardiologia', escala: 'Manhã (08:00 - 12:00)' },
  { nome: 'Dra. Ana Paula Santos', crm: '23456-RJ', especialidade: 'Pediatria', escala: 'Tarde (13:00 - 17:00)' },
  { nome: 'Dr. Roberto Oliveira', crm: '34567-MG', especialidade: 'Ortopedia', escala: 'Noite (18:00 - 22:00)' },
  { nome: 'Dra. Mariana Costa', crm: '45678-SP', especialidade: 'Dermatologia', escala: 'Integral (08:00 - 17:00)' },
  { nome: 'Dr. Fernando Alves', crm: '56789-RS', especialidade: 'Neurologia', escala: 'Plantão 24h' },
  { nome: 'Dra. Juliana Mendes', crm: '67890-BA', especialidade: 'Ginecologia', escala: 'Manhã (08:00 - 12:00)' },
  { nome: 'Dr. Paulo Ricardo', crm: '78901-PR', especialidade: 'Oftalmologia', escala: 'Tarde (13:00 - 17:00)' },
  { nome: 'Dra. Beatriz Lima', crm: '89012-SC', especialidade: 'Psiquiatria', escala: 'Noite (18:00 - 22:00)' },
]

function AdminPainelPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEspecialidade, setSelectedEspecialidade] = useState('Todas')

  const especialidades = ['Todas', ...new Set(medicos.map(m => m.especialidade))]

  const medicosFiltrados = medicos.filter(med => {
    const matchesSearch =
      med.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.crm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.especialidade.toLowerCase().includes(searchTerm.toLowerCase())||
      med.escala.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEspecialidade =
      selectedEspecialidade === 'Todas' ||
      med.especialidade === selectedEspecialidade

    return matchesSearch && matchesEspecialidade
  })

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Gerenciamento de Médicos
              </h1>
              <p className="text-muted-foreground">
                Visualize e gerencie o cadastro de profissionais de saúde
              </p>
            </div>
            <Button
              
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate({ to: '/add-doctor' })}
            >
              <CirclePlus className="mr-2 h-5 w-5" />
              Adicionar Médico
            </Button>
          </div>

          {/* Search and Filter Section */}
          <Card className="p-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por Nome, CRM ou Escala..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <div className="flex items-center gap-2 md:min-w-[240px]">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedEspecialidade}
                  onChange={(e) => setSelectedEspecialidade(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {especialidades.map(esp => (
                    <option key={esp} value={esp}>{esp}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>
        </div>

        {/* Results Summary */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando <span className="font-semibold text-foreground">{medicosFiltrados.length}</span> de{' '}
            <span className="font-semibold text-foreground">{medicos.length}</span> médicos
          </p>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">CRM</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Especialidade</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Escala</th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {medicosFiltrados.length === 0 ? (
                  <tr className="border-b">
                    <td colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="mb-3 h-12 w-12 opacity-40" />
                        <p className="text-lg font-medium">Nenhum médico encontrado</p>
                        <p className="text-sm">Tente ajustar os filtros de busca</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  medicosFiltrados.map((med, idx) => (
                    <tr key={idx} className="border-b transition-colors hover:bg-muted/50">
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {med.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground">{med.nome}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-foreground">{med.crm}</td>
                      <td className="p-4 align-middle">
                        <Badge variant="secondary">{med.especialidade}</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant="secondary">{med.especialidade}</Badge>
                      </td>
                      <td className="p-4 align-middle">
                        <Badge variant="secondary">{med.escala}</Badge>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="text-destructive hover:text-emerald-700 hover:border-emerald-700" >
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-[var(--destructive)] hover:border-[var(--destructive)]">
                            Remover
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
  )
}