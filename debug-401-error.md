# Debug do Erro 401 (Unauthorized)

## O que significa 401?

O erro 401 significa que o backend:
1. ✓ Está funcionando (respondeu à requisição)
2. ✓ Recebeu os dados (email e senha)
3. ✗ Rejeitou as credenciais (usuário não existe OU senha incorreta)

## Passo a Passo para Resolver

### PASSO 1: Verificar se o usuário existe no banco

Execute este SQL no PostgreSQL:

```sql
-- Verificação completa do usuário
SELECT
    id,
    nome,
    email,
    perfil,
    ativo,
    cpf,
    telefone,
    LENGTH(senha) as tamanho_senha,
    SUBSTRING(senha, 1, 15) as inicio_senha,
    criado_em
FROM usuarios
WHERE email = 'medico@clinica.com';
```

**O que você deve ver:**
- Deve retornar 1 linha
- `perfil`: `MEDICO` (tudo maiúsculo)
- `ativo`: `true` ou `t`
- `tamanho_senha`: `60`
- `inicio_senha`: `$2b$10$` ou `$2a$10$`

**Se não retornar nada ou estiver diferente:**
Execute o SQL de criação:

```sql
-- Deleta se existir
DELETE FROM usuarios WHERE email = 'medico@clinica.com';

-- Cria o usuário
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

-- Verifica se foi criado
SELECT id, nome, email, perfil, ativo FROM usuarios WHERE email = 'medico@clinica.com';
```

### PASSO 2: Testar login via CURL (terminal)

Abra o terminal e execute:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"medico@clinica.com\",\"senha\":\"Medico@123\"}" \
  -v
```

**Anote a resposta completa** e me mostre!

### PASSO 3: Verificar a estrutura da tabela

Execute no PostgreSQL:

```sql
-- Ver a estrutura da tabela
\d usuarios

-- Ou use este SQL
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;
```

Verifique se existe:
- Coluna `email`
- Coluna `senha`
- Coluna `perfil`
- Coluna `ativo`

### PASSO 4: Verificar outros usuários no banco

```sql
-- Ver todos os usuários
SELECT id, nome, email, perfil, ativo FROM usuarios;
```

Isso ajuda a ver se há algum padrão diferente.

### PASSO 5: Testar com Admin (se existir)

Se você tem um usuário admin funcionando, teste fazer login com ele para garantir que o endpoint está ok.

## Possíveis Problemas

### Problema 1: O backend usa outro campo para perfil
Verifique no código do backend se ele compara `perfil`, `role`, `tipo_usuario` ou outro campo.

### Problema 2: O backend valida email de forma diferente
Alguns backends fazem `email.toLowerCase()` antes de buscar. Tente:

```sql
UPDATE usuarios SET email = LOWER(email) WHERE email = 'medico@clinica.com';
```

### Problema 3: O backend tem validações extras
O backend pode estar verificando:
- Se o email está verificado
- Se o usuário completou algum cadastro
- Se tem permissões específicas

## Teste Rápido no Console do Navegador

1. Abra o console (F12)
2. Cole e execute:

```javascript
fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'medico@clinica.com',
    senha: 'Medico@123'
  })
})
.then(async (response) => {
  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Resposta:', data);
  return data;
})
.catch(console.error);
```

3. Me mostre o que apareceu no console!

## O que eu preciso para ajudar melhor

Por favor, me mostre:

1. **Resultado do SELECT do PASSO 1** (verificar se usuário existe)
2. **Resposta completa do CURL do PASSO 2** (incluindo o JSON de erro)
3. **Logs do backend** quando você tenta fazer login
4. **Se possível, o código do backend** que valida o login (arquivo de autenticação)

Com essas informações, consigo identificar exatamente o problema!
