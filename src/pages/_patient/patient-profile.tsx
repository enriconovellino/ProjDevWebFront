import { createFileRoute } from '@tanstack/react-router'
import { Mail, Phone, MapPin, Edit2, Save, X, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'

export const Route = createFileRoute('/_patient/patient-profile')({
  component: PatientProfile,
})

function PatientProfile() {
  const { user, setUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    endereco: '',
    dataNascimento: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        cpf: user.cpf || '',
        endereco: user.endereco || '',
        dataNascimento: user.dataNascimento || '',
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      const updatedUser = await authService.updatePerfil({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        endereco: formData.endereco,
        dataNascimento: formData.dataNascimento,
      })
      setUser(updatedUser)
      setIsEditing(false)
      toast.success('Perfil atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      toast.error('Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        telefone: user.telefone || '',
        cpf: user.cpf || '',
        endereco: user.endereco || '',
        dataNascimento: user.dataNascimento || '',
      })
    }
    setIsEditing(false)
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Meu Perfil
            </h1>
            <p className="text-muted-foreground mt-2">
              Gerencie suas informações pessoais
            </p>
          </div>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Editar
            </Button>
          )}
        </div>

        {/* Avatar e Informações Principais */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Atualize seus dados pessoais
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {formData.nome.split(' ').map(n => n[0]).join('').slice(0, 2) || 'PA'}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button variant="outline" size="sm" disabled>
                    Alterar Foto
                  </Button>
                )}
              </div>

              <div className="flex-1 space-y-6">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo</Label>
                      <Input
                        id="nome"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="mt-2"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                      <Input
                        id="dataNascimento"
                        name="dataNascimento"
                        type="date"
                        value={formData.dataNascimento}
                        onChange={handleInputChange}
                        className="mt-2"
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        name="cpf"
                        value={formData.cpf}
                        onChange={handleInputChange}
                        className="mt-2"
                        disabled
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-semibold text-foreground">{formData.nome || 'Não informado'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                      <p className="font-semibold text-foreground">
                        {formData.dataNascimento ? new Date(formData.dataNascimento).toLocaleDateString('pt-BR') : 'Não informado'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CPF</p>
                      <p className="font-semibold text-foreground">{formData.cpf || 'Não informado'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contato */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Contato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-2"
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      className="mt-2"
                      placeholder="(00) 00000-0000"
                      disabled={loading}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      className="mt-2"
                      disabled={loading}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-semibold text-foreground">{formData.email || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-semibold text-foreground">{formData.telefone || 'Não informado'}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p className="font-semibold text-foreground">{formData.endereco || 'Não informado'}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        {isEditing && (
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="gap-2"
              disabled={loading}
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
