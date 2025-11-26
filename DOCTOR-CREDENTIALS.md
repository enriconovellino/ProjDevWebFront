# Credenciais de Médico para Teste

## Credenciais de Login

```
Email: medico@clinica.com
Senha: Medico@123
```

## Como Criar o Usuário Médico

### Opção 1: Executar o Script (Recomendado)

1. Execute o script para gerar o SQL:
```bash
node create-doctor-user.js
```

2. Copie o SQL gerado e execute no seu banco de dados PostgreSQL

### Opção 2: SQL Direto (se não tiver Node.js)

Execute este SQL no seu banco de dados PostgreSQL (substitua o hash pela senha hashada):

```sql
-- Primeiro, gere o hash da senha 'Medico@123' usando bcrypt
-- Você pode usar um gerador online de bcrypt ou o script Node.js

INSERT INTO usuarios (nome, email, senha, perfil, cpf, telefone, ativo, criado_em, atualizado_em)
VALUES (
  'Dr. João Silva',
  'medico@clinica.com',
  '$2b$10$[HASH_GERADO_AQUI]',  -- Substitua pelo hash bcrypt de 'Medico@123'
  'MEDICO',
  '98765432100',
  '(11) 98765-4321',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  senha = EXCLUDED.senha,
  atualizado_em = NOW();
```

## Funcionalidades Disponíveis

Após fazer login com as credenciais do médico, você terá acesso a:

- **Home** (`/_doctor/home`): Lista de consultas de hoje
- **Pacientes** (`/_doctor/patients`): Lista de todos os pacientes com busca
- **Agenda** (`/_doctor/schedule`): Calendário e lista de consultas (próximas e passadas)
- **Mensagens** (`/_doctor/messages`): Sistema de mensagens
- **Configurações** (`/_doctor/settings`): Atualização de perfil e configurações

## Verificar se o Usuário Existe

Para verificar se o médico já foi criado no banco:

```sql
SELECT id, nome, email, perfil, ativo, criado_em
FROM usuarios
WHERE email = 'medico@clinica.com';
```

## Redefinir Senha

Se precisar redefinir a senha do médico:

1. Gere um novo hash com o script ou online
2. Execute:

```sql
UPDATE usuarios
SET senha = '[NOVO_HASH]', atualizado_em = NOW()
WHERE email = 'medico@clinica.com';
```

## Observações

- O perfil deve ser exatamente 'MEDICO' (maiúsculas)
- A senha deve ter pelo menos 8 caracteres
- O CPF e telefone são opcionais mas recomendados
- O sistema redireciona automaticamente para `/_doctor/home` após login
