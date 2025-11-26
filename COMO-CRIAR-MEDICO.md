# 🔐 Como Criar Credenciais de Médico

## ✅ Credenciais que Serão Criadas

```
📧 Email: medico@clinica.com
🔑 Senha: Medico@123
👤 Nome: Dr. João Silva
```

---

## 🚀 Opção 1: Usando o Script Node.js (RECOMENDADO)

### Passo 1: Execute o Script

Abra o terminal na pasta do projeto e execute:

```bash
node insert-doctor-credentials.js
```

### Passo 2: Escolha o Banco de Dados

O script vai perguntar qual banco você está usando:
- Digite **1** para PostgreSQL
- Digite **2** para MySQL

### Passo 3: Forneça as Credenciais do Banco

O script vai pedir:
- **Host** (pressione Enter para usar `localhost`)
- **Porta** (pressione Enter para usar a porta padrão)
- **Nome do banco de dados** (digite o nome do seu banco)
- **Usuário do banco** (seu usuário do PostgreSQL/MySQL)
- **Senha do banco** (sua senha do PostgreSQL/MySQL)

### Passo 4: Confirme o Sucesso

Se tudo der certo, você verá:

```
✅ Usuário criado com sucesso!

📋 Dados do usuário:
┌─────┬────┬─────────────────┬──────────────────────┬─────────┬───────┬──────────────┬──────────────┐
│ id  │ nome│ email           │ perfil               │ ativo   │ ...   │              │              │
├─────┼────┼─────────────────┼──────────────────────┼─────────┼───────┼──────────────┼──────────────┤
│ 1   │ Dr. │ medico@clinica. │ MEDICO               │ true    │ ...   │              │              │
│     │ João│ com             │                      │         │       │              │              │
│     │ Silva│                 │                      │         │       │              │              │
└─────┴────┴─────────────────┴──────────────────────┴─────────┴───────┴──────────────┴──────────────┘

✅ CREDENCIAIS DE ACESSO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Email:   medico@clinica.com
🔑 Senha:   Medico@123
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔧 Opção 2: SQL Direto (Se Preferir)

### Para PostgreSQL

Execute no seu cliente PostgreSQL (pgAdmin, DBeaver, psql):

```sql
-- Verifica se já existe
SELECT id, nome, email, perfil, ativo FROM usuarios WHERE email = 'medico@clinica.com';

-- Se existir, atualiza
UPDATE usuarios
SET
    nome = 'Dr. João Silva',
    senha = '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
    perfil = 'MEDICO',
    ativo = true,
    atualizado_em = NOW()
WHERE email = 'medico@clinica.com';

-- Se NÃO existir, cria
INSERT INTO usuarios (nome, email, senha, perfil, cpf, telefone, ativo, criado_em, atualizado_em)
VALUES (
  'Dr. João Silva',
  'medico@clinica.com',
  '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
  'MEDICO',
  '98765432100',
  '(11) 98765-4321',
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  senha = EXCLUDED.senha,
  perfil = EXCLUDED.perfil,
  ativo = EXCLUDED.ativo,
  atualizado_em = NOW();

-- Verifica se funcionou
SELECT id, nome, email, perfil, ativo,
       LENGTH(senha) as tamanho_hash,
       SUBSTRING(senha, 1, 10) as inicio_hash
FROM usuarios
WHERE email = 'medico@clinica.com';
```

### Para MySQL

Execute no seu cliente MySQL:

```sql
-- Verifica se já existe
SELECT id, nome, email, perfil, ativo FROM usuarios WHERE email = 'medico@clinica.com';

-- Se existir, atualiza
UPDATE usuarios
SET
    nome = 'Dr. João Silva',
    senha = '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
    perfil = 'MEDICO',
    ativo = 1,
    atualizado_em = NOW()
WHERE email = 'medico@clinica.com';

-- Se NÃO existir, cria (usando INSERT com ON DUPLICATE KEY)
INSERT INTO usuarios (nome, email, senha, perfil, cpf, telefone, ativo, criado_em, atualizado_em)
VALUES (
  'Dr. João Silva',
  'medico@clinica.com',
  '$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua',
  'MEDICO',
  '98765432100',
  '(11) 98765-4321',
  1,
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  senha = VALUES(senha),
  perfil = VALUES(perfil),
  ativo = VALUES(ativo),
  atualizado_em = NOW();

-- Verifica se funcionou
SELECT id, nome, email, perfil, ativo,
       LENGTH(senha) as tamanho_hash,
       SUBSTRING(senha, 1, 10) as inicio_hash
FROM usuarios
WHERE email = 'medico@clinica.com';
```

---

## 🧪 Testando o Login

Depois de criar as credenciais, teste o login:

### 1. Pela Aplicação Web

1. Abra `http://localhost:5173/sign-in` (ou a URL onde seu frontend está rodando)
2. Digite:
   - **Email:** `medico@clinica.com`
   - **Senha:** `Medico@123` (atenção ao M maiúsculo!)
3. Clique em **Entrar**

Se funcionar, você será redirecionado para `/_doctor/home`

### 2. Testando via Terminal

Execute este comando para testar o backend diretamente:

```bash
node test-login-backend.js
```

Você deve ver uma mensagem de sucesso com o token JWT.

---

## ❌ Resolução de Problemas

### Problema: "Email ou senha inválidos"

**Soluções:**

1. Verifique se o usuário foi criado no banco:
   ```sql
   SELECT * FROM usuarios WHERE email = 'medico@clinica.com';
   ```

2. Certifique-se de que:
   - `perfil` = `'MEDICO'` (tudo maiúsculo)
   - `ativo` = `true` (PostgreSQL) ou `1` (MySQL)
   - `senha` começa com `$2b$10$` (hash bcrypt)

3. Execute o UPDATE novamente para garantir:
   ```sql
   UPDATE usuarios
   SET perfil = 'MEDICO', ativo = true
   WHERE email = 'medico@clinica.com';
   ```

### Problema: "Backend não está respondendo"

**Soluções:**

1. Verifique se o backend está rodando:
   - Deve estar em `http://localhost:3001` (conforme seu .env)

2. Teste a conexão:
   ```bash
   curl http://localhost:3001/api/auth/login
   ```

3. Inicie o backend se não estiver rodando

### Problema: "Usuário criado mas não consigo logar"

**Possíveis causas:**

1. **Senha incorreta no banco**: O hash deve ser exatamente:
   ```
   $2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua
   ```

2. **Nome da coluna diferente**: Alguns bancos usam `senha_hash` em vez de `senha`
   - Verifique com: `DESCRIBE usuarios;` (MySQL) ou `\d usuarios` (PostgreSQL)
   - Se for `senha_hash`, ajuste as queries acima

3. **Perfil incorreto**: Deve ser exatamente `MEDICO` (maiúsculas)

---

## 📝 Informações Técnicas

### Hash da Senha

- **Senha original:** `Medico@123`
- **Hash bcrypt:** `$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua`
- **Cost factor:** 10
- **Comprimento:** 60 caracteres

### Estrutura da Tabela `usuarios`

| Coluna         | Tipo       | Obrigatório | Valor                    |
|----------------|------------|-------------|--------------------------|
| id             | INTEGER    | Sim         | Auto-incremento          |
| nome           | VARCHAR    | Sim         | Dr. João Silva           |
| email          | VARCHAR    | Sim         | medico@clinica.com       |
| senha          | VARCHAR    | Sim         | (hash bcrypt)            |
| perfil         | VARCHAR/ENUM| Sim        | MEDICO                   |
| cpf            | VARCHAR    | Não         | 98765432100              |
| telefone       | VARCHAR    | Não         | (11) 98765-4321          |
| ativo          | BOOLEAN/INT| Sim         | true/1                   |
| criado_em      | TIMESTAMP  | Não         | Automático               |
| atualizado_em  | TIMESTAMP  | Não         | Automático               |

---

## 🎯 Próximos Passos

Após fazer login com sucesso:

1. ✅ Acesse a área do médico: [http://localhost:5173/_doctor/home](http://localhost:5173/_doctor/home)
2. ✅ Explore as funcionalidades:
   - Página inicial do médico
   - Lista de pacientes
   - Agenda de consultas
   - Configurações do perfil

---

## 💡 Dicas

- Se precisar criar outro médico, mude o email no script
- A senha pode ser alterada gerando um novo hash com bcrypt
- O token JWT expira após algum tempo, então você pode precisar fazer login novamente
- Use `Medico@123` exatamente como mostrado (case-sensitive!)

---

## 📞 Ajuda Adicional

Se ainda tiver problemas:

1. Verifique os logs do backend
2. Confirme que o banco de dados está rodando
3. Teste a conexão do backend com o banco
4. Execute `node test-login-backend.js` para ver detalhes do erro
