# Guia de Teste - Sistema de Agendamento de Consultas

## 📋 Funcionalidades Implementadas

O sistema agora possui funcionalidades completas de agendamento de consultas para todos os tipos de usuários:

### 👨‍⚕️ Para Médicos
- **Página `/schedule`**: Visualização de todas as consultas (próximas e passadas)
- Calendário interativo com 2 meses
- Busca por nome do paciente
- Ações disponíveis:
  - ✅ Confirmar consultas agendadas
  - ✅ Marcar consultas confirmadas como concluídas
  - 👁️ Ver detalhes do paciente

### 👤 Para Pacientes
- **Página `/appointments`**: Visualização das suas consultas
- **Página `/schedule-appointment`**: Agendamento de novas consultas
- Processo em 3 etapas:
  1. Seleção do médico
  2. Escolha de data e horário
  3. Confirmação dos dados
- Ações disponíveis:
  - 📅 Reagendar consultas
  - ❌ Cancelar consultas
  - 👁️ Ver detalhes

### 🔧 Para Administradores
- **Página `/admin/consultas`**: Gerenciamento completo
- Dashboard com estatísticas
- Filtros por paciente, médico e status
- Ações disponíveis:
  - ✅ Confirmar consultas
  - ❌ Cancelar consultas
  - 🗑️ Excluir consultas

## 🚀 Como Testar

### 1. Criar Consultas de Teste

Primeiro, edite o arquivo `create-test-appointments.cjs` e configure a senha do seu MySQL:

```javascript
const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'SUA_SENHA_AQUI', // ← Coloque sua senha do MySQL aqui
  database: 'projeto_dev_web'
});
```

Depois execute:

```bash
node create-test-appointments.cjs
```

Este script criará 5 consultas de teste:
- 1 consulta **AGENDADA** (hoje, daqui a 2 horas)
- 1 consulta **CONFIRMADA** (amanhã)
- 1 consulta **PENDENTE** (daqui a 3 dias)
- 1 consulta **CONCLUÍDA** (ontem)
- 1 consulta **CANCELADA** (há 3 dias)

### 2. Testar como Médico

**Credenciais:**
- Email: `medico@clinica.com`
- Senha: `Medico@123`

**O que testar:**
1. Acesse `/schedule` e veja suas consultas
2. Confirme uma consulta com status "Agendada"
3. Marque uma consulta confirmada como "Concluída"
4. Use o calendário para visualizar as datas
5. Busque por nome de paciente

### 3. Testar como Paciente

**Credenciais:** (use credenciais de paciente cadastrado)
- Email: `paciente@email.com` (ou similar)

**O que testar:**
1. Acesse `/appointments` e veja suas consultas
2. Clique em "Agendar Nova Consulta"
3. Selecione um médico
4. Escolha data e horário
5. Confirme o agendamento
6. Reagende uma consulta existente
7. Cancele uma consulta

### 4. Testar como Admin

**Credenciais:**
- Email: `admin@email.com`
- Senha: (senha do admin)

**O que testar:**
1. Acesse `/admin/consultas`
2. Veja todas as consultas do sistema
3. Use os filtros de busca e status
4. Confirme, cancele ou exclua consultas
5. Observe as estatísticas no dashboard

## 📊 Status das Consultas

- **AGENDADA**: Consulta criada, aguardando confirmação
- **CONFIRMADA**: Consulta confirmada pelo médico
- **PENDENTE**: Consulta aguardando processamento
- **CONCLUÍDA**: Consulta já realizada
- **CANCELADA**: Consulta cancelada

## 🔄 Fluxo Completo de uma Consulta

1. **Paciente** agenda uma consulta → Status: `AGENDADA`
2. **Médico** confirma a consulta → Status: `CONFIRMADA`
3. **Médico** marca como concluída após o atendimento → Status: `CONCLUÍDA`

Alternativamente:
- **Paciente** pode reagendar antes da consulta
- **Paciente** ou **Admin** podem cancelar → Status: `CANCELADA`

## 🎨 Componentes Visuais

Todas as páginas utilizam:
- Cards responsivos
- Badges coloridos por status
- Diálogos de confirmação
- Loaders durante ações assíncronas
- Mensagens toast de sucesso/erro
- Calendário interativo (apenas para médicos)

## 🛠️ Serviços Utilizados

### Frontend
- `consultaService.ts`: Gerenciamento de consultas
- `doctorService.ts`: Serviços específicos do médico
- `medicoService.ts`: Listagem de médicos
- `pacienteService.ts`: Dados do paciente

### Backend (endpoints esperados)
- `GET /consultas` - Listar todas as consultas
- `GET /consultas/me` - Consultas do paciente logado
- `GET /consultas/medico/:id` - Consultas de um médico
- `GET /consultas/paciente/:id` - Consultas de um paciente
- `POST /consultas` - Criar nova consulta
- `PUT /consultas/:id` - Atualizar consulta
- `PATCH /consultas/:id/confirmar` - Confirmar consulta
- `PATCH /consultas/:id/cancelar` - Cancelar consulta
- `DELETE /consultas/:id` - Excluir consulta

## ✅ Checklist de Testes

- [ ] Médico visualiza consultas de hoje
- [ ] Médico confirma uma consulta
- [ ] Médico marca consulta como concluída
- [ ] Paciente agenda nova consulta
- [ ] Paciente visualiza suas consultas
- [ ] Paciente reagenda consulta
- [ ] Paciente cancela consulta
- [ ] Admin visualiza todas as consultas
- [ ] Admin filtra consultas por status
- [ ] Admin confirma consulta
- [ ] Admin cancela consulta
- [ ] Admin exclui consulta
- [ ] Todas as ações mostram toast de sucesso
- [ ] Erros são tratados e mostrados ao usuário

## 🐛 Problemas Comuns

### "Erro ao carregar consultas"
- Verifique se o backend está rodando
- Verifique se os endpoints estão corretos
- Verifique se há consultas no banco de dados

### "Não foi possível carregar suas informações"
- Execute o script de criação de consultas
- Verifique se o usuário existe no banco
- Verifique se o ID do usuário está correto

### "Erro ao agendar consulta"
- Verifique se selecionou médico, data e horário
- Verifique se o backend aceita o formato de data
- Verifique os logs do console para mais detalhes

## 📝 Notas

- As consultas de teste têm "Consulta de teste" nas observações
- Para limpar consultas de teste, execute o script novamente (ele remove as anteriores)
- Todas as datas são formatadas em português (pt-BR)
- Os horários seguem o fuso horário local do navegador
