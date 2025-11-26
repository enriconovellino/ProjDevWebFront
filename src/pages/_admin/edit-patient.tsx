import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useNavigate, useSearch, createFileRoute } from '@tanstack/react-router'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { userService } from '@/services/user.service'
import { handleApiError } from '@/services/api'
import type { User } from '@/types/user.types'

export const Route = createFileRoute('/_admin/edit-patient')({
  component: EditPatientPage,
  validateSearch: z.object({
    id: z.string().optional(),
  }),
})

type PatientFormData = {
  id?: string
  nome: string
  email: string
  cpf: string
  telefone: string
  status: boolean
}

// Schema de validação com Zod
const patientSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  telefone: z.string().min(10, 'Telefone inválido'),
  status: z.boolean(),
})

function EditPatientPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_admin/edit-patient' })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [paciente, setPaciente] = useState<User | null>(null)

  const [formData, setFormData] = useState<PatientFormData>({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    status: true,
  })

  // Carregar dados do paciente ao montar o componente
  useEffect(() => {
    const loadPatientData = async () => {
      if (!search.id) {
        navigate({ to: '/admin-painel-pacientes' })
        return
      }

      setIsLoadingData(true)
      try {
        const patientData = await userService.getById(search.id)
        if (patientData) {
          setPaciente(patientData)
          setFormData({
            id: patientData.id,
            nome: patientData.nome,
            email: patientData.email,
            cpf: patientData.cpf || '',
            telefone: patientData.telefone || '',
            status: patientData.status,
          })
        } else {
          setErrors({ general: 'Paciente não encontrado' })
        }
      } catch (err) {
        setErrors({ general: handleApiError(err) })
      } finally {
        setIsLoadingData(false)
      }
    }

    loadPatientData()
  }, [search.id, navigate])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement & { type: string }
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }
    
    // Limpar erro do campo quando o usuário digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setSuccessMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')
    setIsLoading(true)

    try {
      // Validar dados com Zod (excluindo o id)
      const validatedData = patientSchema.parse({
        nome: formData.nome,
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        status: formData.status,
      })

      // Atualizar paciente via API
      if (formData.id) {
        await userService.update(formData.id, {
          nome: validatedData.nome,
          email: validatedData.email,
          status: validatedData.status,
        })
      }

      setSuccessMessage('Paciente atualizado com sucesso!')

      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        navigate({ to: '/admin-painel-pacientes' })
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
        console.error('Erro ao salvar:', error)
        setErrors({ general: handleApiError(error) })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate({ to: '/admin-painel-pacientes' })
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
            Editar Paciente
          </h1>
          <p className="text-muted-foreground">
            Atualize os dados do paciente
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex justify-center w-full">
        {isLoadingData ? (
          <Card className="max-w-full w-full md:w-3/4 lg:w-1/2">
            <CardContent className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Carregando dados do paciente...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="max-w-full w-full md:w-3/4 lg:w-1/2">
            {errors.general && (
              <div className="border-b p-4 bg-red-50">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <p>{errors.general}</p>
                </div>
              </div>
            )}
            {successMessage && (
              <div className="border-b p-4 bg-green-50">
                <div className="flex items-center gap-2 text-green-700">
                  <p>{successMessage}</p>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Informações do Paciente</CardTitle>
                <CardDescription>
                  Edite os campos necessários e clique em salvar
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="nome">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="João da Silva"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className={`w-full ${errors.nome ? 'border-red-500' : ''}`}
                  />
                  {errors.nome && (
                    <p className="text-sm text-red-500">{errors.nome}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="joao@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className={`w-full ${errors.email ? 'border-red-500' : ''}`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* CPF Field */}
                <div className="space-y-2">
                  <Label htmlFor="cpf">
                    CPF <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    type="text"
                    placeholder="123.456.789-00"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className={`w-full ${errors.cpf ? 'border-red-500' : ''}`}
                  />
                  {errors.cpf && (
                    <p className="text-sm text-red-500">{errors.cpf}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="telefone">
                    Telefone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    placeholder="(11) 9999-9999"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className={`w-full ${errors.telefone ? 'border-red-500' : ''}`}
                  />
                  {errors.telefone && (
                    <p className="text-sm text-red-500">{errors.telefone}</p>
                  )}
                </div>

                {/* Status Field */}
                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2 cursor-pointer">
                    <input
                      id="status"
                      name="status"
                      type="checkbox"
                      checked={formData.status}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="h-4 w-4"
                    />
                    <span>Ativo</span>
                  </Label>
                </div>
              </CardContent>

              <CardFooter className="gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Salvar
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </main>
  )
}
