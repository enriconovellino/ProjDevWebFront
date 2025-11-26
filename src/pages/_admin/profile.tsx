import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { authService } from '@/services/auth.service'
import {
  Save,
  Loader2,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Briefcase,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react'

export const Route = createFileRoute('/_admin/profile')({
  component: RouteComponent,
})

// Schema de validação com Zod
const profileSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  newPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

function RouteComponent() {
  const { user } = useAuth()

  // Estado para dados do perfil
  const [profileData, setProfileData] = useState<ProfileFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    role: '',
    department: '',
  })

  // Carrega dados do usuário logado
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.nome || '',
        email: user.email || '',
        phone: '', // Adicione este campo no tipo Usuario se necessário
        address: '',
        role: user.perfil === 'ADMIN' ? 'Administrador' : user.perfil === 'MEDICO' ? 'Médico' : 'Paciente',
        department: user.perfil === 'ADMIN' ? 'Gestão' : user.perfil === 'MEDICO' ? 'Medicina' : 'Paciente',
      })
    }
  }, [user])

  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('https://github.com/shadcn.png')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Informações adicionais do usuário
  const userInfo = {
    memberSince: user?.criado_em ? new Date(user.criado_em).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) : 'N/A',
    permissions: user?.perfil === 'ADMIN'
      ? ['Gerenciar Pacientes', 'Gerenciar Médicos', 'Agendar Consultas', 'Configurações do Sistema', 'Gerenciar Usuários']
      : user?.perfil === 'MEDICO'
      ? ['Visualizar Pacientes', 'Agendar Consultas', 'Gerenciar Prontuários', 'Visualizar Agenda']
      : ['Agendar Consultas', 'Visualizar Consultas', 'Visualizar Prontuário'],
    status: user?.ativo ? 'Ativo' : 'Inativo',
  }

  const handleProfileInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setSuccessMessage('')
  }

  const handlePasswordInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }))
    }
    setSuccessMessage('')
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileErrors({})
    setSuccessMessage('')
    setIsLoadingProfile(true)

    try {
      const validatedData = profileSchema.parse(profileData)

      // Chama a API para atualizar o perfil
      await authService.updatePerfil({
        nome: validatedData.fullName,
        email: validatedData.email,
      })

      setSuccessMessage('Perfil atualizado com sucesso!')

      // Recarrega o perfil atualizado
      const updatedUser = await authService.getPerfil()
      if (updatedUser) {
        authService.saveAuth(authService.getToken() || '', updatedUser)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message
          }
        })
        setProfileErrors(fieldErrors)
      } else {
        console.error('Erro ao salvar:', error)
        setProfileErrors({ general: 'Erro ao atualizar o perfil. Verifique sua conexão e tente novamente.' })
      }
    } finally {
      setIsLoadingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordErrors({})
    setSuccessMessage('')
    setIsLoadingPassword(true)

    try {
      const validatedData = passwordSchema.parse(passwordData)

      // Chama a API para alterar a senha
      await authService.changePassword(
        validatedData.currentPassword,
        validatedData.newPassword
      )

      setSuccessMessage('Senha alterada com sucesso!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message
          }
        })
        setPasswordErrors(fieldErrors)
      } else if (error instanceof Error && error.message === 'Senha atual incorreta') {
        setPasswordErrors({ currentPassword: 'Senha atual está incorreta' })
      } else {
        console.error('Erro ao alterar senha:', error)
        setPasswordErrors({ general: 'Erro ao alterar a senha. Tente novamente.' })
      }
    } finally {
      setIsLoadingPassword(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Guard de loading
  if (!user) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Carregando dados do perfil...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header com Avatar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative group">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={avatarUrl} alt={profileData.fullName} />
                  <AvatarFallback className="text-2xl">
                    {profileData.fullName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-8 w-8 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">{profileData.fullName}</h1>
                  <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2 mt-1">
                    <Briefcase className="h-4 w-4" />
                    {profileData.role} - {profileData.department}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profileData.phone}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary" className="gap-1">
                    <Calendar className="h-3 w-3" />
                    Membro desde {userInfo.memberSince}
                  </Badge>
                  <Badge variant="outline" className="gap-1 border-green-500 text-green-600">
                    <Shield className="h-3 w-3" />
                    {userInfo.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs para editar perfil e senha */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações do Perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-[var(--secondary)]/20">
                <TabsTrigger value="profile">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
                <TabsTrigger value="permissions">Permissões</TabsTrigger>
              </TabsList>

              {/* Tab de Informações Pessoais */}
              <TabsContent value="profile">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nome Completo */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Nome Completo <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleProfileInputChange}
                          placeholder="Digite seu nome completo"
                          className={`pl-10 ${profileErrors.fullName ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {profileErrors.fullName && (
                        <p className="text-sm text-red-500">{profileErrors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleProfileInputChange}
                          placeholder="seu.email@exemplo.com"
                          className={`pl-10 ${profileErrors.email ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {profileErrors.email && (
                        <p className="text-sm text-red-500">{profileErrors.email}</p>
                      )}
                    </div>

                    {/* Telefone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Telefone <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileInputChange}
                          placeholder="(00) 00000-0000"
                          className={`pl-10 ${profileErrors.phone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {profileErrors.phone && (
                        <p className="text-sm text-red-500">{profileErrors.phone}</p>
                      )}
                    </div>

                    {/* Endereço */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Endereço</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileInputChange}
                          placeholder="Rua, número, cidade - UF"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Cargo */}
                    <div className="space-y-2">
                      <Label htmlFor="role">Cargo</Label>
                      <Input
                        id="role"
                        name="role"
                        value={profileData.role}
                        onChange={handleProfileInputChange}
                        placeholder="Seu cargo"
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground">
                        Entre em contato com o administrador para alterar
                      </p>
                    </div>

                    
                  </div>

                  {/* Mensagens de erro e sucesso */}
                  {profileErrors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{profileErrors.general}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-600">{successMessage}</p>
                    </div>
                  )}

                  {/* Botões */}
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => window.location.reload()}
                      disabled={isLoadingProfile}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoadingProfile}>
                      {isLoadingProfile ? (
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
                  </div>
                </form>
              </TabsContent>

              {/* Tab de Segurança */}
              <TabsContent value="security">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">
                        Senha Atual <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordInputChange}
                          placeholder="Digite sua senha atual"
                          className={`pr-10 ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.currentPassword && (
                        <p className="text-sm text-red-500">
                          {passwordErrors.currentPassword}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">
                        Nova Senha <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={handlePasswordInputChange}
                          placeholder="Digite sua nova senha"
                          className={`pr-10 ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirmar Nova Senha <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordInputChange}
                          placeholder="Confirme sua nova senha"
                          className={`pr-10 ${passwordErrors.confirmPassword ? 'border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mensagens de erro e sucesso */}
                  {passwordErrors.general && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{passwordErrors.general}</p>
                    </div>
                  )}

                  {successMessage && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-600">{successMessage}</p>
                    </div>
                  )}

                  {/* Botões */}
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      })}
                      disabled={isLoadingPassword}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isLoadingPassword}>
                      {isLoadingPassword ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Alterando...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Alterar Senha
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Tab de Permissões */}
              <TabsContent value="permissions">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Suas Permissões</h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Estas são as permissões atribuídas à sua conta. Para alterá-las, entre em
                      contato com o administrador do sistema.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {userInfo.permissions.map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <Shield className="h-5 w-5 text-primary" />
                          <span className="font-medium">{permission}</span>
                        </div>
                        <Badge variant="secondary">Ativo</Badge>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Nota:</strong> As permissões são gerenciadas pelo administrador do
                      sistema. Se você precisa de acesso adicional, entre em contato com a equipe
                      de administração.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
