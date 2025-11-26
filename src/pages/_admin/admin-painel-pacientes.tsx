import { useState, useEffect, useRef } from 'react'
import { Search, Filter, CirclePlus, AlertTriangle, RefreshCw } from 'lucide-react'
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
import { userService } from '@/services/user.service'
import { handleApiError } from '@/services/api'
import type { User } from '@/types/user.types'

export const Route = createFileRoute('/_admin/admin-painel-pacientes')({
  component: AdminPainelPacientesPage,
})

function AdminPainelPacientesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('Todos')
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [pacienteToDelete, setPacienteToDelete] = useState<User | null>(null)

  // Estados para dados da API
  const [pacientes, setPacientes] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const isLoadingRef = useRef(false)

  // Carrega pacientes ao montar o componente
  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Limpa mensagens de erro após 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  const loadData = async (forceRefresh: boolean = false) => {
    // Evita múltiplas requisições simultâneas
    if (isLoadingRef.current) {
      return
    }

    // Se já tem dados e não é refresh forçado, não recarrega
    if (!forceRefresh && pacientes.length > 0) {
      return
    }

    isLoadingRef.current = true
    setLoading(true)
    setError('')

    try {
      // Aguarda um pouco antes de fazer a requisição para evitar rate limit
      await new Promise(resolve => setTimeout(resolve, 500))

      // Carrega pacientes (filtra apenas usuários com cargo PACIENTE)
      const usuariosResponse = await userService.list()
      console.log('📊 Total de usuários retornados da API:', usuariosResponse.length)

      const pacientesFiltered = usuariosResponse.filter(user => user.cargo === 'PACIENTE')
      console.log('👥 Pacientes filtrados (cargo=PACIENTE):', pacientesFiltered.length)
      console.log('📋 Dados dos pacientes:', pacientesFiltered)

      setPacientes(pacientesFiltered)

      // Mostra aviso se não houver pacientes
      if (pacientesFiltered.length === 0 && usuariosResponse.length > 0) {
        console.warn('⚠️ Nenhum paciente encontrado. Verifique se há usuários com cargo=PACIENTE no banco de dados.')
      }
    } catch (err) {
      console.error('❌ Erro ao carregar pacientes:', err)
      setError(handleApiError(err))
    } finally {
      setLoading(false)
      isLoadingRef.current = false
    }
  }

  const pacientesFiltrados = pacientes.filter(pac => {
    const matchesSearch =
      pac.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pac.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      selectedStatus === 'Todos' ||
      (selectedStatus === 'Ativo' && pac.status) ||
      (selectedStatus === 'Inativo' && !pac.status)

    return matchesSearch && matchesStatus
  })

  const handleDeleteClick = (paciente: User) => {
    setPacienteToDelete(paciente)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!pacienteToDelete) return

    setDeleting(true)
    try {
      await userService.delete(pacienteToDelete.id)
      // Remove o paciente da lista localmente
      setPacientes(pacientes.filter(p => p.id !== pacienteToDelete.id))
      setIsDeleteDialogOpen(false)
      setPacienteToDelete(null)
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false)
    setPacienteToDelete(null)
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Gerenciamento de Pacientes
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie o cadastro de pacientes
            </p>
          </div>
          <Button
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => navigate({ to: '/add-user' })}
          >
            <CirclePlus className="mr-2 h-5 w-5" />
            Adicionar Paciente
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadData(true)}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </div>
        )}

        {/* Search and Filter Section */}
        <Card className="p-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por Nome ou Email..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-9"
                disabled={loading}
              />
            </div>

            <div className="flex items-center gap-2 md:min-w-[240px]">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={loading}
              >
                <option value="Todos">Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>
        </Card>
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-semibold text-foreground">{pacientesFiltrados.length}</span> de{' '}
          <span className="font-semibold text-foreground">{pacientes.length}</span> pacientes
        </p>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nome</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">CPF</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Telefone</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-center align-middle font-medium text-muted-foreground">Ações</th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {loading ? (
                <tr className="border-b">
                  <td colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-lg font-medium">Carregando pacientes...</p>
                    </div>
                  </td>
                </tr>
              ) : pacientesFiltrados.length === 0 ? (
                <tr className="border-b">
                  <td colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground gap-2">
                      <Search className="mb-3 h-12 w-12 opacity-40" />
                      <p className="text-lg font-medium">
                        {pacientes.length === 0
                          ? 'Nenhum paciente cadastrado no sistema'
                          : 'Nenhum paciente encontrado'}
                      </p>
                      <p className="text-sm">
                        {pacientes.length === 0
                          ? 'Adicione pacientes clicando no botão "Adicionar Paciente" acima'
                          : 'Tente ajustar os filtros de busca'}
                      </p>
                      {pacientes.length === 0 && (
                        <p className="text-xs mt-2 text-muted-foreground/70">
                          (Verifique o console do navegador para mais detalhes)
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                pacientesFiltrados.map((pac) => (
                  <tr key={pac.id} className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {pac.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-foreground">{pac.nome}</span>
                      </div>
                    </td>
                    <td className="p-4 align-middle text-foreground">{pac.cpf || '-'}</td>
                    <td className="p-4 align-middle text-foreground">{pac.email}</td>
                    <td className="p-4 align-middle text-foreground">{pac.telefone || '-'}</td>
                    <td className="p-4 align-middle">
                      <Badge variant={pac.status ? 'default' : 'secondary'}>
                        {pac.status ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-emerald-700 hover:border-emerald-700"
                          onClick={() => console.log('Editar paciente:', pac.id)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-[var(--destructive)] hover:border-[var(--destructive)]"
                          onClick={() => handleDeleteClick(pac)}
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
              Tem certeza que deseja remover o paciente{' '}
              <span className="font-semibold text-foreground">
                {pacienteToDelete?.nome}
              </span>{' '}
              ({pacienteToDelete?.email})?
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
