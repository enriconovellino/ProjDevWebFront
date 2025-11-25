import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { z } from 'zod'
import { Save, Loader2, UserPlus, RefreshCw } from 'lucide-react'
import { userService } from '@/services/user.service'
import type { User as APIUser, UserPermissions } from '@/types/user.types'

export const Route = createFileRoute('/_admin/settings-adm')({
  component: RouteComponent,
})

// Schema de validação com Zod
const clinicSettingsSchema = z.object({
  clinicName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  address: z.string().min(5, 'Endereço deve ter no mínimo 5 caracteres'),
  phone: z.string().min(10, 'Telefone inválido'),
  email: z.string().email('Email inválido'),
  description: z.string().optional(),
  openingHours: z.string().optional(),
})

type ClinicSettingsFormData = z.infer<typeof clinicSettingsSchema>

function RouteComponent() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ClinicSettingsFormData>({
    clinicName: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    openingHours: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Estado para gerenciamento de usuários
  const [users, setUsers] = useState<APIUser[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState('')

  // Carrega usuários ao montar o componente
  useEffect(() => {
    loadUsers()
  }, [])

  // Limpa mensagens de erro após 5 segundos
  useEffect(() => {
    if (usersError) {
      const timer = setTimeout(() => {
        setUsersError('')
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [usersError])

  const loadUsers = async () => {
    try {
      setUsersLoading(true)
      setUsersError('')
      const usersData = await userService.list()
      setUsers(usersData)
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      setUsersError('Erro ao carregar a lista de usuários. Tente novamente.')
    } finally {
      setUsersLoading(false)
    }
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setSuccessMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')
    setIsLoading(true)

    try {
      // Valida os dados com Zod
      const validatedData = clinicSettingsSchema.parse(formData)

      // Simulando uma chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('Dados válidos:', validatedData)
      setSuccessMessage('Configurações salvas com sucesso!')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        console.error('Erro ao salvar:', error)
        setErrors({ general: 'Erro ao salvar as configurações' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Funções de gerenciamento de usuários
  const handleToggleUserStatus = async (userId: string) => {
    try {
      const user = users.find((u) => u.id === userId)
      if (!user) return

      const newStatus = !user.status

      // Atualiza no backend
      await userService.updateStatus(userId, newStatus)

      // Atualiza localmente após sucesso
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, status: newStatus } : u
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      setUsersError('Erro ao atualizar status do usuário. Tente novamente.')
    }
  }

  const handleTogglePermission = async (
    userId: string,
    permission: keyof UserPermissions
  ) => {
    try {
      const user = users.find((u) => u.id === userId)
      if (!user) return

      const updatedPermissions = {
        ...user.permissions,
        [permission]: !user.permissions[permission],
      }

      // Atualiza no backend
      await userService.updatePermissions(userId, { permissions: updatedPermissions })

      // Atualiza localmente após sucesso
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId
            ? { ...u, permissions: updatedPermissions }
            : u
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error)
      setUsersError('Erro ao atualizar permissões do usuário. Tente novamente.')
    }
  }

  // Função auxiliar para traduzir cargos
  const translateCargo = (cargo: string): string => {
    const translations: Record<string, string> = {
      'ADMIN': 'Administrador',
      'MEDICO': 'Médico',
      'PACIENTE': 'Paciente',
    }
    return translations[cargo] || cargo
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card className="flex flex-col mx-20">
        <CardHeader className="pb-3">
          <h2 className="text-2xl font-semibold">Configurações Administrativas</h2>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="mb-4 bg-[var(--secondary)]/20">
              <TabsTrigger value="general">Geral</TabsTrigger>
              <TabsTrigger value="advanced">
                Gerenciamento de Usuários
              </TabsTrigger>
            </TabsList>

            <TabsContent value="advanced">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-lg">Gerenciamento de Usuários</h2>
                  <Button onClick={() => navigate({ to: '/add-user' })}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Usuário
                  </Button>
                </div>

                {usersError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
                    <p className="text-sm text-red-600">{usersError}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadUsers}
                      disabled={usersLoading}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Tentar novamente
                    </Button>
                  </div>
                )}

                {usersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground">Carregando usuários...</p>
                    </div>
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12 border rounded-lg bg-muted/20">
                    <p className="text-muted-foreground">Nenhum usuário encontrado.</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Nome</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Cargo</TableHead>
                        <TableHead className="font-semibold text-center">
                          Status
                        </TableHead>
                        <TableHead className="font-semibold">Permissões</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.nome}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {user.email}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{translateCargo(user.cargo)}</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Switch
                                checked={user.status}
                                onCheckedChange={() =>
                                  handleToggleUserStatus(user.id)
                                }
                              />
                              <span
                                className={`text-sm font-medium ${
                                  user.status
                                    ? 'text-green-600'
                                    : 'text-gray-400'
                                }`}
                              >
                                {user.status ? 'Ativo' : 'Inativo'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`${user.id}-gerenciar-pacientes`}
                                  checked={user.permissions.gerenciarPacientes}
                                  onCheckedChange={() =>
                                    handleTogglePermission(
                                      user.id,
                                      'gerenciarPacientes'
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`${user.id}-gerenciar-pacientes`}
                                  className="text-sm cursor-pointer"
                                >
                                  Gerenciar pacientes
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`${user.id}-agendar-consultas`}
                                  checked={user.permissions.agendarConsultas}
                                  onCheckedChange={() =>
                                    handleTogglePermission(
                                      user.id,
                                      'agendarConsultas'
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`${user.id}-agendar-consultas`}
                                  className="text-sm cursor-pointer"
                                >
                                  Agendar consultas
                                </label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`${user.id}-acessar-relatorios`}
                                  checked={user.permissions.acessarRelatorios}
                                  onCheckedChange={() =>
                                    handleTogglePermission(
                                      user.id,
                                      'acessarRelatorios'
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`${user.id}-acessar-relatorios`}
                                  className="text-sm cursor-pointer"
                                >
                                  Acessar relatórios
                                </label>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="general">
              <h2 className="font-bold text-lg mb-6">Informações da Clínica</h2>

              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="w-full">
                  <label
                    htmlFor="clinicName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2"
                  >
                    Nome da Clínica <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="clinicName"
                    name="clinicName"
                    value={formData.clinicName}
                    onChange={handleInputChange}
                    placeholder="Digite o nome da clínica"
                    className={errors.clinicName ? 'border-red-500' : ''}
                  />
                  {errors.clinicName && (
                    <p className="text-sm text-red-500 mt-1">{errors.clinicName}</p>
                  )}
                </div>

                {/* Email */}
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contato@clinica.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Telefone */}
                <div className="w-full">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2"
                  >
                    Telefone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(00) 00000-0000"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Endereço */}
                <div className="w-full">
                  <label
                    htmlFor="address"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2"
                  >
                    Endereço <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Rua, número, bairro, cidade - UF"
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && (
                    <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                  )}
                </div>

                {/* Horário de Funcionamento */}
                <div className="w-full">
                  <label
                    htmlFor="openingHours"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2"
                  >
                    Horário de Funcionamento
                  </label>
                  <Input
                    id="openingHours"
                    name="openingHours"
                    value={formData.openingHours}
                    onChange={handleInputChange}
                    placeholder="Seg-Sex: 08:00-18:00"
                  />
                </div>

                {/* Descrição */}
                <div className="w-full">
                  <label
                    htmlFor="description"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2"
                  >
                    Descrição
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Breve descrição da clínica..."
                    rows={4}
                  />
                </div>

                {/* Mensagens de erro geral e sucesso */}
                {errors.general && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-600">{successMessage}</p>
                  </div>
                )}

                {/* Botões de Ação */}
                <CardFooter className="flex justify-end gap-4 px-0 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        clinicName: '',
                        address: '',
                        phone: '',
                        email: '',
                        description: '',
                        openingHours: '',
                      })
                      setErrors({})
                      setSuccessMessage('')
                    }}
                    disabled={isLoading}
                  >
                    Limpar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Configurações
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}
