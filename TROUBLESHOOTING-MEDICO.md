# Troubleshooting - Login do Médico

## Problema: "Email ou senha inválidos"

### Passo 1: Verificar se o usuário existe no banco

Execute no PostgreSQL:

```sql
SELECT id, nome, email, perfil, ativo, criado_em
FROM usuarios
WHERE email = 'medico@clinica.com';
```

**Se não retornar nenhum resultado:**
- O usuário não foi criado ainda
- Execute o arquivo `create-doctor-user.sql` no seu banco de dados

**Se retornar um resultado:**
- Vá para o Passo 2

### Passo 2: Verificar o perfil do usuário

O perfil deve ser exatamente `MEDICO` (maiúsculas).

```sql
SELECT perfil FROM usuarios WHERE email = 'medico@clinica.com';
```

**Se o perfil estiver diferente:**
```sql
UPDATE usuarios
SET perfil = 'MEDICO', atualizado_em = NOW()
WHERE email = 'medico@clinica.com';
```

### Passo 3: Verificar se o usuário está ativo

```sql
SELECT ativo FROM usuarios WHERE email = 'medico@clinica.com';
```

**Se ativo = false:**
```sql
UPDATE usuarios
SET ativo = true, atualizado_em = NOW()
WHERE email = 'medico@clinica.com';
```

### Passo 4: Recriar o hash da senha

Se mesmo assim não funcionar, pode ser problema com o hash da senha. Recrie o usuário:

```bash
# Execute o script para gerar novo hash
node create-doctor-user.js
```

Depois execute o SQL gerado no banco.

### Passo 5: Verificar o backend

1. O backend está rodando? Deve estar em `http://localhost:3000`
2. O endpoint de login está funcionando?

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"medico@clinica.com","senha":"Medico@123"}'
```

### Passo 6: Teste com a página de debug

1. Abra o arquivo `test-doctor-login.html` no navegador
2. Clique em "Verificar Backend" para ver se está respondendo
3. Clique em "Testar Login" para ver o erro detalhado

## Solução Rápida: Recriar o Usuário

Se quiser começar do zero:

```sql
-- 1. Deletar o usuário antigo
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

-- 2. Criar novamente com o hash correto
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
);

-- 3. Verificar
SELECT id, nome, email, perfil, ativo FROM usuarios WHERE email = 'medico@clinica.com';
```

## Outras Possíveis Causas

### CORS
Se o erro for de CORS, verifique a configuração do backend.

### Timeout
O backend pode estar demorando para responder. Verifique os logs.

### Hash bcrypt incompatível
Certifique-se de que o backend está usando bcrypt com 10 rounds (padrão).

## Teste Manual com Console do Navegador

Abra o console do navegador (F12) e execute:

```javascript
fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'medico@clinica.com',
    senha: 'Medico@123'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

Veja a resposta no console para mais detalhes do erro.

## Contato

Se nada disso resolver, verifique:
1. Logs do backend
2. Configuração de variáveis de ambiente (.env)
3. Conexão com o banco de dados
