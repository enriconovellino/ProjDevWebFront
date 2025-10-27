import { useState } from 'react'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/add-doctor')({
  component: AddDoctorPage,
})

type DoctorFormData = {
  fullName: string
  crm: string
  specialty: string
  email: string
  phone: string
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
  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: '',
    crm: '',
    specialty: '',
    email: '',
    phone: '',
    schedule: '',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você adicionaria a lógica para salvar o médico
    console.log('Doctor data:', formData)

    // Após salvar com sucesso, redireciona para a página de listagem
    navigate({ to: '/admin-painel' })
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
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Médico
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  )
}
