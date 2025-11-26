# Layout de Perfil - Médico

Este documento descreve o layout da página de perfil para usuários do tipo **Médico**.

## Dados do Perfil (Médico)

```typescript
const [profileData, setProfileData] = useState<ProfileFormData>({
  fullName: 'Dr. Ricardo Almeida',
  email: 'ricardo.almeida@vitalis.com',
  phone: '(11) 98765-4321',
  address: 'Rua das Flores, 123 - São Paulo, SP',
  role: 'Médico',
  department: 'Cardiologia',
})
```

## Informações Adicionais (Médico)

```typescript
const userInfo = {
  memberSince: 'Janeiro 2023',
  permissions: [
    'Gerenciar Pacientes',
    'Agendar Consultas',
    'Acessar Relatórios'
  ],
  status: 'Ativo',
}
```

## Estrutura da Página

### 1. Header com Avatar
- Avatar 128x128px editável (clique para trocar foto)
- Nome completo: **Dr. Ricardo Almeida**
- Cargo e Departamento: **Médico - Cardiologia**
- Email: ricardo.almeida@vitalis.com
- Telefone: (11) 98765-4321
- Badge: Membro desde Janeiro 2023
- Badge: Status Ativo

### 2. Três Abas de Configuração

#### Aba 1: Informações Pessoais
Campos editáveis:
- **Nome Completo*** (obrigatório, mínimo 3 caracteres)
- **Email*** (obrigatório, validação de email)
- **Telefone*** (obrigatório, mínimo 10 caracteres)
- **Endereço** (opcional)
- **Cargo** (desabilitado - apenas admin pode alterar)
- **Departamento** (desabilitado - apenas admin pode alterar)

Ícones nos campos:
- User icon no Nome
- Mail icon no Email
- Phone icon no Telefone
- MapPin icon no Endereço

Botões:
- Cancelar (variant: outline)
- Salvar Alterações (com ícone Save)

#### Aba 2: Segurança
Campos para alteração de senha:
- **Senha Atual*** (obrigatório, mínimo 6 caracteres)
- **Nova Senha*** (obrigatório, mínimo 6 caracteres)
- **Confirmar Nova Senha*** (obrigatório, deve coincidir com nova senha)

Validação:
- Confirmação de senha deve ser igual à nova senha
- Mensagens de erro específicas por campo

Botões:
- Cancelar (limpa os campos)
- Alterar Senha (com ícone Save)

#### Aba 3: Permissões
Lista de permissões do médico:
1. **Gerenciar Pacientes** - Badge: Ativo
2. **Agendar Consultas** - Badge: Ativo
3. **Acessar Relatórios** - Badge: Ativo

Visual:
- Ícone Shield ao lado de cada permissão
- Fundo cinza claro (muted/30)
- Border arredondada
- Badge secundário indicando "Ativo"

Nota informativa:
> As permissões são gerenciadas pelo administrador do sistema. Se você precisa de acesso adicional, entre em contato com a equipe de administração.

## Validação com Zod

### Schema de Perfil
```typescript
const profileSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  address: z.string().optional(),
  role: z.string().optional(),
  department: z.string().optional(),
})
```

### Schema de Senha
```typescript
const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  newPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})
```

## Componentes Utilizados

### Shadcn UI
- Card, CardContent, CardHeader, CardTitle
- Input
- Button
- Avatar, AvatarFallback, AvatarImage
- Tabs, TabsContent, TabsList, TabsTrigger
- Label
- Badge

### Ícones Lucide React
- Save
- Loader2
- Camera
- Mail
- Phone
- MapPin
- Calendar
- User
- Briefcase
- Shield

## Estados da Aplicação

```typescript
const [profileData, setProfileData] = useState<ProfileFormData>({...})
const [passwordData, setPasswordData] = useState<PasswordFormData>({...})
const [profileErrors, setProfileErrors] = useState<Record<string, string>>({})
const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({})
const [isLoadingProfile, setIsLoadingProfile] = useState(false)
const [isLoadingPassword, setIsLoadingPassword] = useState(false)
const [successMessage, setSuccessMessage] = useState('')
const [avatarUrl, setAvatarUrl] = useState('https://github.com/shadcn.png')
```

## Funcionalidades

1. **Upload de Avatar**: Hover no avatar mostra ícone de câmera
2. **Validação em Tempo Real**: Erros desaparecem ao digitar
3. **Mensagens de Sucesso/Erro**: Exibidas abaixo dos formulários
4. **Loading States**: Botões mostram spinner durante carregamento
5. **Design Responsivo**: Grid adapta para mobile/desktop
6. **Campos Desabilitados**: Cargo e departamento só podem ser alterados por admin

## Rota

- **Arquivo**: `src/pages/_admin/profile.tsx`
- **URL**: `/profile`
- **Acesso**: Via dropdown menu no avatar da navbar

## Navegação

1. Usuário clica no avatar no canto superior direito da navbar
2. Dropdown menu aparece com opções
3. Usuário clica em "Perfil" (ícone: CircleUserRound)
4. Sistema navega para `/profile`
5. Página de perfil é renderizada com dados do médico

---

**Nota**: Este layout é específico para usuários com role "Médico". Para outros roles (Administrador, Recepcionista, etc.), as permissões e alguns campos podem variar.
