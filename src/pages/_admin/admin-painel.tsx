import { useState, useEffect } from 'react'
import { Search, Filter, CirclePlus, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { medicoService } from '@/services/medico.service'
import { especialidadeService } from '@/services/especialidade.service'
import { handleApiError } from '@/services/api'
import type { Medico } from '@/types/medico.types'

export const Route = createFileRoute('/_admin/admin-painel')({
  component: AdminPainelPage,
})

function AdminPainelPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedEspecialidade, setSelectedEspecialidade] = useState('Todas')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [medicoToDelete, setMedicoToDelete] = useState<Medico | null>(null)

  // Estados para dados da API
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [especialidades, setEspecialidades] = useState<string[]>(['Todas'])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  // Carrega médicos e especialidades ao montar o componente
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      // Carrega médicos
      const medicosResponse = await medicoService.list(1, 100)
      setMedicos(medicosResponse.data)

      // Carrega especialidades
      const especialidadesResponse = await especialidadeService.list(1, 100, true)
      const especialidadesNomes = especialidadesResponse.map(e => e.nome)
      setEspecialidades(['Todas', ...especialidadesNomes])
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  // Função auxiliar para obter nome da especialidade
  const getEspecialidadeNome = (medico: Medico): string => {
    if (medico.especialidades && medico.especialidades.length > 0) {
      return medico.especialidades[0].especialidade.nome
    }
    return 'Sem especialidade'
  }

  const medicosFiltrados = medicos.filter(med => {
    const especialidadeNome = getEspecialidadeNome(med)

    const matchesSearch =
      med.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.crm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      especialidadeNome.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesEspecialidade =
      selectedEspecialidade === 'Todas' ||
      especialidadeNome === selectedEspecialidade

    return matchesSearch && matchesEspecialidade
  })

  const handleDeleteClick = (medico: Medico) => {
    setMedicoToDelete(medico)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!medicoToDelete) return

    setDeleting(true)
    try {
      await medicoService.delete(medicoToDelete.id)
      // Remove o médico da lista localmente
      setMedicos(medicos.filter(m => m.id !== medicoToDelete.id))
      setIsDeleteDialogOpen(false)
      setMedicoToDelete(null)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false)
    setMedicoToDelete(null)
  }

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

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-md">
              {error}
            </div>
          )}

          {/* Search and Filter Section */}
          <Card className="p-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por Nome, CRM ou Especialidade..."
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="pl-9"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-2 md:min-w-[240px]">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedEspecialidade}
                  onChange={(e) => setSelectedEspecialidade(e.target.value)}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={loading}
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Telefone</th>
                  <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {loading ? (
                  <tr className="border-b">
                    <td colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <p className="text-lg font-medium">Carregando médicos...</p>
                      </div>
                    </td>
                  </tr>
                ) : medicosFiltrados.length === 0 ? (
                  <tr className="border-b">
                    <td colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="mb-3 h-12 w-12 opacity-40" />
                        <p className="text-lg font-medium">Nenhum médico encontrado</p>
                        <p className="text-sm">Tente ajustar os filtros de busca</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  medicosFiltrados.map((med) => (
                    <tr key={med.id} className="border-b transition-colors hover:bg-muted/50">
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
                        <Badge variant="secondary">{getEspecialidadeNome(med)}</Badge>
                      </td>
                      <td className="p-4 align-middle text-foreground">{med.telefone}</td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-emerald-700 hover:border-emerald-700"
                            onClick={() => navigate({ to: '/edit-doctor', search: { crm: med.crm } })}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-[var(--destructive)] hover:border-[var(--destructive)]"
                            onClick={() => handleDeleteClick(med)}
                          >
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

        {/* Dialog de Confirmação de Remoção */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px] !bg-white dark:!secondary border-2 border-border">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Confirmar Remoção
              </DialogTitle>
              <DialogDescription className="pt-4">
                Tem certeza que deseja remover o médico{' '}
                <span className="font-semibold text-foreground">
                  {medicoToDelete?.nome}
                </span>{' '}
                (CRM: {medicoToDelete?.crm})?
                <br />
                <br />
                Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? 'Removendo...' : 'Remover'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
  )
}
