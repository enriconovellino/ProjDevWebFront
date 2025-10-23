# 📚 Guia de Desenvolvimento - Clinic Front

Bem-vindo ao projeto **Clinic Front**! Este guia foi criado para ajudar a equipe a continuar o desenvolvimento com as melhores práticas e padrões já estabelecidos no projeto.

## 📋 Índice

1. [Visão Geral do Projeto](#-visão-geral-do-projeto)
2. [Instalação e Configuração](#-instalação-e-configuração)
3. [Estrutura de Pastas](#-estrutura-de-pastas)
4. [Como Criar Componentes](#-como-criar-componentes)
5. [Como Criar Rotas](#-como-criar-rotas)
6. [Como Criar Páginas](#-como-criar-páginas)
7. [Usando Componentes do shadcn/ui](#-usando-componentes-do-shadcnui)
8. [Estilização com Tailwind CSS](#-estilização-com-tailwind-css)
9. [Gerenciamento de Estado](#-gerenciamento-de-estado)
10. [Integração com API](#-integração-com-api)
11. [Boas Práticas](#-boas-práticas)
12. [Scripts Disponíveis](#-scripts-disponíveis)

## 🎯 Visão Geral do Projeto

Este é um sistema de gerenciamento de clínica médica construído com tecnologias modernas:

- **React 19** - Framework JavaScript para UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultra-rápido
- **TanStack Router** - Roteamento type-safe
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes baseada em Radix UI
- **TanStack React Query** - Gerenciamento de estado do servidor
- **Zod** - Validação de esquemas
- **Axios** - Cliente HTTP

---

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação Inicial

```bash
# Clone o repositório
git clone <url-do-repositorio>

# Entre na pasta do projeto
cd clinic-front

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Instalação de Dependências Novas

```bash
# Instalar uma dependência de produção
npm install <nome-do-pacote>

# Instalar uma dependência de desenvolvimento
npm install -D <nome-do-pacote>

# Exemplo: Instalando uma biblioteca de datas
npm install date-fns
```

---

## 📁 Estrutura de Pastas

```
clinic-front/
├── src/
│   ├── main.tsx                    # Ponto de entrada da aplicação
│   │
│   ├── pages/                      # Sistema de rotas (file-based routing)
│   │   ├── __root.tsx              # Layout raiz (obrigatório)
│   │   ├── index.tsx               # Página inicial (/) - redireciona para /sign-in
│   │   ├── routeTree.gen.ts        # Árvore de rotas (gerado automaticamente - NÃO EDITAR)
│   │   │
│   │   ├── _auth.tsx               # Layout para rotas de autenticação
│   │   ├── _auth/
│   │   │   └── sign-in.tsx         # Rota /sign-in
│   │   │
│   │   ├── _admin.tsx              # Layout para rotas administrativas (com NavBar)
│   │   ├── _admin/
│   │   │   └── admin-painel.tsx    # Rota /admin-painel
│   │   │
│   │   └── _others/
│   │       └── not-found.tsx       # Página 404
│   │
│   ├── components/                 # Componentes reutilizáveis
│   │   ├── ui/                     # Componentes do shadcn/ui
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── input-group.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── separator.tsx
│   │   │   └── table.tsx
│   │   │
│   │   └── common/                 # Componentes compartilhados do projeto
│   │       ├── navbar/
│   │       │   └── NavBar.tsx
│   │       └── searchsection/
│   │           └── SearchSection.tsx
│   │
│   ├── lib/                        # Utilitários e helpers
│   │   └── utils.ts                # Função cn() para classes CSS
│   │
│   ├── styles/                     # Estilos globais
│   │   ├── index.css               # CSS global com variáveis Tailwind
│   │   └── App.css
│   │
│   ├── assets/                     # Recursos estáticos
│   │   ├── icons/
│   │   └── images/
│   │       └── logo2.svg
│   │
│   ├── hooks/                      # Custom React Hooks (criar conforme necessário)
│   │
│   └── services/                   # Serviços de API (criar conforme necessário)
│       └── api.ts                  # Configuração base do Axios
│
├── public/                         # Arquivos públicos estáticos
├── index.html                      # HTML principal
├── vite.config.ts                  # Configuração do Vite + TanStack Router Plugin
├── tsconfig.json                   # Configuração TypeScript
├── eslint.config.js                # Configuração ESLint
├── tailwind.config.js              # Configuração Tailwind CSS
├── components.json                 # Configuração shadcn/ui
└── package.json                    # Dependências e scripts
```

**Observações importantes:**
- 📁 `pages/` contém ROTAS (não componentes de página comuns)
- 🚫 `routeTree.gen.ts` é gerado automaticamente - **NUNCA EDITE MANUALMENTE**
- 🎨 Componentes UI ficam em `components/ui/` (shadcn/ui)
- 🧩 Componentes customizados ficam em `components/common/`
- 🔧 Utilitários e helpers ficam em `lib/`
- 🌐 Serviços de API ficam em `services/`

---

## 🧩 Como Criar Componentes

### 1. Componentes Simples (Sem UI do shadcn/ui)

Crie componentes personalizados em `src/components/common/`:

```bash
# Criar pasta para o componente
mkdir src/components/common/meu-componente
```

**Exemplo: `src/components/common/PatientCard/PatientCard.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PatientCardProps {
  name: string
  age: number
  phone: string
  onViewDetails?: () => void
}

export function PatientCard({ name, age, phone, onViewDetails }: PatientCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Idade: {age} anos</p>
        <p className="text-sm text-muted-foreground">Telefone: {phone}</p>
        {onViewDetails && (
          <Button onClick={onViewDetails} variant="outline" className="mt-4">
            Ver Detalhes
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
```

### 2. Componentes com Estado

**Exemplo: `src/components/common/SearchBar/SearchBar.tsx`**

```tsx
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = 'Buscar...' }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  )
}
```

### 3. Exportando Componentes

**Opção A: Export Direto (Recomendado)**
```tsx
export function MeuComponente() {
  // ...
}
```

**Opção B: Export com Index**

Crie um `index.ts` na pasta do componente:

```tsx
// src/components/common/PatientCard/index.ts
export { PatientCard } from './PatientCard'
```

Isso permite importar assim:
```tsx
import { PatientCard } from '@/components/common/PatientCard'
```

---

## 🛣️ Como Criar Rotas

O projeto usa **TanStack Router** com **file-based routing**. As rotas são criadas automaticamente com base na estrutura de arquivos em `src/pages/`.

### 📌 Como Funciona o File-Based Routing

- O plugin do TanStack Router no `vite.config.ts` gera automaticamente o arquivo `src/pages/routeTree.gen.ts` baseado nos arquivos em `src/pages/`
- **NÃO edite** o arquivo `routeTree.gen.ts` - ele é gerado automaticamente pelo plugin quando você inicia o servidor de desenvolvimento
- O nome do arquivo determina a rota (ex: `login.tsx` → `/login`)
- Todos os arquivos de rota devem exportar `export const Route` usando `createFileRoute()`
- O servidor de desenvolvimento regenera automaticamente as rotas quando você adiciona, remove ou modifica arquivos de rota

### ⚙️ Configuração do Plugin (vite.config.ts)

O plugin `@tanstack/router-plugin` está configurado no `vite.config.ts` com as seguintes opções:

```typescript
import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      routesDirectory: path.resolve(__dirname, './src/pages'),     // ✅ Diretório das rotas
      generatedRouteTree: path.resolve(__dirname, './src/pages/routeTree.gen.ts'),  // ✅ Onde gerar o arquivo
      routeFilePrefix: '',  // ✅ Sem prefixo nos nomes de arquivo
    }),
    react(),  // ✅ React plugin vem depois
    // outros plugins...
  ],
})
```

**IMPORTANTE:**
- A ordem dos plugins é crucial: TanStack Router deve vir **antes** do plugin React
- As rotas são geradas em `src/pages/` e não em `src/routes/`

### 📂 Estrutura Atual de Rotas

O projeto usa uma estrutura organizada com **layouts pathless** e **rotas agrupadas**:

```text
src/pages/
├── __root.tsx                    → Layout raiz (obrigatório)
├── index.tsx                     → / (página inicial - redireciona para /sign-in)
│
├── _auth/                        → Grupo de rotas de autenticação
│   ├── route.tsx                 → Layout pathless para autenticação
│   └── sign-in.tsx               → /sign-in (página de login)
│
├── _admin/                       → Grupo de rotas administrativas
│   ├── route.tsx                 → Layout pathless para admin (com NavBar)
│   └── admin-painel.tsx          → /admin-painel (painel administrativo)
│
└── _others/
    └── not-found.tsx             → Página 404
```

### 🎯 O que são Rotas Pathless (Layouts)?

**Rotas pathless** são layouts que não adicionam um segmento ao URL, mas envolvem suas rotas filhas com um layout comum.

### 📝 Convenções de Arquivos de Layout

O TanStack Router reconhece os seguintes nomes de arquivo para layouts:

| Nome do Arquivo | Descrição | Lazy Loading |
|-----------------|-----------|--------------|
| `route.tsx` | Layout normal | Não |
| `route.lazy.tsx` | Layout com lazy loading | Sim |

**IMPORTANTE:**
- ✅ Use `route.tsx` ou `route.lazy.tsx` dentro da pasta do layout
- ❌ NÃO use nomes personalizados como `layout.tsx`, `_admin.tsx` dentro da pasta
- ✅ **Recomendação:** Organize tudo dentro da pasta usando `route.tsx`

**Exemplo: Layout de Autenticação - `_auth/route.tsx`**
```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <>
      <div className='px-10 py-7'>
        <img src="/src/assets/images/logo2.svg" alt="Logo" className="h-8 w-auto" />
      </div>
      <Separator/>
      <Outlet /> {/* Renderiza as rotas filhas aqui */}
    </>
  )
}
```

**Exemplo: Layout com Lazy Loading - `_admin/route.lazy.tsx`**
```tsx
import { createLazyFileRoute, Outlet } from '@tanstack/react-router'
import { NavBar } from '@/components/common/navbar/NavBar'

export const Route = createLazyFileRoute('/_admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <Outlet />
    </div>
  )
}
```

**Como funciona:**
- A pasta `_auth/` agrupa todas as rotas relacionadas à autenticação
- O arquivo `_auth/route.tsx` é o layout pathless (prefixo `_` na pasta)
- Rotas dentro de `_auth/` (como `sign-in.tsx`) herdam esse layout
- A rota `_auth/sign-in.tsx` resulta no URL `/sign-in` (sem `/auth` no caminho)
- O layout renderiza o header com logo e o `<Outlet />` renderiza o conteúdo da página filha

**Vantagens dessa estrutura:**
- ✅ Tudo relacionado ao layout fica na mesma pasta
- ✅ Organização mais clara e intuitiva
- ✅ Facilita manutenção e navegação no código

### 🛠️ Como Criar uma Nova Rota

#### Passo 1: Decidir o Tipo de Rota

**Opção A: Rota Simples**
- Crie um arquivo diretamente em `src/pages/`
- Exemplo: `patients.tsx` → `/patients`

**Opção B: Rota com Layout**
- Adicione dentro de uma pasta de layout existente (`_auth/` ou `_admin/`)
- Exemplo: `_admin/patients.tsx` → `/patients` (com layout admin)

**Opção C: Criar Novo Grupo com Layout**
- Crie um layout pathless e sua pasta
- Exemplo: `_dashboard.tsx` + `_dashboard/overview.tsx`

#### Passo 2: Criar o Arquivo da Rota

**Exemplo 1: Rota Simples - Criar `/patients`**

Crie o arquivo `src/pages/_admin/patients.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_admin/patients')({
  component: PatientsPage,
})

function PatientsPage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Lista de pacientes...</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Exemplo 2: Rota de Autenticação - Criar `/register`**

Crie o arquivo `src/pages/_auth/register.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return (
    <div className='flex flex-col items-center justify-center m-7'>
      <h1 className='text-3xl font-bold'>Criar Conta</h1>
      <Card className='w-full max-w-md m-10 p-6'>
        <CardHeader>
          <CardTitle className='font-semibold text-2xl text-center'>
            Cadastro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <Input placeholder='Nome completo' />
            <Input type='email' placeholder='E-mail' />
            <Input type='password' placeholder='Senha' />
            <Button type="submit" className="w-full">
              Cadastrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Resultado:** A rota `/register` usará o layout de `_auth.tsx` (com logo e separator)

**Pronto!** O plugin detectará automaticamente o novo arquivo e atualizará `routeTree.gen.ts` quando você iniciar o servidor de desenvolvimento.

#### Passo 3: Navegação entre Rotas

Use o componente `Link` do TanStack Router para navegação:

```tsx
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

function Navigation() {
  return (
    <nav className="flex gap-4">
      <Link to="/" className="hover:underline">
        Início
      </Link>
      <Link to="/sign-in" className="hover:underline">
        Login
      </Link>
      <Link to="/patients" className="hover:underline">
        Pacientes
      </Link>
      <Link to="/admin-painel" className="hover:underline">
        Admin
      </Link>
    </nav>
  )
}

// Usando Link com Button
function ButtonLink() {
  return (
    <Link to="/sign-in">
      <Button>Fazer Login</Button>
    </Link>
  )
}
```

**Navegação Programática:**

```tsx
import { useNavigate } from '@tanstack/react-router'

function LoginForm() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    // ... lógica de login
    await login()

    // Navegar após login bem-sucedido
    navigate({ to: '/admin-painel' })
  }

  return <Button onClick={handleLogin}>Entrar</Button>
}
```

### 📦 Como Criar um Novo Layout Pathless

Layouts pathless permitem agrupar rotas com um layout comum sem adicionar segmento ao URL.

**Exemplo: Criar layout para área de dashboard**

**Passo 1:** Crie a pasta `src/pages/_dashboard/`

**Passo 2:** Crie o arquivo de layout `src/pages/_dashboard/route.tsx`:

```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { NavBar } from '@/components/common/navbar/NavBar'

export const Route = createFileRoute('/_dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <aside className="w-64 bg-muted p-4">
        {/* Sidebar aqui */}
      </aside>
      <main className="flex-1 p-6">
        <Outlet /> {/* Rotas filhas renderizam aqui */}
      </main>
    </div>
  )
}
```

**Passo 3:** Adicione rotas filhas dentro da mesma pasta:

`src/pages/_dashboard/overview.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/overview')({
  component: OverviewPage,
})

function OverviewPage() {
  return <h1>Overview Dashboard</h1>
}
```

`src/pages/_dashboard/analytics.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/analytics')({
  component: AnalyticsPage,
})

function AnalyticsPage() {
  return <h1>Analytics Dashboard</h1>
}
```

**Estrutura final:**

```text
src/pages/
└── _dashboard/
    ├── route.tsx       → Layout do dashboard
    ├── overview.tsx    → /overview
    └── analytics.tsx   → /analytics
```

### ⚠️ Troubleshooting: Erros no routeTree.gen.ts

#### Problema: Erro de sintaxe no arquivo gerado

**Sintomas:**

- Erro `Expected "from" but found "."` no arquivo `routeTree.gen.ts`
- Imports malformados após criar/mover/deletar arquivos de rota
- Build falhando com erro de sintaxe

**Causa:**

O arquivo `routeTree.gen.ts` é **gerado automaticamente** pelo plugin TanStack Router. Durante migrações ou mudanças na estrutura de rotas (deletar `_admin.tsx` e criar `_admin/route.tsx`), o gerador pode criar código malformado temporariamente.

**Solução:**

1. **Adicionar routeTree.gen.ts ao .gitignore** (se ainda não estiver):

   ```bash
   # Adicione esta linha ao .gitignore
   routeTree.gen.ts
   ```

2. **Remover o arquivo do Git** (se já estiver sendo rastreado):

   ```bash
   git rm --cached src/pages/routeTree.gen.ts
   ```

3. **Deletar e regenerar o arquivo**:

   ```bash
   # Deletar o arquivo corrompido
   rm src/pages/routeTree.gen.ts

   # Iniciar o dev server para regenerar
   npm run dev
   ```

4. **Verificar a estrutura de arquivos**:

   - ✅ Layouts devem usar `route.tsx` ou `route.lazy.tsx`
   - ✅ Todos os arquivos de rota devem exportar `export const Route`
   - ✅ Usar `createFileRoute()` ou `createLazyFileRoute()`

**Prevenção:**

- ✅ **NUNCA** edite manualmente o arquivo `routeTree.gen.ts`
- ✅ **SEMPRE** adicione `routeTree.gen.ts` ao `.gitignore`
- ✅ Deixe o arquivo ser gerado localmente em cada máquina
- ✅ Reinicie o dev server após mudanças estruturais nas rotas
- ✅ Siga as convenções de nomenclatura: `route.tsx` para layouts

**Resultado:**
- `/overview` → Usa layout `_dashboard/route.tsx` (com NavBar e sidebar)
- `/analytics` → Usa layout `_dashboard/route.tsx` (com NavBar e sidebar)
- Tudo relacionado ao dashboard fica organizado em uma única pasta

### 🔗 Rotas com Parâmetros Dinâmicos

Use `$` no nome do arquivo para parâmetros dinâmicos.

**Exemplo: Criar rota `/patients/:id`**

Crie o arquivo `src/pages/_admin/patients.$id.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { useParams } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_admin/patients/$id')({
  component: PatientDetailPage,
})

function PatientDetailPage() {
  const { id } = useParams({ from: '/_admin/patients/$id' })

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Paciente #{id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Informações do paciente {id}...</p>
        </CardContent>
      </Card>
    </div>
  )
}
```

**Navegando com parâmetros:**

```tsx
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

function PatientsList() {
  const patients = [
    { id: 123, name: 'João Silva' },
    { id: 456, name: 'Maria Santos' },
  ]

  return (
    <div className="space-y-4">
      {patients.map((patient) => (
        <Link
          key={patient.id}
          to="/patients/$id"
          params={{ id: String(patient.id) }}
        >
          <Button variant="outline" className="w-full">
            Ver {patient.name}
          </Button>
        </Link>
      ))}
    </div>
  )
}
```

### 🔄 Redirecionamento de Rotas

**Exemplo: Redirecionar página inicial para `/sign-in`**

`src/pages/index.tsx`:
```tsx
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => <Navigate to="/sign-in" />,
})
```

**Redirecionamento condicional (após login):**

```tsx
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: LoginRedirect,
})

function LoginRedirect() {
  const isAuthenticated = !!localStorage.getItem('token')

  if (isAuthenticated) {
    return <Navigate to="/admin-painel" />
  }

  return <LoginForm />
}
```

### Loader: Carregando Dados Antes de Renderizar

Use `loader` para buscar dados antes de renderizar a página:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { patientsService } from '@/services/patients'

export const Route = createFileRoute('/patients')({
  loader: async () => {
    const patients = await patientsService.getAll()
    return { patients }
  },
  component: PatientsPage,
})

function PatientsPage() {
  const { patients } = Route.useLoaderData()

  return (
    <div>
      {patients.map((patient) => (
        <div key={patient.id}>{patient.name}</div>
      ))}
    </div>
  )
}
```

### 📋 Convenções de Nomenclatura de Arquivos

| Nome do Arquivo | Rota Gerada | Uso | Exemplo no Projeto |
|-----------------|-------------|-----|-------------------|
| `__root.tsx` | Layout raiz | Componente raiz (obrigatório) | `src/pages/__root.tsx` |
| `index.tsx` | `/` | Página inicial | `src/pages/index.tsx` |
| `_auth/route.tsx` | Layout pathless | Layout sem adicionar ao path | `src/pages/_auth/route.tsx` |
| `_auth/route.lazy.tsx` | Layout pathless (lazy) | Layout com code-splitting | `src/pages/_auth/route.lazy.tsx` |
| `_auth/sign-in.tsx` | `/sign-in` | Rota com layout `_auth` | `src/pages/_auth/sign-in.tsx` |
| `_admin/route.tsx` | Layout pathless | Layout para rotas admin | `src/pages/_admin/route.tsx` |
| `_admin/admin-painel.tsx` | `/admin-painel` | Rota com layout `_admin` | `src/pages/_admin/admin-painel.tsx` |
| `patients.tsx` | `/patients` | Rota simples | - |
| `patients.$id.tsx` | `/patients/:id` | Parâmetro dinâmico | - |
| `doctors.$id.edit.tsx` | `/doctors/:id/edit` | Múltiplos segmentos | - |

**Regras importantes:**

- Use **hífen** para palavras compostas: `admin-painel.tsx` (não `adminPainel.tsx`)
- Use **underscore** como prefixo de pasta para layouts pathless: `_auth/`, `_admin/`
- Use **route.tsx** ou **route.lazy.tsx** para arquivos de layout dentro da pasta
- Use **$** para parâmetros dinâmicos: `$id`, `$patientId`
- Use **dois underscores** para arquivos especiais: `__root.tsx`

**Estrutura recomendada para layouts:**

```text
src/pages/
├── __root.tsx              → Layout raiz
├── index.tsx               → Página inicial
├── _auth/                  → Grupo de autenticação
│   ├── route.tsx           → Layout (tudo junto!)
│   ├── sign-in.tsx         → Rota filha
│   └── register.tsx        → Rota filha
└── _admin/                 → Grupo administrativo
    ├── route.tsx           → Layout (tudo junto!)
    ├── dashboard.tsx       → Rota filha
    └── users.tsx           → Rota filha
```

### 🛡️ Protegendo Rotas (Autenticação)

Use `beforeLoad` para proteger rotas que requerem autenticação:

```tsx
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/admin-painel')({
  beforeLoad: async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: AdminPainelPage,
})

function AdminPainelPage() {
  return <div>Painel Administrativo</div>
}
```

**Aplicar autenticação a todo um grupo de rotas:**

Coloque o `beforeLoad` no arquivo de layout `route.tsx`:

```tsx
// src/pages/_admin/route.tsx
import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { NavBar } from '@/components/common/navbar/NavBar'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <Outlet />
    </div>
  )
}
```

Agora TODAS as rotas dentro de `_admin/` estarão protegidas automaticamente!

### ✅ Resumo: Checklist para Criar uma Nova Rota

1. **Decidir o tipo de rota:**
   - [ ] Rota simples? → Criar arquivo direto em `src/pages/`
   - [ ] Precisa de layout? → Criar dentro de `_auth/` ou `_admin/`
   - [ ] Novo grupo? → Criar layout pathless novo

2. **Criar o arquivo:**
   - [ ] Nomear corretamente (hífen para palavras, `$` para parâmetros)
   - [ ] Importar `createFileRoute` do TanStack Router
   - [ ] Exportar `export const Route = createFileRoute('...')`
   - [ ] Definir o componente

3. **Testar:**
   - [ ] Iniciar servidor de desenvolvimento (`npm run dev`)
   - [ ] Verificar se `routeTree.gen.ts` foi atualizado
   - [ ] Acessar a rota no navegador
   - [ ] Testar navegação com `Link` ou `useNavigate`

**Exemplo completo mínimo:**

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_admin/minha-rota')({
  component: MinhaRotaPage,
})

function MinhaRotaPage() {
  return <div>Conteúdo da minha rota</div>
}
```

### 🚨 Problemas Comuns com Rotas

**1. Erro: "Conflicting configuration paths"**
- **Causa:** Dois layouts pathless com o mesmo path vazio
- **Solução:** Mantenha layouts pathless na raiz (`src/pages/_layout.tsx`), não dentro de suas próprias pastas

**2. Rota não aparece no navegador**
- **Solução:** Verifique se o servidor de desenvolvimento está rodando e se `routeTree.gen.ts` foi atualizado

**3. TypeScript reclama do path da rota**
- **Solução:** Certifique-se de que o path no `createFileRoute` corresponde exatamente à estrutura de arquivos

**4. Layout não está sendo aplicado**
- **Solução:** Verifique se o arquivo da rota está dentro da pasta do layout e se o `<Outlet />` está presente no layout

---

## 📄 Como Criar Páginas

Páginas são componentes completos que representam uma rota. Crie em `src/pages/`.

### Estrutura Básica de uma Página

**Exemplo: `src/pages/Patients.tsx`**

```tsx
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/common/SearchBar'
import { PatientCard } from '@/components/common/PatientCard'

export default function PatientsPage() {
  const [patients, setPatients] = useState([
    { id: 1, name: 'João Silva', age: 35, phone: '(11) 98765-4321' },
    { id: 2, name: 'Maria Santos', age: 28, phone: '(11) 91234-5678' },
  ])

  const handleSearch = (query: string) => {
    console.log('Buscando:', query)
    // Implementar lógica de busca
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchBar onSearch={handleSearch} placeholder="Buscar pacientes..." />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {patients.map((patient) => (
              <PatientCard
                key={patient.id}
                name={patient.name}
                age={patient.age}
                phone={patient.phone}
                onViewDetails={() => console.log('Ver detalhes', patient.id)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Página com Layout Complexo

```tsx
import { Navbar } from '@/components/common/navbar/NavBar'

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cards de estatísticas */}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted p-4 text-center">
        <p className="text-sm text-muted-foreground">© 2025 Clinic Front</p>
      </footer>
    </div>
  )
}
```

---

## 🎨 Usando Componentes do shadcn/ui

O projeto já tem vários componentes do shadcn/ui instalados. Veja como usá-los e adicionar novos.

### Componentes Já Instalados

- Avatar
- Badge
- Button
- Card
- Dialog
- Input
- Input Group
- Navigation Menu
- Separator
- Table
- Textarea

### Importando e Usando

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Exemplo <Badge>Novo</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="Digite algo..." />
        <Button className="mt-4">Enviar</Button>
      </CardContent>
    </Card>
  )
}
```

### Variantes de Componentes

**Button:**
```tsx
<Button variant="default">Padrão</Button>
<Button variant="destructive">Excluir</Button>
<Button variant="outline">Contorno</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="ghost">Fantasma</Button>
<Button variant="link">Link</Button>

{/* Tamanhos */}
<Button size="default">Padrão</Button>
<Button size="sm">Pequeno</Button>
<Button size="lg">Grande</Button>
<Button size="icon">Ícone</Button>
```

### Adicionando Novos Componentes do shadcn/ui

O shadcn/ui funciona copiando o código do componente para o seu projeto.

```bash
# Instalar o CLI do shadcn/ui (se ainda não tiver)
npx shadcn@latest init

# Adicionar um novo componente
npx shadcn@latest add <nome-do-componente>

# Exemplos:
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add toast
npx shadcn@latest add form
npx shadcn@latest add label
npx shadcn@latest add tabs
npx shadcn@latest add alert
npx shadcn@latest add calendar
npx shadcn@latest add date-picker
```

Os componentes serão adicionados automaticamente em `src/components/ui/`.

### Exemplo: Adicionando e Usando o Select

```bash
npx shadcn@latest add select
```

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function SpecialtySelect() {
  return (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Selecione a especialidade" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cardiologia">Cardiologia</SelectItem>
        <SelectItem value="pediatria">Pediatria</SelectItem>
        <SelectItem value="ortopedia">Ortopedia</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

### Componentes com Ícones (Lucide React)

O projeto usa **lucide-react** para ícones:

```tsx
import { Search, User, Calendar, Heart, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

function IconExamples() {
  return (
    <div className="flex gap-2">
      <Button size="icon">
        <Search className="h-4 w-4" />
      </Button>

      <Button>
        <Calendar className="mr-2 h-4 w-4" />
        Agendar
      </Button>

      {/* Ícone standalone */}
      <Heart className="h-6 w-6 text-red-500" />
    </div>
  )
}
```

Veja todos os ícones disponíveis em: https://lucide.dev/icons/

---

## 🎨 Estilização com Tailwind CSS

O projeto usa Tailwind CSS para estilização utilitária.

### Classes Básicas

```tsx
// Layout
<div className="flex flex-col gap-4">
<div className="grid grid-cols-3 gap-6">
<div className="container mx-auto p-6">

// Espaçamento
<div className="p-4">        {/* padding */}
<div className="m-4">        {/* margin */}
<div className="px-6 py-4">  {/* padding horizontal e vertical */}
<div className="mt-8">       {/* margin-top */}

// Cores
<div className="bg-primary text-primary-foreground">
<div className="bg-secondary text-secondary-foreground">
<div className="bg-destructive text-destructive-foreground">
<div className="text-muted-foreground">

// Texto
<h1 className="text-3xl font-bold">
<p className="text-sm text-muted-foreground">
<span className="font-semibold">

// Bordas e Arredondamento
<div className="border rounded-lg">
<div className="border-2 border-primary rounded-full">

// Responsividade
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<p className="text-sm md:text-base lg:text-lg">
```

### Variáveis CSS Personalizadas

O projeto define variáveis de cores em `src/styles/index.css`:

```css
/* Tema Claro */
--background: #e4f2fe
--foreground: #132190
--primary: #132190
--secondary: #87b7fe
```

Use essas cores com as classes Tailwind:

```tsx
<div className="bg-background text-foreground">
<Button className="bg-primary text-primary-foreground">
```

### Utilitário `cn()` para Mesclagem de Classes

Use a função `cn()` de `src/lib/utils.ts` para combinar classes condicionalmente:

```tsx
import { cn } from '@/lib/utils'

function MyComponent({ isActive, className }: { isActive: boolean, className?: string }) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg',
        isActive && 'bg-primary text-white',
        !isActive && 'bg-secondary',
        className // Permite sobrescrever classes
      )}
    >
      Conteúdo
    </div>
  )
}
```

### Dark Mode

O projeto já está configurado para dark mode. Use a classe `dark:`:

```tsx
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">
  Conteúdo
</div>
```

---

## 🔄 Gerenciamento de Estado

### 1. Estado Local (useState)

Para estado específico de um componente:

```tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Contagem: {count}</p>
      <Button onClick={() => setCount(count + 1)}>Incrementar</Button>
    </div>
  )
}
```

### 2. Estado Compartilhado entre Componentes (Props)

```tsx
function ParentComponent() {
  const [selectedPatient, setSelectedPatient] = useState(null)

  return (
    <div>
      <PatientList onSelectPatient={setSelectedPatient} />
      <PatientDetails patient={selectedPatient} />
    </div>
  )
}
```

### 3. Custom Hooks

Crie hooks reutilizáveis em `src/hooks/`:

**Exemplo: `src/hooks/useLocalStorage.ts`**

```tsx
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}
```

**Uso:**

```tsx
import { useLocalStorage } from '@/hooks/useLocalStorage'

function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Tema: {theme}
    </Button>
  )
}
```

### 4. TanStack React Query (Estado do Servidor)

O projeto tem React Query instalado. Use para requisições de API:

**Passo 1: Configurar QueryClient**

Edite `src/app/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { routeTree } from '@/routes/routeTree'
import '@/styles/index.css'

const queryClient = new QueryClient()
const router = createRouter({ routeTree })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
```

**Passo 2: Criar serviço de API**

**`src/services/api.ts`:**

```tsx
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**`src/services/patients.ts`:**

```tsx
import { api } from './api'

export interface Patient {
  id: number
  name: string
  age: number
  phone: string
  email: string
}

export const patientsService = {
  getAll: async (): Promise<Patient[]> => {
    const { data } = await api.get('/patients')
    return data
  },

  getById: async (id: number): Promise<Patient> => {
    const { data } = await api.get(`/patients/${id}`)
    return data
  },

  create: async (patient: Omit<Patient, 'id'>): Promise<Patient> => {
    const { data } = await api.post('/patients', patient)
    return data
  },

  update: async (id: number, patient: Partial<Patient>): Promise<Patient> => {
    const { data } = await api.put(`/patients/${id}`, patient)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/patients/${id}`)
  },
}
```

**Passo 3: Usar Query em Componentes**

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patientsService } from '@/services/patients'

function PatientsPage() {
  const queryClient = useQueryClient()

  // Buscar dados
  const { data: patients, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsService.getAll,
  })

  // Mutação (criar/atualizar/deletar)
  const createMutation = useMutation({
    mutationFn: patientsService.create,
    onSuccess: () => {
      // Invalidar cache para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })

  if (isLoading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar pacientes</div>

  return (
    <div>
      {patients?.map((patient) => (
        <PatientCard key={patient.id} {...patient} />
      ))}

      <Button onClick={() => createMutation.mutate({
        name: 'Novo Paciente',
        age: 30,
        phone: '11999999999',
        email: 'novo@example.com'
      })}>
        Adicionar Paciente
      </Button>
    </div>
  )
}
```

---

## 🌐 Integração com API

### Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
```

**Acesse no código:**

```tsx
const apiUrl = import.meta.env.VITE_API_URL
```

### Exemplo Completo de CRUD

**`src/services/doctors.ts`:**

```tsx
import { api } from './api'

export interface Doctor {
  id: number
  name: string
  crm: string
  specialty: string
  phone: string
  email: string
}

export const doctorsService = {
  getAll: async (filters?: { specialty?: string; name?: string }): Promise<Doctor[]> => {
    const { data } = await api.get('/doctors', { params: filters })
    return data
  },

  getById: async (id: number): Promise<Doctor> => {
    const { data } = await api.get(`/doctors/${id}`)
    return data
  },

  create: async (doctor: Omit<Doctor, 'id'>): Promise<Doctor> => {
    const { data } = await api.post('/doctors', doctor)
    return data
  },

  update: async (id: number, doctor: Partial<Doctor>): Promise<Doctor> => {
    const { data } = await api.put(`/doctors/${id}`, doctor)
    return data
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/doctors/${id}`)
  },
}
```

**Uso em componente:**

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorsService } from '@/services/doctors'
import { useState } from 'react'

function DoctorsManagement() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({ specialty: '', name: '' })

  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors', filters],
    queryFn: () => doctorsService.getAll(filters),
  })

  const deleteMutation = useMutation({
    mutationFn: doctorsService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
    },
  })

  return (
    <div>
      <Input
        placeholder="Filtrar por nome"
        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
      />

      {isLoading ? (
        <p>Carregando...</p>
      ) : (
        doctors?.map((doctor) => (
          <Card key={doctor.id}>
            <CardContent>
              <h3>{doctor.name}</h3>
              <p>{doctor.specialty}</p>
              <Button
                variant="destructive"
                onClick={() => deleteMutation.mutate(doctor.id)}
              >
                Excluir
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
```

---

## ✅ Boas Práticas

### 1. TypeScript

- **Sempre defina tipos para props:**

```tsx
interface ButtonProps {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary'
}

function MyButton({ label, onClick, variant = 'primary' }: ButtonProps) {
  // ...
}
```

- **Use interfaces para dados da API:**

```tsx
interface User {
  id: number
  name: string
  email: string
}
```

### 2. Organização de Código

- **Um componente por arquivo**
- **Nomeie arquivos com PascalCase:** `PatientCard.tsx`
- **Use pastas para componentes complexos:**

```
PatientCard/
├── PatientCard.tsx
├── PatientCard.test.tsx
├── index.ts
└── styles.module.css (se necessário)
```

### 3. Importações

Use alias `@/` para importações absolutas:

```tsx
// ✅ Bom
import { Button } from '@/components/ui/button'
import { usePatients } from '@/hooks/usePatients'

// ❌ Evite
import { Button } from '../../../components/ui/button'
```

### 4. Nomenclatura

- **Componentes:** PascalCase (`PatientCard`)
- **Funções/Variáveis:** camelCase (`handleSubmit`, `patientData`)
- **Constantes:** UPPER_SNAKE_CASE (`API_URL`, `MAX_RETRIES`)
- **Interfaces de Props:** `<ComponentName>Props` (`PatientCardProps`)

### 5. Código Limpo

```tsx
// ✅ Bom: Componente pequeno e focado
function PatientAvatar({ name, imageUrl }: PatientAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={imageUrl} alt={name} />
      <AvatarFallback>{name[0]}</AvatarFallback>
    </Avatar>
  )
}

// ❌ Evite: Componente fazendo muitas coisas
function PatientComponent({ patient }: PatientComponentProps) {
  // Muita lógica aqui...
  // Renderização complexa...
  // Vários estados...
}
```

### 6. Validação com Zod

Use Zod para validação de formulários:

```tsx
import { z } from 'zod'

const patientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  age: z.number().min(0).max(150),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
})

type PatientFormData = z.infer<typeof patientSchema>

function PatientForm() {
  const handleSubmit = (data: PatientFormData) => {
    try {
      patientSchema.parse(data)
      // Dados válidos
    } catch (error) {
      // Tratar erros de validação
    }
  }
}
```

### 7. Tratamento de Erros

```tsx
import { useQuery } from '@tanstack/react-query'

function PatientsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['patients'],
    queryFn: patientsService.getAll,
    retry: 3,
    onError: (error) => {
      console.error('Erro ao buscar pacientes:', error)
      // Mostrar notificação de erro
    },
  })

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (error) {
    return (
      <div className="text-destructive">
        Erro ao carregar pacientes. Tente novamente.
      </div>
    )
  }

  return <div>{/* Renderizar dados */}</div>
}
```

### 8. Acessibilidade

```tsx
// ✅ Bom: Componente acessível
<Button
  aria-label="Adicionar novo paciente"
  onClick={handleAdd}
>
  <Plus className="h-4 w-4" />
</Button>

<Input
  id="patient-name"
  aria-describedby="name-help"
  placeholder="Nome do paciente"
/>
<p id="name-help" className="text-sm text-muted-foreground">
  Digite o nome completo do paciente
</p>
```

---

## 🔧 Scripts Disponíveis

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Compilar projeto para produção
npm run build

# Visualizar build de produção localmente
npm run preview

# Executar linter (verificar código)
npm run lint
```

---

## 📚 Recursos Adicionais

- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Vite:** https://vite.dev/
- **TanStack Router:** https://tanstack.com/router/latest
- **TanStack Query:** https://tanstack.com/query/latest
- **Tailwind CSS:** https://tailwindcss.com/docs
- **shadcn/ui:** https://ui.shadcn.com/
- **Radix UI:** https://www.radix-ui.com/
- **Lucide Icons:** https://lucide.dev/icons/
- **Zod:** https://zod.dev/

---

## 🤝 Contribuindo

### Fluxo de Trabalho Git

```bash
# Criar nova branch para feature
git checkout -b feature/nome-da-feature

# Fazer commits
git add .
git commit -m "feat: adiciona página de pacientes"

# Push para o repositório
git push origin feature/nome-da-feature

# Criar Pull Request no GitHub
```

### Mensagens de Commit

Use o padrão Conventional Commits:

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação de código
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de manutenção

**Exemplos:**
```bash
git commit -m "feat: adiciona tela de agendamento de consultas"
git commit -m "fix: corrige bug no filtro de médicos"
git commit -m "docs: atualiza guia de desenvolvimento"
```

---

## 🆘 Problemas Comuns

### Erro ao instalar dependências

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de TypeScript

```bash
# Verificar configuração do TypeScript
npx tsc --noEmit

# Reiniciar servidor de desenvolvimento
npm run dev
```

### Componente do shadcn/ui não funciona

```bash
# Reinstalar o componente
npx shadcn@latest add <nome-do-componente> --overwrite
```

---

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:

1. Verifique este guia primeiro
2. Consulte a documentação oficial das bibliotecas
3. Entre em contato com a equipe

---

**Bom desenvolvimento! 🚀**
