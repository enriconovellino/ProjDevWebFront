# Seção de Rotas do Paciente (_patient)

Esta seção contém todas as rotas e funcionalidades específicas para o portal dos pacientes.

## Estrutura de Pastas

```
src/pages/_patient/
├── route.lazy.tsx           # Layout raiz com navegação
├── dashboard.lazy.tsx       # Dashboard principal
├── appointments.lazy.tsx    # Minhas Consultas
├── medical-records.lazy.tsx # Prontuário Médico
├── profile.lazy.tsx         # Meu Perfil
└── index.tsx               # Home do paciente
```

## Rotas Disponíveis

### 1. **Dashboard** (`/_patient/dashboard`)
- Página inicial do portal do paciente
- Atalhos para funcionalidades principais
- Resumo de atividades recentes
- **Componente:** `PatientDashboard`

### 2. **Minhas Consultas** (`/_patient/appointments`)
- Listagem de consultas agendadas
- Status das consultas (confirmada, pendente, cancelada)
- Informações do médico, data, hora e local
- Ações: Reagendar, Cancelar
- **Componente:** `PatientAppointments`

### 3. **Prontuário Médico** (`/_patient/medical-records`)
- Acesso ao histórico médico completo
- Visualização de consultas anteriores
- Exames realizados
- Prescrições médicas
- Download de documentos
- **Componente:** `PatientMedicalRecords`

### 4. **Meu Perfil** (`/_patient/profile`)
- Informações pessoais do paciente
- Dados de contato (email, telefone)
- Endereço
- Modo edição para atualizar dados
- **Componente:** `PatientProfile`

## Navegação

A navegação entre as rotas é feita através do `PatientLayout`, que possui um menu lateral com links para todas as páginas.

### Itens do Menu:
- 🏠 Dashboard
- 📅 Minhas Consultas
- 📄 Prontuário
- 👤 Meu Perfil

## Componentes Utilizados

- **UI Components:** Button, Card, Input, Avatar, Badge, Label, Dialog
-- **Icons:** lucide-react (Calendar, FileText, User, Home, etc.)
- **Hooks:** useState, useEffect
- **Router:** TanStack React Router

## Dados Mockados

Todas as rotas utilizam dados mockados (hardcoded) por enquanto. No futuro, serão integradas com:
- APIs de consultas
- APIs de prontuários
- APIs de mensagens
- APIs de perfil do usuário

## Padrões Utilizados

1. **Lazy Loading:** Uso de `createLazyFileRoute` para carregamento sob demanda
2. **Responsividade:** Layouts adaptáveis para mobile e desktop
3. **Estados:** Gerenciamento local com `useState`
4. **Componentes:** Reutilização de componentes UI

## Próximos Passos

1. Integrar com as APIs reais
2. Adicionar validações de formulários (Zod)
3. Implementar tratamento de erros
4. Adicionar loading states
5. Implementar paginação onde necessário
