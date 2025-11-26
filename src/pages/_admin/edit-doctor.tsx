import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Loader2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { medicoService } from '@/services/medico.service'
import { handleApiError } from '@/services/api'
import type { Medico } from '@/types/medico.types'

export const Route = createFileRoute('/_admin/edit-doctor')({
  component: EditDoctorPage,
  validateSearch: z.object({
    crm: z.string().optional(),
  }),
})

type DoctorFormData = {
  id?: number
  fullName: string
  crm: string
  email: string
  phone: string
  duracao_minutos: number
}

// Schema de validação com Zod
const doctorSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  crm: z.string().min(5, 'CRM inválido'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  duracao_minutos: z.number().min(5, 'Duração mínima de 5 minutos'),
})

function EditDoctorPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_admin/edit-doctor' })
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')
  const [medico, setMedico] = useState<Medico | null>(null)

  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: '',
    crm: '',
    email: '',
    phone: '',
    duracao_minutos: 30,
  })

  // Carregar dados do médico ao montar o componente
  useEffect(() => {
    const loadMedicoData = async () => {
      if (!search.crm) {
        navigate({ to: '/admin-painel' })
        return
      }

      setIsLoadingData(true)
      try {
        const medicoData = await medicoService.getByCrm(search.crm)
        if (medicoData) {
          setMedico(medicoData)
          setFormData({
            id: medicoData.id,
            fullName: medicoData.nome,
            crm: medicoData.crm,
            email: medicoData.usuario.email,
            phone: medicoData.telefone,
            duracao_minutos: medicoData.duracao_minutos,
          })
        } else {
          setErrors({ general: 'Médico não encontrado' })
        }
      } catch (err) {
        setErrors({ general: handleApiError(err) })
      } finally {
        setIsLoadingData(false)
      }
    }

    loadMedicoData()
  }, [search.crm, navigate])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
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
      const validatedData = doctorSchema.parse({
        fullName: formData.fullName,
        crm: formData.crm,
        email: formData.email,
        phone: formData.phone,
        duracao_minutos: formData.duracao_minutos,
      })

      // Atualizar médico via API
      if (formData.id) {
        await medicoService.update(formData.id, {
          nome: validatedData.fullName,
          email: validatedData.email,
          telefone: validatedData.phone,
          duracao_minutos: validatedData.duracao_minutos,
        })
      }

      setSuccessMessage('Médico atualizado com sucesso!')

      // Redirecionar após 1.5 segundos
      setTimeout(() => {
        navigate({ to: '/admin-painel' })
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
    navigate({ to: '/admin-painel' })
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
            Editar Médico
          </h1>
          <p className="text-muted-foreground">
            Atualize os dados do profissional de saúde
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
                <p className="text-muted-foreground">Carregando dados do médico...</p>
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
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Informações do Médico</CardTitle>
                <CardDescription>
                  Edite os campos necessários e clique em salvar
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Full Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="fullName">
                    Nome Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Dr. João Silva"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className={`w-full ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

                {/* CRM Field */}
                <div className="space-y-2">
                  <Label htmlFor="crm">
                    CRM <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="crm"
                    name="crm"
                    type="text"
                    placeholder="12345-SP"
                    value={formData.crm}
                    onChange={handleInputChange}
                    required
                    disabled
                    className="w-full bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground">
                    O CRM não pode ser alterado
                  </p>
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
                    placeholder="joao.silva@exemplo.com"
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

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Telefone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(11) 98765-4321"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className={`w-full ${errors.phone ? 'border-red-500' : ''}`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Duration Field */}
                <div className="space-y-2">
                  <Label htmlFor="duracao_minutos">
                    Duração de Atendimento (minutos) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="duracao_minutos"
                    name="duracao_minutos"
                    type="number"
                    min="5"
                    step="5"
                    placeholder="30"
                    value={formData.duracao_minutos}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                    className={`w-full ${errors.duracao_minutos ? 'border-red-500' : ''}`}
                  />
                  {errors.duracao_minutos && (
                    <p className="text-sm text-red-500">{errors.duracao_minutos}</p>
                  )}
                </div>

                {/* Mensagens de sucesso */}
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
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
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
