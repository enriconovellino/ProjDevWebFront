import { useState } from 'react'
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { medicoService } from '@/services/medico.service'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/add-doctor')({
  component: AddDoctorPage,
})

type DoctorFormData = {
  fullName: string
  crm: string
  specialty: string
  email: string
  phone: string
  cpf: string
  password: string
  confirmPassword: string
  duracao_minutos: number
  schedule: string
}



const scheduleOptions = [
  'Manhã (08:00 - 12:00)',
  'Tarde (13:00 - 17:00)',
  'Noite (18:00 - 22:00)',
  'Integral (08:00 - 17:00)',
  'Plantão 24h',
]

function AddDoctorPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: '',
    crm: '',
    specialty: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: '',
    duracao_minutos: 30,
    schedule: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duracao_minutos' ? parseInt(value) || 30 : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setIsLoading(true)

    try {
      await medicoService.create({
        email: formData.email,
        senha: formData.password,
        nome: formData.fullName,
        cpf: formData.cpf,
        telefone: formData.phone,
        crm: formData.crm,
        duracao_minutos: formData.duracao_minutos,
      })

      toast.success('Médico cadastrado com sucesso!')
      navigate({ to: '/admin-painel' })
    } catch (error: any) {
      console.error('Erro ao criar médico:', error)
      toast.error(error?.response?.data?.message || 'Erro ao cadastrar médico. Tente novamente.')
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
            Adicionar Médico
          </h1>
          <p className="text-muted-foreground">
            Preencha os dados para cadastrar um novo profissional de saúde
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
                Todos os campos são obrigatórios para o cadastro
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Full Name Field */}
              <div className="space-y-2">
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Nome Completo
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Dr. João Silva"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              {/* CRM Field */}
              <div className="space-y-2">
                <label
                  htmlFor="crm"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  CRM
                </label>
                <Input
                  id="crm"
                  name="crm"
                  type="text"
                  placeholder="12345-SP"
                  value={formData.crm}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Formato: 12345-UF (número seguido de hífen e estado)
                </p>
              </div>

              {/* Specialty Field */}
              <div className="space-y-2">
                <label
                  htmlFor="specialty"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Especialidade

                  <Input
                  id="specialty"
                  name="specialty"
                  type="text"
                  placeholder="Cardiologia"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
                </label>
                
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="joao.silva@exemplo.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              {/* CPF Field */}
              <div className="space-y-2">
                <label
                  htmlFor="cpf"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  CPF
                </label>
                <Input
                  id="cpf"
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  value={formData.cpf}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Formato: 000.000.000-00
                </p>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Telefone
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(11) 98765-4321"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Senha
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Mínimo de 6 caracteres
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Confirmar Senha
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="********"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                  className="w-full"
                />
              </div>

              {/* Duration Field */}
              <div className="space-y-2">
                <label
                  htmlFor="duracao_minutos"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Duração das Consultas (minutos)
                </label>
                <Input
                  id="duracao_minutos"
                  name="duracao_minutos"
                  type="number"
                  min="15"
                  step="15"
                  placeholder="30"
                  value={formData.duracao_minutos}
                  onChange={handleInputChange}
                  required
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Tempo padrão de cada consulta (15, 30, 45, 60 minutos)
                </p>
              </div>

              {/* Availability Section */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4">Disponibilidade</h3>

                {/* Schedule Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="schedule"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Horário de Atendimento
                  </label>
                  <select
                    id="schedule"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    required
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Selecione um horário</option>
                    {scheduleOptions.map(schedule => (
                      <option key={schedule} value={schedule}>
                        {schedule}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
                    Cadastrando...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Adicionar Médico
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
