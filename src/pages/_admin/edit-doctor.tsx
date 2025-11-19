import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { Label } from '@/components/ui/label'
import { z } from 'zod'

export const Route = createFileRoute('/_admin/edit-doctor')({
  component: EditDoctorPage,
  validateSearch: z.object({
    crm: z.string().optional(),
  }),
})

type DoctorFormData = {
  fullName: string
  crm: string
  specialty: string
  email: string
  phone: string
  schedule: string
}

// Schema de validação com Zod
const doctorSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  crm: z.string().min(5, 'CRM inválido'),
  specialty: z.string().min(3, 'Especialidade deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  schedule: z.string().min(1, 'Selecione um horário'),
})

const scheduleOptions = [
  'Manhã (08:00 - 12:00)',
  'Tarde (13:00 - 17:00)',
  'Noite (18:00 - 22:00)',
  'Integral (08:00 - 17:00)',
  'Plantão 24h',
]

// Dados mockados dos médicos (em produção, viriam da API)
const medicosData: Record<string, DoctorFormData> = {
  '12345-SP': {
    fullName: 'Dr. Carlos Silva',
    crm: '12345-SP',
    specialty: 'Cardiologia',
    email: 'carlos.silva@vitalis.com',
    phone: '(11) 98765-4321',
    schedule: 'Manhã (08:00 - 12:00)',
  },
  '23456-RJ': {
    fullName: 'Dra. Ana Paula Santos',
    crm: '23456-RJ',
    specialty: 'Pediatria',
    email: 'ana.santos@vitalis.com',
    phone: '(21) 97654-3210',
    schedule: 'Tarde (13:00 - 17:00)',
  },
  '34567-MG': {
    fullName: 'Dr. Roberto Oliveira',
    crm: '34567-MG',
    specialty: 'Ortopedia',
    email: 'roberto.oliveira@vitalis.com',
    phone: '(31) 96543-2109',
    schedule: 'Noite (18:00 - 22:00)',
  },
  '45678-SP': {
    fullName: 'Dra. Mariana Costa',
    crm: '45678-SP',
    specialty: 'Dermatologia',
    email: 'mariana.costa@vitalis.com',
    phone: '(11) 95432-1098',
    schedule: 'Integral (08:00 - 17:00)',
  },
  '56789-RS': {
    fullName: 'Dr. Fernando Alves',
    crm: '56789-RS',
    specialty: 'Neurologia',
    email: 'fernando.alves@vitalis.com',
    phone: '(51) 94321-0987',
    schedule: 'Plantão 24h',
  },
  '67890-BA': {
    fullName: 'Dra. Juliana Mendes',
    crm: '67890-BA',
    specialty: 'Ginecologia',
    email: 'juliana.mendes@vitalis.com',
    phone: '(71) 93210-9876',
    schedule: 'Manhã (08:00 - 12:00)',
  },
  '78901-PR': {
    fullName: 'Dr. Paulo Ricardo',
    crm: '78901-PR',
    specialty: 'Oftalmologia',
    email: 'paulo.ricardo@vitalis.com',
    phone: '(41) 92109-8765',
    schedule: 'Tarde (13:00 - 17:00)',
  },
  '89012-SC': {
    fullName: 'Dra. Beatriz Lima',
    crm: '89012-SC',
    specialty: 'Psiquiatria',
    email: 'beatriz.lima@vitalis.com',
    phone: '(48) 91098-7654',
    schedule: 'Noite (18:00 - 22:00)',
  },
}

function EditDoctorPage() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_admin/edit-doctor' })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: '',
    crm: '',
    specialty: '',
    email: '',
    phone: '',
    schedule: '',
  })

  // Carregar dados do médico ao montar o componente
  useEffect(() => {
    if (search.crm && medicosData[search.crm]) {
      setFormData(medicosData[search.crm])
    } else if (search.crm) {
      // Se o CRM foi passado mas não foi encontrado
      console.error('Médico não encontrado')
      navigate({ to: '/admin-painel' })
    }
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
      // Validar dados com Zod
      const validatedData = doctorSchema.parse(formData)

      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log('Dados do médico atualizados:', validatedData)
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
        setErrors({ general: 'Erro ao atualizar os dados do médico' })
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
        <Card className="max-w-full w-full md:w-3/4 lg:w-1/2">
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

              {/* Specialty Field */}
              <div className="space-y-2">
                <Label htmlFor="specialty">
                  Especialidade <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="specialty"
                  name="specialty"
                  type="text"
                  placeholder="Cardiologia"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  required
                  className={`w-full ${errors.specialty ? 'border-red-500' : ''}`}
                />
                {errors.specialty && (
                  <p className="text-sm text-red-500">{errors.specialty}</p>
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
                  placeholder="joao.silva@exemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
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
                  className={`w-full ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Availability Section */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Disponibilidade</h3>

                {/* Schedule Field */}
                <div className="space-y-2">
                  <Label htmlFor="schedule">
                    Horário de Atendimento <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="schedule"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    required
                    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.schedule ? 'border-red-500' : ''}`}
                  >
                    <option value="">Selecione um horário</option>
                    {scheduleOptions.map(schedule => (
                      <option key={schedule} value={schedule}>
                        {schedule}
                      </option>
                    ))}
                  </select>
                  {errors.schedule && (
                    <p className="text-sm text-red-500">{errors.schedule}</p>
                  )}
                </div>
              </div>

              {/* Mensagens de erro e sucesso */}
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
      </div>
    </main>
  )
}
