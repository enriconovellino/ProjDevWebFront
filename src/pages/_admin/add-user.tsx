import { useState } from 'react'
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { z } from 'zod'

export const Route = createFileRoute('/_admin/add-user')({
  component: AddUserPage,
})

// Schema de validação com Zod
const userSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cargo: z.string().min(1, 'Cargo é obrigatório'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmarSenha: z.string(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem',
  path: ['confirmarSenha'],
})

type UserFormData = {
  nome: string
  email: string
  cargo: string
  senha: string
  confirmarSenha: string
}

type UserPermissions = {
  gerenciarPacientes: boolean
  agendarConsultas: boolean
  acessarRelatorios: boolean
}

const cargoOptions = [
  'Administrador',
  'Médico',
  'Recepcionista',
  'Enfermeiro',
  'Auxiliar',
]

function AddUserPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    cargo: '',
    senha: '',
    confirmarSenha: '',
  })

  const [permissions, setPermissions] = useState<UserPermissions>({
    gerenciarPacientes: false,
    agendarConsultas: false,
    acessarRelatorios: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpa o erro do campo quando o usuário começa a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setSuccessMessage('')
  }

  const handlePermissionToggle = (permission: keyof UserPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')
    setIsLoading(true)

    try {
      // Valida os dados com Zod
      const validatedData = userSchema.parse(formData)

      // Simulando uma chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('Dados válidos:', {
        ...validatedData,
        permissions,
      })

      setSuccessMessage('Usuário cadastrado com sucesso!')

      // Aguarda um pouco para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate({ to: '/settings-adm' })
      }, 1500)
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
        console.error('Erro ao cadastrar:', error)
        setErrors({ general: 'Erro ao cadastrar o usuário' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/settings-adm' })
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Adicionar Usuário
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados para cadastrar um novo usuário no sistema
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex justify-center w-full">
        <Card className="max-w-full w-full md:w-3/4 lg:w-1/2">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Informações do Usuário</CardTitle>
              <CardDescription>
                Todos os campos marcados com * são obrigatórios
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Nome Completo Field */}
              <div className="space-y-2">
                <label
                  htmlFor="nome"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nome Completo <span className="text-red-500">*</span>
                </label>
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  placeholder="João da Silva"
                  value={formData.nome}
                  onChange={handleInputChange}
                  className={errors.nome ? 'border-red-500' : ''}
                />
                {errors.nome && (
                  <p className="text-sm text-red-500">{errors.nome}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao.silva@vitalis.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Cargo Field */}
              <div className="space-y-2">
                <label
                  htmlFor="cargo"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Cargo <span className="text-red-500">*</span>
                </label>
                <select
                  id="cargo"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleInputChange}
                  className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    errors.cargo ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Selecione um cargo</option>
                  {cargoOptions.map((cargo) => (
                    <option key={cargo} value={cargo}>
                      {cargo}
                    </option>
                  ))}
                </select>
                {errors.cargo && (
                  <p className="text-sm text-red-500">{errors.cargo}</p>
                )}
              </div>

              {/* Senha Field */}
              <div className="space-y-2">
                <label
                  htmlFor="senha"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Senha <span className="text-red-500">*</span>
                </label>
                <Input
                  id="senha"
                  name="senha"
                  type="password"
                  placeholder="••••••••"
                  value={formData.senha}
                  onChange={handleInputChange}
                  className={errors.senha ? 'border-red-500' : ''}
                />
                {errors.senha && (
                  <p className="text-sm text-red-500">{errors.senha}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Mínimo de 6 caracteres
                </p>
              </div>

              {/* Confirmar Senha Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmarSenha"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Confirmar Senha <span className="text-red-500">*</span>
                </label>
                <Input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmarSenha}
                  onChange={handleInputChange}
                  className={errors.confirmarSenha ? 'border-red-500' : ''}
                />
                {errors.confirmarSenha && (
                  <p className="text-sm text-red-500">{errors.confirmarSenha}</p>
                )}
              </div>

              {/* Permissões Section */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Permissões do Usuário</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                    <Checkbox
                      id="gerenciarPacientes"
                      checked={permissions.gerenciarPacientes}
                      onCheckedChange={() => handlePermissionToggle('gerenciarPacientes')}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="gerenciarPacientes"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Gerenciar Pacientes
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Permite adicionar, editar e visualizar informações de pacientes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                    <Checkbox
                      id="agendarConsultas"
                      checked={permissions.agendarConsultas}
                      onCheckedChange={() => handlePermissionToggle('agendarConsultas')}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="agendarConsultas"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Agendar Consultas
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Permite criar, editar e cancelar agendamentos
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg border bg-muted/50">
                    <Checkbox
                      id="acessarRelatorios"
                      checked={permissions.acessarRelatorios}
                      onCheckedChange={() => handlePermissionToggle('acessarRelatorios')}
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="acessarRelatorios"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Acessar Relatórios
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Permite visualizar e gerar relatórios do sistema
                      </p>
                    </div>
                  </div>
                </div>
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
            </CardContent>

            <CardFooter className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Usuário
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
