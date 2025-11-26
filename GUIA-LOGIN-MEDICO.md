# 🔐 Guia Completo - Criar Credenciais de Médico para Teste

## ✅ Credenciais Prontas

```
📧 Email: medico@clinica.com
🔑 Senha: Medico@123
```

⚠️ **ATENÇÃO**: A senha é **case-sensitive**! Deve ser exatamente `Medico@123` com `M` maiúsculo!

---

## 📋 Passo a Passo para Criar/Atualizar o Usuário

### Passo 1: Abra o Gerenciador do Banco de Dados

Você pode usar:
- **pgAdmin** (interface web para PostgreSQL)
- **DBeaver** (app completo)
- **psql** (linha de comando)
- **Qualquer outro cliente PostgreSQL**

### Passo 2: Conecte ao Banco da Clínica

Use as configurações do seu banco de dados (host, porta, usuário, senha).

### Passo 3: Execute o Script SQL

Abra o arquivo **`CRIAR-MEDICO-TESTE.sql`** nesta pasta e execute.

**Resumo do que vai acontecer:**
1. ✓ Verifica se o médico já existe
2. ✓ Atualiza (se existe) ou cria (se não existe) o usuário
3. ✓ Define o perfil como `MEDICO`
4. ✓ Ativa o usuário (`ativo = true`)

### Passo 4: Verifique se Funcionou

Na query de verificação do script, você deve ver:

```
 id |      nome      |       email        | perfil | ativo | tamanho_hash | inicio_hash
----+----------------+--------------------+--------+-------+--------------+---------
  X | Dr. João Silva | medico@clinica.com | MEDICO | t     |           60 | $2b$10$q/
```

---

## 🧪 Testando o Login

### Opção 1: Testar no Navegador

1. Abra a aplicação em `http://localhost:5173` (ou onde está rodando)
2. Clique em **"Entrar como Médico"** (se houver) ou vá para a página de login
3. Digite as credenciais:
   - **Email:** `medico@clinica.com`
   - **Senha:** `Medico@123`
4. Clique em **"Entrar"**

Se funcionar, você será redirecionado para `/_doctor/home`

### Opção 2: Testar com curl (linha de comando)

Abra PowerShell e execute:

```powershell
$body = @{
    email = "medico@clinica.com"
    senha = "Medico@123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3000/api/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

Você deve receber uma resposta com:
```json
{
  "token": "eyJ0eXAi...",
  "user": {
    "id": 123,
    "nome": "Dr. João Silva",
    "email": "medico@clinica.com",
    "perfil": "MEDICO"
  }
}
```

### Opção 3: Usar o HTML de Teste

Se houver um arquivo `test-doctor-login.html`, abra-o no navegador para um formulário de teste interativo.

---

## ❌ Se Não Funcionar

### Verificação 1: Usuário Existe no Banco?

Execute no PostgreSQL:

```sql
SELECT id, nome, email, perfil, ativo, LENGTH(senha) as tamanho_hash
FROM usuarios
WHERE email = 'medico@clinica.com';
```

Se retornar nada, o usuário não foi criado. Execute novamente o SQL.

### Verificação 2: Perfil está Correto?

O perfil deve ser exatamente `MEDICO` (maiúsculas). Se estiver diferente, atualize:

```sql
UPDATE usuarios
SET perfil = 'MEDICO'
WHERE email = 'medico@clinica.com';
```

### Verificação 3: Usuário Está Ativo?

```sql
UPDATE usuarios
SET ativo = true
WHERE email = 'medico@clinica.com';
```

### Verificação 4: Backend Está Rodando?

O backend deve estar em `http://localhost:3000` (ou ajuste conforme sua configuração)

Teste com:
```powershell
Test-Connection localhost -TcpPort 3000
```

### Verificação 5: Fronted Está Rodando?

O frontend deve estar em `http://localhost:5173` ou similar

Verifique no terminal se há algum erro ao rodar `npm run dev`

---

## 📝 Informações Técnicas

### Sobre o Hash da Senha

- **Hash:** `$2b$10$q/VxCWI1DgULKp6iqS0KeulCG2kzj0bO1X1KVYb677M6oGN3aljua`
- **Algoritmo:** bcrypt (cost = 10)
- **Comprimento:** 60 caracteres
- **Descrição:** Este é o hash criptográfico da senha `Medico@123`

⚠️ **NUNCA** armazene senhas em texto plano no banco de dados!

### Campos da Tabela `usuarios`

| Campo | Valor | Obrigatório |
|-------|-------|-----------|
| `nome` | Dr. João Silva | Sim |
| `email` | medico@clinica.com | Sim |
| `senha` | `$2b$10$q/VxCWI...` | Sim |
| `perfil` | MEDICO | Sim |
| `cpf` | 98765432100 | Não |
| `telefone` | (11) 98765-4321 | Não |
| `ativo` | true | Sim |

---

## 🚀 Próximos Passos

Após conseguir fazer login:

1. **Acesse a Home do Médico:** `http://localhost:5173/_doctor/home`
2. **Veja os Pacientes:** `http://localhost:5173/_doctor/patients`
3. **Acesse a Agenda:** `http://localhost:5173/_doctor/schedule`
4. **Mande Mensagens:** `http://localhost:5173/_doctor/messages`

---

## 💡 Dicas Úteis

- Se precisar criar outro médico, mude o email e nome
- Para redefinir a senha de qualquer médico, atualize o campo `senha` com um novo hash bcrypt
- Você pode criar múltiplos médicos com este mesmo processo
- O token JWT expira, então não há problema em fazer logout e entrar novamente

---

## 📞 Precisando de Ajuda?

Se ainda tiver problemas:
1. Verifique se o backend está rodando
2. Verifique se o banco de dados está rodando
3. Verifique os logs do backend para mensagens de erro
4. Confirme que o email e senha estão **exatamente** como especificado

---

**Arquivo de Script SQL:** `CRIAR-MEDICO-TESTE.sql`
